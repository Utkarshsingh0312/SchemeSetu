import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Heart, ArrowRight, FileText, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { passbookAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { translateCriterion } from '../utils/translateCriterion';
import MatchScoreTooltip from './MatchScoreTooltip';

export const SchemeCard = ({ matchResult, onSaveSuccess }) => {
  const { scheme, eligible, score, matched_criteria, failed_criteria, near_match } = matchResult;
  const { user } = useAuth();
  const { addToast } = useToast();
  const { lang, t } = useLanguage();
  
  const [isSaved, setIsSaved] = useState(false);
  const [showWhyDrawer, setShowWhyDrawer] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = null;
    const duration = 750;
    const targetScore = score || 0;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setAnimatedScore(Math.floor(progress * targetScore));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [score]);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      addToast(lang === 'hi' ? "सहेजने के लिए लॉगिन करें।" : "Please login or create a profile to save schemes to your passbook.", "info");
      return;
    }
    try {
      if (isSaved) {
        await passbookAPI.removeSavedScheme(scheme.id);
        setIsSaved(false);
        addToast(lang === 'hi' ? `पासबुक से हटाया गया "${scheme.name}"` : `Removed "${scheme.name}" from Passbook`, "info");
      } else {
        await passbookAPI.saveScheme(scheme.id);
        setIsSaved(true);
        addToast(lang === 'hi' ? `✓ पासबुक में सहेजा गया "${scheme.name}"` : `✓ Added "${scheme.name}" to your Passbook!`, "success");
      }
      if (onSaveSuccess) onSaveSuccess(scheme.id);
    } catch (err) {
      addToast(t('savedInPassbook'), "info");
    }
  };

  const docCount = Array.isArray(scheme.documents) ? scheme.documents.length : 3;

  return (
    <div className="bg-card border border-navy/20 p-6 rounded-xl shadow-sm card-hover-effect flex flex-col justify-between relative group transition-all duration-300 transform-gpu">
      <div>
        {/* Category, Subcategory & Verification Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-teal-deep bg-teal/10 border border-teal/30 px-2.5 py-0.5 rounded-full">
              {scheme.display_category || scheme.category}
            </span>
            {scheme.sub_category && (
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-gold-deep bg-gold/15 border border-gold/40 px-2.5 py-0.5 rounded-full">
                {scheme.sub_category}
              </span>
            )}
            <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
              scheme.verification_status === 'VERIFIED' 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              {t('verified')}
            </span>
          </div>

          {/* Profile Match Score meter */}
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
            <span className="text-ink-soft">{t('profileMatch')}</span>
            <MatchScoreTooltip />
            <span className={`px-2.5 py-0.5 rounded text-white font-mono transition-all duration-300 ${eligible ? 'bg-teal-deep' : near_match ? 'bg-rust' : 'bg-gray-600'}`}>
              {animatedScore}%
            </span>
          </div>
        </div>

        {/* Progress Bar Meter */}
        <div className="w-full bg-paper border border-navy/15 h-2 rounded-full overflow-hidden mb-4">
          <div 
            className={`h-full transition-all duration-700 ${eligible ? 'bg-teal' : near_match ? 'bg-rust' : 'bg-gray-400'}`}
            style={{ width: `${animatedScore}%` }}
          ></div>
        </div>

        {/* Scheme Name */}
        <h3 className="font-serif font-bold text-lg text-navy mb-2 group-hover:text-rust transition-colors leading-snug">
          <Link to={`/scheme/${scheme.id}`}>{scheme.name}</Link>
        </h3>

        {/* Benefit Highlight Box */}
        <div className="bg-paper p-3 rounded-lg border border-navy/15 mb-4 group-hover:border-navy/30 transition-colors">
          <div className="font-mono text-[10.5px] text-gold-deep font-bold uppercase">{t('benefit')}</div>
          <div className="font-serif italic text-sm text-navy font-semibold">{scheme.benefit}</div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-ink-soft leading-relaxed mb-4 font-sans line-clamp-2">
          {scheme.short_description}
        </p>

        {/* Quick Criteria Highlights */}
        <div className="space-y-1.5 font-mono text-[11px] mb-4">
          {matched_criteria && matched_criteria.slice(0, 3).map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-teal-deep animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal flex-none" />
              <span className="truncate">{translateCriterion(item, t, lang)}</span>
            </div>
          ))}
          {failed_criteria && failed_criteria.slice(0, 1).map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-rust animate-fade-in">
              <XCircle className="w-3.5 h-3.5 text-rust flex-none" />
              <span className="truncate">{translateCriterion(item, t, lang)}</span>
            </div>
          ))}
        </div>

        {/* Document & Deadline Footer Pills */}
        <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-ink-soft bg-paper/60 p-2 rounded-lg border border-navy/10 mb-4">
          <span className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-navy/60" /> {docCount} {t('documentsRequired')}
          </span>
          {scheme.deadline && (
            <span className="flex items-center gap-1 text-rust font-semibold">
              <Clock className="w-3.5 h-3.5 text-rust" /> {scheme.deadline}
            </span>
          )}
        </div>

        {/* Expandable "Why Did I Match?" Drawer Toggle */}
        <button
          onClick={() => setShowWhyDrawer(!showWhyDrawer)}
          className="w-full text-left font-mono text-[11px] font-bold text-navy hover:text-gold-deep py-2 flex items-center justify-between border-t border-navy/10 transition-colors"
        >
          <span>{t('whyDidIMatch')}</span>
          {showWhyDrawer ? <ChevronUp className="w-3.5 h-3.5 text-gold-deep" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showWhyDrawer && (
          <div className="bg-paper p-3 rounded-lg border border-navy/15 my-2 space-y-2 font-mono text-[11px] animate-fade-in">
            <div className="text-[10px] text-navy font-bold uppercase tracking-wider">{t('detailedBreakdown')}</div>
            {matched_criteria?.map((item, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-teal-deep">
                <span className="text-teal font-bold">✓</span>
                <span>{translateCriterion(item, t, lang)}</span>
              </div>
            ))}
            {failed_criteria?.map((item, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-rust">
                <span className="text-rust font-bold">✕</span>
                <span>{translateCriterion(item, t, lang)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="pt-4 border-t border-navy/10 flex items-center justify-between gap-3 mt-2">
        <button
          onClick={handleSave}
          className={`btn-ghost text-xs py-2 px-3 flex items-center gap-1.5 transition-all ${
            isSaved ? 'bg-gold/15 text-gold-deep border-gold font-bold shadow-sm' : ''
          }`}
          title={t('saveToPassbook')}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-gold-deep text-gold-deep' : 'text-navy'}`} />
          <span>{isSaved ? (lang === 'hi' ? 'सहेजा गया' : 'Saved') : (lang === 'hi' ? 'सहेजें' : 'Save')}</span>
        </button>

        <Link
          to={`/scheme/${scheme.id}`}
          className="btn-primary btn-shine text-xs py-2 px-4 flex items-center gap-1.5 group-hover:bg-navy-2 transition-all"
        >
          <span>{t('viewDetails')}</span>
          <ArrowRight className="arrow w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default SchemeCard;
