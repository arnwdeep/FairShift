import React from 'react';

// CMF by Nothing Stepped Block Activity Chart (Inspired directly by CMF Watch Sleep Interface)
export default function CmfShiftBlockChart({
  hoursWorked = 8.2,
  overtimeHours = 0.2,
  shiftDate = "Today, Oct 27",
  className = ""
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
            SHIFT PATTERN
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-ndot text-4xl sm:text-5xl text-black font-normal tracking-tight">
              {whole}.{mins}
            </span>
            <span className="text-xs font-mono text-slate-400">
              H .. Min / DURATION
            </span>
          </div>
        </div>

        <div className="text-right font-mono text-xs">
          <span className="text-slate-400">{shiftDate}</span>
          <div className="flex items-center justify-end gap-1 mt-1 text-[#D9381E] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E] animate-pulse"></span>
            <span>{overtimeHours > 0 ? `+${overtimeHours}h OT` : 'Within Cap'}</span>
          </div>
        </div>
      </div>

      {/* Legend with CMF style dots */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#D9381E]"></span>
          <span className="text-black font-medium">Overtime (1.5x)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#111111]"></span>
          <span className="text-slate-600">Standard Work</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#8E8E93]"></span>
          <span className="text-slate-600">Tool / Rigging Prep</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#E5E5EA]"></span>
          <span className="text-slate-600">Rest / Meal</span>
        </div>
      </div>

      {/* Stepped Block Diagram (Directly matching CMF Watch app diagram) */}
      <div className="w-full bg-[#F5F5F3] p-4 rounded-3xl border border-black/[0.04] flex flex-col gap-2">
        <div className="h-28 flex items-end gap-1.5 sm:gap-2 justify-between px-1">
          {blocks.map((b, i) => {
            const bgClass =
              b.type === "deep"
                ? "bg-[#D9381E]"
                : b.type === "regular"
                ? "bg-[#111111]"
                : b.type === "prep"
                ? "bg-[#8E8E93]"
                : "bg-[#D1D1D6]";

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                <div
                  style={{ height: `${b.height}%` }}
                  className={`w-full rounded-sm transition-all duration-300 group-hover:opacity-80 ${bgClass}`}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Timeline Bottom Axis */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-1 border-t border-black/[0.05]">
          <span>07:30 Start</span>
          <span>11:30 Break</span>
          <span>15:30 8h Cap</span>
          <span className="text-[#D9381E] font-bold">16:00 Active</span>
        </div>
      </div>
    </div>
  );
}
