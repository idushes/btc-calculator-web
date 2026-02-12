import React, { useState } from "react";
import { Modal } from "../ui/Modal";

interface SavePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  maxLength: number;
}

export const SavePresetModal: React.FC<SavePresetModalProps> = ({
  isOpen, onClose, onSave, maxLength,
}) => {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = name.trim();
    if (trimmed) {
      onSave(trimmed);
      setName("");
      onClose();
    }
  };

  return (
    <Modal title="Save Preset" onClose={onClose} hideFooter>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs text-zinc-400">Preset Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, maxLength))}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="w-full px-3 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
            placeholder="e.g. Texas Farm $0.04"
            maxLength={maxLength}
            autoFocus
          />
          <div className="text-right text-[10px] text-zinc-600 font-mono">
            {name.length}/{maxLength}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-xs font-medium text-zinc-400 bg-zinc-900 hover:bg-zinc-800 hover:text-white rounded-lg transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 px-4 py-2 text-xs font-bold text-black bg-white hover:bg-zinc-200 rounded-lg transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};
