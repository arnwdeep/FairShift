import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  Mic,
  QrCode,
  Check,
  Send,
  AlertCircle,
  ArrowRightLeft,
  ShieldCheck,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  FileText
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

  // Shift wage calculations
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
      alert(t.incidentNotesPlaceholder || 'Please provide details or record audio.');
      return;
    }

    const generatedId = `GRV-${sectorConfig.code}-${Math.floor(100 + Math.random() * 900)}`;
    const newGrievance = {
      id: generatedId,
      workerAnonymousId: `Worker #${worker.badgeId.slice(-4)}`,
      category: selectedHazard || 'Workplace Safety Concern',
      urgency: urgency,
      status: 'submitted',
      timestamp: 'Just now',
      audioSeconds: recordedAudioAvailable ? (recordingSeconds || 14) : null,
      description: grievanceNotes || 'Voice note report submitted with urgent priority.',
      assignedTo: 'Safety Desk',
      actionLog: 'Report received and queued for investigation.'
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

  const statusLabels = {
    submitted: t.statusSubmitted || 'Submitted',
    under_review: t.statusInvestigating || 'Under Investigation',
    resolved: t.statusResolved || 'Resolved'
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-8 flex flex-col gap-8 text-[#111111]">
      {/* Top Header Card: Desktop Dashboard Overview */}
      <div className="bg-white p-6 sm:p-8 rounded-4xl border border-black/[0.06] shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D9381E]"></span>
            <span className="text-[10px] font-ndot uppercase tracking-widest text-slate-400">
              {t.workerDashboard}
            </span>
            <span className="text-xs font-mono text-slate-500">• {worker.badgeId}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-1 flex items-center gap-3">
            <span>{worker.name}</span>
            <span className="text-xs font-mono font-normal text-slate-500 bg-black/[0.04] px-3 py-1 rounded-full border border-black/[0.05]">
              {worker.role}
            </span>
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 mt-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D9381E]" />
              <span>{sectorConfig.siteName}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className={`w-2 h-2 rounded-full ${isClockedIn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
              <span>{isClockedIn ? t.shiftActive : t.shiftPaused}</span>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsClockedIn(!isClockedIn)}
            className={`px-5 py-2.5 rounded-full font-mono text-xs font-bold transition-all ${
              isClockedIn
                ? 'bg-[#111111] text-white hover:bg-slate-800'
                : 'bg-[#D9381E] text-white hover:bg-[#B52810]'
            }`}
          >
            {isClockedIn ? t.clockOut : t.clockIn}
          </button>

          <button
            type="button"
            onClick={() => setIsQRModalOpen(true)}
            className="px-4 py-2.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-black font-mono text-xs font-semibold border border-black/[0.06] transition-colors flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{t.scanQR}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPulseOpen(true)}
            className="px-4 py-2.5 rounded-full bg-white text-slate-700 hover:text-black font-mono text-xs font-semibold border border-black/[0.08] transition-colors"
          >
            {t.pulse}
          </button>

          <button
            type="button"
            onClick={() => setIsDiscrepancyOpen(true)}
            className="px-4 py-2.5 rounded-full bg-white text-slate-700 hover:text-black font-mono text-xs font-semibold border border-black/[0.08] transition-colors"
          >
            {t.reportDiscrepancy}
          </button>
        </div>
      </div>

      {/* Top 4 KPI Stat Grid across the full width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Shift Duration */}
        <div className="bg-white p-6 rounded-4xl border border-black/[0.06] shadow-2xs flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 uppercase tracking-widest text-[10px] font-ndot">{t.hoursWorked}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="my-2">
            <div className="font-ndot text-4xl sm:text-5xl text-black tracking-tight">
              {hoursWorked}h
            </div>
            <div className="text-xs font-mono text-slate-500 mt-1">
              {t.activeShiftTimer} • 07:30 Start
            </div>
          </div>
          <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-black/[0.05] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E]"></span>
            <span>{t.gpsVerified}</span>
          </div>
        </div>

        {/* Card 2: Today's Accrued Earnings */}
        <div className="bg-white p-6 rounded-4xl border border-black/[0.06] shadow-2xs flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 uppercase tracking-widest text-[10px] font-ndot">{t.todayEarnings}</span>
            <span className="text-[10px] font-mono text-slate-400 bg-black/[0.04] px-2 py-0.5 rounded-full">₹{baseRate}/h</span>
          </div>
          <div className="my-2">
            <div className="font-ndot text-4xl sm:text-5xl text-black tracking-tight">
              ₹{grossPay}
            </div>
            <div className="text-xs font-mono text-slate-500 mt-1">
              {t.baseOtCalc}
            </div>
          </div>
          <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-black/[0.05]">
            Net Pay: ₹{netPay} (after 12% PF)
          </div>
        </div>

        {/* Card 3: Overtime & Fatigue Check */}
        <div className="bg-[#111111] text-white p-6 rounded-4xl shadow-xs flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 uppercase tracking-widest text-[10px] font-ndot">{t.overtimeStatus}</span>
            <span className={`w-2 h-2 rounded-full ${overtimeHours > 0 ? 'bg-[#D9381E]' : 'bg-emerald-400'}`}></span>
          </div>
          <div className="my-2">
            <div className="font-ndot text-4xl sm:text-5xl text-white tracking-tight">
              {overtimeHours > 0 ? `+${overtimeHours}h` : '0.0h'}
            </div>
            <div className="text-xs font-mono text-slate-400 mt-1">
              {overtimeHours > 0 ? t.otActivated : t.withinCap}
            </div>
          </div>
          <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-white/10">
            {t.auditedLedger}
          </div>
        </div>

        {/* Card 4: SafeSpeak & Workplace Protection */}
        <div className="bg-white p-6 rounded-4xl border border-black/[0.06] shadow-2xs flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 uppercase tracking-widest text-[10px] font-ndot">{t.safeSpeakStatus}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-2">
            <div className="font-ndot text-3xl sm:text-4xl text-black tracking-tight">
              {t.verifiedSafe}
            </div>
            <div className="text-xs font-mono text-slate-500 mt-1">
              {grievances.length} Active SafeSpeak Reports
            </div>
          </div>
          <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-black/[0.05]">
            Zero Retaliation Protected
          </div>
        </div>
      </div>

      {/* Full-Width Tab Navigation Pill Bar */}
      <div className="w-full flex items-center justify-start overflow-x-auto pb-1">
        <div className="flex items-center bg-[#111111] p-1.5 rounded-full shadow-xs gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('shift')}
            className={`px-5 sm:px-6 py-2 rounded-full text-xs font-mono transition-all flex items-center gap-2 ${
              activeTab === 'shift'
                ? 'bg-white text-black font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{t.tabShift}</span>
            {activeTab === 'shift' && <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E]"></span>}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payslip')}
            className={`px-5 sm:px-6 py-2 rounded-full text-xs font-mono transition-all flex items-center gap-2 ${
              activeTab === 'payslip'
                ? 'bg-white text-black font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{t.tabPayslip}</span>
            {activeTab === 'payslip' && <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E]"></span>}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('safety')}
            className={`px-5 sm:px-6 py-2 rounded-full text-xs font-mono transition-all flex items-center gap-2 ${
              activeTab === 'safety'
                ? 'bg-white text-black font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{t.tabSafety}</span>
            {activeTab === 'safety' && <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E]"></span>}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('passport')}
            className={`px-5 sm:px-6 py-2 rounded-full text-xs font-mono transition-all flex items-center gap-2 ${
              activeTab === 'passport'
                ? 'bg-white text-black font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{t.tabPassport}</span>
            {activeTab === 'passport' && <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E]"></span>}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('swap')}
            className={`px-5 sm:px-6 py-2 rounded-full text-xs font-mono transition-all flex items-center gap-2 ${
              activeTab === 'swap'
                ? 'bg-white text-black font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{t.tabSwap}</span>
            {activeTab === 'swap' && <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E]"></span>}
          </button>
        </div>
      </div>

      {/* TAB 1: SHIFT PATTERN & ACTIVITY (Desktop Layout) */}
      {activeTab === 'shift' && (
        <div className="flex flex-col gap-6">
          {/* Side by Side Charts on Laptop/Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* CMF Stepped Block Shift Tracker */}
            <CmfShiftBlockChart
              hoursWorked={hoursWorked}
              overtimeHours={overtimeHours}
              shiftDate={`${t.today} • Oct 27, 2026`}
              t={t}
            />

            {/* Architectural Folded Ribbon Line Chart */}
            <FoldedTrendChart
              title={t.weeklyTrajectoryTitle}
              subtitle={t.weeklyTrajectorySubtitle}
              t={t}
              data={[
                { label: t.mon || "Mon", value: 7.5, unit: "h", status: "normal" },
                { label: t.tue || "Tue", value: 8.0, unit: "h", status: "normal" },
                { label: t.wed || "Wed", value: 6.5, unit: "h", status: "normal" },
                { label: t.thu || "Thu", value: 9.8, unit: "h", status: "overtime" },
                { label: t.fri || "Fri", value: 11.2, unit: "h", status: "fatigue" },
                { label: t.sat || "Sat", value: 8.5, unit: "h", status: "overtime" },
                { label: t.today || "Today", value: hoursWorked, unit: "h", status: overtimeHours > 0 ? "overtime" : "normal" }
              ]}
            />
          </div>

          {/* Biometric Attendance Log Table */}
          <div className="bg-white p-6 sm:p-8 rounded-4xl border border-black/[0.06] shadow-2xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <div className="text-[10px] font-ndot uppercase tracking-widest text-slate-400">
                  ATTENDANCE AUDIT LOG
                </div>
                <h3 className="text-lg font-bold text-black mt-0.5">Biometric Shift Records</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">GPS Geofence: Pier 4B</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-black/[0.06] text-slate-400 text-[10px] uppercase">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Check-In</th>
                    <th className="py-2.5 px-3">Check-Out</th>
                    <th className="py-2.5 px-3">Hours</th>
                    <th className="py-2.5 px-3">Overtime</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Audit Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.03]">
                  <tr className="hover:bg-black/[0.01]">
                    <td className="py-3 px-3 font-bold text-black">Today (Oct 27)</td>
                    <td className="py-3 px-3">07:30 AM</td>
                    <td className="py-3 px-3 text-[#D9381E] font-medium">In Progress</td>
                    <td className="py-3 px-3 font-bold">{hoursWorked}h</td>
                    <td className="py-3 px-3 text-[#D9381E] font-bold">+{overtimeHours}h</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">0x7F2B..441</td>
                  </tr>
                  <tr className="hover:bg-black/[0.01]">
                    <td className="py-3 px-3 text-slate-700">Oct 26, 2026</td>
                    <td className="py-3 px-3">07:30 AM</td>
                    <td className="py-3 px-3">04:30 PM</td>
                    <td className="py-3 px-3 font-bold">8.5h</td>
                    <td className="py-3 px-3 text-[#D9381E] font-bold">+0.5h</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                        Completed
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">0x99A4..1E8</td>
                  </tr>
                  <tr className="hover:bg-black/[0.01]">
                    <td className="py-3 px-3 text-slate-700">Oct 25, 2026</td>
                    <td className="py-3 px-3">08:00 AM</td>
                    <td className="py-3 px-3">04:00 PM</td>
                    <td className="py-3 px-3 font-bold">8.0h</td>
                    <td className="py-3 px-3 text-slate-400">0.0h</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                        Completed
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">0x12A8..3BC</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRANSPARENT PAYSLIP */}
      {activeTab === 'payslip' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-4xl border border-black/[0.06] shadow-2xs flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
              <div>
                <div className="text-[10px] font-ndot uppercase tracking-widest text-slate-400">
                  {t.payrollComputation}
                </div>
                <h3 className="font-bold text-lg text-black mt-0.5">{t.payslipTitle}</h3>
              </div>
              <AudioPlayerButton text={t.payslipVoiceText} lang={currentLang} size="sm" />
            </div>

            <div className="flex flex-col gap-3 font-mono text-xs">
              <div className="flex justify-between items-center py-2.5 border-b border-black/[0.04]">
                <div>
                  <div className="font-bold text-black text-sm">{t.basePay}</div>
                  <div className="text-slate-400 text-[11px]">{regularHours}h @ ₹{baseRate}/h</div>
                </div>
                <span className="font-bold text-sm">₹{baseEarnings}</span>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-black/[0.04]">
                <div>
                  <div className="font-bold text-[#D9381E] text-sm flex items-center gap-1.5">
                    <span>{t.otPay}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E]"></span>
                  </div>
                  <div className="text-slate-400 text-[11px]">{overtimeHours}h @ ₹{otRate}/h (1.5x)</div>
                </div>
                <span className="font-bold text-sm text-[#D9381E]">₹{otEarnings}</span>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-black/[0.04] text-slate-500">
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
                    {t.netTakeHome}
                  </div>
                  <div className="font-ndot text-4xl sm:text-5xl text-black mt-1">₹{netPay}</div>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-black text-white text-xs font-bold font-mono">
                  {t.estimated}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-mono text-slate-400">{t.noticeIncorrect}</span>
              <button
                type="button"
                onClick={() => setIsDiscrepancyOpen(true)}
                className="px-4 py-2 bg-black/[0.05] hover:bg-black/[0.1] text-black font-mono text-xs font-bold rounded-full transition-colors"
              >
                {t.reportMissingHours}
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-[#111111] text-white p-6 sm:p-8 rounded-4xl shadow-xs flex flex-col gap-4">
              <div className="text-[10px] font-ndot uppercase tracking-widest text-[#D9381E]">
                {t.wageAuditGuarantee}
              </div>
              <h4 className="font-bold text-base text-white">{t.cryptographicVerification}</h4>
              <p className="text-slate-300 text-xs font-mono leading-relaxed">
                {t.wageAuditGuaranteeDesc}
              </p>
              <div className="font-mono text-[10px] text-slate-400 bg-white/5 p-3 rounded-2xl border border-white/5">
                {t.ledgerHash}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SAFESPEAK ANONYMOUS REPORTING */}
      {activeTab === 'safety' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-4xl border border-black/[0.06] shadow-2xs flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <div className="text-[10px] font-ndot uppercase tracking-widest text-slate-400">
                  {t.safeSpeakTitle}
                </div>
                <h3 className="font-bold text-lg text-black mt-0.5">{t.safeSpeakHeading}</h3>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>

            {submissionSuccess && (
              <div className="p-4 bg-black text-white rounded-3xl text-xs font-mono flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Check className="w-4 h-4" />
                  <span>{t.reportCreated}: {submittedCaseId}</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Anonymous ticket submitted to the safety queue. You can track resolution below.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmitGrievance} className="flex flex-col gap-4 text-xs font-mono">
              <div>
                <label className="font-bold text-black uppercase tracking-wider text-[10px] block mb-1.5">
                  {t.selectHazardCategory}
                </label>
                <select
                  value={selectedHazard}
                  onChange={(e) => setSelectedHazard(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[#F8F8F6] border border-black/[0.08] text-xs text-black focus:outline-hidden focus:border-black"
                >
                  <option value="">{t.selectHazardPlaceholder}</option>
                  {sectorConfig.hazardCategories.map((h) => (
                    <option key={h.id} value={h.label}>
                      {h.label} ({h.severity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-black uppercase tracking-wider text-[10px] block mb-1.5">
                  {t.priorityUrgency}
                </label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setUrgency(lvl)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        urgency === lvl
                          ? lvl === 'High'
                            ? 'bg-[#D9381E] text-white border-[#D9381E]'
                            : 'bg-black text-white border-black'
                          : 'bg-[#F8F8F6] text-slate-700 border-black/[0.06] hover:bg-slate-100'
                      }`}
                    >
                      {lvl === 'High' ? t.urgentHigh : lvl === 'Medium' ? t.urgentMedium : t.urgentLow}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-black uppercase tracking-wider text-[10px] block mb-1.5">
                  {t.incidentDetails}
                </label>
                <textarea
                  rows={3}
                  value={grievanceNotes}
                  onChange={(e) => setGrievanceNotes(e.target.value)}
                  placeholder={t.notesPlaceholder}
                  className="w-full p-3 rounded-2xl bg-[#F8F8F6] border border-black/[0.08] text-xs text-black placeholder:text-slate-400 focus:outline-hidden focus:border-black"
                />
              </div>

              {/* Voice Note Button */}
              <div className="p-4 rounded-3xl bg-[#F8F8F6] border border-black/[0.06] flex items-center justify-between">
                <div>
                  <div className="font-bold text-black">{t.voiceIncidentNote}</div>
                  <div className="text-[11px] text-slate-500">
                    {isRecording ? `Recording (${recordingSeconds}s)...` : recordedAudioAvailable ? t.voiceNoteAttached : 'Tap to record incident statement'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all ${
                    isRecording
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-[#111111] text-white hover:bg-slate-800'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isRecording ? t.stopRecording : t.recordVoiceNote}</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#D9381E] hover:bg-[#B52810] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>{t.submitSafeSpeakBtn}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Active Grievances Ledger */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white p-6 sm:p-8 rounded-4xl border border-black/[0.06] shadow-2xs flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                <h4 className="font-bold text-sm text-black">{t.recentSafeSpeakTickets}</h4>
                <span className="text-[10px] font-mono text-slate-400">{grievances.length} Active</span>
              </div>

              <div className="flex flex-col gap-3 font-mono text-xs max-h-[500px] overflow-y-auto pr-1">
                {grievances.map((g) => (
                  <div key={g.id} className="p-4 rounded-3xl bg-[#F8F8F6] border border-black/[0.05] flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-black">{g.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        g.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : g.status === 'under_review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-black text-white'
                      }`}>
                        {statusLabels[g.status] || g.status}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-800 text-xs">{g.category}</div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">{g.description}</p>

                    {g.actionLog && (
                      <div className="text-[10px] bg-white p-2 rounded-xl border border-black/[0.04] text-slate-600">
                        <span className="font-bold text-black">Action Log: </span>
                        {g.actionLog}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DIGITAL SKILL PASSPORT */}
      {activeTab === 'passport' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-4xl border border-black/[0.06] shadow-2xs flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <div className="text-[10px] font-ndot uppercase tracking-widest text-slate-400">
                  {t.passportTitle}
                </div>
                <h3 className="font-bold text-lg text-black mt-0.5">{t.verifiedCertifications}</h3>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>

            <div className="flex flex-col gap-3 font-mono text-xs">
              {worker.certifications.map((cert) => (
                <div key={cert.id} className="p-4 rounded-3xl bg-[#F8F8F6] border border-black/[0.05] flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-black text-sm">{cert.title}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      {cert.issuer} • {cert.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                      {cert.status}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">{cert.hash}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-[#111111] text-white p-6 sm:p-8 rounded-4xl shadow-xs flex flex-col gap-4">
              <div className="text-[10px] font-ndot uppercase tracking-widest text-[#D9381E]">
                {t.verifiedShiftsLedger}
              </div>
              <div className="grid grid-cols-2 gap-4 my-2">
                <div>
                  <div className="text-slate-400 text-xs font-mono">{t.lifetimeHours}</div>
                  <div className="font-ndot text-3xl text-white mt-1">{worker.lifetimeHours}h</div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs font-mono">{t.verifiedShifts}</div>
                  <div className="font-ndot text-3xl text-white mt-1">{worker.verifiedShifts}</div>
                </div>
              </div>
              <p className="text-slate-300 text-xs font-mono leading-relaxed pt-2 border-t border-white/10">
                {t.verifiedByBadge}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PEER SHIFT SWAP */}
      {activeTab === 'swap' && (
        <div className="bg-white p-6 sm:p-8 rounded-4xl border border-black/[0.06] shadow-2xs flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.06] pb-4">
            <div>
              <div className="text-[10px] font-ndot uppercase tracking-widest text-slate-400">
                PEER WORKFORCE COLLABORATION
              </div>
              <h3 className="font-bold text-lg text-black mt-0.5">{t.swapTitle}</h3>
              <p className="text-slate-500 font-mono text-xs mt-1">{t.swapSubtitle}</p>
            </div>

            <button
              type="button"
              onClick={() => setIsSwapOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-mono font-bold transition-all flex items-center gap-2 self-start"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-[#D9381E]" />
              <span>{t.requestSwapBtn}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-3xl bg-[#F8F8F6] border border-black/[0.05] flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Step 1: Skill Match</span>
              <p className="text-slate-700 text-xs">Coworker must hold verified credentials for the assigned site equipment.</p>
            </div>
            <div className="p-4 rounded-3xl bg-[#F8F8F6] border border-black/[0.05] flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Step 2: Fatigue Check</span>
              <p className="text-slate-700 text-xs">Automated turnaround validator requires a minimum 12-hour rest buffer.</p>
            </div>
            <div className="p-4 rounded-3xl bg-[#F8F8F6] border border-black/[0.05] flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Step 3: Supervisor Sign-Off</span>
              <p className="text-slate-700 text-xs">Supervisors review trades with single-tap tamper-evident ledger logging.</p>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <QRScannerModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        onScanSuccess={() => {
          setIsClockedIn(true);
          setIsQRModalOpen(false);
        }}
        t={t}
      />

      <DiscrepancyModal
        isOpen={isDiscrepancyOpen}
        onClose={() => setIsDiscrepancyOpen(false)}
        workerId={worker.badgeId}
        workerName={worker.name}
        currentHours={hoursWorked}
        t={t}
      />

      <ShiftSwapModal
        isOpen={isSwapOpen}
        onClose={() => setIsSwapOpen(false)}
        workerId={worker.badgeId}
        workerName={worker.name}
        sector={sectorConfig.id}
        t={t}
      />

      <WorkplacePulseModal
        isOpen={isPulseOpen}
        onClose={() => setIsPulseOpen(false)}
        sector={sectorConfig.id}
        t={t}
      />
    </div>
  );
}
