import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { useEligibility } from '../context/EligibilityContext';

export const DevicePassbookMockup = ({ isDemoActive = false }) => {
  const { profile, matchResults } = useEligibility();

  // Calculate dynamic stats from context if present, or demo preset
  const isProfilePopulated = matchResults && matchResults.length > 0;
  const topMatch = isProfilePopulated ? matchResults[0] : null;

  const schemeName = topMatch ? topMatch.scheme.name : "PM-KISAN (Kisan Samman)";
  const matchScore = topMatch ? topMatch.score : 96;
  const matchedCount = isProfilePopulated ? matchResults.filter(r => r.eligible).length : 7;
  const benefitText = topMatch ? topMatch.scheme.benefit : "₹6,000 / year direct transfer";

  return (
    <div className="device-stage relative flex justify-center z-10">
      <div className={`device transition-all duration-500 ${isDemoActive ? 'stamped ring-4 ring-teal/30' : 'stamped'}`}>
        <div className="device-screen">
          {/* Top Status */}
          <div className="d-status flex justify-between items-center text-[10px] text-ink-soft mb-2.5 font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse"></span>
              DIGITAL PASSBOOK
            </span>
            <span>{isProfilePopulated ? 'PROFILES MATCHED' : 'PASSBOOK PREVIEW'}</span>
          </div>
          
          {/* Header */}
          <div className="d-header flex justify-between items-center mb-3">
            <div>
              <div className="font-sans text-xs text-ink-soft">Hello 👋</div>
              <div className="d-title font-serif italic text-sm text-navy font-bold">
                {matchedCount} possible matches
              </div>
            </div>
            <div className="d-day text-[9.5px] font-mono bg-teal/15 text-teal-deep px-2 py-0.5 rounded border border-teal/30">
              Profile 82%
            </div>
          </div>

          {/* Top Match Highlight Box */}
          <div className="bg-card border border-navy/15 rounded-lg p-3 mb-3 font-sans">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9.5px] font-mono text-gold-deep font-bold uppercase tracking-wider">TOP MATCH</span>
              <span className="text-[10px] font-mono font-bold bg-teal-deep text-paper px-1.5 py-0.2 rounded">
                Match {matchScore}%
              </span>
            </div>

            <div className="font-serif font-bold text-xs text-navy truncate mb-1">
              {schemeName}
            </div>

            <div className="text-[10.5px] text-teal-deep font-serif italic mb-2">
              {benefitText}
            </div>

            <div className="space-y-0.5 text-[10px] font-mono text-ink-soft border-t border-navy/10 pt-1.5">
              <div className="flex items-center gap-1 text-teal font-semibold">
                <CheckCircle2 className="w-3 h-3 text-teal flex-none" /> State matched ({profile.state || 'UP'})
              </div>
              <div className="flex items-center gap-1 text-teal font-semibold">
                <CheckCircle2 className="w-3 h-3 text-teal flex-none" /> Occupation ({profile.occupation || 'Student'})
              </div>
              <div className="flex items-center gap-1 text-teal font-semibold">
                <CheckCircle2 className="w-3 h-3 text-teal flex-none" /> Income criteria met
              </div>
            </div>
          </div>

          {/* Quick Action */}
          <div className="d-rows flex flex-col font-mono text-[10.5px]">
            <Link 
              to={topMatch ? `/scheme/${topMatch.scheme.id}` : "/results"}
              className="w-full bg-navy text-paper py-2 px-3 rounded text-center font-semibold hover:bg-navy-2 transition-colors flex items-center justify-center gap-1 text-[11px]"
            >
              <span>View Scheme Details</span>
              <ArrowRight className="w-3 h-3 text-gold" />
            </Link>
          </div>

          <div className="d-toast">
            <span className="tick w-3.5 h-3.5 rounded-full bg-gold text-navy flex items-center justify-center text-[9px] font-extrabold flex-none">✓</span>
            Profile checked &amp; stamped
          </div>
        </div>

        <svg className="device-seal" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#B65C38" strokeWidth="4"/>
          <circle cx="50" cy="50" r="35" fill="none" stroke="#B65C38" strokeWidth="1.2"/>
          <text x="50" y="47" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="10" fontWeight="700" fill="#B65C38">MATCHED</text>
          <text x="50" y="60" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9" fill="#B65C38">{matchedCount} SCHEMES</text>
        </svg>
      </div>
    </div>
  );
};

export default DevicePassbookMockup;
