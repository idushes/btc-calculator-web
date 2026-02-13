import React, { useState, useRef, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Device } from "../../hooks/useCalculator";
import { ChevronDown } from "lucide-react";

const PRESET_DEVICES: Device[] = [
  { name: "Antminer S21 XP Hyd.", efficiency: 12.0 },
  { name: "Antminer S21 XP", efficiency: 13.5 },
  { name: "Antminer S21 Hyd.", efficiency: 16.0 },
  { name: "Antminer S21+", efficiency: 17.0 },
  { name: "Antminer S21", efficiency: 17.5 },
  { name: "Whatsminer M60S", efficiency: 18.5 },
  { name: "Antminer T21", efficiency: 19.5 },
  { name: "Antminer S19 XP Hyd.", efficiency: 20.0 },
  { name: "Antminer S19 XP", efficiency: 21.5 },
  { name: "Whatsminer M50S+", efficiency: 22.0 },
  { name: "Whatsminer M56S+", efficiency: 22.0 },
  { name: "Antminer S19k Pro", efficiency: 23.0 },
  { name: "Antminer S19j Pro+", efficiency: 27.5 },
];

interface DeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  device: Device;
  setDevice: (device: Device) => void;
  title: string;
}

export const DeviceModal: React.FC<DeviceModalProps> = ({ 
  isOpen, onClose, onReset, device, setDevice, title 
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(() => !PRESET_DEVICES.some(p => p.name === device.name));
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsCustomMode(!PRESET_DEVICES.some(p => p.name === device.name));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (preset: Device | null) => {
    if (preset) {
      setDevice({ ...preset });
      setIsCustomMode(false);
    } else {
      setDevice({ name: "", efficiency: device.efficiency });
      setIsCustomMode(true);
    }
    setDropdownOpen(false);
  };

  return (
    <Modal title={title} onClose={onClose} onReset={onReset}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs text-zinc-400">Device</label>
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full px-3 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>{!isCustomMode ? device.name : (device.name || "Custom...")}</span>
              <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                {PRESET_DEVICES.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleSelect(p)}
                    className={`w-full px-3 py-2.5 text-left text-sm transition-colors flex justify-between items-center ${
                      device.name === p.name
                        ? 'bg-orange-500/10 text-orange-500'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className="text-xs text-zinc-500 font-mono">{p.efficiency} W/Th</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleSelect(null)}
                  className={`w-full px-3 py-2.5 text-left text-sm transition-colors border-t border-zinc-800 ${
                    isCustomMode
                      ? 'bg-orange-500/10 text-orange-500'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  Custom...
                </button>
              </div>
            )}
          </div>
        </div>
        {isCustomMode && (
          <div className="space-y-2">
            <label className="text-xs text-zinc-400">Custom Name</label>
            <input
              type="text"
              value={device.name}
              onChange={(e) => setDevice({ ...device, name: e.target.value })}
              className="w-full px-3 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
              placeholder="Device name"
              autoComplete="off"
            />
          </div>
        )}
        <div className="space-y-2">
          <label className="text-xs text-zinc-400">Efficiency (W/Th)</label>
          <input
            type="number"
            step="0.1"
            value={device.efficiency}
            onChange={(e) => setDevice({ ...device, efficiency: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors font-mono"
          />
        </div>
      </div>
    </Modal>
  );
};
