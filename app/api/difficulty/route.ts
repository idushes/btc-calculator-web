export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CACHE_TTL_MS = 12 * 60 * 60 * 1000;
const DIFFICULTY_FETCH_TIMEOUT_MS = 5000;
const DIFFICULTY_ESTIMATE_MAX_ATTEMPTS = 3;
const DIFFICULTY_ESTIMATE_BLOCK_TOLERANCE = 3;

type CurrentDifficultySource = "mempool" | "blockchain";
type CacheStatus = "hit" | "fresh" | "stale";

type MempoolHashrateResponse = {
  currentDifficulty?: number;
};

type MempoolDifficultyAdjustmentResponse = {
  difficultyChange?: number;
  remainingBlocks?: number;
  nextRetargetHeight?: number;
  estimatedRetargetDate?: number;
};

type CurrentDifficultyCache = {
  value: number;
  source: CurrentDifficultySource;
  cachedAt: number;
};

type NextDifficultyEstimateCache = {
  nextDifficultyT: string;
  changePercent: number;
  estimatedRetargetDate?: number;
  cachedAt: number;
};

type DifficultyMemoryCache = {
  current?: CurrentDifficultyCache;
  estimate?: NextDifficultyEstimateCache;
};

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const getMemoryCache = () => {
  const globalCache = globalThis as typeof globalThis & {
    btcDifficultyCache?: DifficultyMemoryCache;
  };

  if (!globalCache.btcDifficultyCache) {
    globalCache.btcDifficultyCache = {};
  }

  return globalCache.btcDifficultyCache;
};

const isFresh = (cachedAt: number) => Date.now() - cachedAt < CACHE_TTL_MS;

const withCacheBuster = (url: string, attempt = 0) =>
  `${url}?_=${Date.now()}-${attempt}`;

const fetchWithTimeout = async (url: string): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DIFFICULTY_FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`${url} returned ${res.status} ${res.statusText}`);
    }

    return res;
  } finally {
    clearTimeout(timeoutId);
  }
};

const fetchMempoolDifficulty = async (): Promise<number> => {
  const res = await fetchWithTimeout(
    withCacheBuster("https://mempool.space/api/v1/mining/hashrate/1m")
  );
  const data = (await res.json()) as MempoolHashrateResponse;

  if (!isFiniteNumber(data.currentDifficulty)) {
    throw new Error("mempool.space response does not include currentDifficulty");
  }

  return data.currentDifficulty;
};

const fetchBlockchainInfoDifficulty = async (): Promise<number> => {
  const res = await fetchWithTimeout("https://blockchain.info/q/getdifficulty");
  const difficulty = Number(await res.text());

  if (!Number.isFinite(difficulty)) {
    throw new Error("blockchain.info response is not a valid difficulty value");
  }

  return difficulty;
};

const fetchCurrentDifficulty = async (): Promise<{
  value: number;
  source: CurrentDifficultySource;
}> => {
  try {
    return {
      value: await fetchMempoolDifficulty(),
      source: "mempool",
    };
  } catch (mempoolError) {
    console.warn("[Difficulty] mempool.space fetch failed, using fallback:", mempoolError);

    return {
      value: await fetchBlockchainInfoDifficulty(),
      source: "blockchain",
    };
  }
};

const fetchMempoolBlockHeight = async (): Promise<number> => {
  const res = await fetchWithTimeout(
    withCacheBuster("https://mempool.space/api/blocks/tip/height")
  );
  const blockHeight = Number(await res.text());

  if (!Number.isInteger(blockHeight)) {
    throw new Error("mempool.space response is not a valid block height");
  }

  return blockHeight;
};

const fetchBlockchainInfoBlockHeight = async (): Promise<number> => {
  const res = await fetchWithTimeout("https://blockchain.info/q/getblockcount");
  const blockHeight = Number(await res.text());

  if (!Number.isInteger(blockHeight)) {
    throw new Error("blockchain.info response is not a valid block height");
  }

  return blockHeight;
};

const fetchCurrentBlockHeight = async () => {
  try {
    return await fetchBlockchainInfoBlockHeight();
  } catch (blockchainError) {
    console.warn("[Difficulty] blockchain.info block height fetch failed:", blockchainError);
    return fetchMempoolBlockHeight();
  }
};

const fetchMempoolDifficultyAdjustment = async (
  attempt: number
): Promise<MempoolDifficultyAdjustmentResponse & { difficultyChange: number }> => {
  const res = await fetchWithTimeout(
    withCacheBuster("https://mempool.space/api/v1/difficulty-adjustment", attempt)
  );
  const data = (await res.json()) as MempoolDifficultyAdjustmentResponse;

  if (!isFiniteNumber(data.difficultyChange)) {
    throw new Error("mempool.space response does not include difficultyChange");
  }

  return { ...data, difficultyChange: data.difficultyChange };
};

const isDifficultyAdjustmentSynced = (
  data: MempoolDifficultyAdjustmentResponse,
  currentBlockHeight: number
) => {
  if (!isFiniteNumber(data.nextRetargetHeight) || !isFiniteNumber(data.remainingBlocks)) {
    return true;
  }

  const expectedRemainingBlocks = Math.max(0, data.nextRetargetHeight - currentBlockHeight);

  return (
    Math.abs(expectedRemainingBlocks - data.remainingBlocks) <=
    DIFFICULTY_ESTIMATE_BLOCK_TOLERANCE
  );
};

const fetchNextDifficultyEstimate = async (
  currentDifficulty: number
): Promise<Omit<NextDifficultyEstimateCache, "cachedAt">> => {
  let currentBlockHeight: number | null = null;

  try {
    currentBlockHeight = await fetchCurrentBlockHeight();
  } catch (heightError) {
    console.warn("[Difficulty] block height fetch failed, cannot validate estimate:", heightError);
  }

  for (let attempt = 0; attempt < DIFFICULTY_ESTIMATE_MAX_ATTEMPTS; attempt += 1) {
    const data = await fetchMempoolDifficultyAdjustment(attempt);

    if (currentBlockHeight === null || isDifficultyAdjustmentSynced(data, currentBlockHeight)) {
      return {
        nextDifficultyT: (
          (currentDifficulty * (1 + data.difficultyChange / 100)) /
          1e12
        ).toFixed(2),
        changePercent: data.difficultyChange,
        estimatedRetargetDate: data.estimatedRetargetDate,
      };
    }
  }

  throw new Error("mempool.space difficulty adjustment response is stale");
};

const getCachedOrFreshDifficulty = async (): Promise<{
  current: CurrentDifficultyCache;
  status: CacheStatus;
}> => {
  const cache = getMemoryCache();

  if (cache.current && isFresh(cache.current.cachedAt)) {
    return { current: cache.current, status: "hit" };
  }

  try {
    const fresh = await fetchCurrentDifficulty();
    cache.current = { ...fresh, cachedAt: Date.now() };
    return { current: cache.current, status: "fresh" };
  } catch (error) {
    if (cache.current) {
      console.warn("[Difficulty] current difficulty refresh failed, using stale cache:", error);
      return { current: cache.current, status: "stale" };
    }

    throw error;
  }
};

const getCachedOrFreshEstimate = async (
  currentDifficulty: number,
  allowRefresh: boolean
): Promise<{
  estimate?: NextDifficultyEstimateCache;
  status: CacheStatus | "unavailable";
}> => {
  const cache = getMemoryCache();

  if (cache.estimate && isFresh(cache.estimate.cachedAt)) {
    return { estimate: cache.estimate, status: "hit" };
  }

  if (!allowRefresh) {
    return { status: "unavailable" };
  }

  try {
    const fresh = await fetchNextDifficultyEstimate(currentDifficulty);
    cache.estimate = { ...fresh, cachedAt: Date.now() };
    return { estimate: cache.estimate, status: "fresh" };
  } catch (error) {
    console.warn("[Difficulty] next retarget estimate fetch failed:", error);
    return { status: "unavailable" };
  }
};

export async function GET() {
  try {
    const { current, status: currentCacheStatus } = await getCachedOrFreshDifficulty();
    const canRefreshEstimate = current.source === "mempool";
    const { estimate, status: estimateCacheStatus } =
      await getCachedOrFreshEstimate(current.value, canRefreshEstimate);

    return Response.json(
      {
        currentDifficulty: current.value,
        currentDifficultyT: (current.value / 1e12).toFixed(2),
        currentDifficultySource: current.source,
        currentDifficultyCachedAt: current.cachedAt,
        currentDifficultyCacheStatus: currentCacheStatus,
        nextDifficultyT: estimate?.nextDifficultyT,
        changePercent: estimate?.changePercent,
        estimatedRetargetDate: estimate?.estimatedRetargetDate,
        estimateCachedAt: estimate?.cachedAt,
        estimateCacheStatus,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("[Difficulty] failed to resolve difficulty:", error);

    return Response.json(
      { error: "Failed to fetch difficulty" },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
