import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEligibility } from '../context/EligibilityContext';
import { useLanguage } from '../context/LanguageContext';
import DevicePassbookMockup from '../components/DevicePassbookMockup';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { useToast } from '../context/ToastContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();
  const { loadDemoProfile, runEligibilityCheck } = useEligibility();
  const { t } = useLanguage();
  const { addToast } = useToast();

  const [openFaq, setOpenFaq] = useState(null);
  const [isDemoActive, setIsDemoActive] = useState(false);

  const handleStartEligibility = () => {
    navigate('/eligibility');
  };

  const handleTryDemo = async () => {
    setIsDemoActive(true);
    loadDemoProfile();
    await runEligibilityCheck();
    addToast("✓ Demo profile loaded: Ramesh Kumar (Age 22, UP, Student)", "success");
    setTimeout(() => {
      navigate('/results');
    }, 600);
  };

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
    <div className="relative">
      <DisclaimerBanner />

      {/* Hero Section */}
      <section className="hero py-12 md:py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-7 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-teal-deep bg-teal/10 border border-teal/30 px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-teal animate-ping"></span>
              GOVERNMENT SCHEME DISCOVERY PLATFORM
            </div>

            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-navy leading-[1.08] tracking-tight">
              Find the schemes<br />
              <em className="italic font-normal text-rust">you qualify for.</em>
            </h1>

            <p className="text-base sm:text-lg text-ink-soft max-w-xl font-sans leading-relaxed">
              Explore government schemes from Central and State/UT governments. SchemeSetu finds relevant government schemes, explains why you match, and guides you to the next step.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={handleStartEligibility} 
                className="btn-primary big text-base font-semibold"
              >
                <span>Check My Eligibility</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={handleTryDemo} 
                className="btn-ghost big text-base font-semibold text-teal-deep border-teal/40 hover:bg-teal/10"
              >
                <Sparkles className="w-4 h-4 text-gold-deep" />
                <span>Try Demo Profile</span>
              </button>
            </div>

            {/* Hero Trust Badge */}
            <div className="pt-4 space-y-1">
              <div className="font-mono text-xs font-bold text-navy">
                Find schemes made for you
              </div>
              <p className="font-mono text-xs text-ink-soft">
                Answer a few questions and discover government schemes you may be eligible for.
              </p>
            </div>
          </div>

          {/* Hero Right Dynamic Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <DevicePassbookMockup isDemoActive={isDemoActive} />
          </div>
        </div>
      </section>

      {/* How It Works Timeline Section */}
      <section className="py-16 bg-card border-y border-navy/15" id="ritual">
        <div className="max-w-6xl mx-auto px-4 sm:px-7">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="eyebrow justify-center mb-2">How It Works</div>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-navy">Four steps from eligible to enrolled</h2>
            <p className="text-ink-soft text-sm mt-2">Build your digital passbook once — SchemeSetu evaluates your criteria automatically.</p>
          </div>

          {/* Process Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="bg-paper border border-navy/20 p-6 rounded-md space-y-3 relative hover:-translate-y-1 transition-transform">
              <div className="font-mono text-xs text-gold-deep font-bold">01</div>
              <h4 className="font-serif font-bold text-lg text-navy">Create Your Profile</h4>
              <p className="text-xs text-ink-soft leading-relaxed">Tell us about yourself once. Basic demographics, income, occupation, and social category.</p>
            </div>

            <div className="bg-paper border border-navy/20 p-6 rounded-md space-y-3 relative hover:-translate-y-1 transition-transform">
              <div className="font-mono text-xs text-gold-deep font-bold">02</div>
              <h4 className="font-serif font-bold text-lg text-navy">Get Personalized Matches</h4>
              <p className="text-xs text-ink-soft leading-relaxed">SchemeSetu compares your profile with active central and state scheme criteria in real time.</p>
            </div>

            <div className="bg-paper border border-navy/20 p-6 rounded-md space-y-3 relative hover:-translate-y-1 transition-transform">
              <div className="font-mono text-xs text-gold-deep font-bold">03</div>
              <h4 className="font-serif font-bold text-lg text-navy">Understand Why</h4>
              <p className="text-xs text-ink-soft leading-relaxed">See exact matched criteria — age, income ceiling, occupation, or state residency rules.</p>
            </div>

            <div className="bg-paper border border-navy/20 p-6 rounded-md space-y-3 relative hover:-translate-y-1 transition-transform">
              <div className="font-mono text-xs text-gold-deep font-bold">04</div>
              <h4 className="font-serif font-bold text-lg text-navy">Apply &amp; Track</h4>
              <p className="text-xs text-ink-soft leading-relaxed">Prepare document checklists, open official portals, and track progress from application to approval.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why SchemeSetu */}
      <section className="py-16 bg-card border-b border-navy/15" id="why">
        <div className="max-w-6xl mx-auto px-4 sm:px-7">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="eyebrow justify-center mb-2">Why SchemeSetu</div>
            <h2 className="font-serif font-bold text-3xl text-navy">The gap between eligible and enrolled</h2>
            <p className="text-ink-soft text-sm mt-2">Four things stand between most citizens and the benefits they already qualify for. SchemeSetu closes all four.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-paper rounded border border-navy/15">
              <div className="font-mono text-xs text-gold-deep font-bold mb-2">01</div>
              <h4 className="font-serif text-lg font-semibold text-navy mb-2">Clarity</h4>
              <p className="text-xs text-ink-soft leading-relaxed">No scheme names in bureaucratic jargon. Every match explained in plain language.</p>
            </div>
            <div className="p-6 bg-paper rounded border border-navy/15">
              <div className="font-mono text-xs text-gold-deep font-bold mb-2">02</div>
              <h4 className="font-serif text-lg font-semibold text-navy mb-2">Proof</h4>
              <p className="text-xs text-ink-soft leading-relaxed">Each match shows exactly which of your details qualified you — never a black-box answer.</p>
            </div>
            <div className="p-6 bg-paper rounded border border-navy/15">
              <div className="font-mono text-xs text-gold-deep font-bold mb-2">03</div>
              <h4 className="font-serif text-lg font-semibold text-navy mb-2">Readiness</h4>
              <p className="text-xs text-ink-soft leading-relaxed">Document checklist and deadline given upfront, so applying is a formality.</p>
            </div>
            <div className="p-6 bg-paper rounded border border-navy/15">
              <div className="font-mono text-xs text-gold-deep font-bold mb-2">04</div>
              <h4 className="font-serif text-lg font-semibold text-navy mb-2">Access</h4>
              <p className="text-xs text-ink-soft leading-relaxed">A visible passbook of what you've claimed and what opens next — valid for years.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-7">
          <div className="text-center mb-12">
            <div className="eyebrow justify-center mb-2">FAQ</div>
            <h2 className="font-serif font-bold text-3xl text-navy">Questions, answered</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-navy/20 border-dashed pb-4">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left font-serif font-semibold text-base text-navy flex justify-between items-center py-2 hover:text-gold-deep transition-colors"
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
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center bg-card border-t border-navy/15">
        <div className="max-w-xl mx-auto px-7 space-y-6">
          <h2 className="font-serif font-bold italic text-3xl sm:text-4xl text-navy">Your day-one starts now.</h2>
          <p className="text-xs text-ink-soft leading-relaxed">
            Join citizens building their eligibility passbook — checked once, valid for every scheme that opens next.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={handleStartEligibility} className="btn-primary big text-sm font-semibold">
              Check My Eligibility Free →
            </button>
            <button onClick={handleTryDemo} className="btn-ghost big text-sm font-semibold text-teal-deep">
              Try Demo Profile →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
