import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Shield, LogOut, Menu, X, ArrowRight, Search, BookmarkCheck } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isExplorePage = location.pathname === '/explore';

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 bg-[#F3EEDF] border-b border-navy/10 ${scrolled ? 'shadow-sm' : ''} font-sans`}>
      <div className="max-w-[1180px] mx-auto px-4 sm:px-7 h-[76px] sm:h-[80px] flex items-center justify-between gap-4">
        
        {/* BRAND AREA */}
        <Link to="/" className="flex items-center gap-3 group flex-none cursor-pointer">
          {/* EXACT SCHEMESETU LANDING PAGE LOGO MARK (42px) */}
          <div className="w-[42px] h-[42px] rounded-full border border-navy bg-[#FBF8F1] ring-1 ring-marigold/60 flex items-center justify-center font-serif font-bold text-xl text-navy shadow-xs group-hover:rotate-[4deg] group-hover:scale-[1.03] transition-transform duration-200 flex-none">
            S
          </div>
          
          {/* BRAND NAME */}
          <div className="font-serif font-bold text-[24px] sm:text-[26px] text-navy tracking-tight group-hover:text-[#2C6350] transition-colors duration-200">
            Scheme<span className="text-marigold font-normal italic">Setu</span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION LINKS */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-sans text-[14px] font-medium text-navy">
          <a 
            href="/#why" 
            className="hover:text-[#2C6350] hover:-translate-y-[1px] transition-all relative py-1 group/link whitespace-nowrap"
          >
            <span>{t('navWhy')}</span>
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-marigold group-hover/link:w-full transition-all duration-200" />
          </a>

          <a 
            href="/#how-it-works" 
            className="hover:text-[#2C6350] hover:-translate-y-[1px] transition-all relative py-1 group/link whitespace-nowrap"
          >
            <span>{t('navRitual')}</span>
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-marigold group-hover/link:w-full transition-all duration-200" />
          </a>

          {/* EXPLORE SCHEMES (FEATURED ACTION WITH GOLD ICON) */}
          <Link 
            to="/explore" 
            className={`hover:text-[#2C6350] hover:-translate-y-[1px] transition-all relative py-1 group/explore flex items-center gap-1.5 whitespace-nowrap ${isExplorePage ? 'text-[#2C6350] font-bold' : ''}`}
          >
            <Search className="w-3.5 h-3.5 text-[#B7975A] group-hover/explore:translate-x-[2px] transition-transform" />
            <span>{t('navExplore')}</span>
            <span className={`absolute bottom-0 left-0 h-[2px] bg-marigold transition-all duration-200 ${isExplorePage ? 'w-full' : 'w-0 group-hover/explore:w-full'}`} />
          </Link>

          <a 
            href="/#faq" 
            className="hover:text-[#2C6350] hover:-translate-y-[1px] transition-all relative py-1 group/link whitespace-nowrap"
          >
            <span>{t('navFaq')}</span>
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-marigold group-hover/link:w-full transition-all duration-200" />
          </a>
        </nav>

        {/* SUBTLE SEPARATOR */}
        <div className="hidden lg:block h-5 w-px bg-navy/10 flex-none" />

        {/* DESKTOP CONTROLS & USER ACTIONS */}
        <div className="hidden md:flex items-center gap-3.5 lg:gap-4 flex-none">
          {/* COMPACT LANGUAGE SWITCHER */}
          <button 
            onClick={toggleLanguage}
            className="h-[42px] px-3.5 rounded-[10px] border border-navy/15 bg-[#FBF8F1]/65 hover:bg-[#FBF8F1] hover:border-[#B7975A]/45 hover:-translate-y-[1px] text-navy transition-all flex items-center gap-2 cursor-pointer font-sans shadow-2xs"
            title={t('switchLanguage')}
          >
            <Globe className="w-3.5 h-3.5 text-[#B7975A] flex-none" />
            <span className="text-[13px] font-semibold">
              {lang === 'en' ? 'EN | हिंदी' : 'हिंदी | EN'}
            </span>
          </button>

          {isAdmin && (
            <Link 
              to="/admin" 
              className="h-[42px] px-3 rounded-[10px] bg-rust/10 border border-rust/30 text-rust hover:bg-rust/20 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t('adminDashboard')}</span>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3 lg:gap-4 font-sans text-xs">
              
              {/* STRONG MATCHES STATUS ITEM */}
              <Link 
                to="/results" 
                className="flex items-center gap-1.5 text-navy hover:text-[#2C6350] hover:bg-[#E7F1EB] px-2.5 py-1.5 rounded-lg transition-all font-medium whitespace-nowrap"
              >
                <span className="w-2 h-2 rounded-full bg-[#2C6350] animate-pulse flex-none" />
                <span>{t('strongMatches')}</span>
              </Link>

              {/* MY PASSBOOK (PRIMARY ACTION HYBRID BUTTON) */}
              <Link 
                to="/passbook" 
                className="h-[46px] px-4 sm:px-5 rounded-[12px] bg-[#FBF8F1] border border-navy/14 text-[#16213C] font-semibold text-[14px] hover:bg-[#16213C] hover:text-[#FBF8F1] hover:-translate-y-[1px] shadow-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group whitespace-nowrap"
              >
                <span>{t('myPassbook')}</span>
                <ArrowRight className="w-4 h-4 text-marigold group-hover:translate-x-[3px] transition-transform" />
              </Link>

              {/* MY APPLICATIONS */}
              <Link 
                to="/applications" 
                className="text-navy hover:text-[#2C6350] relative py-1 font-medium transition-all whitespace-nowrap group/app"
              >
                <span>{t('myApplications')}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-marigold group-hover/app:w-full transition-all duration-200" />
              </Link>

              {/* USER PROFILE AVATAR & LOGOUT */}
              <div className="flex items-center gap-2 pl-2 border-l border-navy/12">
                <div 
                  className="w-[38px] h-[38px] rounded-full bg-[#16213C] text-[#FBF8F1] ring-1 ring-marigold/60 font-semibold text-xs flex items-center justify-center shadow-xs hover:scale-[1.04] transition-transform cursor-pointer"
                  title={user.name || user.email}
                >
                  {user.name ? user.name[0].toUpperCase() : 'C'}
                </div>
                
                <button 
                  onClick={logout} 
                  className="p-2 text-navy/60 hover:text-rust hover:bg-rust/10 rounded-lg transition-colors cursor-pointer"
                  title={t('logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link 
                to="/login" 
                className="h-[44px] px-4 rounded-xl border border-navy/16 text-navy font-semibold text-xs hover:bg-navy/5 transition-all flex items-center justify-center cursor-pointer"
              >
                {t('login')}
              </Link>
              <Link 
                to="/eligibility" 
                className="h-[44px] px-4 rounded-xl bg-[#16213C] text-[#FBF8F1] font-bold text-xs hover:bg-[#202F52] shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer btn-shine"
              >
                <span>{t('checkEligibility')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-marigold" />
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE HAMBURGER TOGGLE (<= 768px) */}
        <div className="flex md:hidden items-center gap-2.5">
          <button 
            onClick={toggleLanguage}
            className="h-9 px-2.5 rounded-lg border border-navy/18 bg-[#FBF8F1] text-navy font-bold text-xs flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#B7975A]" />
            <span>{lang === 'en' ? 'EN|हि' : 'हि|EN'}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-navy hover:bg-navy/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FBF8F1] border-b border-navy/15 px-6 py-6 space-y-4 font-sans text-sm animate-in slide-in-from-top-2 duration-200">
          <a href="/#why" className="block text-navy font-semibold hover:text-[#2C6350]">{t('navWhy')}</a>
          <a href="/#how-it-works" className="block text-navy font-semibold hover:text-[#2C6350]">{t('navRitual')}</a>
          <Link to="/explore" className="block text-navy font-semibold flex items-center gap-2 hover:text-[#2C6350]">
            <Search className="w-4 h-4 text-[#B7975A]" />
            <span>{t('navExplore')}</span>
          </Link>
          <a href="/#faq" className="block text-navy font-semibold hover:text-[#2C6350]">{t('navFaq')}</a>

          {user ? (
            <div className="pt-4 border-t border-navy/12 space-y-3 font-sans">
              <div className="text-xs text-[#5C5643]">{t('welcomeUser')}, <b>{user.name}</b></div>
              
              <Link to="/results" className="block text-[#2C6350] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2C6350]" />
                <span>{t('strongMatches')}</span>
              </Link>
              
              <Link to="/passbook" className="block text-navy font-bold flex items-center justify-between bg-navy/5 p-2.5 rounded-xl border border-navy/10">
                <span>{t('myPassbook')}</span>
                <ArrowRight className="w-4 h-4 text-marigold" />
              </Link>
              
              <Link to="/applications" className="block text-navy font-bold">{t('myApplications')}</Link>
              
              {isAdmin && (
                <Link to="/admin" className="block text-rust font-bold">{t('adminDashboard')}</Link>
              )}
              
              <button onClick={logout} className="block text-rust font-bold pt-2 cursor-pointer">{t('logout')}</button>
            </div>
          ) : (
            <div className="pt-4 border-t border-navy/12 space-y-3 font-sans">
              <Link to="/login" className="block w-full text-center border border-navy/20 py-2.5 rounded-xl font-bold text-navy">
                {t('login')}
              </Link>
              <Link to="/eligibility" className="block w-full text-center bg-[#16213C] text-[#FBF8F1] py-2.5 rounded-xl font-bold flex items-center justify-center gap-2">
                <span>{t('checkEligibility')}</span>
                <ArrowRight className="w-4 h-4 text-marigold" />
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
