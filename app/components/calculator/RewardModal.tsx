import React from "react";
import { Modal } from "../ui/Modal";

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockReward: number | string;
  setBlockReward: (value: number | string) => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  isOpen, onClose, blockReward, setBlockReward
}) => {
  if (!isOpen) return null;

  const options = [
    { value: 50, label: "2009-2012" },
    { value: 25, label: "2012-2016" },
    { value: 12.5, label: "2016-2020" },
    { value: 6.25, label: "2020-2024" },
    { value: 3.125, label: "2024-2028" },
    { value: 1.5625, label: "2028-2032" },
    { value: 0.78125, label: "2032-2036" },
    { value: 0.390625, label: "2036-2040" },
  ];

  return (
    <Modal title="Select Halving Era" onClose={onClose} hideFooter={true}>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              setBlockReward(option.value);
              onClose();
            }}
            className={`p-3 rounded-xl text-left transition-all border ${
              Number(blockReward) === option.value
                ? "bg-orange-500/10 border-orange-500/50 text-orange-500"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-700 hover:text-white"
            }`}
          >
            <div className="text-sm font-bold font-mono">{option.value}</div>
            <div className="text-[10px] opacity-60 font-medium">{option.label}</div>
          </button>
        ))}
      </div>
      <p className="text-[10px] text-zinc-500 text-center px-4">
        Select the block reward corresponding to the Bitcoin halving era you want to simulate.
      </p>
    </Modal>
  );
};
