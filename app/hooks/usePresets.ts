import { useState, useEffect, useCallback } from "react";
import { Device } from "./useCalculator";

export interface Preset {
  id: string;
  name: string;
  elecCost: number | string;
  difficulty: number | string;
  blockReward: number | string;
  device1: Device;
  device2: Device;
  margin: number | string;
}

const STORAGE_KEY = "btc_calc_presets";
const ACTIVE_KEY = "btc_calc_active_preset";
const MAX_NAME_LENGTH = 35;

function loadPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePresetsToStorage(presets: Preset[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

export const usePresets = () => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Load on mount
  useEffect(() => {
    setPresets(loadPresets());
    const savedActive = localStorage.getItem(ACTIVE_KEY);
    if (savedActive) setActivePresetId(savedActive);
  }, []);

  // Persist active preset id
  useEffect(() => {
    if (activePresetId) {
      localStorage.setItem(ACTIVE_KEY, activePresetId);
    } else {
      localStorage.removeItem(ACTIVE_KEY);
    }
  }, [activePresetId]);

  const savePreset = useCallback(
    (
      name: string,
      state: {
        elecCost: number | string;
        difficulty: number | string;
        blockReward: number | string;
        device1: Device;
        device2: Device;
        margin: number | string;
      }
    ) => {
      const trimmed = name.trim().slice(0, MAX_NAME_LENGTH);
      if (!trimmed) return null;

      const newPreset: Preset = {
        id: crypto.randomUUID(),
        name: trimmed,
        ...state,
      };

      const updated = [...loadPresets(), newPreset];
      savePresetsToStorage(updated);
      setPresets(updated);
      setActivePresetId(newPreset.id);
      return newPreset;
    },
    []
  );

  const deletePreset = useCallback(
    (id: string) => {
      const updated = loadPresets().filter((p) => p.id !== id);
      savePresetsToStorage(updated);
      setPresets(updated);
      if (activePresetId === id) {
        setActivePresetId(null);
      }
    },
    [activePresetId]
  );

  const getPreset = useCallback((id: string): Preset | undefined => {
    return loadPresets().find((p) => p.id === id);
  }, []);

  const activePreset = presets.find((p) => p.id === activePresetId) ?? null;

  return {
    presets,
    activePresetId,
    activePreset,
    setActivePresetId,
    savePreset,
    deletePreset,
    getPreset,
    hasUnsavedState: activePresetId === null,
    MAX_NAME_LENGTH,
  };
};
