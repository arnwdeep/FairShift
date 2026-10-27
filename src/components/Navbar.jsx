import React from 'react';
import { Bell, Mic, Wifi, WifiOff, RefreshCw } from 'lucide-react';

export default function Navbar({
  currentView,
  setCurrentView,
  selectedSector,
  setSelectedSector,
  currentLang,
  setCurrentLang,
  currentRole,
  setCurrentRole,
  onOpenVoiceModal,
  onOpenNotifModal,
  unreadNotifsCount = 0,
  isOffline = false,
  setIsOffline,
  offlineQueueCount = 0,
  onSyncOffline,
  t,
  sectorData,
  pendingGrievancesCount,
  fatigueAlertsCount
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#ECECE9]/95 backdrop-blur-md border-b border-black/[0.08] text-[#111111]">
      {/* Very Top Minimal Bar: Language Switcher (Small on Top) + SDG 8 indicator + Offline Status */}
      <div className="border-b border-black/[0.04] bg-[#E3E3DF]/60 px-4 sm:px-8 py-1 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E]"></span>
            <span className="font-ndot text-[10px] tracking-wider text-black">UN SDG 8</span>
            <span className="hidden sm:inline text-slate-500">• DECENT WORK & ECONOMIC GROWTH</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsOffline(!isOffline)}
              title={isOffline ? 'Offline mode active' : 'Online mode active'}
              className={`flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] transition-colors ${
                isOffline
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                  : 'text-slate-500 hover:text-black'
              }`}
            >
              {isOffline ? <WifiOff className="w-2.5 h-2.5 text-amber-700" /> : <Wifi className="w-2.5 h-2.5 text-emerald-600" />}
              <span>{isOffline ? 'OFFLINE' : 'ONLINE'}</span>
            </button>

            {offlineQueueCount > 0 && (
              <button
                onClick={onSyncOffline}
                className="flex items-center gap-1 px-2 py-0.2 rounded-full bg-black text-white text-[9px]"
              >
                <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                <span>SYNC ({offlineQueueCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Small Language Switcher on Top */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[10px] uppercase hidden sm:inline">Lang:</span>
          <div className="flex items-center bg-black/[0.05] p-0.5 rounded-full border border-black/[0.05]">
            <button
              onClick={() => setCurrentLang('en')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all ${
                currentLang === 'en' ? 'bg-black text-white' : 'text-slate-600 hover:text-black'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setCurrentLang('hi')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all ${
                currentLang === 'hi' ? 'bg-black text-white' : 'text-slate-600 hover:text-black'
              }`}
            >
              हिं
            </button>
            <button
              onClick={() => setCurrentLang('ta')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all ${
                currentLang === 'ta' ? 'bg-black text-white' : 'text-slate-600 hover:text-black'
              }`}
            >
              த
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Fluid across Phone & Laptop) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Sector Tag */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setCurrentView('worker')}
          >
            <span className="w-3 h-3 rounded-full bg-[#D9381E] group-hover:scale-110 transition-transform"></span>
            <span className="font-ndot text-xl tracking-tight text-black">FairShift</span>
          </div>

          {/* Sector Pill */}
          <div className="flex items-center bg-black/[0.04] p-0.5 rounded-full border border-black/[0.06] text-xs font-mono">
            <button
              onClick={() => setSelectedSector('construction')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                selectedSector === 'construction'
                  ? 'bg-black text-white font-bold'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              Construction
            </button>
            <button
              onClick={() => setSelectedSector('campus')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                selectedSector === 'campus'
                  ? 'bg-black text-white font-bold'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              Campus
            </button>
          </div>
        </div>

        {/* Center: Dual Interface Switcher (Worker vs Employer) */}
        <div className="flex items-center bg-black/[0.06] p-1 rounded-full border border-black/[0.08]">
          <button
            onClick={() => setCurrentView('worker')}
            className={`px-4 sm:px-5 py-1.5 text-xs font-semibold rounded-full transition-all ${
              currentView === 'worker'
                ? 'bg-black text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            Worker View
          </button>
          <button
            onClick={() => setCurrentView('employer')}
            className={`px-4 sm:px-5 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
              currentView === 'employer'
                ? 'bg-black text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            <span>Employer Admin</span>
            {pendingGrievancesCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E] animate-pulse"></span>
            )}
          </button>
        </div>

        {/* Right: Role, Voice, Notifications */}
        <div className="flex items-center gap-2">
          {/* Role Pill Switcher */}
          <div className="hidden lg:flex items-center bg-black/[0.04] p-0.5 rounded-full border border-black/[0.06] text-xs font-mono">
            <span className="px-2 text-[10px] text-slate-400">ROLE:</span>
            {['worker', 'supervisor', 'hr', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => setCurrentRole(role)}
                className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-semibold transition-all ${
                  currentRole === role
                    ? 'bg-black text-white font-bold'
                    : 'text-slate-500 hover:text-black'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Multilingual Voice Assistant Button */}
          <button
            onClick={onOpenVoiceModal}
            title="Open Multilingual Voice Assistant"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D9381E] hover:bg-[#B52810] text-white text-xs font-bold font-mono transition-colors shadow-xs"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifModal}
            title="View Notifications"
            className="w-8 h-8 rounded-full bg-black/[0.05] hover:bg-black/[0.1] flex items-center justify-center transition-colors relative"
          >
            <Bell className="w-4 h-4 text-black" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D9381E]"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
