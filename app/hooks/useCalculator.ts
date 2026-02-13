import { useState, useEffect, useCallback } from "react";
import { usePresets, Preset } from "./usePresets";
import { useShareState } from "./useShareState";

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

  // Presets
  const presetsHook = usePresets();

  // Share
  const { shareCurrentState: shareState, shareStatus, sharedState } = useShareState();

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

  // Apply shared state from URL hash (overrides localStorage)
  useEffect(() => {
    if (sharedState) {
      setElecCost(sharedState.elecCost);
      setDifficulty(sharedState.difficulty);
      setBlockReward(sharedState.blockReward);
      setDevice1(sharedState.device1);
      setDevice2(sharedState.device2);
      setMargin(sharedState.margin);
      presetsHook.setActivePresetId(null);
    }
  }, [sharedState]);

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

  // Preset operations
  const getCurrentState = useCallback(() => ({
    elecCost,
    difficulty,
    blockReward,
    device1,
    device2,
    margin,
  }), [elecCost, difficulty, blockReward, device1, device2, margin]);

  const applyPreset = useCallback((preset: Preset) => {
    setElecCost(preset.elecCost);
    setDifficulty(preset.difficulty);
    setBlockReward(preset.blockReward);
    setDevice1(preset.device1);
    setDevice2(preset.device2);
    setMargin(preset.margin);
    presetsHook.setActivePresetId(preset.id);
  }, [presetsHook]);

  const loadPreset = useCallback((id: string) => {
    const preset = presetsHook.getPreset(id);
    if (preset) applyPreset(preset);
  }, [presetsHook, applyPreset]);

  const saveCurrentAsPreset = useCallback((name: string) => {
    return presetsHook.savePreset(name, getCurrentState());
  }, [presetsHook, getCurrentState]);

  const deleteCurrentPreset = useCallback(() => {
    if (presetsHook.activePresetId) {
      presetsHook.deletePreset(presetsHook.activePresetId);
      // Reset to defaults
      setElecCost(DEFAULT_ELEC_COST);
      setDifficulty(DEFAULT_DIFFICULTY);
      setBlockReward(DEFAULT_BLOCK_REWARD);
      setDevice1(DEFAULT_DEVICE_1);
      setDevice2(DEFAULT_DEVICE_2);
      setMargin(DEFAULT_MARGIN);
    }
  }, [presetsHook]);

  const createNew = useCallback(() => {
    presetsHook.setActivePresetId(null);
    setElecCost(DEFAULT_ELEC_COST);
    setDifficulty(DEFAULT_DIFFICULTY);
    setBlockReward(DEFAULT_BLOCK_REWARD);
    setDevice1(DEFAULT_DEVICE_1);
    setDevice2(DEFAULT_DEVICE_2);
    setMargin(DEFAULT_MARGIN);
  }, [presetsHook]);

  const shareCurrentState = useCallback(() => {
    return shareState(getCurrentState());
  }, [shareState, getCurrentState]);

  const exportSettings = useCallback(() => {
    const settings = {
      version: 1,
      timestamp: new Date().toISOString(),
      state: getCurrentState(),
      presets: presetsHook.presets,
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `btc-calculator-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [getCurrentState, presetsHook.presets]);

  const importSettings = useCallback((file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const settings = JSON.parse(content);
          
          if (!settings.state || !Array.isArray(settings.presets)) {
            throw new Error("Invalid settings file format");
          }

          // Apply state
          setElecCost(settings.state.elecCost);
          setDifficulty(settings.state.difficulty);
          setBlockReward(settings.state.blockReward);
          setDevice1(settings.state.device1);
          setDevice2(settings.state.device2);
          setMargin(settings.state.margin);

          // Apply presets
          presetsHook.importPresets(settings.presets);
          
          resolve();
        } catch (error) {
          console.error("Failed to import settings:", error);
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  }, [presetsHook]);

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
    parsedMargin,
    device1Price,
    device2Price,
    resetDevice1,
    resetDevice2,
    resetReward,
    resetMargin,
    // Presets
    presets: presetsHook.presets,
    activePreset: presetsHook.activePreset,
    activePresetId: presetsHook.activePresetId,
    hasUnsavedState: presetsHook.hasUnsavedState,
    maxPresetNameLength: presetsHook.MAX_NAME_LENGTH,
    saveCurrentAsPreset,
    loadPreset,
    deleteCurrentPreset,
    createNew,
    exportSettings,
    importSettings,
    shareCurrentState,
    shareStatus,
  };
};
