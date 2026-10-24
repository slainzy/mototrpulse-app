/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BikeProfile, ServiceRecord } from '../types';
import { exportServicesCSV, exportAllData } from '../utils/storage';
import { playTickSound } from '../utils/audio';
import { 
  History, 
  Search, 
  Download, 
  FileSpreadsheet, 
  Trash2, 
  Calendar, 
  DollarSign, 
  Wrench, 
  CheckCircle,
  Plus
} from 'lucide-react';

interface ServiceHistoryListProps {
  bike: BikeProfile;
  services: ServiceRecord[];
  soundEnabled: boolean;
  onDeleteService: (id: string) => void;
  onOpenLogService: () => void;
}

export const ServiceHistoryList: React.FC<ServiceHistoryListProps> = ({
  bike,
  services,
  soundEnabled,
  onDeleteService,
  onOpenLogService,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [serviceToDelete, setServiceToDelete] = useState<ServiceRecord | null>(null);

  const bikeServices = services.filter((s) => s.bikeId === bike.id);

  const filtered = bikeServices.filter((s) => {
    if (filterType !== 'all' && s.type !== filterType) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.title.toLowerCase().includes(term) ||
      (s.notes && s.notes.toLowerCase().includes(term)) ||
      (s.oilUsed && s.oilUsed.toLowerCase().includes(term)) ||
      (s.mechanicOrShopName && s.mechanicOrShopName.toLowerCase().includes(term)) ||
      s.itemsCompleted.some((item) => item.toLowerCase().includes(term))
    );
  });

  // Calculate totals
  const totalSpent = bikeServices.reduce((sum, s) => sum + (s.cost || 0), 0);
  const currencySymbol = bikeServices[0]?.currency || '$';

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Maintenance Archive</span>
            <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">Service Logbook & Records</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Complete historical trail for <span className="text-neutral-200 font-semibold">{bike.name}</span> ({bike.plateNumber}).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportServicesCSV(bikeServices, bike.name)}
              className="px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download spreadsheet report"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={exportAllData}
              className="px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Backup all bikes and history"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Backup JSON</span>
            </button>
            <button
              onClick={onOpenLogService}
              className="px-3.5 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+ Log Service</span>
            </button>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3.5 bg-neutral-950/70 border border-neutral-800/80 rounded-xl">
            <span className="text-xs text-neutral-400 block">Total Services</span>
            <span className="text-2xl font-bold font-mono-numbers text-white mt-1 block">
              {bikeServices.length}
            </span>
          </div>

          <div className="p-3.5 bg-neutral-950/70 border border-neutral-800/80 rounded-xl">
            <span className="text-xs text-neutral-400 block">Total Spent</span>
            <span className="text-2xl font-bold font-mono-numbers text-amber-400 mt-1 block">
              {currencySymbol}{totalSpent.toFixed(2)}
            </span>
          </div>

          <div className="p-3.5 bg-neutral-950/70 border border-neutral-800/80 rounded-xl">
            <span className="text-xs text-neutral-400 block">Last Service Odo</span>
            <span className="text-2xl font-bold font-mono-numbers text-neutral-200 mt-1 block">
              {bike.lastServiceOdometer.toLocaleString()} km
            </span>
          </div>

          <div className="p-3.5 bg-neutral-950/70 border border-neutral-800/80 rounded-xl">
            <span className="text-xs text-neutral-400 block">Current Interval</span>
            <span className="text-2xl font-bold font-mono-numbers text-emerald-400 mt-1 block">
              {bike.serviceIntervalKm || 2000} km
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search records by oil, workshop, task..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-xl border border-neutral-800 overflow-x-auto">
          {[
            { id: 'all', label: 'All Logs' },
            { id: 'routine_2000', label: '2,000 km Routine' },
            { id: 'oil_only', label: 'Oil Only' },
            { id: 'chain_service', label: 'Chain Only' },
            { id: 'major_overhaul', label: 'Major' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                filterType === tab.id
                  ? 'bg-neutral-800 text-amber-400 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* In-app deletion confirmation */}
      {serviceToDelete && (
        <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white">Delete &quot;{serviceToDelete.title}&quot;?</h4>
            <span className="text-xs text-neutral-400 font-mono-numbers">{serviceToDelete.date} · {serviceToDelete.odometer.toLocaleString()} km</span>
          </div>
          <p className="text-xs text-neutral-300">Are you sure you want to remove this maintenance entry from your service record?</p>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setServiceToDelete(null)}
              className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) playTickSound();
                onDeleteService(serviceToDelete.id);
                setServiceToDelete(null);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg cursor-pointer transition-colors"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      )}

      {/* History Records List */}
      {filtered.length === 0 ? (
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-12 text-center">
          <History className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-white">No Service Records Found</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            {searchTerm ? 'Try adjusting your search filters.' : 'Click "Log Service" above to record your latest 2,000 km service.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((record) => (
            <div
              key={record.id}
              className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base tracking-tight">{record.title}</h3>
                    <span className="text-xs text-neutral-400">·</span>
                    <span className="font-mono-numbers text-xs font-semibold text-amber-400">
                      {record.odometer.toLocaleString()} km
                    </span>
                  </div>

                  {/* Clean unboxed metadata with separators (no pill badges) */}
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                    <span>{record.date}</span>
                    <span>·</span>
                    <span>{record.performedBy}</span>
                    {record.mechanicOrShopName && (
                      <>
                        <span>·</span>
                        <span className="text-neutral-300">{record.mechanicOrShopName}</span>
                      </>
                    )}
                    <span>·</span>
                    <span className="font-mono-numbers text-neutral-200 font-semibold">
                      {record.currency}{record.cost.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start">
                  <button
                    type="button"
                    onClick={() => setServiceToDelete(record)}
                    title="Delete record"
                    className="p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tasks completed */}
              {record.itemsCompleted.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-neutral-800/80">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 block mb-1.5">
                    Tasks & Components Checked:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {record.itemsCompleted.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-xs text-neutral-300 bg-neutral-950/80 px-2 py-0.5 rounded border border-neutral-800/80"
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Oil & Notes */}
              {(record.oilUsed || record.notes) && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/60">
                  {record.oilUsed && (
                    <div>
                      <span className="text-[11px] text-neutral-400 block font-medium">Oil Brand / Grade</span>
                      <span className="text-neutral-200 mt-0.5 block">{record.oilUsed}</span>
                    </div>
                  )}
                  {record.notes && (
                    <div>
                      <span className="text-[11px] text-neutral-400 block font-medium">Observations & Notes</span>
                      <span className="text-neutral-300 mt-0.5 block">{record.notes}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
