import React from "react";
import { Modal } from "../ui/Modal";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  margin: number | string;
  setMargin: (value: number | string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, onReset, margin, setMargin 
}) => {
  if (!isOpen) return null;

  return (
    <Modal title="Global Settings" onClose={onClose} onReset={onReset}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs text-zinc-400">Profitability Margin (%)</label>
          <p className="text-[10px] text-zinc-500 mb-2">Desired profit margin on top of production cost.</p>
          <div className="relative group">
            <input
              type="number"
              step="1"
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              className="w-full px-3 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors font-mono"
              placeholder="0"
            />
            <div className="absolute right-3 top-3 text-zinc-500 text-sm font-mono">%</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
