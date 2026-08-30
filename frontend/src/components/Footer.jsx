import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { lang, toggleLanguage, t } = useLanguage();

  return (
    <footer className="border-t border-navy/15 py-10 bg-paper text-ink">
      <div className="max-w-6xl mx-auto px-7">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-navy/10">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 font-serif font-bold text-xl text-navy">
              <div className="w-6 h-6">
                <svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="27" fill="none" stroke="#16233F" strokeWidth="2"/>
                  <text x="30" y="38" textAnchor="middle" fontFamily="Fraunces, serif" fontStyle="italic" fontWeight="680" fontSize="24" fill="#16233F">S</text></svg>
              </div>
              {t('brandName')}
            </div>
            <p className="text-xs text-ink-soft leading-relaxed max-w-md font-sans">
              {t('footerTagline')}
            </p>
            <button 
              onClick={toggleLanguage} 
              className="font-mono text-xs font-semibold text-navy hover:underline inline-flex items-center gap-1"
            >
              🌐 {t('switchLanguage')}: <b>{lang === 'en' ? 'EN | हिंदी' : 'हिंदी | EN'}</b>
            </button>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold text-navy uppercase tracking-wider mb-3">{t('quickLinks')}</h4>
            <ul className="text-xs font-mono space-y-2 text-ink-soft">
              <li><Link to="/explore" className="hover:text-navy">{t('navExplore')}</Link></li>
              <li><Link to="/eligibility" className="hover:text-navy">{t('checkEligibility')}</Link></li>
              <li><Link to="/passbook" className="hover:text-navy">{t('myPassbook')}</Link></li>
              <li><Link to="/applications" className="hover:text-navy">{t('myApplications')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold text-navy uppercase tracking-wider mb-3">{lang === 'hi' ? 'विशेषताएं' : 'Features'}</h4>
            <ul className="text-xs font-mono space-y-2 text-ink-soft">
              <li><span className="text-teal font-bold">{lang === 'hi' ? 'चरण 1:' : 'Phase 1:'}</span> {t('passbookTitle')}</li>
              <li><span className="text-gold-deep">{lang === 'hi' ? 'चरण 2:' : 'Phase 2:'}</span> {lang === 'hi' ? 'द्विभाषी सहायता (सक्रिय)' : 'Bilingual Support (Active)'}</li>
              <li><span className="text-ink-soft opacity-75">{lang === 'hi' ? 'चरण 3:' : 'Phase 3:'}</span> {t('chatbotTitle')}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-ink-soft">
          <div>
            © 2026 {t('brandName')} · {t('rightsReserved')}
          </div>
          <div className="text-center sm:text-right max-w-lg text-[11px]">
            {t('civicDisclaimer')}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
