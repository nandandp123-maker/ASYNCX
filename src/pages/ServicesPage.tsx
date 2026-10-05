import React from 'react';
import { Language, PoojaService } from '../types';
import { POOJA_SERVICES } from '../data/poojaData';
import { Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface ServicesPageProps {
  lang: Language;
  onBookService: (service: PoojaService) => void;
  onAddServiceToBag: (service: PoojaService) => void;
  services?: PoojaService[];
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  lang,
  onBookService,
  onAddServiceToBag,
  services = POOJA_SERVICES,
}) => {
  return (
    <div className="py-12 sm:py-16 bg-transparent min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6A00] bg-white/80 px-3 py-1 rounded-full border border-[#FFCC99] backdrop-blur-sm shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'kn' ? 'ಶಾಸ್ತ್ರೋಕ್ತ ಪೂಜಾ ಸೇವೆಗಳು' : 'Vedic Pooja Services'}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#4D2300]">
            {lang === 'kn' ? 'ನಿಮಗೆ ಲಭ್ಯವಿರುವ ಪೂಜಾ ಸೇವೆಗಳು' : 'Our Authentic Pooja Services for You'}
          </h1>

          <p className="text-sm text-[#994700] leading-relaxed">
            {lang === 'kn'
              ? 'ಅನುಭವಿ ವೇದ ವಿದ್ವಾಂಸರು ಮತ್ತು ಆಯ್ದ ಶುದ್ಧ ಪೂಜಾ ದ್ರವ್ಯಗಳೊಂದಿಗೆ ಶಾಸ್ತ್ರೋಕ್ತವಾಗಿ ನಡೆಸಿಕೊಡಲಾಗುವ ಪೂಜೆಗಳು.'
              : 'Conducted strictly in accordance with Agamic traditions by verified purohits with complete samagri bundles.'}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#FFCC99] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Media image */}
              <div className="aspect-[16/10] bg-[#FFF0E0] overflow-hidden relative">
                <img
                  src={service.image}
                  alt={service.nameEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-[#4D2300]">
                    {lang === 'kn' ? service.nameKn : service.nameEn}
                  </h3>
                  <p className="text-xs text-[#8C4700] leading-relaxed">
                    {lang === 'kn' ? service.descKn : service.descEn}
                  </p>

                  {/* Included list */}
                  <div className="bg-[#FFF8F2] p-3.5 rounded-xl border border-[#FFE5CC] space-y-2 text-xs">
                    <span className="font-bold text-[#4D2300] block text-[10px] uppercase tracking-wider">
                      {lang === 'kn' ? 'ಒಳಗೊಂಡಿರುವ ಪ್ರಮುಖ ಸಾಮಗ್ರಿಗಳು:' : 'Includes Certified Materials:'}
                    </span>
                    <ul className="space-y-1 text-[#663000]">
                      {service.includedMaterials.map((mat, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#2D5A27] shrink-0" />
                          <span>{mat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer price & CTA */}
                <div className="pt-4 border-t border-[#FFE5CC] flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-[#994700] font-semibold">
                      {lang === 'kn' ? 'ಸೇವಾ ದಕ್ಷಿಣಾ' : 'Dakshina Fee'}
                    </span>
                    <span className="font-serif text-xl font-bold text-[#CC5500] tabular-nums">
                      ₹{service.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onAddServiceToBag(service)}
                      className="px-3 py-2 bg-[#FFF0E0] hover:bg-[#FFE5CC] text-[#994700] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      {lang === 'kn' ? '+ ಕಿಟ್ ಸೇರಿಸಿ' : '+ Add Kit'}
                    </button>

                    <button
                      onClick={() => onBookService(service)}
                      className="px-4 py-2 bg-[#FF6A00] hover:bg-[#CC5500] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <span>{lang === 'kn' ? 'ಬುಕ್ ಮಾಡಿ' : 'Book Purohit'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Banner */}
        <div className="bg-[#FFF0E0] border border-[#FFCC99] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-[#FF6A00] font-bold block">
              {lang === 'kn' ? 'ವಿಶೇಷ ಸಂಕಲ್ಪ ಸೇವೆಗಳು' : 'Custom Vedic Rituals & Homas'}
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#4D2300]">
              {lang === 'kn' ? 'ನಿರ್ದಿಷ್ಟ ಪೂಜೆ ಅಥವಾ ನಕ್ಷತ್ರ ಶಾಂತಿ ಬೇಕೇ?' : 'Need a Specific Custom Homa or Vidhi?'}
            </h3>
            <p className="text-xs text-[#8C4700]">
              {lang === 'kn'
                ? 'ರುದ್ರ ಹೋಮ, ಚಂಡಿಕಾ ಪಾರಾಯಣ, ಆಯುಷ್ಯ ಹೋಮ ಹಾಗೂ ಮದುವೆ ಮುಹೂರ್ತ ಪೂಜೆಗಳಿಗೂ ಪುರೋಹಿತರನ್ನು ನಿಗದಿಪಡಿಸಲಾಗುತ್ತದೆ.'
                : 'We arrange experienced scholars for Rudra Homa, Ayushya Homa, Vivaha, and special planetary remedies.'}
            </p>
          </div>

          <button
            onClick={() => onBookService(POOJA_SERVICES[0])}
            className="px-6 py-3 bg-[#4D2300] hover:bg-[#331700] text-white text-xs font-bold rounded-xl whitespace-nowrap shadow-xs cursor-pointer"
          >
            {lang === 'kn' ? 'ವಿಶೇಷ ಪೂಜೆಗಾಗಿ ವಿನಂತಿ ಸಲ್ಲಿಸಿ' : 'Request Custom Pooja'}
          </button>
        </div>
      </div>
    </div>
  );
};
