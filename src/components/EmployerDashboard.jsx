import React, { useState } from 'react';
import { ArrowUpRight, Check, Play, Download, ShieldCheck, ArrowRightLeft } from 'lucide-react';
import AudioPlayerButton from './AudioPlayerButton';
import FoldedTrendChart from './FoldedTrendChart';
import { fairShiftDB } from '../services/db';

export default function EmployerDashboard({
  sectorConfig,
  currentLang,
  t,
  grievances,
  onUpdateGrievanceStatus,
  fatigueAlertsCount,
  currentRole = 'admin',
  dbState
}) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'high_fatigue', 'overtime'
  const [playingVoiceId, setPlayingVoiceId] = useState(null);
  const [workersList, setWorkersList] = useState(sectorConfig.workersRoster);

  // Live DB records
  const db = dbState || fairShiftDB.getState();
  const discrepancies = db.discrepancies || [];
  const shiftSwaps = db.shiftSwaps || [];

  const handleGrantRest = (workerId) => {
    setWorkersList((prev) =>
      prev.map((w) =>
        w.id === workerId ? { ...w, fatigue: 'rest_granted', backToBack: false } : w
      )
    );
    fairShiftDB.addAuditEntry('Supervisor', 'Rest Authorized', `Worker ${workerId} relieved for mandatory rest.`);
  };

  const handleReassign = (workerId) => {
    setWorkersList((prev) =>
      prev.map((w) =>
        w.id === workerId ? { ...w, role: `${w.role} (Relieved)`, fatigue: 'low' } : w
      )
    );
    fairShiftDB.addAuditEntry('Supervisor', 'Shift Reassigned', `Relief worker dispatched for worker ${workerId}.`);
  };

  const handlePlayVoice = (item) => {
    setPlayingVoiceId(item.id);
    setTimeout(() => {
      setPlayingVoiceId(null);
    }, 2000);
  };

  const handleApproveSwap = (swapId) => {
    fairShiftDB.approveShiftSwap(swapId, 'Murugan Sundaram (Supervisor)');
  };

  const handleRejectSwap = (swapId) => {
    fairShiftDB.rejectShiftSwap(swapId, 'Fatigue turnaround conflict with subsequent shift.', 'Murugan Sundaram (Supervisor)');
  };

  const handleResolveDiscrepancy = (discId) => {
    fairShiftDB.resolveDiscrepancy(discId, 'Gate sensor verified. Overtime adjusted.', 11.75, 'Deepa (HR Officer)');
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `FairShift_Audit_Report_${sectorConfig.id}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredWorkers = workersList.filter((w) => {
    if (activeFilter === 'high_fatigue') return w.fatigue === 'high';
    if (activeFilter === 'overtime') return w.ot > 0;
    return true;
  });

  const totalOvertimeLogged = workersList.reduce((acc, w) => acc + w.ot, 0).toFixed(1);
  const highFatigueWorkers = workersList.filter((w) => w.fatigue === 'high');

  // Sentiment Breakdown in CMF Nothing Style (Replacing the black pie chart)
  const sentimentVectors = [
    { label: "Fair Pay & Overtime", score: 94, status: "Verified", count: 18, color: "#D9381E" },
    { label: "Safety Confidence", score: 91, status: "Active", count: 14, color: "#111111" },
    { label: "Manager Respect", score: 88, status: "Good", count: 12, color: "#111111" },
    { label: "Equipment Quality", score: 82, status: "Adequate", count: 8, color: "#767676" },
    { label: "Fatigue Strain", score: 24, status: "Alert (>10h)", count: 6, color: "#D9381E" },
    { label: "Hydration & Heat", score: 79, status: "Review", count: 5, color: "#767676" }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-8 flex flex-col gap-6 text-[#111111]">
      {/* Top Header Card in CMF Nothing Style */}
      <div className="bg-white p-6 sm:p-8 rounded-4xl border border-black/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D9381E]"></span>
            <span className="text-[10px] font-ndot uppercase tracking-widest text-slate-400">
              OPERATIONS CONSOLE • ROLE: {currentRole.toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-1">
            {sectorConfig.siteName}
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            {sectorConfig.location} • Real-Time Workforce Compliance
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportData}
            title="Download audit compliance report"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-black text-xs font-mono font-bold border border-black/[0.06] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT AUDIT</span>
          </button>

          <AudioPlayerButton
            text={`Employer console for ${sectorConfig.siteName}. Monitoring ${workersList.length} workers, ${totalOvertimeLogged} overtime hours, and ${highFatigueWorkers.length} fatigue risk alerts.`}
            lang={currentLang}
            size="md"
          />
        </div>
      </div>

      {/* 4 Operations Metrics Cards (Dot Matrix CMF Style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-4xl border border-black/[0.06] flex flex-col justify-between min-h-[150px] shadow-2xs">
          <div className="text-[10px] font-ndot uppercase tracking-widest text-slate-400">
            ACTIVE ON-SITE
          </div>
          <div className="font-ndot text-4xl sm:text-5xl text-black my-1">
            {workersList.length * 24}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>96.8% shift rate</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-4xl border border-black/[0.06] flex flex-col justify-between min-h-[150px] shadow-2xs">
          <div className="text-[10px] font-ndot uppercase tracking-widest text-slate-400">
            OVERTIME HOURS
          </div>
          <div className="font-ndot text-4xl sm:text-5xl text-black my-1">
            {totalOvertimeLogged}h
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            <span>1.5x Premium Rate</span>
          </div>
        </div>

        <div className="bg-[#D9381E] text-white p-6 rounded-4xl flex flex-col justify-between min-h-[150px] shadow-xs">
          <div className="text-[10px] font-ndot uppercase tracking-widest text-white/80">
            FATIGUE ALERTS
          </div>
          <div className="font-ndot text-4xl sm:text-5xl text-white my-1">
            {highFatigueWorkers.length}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/90 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span>Mandatory Rest</span>
          </div>
        </div>

        <div className="bg-[#111111] text-white p-6 rounded-4xl flex flex-col justify-between min-h-[150px] shadow-xs">
          <div className="text-[10px] font-ndot uppercase tracking-widest text-slate-400">
            OPEN TICKETS
          </div>
          <div className="font-ndot text-4xl sm:text-5xl text-white my-1">
            {grievances.filter((g) => g.status !== 'resolved').length}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>SafeSpeak Queue</span>
          </div>
        </div>
      </div>

      {/* GRAPH: Architectural Folded Ribbon Trend Chart */}
      <FoldedTrendChart
        title="Workforce Shift Hours & Overtime Surge Trajectory"
        subtitle="Daily aggregation showing threshold crossings"
        data={[
          { label: "Mon", value: 7.8, unit: "h", status: "normal" },
          { label: "Tue", value: 8.2, unit: "h", status: "normal" },
          { label: "Wed", value: 6.9, unit: "h", status: "normal" },
          { label: "Thu", value: 9.8, unit: "h", status: "overtime" },
          { label: "Fri", value: 11.2, unit: "h", status: "fatigue" },
          { label: "Sat", value: 8.5, unit: "h", status: "overtime" },
          { label: "Today", value: 10.4, unit: "h", status: "fatigue" }
        ]}
      />

      {/* Main Row: Health & Fatigue Monitor + SafeSpeak Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Workforce Health & Fatigue */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="bg-white p-6 sm:p-7 rounded-4xl border border-black/[0.06] flex flex-col gap-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/[0.06] pb-3">
              <div>
                <div className="text-[10px] font-ndot uppercase tracking-widest text-slate-400">
                  FATIGUE GUARDIAN
                </div>
                <h3 className="font-bold text-base text-black">{t.fatigueAlertTitle}</h3>
              </div>

              {/* Minimal filter pills */}
              <div className="flex items-center bg-black/[0.04] p-0.5 rounded-full text-xs font-mono">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1 rounded-full font-medium transition-all ${
                    activeFilter === 'all' ? 'bg-black text-white font-bold' : 'text-slate-600'
                  }`}
                >
                  All ({workersList.length})
                </button>
                <button
                  onClick={() => setActiveFilter('high_fatigue')}
                  className={`px-3 py-1 rounded-full font-medium transition-all ${
                    activeFilter === 'high_fatigue' ? 'bg-[#D9381E] text-white font-bold' : 'text-slate-600'
                  }`}
                >
                  Fatigue ({highFatigueWorkers.length})
                </button>
                <button
                  onClick={() => setActiveFilter('overtime')}
                  className={`px-3 py-1 rounded-full font-medium transition-all ${
                    activeFilter === 'overtime' ? 'bg-black text-white font-bold' : 'text-slate-600'
                  }`}
                >
                  Overtime
                </button>
              </div>
            </div>

            {/* Roster Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-black/[0.06] text-slate-400 text-[10px] uppercase tracking-wider">
                    <th className="py-2.5 px-2">Worker</th>
                    <th className="py-2.5 px-2">Check-In</th>
                    <th className="py-2.5 px-2">Duration</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04]">
                  {filteredWorkers.map((worker) => (
                    <tr key={worker.id} className="hover:bg-black/[0.01]">
                      <td className="py-3 px-2">
                        <div className="font-bold text-black text-xs font-sans">{worker.name}</div>
                        <div className="text-[10px] text-slate-400">{worker.role}</div>
                        {worker.backToBack && (
                          <div className="text-[9px] text-[#D9381E] font-bold mt-0.5">
                            • Back-to-Back Shift Flag
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-2 text-slate-600">{worker.checkIn}</td>

                      <td className="py-3 px-2">
                        <span className="font-bold">{worker.hoursWorked}h</span>
                        {worker.ot > 0 && (
                          <span className="text-[10px] text-[#D9381E] block">
                            +{worker.ot}h OT
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-2">
                        {worker.fatigue === 'rest_granted' ? (
                          <span className="text-emerald-700 text-[11px] font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>Rest Granted</span>
                          </span>
                        ) : worker.fatigue === 'high' ? (
                          <span className="text-[#D9381E] text-[11px] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E]"></span>
                            <span>Fatigued (&gt;10h)</span>
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px] flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            <span>Normal</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-2 text-right">
                        {worker.fatigue === 'high' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleGrantRest(worker.id)}
                              className="px-3 py-1 bg-black hover:bg-slate-800 text-white rounded-full text-[11px] font-bold"
                            >
                              Rest
                            </button>
                            <button
                              onClick={() => handleReassign(worker.id)}
                              className="px-3 py-1 bg-black/[0.04] hover:bg-black/[0.08] text-black rounded-full text-[11px] font-medium"
                            >
                              Relieve
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Compliant</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): SafeSpeak Incident Queue */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="bg-white p-6 sm:p-7 rounded-4xl border border-black/[0.06] flex flex-col gap-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <div className="text-[10px] font-ndot uppercase tracking-widest text-slate-400">
                  INCIDENT QUEUE
                </div>
                <h3 className="font-bold text-base text-black">{t.grievanceFeedTitle}</h3>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-black/[0.05]">
                {grievances.length} Tickets
              </span>
            </div>

            <div className="flex flex-col gap-3 max-h-[460px] overflow-y-auto pr-1">
              {grievances.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-3xl border border-black/[0.06] bg-[#FAFAF8] flex flex-col gap-2 text-xs font-mono"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span>{item.id}</span>
                        <span>•</span>
                        <span>{item.workerAnonymousId}</span>
                      </div>
                      <h4 className="font-bold text-black mt-0.5 font-sans">{item.category}</h4>
                    </div>

                    <div className="flex items-center gap-1 text-[10px]">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'resolved'
                            ? 'bg-emerald-500'
                            : item.status === 'under_investigation'
                            ? 'bg-amber-500'
                            : 'bg-[#D9381E]'
                        }`}
                      ></span>
                      <span className="capitalize">{item.status.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans">"{item.description}"</p>

                  {item.audioSeconds > 0 && (
                    <div className="flex items-center justify-between bg-black/[0.03] px-3 py-1.5 rounded-full text-[11px]">
                      <span>Voice Note ({item.audioSeconds}s)</span>
                      <button
                        onClick={() => handlePlayVoice(item)}
                        className="font-bold text-black hover:text-[#D9381E]"
                      >
                        {playingVoiceId === item.id ? 'Playing...' : 'Play'}
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-black/[0.04]">
                    <span className="text-[10px] text-slate-400">{item.timestamp}</span>

                    <div className="flex items-center gap-1.5">
                      {item.status === 'submitted' && (
                        <button
                          onClick={() =>
                            onUpdateGrievanceStatus(item.id, 'under_investigation', 'Safety investigator assigned to zone.')
                          }
                          className="px-3 py-1 bg-black/[0.05] hover:bg-black/[0.1] text-black font-bold rounded-full text-[11px]"
                        >
                          Investigate
                        </button>
                      )}

                      {item.status !== 'resolved' && (
                        <button
                          onClick={() =>
                            onUpdateGrievanceStatus(item.id, 'resolved', 'Corrective action taken & safety certified.')
                          }
                          className="px-3 py-1 bg-black hover:bg-slate-800 text-white font-bold rounded-full text-[11px]"
                        >
                          Resolve & Close
                        </button>
                      )}

                      {item.status === 'resolved' && (
                        <span className="text-emerald-700 text-[11px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Certified Closed</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nothing CMF Workforce Wellbeing & Sentiment Grid (Replacing the black pie chart) */}
      <div className="bg-white p-6 sm:p-8 rounded-4xl border border-black/[0.06] shadow-2xs flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
          <div>
            <div className="text-[10px] font-ndot uppercase tracking-widest text-[#D9381E]">
              WORKFORCE WELLBEING & ATTRITION RISK
            </div>
            <h3 className="font-bold text-lg text-black mt-0.5">Sentiment Metrics & Retention Matrix</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Continuous monitoring across 6 key labor factors (UN SDG 8 Aligned)
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-400">Turnover Risk Index:</span>
            <span className="px-3 py-1 rounded-full bg-[#111111] text-white font-bold font-ndot">
              {sectorConfig.attritionData.turnoverRiskPercent}%
            </span>
          </div>
        </div>

        {/* 6 Sentiment Factor Progress Cards in CMF Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sentimentVectors.map((v, i) => (
            <div
              key={i}
              className="p-4 rounded-3xl bg-[#FAFAF8] border border-black/[0.05] flex flex-col justify-between min-h-[110px]"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-black font-sans">{v.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    v.score < 50
                      ? 'bg-[#D9381E]/10 text-[#D9381E]'
                      : 'bg-black/[0.05] text-slate-600'
                  }`}
                >
                  {v.status}
                </span>
              </div>

              <div className="flex items-baseline justify-between mt-2">
                <span className="font-ndot text-3xl text-black">{v.score}%</span>
                <span className="text-[11px] font-mono text-slate-400">
                  {v.count} responses
                </span>
              </div>

              {/* Progress Bar in CMF Style */}
              <div className="w-full h-1.5 bg-black/[0.06] rounded-full mt-2 overflow-hidden">
                <div
                  style={{ width: `${v.score}%` }}
                  className={`h-full rounded-full ${
                    v.score < 50 ? 'bg-[#D9381E]' : 'bg-[#111111]'
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* SDG 8 Actionable Retention Interventions */}
        <div className="p-5 rounded-3xl bg-[#111111] text-white flex flex-col gap-3 font-mono text-xs">
          <div className="text-[10px] font-ndot uppercase tracking-widest text-[#D9381E]">
            SDG 8 RECOMMENDED RETENTION ACTIONS
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sectorConfig.attritionData.recommendations.map((rec, idx) => (
              <div key={idx} className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E] shrink-0 mt-1.5"></span>
                <span className="text-slate-300 leading-relaxed text-[11px]">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
