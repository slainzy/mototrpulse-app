/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BikeProfile } from '../types';
import { playSuccessChime, playTickSound } from '../utils/audio';
import { Layers, Plus, Check, Edit2, Trash2, X, Gauge, AlertTriangle } from 'lucide-react';

interface BikeManagerModalProps {
  bikes: BikeProfile[];
  activeBikeId: string;
  soundEnabled: boolean;
  onSelectBike: (id: string) => void;
  onAddBike: (newBike: BikeProfile) => void;
  onUpdateBike: (updated: BikeProfile) => void;
  onDeleteBike: (id: string) => void;
  onClose: () => void;
}

export const BikeManagerModal: React.FC<BikeManagerModalProps> = ({
  bikes,
  activeBikeId,
  soundEnabled,
  onSelectBike,
  onAddBike,
  onUpdateBike,
  onDeleteBike,
  onClose,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingBike, setEditingBike] = useState<BikeProfile | null>(null);
  const [bikeToDelete, setBikeToDelete] = useState<BikeProfile | null>(null);
  const [minBikeNotice, setMinBikeNotice] = useState<string | null>(null);

  // Form states for new bike
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [year, setYear] = useState('2024');
  const [engineCc, setEngineCc] = useState('150');
  const [currentOdometer, setCurrentOdometer] = useState('1000');
  const [lastServiceOdometer, setLastServiceOdometer] = useState('0');
  const [serviceIntervalKm, setServiceIntervalKm] = useState('2000');
  const [oilGrade, setOilGrade] = useState('10W-40 4T JASO MA2');
  const [oilCapacityLiters, setOilCapacityLiters] = useState('1.0');
  const [frontTirePsi, setFrontTirePsi] = useState('33');
  const [rearTirePsi, setRearTirePsi] = useState('36');
  const [notes, setNotes] = useState('');

  const handleCreateBike = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newBike: BikeProfile = {
      id: `bike-${Date.now()}`,
      name: name.trim(),
      model: model.trim() || 'Motorcycle',
      plateNumber: plateNumber.trim() || 'N/A',
      year: parseInt(year, 10) || 2024,
      engineCc: parseInt(engineCc, 10) || 150,
      currentOdometer: parseInt(currentOdometer, 10) || 0,
      lastServiceOdometer: parseInt(lastServiceOdometer, 10) || 0,
      serviceIntervalKm: parseInt(serviceIntervalKm, 10) || 2000,
      oilGrade: oilGrade.trim(),
      oilCapacityLiters: parseFloat(oilCapacityLiters) || 1.0,
      frontTirePsi: parseInt(frontTirePsi, 10) || 33,
      rearTirePsi: parseInt(rearTirePsi, 10) || 36,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    if (soundEnabled) playSuccessChime();
    onAddBike(newBike);
    setIsAdding(false);
  };

  const handleSaveEditBike = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBike) return;
    if (soundEnabled) playSuccessChime();
    onUpdateBike(editingBike);
    setEditingBike(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl my-8 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Motorcycle Garage Profiles</h2>
              <span className="text-xs text-neutral-400">Manage bikes and customize 2,000 km intervals</span>
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

        <div className="p-6 space-y-6">
          {/* Active Bike Selection */}
          {!isAdding && !editingBike && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Select Active Bike</span>
                <button
                  onClick={() => setIsAdding(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add New Bike</span>
                </button>
              </div>

              {/* Notice if trying to delete only bike */}
              {minBikeNotice && (
                <div className="p-3 bg-neutral-950 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center justify-between">
                  <span>{minBikeNotice}</span>
                  <button onClick={() => setMinBikeNotice(null)} className="text-neutral-400 hover:text-white ml-2">✕</button>
                </div>
              )}

              {/* Dedicated in-app confirmation modal for deleting bike */}
              {bikeToDelete && (
                <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-xl space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Delete &quot;{bikeToDelete.name}&quot;?</h4>
                      <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                        Are you sure you want to remove this bike ({bikeToDelete.plateNumber || 'No plate'}) from your garage? This cannot be undone.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setBikeToDelete(null)}
                      className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (soundEnabled) playTickSound();
                        onDeleteBike(bikeToDelete.id);
                        setBikeToDelete(null);
                        setMinBikeNotice(null);
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg cursor-pointer transition-colors"
                    >
                      Yes, Delete Bike
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                {bikes.map((b) => {
                  const isActive = b.id === activeBikeId;
                  const nextDue = b.lastServiceOdometer + (b.serviceIntervalKm || 2000);
                  const remaining = nextDue - b.currentOdometer;

                  return (
                    <div
                      key={b.id}
                      className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${
                        isActive
                          ? 'bg-neutral-950 border-amber-400/80 shadow-sm ring-1 ring-amber-400/20'
                          : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                      }`}
                      onClick={() => {
                        if (soundEnabled) playTickSound();
                        onSelectBike(b.id);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                          isActive ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          <Gauge className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-sm">{b.name}</h3>
                            {isActive && (
                              <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800 px-1.5 py-0.2 rounded font-semibold uppercase">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                            <span>{b.plateNumber}</span>
                            <span>·</span>
                            <span className="font-mono-numbers">{b.currentOdometer.toLocaleString()} km</span>
                            <span>·</span>
                            <span className="font-mono-numbers text-amber-400">
                              {remaining <= 0 ? 'Service Overdue' : `${remaining.toLocaleString()} km until service`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setEditingBike(b)}
                          title="Edit bike specs"
                          className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (bikes.length <= 1) {
                              setMinBikeNotice("Your garage must have at least one motorcycle. Add another bike before deleting this one.");
                            } else {
                              setBikeToDelete(b);
                            }
                          }}
                          title={bikes.length <= 1 ? "At least one bike required" : "Delete bike"}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            bikes.length <= 1
                              ? 'text-neutral-600 hover:text-neutral-400'
                              : 'text-neutral-400 hover:text-rose-400 hover:bg-neutral-800'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form to Add New Bike */}
          {isAdding && (
            <form onSubmit={handleCreateBike} className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-sm font-bold text-white">Add New Motorcycle</h3>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Make & Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Honda CB150R / Kawasaki Ninja"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">License Plate</label>
                  <input
                    type="text"
                    placeholder="e.g. ABC 1234"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Displacement (cc)</label>
                  <input
                    type="number"
                    value={engineCc}
                    onChange={(e) => setEngineCc(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Service Interval (km)</label>
                  <input
                    type="number"
                    value={serviceIntervalKm}
                    onChange={(e) => setServiceIntervalKm(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-amber-400 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Current Odometer (km) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={currentOdometer}
                    onChange={(e) => setCurrentOdometer(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs font-mono-numbers text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Last Service At Odo (km)</label>
                  <input
                    type="number"
                    min="0"
                    value={lastServiceOdometer}
                    onChange={(e) => setLastServiceOdometer(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs font-mono-numbers text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Engine Oil Grade</label>
                  <input
                    type="text"
                    value={oilGrade}
                    onChange={(e) => setOilGrade(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Oil Capacity (Liters)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={oilCapacityLiters}
                    onChange={(e) => setOilCapacityLiters(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
                >
                  Create Profile
                </button>
              </div>
            </form>
          )}

          {/* Form to Edit Existing Bike */}
          {editingBike && (
            <form onSubmit={handleSaveEditBike} className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-sm font-bold text-white">Edit {editingBike.name}</h3>
                <button
                  type="button"
                  onClick={() => setEditingBike(null)}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={editingBike.name}
                    onChange={(e) => setEditingBike({ ...editingBike, name: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Plate</label>
                  <input
                    type="text"
                    value={editingBike.plateNumber}
                    onChange={(e) => setEditingBike({ ...editingBike, plateNumber: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Interval (km)</label>
                  <input
                    type="number"
                    value={editingBike.serviceIntervalKm}
                    onChange={(e) => setEditingBike({ ...editingBike, serviceIntervalKm: parseInt(e.target.value, 10) || 2000 })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-amber-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Front PSI</label>
                  <input
                    type="number"
                    value={editingBike.frontTirePsi}
                    onChange={(e) => setEditingBike({ ...editingBike, frontTirePsi: parseInt(e.target.value, 10) || 33 })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Rear PSI</label>
                  <input
                    type="number"
                    value={editingBike.rearTirePsi}
                    onChange={(e) => setEditingBike({ ...editingBike, rearTirePsi: parseInt(e.target.value, 10) || 36 })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Oil Grade</label>
                  <input
                    type="text"
                    value={editingBike.oilGrade}
                    onChange={(e) => setEditingBike({ ...editingBike, oilGrade: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Oil Capacity (L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingBike.oilCapacityLiters}
                    onChange={(e) => setEditingBike({ ...editingBike, oilCapacityLiters: parseFloat(e.target.value) || 1.0 })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBike(null)}
                  className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
