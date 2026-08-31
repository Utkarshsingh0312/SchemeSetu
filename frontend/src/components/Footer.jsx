import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Shield, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export const Footer = () => {
  const { lang, toggleLanguage, t } = useLanguage();

  return (
    <footer className="border-t border-navy/12 bg-[#F3EEDF] text-ink relative overflow-hidden font-sans">
      {/* Decorative Subtle Ambient Glow Background */}
      <div 
        className="absolute top-0 right-0 w-[420px] h-[420px] bg-marigold/10 rounded-full blur-3xl pointer-events-none" 
        style={{ transform: 'translate(30%, -30%)' }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[360px] h-[360px] bg-teal/10 rounded-full blur-3xl pointer-events-none" 
        style={{ transform: 'translate(-30%, 30%)' }}
      />

      <div className="max-w-[1180px] mx-auto px-6 sm:px-8 pt-16 pb-12 relative z-10">
        
        {/* TOP 3-COLUMN DESKTOP GRID (1.4fr : 0.8fr : 1fr Ratio) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr_1fr] gap-10 lg:gap-14 pb-12 border-b border-navy/12">
          
          {/* COLUMN 1 — BRAND & LANGUAGE SWITCHER */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full border-2 border-navy bg-[#FBF8F1] ring-1 ring-marigold/60 flex items-center justify-center font-serif font-bold text-xl text-navy group-hover:rotate-6 transition-transform shadow-sm">
                S
              </div>
              <div className="font-serif font-bold text-[26px] tracking-tight text-navy">
                Scheme<span className="text-marigold italic font-normal">Setu</span>
              </div>
            </Link>

            <div className="w-12 h-[2px] bg-gradient-to-r from-marigold to-transparent" />

            <p className="text-sm text-[#5C5643] leading-relaxed max-w-[340px] font-sans">
              {lang === 'hi'
                ? 'भारत भर में नागरिकों को कल्याणकारी योजनाओं से जोड़ना।'
                : 'Bridging citizens to welfare initiatives across India.'}
            </p>

            {/* PREMIUM LANGUAGE SWITCHER PILL */}
            <div className="pt-2">
              <button 
                type="button"
                onClick={toggleLanguage} 
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#FBF8F1] border border-navy/15 text-xs font-semibold text-navy shadow-sm hover:bg-[#EAE2CC] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
              >
                <span className="text-sm">🌐</span>
                <span>{lang === 'hi' ? 'भाषा बदलें:' : 'Language:'}</span>
                <span className="font-bold text-teal bg-teal/10 px-2.5 py-0.5 rounded-full group-hover:bg-teal group-hover:text-white transition-colors">
                  {lang === 'en' ? 'EN | हिंदी' : 'हिंदी | EN'}
                </span>
              </button>
            </div>
          </div>

          {/* COLUMN 2 — QUICK LINKS */}
          <div>
            <h4 className="font-sans text-xs font-bold text-navy uppercase tracking-[0.12em] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-marigold" />
              {t('quickLinks')}
            </h4>
            <ul className="space-y-3 text-sm font-sans">
              <li>
                <Link 
                  to="/explore" 
                  className="text-[#5C5643] hover:text-navy hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium group"
                >
                  <span>{t('navExplore')}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-marigold" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/eligibility" 
                  className="text-[#5C5643] hover:text-navy hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium group"
                >
                  <span>{t('checkEligibility')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-marigold group-hover:translate-x-1 transition-transform" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/passbook" 
                  className="text-[#5C5643] hover:text-navy hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium group"
                >
                  <span>{t('myPassbook')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-marigold group-hover:translate-x-1 transition-transform" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/applications" 
                  className="text-[#5C5643] hover:text-navy hover:translate-x-1 transition-all inline-flex items-center gap-2 font-medium group"
                >
                  <span>{t('myApplications')}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-marigold" />
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 — FEATURES / ROADMAP */}
          <div>
            <h4 className="font-sans text-xs font-bold text-navy uppercase tracking-[0.12em] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal" />
              {lang === 'hi' ? 'विशेषताएं एवं रोडमैप' : 'FEATURES & ROADMAP'}
            </h4>
            
            <div className="relative pl-3 border-l-2 border-navy/15 space-y-4 font-sans text-xs">
              
              {/* ROADMAP ITEM 1 */}
              <div className="relative group hover:translate-x-1 transition-transform duration-200">
                <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-teal ring-4 ring-[#F3EEDF]" />
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-navy/50">01</span>
                  <span className="font-bold text-navy uppercase tracking-wide">
                    {t('passbookTitle')}
                  </span>
                </div>
                <div className="text-[#5C5643] text-[11px] flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-teal flex-none" />
                  <span>Phase 1 · Active</span>
                </div>
              </div>

              {/* ROADMAP ITEM 2 */}
              <div className="relative group hover:translate-x-1 transition-transform duration-200">
                <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-teal ring-4 ring-[#F3EEDF]" />
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-navy/50">02</span>
                  <span className="font-bold text-navy uppercase tracking-wide">
                    {lang === 'hi' ? 'द्विभाषी सहायता' : 'BILINGUAL SUPPORT'}
                  </span>
                </div>
                <div className="text-[#5C5643] text-[11px] flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-teal flex-none" />
                  <span>Phase 2 · Active</span>
                </div>
              </div>

              {/* ROADMAP ITEM 3 */}
              <div className="relative group hover:translate-x-1 transition-transform duration-200">
                <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-marigold ring-4 ring-[#F3EEDF]" />
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-navy/50">03</span>
                  <span className="font-bold text-navy uppercase tracking-wide">
                    {t('chatbotTitle')}
                  </span>
                </div>
                <div className="text-[#5C5643] text-[11px] flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3 h-3 text-marigold flex-none" />
                  <span>Phase 3 · Coming Soon</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ELEGANT GOVERNMENT DISCLAIMER PANEL */}
        <div className="my-8 bg-[#FBF8F1]/80 border-l-4 border-marigold p-4 sm:p-5 rounded-r-2xl max-w-[760px] mx-auto text-xs leading-relaxed text-[#5C5643] flex items-start gap-3 shadow-xs">
          <Shield className="w-4 h-4 text-marigold flex-none mt-0.5" />
          <div>
            <span className="font-bold text-navy block mb-0.5">Government Disclaimer &amp; Verification</span>
            <span>{t('civicDisclaimer')}</span>
          </div>
        </div>

        {/* ELEGANT DIVIDER WITH CENTER BRAND ACCENT */}
        <div className="relative my-8 border-t border-navy/12 flex items-center justify-center">
          <span className="bg-[#F3EEDF] px-4 font-serif italic text-xs font-bold text-marigold tracking-widest -mt-2.5">
            ✦ SCHEMESETU ✦
          </span>
        </div>

        {/* BOTTOM FOOTER BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans text-[#5C5643]">
          <div>
            © 2026 {t('brandName')} · {t('rightsReserved')}
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link to="/faq" className="hover:text-navy hover:underline transition-colors">
              {lang === 'hi' ? 'सामान्य प्रश्न' : 'FAQ'}
            </Link>
            <span className="text-navy/20">•</span>
            <span className="hover:text-navy cursor-pointer hover:underline transition-colors">
              Privacy Policy
            </span>
            <span className="text-navy/20">•</span>
            <span className="hover:text-navy cursor-pointer hover:underline transition-colors">
              Terms of Use
            </span>
            <span className="text-navy/20">•</span>
            <span className="hover:text-navy cursor-pointer hover:underline transition-colors">
              Accessibility
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
