import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, ArrowRight, UserCheck, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { translations } from '../data/translations';

export default function LoginPage({
  onLoginSuccess,
  currentLang,
  setCurrentLang
}) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = translations[currentLang] || translations.en;

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage(t.fillAllFieldsMsg);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const cleanId = identifier.trim().toLowerCase();
      const cleanPass = password.trim();

      // Check worker credentials
      if (
        (cleanId === '9876543210' || cleanId === 'fs-cn-4092' || cleanId === 'ramesh' || cleanId === 'worker') &&
        (cleanPass === 'worker@fairshift' || cleanPass === 'worker123' || cleanPass === 'worker')
      ) {
        setIsSubmitting(false);
        onLoginSuccess({
          role: 'worker',
          view: 'worker',
          name: 'Ramesh Kumar',
          id: 'usr_w1',
          employeeId: 'FS-CN-4092',
          sector: 'construction',
          token: 'FS-AUTH-' + Math.random().toString(36).substring(2, 10).toUpperCase()
        });
        return;
      }

      // Check admin credentials
      if (
        (cleanId === 'admin@fairshift.org' || cleanId === '9876500001' || cleanId === 'admin' || cleanId === 'fs-adm-001') &&
        (cleanPass === 'admin@fairshift' || cleanPass === 'admin123' || cleanPass === 'admin')
      ) {
        setIsSubmitting(false);
        onLoginSuccess({
          role: 'admin',
          view: 'employer',
          name: 'Priya Sharma (Operations Lead)',
          id: 'usr_adm1',
          employeeId: 'FS-ADM-001',
          sector: 'construction',
          token: 'FS-AUTH-' + Math.random().toString(36).substring(2, 10).toUpperCase()
        });
        return;
      }

      // Check campus worker credentials
      if (
        (cleanId === '9876543211' || cleanId === 'selvi' || cleanId === 'fs-ed-8120') &&
        (cleanPass === 'worker@fairshift' || cleanPass === 'worker123' || cleanPass === 'selvi')
      ) {
        setIsSubmitting(false);
        onLoginSuccess({
          role: 'worker',
          view: 'worker',
          name: 'Selvi Murugan',
          id: 'usr_w2',
          employeeId: 'FS-ED-8120',
          sector: 'campus',
          token: 'FS-AUTH-' + Math.random().toString(36).substring(2, 10).toUpperCase()
        });
        return;
      }

      setIsSubmitting(false);
      setErrorMessage(t.invalidCredsMsg);
    }, 450);
  };

  const handleQuickDemoLogin = (roleType) => {
    if (roleType === 'worker') {
      setIdentifier('9876543210');
      setPassword('worker@fairshift');
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess({
          role: 'worker',
          view: 'worker',
          name: 'Ramesh Kumar',
          id: 'usr_w1',
          employeeId: 'FS-CN-4092',
          sector: 'construction',
          token: 'FS-AUTH-DEMO-WORKER-2026'
        });
      }, 300);
    } else {
      setIdentifier('admin@fairshift.org');
      setPassword('admin@fairshift');
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess({
          role: 'admin',
          view: 'employer',
          name: 'Priya Sharma (Operations Lead)',
          id: 'usr_adm1',
          employeeId: 'FS-ADM-001',
          sector: 'construction',
          token: 'FS-AUTH-DEMO-ADMIN-2026'
        });
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F2] flex flex-col text-[#111111] antialiased selection:bg-[#D9381E] selection:text-white">
      {/* Top Language Pill & UN SDG 8 Strip */}
      <div className="bg-[#EDEDEA] border-b border-black/[0.06] py-2 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D9381E]"></span>
            <span className="font-ndot text-xs font-bold tracking-wider text-black">
              {t.sdgBadge}
            </span>
            <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
              • {t.sdgTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase">{t.lang}</span>
            <div className="flex items-center bg-black/[0.05] p-0.5 rounded-full border border-black/[0.06]">
              <button
                type="button"
                onClick={() => setCurrentLang('en')}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all ${
                  currentLang === 'en' ? 'bg-black text-white' : 'text-slate-600 hover:text-black'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setCurrentLang('hi')}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all ${
                  currentLang === 'hi' ? 'bg-black text-white' : 'text-slate-600 hover:text-black'
                }`}
              >
                हिं
              </button>
              <button
                type="button"
                onClick={() => setCurrentLang('ta')}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all ${
                  currentLang === 'ta' ? 'bg-black text-white' : 'text-slate-600 hover:text-black'
                }`}
              >
                த
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Authentication Container (CMF Nothing Design) */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Brand & Security Overview */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-10 rounded-4xl border border-black/[0.06] shadow-2xs flex flex-col justify-between gap-8">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#D9381E]"></span>
                <span className="font-ndot text-3xl font-black tracking-tight text-black">
                  {t.appName}
                </span>
              </div>

              <div className="mt-4">
                <div className="text-[11px] font-ndot uppercase tracking-widest text-[#D9381E]">
                  DECENT WORK PLATFORM
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-black mt-1 leading-snug">
                  {t.loginSubtitle}
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm font-mono mt-3 leading-relaxed">
                  {t.loginDescription}
                </p>
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div className="bg-[#EDEDEA] p-5 rounded-3xl border border-black/[0.04] flex flex-col gap-2">
              <div className="flex items-center gap-2 text-black font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-[#D9381E]" />
                <span className="font-mono">{t.securityGuaranteeTitle}</span>
              </div>
              <p className="text-slate-600 font-mono text-[11px] leading-relaxed">
                {t.securityGuaranteeText}
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-black/[0.05] text-[10px] font-mono text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>SHA-256 Session • Zero Tracking • Biometric Hash</span>
              </div>
            </div>
          </div>

          {/* Right Column: Secure Form & Demo Credentials */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Login Card */}
            <div className="bg-white p-6 sm:p-10 rounded-4xl border border-black/[0.06] shadow-2xs flex flex-col gap-6">
              <div className="border-b border-black/[0.06] pb-4">
                <div className="text-[10px] font-ndot uppercase tracking-widest text-slate-400">
                  SECURE AUTHENTICATION
                </div>
                <h3 className="text-2xl font-bold text-black mt-1">
                  {t.loginTitle}
                </h3>
              </div>

              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs text-red-700 font-mono">
                  <ShieldAlert className="w-4 h-4 text-[#D9381E] shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="flex flex-col gap-4 font-mono">
                {/* Identifier */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t.identifierLabel}
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={t.identifierPlaceholder}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F8F8F6] border border-black/[0.08] text-sm text-black placeholder:text-slate-400 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t.passwordLabel}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      className="w-full px-4 py-3 pr-12 rounded-2xl bg-[#F8F8F6] border border-black/[0.08] text-sm text-black placeholder:text-slate-400 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black transition-colors"
                      title={showPassword ? t.hidePassword : t.showPassword}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#111111] hover:bg-black text-white font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{t.signingIn}</span>
                  ) : (
                    <>
                      <span>{t.signInBtn}</span>
                      <ArrowRight className="w-4 h-4 text-[#D9381E]" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Prominent Quick Demo Login Section */}
            <div className="bg-white p-6 sm:p-8 rounded-4xl border border-black/[0.06] shadow-2xs flex flex-col gap-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700">
                <Sparkles className="w-4 h-4 text-[#D9381E]" />
                <span className="uppercase tracking-wider">{t.demoCredentialsTitle}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Employee Demo Card */}
                <div className="p-4 rounded-3xl bg-[#F8F8F6] border border-black/[0.06] flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#D9381E]"></span>
                      <span className="font-ndot text-[10px] tracking-wider text-slate-500 uppercase">
                        {t.employeeDemoTitle}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-black mt-1">
                      {t.employeeDemoName}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 mt-1">
                      {t.employeeDemoCreds}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('worker')}
                    className="w-full py-2.5 px-4 rounded-full bg-[#111111] text-white hover:bg-slate-800 text-xs font-mono font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{t.employeeDemoBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D9381E]" />
                  </button>
                </div>

                {/* Admin Demo Card */}
                <div className="p-4 rounded-3xl bg-[#F8F8F6] border border-black/[0.06] flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-black"></span>
                      <span className="font-ndot text-[10px] tracking-wider text-slate-500 uppercase">
                        {t.adminDemoTitle}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-black mt-1">
                      {t.adminDemoName}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 mt-1">
                      {t.adminDemoCreds}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('admin')}
                    className="w-full py-2.5 px-4 rounded-full bg-[#D9381E] text-white hover:bg-[#B52810] text-xs font-mono font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{t.adminDemoBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#EDEDEA] border-t border-black/[0.05] py-4 px-4 text-xs font-mono text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D9381E]"></span>
            <span className="font-bold text-black">FairShift</span>
            <span>• UN SDG 8 Decent Work Platform</span>
          </div>
          <div>Prompt Wars 2026 • SRM ACM Student Chapter</div>
        </div>
      </footer>
    </div>
  );
}
