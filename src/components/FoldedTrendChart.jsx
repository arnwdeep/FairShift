import React, { useState } from 'react';

// Folded Architectural Line Chart inspired by clean exhibition infographic (Reference Image 1)
export default function FoldedTrendChart({
  title,
  subtitle,
  data,
  threshold = 8.0,
  t = {}
}) {
  const chartTitle = title || t.weeklyTrajectoryTitle || "Weekly Shift Duration Trajectory";
  const chartSubtitle = subtitle || t.weeklyTrajectorySubtitle || "7-day shift patterns vs 8h standard cap";

  const defaultData = [
    { label: t.mon || "Mon", value: 7.8, unit: "h", status: "normal" },
    { label: t.tue || "Tue", value: 8.0, unit: "h", status: "normal" },
    { label: t.wed || "Wed", value: 6.5, unit: "h", status: "normal" },
    { label: t.thu || "Thu", value: 9.8, unit: "h", status: "overtime" },
    { label: t.fri || "Fri", value: 11.2, unit: "h", status: "fatigue" },
    { label: t.sat || "Sat", value: 8.5, unit: "h", status: "overtime" },
    { label: t.today || "Today", value: 8.2, unit: "h", status: "normal" }
  ];

  const chartData = data || defaultData;
  const [activePoint, setActivePoint] = useState(chartData[chartData.length - 1]);

  // Chart dimensions
  const width = 580;
  const height = 180;
  const paddingX = 40;
  const paddingY = 35;

  const minVal = 5.0;
  const maxVal = 13.0;

  // Calculate coordinates
  const points = chartData.map((d, i) => {
    const x = paddingX + (i / (chartData.length - 1)) * (width - 2 * paddingX);
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
          <h3 className="text-base sm:text-lg font-black tracking-tight text-black">{chartTitle}</h3>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">{chartSubtitle}</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-0.5 bg-black"></span>
            <span>8h {t.withinStandardCap || 'Cap'}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[#D9381E] font-medium">
            <span className="w-2 h-0.5 bg-[#D9381E]"></span>
            <span>{t.overtime15x || 'Overtime (1.5x)'}</span>
          </span>
        </div>
      </div>

      {/* Interactive SVG Display Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 sm:h-52 overflow-visible"
        >
          <defs>
            <linearGradient id="terracottaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D9381E" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#D9381E" stopOpacity="0.0" />
            </linearGradient>

            <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Horizontal Grid Guides */}
          {[6, 8, 10, 12].map((g) => {
            const normalizedY = (g - minVal) / (maxVal - minVal);
            const y = height - paddingY - normalizedY * (height - 2 * paddingY);
            const isThreshold = g === threshold;
            return (
              <g key={g}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke={isThreshold ? "#111111" : "#E5E5EA"}
                  strokeWidth={isThreshold ? "1.5" : "1"}
                  strokeDasharray={isThreshold ? "3 3" : "none"}
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] font-mono fill-slate-400"
                >
                  {g}h
                </text>
              </g>
            );
          })}

          {/* Folded Ribbon Shadow Line */}
          <path
            d={ribbonD}
            fill="none"
            stroke="#111111"
            strokeWidth="4"
            opacity="0.12"
          />

          {/* Area Fill Under Ribbon */}
          <path
            d={`${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`}
            fill="url(#terracottaGradient)"
          />

          {/* Main Trajectory Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#D9381E"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#shadowFilter)"
          />

          {/* Data Points / Fold Hinges */}
          {points.map((p, idx) => {
            const isSelected = activePoint && activePoint.label === p.label;
            const isOt = p.value > 8.0;
            return (
              <g
                key={idx}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => setActivePoint(p)}
              >
                {/* Connecting Fold Pin */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isSelected ? "7" : "5"}
                  fill={isOt ? "#D9381E" : "#111111"}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />

                {/* Day Labels at bottom */}
                <text
                  x={p.x}
                  y={height - 8}
                  textAnchor="middle"
                  className={`text-[10px] font-mono ${
                    isSelected ? "fill-black font-bold" : "fill-slate-400"
                  }`}
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover / Selected Callout Card */}
        {activePoint && (
          <div className="flex items-center justify-between mt-1 px-4 py-2.5 rounded-2xl bg-[#EDEDEA] border border-black/[0.06] text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${activePoint.value > 8 ? 'bg-[#D9381E]' : 'bg-emerald-500'}`}></span>
              <span className="font-bold text-black">{activePoint.label}:</span>
              <span className="font-ndot text-sm text-black">{activePoint.value}h</span>
            </div>

            <div className="text-[11px] text-slate-600">
              {activePoint.value > 8 ? (
                <span className="text-[#D9381E] font-bold">
                  +{(activePoint.value - 8).toFixed(1)}h {t.overtime15x || 'Overtime'}
                </span>
              ) : (
                <span className="text-emerald-700 font-medium">
                  {t.withinStandardCap || 'Standard Safe Shift'}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
