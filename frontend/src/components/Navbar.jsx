import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Globe, User, Shield, LogOut, Menu, X, ArrowRight, Bookmark, Layers, Search } from 'lucide-react';

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

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-paper/95 backdrop-blur-md shadow-md' : 'bg-paper/85 backdrop-blur-sm'} border-b border-navy/15`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-7 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 flex-none">
            <svg viewBox="0 0 60 60" className="w-full h-full transform -rotate-6 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105">
              <circle cx="30" cy="30" r="27" fill="none" stroke="#16233F" strokeWidth="2"/>
              <circle cx="30" cy="30" r="21" fill="none" stroke="#D9A441" strokeWidth="1.2"/>
              <text x="30" y="38" textAnchor="middle" fontFamily="Fraunces, serif" fontStyle="italic" fontWeight="680" fontSize="24" fill="#16233F">S</text>
            </svg>
          </div>
          <div className="font-serif font-bold text-xl text-navy tracking-tight">
            Scheme<em className="not-italic text-teal-deep font-normal">Setu</em>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 font-mono text-xs text-ink-soft">
          <a href="/#why" className="hover:text-navy transition-colors">Why SchemeSetu</a>
          <a href="/#ritual" className="hover:text-navy transition-colors">How it works</a>
          <Link to="/explore" className="hover:text-navy transition-colors flex items-center gap-1">
            <Search className="w-3 h-3 text-gold-deep" />
            <span>Explore Schemes</span>
          </Link>
          <a href="/#faq" className="hover:text-navy transition-colors">FAQ</a>
        </nav>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Switcher */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 font-mono text-xs font-semibold px-2.5 py-1.5 rounded border border-navy/20 hover:bg-navy/5 text-navy transition-all"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-gold-deep" />
            <span>{lang === 'en' ? 'EN | हिंदी' : 'हिंदी | EN'}</span>
          </button>

          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-1 font-mono text-xs font-bold text-rust hover:underline bg-rust/10 border border-rust/30 px-2.5 py-1 rounded">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2 font-mono text-xs">
              <Link to="/results" className="hover:text-navy text-ink-soft font-semibold px-2">
                My Matches
              </Link>
              <Link to="/passbook" className="btn-ghost py-1.5 px-3">
                {t('myPassbook')}
              </Link>
              <Link to="/applications" className="hover:text-navy text-ink-soft font-semibold px-2">
                Applications
              </Link>

              {/* User Pill */}
              <div className="flex items-center gap-2 pl-2 border-l border-navy/20">
                <span className="w-7 h-7 rounded-full bg-navy text-paper font-bold flex items-center justify-center text-xs">
                  {user.name ? user.name[0].toUpperCase() : 'C'}
                </span>
                <button 
                  onClick={logout} 
                  className="p-1.5 text-ink-soft hover:text-rust transition-colors"
                  title={t('logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link to="/login" className="btn-ghost text-xs py-2 px-3.5">
                {t('login')}
              </Link>
              <Link to="/eligibility" className="btn-primary text-xs py-2 px-4 flex items-center gap-1">
                <span>Check Eligibility</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1 font-mono text-xs font-semibold px-2 py-1 rounded border border-navy/20 text-navy"
          >
            <span>{lang === 'en' ? 'EN|हि' : 'हि|EN'}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-navy hover:bg-navy/10 rounded transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-navy/20 px-6 py-5 space-y-4 font-mono text-sm">
          <a href="/#why" className="block text-navy font-semibold">Why SchemeSetu</a>
          <a href="/#ritual" className="block text-navy font-semibold">How it works</a>
          <Link to="/explore" className="block text-navy font-semibold flex items-center gap-2">
            <Search className="w-4 h-4 text-gold-deep" />
            <span>Explore Schemes</span>
          </Link>
          <a href="/#faq" className="block text-navy font-semibold">FAQ</a>

          {user ? (
            <div className="pt-3 border-t border-navy/15 space-y-3">
              <div className="text-xs text-ink-soft">Signed in as <b>{user.name}</b></div>
              <Link to="/results" className="block text-teal-deep font-bold">My Matches</Link>
              <Link to="/passbook" className="block text-navy font-bold">My Passbook</Link>
              <Link to="/applications" className="block text-navy font-bold">Applications</Link>
              {isAdmin && <Link to="/admin" className="block text-rust font-bold">Admin Dashboard</Link>}
              <button onClick={logout} className="block text-rust font-bold pt-2">Logout</button>
            </div>
          ) : (
            <div className="pt-3 border-t border-navy/15 space-y-3">
              <Link to="/login" className="btn-ghost w-full justify-center text-xs py-2.5">
                {t('login')}
              </Link>
              <Link to="/eligibility" className="btn-primary w-full justify-center text-xs py-2.5">
                Check My Eligibility →
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
