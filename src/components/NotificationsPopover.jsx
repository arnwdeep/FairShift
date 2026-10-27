import React from 'react';
import { X, Check, Bell, AlertTriangle, ShieldCheck, DollarSign } from 'lucide-react';
import { fairShiftDB } from '../services/db';

export default function NotificationsPopover({ isOpen, onClose, notifications = [], currentUserId, t = {} }) {
  if (!isOpen) return null;

  const userNotifications = notifications.filter((n) => !currentUserId || n.userId === currentUserId || n.userId === 'usr_sup1' || n.userId === 'usr_adm1');
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const handleMarkAll = () => {
    fairShiftDB.markAllNotificationsRead(currentUserId);
  };

  const handleItemClick = (id) => {
    fairShiftDB.markNotificationRead(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#1A1A1A] text-white rounded-4xl max-w-sm w-full p-5 border border-white/10 shadow-2xl flex flex-col gap-3 mt-12 animate-fade-in max-h-[80vh]">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D9381E]"></span>
            <h3 className="font-bold text-sm text-white">{t.notifTitle || 'Notifications'}</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#D9381E] text-white text-[10px] font-mono font-bold">
                {unreadCount} unread
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAll}
                className="text-[10px] font-mono text-slate-400 hover:text-white"
              >
                {t.markAllRead || 'Mark all read'}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex flex-col gap-2 overflow-y-auto pr-1 text-xs">
          {userNotifications.length === 0 ? (
            <div className="py-8 text-center text-slate-500 font-mono text-xs">
              No recent notifications
            </div>
          ) : (
            userNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleItemClick(n.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1 ${
                  n.read
                    ? 'bg-white/5 border-white/5 opacity-70'
                    : 'bg-white/10 border-[#D9381E]/40 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[11px]">{n.title}</span>
                  <span className="text-[10px] font-mono text-slate-400">{n.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
