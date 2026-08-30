import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { passbookAPI, applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useEligibility } from '../context/EligibilityContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { Bookmark, Clock, CheckCircle, Trash2, ArrowRight, UserCheck, AlertTriangle, FileText, ExternalLink } from 'lucide-react';

export const Passbook = () => {
  const { user } = useAuth();
  const { profile, matchResults } = useEligibility();
  const { addToast } = useToast();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [savedSchemes, setSavedSchemes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [savedRes, appsRes] = await Promise.all([
        passbookAPI.getSavedSchemes(),
        applicationsAPI.getApplications()
      ]);
      setSavedSchemes(savedRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (schemeId) => {
    try {
      await passbookAPI.removeSavedScheme(schemeId);
      setSavedSchemes(prev => prev.filter(s => s.scheme.id !== schemeId));
      addToast(lang === 'hi' ? "पासबुक से हटाया गया" : "Removed scheme from Passbook", "info");
    } catch (err) {
      console.error(err);
    }
  };

  const matchedCount = matchResults ? matchResults.filter(r => r.eligible).length : 7;

  return (
    <div className="min-h-screen py-10 max-w-6xl mx-auto px-4 sm:px-7 space-y-8">
      <DisclaimerBanner />

      {/* Header */}
      <div className="bg-navy text-paper p-6 sm:p-8 rounded-lg shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="text-gold font-mono text-xs uppercase tracking-wider mb-1">Citizen Eligibility Ledger</div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif font-bold text-3xl text-paper">{t('passbookTitle')}</h1>
            <span className="text-sm font-sans text-paper/80 font-normal">{t('welcomeUser')} 👋</span>
          </div>
          <p className="text-xs font-mono text-paper/70 mt-1.5">
            {user?.name} ({user?.email})
          </p>
        </div>

        <div className="flex gap-3 font-mono text-xs">
          <Link to="/eligibility" className="btn-ghost py-2.5 px-4 text-paper border-paper/40 hover:bg-paper/10">
            {t('editProfile')}
          </Link>
          <Link to="/applications" className="btn-primary py-2.5 px-4 flex items-center gap-1">
            <span>{t('activeTabApplications')}</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold" />
          </Link>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-navy/20 p-5 rounded-md shadow-sm space-y-1">
          <div className="font-mono text-xs text-ink-soft uppercase font-bold">{t('profileCompleteness')}</div>
          <div className="font-serif font-bold text-2xl text-navy">82% <span className="text-xs font-sans font-normal text-ink-soft">{lang === 'hi' ? 'पूर्ण' : 'complete'}</span></div>
          <div className="w-full bg-paper h-2 rounded-full overflow-hidden mt-2 border border-navy/10">
            <div className="bg-teal h-full w-[82%]"></div>
          </div>
        </div>

        <div className="bg-card border border-navy/20 p-5 rounded-md shadow-sm space-y-1">
          <div className="font-mono text-xs text-ink-soft uppercase font-bold">{t('schemesMatchedCount')}</div>
          <div className="font-serif font-bold text-2xl text-teal-deep">{matchedCount}</div>
          <span className="text-[10.5px] font-mono text-ink-soft block">{lang === 'hi' ? 'पात्र योजनाएं' : 'Eligible to claim'}</span>
        </div>

        <div className="bg-card border border-navy/20 p-5 rounded-md shadow-sm space-y-1">
          <div className="font-mono text-xs text-ink-soft uppercase font-bold">{t('savedSchemesCount')}</div>
          <div className="font-serif font-bold text-2xl text-gold-deep">{savedSchemes.length}</div>
          <span className="text-[10.5px] font-mono text-ink-soft block">{lang === 'hi' ? 'आपकी पासबुक में' : 'In your passbook'}</span>
        </div>

        <div className="bg-card border border-navy/20 p-5 rounded-md shadow-sm space-y-1">
          <div className="font-mono text-xs text-ink-soft uppercase font-bold">{t('activeApplications')}</div>
          <div className="font-serif font-bold text-2xl text-rust">{applications.length}</div>
          <span className="text-[10.5px] font-mono text-ink-soft block">{lang === 'hi' ? 'सक्रिय आवेदन' : 'In progress workflow'}</span>
        </div>
      </div>

      {/* Action Needed & Deadline Approaching Banner */}
      <div className="bg-amber-50 border border-amber-300 p-5 rounded-md space-y-3">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-900 uppercase">
          <AlertTriangle className="w-4 h-4 text-rust" />
          <span>{t('actionNeededTitle')}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
          <div className="bg-paper p-3.5 rounded border border-amber-200 flex justify-between items-center">
            <div>
              <div className="font-serif font-bold text-navy text-sm">Post-Matric Scholarship</div>
              <div className="text-rust font-mono text-[11px] font-bold">⏰ {lang === 'hi' ? 'अंतिम तिथि: 18 दिन शेष (30 सितंबर)' : 'Deadline: 18 days remaining (30th Sept)'}</div>
            </div>
            <Link to="/scheme/3" className="btn-primary text-xs py-1.5 px-3">
              {t('viewDetails')}
            </Link>
          </div>

          <div className="bg-paper p-3.5 rounded border border-amber-200 flex justify-between items-center">
            <div>
              <div className="font-serif font-bold text-navy text-sm">PM Awas Yojana</div>
              <div className="text-ink-soft font-mono text-[11px]">{lang === 'hi' ? 'आय प्रमाण पत्र सत्यापन लंबित' : 'Income certificate verification pending'}</div>
            </div>
            <Link to="/scheme/5" className="btn-ghost text-xs py-1.5 px-3 font-mono">
              {t('documentsRequired')}
            </Link>
          </div>
        </div>
      </div>

      {/* Saved Schemes Section */}
      <div className="bg-card border border-navy/20 rounded-lg p-6 sm:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-serif font-bold text-xl text-navy">{t('yourSavedSchemes')}</h2>
          <span className="font-mono text-xs text-ink-soft">{savedSchemes.length} {t('savedSchemesCount')}</span>
        </div>

        {loading ? (
          <div className="text-center py-10 font-mono text-xs text-ink-soft">{t('loading')}</div>
        ) : savedSchemes.length > 0 ? (
          <div className="space-y-4">
            {savedSchemes.map((item) => {
              const { scheme } = item;
              return (
                <div key={item.id} className="bg-paper border border-navy/15 p-5 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gold-deep transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-mono text-[10.5px]">
                      <span className="bg-teal/15 text-teal-deep px-2 py-0.5 rounded font-bold uppercase">{scheme.category}</span>
                      <span className="text-ink-soft">{scheme.scheme_type}</span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-navy">
                      <Link to={`/scheme/${scheme.id}`} className="hover:underline">{scheme.name}</Link>
                    </h3>
                    <p className="text-xs text-ink-soft font-sans line-clamp-1">{scheme.short_description}</p>
                    <div className="text-xs font-serif font-semibold text-gold-deep">{t('benefit')}: {scheme.benefit}</div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-navy/10">
                    <button 
                      onClick={() => handleRemove(scheme.id)} 
                      className="p-2 text-ink-soft hover:text-rust transition-colors"
                      title={t('removeFromPassbook')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <Link to={`/scheme/${scheme.id}`} className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1">
                      <span>{t('viewDetails')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4 border border-dashed border-navy/20 rounded-md p-8">
            <Bookmark className="w-10 h-10 text-navy/30 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-navy">{t('noSavedSchemes')}</h3>
            <p className="text-xs text-ink-soft max-w-sm mx-auto font-sans">
              {t('noSavedSchemes')}
            </p>
            <Link to="/results" className="btn-primary text-xs py-2.5 px-4 inline-flex">
              {t('browseAndSave')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Passbook;
