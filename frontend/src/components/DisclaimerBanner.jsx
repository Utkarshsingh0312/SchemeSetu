import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const DisclaimerBanner = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-amber-50/90 border-y border-amber-200/60 py-2.5 px-4 text-center text-xs font-mono text-amber-900 flex items-center justify-center gap-2">
      <ShieldAlert className="w-4 h-4 text-rust flex-none" />
      <span>{t('civicDisclaimer')}</span>
    </div>
  );
};

export default DisclaimerBanner;
