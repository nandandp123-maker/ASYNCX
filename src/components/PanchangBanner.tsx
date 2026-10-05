import React, { useState } from 'react';
import { Compass, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

const PANCHANG_DATA = {
  tithiKn: 'ಶುಕ್ಲ ಪಕ್ಷ ಪ್ರತಿಪದಾ (ಶುಭ ನವರಾತ್ರಿ ಘಟಸ್ಥಾಪನಾ)',
  tithiEn: 'Shukla Paksha Pratipada (Auspicious Navratri Ghatasthapana)',
  nakshatraKn: 'ಹಸ್ತ ನಕ್ಷತ್ರ (ಚಂದ್ರ ಕನ್ಯಾ ರಾಶಿಯಲ್ಲಿ)',
  nakshatraEn: 'Hasta Nakshatra (Chandra in Kanya Rashi)',
  shubhMuhurat: '11:48 AM – 12:36 PM (ಅಭಿಜಿತ್ ಮುಹೂರ್ತ)',
  rahuKaal: '09:12 AM – 10:44 AM (ಅಶುಭ ಕಾಲ)',
  pujaRecommendationKn: 'ದೀಪ ಸ್ಥಾಪನೆ, ಕಳಸ ಪೂಜೆ ಹಾಗೂ ಗಣೇಶ ಆರಾಧನೆಗೆ ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ ದಿನ.',
  pujaRecommendationEn: 'Ideal day for Ghee Diya lighting & Kalasha Sthapana.'
};

export const PanchangBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#FFE5CC]/40 border-b border-[#FFCC99] py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
        {/* Panchang Highlight - unboxed with subtle separators */}
        <div className="flex items-center flex-wrap gap-2 text-[#4D2300]">
          <div className="flex items-center gap-1.5 font-bold text-[#CC5500]">
            <Compass className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>ದೈನಿಕ ಪಂಚಾಂಗ / Panchang</span>
          </div>
          <span className="text-[#FFCC99]" aria-hidden="true">·</span>
          <span>{PANCHANG_DATA.tithiKn}</span>
          <span className="text-[#FFCC99]" aria-hidden="true">·</span>
          <span className="hidden sm:inline">{PANCHANG_DATA.nakshatraKn}</span>
          <span className="text-[#FFCC99] hidden sm:inline" aria-hidden="true">·</span>
          <span className="font-medium text-[#4D2300]">
            ಶುಭ ಮುಹೂರ್ತ: <span className="tabular-nums font-bold text-[#2D5A27]">{PANCHANG_DATA.shubhMuhurat}</span>
          </span>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#994700] hidden lg:inline">
            {PANCHANG_DATA.pujaRecommendationKn}
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] text-[#CC5500] hover:text-[#994700] font-bold cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#FF6A00]" />
            <span>{isExpanded ? 'ಮುಚ್ಚಿ' : 'ಪೂರ್ಣ ಮುಹೂರ್ತ'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-[#FFCC99] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#4D2300]">
          <div className="bg-white/80 p-2.5 rounded-xl border border-[#FFCC99]">
            <span className="block text-[10px] uppercase tracking-wider text-[#994700] font-bold">ತಿಥಿ & ನಕ್ಷತ್ರ</span>
            <span className="font-semibold text-[#4D2300] mt-0.5 block">{PANCHANG_DATA.tithiKn}</span>
            <span className="text-[10px] text-[#8C4700]">{PANCHANG_DATA.nakshatraEn}</span>
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-[#FFCC99]">
            <span className="block text-[10px] uppercase tracking-wider text-[#2D5A27] font-bold">ಅಭಿಜಿತ್ ಶುಭ ಮುಹೂರ್ತ</span>
            <span className="font-semibold text-[#2D5A27] mt-0.5 block">{PANCHANG_DATA.shubhMuhurat}</span>
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-[#FFCC99]">
            <span className="block text-[10px] uppercase tracking-wider text-[#CC5500] font-bold">ರಾಹು ಕಾಲ (ವರ್ಜ್ಯ)</span>
            <span className="font-semibold text-[#CC5500] mt-0.5 block">{PANCHANG_DATA.rahuKaal}</span>
          </div>
        </div>
      )}
    </div>
  );
};

