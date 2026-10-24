/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Gauge, CheckSquare, History, Navigation, BookOpen } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'cockpit' | 'checklist' | 'history' | 'rides' | 'guide';
  setActiveTab: (tab: 'cockpit' | 'checklist' | 'history' | 'rides' | 'guide') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'cockpit' as const, label: 'Cockpit', icon: Gauge },
    { id: 'checklist' as const, label: 'Checklist', icon: CheckSquare },
    { id: 'history' as const, label: 'History', icon: History },
    { id: 'rides' as const, label: 'Trips', icon: Navigation },
    { id: 'guide' as const, label: 'Guide', icon: BookOpen },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800">
      <div className="grid grid-cols-5 items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-colors cursor-pointer ${
                isActive ? 'text-amber-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
