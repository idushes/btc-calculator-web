import React, { useState } from "react";
import { Zap, Server, RefreshCw, ExternalLink } from "lucide-react";

interface CalculatorInputsProps {
  elecCost: number | string;
  setElecCost: (value: number | string) => void;
  difficulty: number | string;
  setDifficulty: (value: number | string) => void;
}

export const CalculatorInputs: React.FC<CalculatorInputsProps> = ({
  elecCost, setElecCost, difficulty, setDifficulty
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchDifficulty = async () => {
    setIsLoading(true);
    console.log("[Difficulty] Starting fetch...");
    try {
      const res = await fetch("https://mempool.space/api/v1/mining/hashrate/3d");
      console.log("[Difficulty] Response status:", res.status, res.statusText);
      const data = await res.json();
      console.log("[Difficulty] Raw data:", data);
      console.log("[Difficulty] currentDifficulty:", data.currentDifficulty);
      const diffInTrillions = (data.currentDifficulty / 1e12).toFixed(2);
      console.log("[Difficulty] In trillions:", diffInTrillions);
      setDifficulty(diffInTrillions);
    } catch (err) {
      console.error("[Difficulty] Error:", err);
    } finally {
      setIsLoading(false);
      console.log("[Difficulty] Done.");
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
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all font-mono text-lg"
            placeholder="125.86"
          />
          <button
            onClick={() => setDifficulty((Number(difficulty) * 0.99).toFixed(2))}
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
            onClick={() => setDifficulty((Number(difficulty) * 1.01).toFixed(2))}
            className="px-3 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-600 transition-all font-mono text-sm"
            title="Increase by 1%"
          >
            +1%
          </button>
        </div>
      </div>
    </div>
  );
};
