import React from "react";
import { Modal } from "../ui/Modal";
import { Device } from "../../hooks/useCalculator";

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
  if (!isOpen) return null;

  return (
    <Modal title={title} onClose={onClose} onReset={onReset}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs text-zinc-400">Name</label>
          <input
            type="text"
            value={device.name}
            onChange={(e) => setDevice({ ...device, name: e.target.value })}
            className="w-full px-3 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
          />
        </div>
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
