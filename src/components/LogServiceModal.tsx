/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BikeProfile, ComponentItem, ServiceRecord } from '../types';
import { playSuccessChime } from '../utils/audio';
import { Wrench, X, Check, DollarSign } from 'lucide-react';

interface LogServiceModalProps {
  bike: BikeProfile;
  components: ComponentItem[];
  soundEnabled: boolean;
  onClose: () => void;
  onSaveService: (record: ServiceRecord, shouldAdvanceCycle: boolean, updatedComponents: ComponentItem[]) => void;
}

export const LogServiceModal: React.FC<LogServiceModalProps> = ({
  bike,
  components,
  soundEnabled,
  onClose,
  onSaveService,
}) => {
  const [odometer, setOdometer] = useState(bike.currentOdometer.toString());
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState(`${bike.currentOdometer.toLocaleString()} km Routine Service`);
  const [type, setType] = useState<ServiceRecord['type']>('routine_2000');
  const [cost, setCost] = useState('45');
  const [currency, setCurrency] = useState('$');
  const [performedBy, setPerformedBy] = useState<ServiceRecord['performedBy']>('DIY (Self)');
  const [mechanicOrShopName, setMechanicOrShopName] = useState('');
  const [oilUsed, setOilUsed] = useState(bike.oilGrade || '10W-40 4T Fully Synthetic');
  const [notes, setNotes] = useState('');
  const [advanceCycle, setAdvanceCycle] = useState(true);

  // Completed items selected
  const defaultChecked = ['Engine Oil (4T JASO MA2)', 'Engine Oil Filter & O-Ring', 'Drive Chain Clean, Tension & Lube'];
  const [selectedItems, setSelectedItems] = useState<string[]>(
    components.filter((c) => defaultChecked.some((d) => c.name.includes(d) || d.includes(c.name))).map((c) => c.name)
  );

  const toggleItem = (name: string) => {
    setSelectedItems((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(components.map((c) => c.name));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const odoNum = parseInt(odometer, 10) || bike.currentOdometer;
    const costNum = parseFloat(cost) || 0;

    const newRecord: ServiceRecord = {
      id: `srv-${Date.now()}`,
      bikeId: bike.id,
      odometer: odoNum,
      date,
      type,
      title: title.trim() || 'Motorcycle Service',
      itemsCompleted: selectedItems,
      cost: costNum,
      currency,
      performedBy,
      mechanicOrShopName: mechanicOrShopName.trim() || undefined,
      oilUsed: oilUsed.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    // Update last replaced odometer for items that were checked
    const updatedComponents = components.map((c) => {
      if (selectedItems.includes(c.name)) {
        return {
          ...c,
          lastReplacedOdometer: odoNum,
        };
      }
      return c;
    });

    if (soundEnabled) playSuccessChime();
    onSaveService(newRecord, advanceCycle, updatedComponents);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl my-8 overflow-hidden shadow-2xl">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Log Motorcycle Service</h2>
              <span className="text-xs text-neutral-400">{bike.name} · {bike.plateNumber}</span>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Odometer at Service (km) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={odometer}
                onChange={(e) => {
                  setOdometer(e.target.value);
                  setTitle(`${parseInt(e.target.value, 10) || 0} km Routine Service`);
                }}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm font-mono-numbers text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Date Completed *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Service Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Service Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ServiceRecord['type'])}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="routine_2000">2,000 km Routine Service</option>
                <option value="oil_only">Engine Oil & Filter Only</option>
                <option value="chain_service">Chain Clean & Lube Only</option>
                <option value="major_overhaul">Major Service</option>
                <option value="custom">Custom Repair</option>
              </select>
            </div>
          </div>

          {/* Checklist selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-neutral-300">
                Tasks & Checklist Completed
              </label>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                Select All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-neutral-950 p-3 rounded-xl border border-neutral-800 max-h-44 overflow-y-auto">
              {components.map((comp) => {
                const isChecked = selectedItems.includes(comp.name);
                return (
                  <label
                    key={comp.id}
                    className="flex items-center gap-2 p-1.5 rounded hover:bg-neutral-900 cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleItem(comp.name)}
                      className="w-4 h-4 rounded text-amber-400 bg-neutral-900 border-neutral-700 focus:ring-0 focus:ring-offset-0"
                    />
                    <span className={isChecked ? 'text-white font-medium' : 'text-neutral-400'}>
                      {comp.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Oil & Performed By */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Engine Oil Used & Viscosity
              </label>
              <input
                type="text"
                placeholder="e.g. Motul 7100 10W-40 4T (1.0L)"
                value={oilUsed}
                onChange={(e) => setOilUsed(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Performed By
              </label>
              <select
                value={performedBy}
                onChange={(e) => setPerformedBy(e.target.value as ServiceRecord['performedBy'])}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="DIY (Self)">DIY (Self in Garage)</option>
                <option value="Authorized Dealer">Authorized Dealer Workshop</option>
                <option value="Independent Workshop">Independent Motorcycle Mechanic</option>
              </select>
            </div>
          </div>

          {performedBy !== 'DIY (Self)' && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Workshop / Mechanic Name
              </label>
              <input
                type="text"
                placeholder="e.g. SpeedWorks Moto Garage"
                value={mechanicOrShopName}
                onChange={(e) => setMechanicOrShopName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          )}

          {/* Cost and Notes */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-2 text-xs text-white"
              >
                <option value="$">$ (USD)</option>
                <option value="RM">RM (MYR)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
                <option value="₹">₹ (INR)</option>
                <option value="¥">¥ (JPY)</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Total Service Cost
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs font-mono-numbers text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Mechanic Notes / Observations
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Drain plug torqued to 20 Nm. Chain adjusted to 30mm slack. Spark plug electrode light tan."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Advance Cycle Option */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={advanceCycle}
                onChange={(e) => setAdvanceCycle(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-amber-400 bg-neutral-900 border-neutral-700"
              />
              <div className="text-xs">
                <span className="font-semibold text-amber-300 block">
                  Advance 2,000 km Service Target
                </span>
                <span className="text-neutral-400 block mt-0.5">
                  Sets last service to {parseInt(odometer, 10) || bike.currentOdometer} km. Next 2,000 km reminder will alert you at {((parseInt(odometer, 10) || bike.currentOdometer) + (bike.serviceIntervalKm || 2000)).toLocaleString()} km.
                </span>
              </div>
            </label>
          </div>

          {/* Action buttons */}
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
              <span>Save & Update Motorcycle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
