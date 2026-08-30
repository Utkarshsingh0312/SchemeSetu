import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

export const FAQPage = () => {
  const { lang, t } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') }
  ];

  return (
    <div className="min-h-screen py-10 max-w-4xl mx-auto px-4 sm:px-7">
      <DisclaimerBanner />

      <div className="my-8 text-center">
        <div className="eyebrow justify-center mb-2">{t('navFaq')}</div>
        <h1 className="font-serif font-bold text-3xl text-navy">{t('faqTitle')}</h1>
        <p className="text-xs text-ink-soft mt-1">{t('faqSubtitle')}</p>
      </div>

      <div className="bg-card border border-navy/20 rounded-lg p-6 sm:p-8 space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-navy/20 border-dashed pb-4">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full text-left font-serif font-semibold text-base text-navy flex justify-between items-center py-2"
            >
              <span>{faq.q}</span>
              <span className="font-mono text-xl text-gold-deep">{openFaq === i ? '−' : '+'}</span>
            </button>
            {openFaq === i && (
              <p className="text-xs font-sans text-ink-soft leading-relaxed mt-2 pl-1">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
