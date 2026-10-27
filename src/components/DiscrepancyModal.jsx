import React, { useState } from 'react';
import { X, AlertCircle, Check } from 'lucide-react';
import { fairShiftDB } from '../services/db';

export default function DiscrepancyModal({ isOpen, onClose, attendanceRecord, workerId, onDiscrepancySubmitted, t = {} }) {
  const [claimedHours, setClaimedHours] = useState(
    attendanceRecord ? (attendanceRecord.hoursWorked + 1.0).toString() : '9.0'
  );
  const [explanation, setExplanation] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!explanation.trim()) return;

    const result = fairShiftDB.reportAttendanceDiscrepancy(
      attendanceRecord ? attendanceRecord.id : 'att_gen',
      parseFloat(claimedHours),
      explanation,
      workerId || 'usr_w1'
    );

    setIsSuccess(true);
    if (onDiscrepancySubmitted) onDiscrepancySubmitted(result);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#1A1A1A] text-white rounded-4xl max-w-sm w-full p-6 border border-white/10 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              {t.payrollComputation || 'Payroll Fairness'}
            </div>
            <h3 className="font-bold text-sm text-white mt-0.5">
              {t.discrepancyModalTitle || 'Report Attendance Discrepancy'}
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
            <h4 className="font-bold text-sm text-white">Review Ticket Filed</h4>
            <p className="text-xs text-slate-300">
              Assigned to HR Compliance. Gate logs will be reconciled with the batching register.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center font-mono">
              <span className="text-slate-400">{t.expectedHours || 'Claimed Hours'}</span>
              <input
                type="number"
                step="0.5"
                value={claimedHours}
                onChange={(e) => setClaimedHours(e.target.value)}
                className="w-20 px-2 py-1 bg-black/40 border border-white/20 rounded-lg text-right font-bold text-white focus:outline-hidden focus:border-[#D9381E]"
              />
            </div>

            <div>
              <label className="text-slate-400 font-mono text-[11px] block mb-1">
                {t.reasonNotes || 'Explanation / Supervisor On-Site'}
              </label>
              <textarea
                rows={3}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Overtime concrete pour ran until 19:30 with Foreman Murugan..."
                className="w-full p-2.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-hidden focus:border-[#D9381E]"
              />
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              {t.discrepancyDesc || 'Submitted claim locks into the tamper-evident audit ledger and alerts HR for mandatory reconciliation within 24 hours.'}
            </p>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 rounded-full bg-[#D9381E] hover:bg-[#B52810] text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors"
            >
              {t.submitDiscrepancy || 'Submit Discrepancy Claim'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
