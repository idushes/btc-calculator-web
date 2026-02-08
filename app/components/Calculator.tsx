"use client";

import React, { useState, useEffect } from "react";
import { Calculator as CalcIcon, Zap, Server, ExternalLink } from "lucide-react";

export default function Calculator() {
  // Default values
  const DEFAULT_ELEC_COST = 0.06;
  const DEFAULT_DIFFICULTY = 125.86; // Trillions
  const BLOCK_REWARD = 3.125;
  const HASHRATE_MULTIPLIER = 1e12; // T to H
  const J_TO_KWH = 3.6e6;

  // State
  const [elecCost, setElecCost] = useState<number | string>(DEFAULT_ELEC_COST);
  const [difficulty, setDifficulty] = useState<number | string>(DEFAULT_DIFFICULTY);

  // Load from localStorage on mount
  useEffect(() => {
    const savedElecCost = localStorage.getItem("btc_calc_elec_cost");
    const savedDifficulty = localStorage.getItem("btc_calc_difficulty");

    if (savedElecCost) setElecCost(savedElecCost);
    if (savedDifficulty) setDifficulty(savedDifficulty);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("btc_calc_elec_cost", String(elecCost));
  }, [elecCost]);

  useEffect(() => {
    localStorage.setItem("btc_calc_difficulty", String(difficulty));
  }, [difficulty]);

  // Derived values for calculation
  const parsedElecCost = Number(elecCost) || 0;
  const parsedDifficulty = Number(difficulty) || 0;

  // Efficiency (W/Th)
  const EFFICIENCY_S21_PLUS = 17.0;
  const EFFICIENCY_T21 = 19.5;

  // Calculation Function
  const calculateFloorPrice = (efficiency: number) => {
    // Floor Price = (Difficulty * 2^32 * Efficiency * ElecCost) / (BlockReward * 10^12 * 3.6e6)
    // Simplified:
    // Difficulty (T) * 10^12 * 2^32 = Total Hashes
    // Energy (J) = Total Hashes * (Efficiency (W/Th) / 10^12)
    // Energy (kWh) = Energy (J) / 3.6e6
    // Cost = Energy (kWh) * ElecCost
    // Price per BTC = Cost / BlockReward

    const difficultyRaw = parsedDifficulty * 10 ** 12;
    const hashesPerBlock = difficultyRaw * 2 ** 32;
    const energyJoules = hashesPerBlock * (efficiency / 10 ** 12);
    const energyKwh = energyJoules / J_TO_KWH;
    const costPerBlock = energyKwh * parsedElecCost;
    const pricePerBtc = costPerBlock / BLOCK_REWARD;

    return pricePerBtc;
  };

  const s21PlusPrice = calculateFloorPrice(EFFICIENCY_S21_PLUS);
  const t21Price = calculateFloorPrice(EFFICIENCY_T21);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-500/10 rounded-xl">
          <CalcIcon className="w-6 h-6 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Theory of Energy Floor
        </h2>
      </div>

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
            <button
              onClick={() => setDifficulty(d => (Number(d) * 0.99).toFixed(2))}
              className="px-3 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-600 transition-all font-mono text-sm"
              title="Decrease by 1%"
            >
              -1%
            </button>
            <input
              type="number"
              step="0.01"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all font-mono text-lg"
              placeholder="125.86"
            />
            <button
              onClick={() => setDifficulty(d => (Number(d) * 1.01).toFixed(2))}
              className="px-3 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-600 transition-all font-mono text-sm"
              title="Increase by 1%"
            >
              +1%
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">
          Estimated Production Cost (1 BTC)
        </h3>
        
        {/* S21+ Card */}
        <div className="relative overflow-hidden group p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-orange-500/30 transition-all">
          <div className="flex justify-between items-center relative z-10">
            <div>
              <div className="text-zinc-400 font-medium mb-1">Antminer S21+</div>
              <div className="text-xs text-zinc-600 font-mono">17.0 W/Th</div>
            </div>
            <div className="text-3xl font-bold text-white font-mono">
              ${s21PlusPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* T21 Card */}
        <div className="relative overflow-hidden group p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all">
          <div className="flex justify-between items-center relative z-10">
            <div>
              <div className="text-zinc-400 font-medium mb-1">Antminer T21</div>
              <div className="text-xs text-zinc-600 font-mono">19.5 W/Th</div>
            </div>
            <div className="text-3xl font-bold text-zinc-300 font-mono">
              ${t21Price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
        <p className="text-xs text-zinc-600">
          Block Reward: <span className="text-zinc-400 font-mono">{BLOCK_REWARD} BTC</span> • Fixed
        </p>
      </div>
    </div>
  );
}
