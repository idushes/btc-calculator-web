import React from "react";
import { Zap, Server, ExternalLink } from "lucide-react";

interface CalculatorInputsProps {
  elecCost: number | string;
  setElecCost: (value: number | string) => void;
  difficulty: number | string;
  setDifficulty: (value: number | string) => void;
}

export const CalculatorInputs: React.FC<CalculatorInputsProps> = ({
  elecCost, setElecCost, difficulty, setDifficulty
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
            className="text-xs text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1"
          >
            Check Current <ExternalLink className="w-3 h-3" />
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
