import React from 'react';
import { Bell, Mic, Wifi, WifiOff, RefreshCw, LogOut, ShieldCheck, User } from 'lucide-react';

export default function Navbar({
  selectedSector,
  setSelectedSector,
  currentLang,
  setCurrentLang,
  onOpenVoiceModal,
  onOpenNotifModal,
  unreadNotifsCount = 0,
  isOffline = false,
  setIsOffline,
  offlineQueueCount = 0,
  onSyncOffline,
  t,
  currentUser,
  onSignOut
}) {
  const isWorker = currentUser?.role === 'worker';
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'supervisor' || currentUser?.role === 'hr';

  return (
    <header className="sticky top-0 z-40 bg-[#ECECE9]/95 backdrop-blur-md border-b border-black/[0.08] text-[#111111]">
      {/* Very Top Minimal Bar: Language Switcher (Small on Top) + SDG 8 indicator + Offline Status */}
      <div className="border-b border-black/[0.04] bg-[#E3E3DF]/60 px-4 sm:px-8 py-1 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9381E]"></span>
            <span className="font-ndot text-[10px] tracking-wider text-black">{t.sdgBadge}</span>
            <span className="hidden sm:inline text-slate-500">• {t.sdgTitle}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsOffline(!isOffline)}
              title={isOffline ? 'Offline mode active' : 'Online mode active'}
              className={`flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] transition-colors ${
                isOffline
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                  : 'text-slate-500 hover:text-black'
              }`}
            >
              {isOffline ? <WifiOff className="w-2.5 h-2.5 text-amber-700" /> : <Wifi className="w-2.5 h-2.5 text-emerald-600" />}
              <span>{isOffline ? t.offline : t.online}</span>
            </button>

            {offlineQueueCount > 0 && (
              <button
                type="button"
                onClick={onSyncOffline}
                className="flex items-center gap-1 px-2 py-0.2 rounded-full bg-black text-white text-[9px]"
              >
                <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                <span>{t.sync} ({offlineQueueCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Small Language Switcher on Top */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[10px] uppercase hidden sm:inline">{t.lang}</span>
          <div className="flex items-center bg-black/[0.05] p-0.5 rounded-full border border-black/[0.05]">
            <button
              type="button"
              onClick={() => setCurrentLang('en')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all ${
                currentLang === 'en' ? 'bg-black text-white' : 'text-slate-600 hover:text-black'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setCurrentLang('hi')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all ${
                currentLang === 'hi' ? 'bg-black text-white' : 'text-slate-600 hover:text-black'
              }`}
            >
              हिं
            </button>
            <button
              type="button"
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

      {/* Main Navigation Bar (Clean CMF Nothing Style, Zero Dual Toggles) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand & Sector Tag */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#D9381E]"></span>
            <span className="font-ndot text-xl tracking-tight text-black">{t.appName}</span>
          </div>

          {/* Sector Pill (Construction vs Campus) */}
          <div className="flex items-center bg-black/[0.04] p-0.5 rounded-full border border-black/[0.06] text-xs font-mono">
            <button
              type="button"
              onClick={() => setSelectedSector('construction')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                selectedSector === 'construction'
                  ? 'bg-black text-white font-bold'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              {t.construction}
            </button>
            <button
              type="button"
              onClick={() => setSelectedSector('campus')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                selectedSector === 'campus'
                  ? 'bg-black text-white font-bold'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              {t.campus}
            </button>
          </div>
        </div>

        {/* Center: Strict Role Indicator Pill (No Toggle - Locked to Authenticated Role) */}
        <div className="flex items-center gap-2 px-4 py-1.5 bg-black/[0.04] rounded-full border border-black/[0.06] font-mono text-xs">
          <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-[#D9381E]' : 'bg-emerald-500 animate-pulse'}`}></span>
          <span className="font-bold text-black font-sans">{currentUser?.name}</span>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-black text-white rounded-full uppercase tracking-wider font-bold">
            {isAdmin ? (t.employerView || 'ADMIN') : (t.workerView || 'WORKER')}
          </span>
        </div>

        {/* Right: Voice, Notifications & Sign Out */}
        <div className="flex items-center gap-2">
          {/* Multilingual Voice Assistant Button */}
          <button
            type="button"
            onClick={onOpenVoiceModal}
            title={t.voiceModalTitle}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D9381E] hover:bg-[#B52810] text-white text-xs font-bold font-mono transition-colors shadow-xs"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.voice}</span>
          </button>

          {/* Notifications Bell */}
          <button
            type="button"
            onClick={onOpenNotifModal}
            title={t.notifications}
            className="w-8 h-8 rounded-full bg-black/[0.05] hover:bg-black/[0.1] flex items-center justify-center transition-colors relative"
          >
            <Bell className="w-4 h-4 text-black" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D9381E]"></span>
            )}
          </button>

          {/* Sign Out Button */}
          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              title={t.signOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.05] hover:bg-black/[0.1] text-black font-mono text-xs font-bold transition-colors border border-black/[0.06]"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">{t.signOut}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
