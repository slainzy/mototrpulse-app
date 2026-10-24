/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BikeProfile, RideLog } from '../types';
import { playSuccessChime } from '../utils/audio';
import { Navigation, X, Check, MapPin, Gauge } from 'lucide-react';

interface RideLoggerModalProps {
  bike: BikeProfile;
  soundEnabled: boolean;
  onClose: () => void;
  onSaveRide: (ride: RideLog, newOdo: number) => void;
}

export const RideLoggerModal: React.FC<RideLoggerModalProps> = ({
  bike,
  soundEnabled,
  onClose,
  onSaveRide,
}) => {
  const [distanceKm, setDistanceKm] = useState('45');
  const [title, setTitle] = useState('Daily Commute');
  const [purpose, setPurpose] = useState<RideLog['purpose']>('commute');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const distanceNum = parseFloat(distanceKm) || 0;
  const startingOdo = bike.currentOdometer;
  const endingOdo = startingOdo + distanceNum;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (distanceNum <= 0) return;

    const ride: RideLog = {
      id: `ride-${Date.now()}`,
      bikeId: bike.id,
      date,
      distanceKm: distanceNum,
      startingOdo,
      endingOdo,
      title: title.trim() || 'Motorcycle Trip',
      purpose,
    };

    if (soundEnabled) playSuccessChime();
    onSaveRide(ride, endingOdo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md my-8 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Log Ride or Commute</h2>
              <span className="text-xs text-neutral-400">{bike.name} · {bike.currentOdometer.toLocaleString()} km</span>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Ride Distance (km) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2.5 text-lg font-mono-numbers text-white focus:outline-none focus:border-amber-400"
                autoFocus
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-neutral-400">
                KM
              </span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex gap-2">
            {[15, 30, 60, 120, 250].map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => setDistanceKm(km.toString())}
                className="flex-1 py-1 px-1 text-xs bg-neutral-800 hover:bg-neutral-700 rounded border border-neutral-700 text-neutral-300 font-mono-numbers cursor-pointer"
              >
                +{km}
              </button>
            ))}
          </div>

          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Current Odometer:</span>
              <span className="font-mono-numbers text-white">{startingOdo.toLocaleString()} km</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>New Odometer After Ride:</span>
              <span className="font-mono-numbers text-amber-400 font-semibold">{endingOdo.toLocaleString()} km</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Ride Title / Destination
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Purpose
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as RideLog['purpose'])}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
              >
                <option value="commute">Daily Commute</option>
                <option value="leisure">Weekend / Leisure</option>
                <option value="touring">Long Distance Tour</option>
                <option value="errand">City Errand</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Log Ride & Update Odo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
