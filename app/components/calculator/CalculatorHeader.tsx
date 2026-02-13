import React, { useState } from "react";
import { Calculator as CalcIcon, Settings, Info, Save, Trash2, Share2, Check, AlertCircle } from "lucide-react";

interface CalculatorHeaderProps {
  onOpenSettings: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  shareStatus?: "idle" | "copied" | "error";
  hasUnsavedState: boolean;
}

export const CalculatorHeader: React.FC<CalculatorHeaderProps> = ({ 
  onOpenSettings, onSave, onDelete, onShare, shareStatus = "idle", hasUnsavedState 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <h2 className="text-base md:text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent whitespace-nowrap">
          BTC Mining Cost
        </h2>
      </div>
      
      <div className="flex items-center gap-1">
        {/* Save or Delete button */}
        {hasUnsavedState ? (
          onSave && (
            <button 
              className="p-2 cursor-pointer focus:outline-none text-zinc-600 hover:text-orange-500 transition-colors"
              onClick={onSave}
              title="Save as preset"
            >
              <Save className="w-5 h-5" />
            </button>
          )
        ) : (
          onDelete && (
            <button 
              className="p-2 cursor-pointer focus:outline-none text-zinc-600 hover:text-red-500 transition-colors"
              onClick={onDelete}
              title="Delete preset"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )
        )}

        {/* Share Button */}
        {onShare && (
          <div className="relative">
            <button 
              className={`p-2 cursor-pointer focus:outline-none transition-colors ${
                shareStatus === "copied" ? "text-green-500" : shareStatus === "error" ? "text-red-500" : "text-zinc-600 hover:text-orange-500"
              }`}
              onClick={onShare}
              title="Share link"
            >
              {shareStatus === "copied" ? (
                <Check className="w-5 h-5" />
              ) : shareStatus === "error" ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
            </button>
          </div>
        )}

        {/* Settings Button */}
        <button 
          className="p-2 cursor-pointer focus:outline-none text-zinc-600 hover:text-white transition-colors"
          onClick={onOpenSettings}
          title="Global Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

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
            
            <div className="mb-3">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Target Price</div>
              <div className="text-xs font-mono text-zinc-300 bg-black/50 p-2 rounded-lg overflow-x-auto whitespace-nowrap border border-zinc-800">
                Production Cost × (1 + Margin%)
              </div>
            </div>

            <div className="mb-3">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Production Cost (1 BTC)</div>
              <div className="text-xs font-mono text-zinc-300 bg-black/50 p-2 rounded-lg overflow-x-auto whitespace-nowrap border border-zinc-800">
                (Diff × 2<sup className="text-[10px]">32</sup> × Eff × Elec) / (Reward × 10<sup className="text-[10px]">12</sup> × 3.6M)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-zinc-500">
              <div>• Diff: Network Difficulty</div>
              <div>• Eff: Efficiency (W/Th)</div>
              <div>• Elec: Cost ($/kWh)</div>
              <div>• Reward: Block Reward</div>
              <div className="col-span-2 text-orange-500/80 mt-1">• 3.6M: Joules to kWh conversion</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
