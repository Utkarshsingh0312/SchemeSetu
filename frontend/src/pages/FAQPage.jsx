import React, { useState } from 'react';
import DisclaimerBanner from '../components/DisclaimerBanner';

export const FAQPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "Is my information shared with anyone?",
      a: "No. Your profile is used only to check eligibility against the scheme database and is never sold or shared with third parties."
    },
    {
      q: "Do I need documents to start?",
      a: "No. The first check only needs a few facts about you — age, income, state, occupation. Documents are only needed once you're ready to apply."
    },
    {
      q: "How current is the scheme database?",
      a: "Schemes and deadlines are reviewed regularly against official portals. Always confirm the final details on the scheme's official application page."
    },
    {
      q: "Is SchemeSetu free?",
      a: "Yes, checking your eligibility and building your passbook is free, and always will be."
    },
    {
      q: "Is this an official government service?",
      a: "No. SchemeSetu is an independent tool that helps you find and understand schemes; applications happen on each scheme's official government portal."
    }
  ];

  return (
    <div className="min-h-screen py-10 max-w-4xl mx-auto px-4 sm:px-7">
      <DisclaimerBanner />

      <div className="my-8 text-center">
        <div className="eyebrow justify-center mb-2">FAQ</div>
        <h1 className="font-serif font-bold text-3xl text-navy">Frequently Asked Questions</h1>
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
