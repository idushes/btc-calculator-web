"use client";

import React, { useState, useEffect } from "react";
import { Calculator as CalcIcon, Zap, Server, ExternalLink, Info, X, Edit2, RotateCcw } from "lucide-react";

// Generic generic Modal Component
const Modal = ({ title, children, onClose, onReset }: { title: string, children: React.ReactNode, onClose: () => void, onReset?: () => void }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm rounded-3xl" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
  }}>
    <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Edit2 className="w-4 h-4 text-orange-500" /> {title}
        </h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-zinc-900 rounded-full transition-colors text-zinc-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-6">
        {children}
        <div className="flex gap-3 pt-2">
          {onReset && (
              <button
              onClick={onReset}
              className="flex-1 px-4 py-2 text-xs font-medium text-zinc-400 bg-zinc-900 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
              <RotateCcw className="w-3 h-3" /> Reset
              </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-xs font-bold text-black bg-white hover:bg-zinc-200 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default function Calculator() {
  // Default values
  const DEFAULT_ELEC_COST = 0.06;
  const DEFAULT_DIFFICULTY = 125.86; // Trillions
  const DEFAULT_BLOCK_REWARD = 3.125;
  const J_TO_KWH = 3.6e6;

  const DEFAULT_DEVICE_1 = { name: "Antminer S21+", efficiency: 17.0 };
  const DEFAULT_DEVICE_2 = { name: "Antminer T21", efficiency: 19.5 };

  // State
  const [elecCost, setElecCost] = useState<number | string>(DEFAULT_ELEC_COST);
  const [difficulty, setDifficulty] = useState<number | string>(DEFAULT_DIFFICULTY);
  const [blockReward, setBlockReward] = useState<number | string>(DEFAULT_BLOCK_REWARD);
  
  const [device1, setDevice1] = useState(DEFAULT_DEVICE_1);
  const [device2, setDevice2] = useState(DEFAULT_DEVICE_2);
  
  // Modal State: 'device1', 'device2', 'reward', or null
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedElecCost = localStorage.getItem("btc_calc_elec_cost");
    const savedDifficulty = localStorage.getItem("btc_calc_difficulty");
    const savedBlockReward = localStorage.getItem("btc_calc_block_reward");
    const savedDevice1 = localStorage.getItem("btc_calc_device1");
    const savedDevice2 = localStorage.getItem("btc_calc_device2");

    if (savedElecCost) setElecCost(savedElecCost);
    if (savedDifficulty) setDifficulty(savedDifficulty);
    if (savedBlockReward) setBlockReward(savedBlockReward);
    if (savedDevice1) setDevice1(JSON.parse(savedDevice1));
    if (savedDevice2) setDevice2(JSON.parse(savedDevice2));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("btc_calc_elec_cost", String(elecCost));
  }, [elecCost]);

  useEffect(() => {
    localStorage.setItem("btc_calc_difficulty", String(difficulty));
  }, [difficulty]);

  useEffect(() => {
    localStorage.setItem("btc_calc_block_reward", String(blockReward));
  }, [blockReward]);
  
  useEffect(() => {
    localStorage.setItem("btc_calc_device1", JSON.stringify(device1));
  }, [device1]);

  useEffect(() => {
    localStorage.setItem("btc_calc_device2", JSON.stringify(device2));
  }, [device2]);

  // Derived values for calculation
  const parsedElecCost = Number(elecCost) || 0;
  const parsedDifficulty = Number(difficulty) || 0;
  const parsedBlockReward = Number(blockReward) || 0;

  // Calculation Function
  const calculateFloorPrice = (efficiency: number) => {
    if (parsedBlockReward === 0) return 0;
    
    // Floor Price = (Difficulty * 2^32 * Efficiency * ElecCost) / (BlockReward * 10^12 * 3.6e6)
    const difficultyRaw = parsedDifficulty * 10 ** 12;
    const hashesPerBlock = difficultyRaw * 2 ** 32;
    const energyJoules = hashesPerBlock * (efficiency / 10 ** 12);
    const energyKwh = energyJoules / J_TO_KWH;
    const costPerBlock = energyKwh * parsedElecCost;
    const pricePerBtc = costPerBlock / parsedBlockReward;

    return pricePerBtc;
  };

  const device1Price = calculateFloorPrice(device1.efficiency);
  const device2Price = calculateFloorPrice(device2.efficiency);

  const resetDevice1 = () => setDevice1(DEFAULT_DEVICE_1);
  const resetDevice2 = () => setDevice2(DEFAULT_DEVICE_2);
  const resetReward = () => setBlockReward(DEFAULT_BLOCK_REWARD);



  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl relative">
      
      {/* Device 1 Modal */}
      {activeModal === 'device1' && (
        <Modal title="Edit Device 1" onClose={() => setActiveModal(null)} onReset={resetDevice1}>
            <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400">Name</label>
                  <input
                    type="text"
                    value={device1.name}
                    onChange={(e) => setDevice1({ ...device1, name: e.target.value })}
                    className="w-full px-3 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400">Efficiency (W/Th)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={device1.efficiency}
                    onChange={(e) => setDevice1({ ...device1, efficiency: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors font-mono"
                  />
                </div>
            </div>
        </Modal>
      )}

      {/* Device 2 Modal */}
      {activeModal === 'device2' && (
        <Modal title="Edit Device 2" onClose={() => setActiveModal(null)} onReset={resetDevice2}>
            <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400">Name</label>
                  <input
                    type="text"
                    value={device2.name}
                    onChange={(e) => setDevice2({ ...device2, name: e.target.value })}
                    className="w-full px-3 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-zinc-700 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400">Efficiency (W/Th)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={device2.efficiency}
                    onChange={(e) => setDevice2({ ...device2, efficiency: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-zinc-700 transition-colors font-mono"
                  />
                </div>
            </div>
        </Modal>
      )}

      {/* Block Reward Modal */}
      {activeModal === 'reward' && (
        <Modal title="Select Halving Era" onClose={() => setActiveModal(null)} onReset={resetReward}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 50, label: "2009-2012" },
                { value: 25, label: "2012-2016" },
                { value: 12.5, label: "2016-2020" },
                { value: 6.25, label: "2020-2024" },
                { value: 3.125, label: "2024-2028" },
                { value: 1.5625, label: "2028-2032" },
                { value: 0.78125, label: "2032-2036" },
                { value: 0.390625, label: "2036-2040" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setBlockReward(option.value)}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    Number(blockReward) === option.value
                      ? "bg-orange-500/10 border-orange-500/50 text-orange-500"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  <div className="text-sm font-bold font-mono">{option.value}</div>
                  <div className="text-[10px] opacity-60 font-medium">{option.label}</div>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-zinc-500 text-center px-4">
              Select the block reward corresponding to the Bitcoin halving era you want to simulate.
            </p>
        </Modal>
      )}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-zinc-800/50 rounded-xl">
            <CalcIcon className="w-6 h-6 text-zinc-600" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Bitcoin Mining Cost Theory
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Formula Tooltip */}
          <div className="relative">
            <button 
                className="p-2 cursor-help focus:outline-none"
                onClick={() => setShowTooltip(!showTooltip)}
                onBlur={() => setTimeout(() => setShowTooltip(false), 200)}
            >
              <Info className={`w-5 h-5 transition-colors ${showTooltip ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`} />
            </button>
            <div className={`absolute right-0 top-10 w-80 md:w-96 p-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl transition-all z-50 ${showTooltip ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
              <h4 className="text-sm font-medium text-white mb-2">Calculation Formula</h4>
              <div className="text-xs font-mono text-zinc-400 bg-black/50 p-3 rounded-lg mb-2 overflow-x-auto whitespace-nowrap">
                (Diff × 2<sup className="text-[10px]">32</sup> × Eff × Cost) / (Reward × 10<sup className="text-[10px]">12</sup> × 3.6M)
              </div>
              <ul className="text-xs text-zinc-500 space-y-1">
                <li>• Diff: Network Difficulty (T)</li>
                <li>• Eff: Miner Efficiency (W/Th)</li>
                <li>• Cost: Electricity ($/kWh)</li>
                <li>• Reward: Block Reward (BTC)</li>
              </ul>
            </div>
          </div>
        </div>
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
            <input
              type="number"
              step="0.01"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all font-mono text-lg"
              placeholder="125.86"
            />
            <button
              onClick={() => setDifficulty(d => (Number(d) * 0.99).toFixed(2))}
              className="px-3 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-600 transition-all font-mono text-sm"
              title="Decrease by 1%"
            >
              -1%
            </button>
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
        
        {/* Device 1 Card */}
        <div className="relative overflow-hidden group p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-orange-500/30 transition-all">
          <div className="flex justify-between items-center relative z-10">
            <div 
                className="cursor-pointer group/title"
                onClick={() => setActiveModal('device1')}
                title="Edit Device 1"
            >
              <div className="text-zinc-400 font-medium mb-1 flex items-center gap-2 group-hover/title:text-orange-500 transition-colors">
                {device1.name} <Edit2 className="w-3 h-3 opacity-0 group-hover/title:opacity-100 transition-opacity" />
              </div>
              <div className="text-xs text-zinc-600 font-mono">{device1.efficiency} W/Th</div>
            </div>
            <div className="text-3xl font-bold text-white font-mono">
              ${device1Price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Device 2 Card */}
        <div className="relative overflow-hidden group p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all">
          <div className="flex justify-between items-center relative z-10">
            <div 
                className="cursor-pointer group/title"
                onClick={() => setActiveModal('device2')}
                title="Edit Device 2"
            >
              <div className="text-zinc-400 font-medium mb-1 flex items-center gap-2 group-hover/title:text-white transition-colors">
                {device2.name} <Edit2 className="w-3 h-3 opacity-0 group-hover/title:opacity-100 transition-opacity" />
              </div>
              <div className="text-xs text-zinc-600 font-mono">{device2.efficiency} W/Th</div>
            </div>
            <div className="text-3xl font-bold text-zinc-300 font-mono">
              ${device2Price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-center">
        <div 
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition-all group"
          onClick={() => setActiveModal('reward')}
          title="Change Block Reward"
        >
          <span className="text-xs text-zinc-500">Block Reward:</span>
          <span className="text-xs font-mono font-bold text-zinc-300 group-hover:text-white transition-colors border-b border-dashed border-zinc-700 group-hover:border-orange-500">
            {parsedBlockReward} BTC
          </span>
        </div>
      </div>
    </div>
  );
}
