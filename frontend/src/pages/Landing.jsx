import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEligibility } from '../context/EligibilityContext';
import { useLanguage } from '../context/LanguageContext';
import DisclaimerBanner from '../components/DisclaimerBanner';
import ScrollReveal from '../components/ScrollReveal';
import { ArrowRight, CheckCircle2, Search, Award, Shield, FileText, Check } from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { matchResults, profile } = useEligibility();
  const { lang, t } = useLanguage();

  const [openFaq, setOpenFaq] = useState(null);

  // 3D tilt ref for Hero Passbook card
  const stageRef = useRef(null);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!stageRef.current || !cardRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cardRef.current.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(0)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'rotateY(0deg) rotateX(0deg)';
    }
  };

  const handleStartEligibility = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/eligibility' } } });
    } else {
      navigate('/eligibility');
    }
  };

  const faqs = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') }
  ];

  const matchedCount = matchResults && matchResults.length > 0 ? matchResults.filter(r => r.eligible).length : 7;
  const topMatchScheme = matchResults && matchResults.length > 0 ? matchResults[0].scheme : null;

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background field radial texture */}
      <div className="field" />

      <DisclaimerBanner />

      {/* Hero Section */}
      <section className="hero py-12 md:py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-7 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="eyebrow-badge">
              <span className="dot"></span>
              <span>{lang === 'hi' ? 'सरकारी योजना खोज सरलीकृत' : 'Government scheme discovery, made simple'}</span>
            </div>

            <h1 className="hero-h1">
              {lang === 'hi' ? (
                <>
                  अपने लिए बनी<br />
                  <span className="accent">सरकारी योजनाएं खोजें</span>
                </>
              ) : (
                <>
                  Find schemes made<br />
                  <span className="accent">for you</span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-ink-soft max-w-xl font-sans leading-relaxed">
              {lang === 'hi'
                ? 'अपने बारे में कुछ प्रश्नों के उत्तर दें और उन सरकारी योजनाओं की खोज करें जिनके आप पात्र हैं — तुरंत मिलान, सरल स्पष्टीकरण।'
                : 'Answer a few questions about yourself and discover the government schemes you are actually eligible for — matched instantly, explained simply.'}
            </p>

            {/* CTA Button */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={handleStartEligibility} 
                className="btn-primary big text-base font-semibold"
              >
                <span>{t('checkEligibility')}</span>
                <svg className="arrow w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            {/* Neutral Trust Row */}
            <div className="pt-4 flex items-center gap-3 text-xs font-sans text-ink-soft">
              <div className="flex -space-x-2">
                <span className="w-6 h-6 rounded-full bg-marigold border-2 border-paper inline-block" />
                <span className="w-6 h-6 rounded-full bg-terracotta border-2 border-paper inline-block" />
                <span className="w-6 h-6 rounded-full bg-teal border-2 border-paper inline-block" />
              </div>
              <span>{lang === 'hi' ? 'पूरे भारत में नागरिकों को उनकी पात्र योजनाओं से जोड़ने हेतु निर्मित' : 'Built to make government benefits easier to discover across India'}</span>
            </div>
          </div>

          {/* Hero Right 3D Interactive Passbook Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div 
              ref={stageRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="stage w-full max-w-md"
            >
              <div className="blob" />
              
              <div ref={cardRef} className="card-stage relative">
                {/* Card Top Header */}
                <div className="card-top">
                  <span className="live">
                    <span className="pulse"></span>
                    <span>DIGITAL PASSBOOK</span>
                  </span>
                  <span className="demo-tag">{lang === 'hi' ? 'पात्रता पासबुक' : 'ELIGIBILITY LEDGER'}</span>
                </div>

                {/* Greeting & Score Ring */}
                <div className="greet">
                  <div>
                    <div className="greet-text">{lang === 'hi' ? 'नमस्ते 👋' : 'Hello 👋'}</div>
                    <div className="match-count">
                      <b>{matchedCount}</b> {lang === 'hi' ? 'संभावित पात्र योजनाएं' : 'possible matches'}
                    </div>
                  </div>
                  <div className="ring-wrap">
                    <svg width="52" height="52" viewBox="0 0 52 52">
                      <defs>
                        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#EFA845"/>
                          <stop offset="100%" stopColor="#1F4B3E"/>
                        </linearGradient>
                      </defs>
                      <circle className="ring-bg" cx="26" cy="26" r="22"/>
                      <circle className="ring-fg" cx="26" cy="26" r="22"/>
                    </svg>
                    <div className="ring-label">82%</div>
                  </div>
                </div>

                {/* Match Details Panel */}
                <div className="match-panel">
                  <div className="match-panel-top">
                    <span className="top-match-label">TOP MATCH</span>
                    <span className="match-pill">96% {lang === 'hi' ? 'मैच' : 'match'}</span>
                  </div>
                  <div className="scheme-name">
                    {topMatchScheme ? topMatchScheme.name : (lang === 'hi' ? 'उत्तर-मैट्रिक छात्रवृत्ति योजना' : 'Post-Matric Scholarship')}
                  </div>
                  <div className="scheme-amt">
                    {topMatchScheme ? topMatchScheme.benefit : (lang === 'hi' ? '₹12,000 / वर्ष · प्रत्यक्ष अंतरण' : '₹12,000 / year · direct transfer')}
                  </div>

                  <ul className="criteria">
                    <li>
                      <span className="tick">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#EAF3EE" strokeWidth="3.4"><path d="M5 13l4 4L19 7"/></svg>
                      </span>
                      <span>{lang === 'hi' ? 'राज्य मेल (उत्तर प्रदेश)' : 'State matched (Uttar Pradesh)'}</span>
                    </li>
                    <li>
                      <span className="tick">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#EAF3EE" strokeWidth="3.4"><path d="M5 13l4 4L19 7"/></svg>
                      </span>
                      <span>{lang === 'hi' ? 'व्यवसाय (छात्र)' : 'Occupation (Student)'}</span>
                    </li>
                    <li>
                      <span className="tick">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#EAF3EE" strokeWidth="3.4"><path d="M5 13l4 4L19 7"/></svg>
                      </span>
                      <span>{lang === 'hi' ? 'आय सीमा मानदंड पूर्ण' : 'Income criteria met'}</span>
                    </li>
                  </ul>
                </div>

                {/* Stamp Action Button */}
                <button onClick={handleStartEligibility} className="stamp-btn hover:opacity-95 transition-opacity cursor-pointer">
                  <Check className="w-4 h-4 text-paper" />
                  <span>{t('checkEligibility')}</span>
                </button>

                {/* Verification Stamp Overlay */}
                <div className="stamp">
                  <div className="stamp-text">
                    MATCHED
                    <span className="big">{matchedCount}</span>
                    SCHEMES
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Why SchemeSetu Section */}
      <section className="py-16 bg-card/70 border-y border-navy/15 relative z-10" id="why">
        <div className="max-w-6xl mx-auto px-4 sm:px-7">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="eyebrow justify-center mb-2">{t('navWhy')}</div>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-navy">
                {lang === 'hi' ? 'पात्र और नामांकित के बीच की दूरी को मिटाना' : 'The gap between eligible and enrolled'}
              </h2>
              <p className="text-ink-soft text-sm mt-2 leading-relaxed">
                {lang === 'hi' ? 'स्कीमसेतु नागरिकों को उनके अधिकारों और कल्याणकारी योजनाओं से पारदर्शी रूप से जोड़ता है।' : 'SchemeSetu transparently connects citizens directly to their official government rights.'}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal delay={0}>
              <div className="p-6 bg-paper rounded-xl border border-navy/15 card-hover-effect space-y-2">
                <div className="font-mono text-xs text-marigold font-bold">01</div>
                <h4 className="font-serif text-lg font-bold text-navy">{lang === 'hi' ? 'स्पष्टता' : 'Clarity'}</h4>
                <p className="text-xs text-ink-soft leading-relaxed">
                  {lang === 'hi' ? 'सरल और स्पष्ट भाषा में हर योजना की पात्रता का स्पष्टीकरण।' : 'No scheme names hidden in bureaucratic jargon. Every match explained in plain language.'}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="p-6 bg-paper rounded-xl border border-navy/15 card-hover-effect space-y-2">
                <div className="font-mono text-xs text-marigold font-bold">02</div>
                <h4 className="font-serif text-lg font-bold text-navy">{lang === 'hi' ? 'प्रमाण' : 'Proof'}</h4>
                <p className="text-xs text-ink-soft leading-relaxed">
                  {lang === 'hi' ? 'सटीक नियम मिलान दिखाता है कि आपकी कौन सी जानकारी पात्र बनाती है।' : 'Each match shows exactly which of your details qualified you — never a black-box answer.'}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="p-6 bg-paper rounded-xl border border-navy/15 card-hover-effect space-y-2">
                <div className="font-mono text-xs text-marigold font-bold">03</div>
                <h4 className="font-serif text-lg font-bold text-navy">{lang === 'hi' ? 'तैयारी' : 'Readiness'}</h4>
                <p className="text-xs text-ink-soft leading-relaxed">
                  {lang === 'hi' ? 'दस्तावेज़ सूची और अंतिम तिथि पहले ही बता दी जाती है।' : 'Document checklist and deadline given upfront, so applying on government portals is straightforward.'}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="p-6 bg-paper rounded-xl border border-navy/15 card-hover-effect space-y-2">
                <div className="font-mono text-xs text-marigold font-bold">04</div>
                <h4 className="font-serif text-lg font-bold text-navy">{lang === 'hi' ? 'पहुंच' : 'Access'}</h4>
                <p className="text-xs text-ink-soft leading-relaxed">
                  {lang === 'hi' ? 'आपकी सभी सहेजी गई और आवेदित योजनाओं की एक दृश्यमान पासबुक।' : 'A visible digital passbook of what you have claimed and what opens next.'}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How It Works Process Timeline Section */}
      <section className="py-16 relative z-10" id="how-it-works">
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <ScrollReveal delay={0}>
              <div className="bg-paper border border-navy/20 p-6 rounded-xl space-y-3 card-hover-effect">
                <div className="font-mono text-xs text-terracotta font-bold">STEP 01</div>
                <h4 className="font-serif font-bold text-lg text-navy">{lang === 'hi' ? 'अपनी प्रोफ़ाइल बनाएं' : 'Create Your Profile'}</h4>
                <p className="text-xs text-ink-soft leading-relaxed">
                  {lang === 'hi' ? 'अपने बारे में बुनियादी जनसांख्यिकी, आय, व्यवसाय और सामाजिक वर्ग दर्ज करें।' : 'Tell us about yourself once: demographics, income, occupation, and category.'}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="bg-paper border border-navy/20 p-6 rounded-xl space-y-3 card-hover-effect">
                <div className="font-mono text-xs text-terracotta font-bold">STEP 02</div>
                <h4 className="font-serif font-bold text-lg text-navy">{lang === 'hi' ? 'व्यक्तिगत मिलान प्राप्त करें' : 'Get Personalized Matches'}</h4>
                <p className="text-xs text-ink-soft leading-relaxed">
                  {lang === 'hi' ? 'स्कीमसेतु आपकी प्रोफ़ाइल की तुलना सक्रिय केंद्र और राज्य योजना नियमों से करता है।' : 'SchemeSetu compares your profile with active central and state scheme rules in real time.'}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="bg-paper border border-navy/20 p-6 rounded-xl space-y-3 card-hover-effect">
                <div className="font-mono text-xs text-terracotta font-bold">STEP 03</div>
                <h4 className="font-serif font-bold text-lg text-navy">{lang === 'hi' ? 'पात्रता का कारण समझें' : 'Understand Why'}</h4>
                <p className="text-xs text-ink-soft leading-relaxed">
                  {lang === 'hi' ? 'सटीक नियम मिलान देखें — आयु, आय सीमा, व्यवसाय या राज्य निवास नियम।' : 'See exact matched criteria — age, income ceiling, occupation, or state rules.'}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="bg-paper border border-navy/20 p-6 rounded-xl space-y-3 card-hover-effect">
                <div className="font-mono text-xs text-terracotta font-bold">STEP 04</div>
                <h4 className="font-serif font-bold text-lg text-navy">{lang === 'hi' ? 'आवेदन करें और ट्रैक करें' : 'Apply & Track'}</h4>
                <p className="text-xs text-ink-soft leading-relaxed">
                  {lang === 'hi' ? 'दस्तावेज़ चेकलिस्ट तैयार करें, आधिकारिक पोर्टल खोलें और प्रगति ट्रैक करें।' : 'Prepare document checklists, open official portals, and track progress.'}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-16 bg-card/60 border-t border-navy/15 relative z-10" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-7">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="eyebrow justify-center mb-2">{t('navFaq')}</div>
              <h2 className="font-serif font-bold text-3xl text-navy">{t('faqTitle')}</h2>
              <p className="text-xs text-ink-soft mt-1">{t('faqSubtitle')}</p>
            </div>
          </ScrollReveal>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="bg-paper border border-navy/15 rounded-xl p-5 transition-all">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left font-serif font-semibold text-base text-navy flex justify-between items-center hover:text-terracotta transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="font-mono text-xl text-marigold ml-2">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <p className="text-xs font-sans text-ink-soft leading-relaxed mt-3 pt-3 border-t border-navy/10 animate-fade-in">
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
      <section className="py-20 text-center bg-paper border-t border-navy/15 relative z-10">
        <ScrollReveal>
          <div className="max-w-xl mx-auto px-7 space-y-6">
            <h2 className="font-serif font-bold italic text-3xl sm:text-4xl text-navy">
              {lang === 'hi' ? 'आपकी पात्रता यात्रा आज ही शुरू करें।' : 'Your benefits should not depend on how well you search.'}
            </h2>
            <p className="text-xs text-ink-soft leading-relaxed">
              {lang === 'hi' ? 'उन नागरिकों से जुड़ें जो अपनी पात्रता पासबुक का निर्माण कर रहे हैं।' : 'Build your digital eligibility passbook — checked once, valid for every scheme that opens next.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={handleStartEligibility} className="btn-primary big text-base font-semibold">
                <span>{t('checkEligibility')}</span>
                <svg className="arrow w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default Landing;
