"use client";

import React from "react";
import Link from "next/link";
import { useCalculator } from "../hooks/useCalculator";
import { CalculatorHeader } from "./calculator/CalculatorHeader";
import { CalculatorInputs } from "./calculator/CalculatorInputs";
import { DeviceCard } from "./calculator/DeviceCard";
import { DeviceModal } from "./calculator/DeviceModal";
import { SettingsModal } from "./calculator/SettingsModal";
import { RewardModal } from "./calculator/RewardModal";
import { SavePresetModal } from "./calculator/SavePresetModal";
import { DeletePresetModal } from "./calculator/DeletePresetModal";
import { PresetSelector } from "./calculator/PresetSelector";

export default function Calculator() {
  const {
    elecCost, setElecCost,
    difficulty, setDifficulty,
    blockReward, setBlockReward,
    device1, setDevice1,
    device2, setDevice2,
    margin, setMargin,
    activeModal, setActiveModal,
    parsedBlockReward,
    parsedMargin,
    device1Price,
    device2Price,
    resetDevice1,
    resetDevice2,
    resetReward,
    resetMargin,
    // Presets
    presets,
    activePreset,
    hasUnsavedState,
    maxPresetNameLength,
    saveCurrentAsPreset,
    loadPreset,
    deleteCurrentPreset,
    createNew,
    exportSettings,
    importSettings,
    shareCurrentState,
    shareStatus,
  } = useCalculator();

  return (
    <>
      {/* Modals rendered OUTSIDE the card to avoid backdrop-blur stacking context */}
      <SettingsModal 
        isOpen={activeModal === 'settings'} 
        onClose={() => setActiveModal(null)} 
        onReset={resetMargin}
        margin={margin}
        setMargin={setMargin}
        onExport={exportSettings}
        onImport={importSettings}
      />

      <DeviceModal
        isOpen={activeModal === 'device1'}
        onClose={() => setActiveModal(null)}
        onReset={resetDevice1}
        device={device1}
        setDevice={setDevice1}
        title="Edit Device 1"
      />

      <DeviceModal
        isOpen={activeModal === 'device2'}
        onClose={() => setActiveModal(null)}
        onReset={resetDevice2}
        device={device2}
        setDevice={setDevice2}
        title="Edit Device 2"
      />

      <RewardModal
        isOpen={activeModal === 'reward'}
        onClose={() => setActiveModal(null)}
        blockReward={blockReward}
        setBlockReward={setBlockReward}
      />

      <SavePresetModal
        isOpen={activeModal === 'savePreset'}
        onClose={() => setActiveModal(null)}
        onSave={saveCurrentAsPreset}
        maxLength={maxPresetNameLength}
      />

      <DeletePresetModal
        isOpen={activeModal === 'deletePreset'}
        onClose={() => setActiveModal(null)}
        onDelete={deleteCurrentPreset}
        presetName={activePreset?.name ?? ''}
      />

      <div className="w-full max-w-2xl mx-auto p-6 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl relative">

        <CalculatorHeader 
          onOpenSettings={() => setActiveModal('settings')}
          onSave={() => setActiveModal('savePreset')}
          onDelete={() => setActiveModal('deletePreset')}
          onShare={shareCurrentState}
          shareStatus={shareStatus}
          hasUnsavedState={hasUnsavedState}
        />

        <PresetSelector
          presets={presets}
          activePreset={activePreset}
          onSelect={loadPreset}
          onCreateNew={createNew}
        />

        <CalculatorInputs 
          elecCost={elecCost} setElecCost={setElecCost}
          difficulty={difficulty} setDifficulty={setDifficulty}
        />

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4 flex items-baseline gap-1.5 flex-wrap">
            <span>Est. Production Cost (1 BTC)</span>
            {parsedMargin !== 0 && (
              <span className="text-xs font-bold text-zinc-400 normal-case tracking-normal whitespace-nowrap">
                {parsedMargin > 0 ? '+' : ''}{parsedMargin}%
              </span>
            )}
          </h3>
          
          <DeviceCard 
            device={device1} 
            price={device1Price} 
            onEdit={() => setActiveModal('device1')} 
          />

          <DeviceCard 
            device={device2} 
            price={device2Price} 
            onEdit={() => setActiveModal('device2')} 
            isSecondary
          />
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-col md:flex-row items-center md:justify-between gap-2">
          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition-all group"
            onClick={() => setActiveModal('reward')}
            title="Change Block Reward"
          >
            <span className="text-xs text-zinc-500">Block Reward:</span>
            <span className="text-xs font-mono font-bold text-zinc-300 group-hover:text-white transition-colors border-b border-dashed border-zinc-700 group-hover:border-orange-500">
              {parsedBlockReward} BTC
            </span>
          </div>
          <Link
            href="/theory"
            className="inline-flex items-center gap-1.5 text-xs group/link px-3 py-1.5 rounded-lg hover:bg-zinc-800/50 transition-all cursor-pointer"
            title="Learn about the production cost theory"
          >
            <span className="text-zinc-500">Inspired by</span>
            <span className="font-mono font-bold text-zinc-300 group-hover/link:text-white transition-colors border-b border-dashed border-zinc-700 group-hover/link:border-orange-500">Pavel Solodkov</span>
          </Link>
        </div>
      </div>
    </>
  );
}
