/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BikeProfile } from '../types';
import { playSuccessChime } from '../utils/audio';
import { SlidersHorizontal, Check, X, Gauge, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SetIntervalModalProps {
  bike: BikeProfile;
  soundEnabled: boolean;
  onClose: () => void;
  onSaveInterval: (newIntervalKm: number, syncEngineOil: boolean) => void;
}

export const SetIntervalModal: React.FC<SetIntervalModalProps> = ({
  bike,
  soundEnabled,
  onClose,
  onSaveInterval,
}) => {
  const [intervalKm, setIntervalKm] = useState<number>(bike.serviceIntervalKm || 2000);
  const [syncEngineOil, setSyncEngineOil] = useState<boolean>(true);

  const presets = [1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000];

  // Dynamic preview calculations
  const nextTarget = bike.lastServiceOdometer + intervalKm;
  const remaining = nextTarget - bike.currentOdometer;
  const isOverdue = remaining <= 0;
  const isUpcoming = remaining > 0 && remaining <= 250;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (intervalKm <= 0) return;
    if (soundEnabled) playSuccessChime();
    onSaveInterval(intervalKm, syncEngineOil);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg my-8 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Custom Service Interval</h2>
              <span className="text-xs text-neutral-400">{bike.name} · Current Odometer: {bike.currentOdometer.toLocaleString()} km</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Main Numeric & Range Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Desired Service Interval (km)
              </label>
              <span className="text-xs text-neutral-400">Set any custom mileage</span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="100"
                max="25000"
                step="50"
                required
                value={intervalKm}
                onChange={(e) => setIntervalKm(Math.max(100, parseInt(e.target.value, 10) || 100))}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-2xl font-bold font-mono-numbers text-amber-400 focus:outline-none focus:border-amber-400"
              />
              <span className="text-base font-semibold text-neutral-400">KM</span>
            </div>

            {/* Range Slider for rapid tactile tuning */}
            <div className="pt-2">
              <input
                type="range"
                min="500"
                max="8000"
                step="100"
                value={Math.min(intervalKm, 8000)}
                onChange={(e) => setIntervalKm(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-amber-400 border border-neutral-800"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono-numbers mt-1">
                <span>500 km</span>
                <span>2,000 km</span>
                <span>4,000 km</span>
                <span>6,000 km</span>
                <span>8,000+ km</span>
              </div>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-neutral-400 block">Common Motorcycle Presets:</span>
            <div className="grid grid-cols-4 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setIntervalKm(preset)}
                  className={`py-2 px-2 text-xs font-mono-numbers rounded-lg border transition-all cursor-pointer text-center ${
                    intervalKm === preset
                      ? 'bg-amber-400 text-neutral-950 border-amber-400 font-bold shadow-sm'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  {preset.toLocaleString()} km
                </button>
              ))}
            </div>
          </div>

          {/* Live Dynamic Preview Card */}
          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2.5 text-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 block">
              Live Impact Preview
            </span>

            <div className="flex justify-between items-center text-neutral-300">
              <span>Last Service Milestone:</span>
              <span className="font-mono-numbers font-medium">{bike.lastServiceOdometer.toLocaleString()} km</span>
            </div>

            <div className="flex justify-between items-center text-neutral-300">
              <span>New Next Service Target:</span>
              <span className="font-mono-numbers font-bold text-white text-sm">
                {nextTarget.toLocaleString()} km
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-neutral-800/80">
              <span>Distance to Next Service:</span>
              <span className={`font-mono-numbers font-bold ${
                isOverdue ? 'text-rose-400' : isUpcoming ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {isOverdue ? `Overdue by ${Math.abs(remaining).toLocaleString()} km` : `${remaining.toLocaleString()} km remaining`}
              </span>
            </div>
          </div>

          {/* Sync Engine Oil Checkpoint */}
          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={syncEngineOil}
                onChange={(e) => setSyncEngineOil(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-amber-400 bg-neutral-900 border-neutral-700"
              />
              <div className="text-xs">
                <span className="font-medium text-white block">
                  Sync Engine Oil &amp; Filter intervals to {intervalKm.toLocaleString()} km
                </span>
                <span className="text-neutral-400 block mt-0.5">
                  Automatically aligns the engine oil checkpoint in your maintenance checklist to match this interval.
                </span>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Apply {intervalKm.toLocaleString()} km Interval</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
