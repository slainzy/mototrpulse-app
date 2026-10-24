/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Fuel, 
  Disc, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  Wrench
} from 'lucide-react';

export const MaintenanceGuide: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<'oil' | 'chain' | 'spark' | 'brakes' | 'tires'>('oil');

  return (
    <div className="space-y-6">
      {/* Hero Guide Card with Generated Workshop Image */}
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="relative aspect-[21/8] max-h-60 w-full overflow-hidden">
          <img
            src="/src/assets/images/motorcycle_maintenance_bay_1792875956695.jpg"
            alt="Motorcycle maintenance workshop garage"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent p-6 flex flex-col justify-end">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Rider Masterclass</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              The 2,000 km Motorcycle Service Protocol
            </h2>
            <p className="text-xs text-neutral-300 mt-1 max-w-xl hidden sm:block">
              Motorcycle engines run up to 14,000 RPM and share engine oil with gearbox dog rings and wet clutch plates. Frequent 2,000 km servicing prevents catastrophic wear.
            </p>
          </div>
        </div>

        {/* Topic navigation tabs */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex flex-wrap gap-2">
          {[
            { id: 'oil', label: '1. Engine Oil & Filter (2,000 km)', icon: Fuel },
            { id: 'chain', label: '2. Drive Chain Care (1,000 km)', icon: Wrench },
            { id: 'spark', label: '3. Spark Plug & Combustion', icon: Zap },
            { id: 'brakes', label: '4. Brakes & Fluid Safety', icon: Disc },
            { id: 'tires', label: '5. Cold Tire PSI & Wear', icon: ShieldCheck },
          ].map((topic) => {
            const Icon = topic.icon;
            const isActive = activeTopic === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic.id as typeof activeTopic)}
                className={`px-3.5 py-2 text-xs font-medium rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{topic.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic Content Panel */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
        {activeTopic === 'oil' && (
          <div className="space-y-5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Section 01</span>
              <h3 className="text-lg font-bold text-white mt-1">Why 2,000 km Oil Changes Protect Your Motorcycle</h3>
              <p className="text-xs text-neutral-300 leading-relaxed mt-2">
                Unlike automobile engines where motor oil only lubricates pistons and crankshaft bearings, almost all production motorcycles (from 125cc to 1000cc) utilize a <strong className="text-white">unit construction engine</strong>. This means the engine oil simultaneously lubricates:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
                <span className="text-amber-400 font-bold text-sm block mb-1">High RPM Combustion</span>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Bikes cruise at 6,000–9,000 RPM where extreme heat breaks down petroleum shear polymers rapidly.
                </p>
              </div>

              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
                <span className="text-amber-400 font-bold text-sm block mb-1">Transmission Gears</span>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Gearbox teeth mesh under extreme pressure, physically slicing long-chain oil molecules (viscosity shear).
                </p>
              </div>

              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
                <span className="text-amber-400 font-bold text-sm block mb-1">Wet Clutch Friction</span>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Clutch fiber plates shed micro-particles into the oil. Always use JASO MA or MA2 oil with no moly slippage additives!
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                <span>5-Step DIY Oil Change Procedure</span>
              </h4>
              <ol className="text-xs text-neutral-300 space-y-1.5 list-decimal pl-4 leading-relaxed">
                <li><strong className="text-white">Warm up:</strong> Run the motor for 2-3 minutes so oil flows freely and suspends deposits, then switch off.</li>
                <li><strong className="text-white">Drain Plug:</strong> Place an oil pan under the engine. Loosen the drain plug with a box wrench. Watch out for hot oil.</li>
                <li><strong className="text-white">Crush Washer:</strong> Always discard the old aluminum/copper crush washer and install a fresh one to prevent crankcase leaks.</li>
                <li><strong className="text-white">Torque Spec:</strong> Never over-tighten! Typical motorcycle drain bolts require only <span className="font-mono-numbers text-amber-300">20 - 24 Nm</span>. Stripping aluminum engine casing threads is an expensive repair.</li>
                <li><strong className="text-white">Level Check:</strong> Fill with the exact specified volume (e.g. 1.0L). Stand the motorcycle upright on level ground and confirm the oil level rests between the Upper and Lower marks in the sight glass.</li>
              </ol>
            </div>
          </div>
        )}

        {activeTopic === 'chain' && (
          <div className="space-y-5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Section 02</span>
              <h3 className="text-lg font-bold text-white mt-1">Drive Chain Maintenance & Tensioning</h3>
              <p className="text-xs text-neutral-300 leading-relaxed mt-2">
                A dry, neglected chain consumes horsepower, accelerates sprocket wear, and risks snapping at highway speeds. Clean and lube your chain every 500 to 1,000 km, or immediately after riding in the rain.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                <span className="font-bold text-white block">Dos & Essential Rules</span>
                <ul className="space-y-1.5 text-neutral-300 list-disc pl-4">
                  <li>Use dedicated kerosene or O-ring safe solvent with a three-sided chain grunge brush.</li>
                  <li>Lube the <strong className="text-white">inside run</strong> of the chain so centrifugal force pushes lube outward into rollers.</li>
                  <li>Let lube sit for 15 minutes before riding to allow solvent carrier to evaporate.</li>
                  <li>Target 25mm to 35mm of vertical slack at the tightest spot.</li>
                </ul>
              </div>

              <div className="p-4 bg-rose-950/20 border border-rose-800/40 rounded-xl space-y-2">
                <span className="font-bold text-rose-300 block">Critical Warnings</span>
                <ul className="space-y-1.5 text-neutral-300 list-disc pl-4">
                  <li><strong className="text-rose-400">NEVER run the engine in gear</strong> while cleaning or lubing! Many riders have lost fingers to the rear sprocket. Always rotate the wheel by hand in neutral.</li>
                  <li>Never use gasoline or brake cleaner—they dissolve rubber O-rings.</li>
                  <li>A chain that is too tight damages the transmission countershaft bearing.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTopic === 'spark' && (
          <div className="space-y-5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Section 03</span>
              <h3 className="text-lg font-bold text-white mt-1">Spark Plug Inspection & Reading Combustion</h3>
              <p className="text-xs text-neutral-300 leading-relaxed mt-2">
                Your spark plug is the window into your engine&apos;s combustion chamber. Inspect every 2,000–4,000 km to catch lean conditions before piston damage occurs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-neutral-950 border border-emerald-800/40 rounded-xl">
                <span className="text-emerald-400 font-bold block mb-1">Light Tan / Grey</span>
                <p className="text-neutral-300">
                  Ideal air-fuel ratio. Fuel burns cleanly with correct ignition timing and engine temperature.
                </p>
              </div>

              <div className="p-4 bg-neutral-950 border border-amber-800/40 rounded-xl">
                <span className="text-amber-400 font-bold block mb-1">Dry Black Soot</span>
                <p className="text-neutral-300">
                  Rich mixture, dirty air filter, weak spark, or excessive short trips and idling without reaching full operating temp.
                </p>
              </div>

              <div className="p-4 bg-neutral-950 border border-rose-800/40 rounded-xl">
                <span className="text-rose-400 font-bold block mb-1">White / Blistered</span>
                <p className="text-neutral-300">
                  Dangerous lean mixture or overheating. Risk of piston crown hole. Check for intake vacuum leaks immediately!
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTopic === 'brakes' && (
          <div className="space-y-5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Section 04</span>
              <h3 className="text-lg font-bold text-white mt-1">Brake System & Fluid Inspection</h3>
              <p className="text-xs text-neutral-300 leading-relaxed mt-2">
                Brakes are the primary safety mechanism on two wheels. Inspect pad friction material thickness and hydraulic fluid clarity every 2,000 km.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
                <h4 className="font-bold text-white mb-1.5">Brake Pad Thickness</h4>
                <p className="text-neutral-400 leading-relaxed">
                  Shine a flashlight into the brake caliper. If the friction pad material is worn down to <span className="text-amber-400 font-mono-numbers font-semibold">1.5 mm</span> or the indicator wear groove has vanished, replace the pads before the steel backing plate gouges the rotor.
                </p>
              </div>

              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
                <h4 className="font-bold text-white mb-1.5">Brake Fluid Color</h4>
                <p className="text-neutral-400 leading-relaxed">
                  DOT 4 brake fluid is hygroscopic (absorbs moisture from humidity). Fresh fluid is pale golden/clear. If your master cylinder reservoir fluid is dark brown or tea-colored, flush and bleed with fresh fluid.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTopic === 'tires' && (
          <div className="space-y-5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Section 05</span>
              <h3 className="text-lg font-bold text-white mt-1">Cold Tire Pressures & Contact Patch</h3>
              <p className="text-xs text-neutral-300 leading-relaxed mt-2">
                Motorcycles have only two small contact patches the size of a credit card. Proper inflation is the single biggest factor in handling, fuel economy, and tire longevity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
                <h4 className="font-bold text-white mb-1.5">Always Check Cold</h4>
                <p className="text-neutral-400 leading-relaxed">
                  Friction from riding heats the tire and expands air pressure by 3 to 5 PSI. Check pressures in the morning before riding or after the bike has been parked for at least 2 hours.
                </p>
              </div>

              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
                <h4 className="font-bold text-white mb-1.5">Signs of Underinflation</h4>
                <p className="text-neutral-400 leading-relaxed">
                  Underinflated tires feel sluggish in turn-in, track uneven road grooves, and cause rapid scalloping (cupping) along the tread shoulder.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
