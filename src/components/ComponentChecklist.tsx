/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ComponentItem, BikeProfile } from '../types';
import { playSuccessChime, playTickSound } from '../utils/audio';
import { 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Plus, 
  Edit2, 
  Trash2, 
  Wrench, 
  SlidersHorizontal,
  Info
} from 'lucide-react';

interface ComponentChecklistProps {
  bike: BikeProfile;
  components: ComponentItem[];
  soundEnabled: boolean;
  onUpdateComponents: (components: ComponentItem[]) => void;
  onOpenLogServiceWithItem?: (itemName: string) => void;
}

export const ComponentChecklist: React.FC<ComponentChecklistProps> = ({
  bike,
  components,
  soundEnabled,
  onUpdateComponents,
  onOpenLogServiceWithItem,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'engine' | 'drivetrain' | 'safety' | 'chassis'>('all');
  const [editingComp, setEditingComp] = useState<ComponentItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New component form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'engine' | 'drivetrain' | 'chassis' | 'safety'>('engine');
  const [newInterval, setNewInterval] = useState('2000');
  const [newDescription, setNewDescription] = useState('');

  const [compToDelete, setCompToDelete] = useState<ComponentItem | null>(null);

  const filtered = components.filter((c) => {
    if (filterCategory === 'all') return true;
    return c.category === filterCategory;
  });

  const handleMarkServiced = (comp: ComponentItem) => {
    if (soundEnabled) playSuccessChime();
    const updated = components.map((c) => {
      if (c.id === comp.id) {
        return {
          ...c,
          lastReplacedOdometer: bike.currentOdometer,
        };
      }
      return c;
    });
    onUpdateComponents(updated);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComp) return;
    if (soundEnabled) playTickSound();
    const updated = components.map((c) => (c.id === editingComp.id ? editingComp : c));
    onUpdateComponents(updated);
    setEditingComp(null);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    if (soundEnabled) playSuccessChime();

    const created: ComponentItem = {
      id: `comp-custom-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      recommendedIntervalKm: parseInt(newInterval, 10) || 2000,
      lastReplacedOdometer: bike.currentOdometer,
      description: newDescription.trim() || 'Custom motorcycle maintenance checkpoint.',
      warningThresholdKm: Math.round((parseInt(newInterval, 10) || 2000) * 0.1),
    };

    onUpdateComponents([...components, created]);
    setIsAddingNew(false);
    setNewName('');
    setNewDescription('');
    setNewInterval('2000');
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Component Health</span>
            <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
              {(bike.serviceIntervalKm || 2000).toLocaleString()} km Maintenance Checklist
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Current bike odometer: <span className="font-mono-numbers text-amber-400 font-semibold">{bike.currentOdometer.toLocaleString()} km</span>. Each item monitors wear relative to its service threshold.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingNew(true)}
              className="px-3.5 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Custom Item</span>
            </button>
          </div>
        </div>

        {/* Category Filter Tabs (Swipeable / scrollable slider on mobile phones) */}
        <div className="mt-4 sm:mt-5 w-full max-w-full overflow-x-auto touch-pan-x flex items-center gap-1.5 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'engine', label: 'Engine & Oil' },
            { id: 'drivetrain', label: 'Chain & Drive' },
            { id: 'safety', label: 'Brakes & Safety' },
            { id: 'chassis', label: 'Tires & Chassis' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id as typeof filterCategory)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                filterCategory === tab.id
                  ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Adding New Component Form Drawer */}
      {isAddingNew && (
        <form onSubmit={handleCreateNew} className="bg-neutral-900 border border-amber-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Add New Motorcycle Maintenance Item</h3>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-xs text-neutral-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Item Name</label>
              <input
                type="text"
                placeholder="e.g. Radiator Coolant Flush"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as typeof newCategory)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="engine">Engine & Oil</option>
                <option value="drivetrain">Drivetrain & Chain</option>
                <option value="safety">Brakes & Safety</option>
                <option value="chassis">Tires & Chassis</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Interval (km)</label>
              <input
                type="number"
                min="100"
                step="100"
                required
                value={newInterval}
                onChange={(e) => setNewInterval(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs font-mono-numbers text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Maintenance Notes & Instructions</label>
            <input
              type="text"
              placeholder="e.g. Check color, drain and replace with 50/50 ethylene glycol mix"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg cursor-pointer"
            >
              Save Item
            </button>
          </div>
        </form>
      )}

      {/* Edit Component Modal */}
      {editingComp && (
        <form onSubmit={handleSaveEdit} className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Edit Maintenance Item: {editingComp.name}</h3>
            <button
              type="button"
              onClick={() => setEditingComp(null)}
              className="text-xs text-neutral-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Name</label>
              <input
                type="text"
                value={editingComp.name}
                onChange={(e) => setEditingComp({ ...editingComp, name: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Interval (km)</label>
              <input
                type="number"
                min="100"
                value={editingComp.recommendedIntervalKm}
                onChange={(e) => setEditingComp({ ...editingComp, recommendedIntervalKm: parseInt(e.target.value, 10) || 2000 })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs font-mono-numbers text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Last Replaced at Odo (km)</label>
              <input
                type="number"
                min="0"
                value={editingComp.lastReplacedOdometer}
                onChange={(e) => setEditingComp({ ...editingComp, lastReplacedOdometer: parseInt(e.target.value, 10) || 0 })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs font-mono-numbers text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Description</label>
            <input
              type="text"
              value={editingComp.description}
              onChange={(e) => setEditingComp({ ...editingComp, description: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingComp(null)}
              className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg cursor-pointer"
            >
              Update Item
            </button>
          </div>
        </form>
      )}

      {/* In-app deletion confirmation */}
      {compToDelete && (
        <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white">Remove &quot;{compToDelete.name}&quot;?</h4>
            <span className="text-xs text-neutral-400 font-mono-numbers">Interval: {compToDelete.recommendedIntervalKm.toLocaleString()} km</span>
          </div>
          <p className="text-xs text-neutral-300">Are you sure you want to remove this checkpoint item from your checklist?</p>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setCompToDelete(null)}
              className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) playTickSound();
                onUpdateComponents(components.filter((c) => c.id !== compToDelete.id));
                setCompToDelete(null);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg cursor-pointer transition-colors"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      )}

      {/* Component Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const dueAtOdo = item.lastReplacedOdometer + item.recommendedIntervalKm;
          const kmRemaining = dueAtOdo - bike.currentOdometer;
          const isOverdue = kmRemaining <= 0;
          const isUpcoming = kmRemaining > 0 && kmRemaining <= item.warningThresholdKm;
          const kmUsed = bike.currentOdometer - item.lastReplacedOdometer;
          const ratio = Math.min(Math.max(kmUsed / item.recommendedIntervalKm, 0), 1.5);
          const percent = Math.min(Math.round(ratio * 100), 150);

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isOverdue
                  ? 'bg-neutral-900/90 border-rose-800/80'
                  : isUpcoming
                  ? 'bg-neutral-900/90 border-amber-800/80'
                  : 'bg-neutral-900/60 border-neutral-800'
              }`}
            >
              <div>
                {/* Top status info */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-white text-base tracking-tight">{item.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                      <span className="capitalize">{item.category}</span>
                      <span>·</span>
                      <span className="font-mono-numbers">Every {item.recommendedIntervalKm.toLocaleString()} km</span>
                    </div>
                  </div>

                  <div>
                    {isOverdue ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded">
                        <AlertTriangle className="w-3 h-3" />
                        <span>OVERDUE {Math.abs(kmRemaining).toLocaleString()} KM</span>
                      </span>
                    ) : isUpcoming ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{kmRemaining.toLocaleString()} KM LEFT</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{kmRemaining.toLocaleString()} KM LEFT</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed mt-2 mb-3">
                  {item.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex justify-between text-[11px] text-neutral-400 font-mono-numbers">
                    <span>Used: {kmUsed.toLocaleString()} km ({percent}%)</span>
                    <span>Due at: {dueAtOdo.toLocaleString()} km</span>
                  </div>
                  <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden border border-neutral-800">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        isOverdue ? 'bg-rose-500' : isUpcoming ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingComp(item)}
                    title="Edit interval"
                    className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompToDelete(item)}
                    title="Delete item"
                    className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-md hover:bg-neutral-800 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMarkServiced(item)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 active:scale-[0.98] rounded-lg border border-neutral-700 transition-all flex items-center gap-1.5 cursor-pointer"
                    title={`Reset counter to current odometer (${bike.currentOdometer} km)`}
                  >
                    <RotateCcw className="w-3 h-3 text-amber-400" />
                    <span>Done Today</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
