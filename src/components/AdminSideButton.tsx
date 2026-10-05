import React from 'react';
import { ShieldCheck, Lock, UserCheck } from 'lucide-react';
import { Language } from '../types';

interface AdminSideButtonProps {
  lang: Language;
  isAdminLoggedIn: boolean;
  onOpenAdmin: () => void;
  pendingBookingsCount?: number;
  newOrdersCount?: number;
}

export const AdminSideButton: React.FC<AdminSideButtonProps> = ({
  lang,
  isAdminLoggedIn,
  onOpenAdmin,
  pendingBookingsCount = 0,
  newOrdersCount = 0,
}) => {
  // If not logged in as admin, DO NOT display this button to clients
  if (!isAdminLoggedIn) {
    return null;
  }

  const totalBadges = pendingBookingsCount + newOrdersCount;

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end group">
      <button
        onClick={onOpenAdmin}
        title={lang === 'kn' ? 'ಅಡ್ಮಿನ್ ನಿರ್ವಹಣಾ ಫಲಕ (Admin Panel)' : 'Admin Dashboard'}
        aria-label="Open Admin Dashboard"
        className="relative flex items-center gap-2 pl-3.5 pr-2.5 py-3 rounded-l-2xl bg-gradient-to-r from-[#4D2300] to-[#381900] text-[#FFE5CC] border-l-2 border-y-2 border-[#FF9933] shadow-2xl hover:shadow-[#FF9933]/30 hover:translate-x-0 translate-x-1 sm:translate-x-1 transition-all duration-300 cursor-pointer backdrop-blur-md"
      >
        {/* Glow indicator */}
        <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FF6A00] animate-ping" />

        <div className="flex flex-col items-center">
          {isAdminLoggedIn ? (
            <UserCheck className="w-5 h-5 text-[#FFB366] group-hover:scale-110 transition-transform" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-[#FFB366] group-hover:scale-110 transition-transform" />
          )}
          <span className="text-[10px] font-black uppercase tracking-wider text-[#FF9933] mt-0.5">
            {lang === 'kn' ? 'ಅಡ್ಮಿನ್' : 'Admin'}
          </span>
        </div>

        {/* Vertical Separator */}
        <div className="w-px h-6 bg-[#663300]" />

        {/* Text for desktop */}
        <div className="hidden sm:flex flex-col text-left pr-1">
          <span className="text-[11px] font-bold text-white leading-tight">
            {lang === 'kn' ? 'ನಿರ್ವಹಣೆ' : 'Portal'}
          </span>
          <span className="text-[9px] text-[#FFB366] font-medium">
            {isAdminLoggedIn ? (lang === 'kn' ? 'ಸಕ್ರಿಯ' : 'Active') : (lang === 'kn' ? 'ಲಾಗಿನ್' : 'Login')}
          </span>
        </div>

        {/* Notification badge if new orders/bookings exist */}
        {totalBadges > 0 && (
          <span className="absolute -top-2 -left-2 bg-[#FF3300] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow animate-pulse">
            {totalBadges}
          </span>
        )}
      </button>
    </div>
  );
};
