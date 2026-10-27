import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight } from 'lucide-react';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess, sectorConfig, t = {} }) {
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
            <div className="text-xs uppercase tracking-widest text-slate-400 font-mono">
              {t.scanQR || 'Check-In'}
            </div>
            <h3 className="font-bold text-base mt-0.5">
              {t.qrModalTitle || 'Site Biometric Scanner'}
            </h3>
          </div>
          <button
            type="button"
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
            <span className="absolute top-2 left-2 w-1.5 h-1.5 bg-[#D9381E] rounded-full"></span>
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#D9381E] rounded-full"></span>
            <span className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-[#D9381E] rounded-full"></span>
            <span className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-[#D9381E] rounded-full"></span>

            {/* Scanning line */}
            {scanStep === 'aiming' && (
              <div className="absolute inset-x-4 top-1/2 h-0.5 bg-[#D9381E] opacity-80 animate-pulse"></div>
            )}

            {/* Geometric QR Block representation */}
            <div className="w-28 h-28 bg-white/90 p-2 rounded-xl grid grid-cols-4 gap-1">
              <div className="bg-black rounded-xs"></div>
              <div className="bg-black/60 rounded-xs col-span-2"></div>
              <div className="bg-black rounded-xs"></div>
              <div className="bg-black rounded-xs col-span-2"></div>
              <div className="bg-black/40 rounded-xs col-span-2"></div>
              <div className="bg-black rounded-xs"></div>
              <div className="bg-black/80 rounded-xs col-span-2"></div>
              <div className="bg-black rounded-xs"></div>
            </div>
          </div>

          <div className="mt-3 font-mono text-[11px] text-slate-400">
            {scanStep === 'aiming' && 'Targeting Site Terminal QR'}
            {scanStep === 'detected' && 'Biometric Hash Verified'}
            {scanStep === 'confirmed' && 'Clock In Approved'}
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center font-mono">
          {t.qrModalDesc || 'Scan site terminal QR code to record GPS-verified attendance.'}
        </p>

        <button
          type="button"
          onClick={handleSimulateScan}
          className="w-full py-3 rounded-full bg-[#D9381E] hover:bg-[#B52810] text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors"
        >
          {t.simulateScan || 'Simulate Terminal Check-In'}
        </button>
      </div>
    </div>
  );
}
