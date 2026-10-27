import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight } from 'lucide-react';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess, sectorConfig }) {
  const [scanStep, setScanStep] = useState('aiming'); // 'aiming', 'detected', 'confirmed'

  useEffect(() => {
    if (isOpen) {
      setScanStep('aiming');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setScanStep('detected');
    setTimeout(() => {
      setScanStep('confirmed');
      setTimeout(() => {
        onScanSuccess();
        onClose();
      }, 700);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#1A1A1A] text-white rounded-4xl max-w-sm w-full overflow-hidden border border-white/10 shadow-2xl p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-400 font-mono">Check-In</div>
            <h3 className="font-bold text-base mt-0.5">Site Biometric Scanner</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport Frame */}
        <div className="relative bg-black rounded-3xl p-6 flex flex-col items-center justify-center border border-white/10 aspect-square">
          <div className="relative w-44 h-44 rounded-2xl border border-white/20 p-4 flex items-center justify-center">
            {/* Minimal Corner Dots */}
            <span className="absolute top-2 left-2 w-1.5 h-1.5 bg-[#FF4D2D] rounded-full"></span>
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#FF4D2D] rounded-full"></span>
            <span className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-[#FF4D2D] rounded-full"></span>
            <span className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-[#FF4D2D] rounded-full"></span>

            {/* Scanning line */}
            {scanStep === 'aiming' && (
              <div className="absolute inset-x-4 top-1/2 h-0.5 bg-[#FF4D2D] opacity-80"></div>
            )}

            {/* Geometric QR Block representation */}
            <div className="w-28 h-28 bg-white/90 p-2 rounded-xl grid grid-cols-4 gap-1">
              <div className="bg-black rounded-xs"></div>
              <div className="bg-black/60 rounded-xs col-span-2"></div>
              <div className="bg-black rounded-xs"></div>
              <div className="bg-black/40 rounded-xs col-span-2"></div>
              <div className="bg-[#FF4D2D] rounded-xs"></div>
              <div className="bg-black rounded-xs"></div>
              <div className="bg-black rounded-xs"></div>
              <div className="bg-black/70 rounded-xs col-span-3"></div>
            </div>

            {scanStep === 'confirmed' && (
              <div className="absolute inset-0 bg-[#FF4D2D] rounded-2xl flex flex-col items-center justify-center font-bold text-white text-sm">
                <span>Verified</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>GPS: {sectorConfig.siteName.split(' ')[0]}</span>
          </div>
        </div>

        <button
          onClick={handleSimulateScan}
          disabled={scanStep !== 'aiming'}
          className="w-full py-3.5 bg-white hover:bg-slate-100 text-black font-semibold text-xs rounded-full transition-all active:scale-[0.98]"
        >
          Confirm Site Check-In
        </button>
      </div>
    </div>
  );
}
