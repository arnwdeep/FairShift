import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { fairShiftDB } from '../services/db';

export default function WorkplacePulseModal({ isOpen, onClose, sector = 'construction' }) {
  const [rating, setRating] = useState(4);
  const [category, setCategory] = useState('Facilities & Heat Stress');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    fairShiftDB.submitPulse(rating, category, feedback, sector);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#1A1A1A] text-white rounded-4xl max-w-sm w-full p-6 border border-white/10 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Anonymous Pulse</div>
            <h3 className="font-bold text-sm text-white mt-0.5">Workplace Feedback</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
            <Check className="w-8 h-8 text-emerald-400" />
            <h4 className="font-bold text-sm text-white">Feedback Logged Anonymously</h4>
            <p className="text-xs text-slate-300">
              Aggregated directly into site wellbeing metrics without individual tracking.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
            <p className="text-[11px] text-slate-400">
              How are working conditions, break facilities, and safety gear today?
            </p>

            {/* 1 to 5 Satisfaction Pill Selector */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Satisfaction Rating (1 = Poor, 5 = Excellent)
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRating(val)}
                    className={`py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                      rating === val
                        ? 'bg-[#FF4D2D] text-white'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#222222] border border-white/10 rounded-xl p-2.5 text-white text-xs focus:outline-none"
              >
                <option value="Facilities & Heat Stress">Facilities & Hydration (Heat Stress)</option>
                <option value="Safety & Protective Equipment">Safety PPE & Gear Availability</option>
                <option value="Overtime Fairness & Rest Intervals">Overtime Fairness & Rest Intervals</option>
                <option value="Supervisor Support & Respect">Supervisor Support & Respect</option>
              </select>
            </div>

            {/* Feedback text */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Comments (Optional)
              </label>
              <textarea
                rows={2}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share any suggestion or issue..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none resize-none"
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
                className="flex-1 py-2.5 bg-white text-black font-bold rounded-full hover:bg-slate-100"
              >
                Submit Pulse
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
