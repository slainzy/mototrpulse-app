/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BikeProfile, RideLog } from '../types';
import { playTickSound } from '../utils/audio';
import { Navigation, Plus, Trash2, SlidersHorizontal, ChevronRight } from 'lucide-react';

interface RideLogListProps {
  bike: BikeProfile;
  rides: RideLog[];
  soundEnabled: boolean;
  onDeleteRide: (id: string) => void;
  onOpenRideLogger: () => void;
}

export const RideLogList: React.FC<RideLogListProps> = ({
  bike,
  rides,
  soundEnabled,
  onDeleteRide,
  onOpenRideLogger,
}) => {
  const [filterPurpose, setFilterPurpose] = useState<string>('all');
  const [rideToDelete, setRideToDelete] = useState<RideLog | null>(null);
  const bikeRides = rides.filter((r) => r.bikeId === bike.id);

  const filtered = bikeRides.filter((r) => {
    if (filterPurpose === 'all') return true;
    return r.purpose === filterPurpose;
  });

  const totalDistance = bikeRides.reduce((sum, r) => sum + r.distanceKm, 0);

  const filterTabs = [
    { id: 'all', label: 'All Trips', count: bikeRides.length },
    { id: 'commute', label: 'Commutes', count: bikeRides.filter((r) => r.purpose === 'commute').length },
    { id: 'leisure', label: 'Weekend Ride', count: bikeRides.filter((r) => r.purpose === 'leisure').length },
    { id: 'touring', label: 'Long Touring', count: bikeRides.filter((r) => r.purpose === 'touring').length },
    { id: 'errand', label: 'City Errands', count: bikeRides.filter((r) => r.purpose === 'errand').length },
  ];

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header and Summary */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Rider Telemetry</span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">Trips &amp; Mileage Log</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Tracks commutes and weekend rides contributing to your {bike.serviceIntervalKm || 2000} km service countdown.
            </p>
          </div>

          <div>
            <button
              onClick={onOpenRideLogger}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Log New Ride</span>
            </button>
          </div>
        </div>

        {/* Stats Grid - responsive for vertical phone */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-5">
          <div className="p-3 sm:p-3.5 bg-neutral-950/70 border border-neutral-800/80 rounded-xl">
            <span className="text-[11px] sm:text-xs text-neutral-400 block truncate">Total Trips</span>
            <span className="text-xl sm:text-2xl font-bold font-mono-numbers text-white mt-1 block">
              {bikeRides.length}
            </span>
          </div>

          <div className="p-3 sm:p-3.5 bg-neutral-950/70 border border-neutral-800/80 rounded-xl">
            <span className="text-[11px] sm:text-xs text-neutral-400 block truncate">Logged Distance</span>
            <span className="text-xl sm:text-2xl font-bold font-mono-numbers text-amber-400 mt-1 block truncate">
              {totalDistance.toFixed(1)} km
            </span>
          </div>

          <div className="p-3 sm:p-3.5 bg-neutral-950/70 border border-neutral-800/80 rounded-xl col-span-2 sm:col-span-1">
            <span className="text-[11px] sm:text-xs text-neutral-400 block truncate">Average Distance</span>
            <span className="text-xl sm:text-2xl font-bold font-mono-numbers text-neutral-200 mt-1 block">
              {bikeRides.length > 0 ? (totalDistance / bikeRides.length).toFixed(1) : 0} km
            </span>
          </div>
        </div>

        {/* Horizontal Slider Menu for Trips & Mileage (Touch friendly, no screen overflow) */}
        <div className="mt-5 space-y-1.5">
          <div className="flex items-center justify-between text-neutral-400 text-[11px]">
            <span className="flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-amber-400" />
              <span>Category Filter</span>
            </span>
            <span className="sm:hidden text-[10px] text-neutral-400">Swipe horizontally →</span>
          </div>

          {/* Slider track container constrained strictly to 100% width */}
          <div className="w-full max-w-full overflow-x-auto pb-1 pt-0.5 touch-pan-x [scrollbar-width:thin] scrollbar-thumb-neutral-800">
            <div className="flex items-center gap-2 min-w-max p-1 bg-neutral-950 rounded-xl border border-neutral-800">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterPurpose(tab.id)}
                  className={`min-h-[40px] px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 ${
                    filterPurpose === tab.id
                      ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-mono-numbers px-1.5 py-0.2 rounded ${
                    filterPurpose === tab.id ? 'bg-amber-400/20 text-amber-300' : 'bg-neutral-900 text-neutral-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* In-app deletion confirmation */}
      {rideToDelete && (
        <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white">Delete &quot;{rideToDelete.title}&quot;?</h4>
            <span className="text-xs text-neutral-400 font-mono-numbers">+{rideToDelete.distanceKm} km · {rideToDelete.date}</span>
          </div>
          <p className="text-xs text-neutral-300">Are you sure you want to remove this trip entry from your log?</p>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setRideToDelete(null)}
              className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) playTickSound();
                onDeleteRide(rideToDelete.id);
                setRideToDelete(null);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg cursor-pointer transition-colors"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      )}

      {/* Rides List - Mobile Optimized */}
      {filtered.length === 0 ? (
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-8 sm:p-12 text-center">
          <Navigation className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-white">No Trips in this Category</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            Click &quot;Log New Ride&quot; above to add a commute or weekend tour.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ride) => (
            <div
              key={ride.id}
              className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 hover:border-neutral-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
                  <Navigation className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-white text-sm tracking-tight truncate">{ride.title}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5 truncate">
                    <span>{ride.date}</span>
                    <span>·</span>
                    <span className="capitalize">{ride.purpose}</span>
                    <span>·</span>
                    <span className="font-mono-numbers text-[11px]">
                      {ride.startingOdo.toLocaleString()} → {ride.endingOdo.toLocaleString()} km
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800/60">
                <span className="text-base font-bold font-mono-numbers text-amber-400 whitespace-nowrap">
                  +{ride.distanceKm.toLocaleString()} km
                </span>
                <button
                  type="button"
                  onClick={() => setRideToDelete(ride)}
                  title="Delete ride log"
                  className="p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
