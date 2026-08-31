import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Heart, ArrowRight, FileText, Clock, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { passbookAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { translateCriterion } from '../utils/translateCriterion';
import MatchScoreTooltip from './MatchScoreTooltip';

export const SchemeCard = ({ matchResult, onSaveSuccess, index = 0 }) => {
  const { scheme, eligible, score, matched_criteria, failed_criteria, near_match } = matchResult;
  const { user } = useAuth();
  const { addToast } = useToast();
  const { lang, t } = useLanguage();
  
  const [isSaved, setIsSaved] = useState(false);
  const [showWhyDrawer, setShowWhyDrawer] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, opacity: 0 });

  useEffect(() => {
    let start = null;
    const duration = 900;
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

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    setMousePos(prev => ({ ...prev, opacity: 0 }));
  };

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
  const staggerDelay = `${index * 120 + 80}ms`;

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-[#FBF8F1] border border-navy/12 p-6 rounded-[22px] shadow-[0_12px_35px_rgba(22,33,60,0.08)] hover:-translate-y-[6px] hover:border-[#2C6350]/35 hover:shadow-[0_20px_45px_rgba(22,33,60,0.14)] transition-all duration-300 flex flex-col justify-between relative group animate-in fade-in slide-in-from-bottom-4 font-sans overflow-hidden"
      style={{ animationDelay: staggerDelay }}
    >
      {/* Top Colored Accent Bar */}
      <div className={`w-full h-1 absolute top-0 left-0 transition-opacity duration-300 ${
        index % 2 === 0 
          ? 'bg-gradient-to-r from-[#2C6350] via-marigold to-transparent' 
          : 'bg-gradient-to-r from-marigold via-[#2C6350] to-transparent'
      }`} />

      {/* Subtle Cursor Spotlight Glow */}
      <div 
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 hidden sm:block"
        style={{
          opacity: mousePos.opacity,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(44, 99, 80, 0.07), transparent 80%)`
        }}
      />

      <div className="relative z-10">
        {/* Category, Subcategory & Verified Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2C6350] bg-[#E7F1EB] border border-[#2C6350]/25 px-2.5 py-0.5 rounded-full font-sans group-hover:scale-[1.03] transition-transform">
              {scheme.display_category || scheme.category}
            </span>
            {scheme.sub_category && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B7975A] bg-[#F4E9D0] border border-[#B7975A]/30 px-2.5 py-0.5 rounded-full font-sans group-hover:scale-[1.03] transition-transform">
                {scheme.sub_category}
              </span>
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E7F1EB] text-[#2C6350] border border-[#2C6350]/25 px-2 py-0.5 rounded-md flex items-center gap-1 font-sans">
              <Check className="w-3 h-3 text-[#2C6350] animate-in zoom-in duration-300" />
              <span>{t('verified')}</span>
            </span>
          </div>

          {/* Profile Match Score Meter */}
          <div className="flex items-center gap-1.5 text-xs font-bold font-sans">
            <span className="text-[#5C5643] text-[11px]">{t('profileMatch')}</span>
            <MatchScoreTooltip />
            <span className={`px-2.5 py-0.5 rounded-lg text-white font-sans transition-all duration-300 shadow-xs ${
              eligible 
                ? 'bg-[#2C6350] shadow-[0_0_14px_rgba(44,99,80,0.30)]' 
                : near_match 
                ? 'bg-[#C45B38]' 
                : 'bg-navy/60'
            }`}>
              {animatedScore}%
            </span>
          </div>
        </div>

        {/* Progress Bar Meter */}
        <div className="w-full bg-[#E5E2D8] h-1.5 rounded-full overflow-hidden mb-4">
          <div 
            className={`h-full transition-all duration-700 ease-out rounded-full ${
              eligible ? 'bg-[#2C6350] shadow-[0_0_8px_rgba(44,99,80,0.4)]' : near_match ? 'bg-[#C45B38]' : 'bg-navy/40'
            }`}
            style={{ width: `${animatedScore}%` }}
          />
        </div>

        {/* Scheme Name (Fraunces Serif Title) */}
        <h3 className="font-serif font-bold text-[21px] sm:text-[24px] text-navy mb-2.5 group-hover:text-[#2C6350] transition-colors leading-snug">
          <Link to={`/scheme/${scheme.id}`}>{scheme.name}</Link>
        </h3>

        {/* Benefit Highlight Box */}
        <div className="bg-[#F4E9D0] border-l-4 border-l-[#B7975A] border border-[#B7975A]/20 p-3.5 rounded-[14px] mb-4 group-hover:bg-[#F4E9D0]/90 transition-colors">
          <div className="text-[10.5px] font-bold text-[#B7975A] uppercase tracking-wider font-sans">{t('benefit')}</div>
          <div className="font-serif italic text-sm sm:text-base text-navy font-semibold mt-0.5">{scheme.benefit}</div>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-[13px] text-[#5C5643] leading-relaxed mb-4 font-sans line-clamp-2">
          {scheme.short_description}
        </p>

        {/* Quick Criteria Highlights */}
        <div className="space-y-1.5 text-xs mb-4 font-sans">
          {matched_criteria && matched_criteria.slice(0, 3).map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[#2C6350] font-medium hover:translate-x-[3px] transition-transform duration-200">
              <span className="w-4 h-4 rounded-full bg-[#E7F1EB] text-[#2C6350] flex items-center justify-center font-bold text-[10px] flex-none">✓</span>
              <span className="truncate">{translateCriterion(item, t, lang)}</span>
            </div>
          ))}
          {failed_criteria && failed_criteria.slice(0, 1).map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[#C45B38] font-medium hover:translate-x-[3px] transition-transform duration-200">
              <XCircle className="w-4 h-4 text-[#C45B38] flex-none" />
              <span className="truncate">{translateCriterion(item, t, lang)}</span>
            </div>
          ))}
        </div>

        {/* Document & Deadline Footer Pills */}
        <div className="flex flex-wrap items-center justify-between text-xs text-[#5C5643] bg-[#F3EEDF]/60 hover:bg-[#F3EEDF] px-3 py-2 rounded-xl border border-navy/10 mb-4 font-sans transition-colors cursor-pointer group/pill">
          <span className="flex items-center gap-1.5 font-medium group-hover/pill:text-navy">
            <FileText className="w-3.5 h-3.5 text-navy/60 group-hover/pill:scale-110 transition-transform" /> {docCount} {t('documentsRequired')}
          </span>
          {scheme.deadline ? (
            <span className="flex items-center gap-1 text-[#C45B38] font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#C45B38] group-hover/pill:rotate-45 transition-transform" /> {scheme.deadline}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[#C45B38] font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#C45B38] group-hover/pill:rotate-45 transition-transform" /> Open scheme
            </span>
          )}
        </div>

        {/* Expandable "Why Did I Match?" Accordion Toggle */}
        <button
          onClick={() => setShowWhyDrawer(!showWhyDrawer)}
          className="w-full text-left text-xs font-bold text-navy hover:text-[#2C6350] py-2 flex items-center justify-between border-t border-navy/10 transition-colors cursor-pointer font-sans"
        >
          <span className="hover:translate-x-0.5 transition-transform">{t('whyDidIMatch')}</span>
          {showWhyDrawer ? (
            <ChevronUp className="w-4 h-4 text-[#2C6350] transition-transform duration-200" />
          ) : (
            <ChevronDown className="w-4 h-4 text-navy/60 transition-transform duration-200" />
          )}
        </button>

        {showWhyDrawer && (
          <div className="bg-[#FBF8F1] p-3.5 rounded-xl border border-navy/12 my-2 space-y-2 text-xs font-sans animate-in fade-in duration-200">
            <div className="text-[10px] font-bold text-navy uppercase tracking-wider">{t('detailedBreakdown')}</div>
            {matched_criteria?.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[#2C6350] font-medium hover:translate-x-[2px] transition-transform">
                <span className="text-[#2C6350] font-bold">✓</span>
                <span>{translateCriterion(item, t, lang)}</span>
              </div>
            ))}
            {failed_criteria?.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[#C45B38] font-medium hover:translate-x-[2px] transition-transform">
                <span className="text-[#C45B38] font-bold">✕</span>
                <span>{translateCriterion(item, t, lang)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="pt-4 border-t border-navy/10 flex items-center justify-between gap-3 mt-2 font-sans relative z-10">
        <button
          onClick={handleSave}
          className={`h-[52px] px-4 rounded-xl border border-navy/16 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
            isSaved 
              ? 'bg-marigold/15 text-marigold border-marigold shadow-xs scale-105' 
              : 'bg-[#FBF8F1] text-navy hover:border-[#2C6350] hover:bg-[#E7F1EB]/40'
          }`}
          title={t('saveToPassbook')}
        >
          <Heart className={`w-4 h-4 transition-transform duration-200 ${isSaved ? 'fill-marigold text-marigold scale-125' : 'text-navy'}`} />
          <span>{isSaved ? (lang === 'hi' ? 'सहेजा गया' : 'Saved') : (lang === 'hi' ? 'सहेजें' : 'Save')}</span>
        </button>

        <Link
          to={`/scheme/${scheme.id}`}
          className="flex-1 h-[52px] bg-[#16213C] text-[#FBF8F1] rounded-xl font-bold text-xs hover:bg-[#202F52] hover:-translate-y-[1px] active:scale-[0.98] shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5 group btn-shine cursor-pointer"
        >
          <span>{t('viewDetails')}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default SchemeCard;
