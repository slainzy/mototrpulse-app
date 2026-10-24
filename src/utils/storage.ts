/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BikeProfile, ComponentItem, ServiceRecord, RideLog } from '../types';

const STORAGE_KEYS = {
  BIKES: 'motopulse_bikes_v1',
  ACTIVE_BIKE_ID: 'motopulse_active_bike_id_v1',
  COMPONENTS: 'motopulse_components_v1',
  SERVICES: 'motopulse_services_v1',
  RIDES: 'motopulse_rides_v1',
  SOUND_ENABLED: 'motopulse_sound_enabled_v1',
};

export const DEFAULT_BIKES: BikeProfile[] = [
  {
    id: 'bike-yamaha-mt15',
    name: 'Yamaha MT-15',
    model: 'Hyper Naked 155 VVA',
    plateNumber: 'WYB 4280',
    year: 2024,
    engineCc: 155,
    currentOdometer: 5850,
    lastServiceOdometer: 4000,
    serviceIntervalKm: 2000,
    oilGrade: '10W-40 4T Full Synthetic (JASO MA2)',
    oilCapacityLiters: 1.0,
    frontTirePsi: 33,
    rearTirePsi: 36,
    notes: 'Yamalube / Motul 7100. Drain bolt torque: 20 Nm. Clean chain every weekend.',
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'bike-honda-cb500x',
    name: 'Honda CB500X',
    model: 'Adventure Sport Twin',
    plateNumber: 'KLM 9012',
    year: 2023,
    engineCc: 471,
    currentOdometer: 14200,
    lastServiceOdometer: 14000,
    serviceIntervalKm: 2000,
    oilGrade: '10W-30 / 10W-40 4T Semi-Synth',
    oilCapacityLiters: 2.7,
    frontTirePsi: 36,
    rearTirePsi: 42,
    notes: 'Touring setup. Check chain tension before long weekend rides.',
    createdAt: '2023-06-10T08:00:00Z',
  },
];

export const DEFAULT_COMPONENTS: ComponentItem[] = [
  {
    id: 'comp-engine-oil',
    name: 'Engine Oil (4T JASO MA2)',
    category: 'engine',
    recommendedIntervalKm: 2000,
    lastReplacedOdometer: 4000,
    description: 'Vital 2,000 km change. Motorcycle oil lubricates the engine, gearbox & wet clutch.',
    warningThresholdKm: 200,
  },
  {
    id: 'comp-oil-filter',
    name: 'Engine Oil Filter & O-Ring',
    category: 'engine',
    recommendedIntervalKm: 2000,
    lastReplacedOdometer: 4000,
    description: 'Prevents metal shavings and clutch friction debris from circulating.',
    warningThresholdKm: 200,
  },
  {
    id: 'comp-chain-lube',
    name: 'Drive Chain Clean, Tension & Lube',
    category: 'drivetrain',
    recommendedIntervalKm: 1000,
    lastReplacedOdometer: 5200,
    description: 'Clean with kerosene/chain cleaner, adjust slack to 25-35mm, apply o-ring wax.',
    warningThresholdKm: 150,
  },
  {
    id: 'comp-spark-plug',
    name: 'Spark Plug Inspection / Gap',
    category: 'engine',
    recommendedIntervalKm: 4000,
    lastReplacedOdometer: 4000,
    description: 'Inspect electrode color and deposit; gap should be 0.7 - 0.8 mm.',
    warningThresholdKm: 400,
  },
  {
    id: 'comp-air-filter',
    name: 'Air Filter Element',
    category: 'engine',
    recommendedIntervalKm: 6000,
    lastReplacedOdometer: 2000,
    description: 'Blow dust out with compressed air or replace if dirty to maintain power.',
    warningThresholdKm: 500,
  },
  {
    id: 'comp-brake-pads',
    name: 'Brake Pads & Fluid Level',
    category: 'safety',
    recommendedIntervalKm: 4000,
    lastReplacedOdometer: 4000,
    description: 'Ensure pad material > 1.5mm and brake fluid sight glass is clear and full.',
    warningThresholdKm: 400,
  },
  {
    id: 'comp-tire-check',
    name: 'Tire Pressure & Tread Wear',
    category: 'chassis',
    recommendedIntervalKm: 500,
    lastReplacedOdometer: 5500,
    description: 'Check cold PSI and inspect for cuts, foreign nails, and center flat spotting.',
    warningThresholdKm: 100,
  },
];

export const DEFAULT_SERVICES: ServiceRecord[] = [
  {
    id: 'srv-4000',
    bikeId: 'bike-yamaha-mt15',
    odometer: 4000,
    date: '2024-08-12',
    type: 'routine_2000',
    title: '4,000 km Routine Service',
    itemsCompleted: ['Engine Oil (4T JASO MA2)', 'Engine Oil Filter & O-Ring', 'Drive Chain Clean, Tension & Lube', 'Brake Pads & Fluid Level'],
    cost: 45,
    currency: '$',
    performedBy: 'DIY (Self)',
    oilUsed: 'Motul 7100 10W-40 4T (1.0L)',
    notes: 'Replaced crush washer on drain bolt. Torqued to 20 Nm. Chain slack set to 30mm.',
  },
  {
    id: 'srv-2000',
    bikeId: 'bike-yamaha-mt15',
    odometer: 2000,
    date: '2024-04-18',
    type: 'routine_2000',
    title: '2,000 km Routine Service',
    itemsCompleted: ['Engine Oil (4T JASO MA2)', 'Engine Oil Filter & O-Ring', 'Air Filter Element', 'Drive Chain Clean, Tension & Lube'],
    cost: 55,
    currency: '$',
    performedBy: 'Authorized Dealer',
    mechanicOrShopName: 'Yamaha MotoCare Center',
    oilUsed: 'Yamalube 4T Full Synthetic',
    notes: 'Standard 2,000 km interval warranty service. All checks passed.',
  },
];

export const DEFAULT_RIDES: RideLog[] = [
  {
    id: 'ride-1',
    bikeId: 'bike-yamaha-mt15',
    date: '2024-10-22',
    distanceKm: 65,
    startingOdo: 5785,
    endingOdo: 5850,
    title: 'Evening Highway & City Loop',
    purpose: 'commute',
  },
  {
    id: 'ride-2',
    bikeId: 'bike-yamaha-mt15',
    date: '2024-10-19',
    distanceKm: 110,
    startingOdo: 5675,
    endingOdo: 5785,
    title: 'Coastal Hill Weekend Ride',
    purpose: 'leisure',
  },
];

// Helper functions for localStorage
export function loadBikes(): BikeProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BIKES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load bikes from storage', e);
  }
  return DEFAULT_BIKES;
}

export function saveBikes(bikes: BikeProfile[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.BIKES, JSON.stringify(bikes));
  } catch (e) {
    console.error('Failed to save bikes', e);
  }
}

export function loadActiveBikeId(bikes: BikeProfile[]): string {
  try {
    const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_BIKE_ID);
    if (id && bikes.some((b) => b.id === id)) return id;
  } catch (e) {
    console.error('Failed to load active bike id', e);
  }
  return bikes[0]?.id || DEFAULT_BIKES[0].id;
}

export function saveActiveBikeId(id: string) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_BIKE_ID, id);
  } catch (e) {
    console.error('Failed to save active bike id', e);
  }
}

export function loadComponents(bikeId: string): ComponentItem[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.COMPONENTS}_${bikeId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load components', e);
  }
  return DEFAULT_COMPONENTS;
}

export function saveComponents(bikeId: string, components: ComponentItem[]) {
  try {
    localStorage.setItem(`${STORAGE_KEYS.COMPONENTS}_${bikeId}`, JSON.stringify(components));
  } catch (e) {
    console.error('Failed to save components', e);
  }
}

export function loadServices(bikeId?: string): ServiceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (raw) {
      const all: ServiceRecord[] = JSON.parse(raw);
      if (bikeId) return all.filter((s) => s.bikeId === bikeId);
      return all;
    }
  } catch (e) {
    console.error('Failed to load services', e);
  }
  return bikeId ? DEFAULT_SERVICES.filter((s) => s.bikeId === bikeId) : DEFAULT_SERVICES;
}

export function saveServices(services: ServiceRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  } catch (e) {
    console.error('Failed to save services', e);
  }
}

export function loadRides(bikeId?: string): RideLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RIDES);
    if (raw) {
      const all: RideLog[] = JSON.parse(raw);
      if (bikeId) return all.filter((r) => r.bikeId === bikeId);
      return all;
    }
  } catch (e) {
    console.error('Failed to load rides', e);
  }
  return bikeId ? DEFAULT_RIDES.filter((r) => r.bikeId === bikeId) : DEFAULT_RIDES;
}

export function saveRides(rides: RideLog[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.RIDES, JSON.stringify(rides));
  } catch (e) {
    console.error('Failed to save rides', e);
  }
}

export function loadSoundEnabled(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
    return raw !== 'false';
  } catch {
    return true;
  }
}

export function saveSoundEnabled(enabled: boolean) {
  try {
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(enabled));
  } catch (e) {
    console.error('Failed to save sound preference', e);
  }
}

// Export and Import utilities
export function exportAllData() {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    bikes: loadBikes(),
    services: loadServices(),
    rides: loadRides(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `motopulse-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportServicesCSV(services: ServiceRecord[], bikeName: string) {
  const headers = ['Date', 'Odometer (km)', 'Service Type', 'Items Completed', 'Cost', 'Currency', 'Performed By', 'Workshop / Mechanic', 'Oil Used', 'Notes'];
  const rows = services.map((s) => [
    s.date,
    s.odometer,
    `"${s.title.replace(/"/g, '""')}"`,
    `"${s.itemsCompleted.join('; ').replace(/"/g, '""')}"`,
    s.cost,
    s.currency,
    s.performedBy,
    `"${(s.mechanicOrShopName || '').replace(/"/g, '""')}"`,
    `"${(s.oilUsed || '').replace(/"/g, '""')}"`,
    `"${(s.notes || '').replace(/"/g, '""')}"`,
  ]);
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `service-history-${bikeName.toLowerCase().replace(/\s+/g, '-')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
