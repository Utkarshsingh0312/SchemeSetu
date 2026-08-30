import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEligibility } from '../context/EligibilityContext';
import { useLanguage } from '../context/LanguageContext';
import SchemeCard from '../components/SchemeCard';
import SkeletonCard from '../components/SkeletonCard';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { RefreshCw, BookmarkCheck, Info, User, Layers, Filter } from 'lucide-react';

export const Results = () => {
  const navigate = useNavigate();
  const { matchResults, runEligibilityCheck, profile, loading } = useEligibility();
  const { lang, t } = useLanguage();

  const [filterTab, setFilterTab] = useState('Matched');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  useEffect(() => {
    if (!matchResults || matchResults.length === 0) {
      runEligibilityCheck();
    }
  }, []);

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
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-7">
      <DisclaimerBanner />

      {/* Results Header */}
      <div className="my-8 bg-card border border-navy/20 p-6 sm:p-8 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="eyebrow mb-1">Passbook Match Engine</div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-navy">
            {t('resultsTitle')}
          </h1>
          <p className="text-xs font-mono text-ink-soft mt-1.5">
            {t('resultsSubtitle', { strong: matchedCount, near: nearMissCount })}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/eligibility" className="btn-ghost text-xs py-2 px-3.5 font-mono flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t('updateProfile')}</span>
          </Link>

          <Link to="/passbook" className="btn-primary text-xs py-2 px-4 font-mono flex items-center gap-1.5">
            <BookmarkCheck className="w-3.5 h-3.5 text-gold" />
            <span>{t('myPassbook')}</span>
          </Link>
        </div>
      </div>

      {/* Profile Match Explanation Note */}
      <div className="bg-paper border border-navy/15 p-4 rounded-md mb-8 text-xs font-mono text-navy flex items-center gap-2.5">
        <Info className="w-4 h-4 text-teal flex-none" />
        <span>
          <b>{t('profileMatch')}:</b> {t('disclaimerNote')}
        </span>
      </div>

      {/* Filter Controls Bar (Two Tabs + Clean Category Dropdown) */}
      <div className="mb-8 pb-4 border-b border-navy/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Result Type Tabs */}
        <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setFilterTab('Matched')}
            className={`px-3.5 py-1.5 rounded transition-all whitespace-nowrap ${filterTab === 'Matched' ? 'bg-teal-deep text-white font-bold' : 'bg-card text-ink-soft hover:text-navy border border-navy/15'}`}
          >
            {t('strongMatches')}
          </button>
          <button
            onClick={() => setFilterTab('Near Miss')}
            className={`px-3.5 py-1.5 rounded transition-all whitespace-nowrap ${filterTab === 'Near Miss' ? 'bg-rust text-white font-bold' : 'bg-card text-ink-soft hover:text-navy border border-navy/15'}`}
          >
            {t('nearMisses')}
          </button>
        </div>

        {/* Clean Category Dropdown Filter */}
        <div className="flex items-center gap-2 font-mono text-xs w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-gold-deep flex-none" />
          <span className="text-ink-soft flex-none">{t('categoryLabel')}:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-paper border border-navy/20 text-navy font-bold rounded px-3 py-1.5 text-xs focus:outline-none focus:border-gold-deep cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left / Main Results List */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => <SkeletonCard key={n} />)}
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredResults.map((res) => (
                <SchemeCard key={res.scheme.id} matchResult={res} />
              ))}
            </div>
          ) : (
            <div className="bg-card border border-navy/15 p-12 text-center rounded-lg space-y-4">
              <Layers className="w-10 h-10 text-navy/30 mx-auto" />
              <h3 className="font-serif font-bold text-xl text-navy">{t('noMatchesFilter')}</h3>
              <p className="text-xs text-ink-soft max-w-sm mx-auto">
                {t('tryResetCategory')}
              </p>
              <button onClick={() => { setFilterTab('Matched'); setSelectedCategory('All Categories'); }} className="btn-ghost text-xs py-2 px-4">
                {t('resetCategoryFilter')}
              </button>
            </div>
          )}
        </div>

        {/* Right / Profile Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border border-navy/20 p-6 rounded-lg sticky top-24 space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-navy border-b border-navy/15 pb-3">
              <User className="w-4 h-4 text-teal" />
              <span>{t('evaluatedProfile')}</span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between text-ink-soft">
                <span>{lang === 'hi' ? 'आयु:' : 'Age:'}</span> <b className="text-navy">{profile.age} {lang === 'hi' ? 'वर्ष' : 'years'}</b>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>{t('filterState')}:</span> <b className="text-navy">{profile.state}</b>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>{t('labelIncome').split(' ')[0]}:</span> <b className="text-navy">₹{Number(profile.annual_income).toLocaleString('en-IN')}/{lang === 'hi' ? 'वर्ष' : 'yr'}</b>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>{lang === 'hi' ? 'व्यवसाय:' : 'Occupation:'}</span> <b className="text-navy">{profile.occupation}</b>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>{t('categoryLabel')}:</span> <b className="text-navy">{profile.category}</b>
              </div>
            </div>

            <div className="pt-3 border-t border-navy/15">
              <Link 
                to="/eligibility" 
                className="w-full btn-ghost text-xs py-2 text-center font-mono font-bold flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
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
