import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  SlidersHorizontal,
  Mic,
  Square,
  QrCode,
  Check,
  Send,
  AlertCircle,
  ArrowRightLeft,
  ShieldCheck,
  Clock,
  MapPin,
  Calendar
} from 'lucide-react';
import QRScannerModal from './QRScannerModal';
import AudioPlayerButton from './AudioPlayerButton';
import FoldedTrendChart from './FoldedTrendChart';
import CmfShiftBlockChart from './CmfShiftBlockChart';
import DiscrepancyModal from './DiscrepancyModal';
import ShiftSwapModal from './ShiftSwapModal';
import WorkplacePulseModal from './WorkplacePulseModal';

export default function WorkerPortal({
  sectorConfig,
  currentLang,
  t,
  grievances,
  onAddGrievance,
  isClockedIn,
  setIsClockedIn,
  shiftSeconds,
  setShiftSeconds,
  onOpenVoiceModal,
  isOffline = false
}) {
  const [activeTab, setActiveTab] = useState('shift'); // 'shift', 'payslip', 'safety', 'passport', 'swap'
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [isDiscrepancyOpen, setIsDiscrepancyOpen] = useState(false);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [isPulseOpen, setIsPulseOpen] = useState(false);

  // Voice note state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioAvailable, setRecordedAudioAvailable] = useState(false);

  // Safety form state
  const [selectedHazard, setSelectedHazard] = useState('');
  const [urgency, setUrgency] = useState('High');
  const [grievanceNotes, setGrievanceNotes] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submittedCaseId, setSubmittedCaseId] = useState('');

  // Shift wage math
  const hoursWorked = +(shiftSeconds / 3600).toFixed(2);
  const standardShiftMax = 8.0;
  const regularHours = Math.min(hoursWorked, standardShiftMax);
  const overtimeHours = Math.max(0, +(hoursWorked - standardShiftMax).toFixed(2));

  const baseRate = sectorConfig.worker.baseRatePerHour;
  const otRate = sectorConfig.worker.otRatePerHour;

  const baseEarnings = Math.round(regularHours * baseRate);
  const otEarnings = Math.round(overtimeHours * otRate);
  const grossPay = baseEarnings + otEarnings;
  const pfDeduction = Math.round(grossPay * 0.12);
  const netPay = grossPay - pfDeduction;

  const worker = sectorConfig.worker;

  // Recording timer
  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setRecordedAudioAvailable(false);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setRecordedAudioAvailable(true);
  };

  const handleSubmitGrievance = (e) => {
    e.preventDefault();
    if (!selectedHazard && !grievanceNotes && !recordedAudioAvailable) {
      return;
    }

    const generatedId = `CASE-${(sectorConfig.id || 'SEC').slice(0, 2).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const newGrievance = {
      id: generatedId,
      sector: sectorConfig.id,
      workerId: 'usr_w1',
      workerAnonymousId: `Worker #${worker.badgeId.split('-')[2] || '4092'}`,
      category: selectedHazard || sectorConfig.hazardCategories[0].label,
      severity: urgency,
      urgency,
      status: 'submitted',
      timestamp: 'Just now',
      audioSeconds: recordedAudioAvailable ? Math.max(recordingSeconds, 10) : 0,
      description: grievanceNotes || (recordedAudioAvailable ? 'Voice recording attached' : 'Direct hazard log'),
      assignedTo: 'Site Safety Officer',
      actionLog: 'Report queued in anonymous audit stream.'
    };

    onAddGrievance(newGrievance);
    setSubmittedCaseId(generatedId);
    setSubmissionSuccess(true);
    setSelectedHazard('');
    setGrievanceNotes('');
    setRecordedAudioAvailable(false);
    setRecordingSeconds(0);

    setTimeout(() => setSubmissionSuccess(false), 5000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 sm:px-8 flex flex-col gap-6 select-none">
      {/* Top Banner Card: CMF by Nothing Aesthetic */}
      <div className="bg-white p-6 rounded-4xl border border-black/[0.06] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D9381E]"></span>
            <span className="text-[10px] font-ndot uppercase tracking-widest text-slate-400">
              WORKER DASHBOARD
            </span>
            <span className="text-xs font-mono text-slate-500">• {worker.badgeId}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-1 flex items-center gap-3">
            <span>{worker.name}</span>
            <span className="text-xs font-mono font-normal text-slate-500 bg-black/[0.04] px-3 py-1 rounded-full">
              {worker.role}
            </span>
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#D9381E]" />
              <span>{sectorConfig.siteName}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <span className={`w-1.5 h-1.5 rounded-full ${isClockedIn ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              <span>{isClockedIn ? 'Shift Active (Clocked In)' : 'Shift Paused (Clocked Out)'}</span>
            </span>
          </div>
        </div>

        {/* Quick Actions (Clock In/Out & Voice) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsClockedIn(!isClockedIn)}
            className={`px-5 py-2.5 rounded-full font-mono text-xs font-bold transition-all ${
              isClockedIn
                ? 'bg-[#111111] text-white hover:bg-slate-800'
                : 'bg-[#D9381E] text-white hover:bg-[#B52810]'
            }`}
          >
            {isClockedIn ? 'CLOCK OUT' : 'CLOCK IN'}
          </button>

          <button
            onClick={() => setIsQRModalOpen(true)}
            className="px-4 py-2.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-black font-mono text-xs font-semibold border border-black/[0.06] transition-colors"
          >
            SCAN QR
          </button>

          <button
            onClick={() => setIsPulseOpen(true)}
            className="px-4 py-2.5 rounded-full bg-white text-slate-700 hover:text-black font-mono text-xs font-semibold border border-black/[0.08] transition-colors"
          >
            PULSE
          </button>
        </div>
      </div>

      {/* CMF Tab Navigation Pill Bar (Suitable for Laptop & Mobile) */}
      <div className="w-full flex items-center justify-between overflow-x-auto pb-1">
        <div className="flex items-center bg-[#111111] p-1.5 rounded-full shadow-xs gap-1">
          <button
            onClick={() => setActiveTab('shift')}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs font-mono transition-all flex items-center gap-2 ${
              activeTab === 'shift'
                ? 'bg-white text-black font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Shift Pattern</span>
            {activeTab === 'shift' && <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E]"></span>}
          </button>

          <button
            onClick={() => setActiveTab('payslip')}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs font-mono transition-all flex items-center gap-2 ${
              activeTab === 'payslip'
                ? 'bg-white text-black font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Payslip</span>
            {activeTab === 'payslip' && <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E]"></span>}
          </button>

          <button
            onClick={() => setActiveTab('safety')}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs font-mono transition-all flex items-center gap-2 ${
              activeTab === 'safety'
                ? 'bg-white text-black font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>SafeSpeak</span>
            {activeTab === 'safety' && <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E]"></span>}
          </button>

          <button
            onClick={() => setActiveTab('passport')}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs font-mono transition-all flex items-center gap-2 ${
              activeTab === 'passport'
                ? 'bg-white text-black font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Skill Passport</span>
            {activeTab === 'passport' && <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E]"></span>}
          </button>

          <button
            onClick={() => setActiveTab('swap')}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs font-mono transition-all flex items-center gap-2 ${
              activeTab === 'swap'
                ? 'bg-white text-black font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Shift Swap</span>
            {activeTab === 'swap' && <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E]"></span>}
          </button>
        </div>
      </div>

      {/* TAB 1: SHIFT PATTERN & EARNINGS (Laptop: 2-column Grid, Mobile: 1-column) */}
      {activeTab === 'shift' && (
        <div className="flex flex-col gap-6">
          {/* Top 3 CMF Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1: Shift Duration Dot Matrix Card */}
            <div className="bg-white p-6 rounded-4xl border border-black/[0.06] shadow-2xs flex flex-col justify-between min-h-[160px]">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 uppercase tracking-widest text-[10px] font-ndot">SHIFT DURATION</span>
                <span className="w-2 h-2 rounded-full bg-[#D9381E]"></span>
              </div>
              <div className="my-2">
                <div className="font-ndot text-4xl sm:text-5xl text-black tracking-tight">
                  {hoursWorked}
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  HOURS RECORDED TODAY
                </div>
              </div>
              <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-black/[0.04]">
                Standard 8.0h threshold
              </div>
            </div>

            {/* Card 2: Estimated Earnings Today */}
            <div className="bg-[#D9381E] text-white p-6 rounded-4xl shadow-xs flex flex-col justify-between min-h-[160px]">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/80 uppercase tracking-widest text-[10px] font-ndot">ESTIMATED PAY</span>
                <ArrowUpRight className="w-4 h-4 text-white/80" />
              </div>
              <div className="my-2">
                <div className="font-ndot text-4xl sm:text-5xl text-white tracking-tight">
                  ₹{grossPay}
                </div>
                <div className="text-xs font-mono text-white/80 mt-1">
                  Base: ₹{baseEarnings} {otEarnings > 0 && `+ OT: ₹${otEarnings}`}
                </div>
              </div>
              <div className="text-[11px] font-mono text-white/80 pt-2 border-t border-white/20 flex justify-between">
                <span>Rate: ₹{baseRate}/h</span>
                <span>OT: ₹{otRate}/h</span>
              </div>
            </div>

            {/* Card 3: Overtime & Fatigue Check */}
            <div className="bg-[#111111] text-white p-6 rounded-4xl shadow-xs flex flex-col justify-between min-h-[160px]">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 uppercase tracking-widest text-[10px] font-ndot">OVERTIME STATUS</span>
                <span className={`w-2 h-2 rounded-full ${overtimeHours > 0 ? 'bg-[#D9381E]' : 'bg-emerald-400'}`}></span>
              </div>
              <div className="my-2">
                <div className="font-ndot text-4xl sm:text-5xl text-white tracking-tight">
                  {overtimeHours > 0 ? `+${overtimeHours}h` : '0.0h'}
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  {overtimeHours > 0 ? '1.5x Overtime Rate Activated' : 'Within Standard Safe Shift'}
                </div>
              </div>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-white/10">
                Audited to tamper-evident ledger
              </div>
            </div>
          </div>

          {/* CMF Stepped Block Shift Tracker (Directly from reference image) */}
          <CmfShiftBlockChart
            hoursWorked={hoursWorked}
            overtimeHours={overtimeHours}
            shiftDate="Today • Oct 27, 2026"
          />

          {/* Architectural Folded Ribbon Line Chart (Reference Image 1) */}
          <FoldedTrendChart
            title="Weekly Shift Duration Trajectory"
            subtitle="7-day shift patterns vs 8h standard cap"
            data={[
              { label: "Mon", value: 7.5, unit: "h", status: "normal" },
              { label: "Tue", value: 8.0, unit: "h", status: "normal" },
              { label: "Wed", value: 6.5, unit: "h", status: "normal" },
              { label: "Thu", value: 9.8, unit: "h", status: "overtime" },
              { label: "Fri", value: 11.2, unit: "h", status: "fatigue" },
              { label: "Sat", value: 8.5, unit: "h", status: "overtime" },
              { label: "Today", value: hoursWorked, unit: "h", status: overtimeHours > 0 ? "overtime" : "normal" }
            ]}
          />
        </div>
      )}

      {/* TAB 2: TRANSPARENT PAYSLIP */}
      {activeTab === 'payslip' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-4xl border border-black/[0.06] shadow-2xs flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
              <div>
                <div className="text-[10px] font-ndot uppercase tracking-widest text-slate-400">
                  PAYROLL COMPUTATION
                </div>
                <h3 className="font-bold text-lg text-black mt-0.5">{t.payslipTitle}</h3>
              </div>
              <AudioPlayerButton text={t.payslipVoiceText} lang={currentLang} size="sm" />
            </div>

            <div className="flex flex-col gap-3 font-mono text-xs">
              <div className="flex justify-between items-center py-2 border-b border-black/[0.04]">
                <div>
                  <div className="font-bold text-black text-sm">{t.basePay}</div>
                  <div className="text-slate-400 text-[11px]">{regularHours}h @ ₹{baseRate}/h</div>
                </div>
                <span className="font-bold text-sm">₹{baseEarnings}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-black/[0.04]">
                <div>
                  <div className="font-bold text-[#D9381E] text-sm flex items-center gap-1.5">
                    <span>{t.otPay}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E]"></span>
                  </div>
                  <div className="text-slate-400 text-[11px]">{overtimeHours}h @ ₹{otRate}/h (1.5x)</div>
                </div>
                <span className="font-bold text-sm text-[#D9381E]">₹{otEarnings}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-black/[0.04] text-slate-500">
                <div>
                  <div className="font-medium text-slate-700">{t.deductions}</div>
                  <div className="text-slate-400 text-[11px]">Provident Fund Statutory (12%)</div>
                </div>
                <span className="font-medium text-sm">-₹{pfDeduction}</span>
              </div>

              {/* Net Payout */}
              <div className="mt-2 pt-4 border-t-2 border-black flex justify-between items-center">
                <div>
                  <div className="text-[10px] uppercase font-ndot tracking-widest text-slate-400">
                    NET TAKE-HOME PAY
                  </div>
                  <div className="font-ndot text-4xl text-black mt-1">₹{netPay}</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-black text-white text-xs font-bold">
                  Estimated
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Notice incorrect records?</span>
              <button
                onClick={() => setIsDiscrepancyOpen(true)}
                className="px-4 py-2 bg-black/[0.05] hover:bg-black/[0.1] text-black font-mono text-xs font-bold rounded-full transition-colors"
              >
                Report Missing Hours / Discrepancy
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-[#111111] text-white p-6 rounded-4xl shadow-xs flex flex-col gap-3">
              <div className="text-[10px] font-ndot uppercase tracking-widest text-[#D9381E]">
                WAGE AUDIT GUARANTEE
              </div>
              <h4 className="font-bold text-base text-white">Cryptographic Verification</h4>
              <p className="text-slate-300 text-xs font-mono leading-relaxed">
                Every minute logged is verified with site geo-fencing. Automatic overtime applies when daily hours cross 8.0h.
              </p>
              <div className="font-mono text-[10px] text-slate-500 bg-white/5 p-3 rounded-2xl">
                Ledger Hash: 0x99A41E80B4 • Oct 2026
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SAFESPEAK ANONYMOUS REPORTING */}
      {activeTab === 'safety' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-4xl border border-black/[0.06] shadow-2xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <div className="text-[10px] font-ndot uppercase tracking-widest text-slate-400">
                  SAFESPEAK • ZERO RETALIATION
                </div>
                <h3 className="font-bold text-lg text-black mt-0.5">Anonymous Safety & Grievance Report</h3>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>

            {submissionSuccess && (
              <div className="p-4 bg-black text-white rounded-3xl text-xs font-mono flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Check className="w-4 h-4" />
                  <span>Report Created: {submittedCaseId}</span>
                </div>
                <p className="text-slate-300">
                  Anonymous protection verified. Safety officer assigned for immediate site inspection.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmitGrievance} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-slate-500 block mb-2">
                  Select Hazard Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {sectorConfig.hazardCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedHazard(cat.label)}
                      className={`px-3.5 py-2 rounded-full text-xs font-mono transition-all text-left ${
                        selectedHazard === cat.label
                          ? 'bg-black text-white font-bold'
                          : 'bg-black/[0.04] text-slate-700 hover:bg-black/[0.08]'
                      }`}
                    >
                      <span>{cat.label.split('/')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Note Recorder Button */}
              <div>
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="w-full py-3 px-4 bg-black/[0.04] hover:bg-black/[0.08] text-black text-xs font-mono font-bold rounded-full flex items-center justify-between transition-colors border border-black/[0.06]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#D9381E]"></span>
                      <span>{recordedAudioAvailable ? 'Voice Note Attached (Tap to redo)' : 'Tap to Record Voice Note'}</span>
                    </div>
                    <Mic className="w-4 h-4 text-[#D9381E]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopRecording}
                    className="w-full py-3 px-4 bg-[#D9381E] text-white text-xs font-mono font-bold rounded-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                      <span>Recording... 0:{recordingSeconds.toString().padStart(2, '0')}</span>
                    </div>
                    <Square className="w-4 h-4 fill-white" />
                  </button>
                )}
              </div>

              <textarea
                rows={3}
                value={grievanceNotes}
                onChange={(e) => setGrievanceNotes(e.target.value)}
                placeholder="Describe hazard location or incident..."
                className="w-full p-4 bg-black/[0.03] border border-black/[0.06] rounded-3xl text-xs font-mono text-black placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-black resize-none"
              ></textarea>

              <button
                type="submit"
                className="w-full py-3.5 bg-black hover:bg-slate-800 text-white font-mono font-bold text-xs rounded-full transition-all"
              >
                SUBMIT ANONYMOUS REPORT
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="text-[10px] font-ndot uppercase tracking-widest text-slate-400 px-1">
              RECENT TICKETS
            </div>
            {grievances.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-3xl border border-black/[0.06] text-xs font-mono flex flex-col gap-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black">{item.category}</span>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.status === 'resolved'
                          ? 'bg-emerald-500'
                          : item.status === 'under_investigation'
                          ? 'bg-amber-500'
                          : 'bg-[#D9381E]'
                      }`}
                    ></span>
                    <span className="text-slate-600 capitalize">{item.status.replace('_', ' ')}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans">"{item.description}"</p>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-black/[0.04] flex justify-between">
                  <span>ID: {item.id}</span>
                  <span>{item.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DIGITAL SKILL PASSPORT */}
      {activeTab === 'passport' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-[#111111] text-white p-6 sm:p-8 rounded-4xl flex flex-col gap-5 shadow-xs">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D9381E]"></span>
                <span className="text-[10px] font-ndot uppercase tracking-widest text-slate-400">
                  SKILL PASSPORT
                </span>
              </div>
              <span className="text-slate-400 font-mono">#{worker.badgeId}</span>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight">{worker.name}</h2>
              <p className="text-xs font-mono text-slate-400 mt-1">{worker.role}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <div className="font-ndot text-4xl sm:text-5xl text-white">
                  {worker.lifetimeHours}
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-1">
                  VERIFIED HOURS
                </div>
              </div>

              <div>
                <div className="font-ndot text-4xl sm:text-5xl text-[#D9381E]">
                  {worker.safetyScore}%
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-1">
                  SAFETY COMPLIANCE
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowQRModal(true)}
              className="w-full mt-2 py-3 bg-white text-black font-mono font-bold text-xs rounded-full hover:bg-slate-100 transition-colors"
            >
              SHARE CREDENTIAL QR
            </button>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="text-[10px] font-ndot uppercase tracking-widest text-slate-400 px-1">
              ACCREDITED CERTIFICATIONS
            </div>
            {worker.certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-4 bg-white rounded-3xl border border-black/[0.06] text-xs font-mono flex items-center justify-between shadow-2xs"
              >
                <div>
                  <div className="font-bold text-black text-sm">{cert.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{cert.issuer} • {cert.date}</div>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-bold">
                  {cert.hash}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: FAIRSHIFT SWAP */}
      {activeTab === 'swap' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-4xl border border-black/[0.06] shadow-2xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <div className="text-[10px] font-ndot uppercase tracking-widest text-slate-400">
                  PEER SHIFT EXCHANGE
                </div>
                <h3 className="font-bold text-lg text-black mt-0.5">FairShift Swap</h3>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#D9381E]"></span>
            </div>

            <p className="text-xs font-mono text-slate-600 leading-relaxed">
              Trade your assigned shift with an eligible colleague while maintaining safety certifications and fatigue turnaround compliance.
            </p>

            <button
              onClick={() => setIsSwapOpen(true)}
              className="w-full py-3.5 bg-[#D9381E] text-white font-mono font-bold text-xs rounded-full hover:bg-[#B52810] transition-colors"
            >
              REQUEST NEW SHIFT SWAP
            </button>
          </div>

          <div className="lg:col-span-5 bg-[#111111] text-white p-6 rounded-4xl flex flex-col gap-3 shadow-xs">
            <div className="text-[10px] font-ndot uppercase tracking-widest text-[#D9381E]">
              PENDING SWAPS
            </div>
            <div className="p-4 bg-white/5 rounded-3xl border border-white/10 flex flex-col gap-1 text-xs font-mono">
              <div className="font-bold text-white">With: Sunil Sharma</div>
              <div className="text-slate-400 text-[11px]">Evening Rigging (15:00 - 23:30) • Oct 29</div>
              <div className="text-emerald-400 text-[10px] mt-1">Skill Match & Fatigue Checked • Awaiting Supervisor</div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <QRScannerModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        onScanSuccess={() => setIsClockedIn(true)}
        sectorConfig={sectorConfig}
      />

      <DiscrepancyModal
        isOpen={isDiscrepancyOpen}
        onClose={() => setIsDiscrepancyOpen(false)}
        attendanceRecord={{ id: 'att_live', hoursWorked, date: 'Today' }}
        workerId="usr_w1"
      />

      <ShiftSwapModal
        isOpen={isSwapOpen}
        onClose={() => setIsSwapOpen(false)}
        currentWorker={worker}
        sector={sectorConfig.id}
      />

      <WorkplacePulseModal
        isOpen={isPulseOpen}
        onClose={() => setIsPulseOpen(false)}
        sector={sectorConfig.id}
      />

      {/* Skill Passport Verification QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#111111] text-white rounded-4xl max-w-xs w-full p-6 text-center border border-white/10 shadow-2xl flex flex-col items-center">
            <h3 className="font-bold text-sm text-white mb-1">Worker Credential QR</h3>
            <p className="text-[11px] text-slate-400 font-mono mb-4">Cryptographic Trade Verification</p>

            <div className="w-40 h-40 bg-white p-3 rounded-3xl flex items-center justify-center mb-4">
              <QrCode className="w-32 h-32 text-black" />
            </div>

            <div className="font-mono text-[11px] text-slate-400 bg-white/5 px-3 py-1 rounded-full mb-4">
              ID: {worker.badgeId}
            </div>

            <button
              onClick={() => setShowQRModal(false)}
              className="w-full py-2.5 bg-white text-black font-mono font-bold text-xs rounded-full hover:bg-slate-100 transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
