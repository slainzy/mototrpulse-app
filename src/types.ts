/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BikeProfile {
  id: string;
  name: string;
  model: string;
  plateNumber: string;
  year: number;
  engineCc: number;
  currentOdometer: number; // in km
  lastServiceOdometer: number; // in km
  serviceIntervalKm: number; // default: 2000 km
  oilGrade: string; // e.g. "10W-40 4T Fully Synthetic"
  oilCapacityLiters: number;
  frontTirePsi: number;
  rearTirePsi: number;
  notes?: string;
  createdAt: string;
}

export interface ComponentItem {
  id: string;
  name: string;
  category: 'engine' | 'drivetrain' | 'chassis' | 'safety';
  recommendedIntervalKm: number;
  lastReplacedOdometer: number;
  description: string;
  warningThresholdKm: number; // e.g. 200 km before due
}

export interface ServiceRecord {
  id: string;
  bikeId: string;
  odometer: number;
  date: string;
  type: 'routine_2000' | 'oil_only' | 'chain_service' | 'major_overhaul' | 'custom';
  title: string;
  itemsCompleted: string[];
  cost: number;
  currency: string;
  performedBy: 'DIY (Self)' | 'Authorized Dealer' | 'Independent Workshop';
  mechanicOrShopName?: string;
  oilUsed?: string;
  notes?: string;
}

export interface RideLog {
  id: string;
  bikeId: string;
  date: string;
  distanceKm: number;
  startingOdo: number;
  endingOdo: number;
  title: string;
  purpose: 'commute' | 'leisure' | 'touring' | 'errand';
}
