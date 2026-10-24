/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BikeProfile, ComponentItem, ServiceRecord } from '../types';
import { playTickSound, playAlertChime } from '../utils/audio';
import { 
  Gauge, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Bell, 
  Plus, 
  Minus, 
  Edit3, 
  Volume2, 
  VolumeX, 
  Fuel, 
  Disc, 
  Layers, 
  ShieldAlert,
  ChevronRight,
  Sparkles,
  Smartphone,
  SlidersHorizontal
} from 'lucide-react';

interface CockpitDashboardProps {
  bike: BikeProfile;
  allBikes?: BikeProfile[];
  onSelectBike?: (id: string) => void;
  components: ComponentItem[];
  recentServices: ServiceRecord[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  onUpdateOdometer: (newOdo: number) => void;
  onOpenLogService: () => void;
  onOpenRideLogger: () => void;
  onOpenBikeManager: () => void;
  onOpenDeployToPhone: () => void;
  onOpenSetInterval: () => void;
  onNavigateTab: (tab: 'cockpit' | 'checklist' | 'history' | 'rides' | 'guide') => void;
}

export const CockpitDashboard: React.FC<CockpitDashboardProps> = ({
  bike,
  allBikes,
  onSelectBike,
  components,
  recentServices,
  soundEnabled,
  onToggleSound,
  onUpdateOdometer,
  onOpenLogService,
  onOpenRideLogger,
  onOpenBikeManager,
  onOpenDeployToPhone,
  onOpenSetInterval,
  onNavigateTab,
}) => {
  const [isEditingOdo, setIsEditingOdo] = useState(false);
  const [customOdoInput, setCustomOdoInput] = useState(bike.currentOdometer.toString());
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Calculations for 2000 km routine cycle
  const interval = bike.serviceIntervalKm || 2000;
  const kmSinceLastService = bike.currentOdometer - bike.lastServiceOdometer;
  const nextServiceOdo = bike.lastServiceOdometer + interval;
  const remainingKm = nextServiceOdo - bike.currentOdometer;
  const isOverdue = remainingKm <= 0;
  const isUpcoming = remainingKm > 0 && remainingKm <= 250;
  const progressRatio = Math.min(Math.max(kmSinceLastService / interval, 0), 1.5);
  const percentage = Math.min(Math.round((kmSinceLastService / interval) * 100), 150);

  // Arc calculation for SVG gauge
  const radius = 90;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  // Use a 240 degree arc gauge
  const arcFraction = 0.75; // 270 degrees
  const arcLength = circumference * arcFraction;
  const filledArc = Math.min(Math.max((kmSinceLastService / interval), 0), 1) * arcLength;

  const handleQuickAdd = (km: number) => {
    if (soundEnabled) playTickSound();
    const newOdo = Math.max(0, bike.currentOdometer + km);
    onUpdateOdometer(newOdo);

    if (newOdo >= nextServiceOdo && bike.currentOdometer < nextServiceOdo) {
      if (soundEnabled) playAlertChime();
      triggerPushNotification(`⚠️ ${interval.toLocaleString()} km Service Due for ${bike.name}!`, `Odometer reached ${newOdo} km. Time for fresh engine oil and service inspection.`);
    }
  };

  const handleManualOdoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customOdoInput, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      if (soundEnabled) playTickSound();
      onUpdateOdometer(parsed);
      setIsEditingOdo(false);

      if (parsed >= nextServiceOdo && bike.currentOdometer < nextServiceOdo) {
        if (soundEnabled) playAlertChime();
        triggerPushNotification(`⚠️ ${interval.toLocaleString()} km Service Due for ${bike.name}!`, `Odometer reached ${parsed} km. Time for fresh engine oil and service inspection.`);
      }
    }
  };

  const triggerPushNotification = (title: string, body: string) => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(title, {
            body,
            icon: '/favicon.ico',
          });
        } catch {
          // Ignore
        }
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification(title, { body });
          }
        });
      }
    }
  };

  const handleTestAlert = () => {
    if (soundEnabled) playAlertChime();
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          new Notification('MotoPulse Alert Activated', {
            body: `You will be alerted at ${nextServiceOdo.toLocaleString()} km for your next 2,000 km service!`,
          });
        }
      });
    } else if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('MotoPulse Alert Test', {
        body: `Next service due in ${Math.max(0, remainingKm).toLocaleString()} km at ${nextServiceOdo.toLocaleString()} km odometer.`,
      });
    }
    setNotificationMsg('Notification test triggered! Cockpit alert chime sounded.');
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Determine critical components due
  const componentsDueCount = components.filter(
    (c) => (c.lastReplacedOdometer + c.recommendedIntervalKm) <= bike.currentOdometer
  ).length;

  return (
    <div className="space-y-6">
      {/* Bike Switcher & Ambient Toolbar Card */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5">
        {/* Top Section: Motor Name and Specs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Gauge className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-base sm:text-lg tracking-tight truncate">{bike.name}</span>
                <span className="text-xs text-neutral-500">·</span>
                <span className="text-xs text-neutral-300 font-mono bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">{bike.plateNumber}</span>
                <span className="text-xs text-neutral-500">·</span>
                <span className="text-xs text-neutral-400 font-mono-numbers">{bike.engineCc}cc</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-400">
                <span>Service Target:</span>
                <button
                  type="button"
                  onClick={onOpenSetInterval}
                  className="text-amber-400 hover:text-amber-300 font-mono-numbers font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  title="Change custom service mileage interval"
                >
                  <span>Every {interval.toLocaleString()} km</span>
                  <SlidersHorizontal className="w-3 h-3 text-amber-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick bike switcher chips if user has multiple motorcycles */}
          {allBikes && allBikes.length > 1 && onSelectBike && (
            <div className="w-full sm:w-auto max-w-full overflow-x-auto touch-pan-x [scrollbar-width:none]">
              <div className="flex items-center gap-1.5 min-w-max p-1 bg-neutral-950 rounded-lg border border-neutral-800">
                <span className="text-[10px] uppercase font-semibold text-neutral-400 px-1.5">Bikes:</span>
                {allBikes.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => onSelectBike(b.id)}
                    className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap cursor-pointer transition-colors ${
                      b.id === bike.id
                        ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* First Menu Under Motor Name: Slideable horizontally on phones so it never overflows off-screen */}
        <div className="w-full max-w-full space-y-1 pt-1 border-t border-neutral-800/60">
          <div className="flex items-center justify-between text-neutral-400 text-[11px] sm:hidden mb-0.5">
            <span className="text-[10px] text-neutral-400 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-amber-400" />
              <span>Quick Controls</span>
            </span>
            <span className="text-[10px] text-neutral-400">Swipe menu →</span>
          </div>

          <div className="w-full max-w-full overflow-x-auto pb-1 pt-0.5 touch-pan-x [scrollbar-width:thin] scrollbar-thumb-neutral-800">
            <div className="flex items-center gap-2 min-w-max p-1 bg-neutral-950 rounded-xl border border-neutral-800">
              <button
                type="button"
                onClick={onOpenSetInterval}
                className="min-h-[38px] px-3.5 py-1.5 text-xs font-semibold text-neutral-200 hover:text-white bg-neutral-800 hover:bg-neutral-700 active:scale-[0.98] rounded-lg border border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 whitespace-nowrap"
                title="Set custom service interval mileage"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span>Set Interval ({interval.toLocaleString()} km)</span>
              </button>

              <button
                type="button"
                onClick={onOpenDeployToPhone}
                className="min-h-[38px] px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 whitespace-nowrap"
                title="Scan QR or install as mobile app on your phone"
              >
                <Smartphone className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Install to Phone</span>
              </button>

              <button
                type="button"
                onClick={onOpenBikeManager}
                className="min-h-[38px] px-3.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 active:scale-[0.98] rounded-lg border border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
              >
                <Layers className="w-3.5 h-3.5 text-neutral-400" />
                <span>Switch / Edit Bike</span>
              </button>

              <button
                type="button"
                onClick={onToggleSound}
                aria-label="Toggle Sound"
                className="min-h-[38px] px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 active:scale-[0.98] rounded-lg border border-neutral-700 transition-colors cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5"
                title={soundEnabled ? 'Sound enabled' : 'Sound muted'}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sound: ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Sound: MUTED</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleTestAlert}
                className="min-h-[38px] px-3.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 active:scale-[0.98] rounded-lg border border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
                title="Test notification and audio chime"
              >
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>Test Alert</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {notificationMsg && (
        <div className="p-3 bg-neutral-900 border border-amber-500/30 rounded-lg text-xs text-amber-300 flex items-center justify-between">
          <span>{notificationMsg}</span>
          <button onClick={() => setNotificationMsg(null)} className="text-neutral-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Hero Instrument Cluster Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Visual Instrument Gauge (7 cols) */}
        <div className="lg:col-span-7 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Cluster Header */}
          <div className="flex items-center justify-between relative z-10 mb-4">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">Motorcycle Instrument Cluster</span>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">{interval.toLocaleString()} km Service Monitor</h2>
            </div>

            {/* Overdue / Status Banner */}
            <div>
              {isOverdue ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2.5 py-1 rounded-md">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>OVERDUE BY {Math.abs(remainingKm).toLocaleString()} KM</span>
                </div>
              ) : isUpcoming ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-950/50 border border-amber-800/80 px-2.5 py-1 rounded-md">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>DUE SOON: {remainingKm.toLocaleString()} KM LEFT</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>HEALTHY: {remainingKm.toLocaleString()} KM LEFT</span>
                </div>
              )}
            </div>
          </div>

          {/* Central TFT Digital Odometer & Radial Arc */}
          <div className="py-4 flex flex-col sm:flex-row items-center justify-around gap-6 relative z-10">
            {/* Circular Gauge Representation */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-52 h-52 -rotate-90 transform" viewBox="0 0 220 220">
                {/* Background Track */}
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  stroke="#262626"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={`${arcLength} ${circumference}`}
                  strokeLinecap="round"
                />
                {/* Progress Value */}
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  stroke={isOverdue ? '#f43f5e' : isUpcoming ? '#f59e0b' : '#10b981'}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={`${filledArc} ${circumference}`}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              </svg>

              {/* Gauge Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">Cycle Progress</span>
                <span className={`text-4xl font-extrabold font-mono-numbers mt-0.5 ${
                  isOverdue ? 'text-rose-400' : isUpcoming ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {percentage}%
                </span>
                <span className="text-xs text-neutral-400 mt-1">
                  {kmSinceLastService.toLocaleString()} / {interval.toLocaleString()} km
                </span>
              </div>
            </div>

            {/* Odometer Digital Readout */}
            <div className="flex-1 w-full max-w-xs space-y-3">
              <div className="bg-neutral-950/90 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
                  <span className="uppercase tracking-wider">Current Odometer</span>
                  <button
                    onClick={() => {
                      setCustomOdoInput(bike.currentOdometer.toString());
                      setIsEditingOdo(!isEditingOdo);
                    }}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isEditingOdo ? 'Close' : 'Edit'}</span>
                  </button>
                </div>

                {isEditingOdo ? (
                  <form onSubmit={handleManualOdoSubmit} className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={customOdoInput}
                        onChange={(e) => setCustomOdoInput(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-lg font-mono-numbers text-white focus:outline-none focus:border-amber-400"
                        autoFocus
                      />
                      <span className="text-sm font-medium text-neutral-400">km</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-medium py-1 px-2 rounded text-xs cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingOdo(false)}
                        className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 py-1 px-2 rounded text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold font-mono-numbers text-white tracking-wider">
                      {bike.currentOdometer.toLocaleString()}
                    </span>
                    <span className="text-sm font-semibold text-neutral-400">KM TOTAL</span>
                  </div>
                )}
              </div>

              {/* Service Milestones Summary */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-lg p-2.5">
                  <span className="text-neutral-400 block text-[11px]">Last Service</span>
                  <span className="font-mono-numbers font-semibold text-neutral-200 text-sm">
                    {bike.lastServiceOdometer.toLocaleString()} km
                  </span>
                </div>
                <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-lg p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 block text-[11px]">Next Target</span>
                    <button
                      type="button"
                      onClick={onOpenSetInterval}
                      className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                    >
                      {interval.toLocaleString()}km
                    </button>
                  </div>
                  <span className={`font-mono-numbers font-semibold text-sm ${
                    isOverdue ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                    {nextServiceOdo.toLocaleString()} km
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Increment Touch Buttons for Rapid Mileage Logging */}
          <div className="pt-4 border-t border-neutral-800/80 mt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-neutral-400 font-medium">Quick Mileage Increments</span>
              <button
                onClick={onOpenRideLogger}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <span>+ Log Specific Ride</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {[
                { label: '+10 km', val: 10 },
                { label: '+25 km', val: 25 },
                { label: '+50 km', val: 50 },
                { label: '+100 km', val: 100 },
                { label: '+200 km', val: 200 },
              ].map((btn) => (
                <button
                  key={btn.val}
                  onClick={() => handleQuickAdd(btn.val)}
                  className="min-h-[44px] bg-neutral-800/80 hover:bg-neutral-700 active:scale-[0.97] border border-neutral-700/80 rounded-lg text-xs font-mono-numbers font-semibold text-neutral-200 transition-all flex items-center justify-center cursor-pointer"
                >
                  {btn.label}
                </button>
              ))}
              <button
                onClick={() => handleQuickAdd(-50)}
                title="Subtract 50 km if entered by mistake"
                className="min-h-[44px] bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-xs font-mono-numbers text-neutral-400 hover:text-neutral-200 flex items-center justify-center gap-0.5 cursor-pointer"
              >
                <Minus className="w-3 h-3" />
                <span>50</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Motorcycle Spec & Checklist Summary (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Action Callout Card */}
          <div className={`p-5 rounded-2xl border ${
            isOverdue 
              ? 'bg-rose-950/20 border-rose-800/60' 
              : isUpcoming 
              ? 'bg-amber-950/20 border-amber-800/60' 
              : 'bg-neutral-900/80 border-neutral-800'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400">Status Assessment</span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {isOverdue 
                    ? 'Motorcycle Service is Overdue!' 
                    : isUpcoming 
                    ? `${interval.toLocaleString()} km Service Coming Up` 
                    : 'All Systems Normal'}
                </h3>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  {isOverdue
                    ? `You have exceeded the ${interval.toLocaleString()} km interval by ${Math.abs(remainingKm).toLocaleString()} km. Fresh engine oil and drivetrain lubrication protect internal gear teeth and wet clutch plates.`
                    : isUpcoming
                    ? `Only ${remainingKm.toLocaleString()} km remaining before the next ${interval.toLocaleString()} km oil drain and service check.`
                    : `You have ${remainingKm.toLocaleString()} km remaining until the next routine ${interval.toLocaleString()} km oil service.`}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={onOpenLogService}
                className="flex-1 min-h-[44px] px-4 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Wrench className="w-4 h-4" />
                <span>Complete & Log Service</span>
              </button>
              <button
                onClick={() => onNavigateTab('checklist')}
                className="px-4 py-2.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl border border-neutral-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Full Checklist</span>
              </button>
            </div>
          </div>

          {/* Quick Bike Specs Card */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Quick Reference Specs</span>
                <button
                  onClick={onOpenBikeManager}
                  className="text-xs text-amber-400 hover:text-amber-300 cursor-pointer"
                >
                  Edit Specs
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-xl">
                  <div className="flex items-center gap-2 text-neutral-400 mb-1">
                    <Fuel className="w-3.5 h-3.5 text-amber-400" />
                    <span>Engine Oil Spec</span>
                  </div>
                  <span className="font-medium text-white block truncate">{bike.oilGrade || '10W-40 4T JASO MA2'}</span>
                  <span className="text-[11px] text-neutral-400 mt-0.5 block font-mono-numbers">Capacity: {bike.oilCapacityLiters} Liters</span>
                </div>

                <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-xl">
                  <div className="flex items-center gap-2 text-neutral-400 mb-1">
                    <Disc className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Cold Tire Pressure</span>
                  </div>
                  <span className="font-medium text-white block">F: {bike.frontTirePsi} PSI / R: {bike.rearTirePsi} PSI</span>
                  <span className="text-[11px] text-neutral-400 mt-0.5 block">Check cold before ride</span>
                </div>
              </div>
            </div>

            {/* Quick Component Health Summary */}
            <div className="mt-4 pt-4 border-t border-neutral-800">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-neutral-400">Tracked Components</span>
                <span className="text-neutral-300 font-medium">
                  {componentsDueCount > 0 ? (
                    <span className="text-rose-400 font-semibold">{componentsDueCount} Due for Attention</span>
                  ) : (
                    <span className="text-emerald-400">All within interval</span>
                  )}
                </span>
              </div>

              <div className="space-y-1.5">
                {components.slice(0, 3).map((comp) => {
                  const compDueOdo = comp.lastReplacedOdometer + comp.recommendedIntervalKm;
                  const compRemaining = compDueOdo - bike.currentOdometer;
                  const isCompDue = compRemaining <= 0;
                  return (
                    <div key={comp.id} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-neutral-950/40">
                      <span className="text-neutral-300 truncate max-w-[170px]">{comp.name}</span>
                      <span className={`font-mono-numbers ${isCompDue ? 'text-rose-400 font-semibold' : 'text-neutral-400'}`}>
                        {isCompDue ? `Overdue ${Math.abs(compRemaining)} km` : `${compRemaining} km left`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Photorealistic Hero Card Showcase */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-800 aspect-[21/9] max-h-56">
        <img
          src="/src/assets/images/motorcycle_dashboard_cluster_1792875957891.jpg"
          alt="Motorcycle digital instrument cluster at sunset"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent p-6 flex flex-col justify-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Rider Maintenance Rule</span>
          <h3 className="text-lg sm:text-xl font-bold text-white mt-1 max-w-md">
            Why Every 2,000 km Matters on Motorcycles
          </h3>
          <p className="text-xs text-neutral-300 mt-1 max-w-lg leading-relaxed hidden sm:block">
            Motorcycles run at 8,000–12,000+ RPM and share engine oil with the transmission and wet clutch. Fresh oil prevents premature gear pitting and clutch slippage.
          </p>
          <div className="mt-3">
            <button
              onClick={() => onNavigateTab('guide')}
              className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Read 2,000 km Service Checklist Guide</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Service History Quick Peek */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Logbook</span>
            <h3 className="text-base font-bold text-white mt-0.5">Recent Maintenance Records</h3>
          </div>
          <button
            onClick={() => onNavigateTab('history')}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({recentServices.length})</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {recentServices.length === 0 ? (
          <div className="py-6 text-center text-xs text-neutral-400">
            No service records logged yet. Click &quot;Log Service&quot; above to record your first 2,000 km service!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentServices.slice(0, 2).map((srv) => (
              <div key={srv.id} className="p-3.5 bg-neutral-950/70 border border-neutral-800/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{srv.title}</span>
                  <span className="font-mono-numbers text-amber-400 font-semibold">{srv.odometer.toLocaleString()} km</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <span>{srv.date}</span>
                  <span>·</span>
                  <span>{srv.performedBy}</span>
                  <span>·</span>
                  <span className="font-mono-numbers">{srv.currency}{srv.cost}</span>
                </div>
                {srv.itemsCompleted.length > 0 && (
                  <p className="text-xs text-neutral-300 truncate">
                    {srv.itemsCompleted.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
