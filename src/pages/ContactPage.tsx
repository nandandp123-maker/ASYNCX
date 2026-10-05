import React, { useState } from 'react';
import { Language } from '../types';
import { CONTACT_INFO } from '../data/poojaData';
import { Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { templeAudio } from '../utils/audioChant';

interface ContactPageProps {
  lang: Language;
}

export const ContactPage: React.FC<ContactPageProps> = ({ lang }) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    templeAudio.playTempleBell();
    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FFFDF9] min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6A00] block">
            {lang === 'kn' ? 'ನೇರ ಸಂಪರ್ಕ & ಕೇಂದ್ರ' : 'Contact & Sanctuary Center'}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#4D2300]">
            {lang === 'kn' ? 'ಪೂಜಾ ಸೇವೆಗಾಗಿ ಸಂಪರ್ಕಿಸಿ' : 'Get in Touch with Pooja Seve'}
          </h1>
          <p className="text-sm text-[#994700]">
            {lang === 'kn'
              ? 'ಧಾರ್ಮಿಕ ಕಾರ್ಯಗಳಿಗೆ ಪುರೋಹಿತರು ಮತ್ತು ಅಗತ್ಯ ಸಾಮಾಗ್ರಿಗಳಿಗೆ ಇಂದೇ ಸಂಪರ್ಕಿಸಿ.'
              : 'Reach out for reliable purohits, consecrated samagri kits, and muhurat guidance.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#FFF8F2] p-6 rounded-2xl border border-[#FFCC99] space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FFE5CC] flex items-center justify-center text-[#FF6A00] shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-sm font-bold text-[#4D2300]">
                    {lang === 'kn' ? 'ನೇರ ಸಹಾಯವಾಣಿ' : 'Direct Helpline'}
                  </strong>
                  <span className="font-serif text-2xl font-bold text-[#CC5500] tracking-wide block my-1">
                    {CONTACT_INFO.displayPhone}
                  </span>
                  <span className="text-xs text-[#8C4700]">
                    {lang === 'kn' ? 'ಪ್ರತಿದಿನ ಬೆಳಿಗ್ಗೆ 6:00 ರಿಂದ ರಾತ್ರಿ 9:00 ವರೆಗೆ' : 'Available Daily: 6:00 AM – 9:00 PM IST'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#FFE5CC] flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FFE5CC] flex items-center justify-center text-[#FF6A00] shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-sm font-bold text-[#4D2300]">
                    {lang === 'kn' ? 'ಕೇಂದ್ರ ಕಚೇರಿ & ವಿತರಣಾ ಕೇಂದ್ರ' : 'Sanctuary & Operations Center'}
                  </strong>
                  <p className="text-xs text-[#663000] mt-1 leading-relaxed">
                    {lang === 'kn'
                      ? 'ಪೂಜಾ ಸೇವೆ ಸಂಕೀರ್ಣ, ವಿನೋಬನಗರ, ಶಿವಮೊಗ್ಗ, ಕರ್ನಾಟಕ - 577201'
                      : 'Pooja Seve Complex, Vinobha Nagara, Shivamogga, Karnataka - 577201, India'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#FFE5CC] flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FFE5CC] flex items-center justify-center text-[#FF6A00] shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-sm font-bold text-[#4D2300]">
                    {lang === 'kn' ? 'ಸೇವೆ ವ್ಯಾಪ್ತಿ' : 'Coverage Area'}
                  </strong>
                  <p className="text-xs text-[#663000] mt-1">
                    {lang === 'kn'
                      ? 'ಶಿವಮೊಗ್ಗ ನಗರ, ಭದ್ರಾವತಿ, ತೀರ್ಥಹಳ್ಳಿ, ಸಾಗರ ಹಾಗೂ ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ನಗರಗಳು.'
                      : 'Shivamogga, Bhadravati, Thirthahalli, Sagara, Bengaluru, and across Karnataka.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Message Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-[#FFCC99] shadow-xs">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#FF6A00] font-bold block mb-1">
                    {lang === 'kn' ? 'ತ್ವರಿತ ವಿಚಾರಣೆ' : 'Quick Inquiry'}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#4D2300]">
                    {lang === 'kn' ? 'ನಮಗೆ ಸಂದೇಶ ಕಳುಹಿಸಿ' : 'Send us a Message'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#663000] font-semibold mb-1">
                      {lang === 'kn' ? 'ನಿಮ್ಮ ಹೆಸರು *' : 'Your Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === 'kn' ? 'ಉದಾ: ನಂದನ್' : 'e.g. Nandan'}
                      className="w-full px-3 py-2 bg-[#FFF8F2] border border-[#FFCC99] rounded-xl text-xs text-[#4D2300] outline-none focus:border-[#FF6A00]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#663000] font-semibold mb-1">
                      {lang === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *' : 'Mobile Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full px-3 py-2 bg-[#FFF8F2] border border-[#FFCC99] rounded-xl text-xs text-[#4D2300] outline-none focus:border-[#FF6A00]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#663000] font-semibold mb-1">
                      {lang === 'kn' ? 'ನಿಮ್ಮ ವಿಚಾರಣೆ / ಸಂದೇಶ *' : 'Your Inquiry or Requirement *'}
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={lang === 'kn' ? 'ಯಾವ ಪೂಜೆ, ದಿನಾಂಕ ಅಥವಾ ಸಾಮಗ್ರಿಯ ಬಗ್ಗೆ ಮಾಹಿತಿ ಬೇಕು?' : 'Which pooja, date, or materials do you need assistance with?'}
                      className="w-full p-3 bg-[#FFF8F2] border border-[#FFCC99] rounded-xl text-xs text-[#4D2300] outline-none focus:border-[#FF6A00]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#FF6A00] hover:bg-[#CC5500] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{lang === 'kn' ? 'ಸಂದೇಶ ಕಳುಹಿಸಿ' : 'Send Message'}</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-10 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#E8F2E6] text-[#2D5A27] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#4D2300]">
                  {lang === 'kn' ? 'ಸಂದೇಶ ತಲುಪಿದೆ!' : 'Message Received!'}
                </h3>
                <p className="text-xs text-[#8C4700] max-w-sm mx-auto">
                  {lang === 'kn'
                    ? `ಧನ್ಯವಾದಗಳು ${name}! ನಮ್ಮ ಪ್ರತಿನಿಧಿಗಳು ಶೀಘ್ರವೇ ನಿಮ್ಮನ್ನು ${phone} ಸಂಖ್ಯೆಯಲ್ಲಿ ಸಂಪರ್ಕಿಸುತ್ತಾರೆ.`
                    : `Thank you ${name}! Our temple coordinator will get back to you shortly at ${phone}.`}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-4 py-2 bg-[#FFE5CC] text-[#4D2300] text-xs font-bold rounded-lg cursor-pointer"
                >
                  {lang === 'kn' ? 'ಇನ್ನೊಂದು ಸಂದೇಶ ಕಳುಹಿಸಿ' : 'Send Another Inquiry'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
