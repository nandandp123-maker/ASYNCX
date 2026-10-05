import React from 'react';
import { Language, PoojaService } from '../types';
import { POOJA_SERVICES } from '../data/poojaData';
import { Sparkles, Calendar, Check, ArrowRight } from 'lucide-react';

interface ServicesSectionProps {
  lang: Language;
  onBookPooja: (service: PoojaService) => void;
  onAddServiceToBag: (service: PoojaService) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  lang,
  onBookPooja,
  onAddServiceToBag,
}) => {
  return (
    <section id="services" className="py-14 sm:py-20 bg-[#FFF0E0]/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6A00]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'kn' ? 'ಲಭ್ಯ ಇರುವ ಸೇವೆಗಳು' : 'Available Services'}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4D2300]">
            {lang === 'kn' ? 'ನಿಮಗೆ ಲಭ್ಯವಿರುವ ಪೂಜಾ ಸೇವೆಗಳು' : 'Our Pooja Services for You'}
          </h2>

          <p className="text-xs sm:text-sm text-[#994700]">
            {lang === 'kn'
              ? 'ನಿಮ್ಮ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ ಪೂಜಾ ಸೇವೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಮತ್ತು ಸುಲಭವಾಗಿ ವ್ಯವಸ್ಥೆ ಮಾಡಿಕೊಳ್ಳಿ.'
              : 'Select the required pooja service and easily organize it with our verified purohit network.'}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POOJA_SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-[#FFCC99] p-6 flex flex-col justify-between hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#FFE5CC] flex items-center justify-center text-[#FF6A00] font-bold text-lg shadow-2xs">
                    🕉️
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-[#4D2300] group-hover:text-[#FF6A00] transition-colors">
                    {lang === 'kn' ? service.nameKn : service.nameEn}
                  </h3>
                  <p className="text-xs text-[#8C4700] mt-1.5 leading-relaxed">
                    {lang === 'kn' ? service.descKn : service.descEn}
                  </p>
                </div>

                {/* Included Highlights */}
                <div className="bg-[#FFF8F2] p-3 rounded-xl border border-[#FFE5CC] text-xs space-y-1.5">
                  <span className="font-semibold text-[#4D2300] block text-[11px] uppercase tracking-wider">
                    {lang === 'kn' ? 'ಒಳಗೊಂಡಿರುವ ಸಾಮಗ್ರಿಗಳು:' : 'Includes Essential Samagri:'}
                  </span>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-[#663000]">
                    {service.includedMaterials.map((item, idx) => (
                      <span key={idx} className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-[#2D5A27] shrink-0" />
                        <span className="truncate">{item}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action row */}
              <div className="pt-4 mt-4 border-t border-[#FFE5CC] flex items-center justify-between gap-2">
                <div>
                  <span className="block text-[10px] text-[#994700]">
                    {lang === 'kn' ? 'ಸೇವಾ ದಕ್ಷಿಣಾ' : 'Pooja Fee'}
                  </span>
                  <span className="font-serif text-lg font-bold text-[#CC5500] tabular-nums">
                    ₹{service.price.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAddServiceToBag(service)}
                    className="px-3 py-2 bg-[#FFF0E0] hover:bg-[#FFE5CC] text-[#994700] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    {lang === 'kn' ? '+ ಚೀಲಕ್ಕೆ' : '+ Add Kit'}
                  </button>

                  <button
                    onClick={() => onBookPooja(service)}
                    className="px-4 py-2 bg-[#FF6A00] hover:bg-[#CC5500] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <span>{lang === 'kn' ? 'ಬುಕ್ ಮಾಡಿ' : 'Book Purohit'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
