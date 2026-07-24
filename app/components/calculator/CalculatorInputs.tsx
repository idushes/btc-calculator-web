import React, { useState } from "react";
import { Zap, Server, RefreshCw, ExternalLink } from "lucide-react";

interface CalculatorInputsProps {
  elecCost: number | string;
  setElecCost: (value: number | string) => void;
  difficulty: number | string;
  setDifficulty: (value: number | string) => void;
}

type NextDifficultyEstimate = {
  nextDifficultyT: string;
  changePercent: number;
  retargetTimeLabel?: string;
};

type DifficultyApiResponse = {
  currentDifficulty?: number;
  currentDifficultyT?: string;
  nextDifficultyT?: string;
  changePercent?: number;
  estimatedRetargetDate?: number;
};

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const formatLocalRetargetTime = (timestamp: unknown) => {
  if (!isFiniteNumber(timestamp)) return undefined;

  const normalizedTimestamp = timestamp < 1e12 ? timestamp * 1000 : timestamp;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const dateTime = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(normalizedTimestamp));

  return timeZone ? `${dateTime} (${timeZone})` : dateTime;
};

const fetchDifficultyData = async () => {
  const res = await fetch("/api/difficulty", { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`/api/difficulty returned ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as DifficultyApiResponse;
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
      const data = await fetchDifficultyData();
      const diffInTrillions =
        data.currentDifficultyT ??
        (isFiniteNumber(data.currentDifficulty)
          ? (data.currentDifficulty / 1e12).toFixed(2)
          : null);

      if (diffInTrillions === null) {
        throw new Error("/api/difficulty response does not include current difficulty");
      }
      setDifficulty(diffInTrillions);

      if (data.nextDifficultyT && isFiniteNumber(data.changePercent)) {
        setNextDifficultyEstimate({
          nextDifficultyT: data.nextDifficultyT,
          changePercent: data.changePercent,
          retargetTimeLabel: formatLocalRetargetTime(data.estimatedRetargetDate),
        });
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
            href="https://mempool.space/graphs/mining/hashrate-difficulty#3y"
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
          <div className="space-y-1 text-[11px] text-zinc-500">
            <div className="flex items-center justify-between gap-2">
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
            {nextDifficultyEstimate.retargetTimeLabel && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
                <span>Next retarget time</span>
                <span className="font-mono text-zinc-400 sm:text-right break-words">
                  {nextDifficultyEstimate.retargetTimeLabel}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
