import React, { useState } from 'react';
import { X, ArrowRightLeft, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { fairShiftDB } from '../services/db';

export default function ShiftSwapModal({ isOpen, onClose, currentWorker, sector = 'construction' }) {
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
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">FairShift Swap</div>
            <h3 className="font-bold text-sm text-white mt-0.5">Peer Shift Exchange</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
            <Check className="w-8 h-8 text-emerald-400" />
            <h4 className="font-bold text-sm text-white">Swap Request Submitted</h4>
            <p className="text-xs text-slate-300">
              Shift trade sent to site supervisor. Colleague skill verified. Awaiting supervisor approval.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSwapSubmit} className="flex flex-col gap-3 text-xs">
            {/* Current Shift */}
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-0.5 font-mono">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Your Assigned Shift:</span>
              <span className="font-bold text-white text-xs">Morning Rigging (07:00 - 15:30) • Oct 29</span>
            </div>

            {/* Target Colleague Selector */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Select Qualified Colleague
              </label>
              <div className="flex flex-col gap-1.5">
                {eligibleColleagues.map((colleague) => (
                  <button
                    key={colleague.id}
                    type="button"
                    disabled={colleague.fatigueRisk}
                    onClick={() => setSelectedTarget(colleague.name)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      selectedTarget === colleague.name
                        ? 'border-[#FF4D2D] bg-[#FF4D2D]/10 text-white'
                        : colleague.fatigueRisk
                        ? 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed text-slate-500'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">{colleague.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{colleague.role}</div>
                    </div>
                    {colleague.fatigueRisk ? (
                      <span className="text-[9px] font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded">
                        Fatigue Risk
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Skill Match</span>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Proposed Shift */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Proposed Shift Trade
              </label>
              <select
                value={proposedShift}
                onChange={(e) => setProposedShift(e.target.value)}
                className="w-full bg-[#222222] border border-white/10 rounded-xl p-2.5 text-white text-xs focus:outline-none"
              >
                <option value="Evening Rigging (15:00 - 23:30) • Oct 29">Evening Shift (15:00 - 23:30) • Oct 29</option>
                <option value="Morning Academic Prep (06:00 - 14:30) • Oct 30">Morning Shift (06:00 - 14:30) • Oct 30</option>
                <option value="Overnight Sanitization (22:00 - 06:00) • Oct 30">Night Shift (22:00 - 06:00) • Oct 30</option>
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Reason for Swap Request
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Doctor appointment in forenoon..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-white/10 text-white font-medium rounded-full hover:bg-white/15"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!reason.trim()}
                className="flex-1 py-2.5 bg-[#FF4D2D] text-white font-bold rounded-full disabled:opacity-40 hover:bg-[#E84324]"
              >
                Send Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
