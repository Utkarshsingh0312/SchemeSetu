import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEligibility } from '../context/EligibilityContext';
import { useLanguage } from '../context/LanguageContext';
import SchemeCard from '../components/SchemeCard';
import SkeletonCard from '../components/SkeletonCard';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { RefreshCw, BookmarkCheck, Info, User, Layers, Filter, CheckCircle2, Award, ArrowUpRight } from 'lucide-react';

export const Results = () => {
  const navigate = useNavigate();
  const { matchResults, runEligibilityCheck, profile, loading } = useEligibility();
  const { lang, t } = useLanguage();

  const [filterTab, setFilterTab] = useState('Matched');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [summaryPercent, setSummaryPercent] = useState(0);

  useEffect(() => {
    if (!matchResults || matchResults.length === 0) {
      runEligibilityCheck();
    }
  }, []);

  // Summary Count-up Animation
  useEffect(() => {
    if (matchResults && matchResults.length > 0) {
      const topScore = Math.max(...matchResults.map(r => r.score || 0));
      let start = 0;
      const duration = 1000;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = topScore / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= topScore) {
          setSummaryPercent(topScore);
          clearInterval(timer);
        } else {
          setSummaryPercent(Math.floor(start));
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [matchResults]);

  const categories = [
    "All Categories",
    "Education & Scholarships",
    "Agriculture & Farmers",
    "Business & Entrepreneurship",
    "Women & Child Welfare",
    "Pension & Social Security",
    "Employment & Skill Development",
    "Disability & Assistive Support",
    "Healthcare & Medical",
    "Financial Assistance & Loans",
    "Housing & Shelter",
    "Senior Citizens",
    "Food & Nutrition"
  ];

  const getCategoryLabel = (cat) => {
    if (cat === "All Categories") return t('allCategories');
    if (lang === 'hi') {
      const map = {
        "Education & Scholarships": "शिक्षा और छात्रवृत्ति",
        "Agriculture & Farmers": "कृषि और किसान",
        "Business & Entrepreneurship": "व्यापार और उद्यमिता",
        "Women & Child Welfare": "महिला एवं बाल कल्याण",
        "Pension & Social Security": "पेंशन और सामाजिक सुरक्षा",
        "Employment & Skill Development": "रोजगार और कौशल विकास",
        "Disability & Assistive Support": "दिव्यांगता और सहायक सहायता",
        "Healthcare & Medical": "स्वास्थ्य और चिकित्सा",
        "Financial Assistance & Loans": "वित्तीय सहायता और ऋण",
        "Housing & Shelter": "आवास और आश्रय",
        "Senior Citizens": "वरिष्ठ नागरिक",
        "Food & Nutrition": "खाद्य और पोषण"
      };
      return map[cat] || cat;
    }
    return cat;
  };

  const filteredResults = matchResults.filter(res => {
    if (filterTab === 'Matched' && !res.eligible) return false;
    if (filterTab === 'Near Miss' && !res.near_match) return false;
    
    if (selectedCategory !== 'All Categories') {
      const schemeCat = res.scheme.display_category || res.scheme.category;
      if (schemeCat !== selectedCategory) return false;
    }
    
    return true;
  });

  const matchedCount = matchResults.filter(r => r.eligible).length;
  const nearMissCount = matchResults.filter(r => r.near_match).length;

  return (
    <div className="min-h-screen py-8 max-w-[1180px] mx-auto px-4 sm:px-6 page-entrance font-sans">
      <DisclaimerBanner />

      {/* RESULTS HEADER */}
      <div className="my-6 bg-[#FBF8F1] border border-navy/12 p-6 sm:p-8 rounded-[22px] shadow-[0_12px_35px_rgba(22,33,60,0.08)] relative overflow-hidden">
        {/* Soft Background Accent Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-marigold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            {/* Status Indicator Pill */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#2C6350] animate-pulse" />
              <span className="text-[11px] font-bold text-[#2C6350] uppercase tracking-[0.14em] font-sans">
                PROFILE EVALUATED
              </span>
              <span className="text-navy/30">•</span>
              <span className="bg-[#2C6350]/10 text-[#2C6350] border border-[#2C6350]/20 rounded-full text-xs font-bold px-3 py-0.5 font-sans">
                {matchedCount} {lang === 'hi' ? 'सटीक परिणाम' : 'strong matches'}
              </span>
            </div>

            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-navy leading-tight">
              {lang === 'hi' ? 'आपकी पात्र योजनाएं' : 'Your Eligible Schemes'}
            </h1>
            
            <p className="text-sm text-[#5C5643] mt-1.5 font-sans">
              {lang === 'hi' 
                ? 'आपकी प्रोफ़ाइल के आधार पर, हमने वे योजनाएं खोजी हैं जो आपकी पात्रता से सटीक मेल खाती हैं।'
                : 'Based on your profile, we found schemes that match your eligibility.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link 
              to="/eligibility" 
              className="bg-transparent border border-navy/18 text-navy hover:bg-navy/[0.04] text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer font-sans"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t('updateProfile')}</span>
            </Link>

            <Link 
              to="/passbook" 
              className="bg-[#16213C] text-[#FBF8F1] hover:bg-[#202F52] text-xs font-bold py-2.5 px-5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer font-sans"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-marigold" />
              <span>{t('myPassbook')}</span>
            </Link>
          </div>
        </div>

        {/* SMART SUMMARY STRIP */}
        <div className="mt-6 pt-5 border-t border-navy/10 grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
          <div className="bg-[#2C6350]/[0.06] border border-[#2C6350]/12 rounded-xl p-3.5 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#2C6350] flex-none" />
            <div>
              <div className="text-[11px] font-bold text-[#2C6350] uppercase tracking-wider">Evaluation Status</div>
              <div className="text-xs font-bold text-navy">Profile criteria verified</div>
            </div>
          </div>

          <div className="bg-marigold/[0.08] border border-marigold/15 rounded-xl p-3.5 flex items-center gap-3">
            <Award className="w-5 h-5 text-marigold flex-none" />
            <div>
              <div className="text-[11px] font-bold text-marigold uppercase tracking-wider">Eligible Schemes</div>
              <div className="text-xs font-bold text-navy">{matchedCount} Central & State schemes</div>
            </div>
          </div>

          <div className="bg-navy/[0.05] border border-navy/10 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#16213C] text-[#FBF8F1] flex items-center justify-center font-serif font-bold text-xs flex-none">
              {summaryPercent}%
            </div>
            <div>
              <div className="text-[11px] font-bold text-navy/70 uppercase tracking-wider">Highest Match Score</div>
              <div className="text-xs font-bold text-navy">Top recommendation match</div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Disclaimer Note */}
      <div className="bg-[#FBF8F1] border border-navy/12 p-3.5 rounded-xl mb-6 text-xs text-[#5C5643] flex items-center gap-2.5 shadow-xs font-sans">
        <Info className="w-4 h-4 text-[#2C6350] flex-none" />
        <span>
          <b className="text-navy">{t('profileMatch')}:</b> {t('disclaimerNote')}
        </span>
      </div>

      {/* FILTER & TAB CONTROLS BAR */}
      <div className="mb-8 pb-4 border-b border-navy/12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans">
        {/* Result Type Tabs */}
        <div className="flex items-center gap-2 text-xs font-bold overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setFilterTab('Matched')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              filterTab === 'Matched' 
                ? 'bg-[#16213C] text-[#FBF8F1] shadow-sm' 
                : 'bg-[#FBF8F1] text-[#5C5643] hover:text-navy border border-navy/15'
            }`}
          >
            {t('strongMatches')} ({matchedCount})
          </button>
          <button
            onClick={() => setFilterTab('Near Miss')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              filterTab === 'Near Miss' 
                ? 'bg-[#B24B2C] text-white shadow-sm' 
                : 'bg-[#FBF8F1] text-[#5C5643] hover:text-navy border border-navy/15'
            }`}
          >
            {t('nearMisses')} ({nearMissCount})
          </button>
        </div>

        {/* Category Dropdown Filter */}
        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-marigold flex-none" />
          <span className="text-[#5C5643] font-medium flex-none">{t('categoryLabel')}:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-[#FBF8F1] border border-navy/20 text-navy font-bold rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-marigold cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* MAIN RESPONSIVE LAYOUT (GRID: 70% MAIN CARDS / 30% SIDEBAR) */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_330px] gap-7 items-start">
        
        {/* LEFT: MAIN SCHEME CARDS STREAM */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => <SkeletonCard key={n} />)}
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredResults.map((res, idx) => (
                <SchemeCard key={res.scheme.id} matchResult={res} index={idx} />
              ))}
            </div>
          ) : (
            <div className="bg-[#FBF8F1] border border-navy/12 p-12 text-center rounded-[20px] space-y-4 shadow-sm font-sans">
              <Layers className="w-10 h-10 text-navy/30 mx-auto" />
              <h3 className="font-serif font-bold text-xl text-navy">{t('noMatchesFilter')}</h3>
              <p className="text-xs text-[#5C5643] max-w-sm mx-auto">
                {t('tryResetCategory')}
              </p>
              <button 
                onClick={() => { setFilterTab('Matched'); setSelectedCategory('All Categories'); }} 
                className="bg-transparent border border-navy/20 text-navy font-bold text-xs py-2 px-5 rounded-xl hover:bg-navy/5 cursor-pointer"
              >
                {t('resetCategoryFilter')}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: EVALUATED PROFILE SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-[#FBF8F1] border border-navy/12 p-6 rounded-[22px] shadow-[0_12px_35px_rgba(22,33,60,0.08)] sticky top-24 space-y-5 font-sans">
            <div className="flex items-center justify-between border-b border-navy/10 pb-3.5">
              <div className="flex items-center gap-2 font-bold text-xs text-navy">
                <User className="w-4 h-4 text-[#2C6350]" />
                <span>{t('evaluatedProfile')}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#2C6350]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2C6350] animate-pulse" />
                <span>ACTIVE</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-[#5C5643] p-1.5 rounded-lg hover:bg-navy/[0.03] transition-colors">
                <span>{lang === 'hi' ? 'आयु:' : 'Age:'}</span>
                <b className="text-navy font-bold">{profile.age} {lang === 'hi' ? 'वर्ष' : 'years'}</b>
              </div>
              <div className="flex justify-between items-center text-[#5C5643] p-1.5 rounded-lg hover:bg-navy/[0.03] transition-colors">
                <span>{t('filterState')}:</span>
                <b className="text-navy font-bold">{profile.state}</b>
              </div>
              <div className="flex justify-between items-center text-[#5C5643] p-1.5 rounded-lg hover:bg-navy/[0.03] transition-colors">
                <span>{t('labelIncome').split(' ')[0]}:</span>
                <b className="text-navy font-bold">₹{Number(profile.annual_income).toLocaleString('en-IN')}/{lang === 'hi' ? 'वर्ष' : 'yr'}</b>
              </div>
              <div className="flex justify-between items-center text-[#5C5643] p-1.5 rounded-lg hover:bg-navy/[0.03] transition-colors">
                <span>{lang === 'hi' ? 'व्यवसाय:' : 'Occupation:'}</span>
                <b className="text-navy font-bold">{profile.occupation}</b>
              </div>
              <div className="flex justify-between items-center text-[#5C5643] p-1.5 rounded-lg hover:bg-navy/[0.03] transition-colors">
                <span>{t('categoryLabel')}:</span>
                <b className="text-navy font-bold">{profile.category}</b>
              </div>
            </div>

            <div className="pt-2 border-t border-navy/10">
              <Link 
                to="/eligibility" 
                className="w-full bg-transparent border border-navy/16 text-navy rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2 hover:bg-navy/[0.04] transition-all cursor-pointer group"
              >
                <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-[20deg] transition-transform duration-300" />
                <span>{t('editProfile')}</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Results;
