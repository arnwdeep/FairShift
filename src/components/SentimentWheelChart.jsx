import React, { useState } from 'react';

// Circular Petal Sentiment Wheel Chart inspired by Reference Image 2
export default function SentimentWheelChart({
  title = "Workforce Sentiment & Attrition Matrix",
  subtitle = "8-Vector Anonymous Employee Wellbeing Rosette",
  sector = "construction"
}) {
  const [selectedSectorIdx, setSelectedSectorIdx] = useState(0);

  // 8 Sentiment vectors aligned with UN SDG 8 (Fair wages, safety, fatigue, morale)
  const segments = [
    { id: "fairpay", label: "Fair Pay", count: 14, type: "positive", desc: "Transparent payslip & accurate 1.5x overtime calculation" },
    { id: "safety", label: "Safety Pass", count: 12, type: "positive", desc: "Confidence in anonymous hazard resolution without retaliation" },
    { id: "respect", label: "Manager Trust", count: 10, type: "positive", desc: "Respectful supervisor interactions and shift scheduling" },
    { id: "gear", label: "Tool Quality", count: 8, type: "neutral", desc: "Availability of certified PPE, harness, and ventilation gear" },
    { id: "fatigue", label: "Fatigue Strain", count: 6, type: "risk", desc: "Exhaustion flagged from shifts >10 hours or night turnover" },
    { id: "heat", label: "Heat Stress", count: 5, type: "risk", desc: "Thermal discomfort and midday hydration booth access" },
    { id: "pfdelay", label: "Deposit Lag", count: 3, type: "risk", desc: "Workers awaiting confirmation of PF/ESI statutory deposits" },
    { id: "turnover", label: "Turnover Risk", count: 2, type: "risk", desc: "Workers indicating consideration of site departure" }
  ];

  const activeSegment = segments[selectedSectorIdx];

  // Geometry calculations for 8 rounded petal sectors
  const size = 320;
  const center = size / 2;
  const innerR = 42;
  const outerR = 140;
  const numSegments = 8;
  const angleStep = (2 * Math.PI) / numSegments;
  const gapAngle = 0.04; // small gap between petals

  // Helper to calculate arc coordinate
  const polarToCartesian = (cx, cy, r, angle) => ({
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle)
  });

  // Generate SVG path for a rounded petal wedge
  const createPetalPath = (idx) => {
    const startAngle = idx * angleStep - Math.PI / 2 + gapAngle;
    const endAngle = (idx + 1) * angleStep - Math.PI / 2 - gapAngle;

    const p1 = polarToCartesian(center, center, innerR, startAngle);
    const p2 = polarToCartesian(center, center, outerR, startAngle);
    const p3 = polarToCartesian(center, center, outerR, endAngle);
    const p4 = polarToCartesian(center, center, innerR, endAngle);

    // Subtle corner curve via arc commands
    return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${outerR} ${outerR} 0 0 1 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${innerR} ${innerR} 0 0 0 ${p1.x} ${p1.y} Z`;
  };

  return (
    <div className="w-full bg-[#181818] text-white p-6 rounded-4xl border border-white/10 shadow-xl flex flex-col items-center gap-5 select-none">
      {/* Title Header */}
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF4D2D]"></span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Sentiment Rosette
            </span>
          </div>
          <h3 className="font-extrabold text-base text-white tracking-tight mt-0.5">{title}</h3>
          <p className="text-[11px] font-mono text-slate-400">{subtitle}</p>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-slate-400">Total Index:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-white text-black font-bold text-[11px]">
            60 Reports
          </span>
        </div>
      </div>

      {/* Circular Wheel SVG */}
      <div className="relative flex items-center justify-center my-2">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          {segments.map((seg, idx) => {
            const isSelected = selectedSectorIdx === idx;
            const midAngle = (idx + 0.5) * angleStep - Math.PI / 2;
            const textR = (innerR + outerR) / 2 + 2;
            const textPos = polarToCartesian(center, center, textR, midAngle);

            // Shading style matching reference:
            // Top/right petals light cream/white, bottom/left petals darker slate
            const isLightPetal = idx === 0 || idx === 1 || idx === 2 || idx === 7;

            let fillColor;
            let textColor;

            if (isSelected) {
              fillColor = "#FF4D2D"; // terracotta active highlight
              textColor = "#FFFFFF";
            } else if (isLightPetal) {
              fillColor = "#E6E6E6"; // cream/light white from image
              textColor = "#111111";
            } else {
              fillColor = "#333333"; // muted dark grey from image
              textColor = "#D1D5DB";
            }

            return (
              <g
                key={seg.id}
                className="cursor-pointer transition-transform duration-150 hover:opacity-95"
                onClick={() => setSelectedSectorIdx(idx)}
              >
                {/* Petal Wedge */}
                <path
                  d={createPetalPath(idx)}
                  fill={fillColor}
                  stroke="#181818"
                  strokeWidth="3.5"
                />

                {/* Number inside Petal (e.g. 12, 10, 5, 2) */}
                <text
                  x={textPos.x}
                  y={textPos.y - 4}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-mono text-[13px] font-extrabold select-none"
                  fill={textColor}
                >
                  {seg.count}
                </text>

                {/* Label inside Petal (e.g. Fair Pay, Safety, Fatigue) */}
                <text
                  x={textPos.x}
                  y={textPos.y + 11}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[9px] font-semibold tracking-tight select-none"
                  fill={textColor}
                >
                  {seg.label}
                </text>
              </g>
            );
          })}

          {/* Central Core Hole with Inner Dot */}
          <circle cx={center} cy={center} r={innerR - 6} fill="#181818" />
          <circle cx={center} cy={center} r={3} fill="#FF4D2D" />
        </svg>
      </div>

      {/* Selected Vector Details Card */}
      {activeSegment && (
        <div className="w-full bg-[#242424] p-4 rounded-3xl border border-white/10 flex flex-col gap-1.5 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  activeSegment.type === 'risk'
                    ? 'bg-[#FF4D2D]'
                    : activeSegment.type === 'neutral'
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
              ></span>
              <span className="font-bold text-sm text-white">{activeSegment.label}</span>
              <span className="font-mono text-slate-400">({activeSegment.count} worker reports)</span>
            </div>

            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                activeSegment.type === 'risk'
                  ? 'bg-[#FF4D2D]/20 text-[#FF4D2D]'
                  : 'bg-white/10 text-slate-300'
              }`}
            >
              {activeSegment.type === 'risk' ? 'Attrition Flag' : 'Positive Factor'}
            </span>
          </div>

          <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
            {activeSegment.desc}
          </p>

          <div className="pt-2 mt-1 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>UN SDG 8.8 Work Wellbeing Metric</span>
            <span className="text-[#FF4D2D]">Click any petal to inspect</span>
          </div>
        </div>
      )}
    </div>
  );
}
