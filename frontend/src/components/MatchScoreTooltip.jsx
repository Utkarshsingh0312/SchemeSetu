import React, { useState } from 'react';
import { HelpCircle, Info } from 'lucide-react';

export const MatchScoreTooltip = () => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="text-ink-soft hover:text-navy transition-colors focus:outline-none"
        aria-label="Profile Match Score Information"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {show && (
        <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-navy text-paper text-[11px] font-sans leading-snug rounded shadow-2xl z-50 border border-gold/30">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-gold flex-none mt-0.5" />
            <div>
              <b className="font-mono text-[10.5px] uppercase text-gold block mb-1">Profile Match Score</b>
              This score compares your profile with the scheme criteria available in SchemeSetu. Based on the information you provided. Final eligibility must be verified on the official government portal.
            </div>
          </div>
          <div className="absolute right-3 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-navy"></div>
        </div>
      )}
    </div>
  );
};

export default MatchScoreTooltip;
