import React from 'react';
import { Language } from '../types';
import { CONTACT_INFO, SOUTH_INDIAN_CULTURE_BG, DEITY_LOGO } from '../data/poojaData';
import { ArrowUp, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  lang: Language;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-[#381900] text-[#FFE5CC] pt-16 pb-8 border-t border-[#542600]">
      {/* Background South Indian Cultural Heritage Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <img
          src={SOUTH_INDIAN_CULTURE_BG}
          alt="South Indian cultural heritage"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#381900] via-[#381900]/90 to-[#381900]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-[#FFD1A4]/90">
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#FFCC99] shrink-0 bg-[#FFF5EB]">
                <img
                  src={DEITY_LOGO}
                  alt="Divine Deity Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                {lang === 'kn' ? 'ಪೂಜಾ ಸೇವೆ' : 'Pooja Seve'}
              </span>
            </div>
            <p className="leading-relaxed text-[#FFCC99]">
              {lang === 'kn'
                ? 'ನಿಮ್ಮ ಪೂಜೆಗೆ ಬೇಕಾದ ಸೇವೆಗಳು ಮತ್ತು ಸಾಮಗ್ರಿಗಳನ್ನು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ ಪಡೆಯಿರಿ.'
                : 'Get all required services and authentic materials for your poojas in one reliable place.'}
            </p>
            <div className="text-[11px] text-[#FFE5CC] font-bold">
              {lang === 'kn' ? CONTACT_INFO.mottoKn : CONTACT_INFO.mottoEn}
            </div>
          </div>

          {/* Pooja Services Links */}
          <div className="space-y-2.5">
            <span className="font-bold text-white text-xs uppercase tracking-wider block">
              {lang === 'kn' ? 'ಪೂಜಾ ಸೇವೆಗಳು' : 'Services'}
            </span>
            <ul className="space-y-1.5">
              <li><a href="#services" className="hover:text-white transition-colors">{lang === 'kn' ? 'ಗಣೇಶ ಪೂಜೆ' : 'Ganesha Pooja'}</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">{lang === 'kn' ? 'ಲಕ್ಷ್ಮೀ ಪೂಜೆ' : 'Lakshmi Pooja'}</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">{lang === 'kn' ? 'ಶಿವ ಪೂಜೆ & ಅಭಿಷೇಕ' : 'Shiva Pooja'}</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">{lang === 'kn' ? 'ಗೃಹಪ್ರವೇಶ ಮಹಾಪೂಜೆ' : 'Gruhapravesha'}</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">{lang === 'kn' ? 'ಸತ್ಯನಾರಾಯಣ ವ್ರತ' : 'Satyanarayana Vrata'}</a></li>
            </ul>
          </div>

          {/* Materials & Process */}
          <div className="space-y-2.5">
            <span className="font-bold text-white text-xs uppercase tracking-wider block">
              {lang === 'kn' ? 'ನಮ್ಮ ಸೇವೆಗಳು' : 'Quick Links'}
            </span>
            <ul className="space-y-1.5">
              <li><a href="#materials" className="hover:text-white transition-colors">{lang === 'kn' ? 'ಪೂಜಾ ಸಾಮಗ್ರಿಗಳು' : 'Pooja Materials'}</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">{lang === 'kn' ? 'ಕ್ಯಾಟಲಾಗ್' : 'Catalog'}</a></li>
              <li><a href="#home" className="hover:text-white transition-colors">{lang === 'kn' ? 'ಪುರೋಹಿತರ ಸೇವೆ' : 'Purohit Network'}</a></li>
              {onOpenAdmin && (
                <li>
                  <button
                    onClick={onOpenAdmin}
                    className="hover:text-white transition-colors text-[#FFB366] font-bold flex items-center gap-1.5 cursor-pointer mt-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#FFB366]" />
                    <span>{lang === 'kn' ? 'ಅಡ್ಮಿನ್ ಪ್ರವೇಶ (Admin Portal)' : 'Admin Portal'}</span>
                  </button>
                </li>
              )}
              <li><span className="text-[#FFB366]">{lang === 'kn' ? '256-ಬಿಟ್ ಸುರಕ್ಷಿತ ಪಾವತಿ' : '256-Bit Secure Gateway'}</span></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-2.5">
            <span className="font-bold text-white text-xs uppercase tracking-wider block">
              {lang === 'kn' ? 'ಸಂಪರ್ಕ' : 'Contact'}
            </span>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-white font-bold">
                <Phone className="w-3.5 h-3.5 text-[#FFB366]" />
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#FFB366] shrink-0 mt-0.5" />
                <span>{lang === 'kn' ? CONTACT_INFO.locationKn : CONTACT_INFO.locationEn}</span>
              </li>
              <li className="pt-1">
                <span className="text-[11px] text-[#FFB366] bg-[#663000] px-2 py-0.5 rounded">
                  {lang === 'kn' ? 'ಸಮಯ: ಬೆಳಿಗ್ಗೆ 6:00 - ರಾತ್ರಿ 9:00' : 'Hours: 6:00 AM - 9:00 PM'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-6 border-t border-[#663000] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#FFCC99]/80">
          <div className="flex items-center gap-2">
            <span>© 2026 {lang === 'kn' ? 'ಪೂಜಾ ಸೇವೆ. ನಿಮ್ಮ ಪೂಜೆ • ನಮ್ಮ ಜವಾಬ್ದಾರಿ.' : 'Pooja Seve. Devotion • Faith • Dedication.'}</span>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-[#FFB366] hover:text-white underline text-[10px] cursor-pointer ml-1"
                title="Admin Control Center"
              >
                [{lang === 'kn' ? 'ಅಡ್ಮಿನ್ ಲಾಗಿನ್' : 'Admin Login'}]
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="px-2 py-0.5 bg-[#663000] rounded text-[#FFD1A4] font-bold">UPI QR</span>
              <span className="px-2 py-0.5 bg-[#663000] rounded text-[#FFD1A4] font-bold">RuPay</span>
              <span className="px-2 py-0.5 bg-[#663000] rounded text-[#FFD1A4] font-bold">Cards</span>
              <span className="px-2 py-0.5 bg-[#663000] rounded text-[#FFD1A4] font-bold">COD</span>
            </div>

            <button
              onClick={scrollToTop}
              className="p-1.5 bg-[#663000] hover:bg-[#803C00] text-[#FFD1A4] rounded-md transition-colors cursor-pointer"
              title="Return to top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
