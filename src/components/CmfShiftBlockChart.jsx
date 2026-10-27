import React from 'react';

// CMF by Nothing Stepped Block Activity Chart (Inspired directly by CMF Watch Sleep Interface)
export default function CmfShiftBlockChart({
  hoursWorked = 8.2,
  overtimeHours = 0.2,
  shiftDate = "Today • Oct 27",
  className = "",
  t = {}
}) {
  const formatDigital = (hrs) => {
    const whole = Math.floor(hrs);
    const mins = Math.round((hrs - whole) * 60);
    return { whole, mins: mins.toString().padStart(2, '0') };
  };

  const { whole, mins } = formatDigital(hoursWorked);

  // Stepped blocks simulating a work cycle:
  // Types: 'deep' (Orange = High Focus/Overtime), 'regular' (Dark = Standard Work), 'break' (Light = Rest Break), 'prep' (Grey = Tool Prep)
  const blocks = [
    { label: "07:30", type: "regular", height: 75 },
    { label: "08:30", type: "deep", height: 95 },
    { label: "09:30", type: "regular", height: 80 },
    { label: "10:30", type: "prep", height: 60 },
    { label: "11:30", type: "break", height: 35 }, // Lunch break
    { label: "12:30", type: "regular", height: 85 },
    { label: "13:30", type: "deep", height: 100 },
    { label: "14:30", type: "regular", height: 70 },
    { label: "15:30", type: "deep", height: 90 }, // Overtime start
    { label: "16:00", type: "deep", height: 85 }  // 1.5x surge
  ];

  return (
    <div className={`bg-white p-5 sm:p-6 rounded-4xl border border-black/[0.06] flex flex-col gap-5 select-none ${className}`}>
      {/* Top Header Row with Dot Matrix Typography */}
      <div className="flex items-baseline justify-between border-b border-black/[0.05] pb-3">
        <div>
          <div className="text-[10px] font-ndot uppercase tracking-widest text-slate-400">
            {t.shiftPattern || 'SHIFT PATTERN'}
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-ndot text-4xl sm:text-5xl text-black font-normal tracking-tight">
              {whole}.{mins}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {t.durationSubtitle || 'H .. Min / DURATION'}
            </span>
          </div>
        </div>

        <div className="text-right font-mono text-xs">
          <span className="text-slate-400">{shiftDate}</span>
          <div className="flex items-center justify-end gap-1 mt-1 text-[#D9381E] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E] animate-pulse"></span>
            <span>{overtimeHours > 0 ? `+${overtimeHours}h OT` : (t.withinStandardCap || 'Within Cap')}</span>
          </div>
        </div>
      </div>

      {/* Legend with CMF style dots */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#D9381E]"></span>
          <span className="text-black font-medium">{t.overtime15x || 'Overtime (1.5x)'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#111111]"></span>
          <span className="text-slate-600">{t.standardWork || 'Standard Work'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#8E8E93]"></span>
          <span className="text-slate-600">{t.toolPrep || 'Tool / Rigging Prep'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#E5E5EA]"></span>
          <span className="text-slate-600">{t.restMeal || 'Rest / Meal'}</span>
        </div>
      </div>

      {/* Stepped Block Diagram (Directly matching CMF Watch app diagram) */}
      <div className="relative pt-6 pb-2">
        {/* Background Guide Threshold Line at 8.0 Hours */}
        <div className="absolute top-[35%] left-0 right-0 border-t border-dashed border-black/15 pointer-events-none z-0 flex items-center justify-end pr-2">
          <span className="text-[10px] font-mono text-slate-400 bg-white/90 px-1 -translate-y-1/2">
            8.0h Cap
          </span>
        </div>

        {/* Stepped Columns */}
        <div className="grid grid-cols-10 items-end gap-1 sm:gap-2 h-44 z-10 relative">
          {blocks.map((b, idx) => {
            let bgClass = "bg-[#111111]";
            if (b.type === "deep") bgClass = "bg-[#D9381E]";
            if (b.type === "prep") bgClass = "bg-[#8E8E93]";
            if (b.type === "break") bgClass = "bg-[#E5E5EA]";

            return (
              <div key={idx} className="flex flex-col items-center justify-end h-full group">
                <div
                  style={{ height: `${b.height}%` }}
                  className={`w-full ${bgClass} rounded-xs transition-all duration-300 group-hover:brightness-110 relative flex flex-col justify-start items-center pt-1`}
                >
                  {/* Subtle Inner Accent on Deep/Overtime Blocks */}
                  {b.type === "deep" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white/80"></span>
                  )}
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-2 rotate-[-45deg] sm:rotate-0 origin-top-left sm:origin-center">
                  {b.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Summary Bar in CMF Style */}
      <div className="flex items-center justify-between pt-3 border-t border-black/[0.05] text-[11px] font-mono text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
          <span>Shift Cycle: 07:30 — 16:00 (Break: 30m)</span>
        </div>
        <div className="font-bold text-black">
          {t.auditedLedger || 'Audited to tamper-evident ledger'}
        </div>
      </div>
    </div>
  );
}
