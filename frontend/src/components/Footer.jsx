import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { lang, toggleLanguage } = useLanguage();

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
              SchemeSetu
            </div>
            <p className="text-xs text-ink-soft leading-relaxed max-w-md font-sans">
              Every citizen, one profile away from every scheme they may qualify for. Connecting citizens directly with central and state government welfare benefits.
            </p>
            <button 
              onClick={toggleLanguage} 
              className="font-mono text-xs font-semibold text-navy hover:underline inline-flex items-center gap-1"
            >
              🌐 Switch Language: <b>{lang === 'en' ? 'EN | हिंदी' : 'हिंदी | EN'}</b>
            </button>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold text-navy uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="text-xs font-mono space-y-2 text-ink-soft">
              <li><Link to="/explore" className="hover:text-navy">Explore Schemes</Link></li>
              <li><Link to="/eligibility" className="hover:text-navy">Check Eligibility</Link></li>
              <li><Link to="/passbook" className="hover:text-navy">My Passbook</Link></li>
              <li><Link to="/applications" className="hover:text-navy">Application Tracker</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold text-navy uppercase tracking-wider mb-3">Roadmap</h4>
            <ul className="text-xs font-mono space-y-2 text-ink-soft">
              <li><span className="text-teal font-bold">Phase 1:</span> Digital Passbook (Active)</li>
              <li><span className="text-gold-deep">Phase 2:</span> Voice &amp; Regional Languages</li>
              <li><span className="text-ink-soft opacity-75">Phase 3:</span> WhatsApp Assistant</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-ink-soft">
          <div>
            © 2026 Benefit Bridge · All rights reserved
          </div>
          <div className="text-center sm:text-right max-w-lg text-[11px]">
            SchemeSetu is an independent prototype and is not affiliated with the Government of India. Eligibility information should be verified on the official scheme portal before applying.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
