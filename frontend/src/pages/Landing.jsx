import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEligibility } from '../context/EligibilityContext';
import { useLanguage } from '../context/LanguageContext';
import DevicePassbookMockup from '../components/DevicePassbookMockup';
import DisclaimerBanner from '../components/DisclaimerBanner';
import ScrollReveal from '../components/ScrollReveal';
import { useToast } from '../context/ToastContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();
  const { loadDemoProfile, runEligibilityCheck } = useEligibility();
  const { lang, t } = useLanguage();
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
    addToast(lang === 'hi' ? "✓ डेमो प्रोफ़ाइल लोड की गई: रमेश कुमार (22 वर्ष, यूपी, छात्र)" : "✓ Demo profile loaded: Ramesh Kumar (Age 22, UP, Student)", "success");
    setTimeout(() => {
      navigate('/results');
    }, 600);
  };

  const faqs = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') }
  ];

  return (
    <div className="relative">
      <DisclaimerBanner />

      {/* Hero Section */}
      <section className="hero py-12 md:py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-7 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-teal-deep bg-teal/10 border border-teal/30 px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-teal animate-ping"></span>
              {lang === 'hi' ? 'सरकारी योजना खोज मंच' : 'GOVERNMENT SCHEME DISCOVERY PLATFORM'}
            </div>

            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-navy leading-[1.08] tracking-tight">
              {t('heroTitle')}<br />
              <em className="italic font-normal text-rust">{t('heroTitle')}</em>
            </h1>

            <p className="text-base sm:text-lg text-ink-soft max-w-xl font-sans leading-relaxed">
              {t('heroLede')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={handleStartEligibility} 
                className="btn-primary big text-base font-semibold"
              >
                <span>{t('checkEligibility')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={handleTryDemo} 
                className="btn-ghost big text-base font-semibold text-teal-deep border-teal/40 hover:bg-teal/10"
              >
                <Sparkles className="w-4 h-4 text-gold-deep" />
                <span>{t('tryDemo')}</span>
              </button>
            </div>

            {/* Hero Trust Badge */}
            <div className="pt-4 space-y-1">
              <div className="font-mono text-xs font-bold text-navy">
                {t('heroTitle')}
              </div>
              <p className="font-mono text-xs text-ink-soft">
                {t('heroSubtext')}
              </p>
            </div>
          </div>

          {/* Hero Right Dynamic Mockup */}
          <div className="lg:col-span-5 flex justify-center animate-fade-in stagger-2">
            <DevicePassbookMockup isDemoActive={isDemoActive} />
          </div>
        </div>
      </section>

      {/* How It Works Timeline Section */}
      <section className="py-16 bg-card border-y border-navy/15" id="ritual">
        <div className="max-w-6xl mx-auto px-4 sm:px-7">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="eyebrow justify-center mb-2">{t('navRitual')}</div>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-navy">
                {lang === 'hi' ? 'पात्रता से नामांकन तक चार आसान चरण' : 'Four steps from eligible to enrolled'}
              </h2>
              <p className="text-ink-soft text-sm mt-2">
                {lang === 'hi' ? 'अपनी डिजिटल पासबुक एक बार बनाएं — स्कीमसेतु स्वतः आपके मानदंडों का मूल्यांकन करता है।' : 'Build your digital passbook once — SchemeSetu evaluates your criteria automatically.'}
              </p>
            </div>
          </ScrollReveal>

          {/* Process Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <ScrollReveal delay={0}>
              <div className="bg-paper border border-navy/20 p-6 rounded-md space-y-3 relative card-hover-effect">
                <div className="font-mono text-xs text-gold-deep font-bold">01</div>
                <h4 className="font-serif font-bold text-lg text-navy">{lang === 'hi' ? 'अपनी प्रोफ़ाइल बनाएं' : 'Create Your Profile'}</h4>
                <p className="text-xs text-ink-soft leading-relaxed">{lang === 'hi' ? 'अपने बारे में बुनियादी जनसांख्यिकी, आय, व्यवसाय और सामाजिक वर्ग दर्ज करें।' : 'Tell us about yourself once. Basic demographics, income, occupation, and social category.'}</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="bg-paper border border-navy/20 p-6 rounded-md space-y-3 relative card-hover-effect">
                <div className="font-mono text-xs text-gold-deep font-bold">02</div>
                <h4 className="font-serif font-bold text-lg text-navy">{lang === 'hi' ? 'व्यक्तिगत मिलान प्राप्त करें' : 'Get Personalized Matches'}</h4>
                <p className="text-xs text-ink-soft leading-relaxed">{lang === 'hi' ? 'स्कीमसेतु वास्तविक समय में आपकी प्रोफ़ाइल की तुलना सक्रिय केंद्र और राज्य योजना नियमों से करता है।' : 'SchemeSetu compares your profile with active central and state scheme criteria in real time.'}</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="bg-paper border border-navy/20 p-6 rounded-md space-y-3 relative card-hover-effect">
                <div className="font-mono text-xs text-gold-deep font-bold">03</div>
                <h4 className="font-serif font-bold text-lg text-navy">{lang === 'hi' ? 'पात्रता का कारण समझें' : 'Understand Why'}</h4>
                <p className="text-xs text-ink-soft leading-relaxed">{lang === 'hi' ? 'सटीक नियम मिलान देखें — आयु, आय सीमा, व्यवसाय या राज्य निवास नियम।' : 'See exact matched criteria — age, income ceiling, occupation, or state residency rules.'}</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="bg-paper border border-navy/20 p-6 rounded-md space-y-3 relative card-hover-effect">
                <div className="font-mono text-xs text-gold-deep font-bold">04</div>
                <h4 className="font-serif font-bold text-lg text-navy">{lang === 'hi' ? 'आवेदन करें और ट्रैक करें' : 'Apply & Track'}</h4>
                <p className="text-xs text-ink-soft leading-relaxed">{lang === 'hi' ? 'दस्तावेज़ चेकलिस्ट तैयार करें, आधिकारिक पोर्टल खोलें और प्रगति ट्रैक करें।' : 'Prepare document checklists, open official portals, and track progress from application to approval.'}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Why SchemeSetu */}
      <section className="py-16 bg-card border-b border-navy/15" id="why">
        <div className="max-w-6xl mx-auto px-4 sm:px-7">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="eyebrow justify-center mb-2">{t('navWhy')}</div>
              <h2 className="font-serif font-bold text-3xl text-navy">{lang === 'hi' ? 'पात्र और नामांकित के बीच की दूरी को मिटाना' : 'The gap between eligible and enrolled'}</h2>
              <p className="text-ink-soft text-sm mt-2">{lang === 'hi' ? 'स्कीमसेतु नागरिकों को उनके अधिकारों और कल्याणकारी योजनाओं से पारदर्शी रूप से जोड़ता है।' : 'SchemeSetu transparently connects citizens directly to their official government rights.'}</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal delay={0}>
              <div className="p-6 bg-paper rounded border border-navy/15 card-hover-effect">
                <div className="font-mono text-xs text-gold-deep font-bold mb-2">01</div>
                <h4 className="font-serif text-lg font-semibold text-navy mb-2">{lang === 'hi' ? 'स्पष्टता' : 'Clarity'}</h4>
                <p className="text-xs text-ink-soft leading-relaxed">{lang === 'hi' ? 'सरल और स्पष्ट भाषा में हर योजना की पात्रता का स्पष्टीकरण।' : 'No scheme names in bureaucratic jargon. Every match explained in plain language.'}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="p-6 bg-paper rounded border border-navy/15 card-hover-effect">
                <div className="font-mono text-xs text-gold-deep font-bold mb-2">02</div>
                <h4 className="font-serif text-lg font-semibold text-navy mb-2">{lang === 'hi' ? 'प्रमाण' : 'Proof'}</h4>
                <p className="text-xs text-ink-soft leading-relaxed">{lang === 'hi' ? 'सटीक नियम मिलान दिखाता है कि आपकी कौन सी जानकारी पात्र बनाती है।' : 'Each match shows exactly which of your details qualified you — never a black-box answer.'}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="p-6 bg-paper rounded border border-navy/15 card-hover-effect">
                <div className="font-mono text-xs text-gold-deep font-bold mb-2">03</div>
                <h4 className="font-serif text-lg font-semibold text-navy mb-2">{lang === 'hi' ? 'तैयारी' : 'Readiness'}</h4>
                <p className="text-xs text-ink-soft leading-relaxed">{lang === 'hi' ? 'दस्तावेज़ सूची और अंतिम तिथि पहले ही बता दी जाती है।' : 'Document checklist and deadline given upfront, so applying is a formality.'}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="p-6 bg-paper rounded border border-navy/15 card-hover-effect">
                <div className="font-mono text-xs text-gold-deep font-bold mb-2">04</div>
                <h4 className="font-serif text-lg font-semibold text-navy mb-2">{lang === 'hi' ? 'पहुंच' : 'Access'}</h4>
                <p className="text-xs text-ink-soft leading-relaxed">{lang === 'hi' ? 'आपकी सभी सहेजी गई और आवेदि‍त योजनाओं की एक दृश्यमान पासबुक।' : 'A visible passbook of what you\'ve claimed and what opens next — valid for years.'}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-7">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="eyebrow justify-center mb-2">{t('navFaq')}</div>
              <h2 className="font-serif font-bold text-3xl text-navy">{t('faqTitle')}</h2>
            </div>
          </ScrollReveal>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="border-b border-navy/20 border-dashed pb-4">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left font-serif font-semibold text-base text-navy flex justify-between items-center py-2 hover:text-gold-deep transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="font-mono text-xl text-gold-deep">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <p className="text-xs font-sans text-ink-soft leading-relaxed mt-2 pl-1 animate-fade-in">
                      {faq.a}
                    </p>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center bg-card border-t border-navy/15">
        <ScrollReveal>
          <div className="max-w-xl mx-auto px-7 space-y-6">
            <h2 className="font-serif font-bold italic text-3xl sm:text-4xl text-navy">
              {lang === 'hi' ? 'आपकी पात्रता यात्रा आज ही शुरू करें।' : 'Your day-one starts now.'}
            </h2>
            <p className="text-xs text-ink-soft leading-relaxed">
              {lang === 'hi' ? 'उन नागरिकों से जुड़ें जो अपनी पात्रता पासबुक का निर्माण कर रहे हैं।' : 'Join citizens building their eligibility passbook — checked once, valid for every scheme that opens next.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={handleStartEligibility} className="btn-primary big text-sm font-semibold">
                {t('checkEligibility')}
              </button>
              <button onClick={handleTryDemo} className="btn-ghost big text-sm font-semibold text-teal-deep">
                {t('tryDemo')} →
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default Landing;
