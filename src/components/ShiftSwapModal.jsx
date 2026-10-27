import React, { useState } from 'react';
import { X, ArrowRightLeft, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { fairShiftDB } from '../services/db';

export default function ShiftSwapModal({ isOpen, onClose, currentWorker, sector = 'construction', t = {} }) {
  const [selectedTarget, setSelectedTarget] = useState('Sunil Sharma');
  const [proposedShift, setProposedShift] = useState('Evening Rigging (15:00 - 23:30) • Oct 29');
  const [reason, setReason] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const eligibleColleagues = sector === 'construction'
    ? [
        { id: 'usr_w3', name: 'Sunil Sharma', role: 'Crane Operator & Rigging', verified: true, fatigueRisk: false },
        { id: 'usr_w4', name: 'K. Mohan', role: 'Steel Rebar Tech', verified: true, fatigueRisk: true, note: 'Already on 10.5h shift' },
        { id: 'usr_w5', name: 'Vikas Yadav', role: 'Masonry Specialist', verified: true, fatigueRisk: false }
      ]
    : [
        { id: 'usr_w6', name: 'K. Balamurugan', role: 'Campus Grounds Keeper', verified: true, fatigueRisk: false },
        { id: 'usr_w7', name: 'Suresh Mani', role: 'Sanitation Facility Tech', verified: true, fatigueRisk: false }
      ];

  const handleSwapSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    const target = eligibleColleagues.find((c) => c.name === selectedTarget) || eligibleColleagues[0];

    fairShiftDB.requestShiftSwap({
      requesterId: currentWorker ? currentWorker.id : 'usr_w1',
      requesterName: currentWorker ? currentWorker.name : 'Ramesh Kumar',
      currentShift: 'Morning Rigging (07:00 - 15:30) • Oct 29',
      targetWorkerId: target.id,
      targetWorkerName: target.name,
      proposedShift,
      reason
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#1A1A1A] text-white rounded-4xl max-w-sm w-full p-6 border border-white/10 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              {t.swapTitle || 'FairShift Peer Swap'}
            </div>
            <h3 className="font-bold text-sm text-white mt-0.5">
              {t.requestSwapBtn || 'Request Shift Trade'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
            <Check className="w-8 h-8 text-emerald-400" />
            <h4 className="font-bold text-sm text-white">Shift Swap Request Submitted</h4>
            <p className="text-xs text-slate-300 font-mono">
              Queued for supervisor review with automated fatigue turnaround check.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSwapSubmit} className="flex flex-col gap-3 text-xs">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                {t.availableColleagues || 'Select Qualified Colleague'}
              </label>
              <select
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value)}
                className="w-full p-2.5 bg-white/5 border border-white/10 rounded-2xl text-white font-mono focus:outline-hidden focus:border-[#D9381E]"
              >
                {eligibleColleagues.map((colleague) => (
                  <option
                    key={colleague.id}
                    value={colleague.name}
                    disabled={colleague.fatigueRisk}
                    className="bg-[#1A1A1A]"
                  >
                    {colleague.name} ({colleague.role}) {colleague.fatigueRisk ? '— FATIGUE LOCKED' : '— AVAILABLE'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Target Shift & Date
              </label>
              <input
                type="text"
                value={proposedShift}
                onChange={(e) => setProposedShift(e.target.value)}
                className="w-full p-2.5 bg-white/5 border border-white/10 rounded-2xl text-white font-mono focus:outline-hidden focus:border-[#D9381E]"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Reason for Swap
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Family emergency / medical appointment turnaround..."
                className="w-full p-2.5 bg-white/5 border border-white/10 rounded-2xl text-white font-mono placeholder:text-slate-600 focus:outline-hidden focus:border-[#D9381E]"
              />
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-2 text-[11px] text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Turnaround check guarantees 12h rest before subsequent shift.</span>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 rounded-full bg-[#D9381E] hover:bg-[#B52810] text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>{t.requestSwapBtn || 'Submit Shift Swap'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
