import React, { useState } from "react";
import { Zap, Server, RefreshCw, ExternalLink } from "lucide-react";

interface CalculatorInputsProps {
  elecCost: number | string;
  setElecCost: (value: number | string) => void;
  difficulty: number | string;
  setDifficulty: (value: number | string) => void;
}

const DIFFICULTY_FETCH_TIMEOUT_MS = 8000;
const DIFFICULTY_ESTIMATE_MAX_ATTEMPTS = 3;
const DIFFICULTY_ESTIMATE_BLOCK_TOLERANCE = 3;

type MempoolHashrateResponse = {
  currentDifficulty?: number;
};

type MempoolDifficultyAdjustmentResponse = {
  difficultyChange?: number;
  remainingBlocks?: number;
  nextRetargetHeight?: number;
};

type MempoolDifficultyAdjustment = MempoolDifficultyAdjustmentResponse & {
  difficultyChange: number;
};

type NextDifficultyEstimate = {
  nextDifficultyT: string;
  changePercent: number;
};

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

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

const fetchMempoolDifficultyAdjustment = async (
  attempt: number
): Promise<MempoolDifficultyAdjustment> => {
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
): Promise<NextDifficultyEstimate> => {
  let currentBlockHeight: number | null = null;

  try {
    currentBlockHeight = await fetchMempoolBlockHeight();
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
      };
    }
  }

  throw new Error("mempool.space difficulty adjustment response is stale");
};

export const CalculatorInputs: React.FC<CalculatorInputsProps> = ({
  elecCost, setElecCost, difficulty, setDifficulty
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [nextDifficultyEstimate, setNextDifficultyEstimate] =
    useState<NextDifficultyEstimate | null>(null);

  const fetchDifficulty = async () => {
    setIsLoading(true);
    setNextDifficultyEstimate(null);
    try {
      let currentDifficulty: number;

      try {
        currentDifficulty = await fetchMempoolDifficulty();
      } catch (primaryError) {
        console.warn("[Difficulty] mempool.space fetch failed, using fallback:", primaryError);
        currentDifficulty = await fetchBlockchainInfoDifficulty();
      }

      const diffInTrillions = (currentDifficulty / 1e12).toFixed(2);
      setDifficulty(diffInTrillions);

      try {
        setNextDifficultyEstimate(await fetchNextDifficultyEstimate(currentDifficulty));
      } catch (estimateError) {
        console.warn("[Difficulty] next retarget estimate fetch failed:", estimateError);
      }
    } catch (err) {
      console.error("[Difficulty] Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-6 mb-8">
      {/* Electricity Cost Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          Electricity Cost ($/kWh)
        </label>
        <div className="relative group">
          <input
            type="number"
            step="0.01"
            value={elecCost}
            onChange={(e) => setElecCost(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all font-mono text-lg"
            placeholder="0.06"
          />
        </div>
      </div>

      {/* Network Difficulty Input */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-500" />
            Network Difficulty (T)
          </label>
          <a
            href="https://www.coinwarz.com/mining/bitcoin/difficulty-chart"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors flex items-center gap-1 border-b border-dashed border-zinc-800 hover:border-zinc-500 pb-px"
          >
            Chart <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
        <div className="relative group flex items-center gap-2">
          <input
            type="number"
            step="0.01"
            value={difficulty}
            onChange={(e) => {
              setNextDifficultyEstimate(null);
              setDifficulty(e.target.value);
            }}
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all font-mono text-lg"
            placeholder="125.86"
          />
          <button
            onClick={() => {
              setNextDifficultyEstimate(null);
              setDifficulty((Number(difficulty) * 0.99).toFixed(2));
            }}
            className="px-3 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-600 transition-all font-mono text-sm"
            title="Decrease by 1%"
          >
            -1%
          </button>
          <button
            onClick={fetchDifficulty}
            disabled={isLoading}
            className="px-3 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-600 transition-all disabled:opacity-50"
            title="Fetch current difficulty"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setNextDifficultyEstimate(null);
              setDifficulty((Number(difficulty) * 1.01).toFixed(2));
            }}
            className="px-3 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-600 transition-all font-mono text-sm"
            title="Increase by 1%"
          >
            +1%
          </button>
        </div>
        {nextDifficultyEstimate && (
          <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-500">
            <span>Est. next retarget</span>
            <button
              type="button"
              onClick={() => {
                setDifficulty(nextDifficultyEstimate.nextDifficultyT);
                setNextDifficultyEstimate(null);
              }}
              className="font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer text-right"
              title="Use estimated difficulty"
              aria-label="Use estimated next difficulty"
            >
              {nextDifficultyEstimate.nextDifficultyT} T
              <span
                className={
                  nextDifficultyEstimate.changePercent >= 0
                    ? "ml-1 text-emerald-400"
                    : "ml-1 text-red-400"
                }
              >
                ({nextDifficultyEstimate.changePercent >= 0 ? "+" : ""}
                {nextDifficultyEstimate.changePercent.toFixed(2)}%)
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
