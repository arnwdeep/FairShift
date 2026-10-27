import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WorkerPortal from './components/WorkerPortal';
import EmployerDashboard from './components/EmployerDashboard';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import NotificationsPopover from './components/NotificationsPopover';
import { translations, sectorConfigs } from './data/mockData';
import { fairShiftDB } from './services/db';
import { FastForward, RotateCcw, Mic, ShieldAlert, Sparkles, Check } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('worker'); // 'worker' | 'employer'
  const [selectedSector, setSelectedSector] = useState('construction'); // 'construction' | 'campus'
  const [currentLang, setCurrentLang] = useState('en'); // 'en' | 'hi' | 'ta'
  const [currentRole, setCurrentRole] = useState('worker'); // 'worker' | 'supervisor' | 'hr' | 'admin'

  // DB State synchronization
  const [dbState, setDbState] = useState(() => fairShiftDB.getState());

  // Shift & Clock state
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [shiftSeconds, setShiftSeconds] = useState(6.5 * 3600); // 6.5 hours default
  const [isOffline, setIsOffline] = useState(false);

  // Modals state
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [demoBannerMessage, setDemoBannerMessage] = useState('');

  // Subscribe to reactive database changes
  useEffect(() => {
    const unsubscribe = fairShiftDB.subscribe((updatedDb) => {
      setDbState({ ...updatedDb });
    });
    return unsubscribe;
  }, []);

  const sectorData = sectorConfigs[selectedSector];
  const t = translations[currentLang] || translations.en;

  // Current worker object
  const currentWorker = dbState.users.find(
    (u) => u.sector === selectedSector && u.role === 'worker'
  ) || dbState.users[0];

  const currentGrievances = (dbState.hazardsAndGrievances || []).filter(
    (g) => g.sector === selectedSector
  );

  // Active shift timer
  useEffect(() => {
    let interval = null;
    if (isClockedIn) {
      interval = setInterval(() => {
        setShiftSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isClockedIn]);

  // Handle adding new grievance from worker view
  const handleAddGrievance = (newGrievance) => {
    if (isOffline) {
      fairShiftDB.enqueueOfflineAction({
        type: 'submit_hazard',
        payload: newGrievance
      });
      setDemoBannerMessage('Offline Mode: Safety report saved locally in offline queue.');
    } else {
      fairShiftDB.submitCase(newGrievance);
      setDemoBannerMessage(`Case ${newGrievance.id} submitted into SafeSpeak queue.`);
    }
    setTimeout(() => setDemoBannerMessage(''), 4000);
  };

  // Handle updating grievance status (from employer dashboard)
  const handleUpdateGrievanceStatus = (id, newStatus, actionLog) => {
    fairShiftDB.updateCaseStatus(id, newStatus, actionLog, 'Safety Lead Murugan', currentRole.toUpperCase());
    setDemoBannerMessage(`Ticket ${id} status updated to ${newStatus.replace('_', ' ').toUpperCase()}`);
    setTimeout(() => setDemoBannerMessage(''), 4000);
  };

  // Quick simulation controls
  const handleFastForwardOvertime = () => {
    setShiftSeconds((prev) => prev + 2 * 3600);
    setDemoBannerMessage('Simulated +2 Hours: Overtime (>8h) and Fatigue (>10h) rules active.');
    setTimeout(() => setDemoBannerMessage(''), 4000);
  };

  const handleResetShift = () => {
    setShiftSeconds(0);
  };

  const handleSyncOffline = () => {
    const synced = fairShiftDB.syncOfflineQueue();
    setDemoBannerMessage(`Synchronized ${synced} offline records successfully.`);
    setTimeout(() => setDemoBannerMessage(''), 4000);
  };

  // 9-Step Demonstration Auto-Run Shortcut
  const handleRun9StepDemo = () => {
    setDemoBannerMessage('Running 9-Step End-to-End Workflow Demonstration...');

    // 1. Clock in
    setIsClockedIn(true);

    // 2. Fast forward to 8.5h to show overtime
    setShiftSeconds(8.5 * 3600);

    // 3. Create sample voice report
    setTimeout(() => {
      const demoCase = fairShiftDB.submitCase({
        sector: selectedSector,
        type: 'safety_hazard',
        category: selectedSector === 'construction' ? 'Exposed High-Voltage Cable' : 'Lab Chemical Spill / Solvent Fumes',
        severity: 'High',
        isAnonymous: true,
        workerId: currentWorker.id,
        workerName: currentWorker.name,
        workplace: sectorData.siteName,
        description: 'Demo: Electrical hazard reported near machinery with urgent priority.',
        audioDuration: 14
      });

      // 4. Assign and update
      setTimeout(() => {
        fairShiftDB.updateCaseStatus(
          demoCase.id,
          'under_investigation',
          'Safety crew dispatched with power isolation lock.',
          'Safety Inspector Murugan'
        );

        // 5. Resolve
        setTimeout(() => {
          fairShiftDB.updateCaseStatus(
            demoCase.id,
            'resolved',
            'Hazard isolated, insulation repaired, and safety verified.',
            'Safety Inspector Murugan'
          );
          setDemoBannerMessage(`Workflow Demo Complete: Case ${demoCase.id} created, assigned, investigated, and certified resolved!`);
        }, 1200);
      }, 1000);
    }, 800);
  };

  const pendingGrievancesCount = currentGrievances.filter((g) => g.status !== 'resolved').length;
  const fatigueAlertsCount = (dbState.fatigueAlerts || []).filter((w) => w.status === 'open').length;
  const unreadNotifsCount = (dbState.notifications || []).filter((n) => !n.read).length;
  const offlineQueueCount = (dbState.offlineQueue || []).length;

  return (
    <div className="min-h-screen bg-[#F4F4F2] flex flex-col text-[#111111] antialiased selection:bg-[#FF4D2D] selection:text-white">
      {/* Top Persistent Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenNotifModal={() => setIsNotifOpen(true)}
        unreadNotifsCount={unreadNotifsCount}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        offlineQueueCount={offlineQueueCount}
        onSyncOffline={handleSyncOffline}
        t={t}
        sectorData={sectorData}
        pendingGrievancesCount={pendingGrievancesCount}
        fatigueAlertsCount={fatigueAlertsCount}
      />

      {/* Demo Feedback Banner */}
      {demoBannerMessage && (
        <div className="bg-black text-white text-xs py-2 px-4 border-b border-white/10 flex items-center justify-center gap-2 animate-fade-in font-mono">
          <span className="w-2 h-2 rounded-full bg-[#D9381E] animate-ping"></span>
          <span>{demoBannerMessage}</span>
        </div>
      )}

      {/* Quick Judge Simulation Bar */}
      <div className="bg-[#EDEDEA] border-b border-black/[0.05] py-2 px-4 text-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-600 font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E]"></span>
            <span className="font-bold text-black uppercase tracking-wider">Evaluation Demo Toolbar:</span>
            <span>Sector: {sectorData.name}</span>
            <span>•</span>
            <span>Role: {currentRole.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRun9StepDemo}
              title="Execute full end-to-end 9-step demonstration workflow"
              className="flex items-center gap-1.5 px-3 py-1 bg-[#D9381E] text-white hover:bg-[#B52810] text-[11px] font-bold rounded-full transition-colors shadow-xs"
            >
              <Sparkles className="w-3 h-3" />
              <span>Auto-Run 9-Step Demo Workflow</span>
            </button>

            <button
              onClick={handleFastForwardOvertime}
              title="Add 2 hours to test 1.5x Overtime & Fatigue Alerts"
              className="flex items-center gap-1 px-2.5 py-1 bg-black text-white hover:bg-slate-800 text-[11px] font-semibold rounded-full transition-colors"
            >
              <FastForward className="w-3 h-3 text-[#D9381E]" />
              <span>+2h Overtime</span>
            </button>

            <button
              onClick={handleResetShift}
              title="Reset shift timer"
              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-medium rounded-full border border-black/[0.08] transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport Content */}
      <main className="flex-1 flex flex-col items-center">
        {currentView === 'worker' ? (
          <WorkerPortal
            sectorConfig={sectorData}
            currentLang={currentLang}
            t={t}
            grievances={currentGrievances}
            onAddGrievance={handleAddGrievance}
            isClockedIn={isClockedIn}
            setIsClockedIn={setIsClockedIn}
            shiftSeconds={shiftSeconds}
            setShiftSeconds={setShiftSeconds}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            isOffline={isOffline}
          />
        ) : (
          <EmployerDashboard
            sectorConfig={sectorData}
            currentLang={currentLang}
            t={t}
            grievances={currentGrievances}
            onUpdateGrievanceStatus={handleUpdateGrievanceStatus}
            fatigueAlertsCount={fatigueAlertsCount}
            currentRole={currentRole}
            dbState={dbState}
          />
        )}
      </main>

      {/* Multilingual Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        currentLang={currentLang}
        currentWorkerId={currentWorker.id}
      />

      {/* Notifications Drawer */}
      <NotificationsPopover
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={dbState.notifications || []}
        currentUserId={currentWorker.id}
      />

      {/* Clean Minimal Dot UI Footer */}
      <footer className="bg-[#EDEDEA] border-t border-black/[0.05] py-5 px-4 text-xs text-slate-500 font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF4D2D]"></span>
            <span className="font-bold text-black">FairShift</span>
            <span>• UN SDG 8 Decent Work & Economic Growth</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <span>Prompt Wars 2026</span>
            <span>•</span>
            <span>SRM ACM Student Chapter</span>
            <span>•</span>
            <span>Zero Retaliation SafeSpeak</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
