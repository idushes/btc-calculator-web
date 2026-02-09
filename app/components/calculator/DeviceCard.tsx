import React from "react";
import { Edit2 } from "lucide-react";
import { Device } from "../../hooks/useCalculator";

interface DeviceCardProps {
  device: Device;
  price: number;
  onEdit: () => void;
  isSecondary?: boolean;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, price, onEdit, isSecondary }) => {
  return (
    <div className={`relative overflow-hidden group p-4 rounded-2xl bg-zinc-950 border border-zinc-800 transition-all ${
        isSecondary ? 'hover:border-zinc-700' : 'hover:border-orange-500/30'
    }`}>
      <div className="flex justify-between items-center relative z-10">
        <div 
            className="cursor-pointer group/title"
            onClick={onEdit}
            title={`Edit ${device.name}`}
        >
          <div className={`text-zinc-400 font-medium mb-1 flex items-center gap-2 transition-colors ${
              isSecondary ? 'group-hover/title:text-white' : 'group-hover/title:text-orange-500'
          }`}>
            {device.name} <Edit2 className="w-3 h-3 opacity-0 group-hover/title:opacity-100 transition-opacity" />
          </div>
          <div className="text-xs text-zinc-600 font-mono">{device.efficiency} W/Th</div>
        </div>
        <div className={`text-3xl font-bold font-mono ${
            isSecondary ? 'text-zinc-300' : 'text-white'
        }`}>
          ${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </div>
      </div>
      {!isSecondary && (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
    </div>
  );
};
