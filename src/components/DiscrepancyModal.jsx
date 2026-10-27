import React, { useState } from 'react';
import { X, AlertCircle, Check } from 'lucide-react';
import { fairShiftDB } from '../services/db';

export default function DiscrepancyModal({ isOpen, onClose, attendanceRecord, workerId, onDiscrepancySubmitted }) {
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
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Payroll Fairness</div>
            <h3 className="font-bold text-sm text-white mt-0.5">Report Attendance Discrepancy</h3>
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
            <h4 className="font-bold text-sm text-white">Review Ticket Filed</h4>
            <p className="text-xs text-slate-300">
              Assigned to HR Compliance. Gate logs will be reconciled with the batching register.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center font-mono">
              <span className="text-slate-400">Logged Record:</span>
              <span className="font-bold text-white">
                {attendanceRecord ? `${attendanceRecord.hoursWorked}h (${attendanceRecord.date})` : '6.8h Today'}
              </span>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Actual Hours Worked
              </label>
              <input
                type="number"
                step="0.25"
                value={claimedHours}
                onChange={(e) => setClaimedHours(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Reason / Location of Overtime
              </label>
              <textarea
                rows={3}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="e.g. Concrete pour continued past 17:00; gate scanner was offline during exit..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-white/30 resize-none"
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
                disabled={!explanation.trim()}
                className="flex-1 py-2.5 bg-[#FF4D2D] text-white font-bold rounded-full disabled:opacity-40 hover:bg-[#E84324]"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
