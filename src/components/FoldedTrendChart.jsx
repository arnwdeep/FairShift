import React, { useState } from 'react';

// Folded Architectural Line Chart inspired by clean exhibition infographic (Reference Image 1)
export default function FoldedTrendChart({
  title = "Shift Overtime & Fatigue Trajectory",
  subtitle = "Hours logged across work cycles",
  data = [
    { label: "Mon", value: 7.8, unit: "h", status: "normal" },
    { label: "Tue", value: 8.0, unit: "h", status: "normal" },
    { label: "Wed", value: 6.5, unit: "h", status: "normal" },
    { label: "Thu", value: 9.8, unit: "h", status: "overtime" },
    { label: "Fri", value: 11.2, unit: "h", status: "fatigue" },
    { label: "Sat", value: 8.5, unit: "h", status: "overtime" },
    { label: "Today", value: 8.2, unit: "h", status: "normal" }
  ],
  threshold = 8.0
}) {
  const [activePoint, setActivePoint] = useState(data[data.length - 1]);

  // Chart dimensions
  const width = 580;
  const height = 180;
  const paddingX = 40;
  const paddingY = 35;

  const minVal = 5.0;
  const maxVal = 13.0;

  // Calculate coordinates
  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - 2 * paddingX);
    const normalizedY = (d.value - minVal) / (maxVal - minVal);
    const y = height - paddingY - normalizedY * (height - 2 * paddingY);
    return { ...d, x, y };
  });

  // Build SVG path
  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Folded ribbon 3D shadow path
  const ribbonD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y + 6}` : `${acc} L ${p.x} ${p.y + 6}`;
  }, '');

  return (
    <div className="w-full bg-white p-5 sm:p-6 rounded-4xl border border-black/[0.06] shadow-2xs text-[#111111] flex flex-col gap-4 select-none">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-black/[0.06] pb-3">
        <div className="flex items-baseline gap-2.5">
          <h3 className="text-base sm:text-lg font-black tracking-tight text-black">{title}</h3>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">{subtitle}</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-0.5 bg-black"></span>
            <span>Standard (8h)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF4D2D]"></span>
            <span>Fatigue (&gt;10h)</span>
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-x-auto py-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[460px] overflow-visible"
        >
          {/* Subtle horizontal grid lines */}
          <line
            x1={paddingX}
            y1={height - paddingY - ((8.0 - minVal) / (maxVal - minVal)) * (height - 2 * paddingY)}
            x2={width - paddingX}
            y2={height - paddingY - ((8.0 - minVal) / (maxVal - minVal)) * (height - 2 * paddingY)}
            stroke="#000000"
            strokeWidth="0.75"
            strokeDasharray="3 3"
            strokeOpacity="0.25"
          />
          <text
            x={width - paddingX + 6}
            y={height - paddingY - ((8.0 - minVal) / (maxVal - minVal)) * (height - 2 * paddingY) + 3}
            className="text-[9px] font-mono fill-slate-400"
          >
            8h Max Standard
          </text>

          {/* Folded Shadow Ribbon (Geometric dark fold underneath line) */}
          <path
            d={`${pathD} L ${points[points.length - 1].x} ${points[points.length - 1].y + 5} L ${ribbonD.replace('M', 'L')} Z`}
            fill="#000000"
            fillOpacity="0.08"
          />

          {/* Main Architectural Black Polyline */}
          <path
            d={pathD}
            fill="none"
            stroke="#111111"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Folded Accent Highlights */}
          {points.map((p, idx) => {
            const isSelected = activePoint && activePoint.label === p.label;
            const isHigh = p.value >= 10.0;
            const isOvertime = p.value > 8.0;

            return (
              <g
                key={idx}
                className="cursor-pointer transition-all"
                onClick={() => setActivePoint(p)}
              >
                {/* Vertical subtle guideline */}
                <line
                  x1={p.x}
                  y1={p.y}
                  x2={p.x}
                  y2={height - 20}
                  stroke="#000000"
                  strokeWidth="0.5"
                  strokeDasharray="2 2"
                  strokeOpacity={isSelected ? 0.4 : 0.1}
                />

                {/* Bold Number Label (Inspired directly by '131 min', '152 min' in reference image) */}
                <text
                  x={p.x}
                  y={p.y - 12}
                  textAnchor="middle"
                  className={`font-mono text-[11px] font-extrabold ${
                    isHigh
                      ? 'fill-[#FF4D2D]'
                      : isSelected
                      ? 'fill-black'
                      : 'fill-slate-700'
                  }`}
                >
                  {p.value}{p.unit}
                </text>

                {/* Crisp Point Node Dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isSelected ? 4.5 : 3.5}
                  fill={isHigh ? "#FF4D2D" : "#111111"}
                />

                {/* X-Axis Day / Time Label */}
                <text
                  x={p.x}
                  y={height - 5}
                  textAnchor="middle"
                  className={`text-[10px] font-mono ${
                    isSelected ? 'font-black fill-black' : 'fill-slate-400'
                  }`}
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Point Context Footer */}
      {activePoint && (
        <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                activePoint.value >= 10.0
                  ? 'bg-[#FF4D2D]'
                  : activePoint.value > 8.0
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
            ></span>
            <span className="font-bold text-black">{activePoint.label}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">
              {activePoint.value} Total Hours Logged
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            {activePoint.value > 8.0 ? (
              <span className="text-[#FF4D2D] font-bold">
                +{(activePoint.value - 8.0).toFixed(1)}h Overtime Accrued (1.5x)
              </span>
            ) : (
              <span className="text-emerald-700 font-medium">Standard Safe Shift</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
