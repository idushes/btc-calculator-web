import React from "react";
import { Modal } from "../ui/Modal";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  margin: number | string;
  setMargin: (value: number | string) => void;
  onExport: () => void;
  onImport: (file: File) => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, onReset, margin, setMargin, onExport, onImport
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await onImport(file);
        // Optional: Show success message or close modal
        onClose();
      } catch (error) {
        // Optional: Show error message
        console.error(error);
      }
    }
  };

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
        
        <div className="pt-4 border-t border-zinc-800 space-y-3">
          <label className="text-xs text-zinc-400">Data Management</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onExport}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export Settings
            </button>
            <button
              onClick={handleImportClick}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Import Settings
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
