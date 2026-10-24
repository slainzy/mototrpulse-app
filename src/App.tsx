/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BikeProfile, ComponentItem, ServiceRecord, RideLog } from './types';
import {
  loadBikes,
  saveBikes,
  loadActiveBikeId,
  saveActiveBikeId,
  loadComponents,
  saveComponents,
  loadServices,
  saveServices,
  loadRides,
  saveRides,
  loadSoundEnabled,
  saveSoundEnabled,
} from './utils/storage';
import { playAlertChime, playTickSound } from './utils/audio';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CockpitDashboard } from './components/CockpitDashboard';
import { ComponentChecklist } from './components/ComponentChecklist';
import { ServiceHistoryList } from './components/ServiceHistoryList';
import { RideLogList } from './components/RideLogList';
import { MaintenanceGuide } from './components/MaintenanceGuide';
import { LogServiceModal } from './components/LogServiceModal';
import { RideLoggerModal } from './components/RideLoggerModal';
import { BikeManagerModal } from './components/BikeManagerModal';
import { PhoneDeployModal } from './components/PhoneDeployModal';
import { SetIntervalModal } from './components/SetIntervalModal';

export default function App() {
  const [bikes, setBikes] = useState<BikeProfile[]>(() => loadBikes());
  const [activeBikeId, setActiveBikeId] = useState<string>(() => loadActiveBikeId(loadBikes()));
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => loadSoundEnabled());
  const [activeTab, setActiveTab] = useState<'cockpit' | 'checklist' | 'history' | 'rides' | 'guide'>('cockpit');

  // Active bike reference
  const currentBike = bikes.find((b) => b.id === activeBikeId) || bikes[0];

  const [components, setComponents] = useState<ComponentItem[]>(() =>
    loadComponents(currentBike?.id || 'default')
  );
  const [services, setServices] = useState<ServiceRecord[]>(() => loadServices());
  const [rides, setRides] = useState<RideLog[]>(() => loadRides());

  // Modal controls
  const [isLogServiceOpen, setIsLogServiceOpen] = useState(false);
  const [isRideLoggerOpen, setIsRideLoggerOpen] = useState(false);
  const [isBikeManagerOpen, setIsBikeManagerOpen] = useState(false);
  const [isPhoneDeployOpen, setIsPhoneDeployOpen] = useState(false);
  const [isSetIntervalOpen, setIsSetIntervalOpen] = useState(false);

  // Sync to storage on state changes
  useEffect(() => {
    saveBikes(bikes);
  }, [bikes]);

  useEffect(() => {
    saveActiveBikeId(activeBikeId);
    if (currentBike) {
      setComponents(loadComponents(currentBike.id));
    }
  }, [activeBikeId, currentBike]);

  useEffect(() => {
    if (currentBike) {
      saveComponents(currentBike.id, components);
    }
  }, [components, currentBike]);

  useEffect(() => {
    saveServices(services);
  }, [services]);

  useEffect(() => {
    saveRides(rides);
  }, [rides]);

  useEffect(() => {
    saveSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playTickSound();
  };

  // Update odometer on active bike
  const handleUpdateOdometer = (newOdo: number) => {
    const updatedBikes = bikes.map((b) => {
      if (b.id === activeBikeId) {
        return { ...b, currentOdometer: newOdo };
      }
      return b;
    });
    setBikes(updatedBikes);
  };

  // Complete a service
  const handleSaveService = (
    record: ServiceRecord,
    shouldAdvanceCycle: boolean,
    updatedComponents: ComponentItem[]
  ) => {
    setServices([record, ...services]);
    setComponents(updatedComponents);

    if (shouldAdvanceCycle) {
      const updatedBikes = bikes.map((b) => {
        if (b.id === activeBikeId) {
          return {
            ...b,
            lastServiceOdometer: record.odometer,
            // If service odometer was ahead of current odo, advance current odo
            currentOdometer: Math.max(b.currentOdometer, record.odometer),
          };
        }
        return b;
      });
      setBikes(updatedBikes);
    }
  };

  // Log a ride
  const handleSaveRide = (ride: RideLog, newOdo: number) => {
    setRides([ride, ...rides]);
    handleUpdateOdometer(newOdo);

    // Check if reached service threshold
    const interval = currentBike.serviceIntervalKm || 2000;
    const nextDue = currentBike.lastServiceOdometer + interval;
    if (newOdo >= nextDue && currentBike.currentOdometer < nextDue) {
      if (soundEnabled) playAlertChime();
    }
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const handleDeleteRide = (id: string) => {
    setRides(rides.filter((r) => r.id !== id));
  };

  const handleSelectBike = (id: string) => {
    setActiveBikeId(id);
    setIsBikeManagerOpen(false);
  };

  const handleAddBike = (newBike: BikeProfile) => {
    const updated = [...bikes, newBike];
    setBikes(updated);
    saveBikes(updated);
    setActiveBikeId(newBike.id);
    saveActiveBikeId(newBike.id);
  };

  const handleUpdateBike = (updated: BikeProfile) => {
    const newBikes = bikes.map((b) => (b.id === updated.id ? updated : b));
    setBikes(newBikes);
    saveBikes(newBikes);
  };

  const handleDeleteBike = (id: string) => {
    if (bikes.length <= 1) return;
    const remaining = bikes.filter((b) => b.id !== id);
    setBikes(remaining);
    saveBikes(remaining);
    if (activeBikeId === id) {
      const nextId = remaining[0].id;
      setActiveBikeId(nextId);
      saveActiveBikeId(nextId);
    }
  };

  const handleSaveInterval = (newIntervalKm: number, syncEngineOil: boolean) => {
    const updatedBikes = bikes.map((b) => {
      if (b.id === activeBikeId) {
        return { ...b, serviceIntervalKm: newIntervalKm };
      }
      return b;
    });
    setBikes(updatedBikes);
    saveBikes(updatedBikes);

    if (syncEngineOil) {
      const updatedComponents = components.map((c) => {
        if (c.id === 'comp-engine-oil' || c.id === 'comp-oil-filter') {
          return {
            ...c,
            recommendedIntervalKm: newIntervalKm,
            warningThresholdKm: Math.round(newIntervalKm * 0.1),
          };
        }
        return c;
      });
      setComponents(updatedComponents);
      saveComponents(currentBike.id, updatedComponents);
    }
  };

  if (!currentBike) {
    return <div className="p-8 text-center text-white">Loading motorcycle profile...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Top Navigation conforming to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogService={() => setIsLogServiceOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        {activeTab === 'cockpit' && (
          <CockpitDashboard
            bike={currentBike}
            allBikes={bikes}
            onSelectBike={handleSelectBike}
            components={components}
            recentServices={services.filter((s) => s.bikeId === currentBike.id)}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onUpdateOdometer={handleUpdateOdometer}
            onOpenLogService={() => setIsLogServiceOpen(true)}
            onOpenRideLogger={() => setIsRideLoggerOpen(true)}
            onOpenBikeManager={() => setIsBikeManagerOpen(true)}
            onOpenDeployToPhone={() => setIsPhoneDeployOpen(true)}
            onOpenSetInterval={() => setIsSetIntervalOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'checklist' && (
          <ComponentChecklist
            bike={currentBike}
            components={components}
            soundEnabled={soundEnabled}
            onUpdateComponents={setComponents}
          />
        )}

        {activeTab === 'history' && (
          <ServiceHistoryList
            bike={currentBike}
            services={services}
            soundEnabled={soundEnabled}
            onDeleteService={handleDeleteService}
            onOpenLogService={() => setIsLogServiceOpen(true)}
          />
        )}

        {activeTab === 'rides' && (
          <RideLogList
            bike={currentBike}
            rides={rides}
            soundEnabled={soundEnabled}
            onDeleteRide={handleDeleteRide}
            onOpenRideLogger={() => setIsRideLoggerOpen(true)}
          />
        )}

        {activeTab === 'guide' && <MaintenanceGuide />}
      </main>

      {/* Mobile Bottom Navigation for Thumb Reachability */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals */}
      {isLogServiceOpen && (
        <LogServiceModal
          bike={currentBike}
          components={components}
          soundEnabled={soundEnabled}
          onClose={() => setIsLogServiceOpen(false)}
          onSaveService={handleSaveService}
        />
      )}

      {isRideLoggerOpen && (
        <RideLoggerModal
          bike={currentBike}
          soundEnabled={soundEnabled}
          onClose={() => setIsRideLoggerOpen(false)}
          onSaveRide={handleSaveRide}
        />
      )}

      {isBikeManagerOpen && (
        <BikeManagerModal
          bikes={bikes}
          activeBikeId={activeBikeId}
          soundEnabled={soundEnabled}
          onSelectBike={handleSelectBike}
          onAddBike={handleAddBike}
          onUpdateBike={handleUpdateBike}
          onDeleteBike={handleDeleteBike}
          onClose={() => setIsBikeManagerOpen(false)}
        />
      )}

      {isPhoneDeployOpen && (
        <PhoneDeployModal onClose={() => setIsPhoneDeployOpen(false)} />
      )}

      {isSetIntervalOpen && (
        <SetIntervalModal
          bike={currentBike}
          soundEnabled={soundEnabled}
          onClose={() => setIsSetIntervalOpen(false)}
          onSaveInterval={handleSaveInterval}
        />
      )}
    </div>
  );
}
