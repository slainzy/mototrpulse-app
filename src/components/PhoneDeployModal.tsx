/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Smartphone, Copy, Check, Share2, PlusSquare, Download, X, QrCode, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PhoneDeployModalProps {
  onClose: () => void;
}

export const PhoneDeployModal: React.FC<PhoneDeployModalProps> = ({ onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activePlatform, setActivePlatform] = useState<'ios' | 'android'>(isIOS ? 'ios' : 'android');
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Default to the production shared app URL or current origin
  const appUrl =
    typeof window !== 'undefined' && window.location.origin.includes('run.app')
      ? window.location.origin
      : 'https://ais-pre-mbxazjawdid76awcv3j6vg-984367595777.asia-east1.run.app';

  useEffect(() => {
    QRCode.toDataURL(appUrl, {
      width: 260,
      margin: 1.5,
      color: {
        dark: '#0a0a0a',
        light: '#f5f5f5',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR', err));
  }, [appUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg my-8 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Deploy & Install on Your Phone</h2>
              <span className="text-xs text-neutral-400">Add to home screen as a standalone mobile app</span>
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

        <div className="p-6 space-y-6">
          {/* Native 1-Click Install if available on this browser */}
          {isInstallable && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-amber-300 block">Fast Install Available</span>
                <span className="text-xs text-neutral-300">Click below to install MotoPulse directly to your device.</span>
              </div>
              <button
                onClick={install}
                className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Install Now</span>
              </button>
            </div>
          )}

          {/* QR Code Scan Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-neutral-950 rounded-xl border border-neutral-800">
            <div className="p-2 bg-neutral-100 rounded-xl shrink-0 shadow-inner">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="MotoPulse QR Code" className="w-32 h-32 block rounded-lg" />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center text-neutral-500 text-xs">
                  Generating QR...
                </div>
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Step 1: Open on Phone</span>
              <h3 className="text-sm font-bold text-white">Scan with Camera or Copy Link</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Point your phone camera at the QR code to open the app on your mobile browser.
              </p>

              <button
                onClick={handleCopy}
                className="w-full sm:w-auto px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
                <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Mobile App Link'}</span>
              </button>
            </div>
          </div>

          {/* Platform Guide Tabs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Step 2: Add to Home Screen
              </span>

              {/* Segmented control buttons */}
              <div className="flex p-1 bg-neutral-950 rounded-lg border border-neutral-800">
                <button
                  onClick={() => setActivePlatform('ios')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    activePlatform === 'ios'
                      ? 'bg-neutral-800 text-amber-400 font-semibold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  iPhone (iOS)
                </button>
                <button
                  onClick={() => setActivePlatform('android')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    activePlatform === 'android'
                      ? 'bg-neutral-800 text-amber-400 font-semibold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Android
                </button>
              </div>
            </div>

            {/* iOS Instructions */}
            {activePlatform === 'ios' && (
              <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-xl space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Open link in Safari</span>
                    <span className="text-neutral-400">Make sure you are using Apple Safari (not Chrome or in-app viewers).</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      Tap the <Share2 className="w-3.5 h-3.5 text-sky-400 inline" /> Share button
                    </span>
                    <span className="text-neutral-400">Located at the center-bottom toolbar in Safari.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      Select <PlusSquare className="w-3.5 h-3.5 text-amber-400 inline" /> &quot;Add to Home Screen&quot;
                    </span>
                    <span className="text-neutral-400">Scroll down in the share sheet and tap &quot;Add to Home Screen&quot;, then tap &quot;Add&quot; in the top-right.</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Launches full-screen like an App Store app with offline support!</span>
                </div>
              </div>
            )}

            {/* Android Instructions */}
            {activePlatform === 'android' && (
              <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-xl space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Open link in Google Chrome</span>
                    <span className="text-neutral-400">Load the URL in Chrome on your phone.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Tap &quot;Install App&quot; or Menu</span>
                    <span className="text-neutral-400">Chrome will show an &quot;Install app&quot; prompt banner, or tap the top-right 3 dots (⋮) and select &quot;Install app&quot; or &quot;Add to Home screen&quot;.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Confirm &quot;Install&quot;</span>
                    <span className="text-neutral-400">MotoPulse will be added directly to your app launcher and home screen.</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Caches for offline use on mountain rides with zero mobile service!</span>
                </div>
              </div>
            )}
          </div>

          {/* Close */}
          <div className="flex justify-end pt-2 border-t border-neutral-800">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
