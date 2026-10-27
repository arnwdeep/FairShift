import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { fairShiftDB } from '../services/db';

export default function WorkplacePulseModal({ isOpen, onClose, sector = 'construction', t = {} }) {
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
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              {t.pulse || 'Anonymous Pulse'}
            </div>
            <h3 className="font-bold text-sm text-white mt-0.5">
              {t.pulseTitle || 'Workplace Feedback'}
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
              {t.pulseSubtitle || 'How are working conditions, break facilities, and safety gear today?'}
            </p>

            {/* 1 to 5 Satisfaction Pill Selector */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Satisfaction Rating (1 = Low, 5 = High)
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRating(val)}
                    className={`py-2 rounded-xl font-mono font-bold text-xs transition-all ${
                      rating === val
                        ? 'bg-[#D9381E] text-white shadow-xs'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-white/5 border border-white/10 rounded-2xl text-white font-mono focus:outline-hidden focus:border-[#D9381E]"
              >
                <option value="Facilities & Heat Stress" className="bg-[#1A1A1A]">Hydration & Break Facilities</option>
                <option value="PPE & Equipment Quality" className="bg-[#1A1A1A]">PPE & Tool Ergonomics</option>
                <option value="Wage Transparency" className="bg-[#1A1A1A]">Wage & Overtime Accuracy</option>
                <option value="Supervisor Communication" className="bg-[#1A1A1A]">Workplace Culture & Dignity</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Anonymous Comment (Optional)
              </label>
              <textarea
                rows={2}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Drinking water station restocked promptly today..."
                className="w-full p-2.5 bg-white/5 border border-white/10 rounded-2xl text-white font-mono placeholder:text-slate-600 focus:outline-hidden focus:border-[#D9381E]"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 rounded-full bg-[#D9381E] hover:bg-[#B52810] text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors"
            >
              {t.submitPulseBtn || 'Submit Anonymous Pulse'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
