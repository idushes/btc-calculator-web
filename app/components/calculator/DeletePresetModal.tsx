import React from "react";
import { Modal } from "../ui/Modal";
import { AlertTriangle } from "lucide-react";

interface DeletePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  presetName: string;
}

export const DeletePresetModal: React.FC<DeletePresetModalProps> = ({
  isOpen, onClose, onDelete, presetName,
}) => {
  if (!isOpen) return null;

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Modal title="Delete Preset" onClose={onClose} hideFooter>
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-zinc-300">
            Delete <span className="font-bold text-white">&ldquo;{presetName}&rdquo;</span>? 
            All settings will be reset to defaults.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-xs font-medium text-zinc-400 bg-zinc-900 hover:bg-zinc-800 hover:text-white rounded-lg transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};
