import React, { useState, useEffect } from 'react';
import { schemesAPI } from '../services/api';
import SchemeCard from '../components/SchemeCard';
import SkeletonCard from '../components/SkeletonCard';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { useLanguage } from '../context/LanguageContext';
import { Search, Filter, Layers, ChevronLeft, ChevronRight, Tag } from 'lucide-react';

export const ExploreSchemes = () => {
  const { lang, t } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [totalSchemes, setTotalSchemes] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All India');
  const [selectedGovtLevel, setSelectedGovtLevel] = useState('All');

  const categories = [
    "All", "Farmers", "Students", "Health", "Pension", "Housing", "Women", "Employment", "Business", "Disability", "Social Security"
  ];

  const subcategoryMap = {
    "Disability": ["All", "Assistive Devices", "Rehabilitation", "Disability Education", "Disability Financial Assistance"],
    "Farmers": ["All", "Farmer Income Support", "Crop Insurance", "Agricultural Equipment", "Irrigation & Water Management", "Farmer Credit & Loans", "Fisheries", "Dairy & Livestock"],
    "Students": ["All", "Scholarships", "Competitive Exam Coaching", "Skill Development", "Higher Education"],
    "Health": ["All", "Health Insurance", "Maternal Health", "Child Health", "Senior Pilgrimage & Welfare"],
    "Pension": ["All", "Old Age Pension", "Widow Assistance", "Social Security"],
    "Business": ["All", "Business Loans", "Handloom & Handicrafts", "Vendor Support", "Startup & MSME"],
    "Women": ["All", "Girl Child Welfare", "Women Support"],
    "Employment": ["All", "Skill Development"]
  };

  const indianStates = [
    "All India", "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"
  ];

  useEffect(() => {
    fetchSchemes(page);
  }, [page, selectedCategory, selectedSubcategory, selectedState, selectedGovtLevel]);

  const fetchSchemes = async (targetPage = 1) => {
    setLoading(true);
    try {
      const res = await schemesAPI.getSchemes({
        page: targetPage,
        page_size: 24,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        state: selectedState !== 'All India' ? selectedState : undefined,
        government_level: selectedGovtLevel !== 'All' ? selectedGovtLevel : undefined,
        search: search.trim() || undefined
      });
      
      let items = res.data && res.data.items ? res.data.items : (Array.isArray(res.data) ? res.data : []);
      
      // Filter by subcategory if specified
      if (selectedSubcategory !== 'All') {
        items = items.filter(s => s.sub_category === selectedSubcategory);
      }

      setSchemes(items);
      setTotalSchemes(res.data?.total || items.length);
      setTotalPages(res.data?.total_pages || 1);
      setPage(res.data?.page || 1);
    } catch (err) {
      console.error('Error fetching schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchSchemes(1);
  };

  const availableSubcategories = subcategoryMap[selectedCategory] || [];

  return (
    <div className="min-h-screen py-10 max-w-6xl mx-auto px-4 sm:px-7">
      <DisclaimerBanner />

      {/* Header */}
      <div className="my-8 text-center max-w-2xl mx-auto space-y-3">
        <div className="eyebrow justify-center mb-1">{t('exploreHeader')}</div>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-navy">
          {t('exploreHeader')}
        </h1>
        <p className="text-xs text-ink-soft font-sans leading-relaxed">
          {t('exploreSubheader')}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-card border border-navy/20 p-5 rounded-lg mb-8 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-navy/40 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-paper border border-navy/20 rounded pl-10 pr-4 py-2.5 text-xs font-sans focus:outline-none focus:border-gold-deep"
            />
          </div>
          <button type="submit" className="btn-primary text-xs py-2.5 px-5">
            {t('search')}
          </button>
        </form>

        {/* Filters */}
        <div className="space-y-3 pt-2 border-t border-navy/10">
          {/* Primary Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 font-mono text-xs no-scrollbar">
            <span className="text-navy font-bold flex items-center gap-1 flex-none mr-1">
              <Filter className="w-3.5 h-3.5 text-teal-deep" /> {t('categoryLabel')}:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { 
                  setSelectedCategory(cat); 
                  setSelectedSubcategory('All');
                  setPage(1); 
                }}
                className={`px-3 py-1 rounded transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-navy text-paper font-bold'
                    : 'bg-paper text-ink-soft hover:text-navy border border-navy/15'
                }`}
              >
                {cat === 'All' ? t('allCategories') : cat}
              </button>
            ))}
          </div>

          {/* Granular Subcategory Pills */}
          {availableSubcategories.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 font-mono text-xs no-scrollbar bg-paper/60 p-2 rounded border border-navy/10">
              <span className="text-gold-deep font-bold flex items-center gap-1 flex-none mr-1">
                <Tag className="w-3.5 h-3.5" /> Subcategory:
              </span>
              {availableSubcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => { setSelectedSubcategory(sub); setPage(1); }}
                  className={`px-2.5 py-0.5 rounded transition-all whitespace-nowrap text-[11.5px] ${
                    selectedSubcategory === sub
                      ? 'bg-gold-deep text-navy font-bold'
                      : 'bg-card text-ink-soft hover:text-navy border border-navy/15'
                  }`}
                >
                  {sub === 'All' ? (lang === 'hi' ? 'सभी उपश्रेणियां' : 'All Subcategories') : sub}
                </button>
              ))}
            </div>
          )}

          {/* Level & State Dropdowns */}
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs pt-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-ink-soft">{t('filterLevel')}:</span>
                <select
                  value={selectedGovtLevel}
                  onChange={(e) => { setSelectedGovtLevel(e.target.value); setPage(1); }}
                  className="bg-paper border border-navy/20 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-gold-deep"
                >
                  <option value="All">{t('allLevels')}</option>
                  <option value="Central">{t('centralGov')}</option>
                  <option value="State">{t('stateGov')}</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-ink-soft">{t('filterState')}:</span>
                <select
                  value={selectedState}
                  onChange={(e) => { setSelectedState(e.target.value); setPage(1); }}
                  className="bg-paper border border-navy/20 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-gold-deep"
                >
                  {indianStates.map((st) => (
                    <option key={st} value={st}>{st === 'All India' ? t('allStates') : st}</option>
                  ))}
                </select>
              </div>
            </div>

            {(selectedCategory !== 'All' || selectedSubcategory !== 'All' || selectedState !== 'All India' || selectedGovtLevel !== 'All' || search) && (
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('All');
                  setSelectedSubcategory('All');
                  setSelectedState('All India');
                  setSelectedGovtLevel('All');
                  setPage(1);
                }}
                className="text-rust hover:underline font-bold text-[11px]"
              >
                {t('resetFilters')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      ) : schemes.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                matchResult={{
                  scheme,
                  eligible: true,
                  score: 85,
                  matched_criteria: [`Level: ${scheme.government_level}`, `State: ${scheme.state}`],
                  failed_criteria: [],
                  near_match: false,
                  explanation_summary: "Verified database record"
                }}
              />
            ))}
          </div>

          {/* Pagination Stepper Bar */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center bg-card border border-navy/15 p-4 rounded-md font-mono text-xs">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('previous')}</span>
              </button>

              <span>
                {t('page')} <b>{page}</b> {t('of')} <b>{totalPages}</b>
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1 disabled:opacity-40"
              >
                <span>{t('next')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-card border border-navy/15 p-12 text-center rounded-lg space-y-4">
          <Layers className="w-10 h-10 text-navy/30 mx-auto" />
          <h3 className="font-serif font-semibold text-lg text-navy">{t('noSchemesFound')}</h3>
          <p className="text-xs text-ink-soft max-w-sm mx-auto">
            {t('noSchemesFound')}
          </p>
          <button 
            onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedSubcategory('All'); setSelectedState('All India'); setSelectedGovtLevel('All'); setPage(1); }} 
            className="btn-ghost text-xs py-2 px-4"
          >
            {t('resetFilters')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExploreSchemes;
