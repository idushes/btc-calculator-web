import { useState, useEffect } from "react";

export interface Device {
  name: string;
  efficiency: number;
}

export const DEFAULT_ELEC_COST = 0.06;
export const DEFAULT_DIFFICULTY = 125.86; // Trillions
export const DEFAULT_BLOCK_REWARD = 3.125;
export const J_TO_KWH = 3.6e6;
export const DEFAULT_DEVICE_1: Device = { name: "Antminer S21+", efficiency: 17.0 };
export const DEFAULT_DEVICE_2: Device = { name: "Antminer T21", efficiency: 19.5 };
export const DEFAULT_MARGIN = 0;

export const useCalculator = () => {
  // State
  const [elecCost, setElecCost] = useState<number | string>(DEFAULT_ELEC_COST);
  const [difficulty, setDifficulty] = useState<number | string>(DEFAULT_DIFFICULTY);
  const [blockReward, setBlockReward] = useState<number | string>(DEFAULT_BLOCK_REWARD);
  
  const [device1, setDevice1] = useState<Device>(DEFAULT_DEVICE_1);
  const [device2, setDevice2] = useState<Device>(DEFAULT_DEVICE_2);
  const [margin, setMargin] = useState<number | string>(DEFAULT_MARGIN);
  
  // Modal State
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedElecCost = localStorage.getItem("btc_calc_elec_cost");
    const savedDifficulty = localStorage.getItem("btc_calc_difficulty");
    const savedBlockReward = localStorage.getItem("btc_calc_block_reward");
    const savedDevice1 = localStorage.getItem("btc_calc_device1");
    const savedDevice2 = localStorage.getItem("btc_calc_device2");
    const savedMargin = localStorage.getItem("btc_calc_margin");

    if (savedElecCost) setElecCost(savedElecCost);
    if (savedDifficulty) setDifficulty(savedDifficulty);
    if (savedBlockReward) setBlockReward(savedBlockReward);
    if (savedDevice1) setDevice1(JSON.parse(savedDevice1));
    if (savedDevice2) setDevice2(JSON.parse(savedDevice2));
    if (savedMargin) setMargin(savedMargin);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("btc_calc_elec_cost", String(elecCost));
  }, [elecCost]);

  useEffect(() => {
    localStorage.setItem("btc_calc_difficulty", String(difficulty));
  }, [difficulty]);

  useEffect(() => {
    localStorage.setItem("btc_calc_block_reward", String(blockReward));
  }, [blockReward]);
  
  useEffect(() => {
    localStorage.setItem("btc_calc_device1", JSON.stringify(device1));
  }, [device1]);

  useEffect(() => {
    localStorage.setItem("btc_calc_device2", JSON.stringify(device2));
  }, [device2]);

  useEffect(() => {
    localStorage.setItem("btc_calc_margin", String(margin));
  }, [margin]);

  // Derived values for calculation
  const parsedElecCost = Number(elecCost) || 0;
  const parsedDifficulty = Number(difficulty) || 0;
  const parsedBlockReward = Number(blockReward) || 0;
  const parsedMargin = Number(margin) || 0;

  // Calculation Function
  const calculateFloorPrice = (efficiency: number) => {
    if (parsedBlockReward === 0) return 0;
    
    // Floor Price = (Difficulty * 2^32 * Efficiency * ElecCost) / (BlockReward * 10^12 * 3.6e6)
    const difficultyRaw = parsedDifficulty * 10 ** 12;
    const hashesPerBlock = difficultyRaw * 2 ** 32;
    const energyJoules = hashesPerBlock * (efficiency / 10 ** 12);
    const energyKwh = energyJoules / J_TO_KWH;
    const costPerBlock = energyKwh * parsedElecCost;
    const pricePerBtc = costPerBlock / parsedBlockReward;

    // Apply Margin
    const priceWithMargin = pricePerBtc * (1 + parsedMargin / 100);

    return priceWithMargin;
  };

  const device1Price = calculateFloorPrice(device1.efficiency);
  const device2Price = calculateFloorPrice(device2.efficiency);

  const resetDevice1 = () => setDevice1(DEFAULT_DEVICE_1);
  const resetDevice2 = () => setDevice2(DEFAULT_DEVICE_2);
  const resetReward = () => setBlockReward(DEFAULT_BLOCK_REWARD);
  const resetMargin = () => setMargin(DEFAULT_MARGIN);

  return {
    elecCost,
    setElecCost,
    difficulty,
    setDifficulty,
    blockReward,
    setBlockReward,
    device1,
    setDevice1,
    device2,
    setDevice2,
    margin,
    setMargin,
    activeModal,
    setActiveModal,
    parsedBlockReward,
    device1Price,
    device2Price,
    resetDevice1,
    resetDevice2,
    resetReward,
    resetMargin
  };
};
