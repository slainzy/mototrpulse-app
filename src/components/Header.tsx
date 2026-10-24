/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  activeTab: 'cockpit' | 'checklist' | 'history' | 'rides' | 'guide';
  setActiveTab: (tab: 'cockpit' | 'checklist' | 'history' | 'rides' | 'guide') => void;
  onOpenLogService: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenLogService }) => {
  return (
    <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab('cockpit')}
            className="text-xl font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            MotoPulse
          </button>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-400">
            <button
              onClick={() => setActiveTab('cockpit')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'cockpit' ? 'text-amber-400 underline underline-offset-8 decoration-2 decoration-amber-400 font-semibold' : ''
              }`}
            >
              Cockpit
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'checklist' ? 'text-amber-400 underline underline-offset-8 decoration-2 decoration-amber-400 font-semibold' : ''
              }`}
            >
              Service Checklist
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'history' ? 'text-amber-400 underline underline-offset-8 decoration-2 decoration-amber-400 font-semibold' : ''
              }`}
            >
              Service History
            </button>
            <button
              onClick={() => setActiveTab('rides')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'rides' ? 'text-amber-400 underline underline-offset-8 decoration-2 decoration-amber-400 font-semibold' : ''
              }`}
            >
              Trip Log
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'guide' ? 'text-amber-400 underline underline-offset-8 decoration-2 decoration-amber-400 font-semibold' : ''
              }`}
            >
              Service Guide
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenLogService}
              className="px-4 py-2 text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] rounded-lg transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Log Service</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
