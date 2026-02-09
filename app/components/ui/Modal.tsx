import React from "react";
import { Edit2, X, RotateCcw } from "lucide-react";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onReset?: () => void;
  hideFooter?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ title, children, onClose, onReset, hideFooter }) => (
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
        {!hideFooter && (
            <div className="flex gap-3 pt-2">
            {onReset && (
                <button
                onClick={onReset}
                className="flex-1 px-4 py-2 text-xs font-medium text-zinc-400 bg-zinc-900 hover:bg-zinc-800 hover:text-white rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                <RotateCcw className="w-3 h-3" /> Reset
                </button>
            )}
            <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-xs font-bold text-black bg-white hover:bg-zinc-200 rounded-lg transition-all active:scale-95"
            >
                Done
            </button>
            </div>
        )}
      </div>
    </div>
  </div>
);
