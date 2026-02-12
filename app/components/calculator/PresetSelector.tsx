import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Preset } from "../../hooks/usePresets";

interface PresetSelectorProps {
  presets: Preset[];
  activePreset: Preset | null;
  onSelect: (id: string) => void;
  onCreateNew: () => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  presets, activePreset, onSelect, onCreateNew,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (presets.length === 0 && !activePreset) return null;

  const label = activePreset?.name ?? "New preset…";

  return (
    <div className="mb-5 -mt-1">
      <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 cursor-pointer group transition-all"
      >
        <span className={`text-sm truncate max-w-[180px] transition-colors ${
          activePreset
            ? 'text-zinc-500 group-hover:text-zinc-300'
            : 'text-zinc-600 group-hover:text-zinc-400'
        }`}>
          {label}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-all shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-40 left-0 mt-1 min-w-[160px] max-w-[220px] bg-zinc-900/95 backdrop-blur-md border border-zinc-700/50 rounded-lg shadow-2xl overflow-hidden">
          <div className="max-h-40 overflow-y-auto py-0.5">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onSelect(p.id);
                  setOpen(false);
                }}
                className={`w-full px-2.5 py-1.5 text-left text-sm transition-colors truncate ${
                  activePreset?.id === p.id
                    ? 'text-white bg-white/5'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              onCreateNew();
              setOpen(false);
            }}
            className={`w-full px-2.5 py-1.5 text-left text-sm transition-colors flex items-center gap-1.5 border-t border-zinc-700/50 ${
              !activePreset
                ? 'text-zinc-300 bg-white/5'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            <Plus className="w-3 h-3" />
            New preset…
          </button>
        </div>
      )}
      </div>
    </div>
  );
};
