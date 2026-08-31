import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import DisclaimerBanner from '../components/DisclaimerBanner';
import ScrollReveal from '../components/ScrollReveal';
import { ArrowRight, Lock, Shield, Check, CheckCircle2, FileText, ChevronDown } from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  const [openFaq, setOpenFaq] = useState(null);

  // 3D Tilt Ref for Hero Card
  const stageRef = useRef(null);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!stageRef.current || !cardRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cardRef.current.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'rotateY(0deg) rotateX(0deg)';
    }
  };

  // 1. Check My Eligibility Button Action
  const handleCheckEligibility = () => {
    if (user) {
      navigate('/eligibility');
    } else {
      navigate('/login', { state: { from: { pathname: '/eligibility' } } });
    }
  };

  // 2. Login Button Action
  const handleLogin = () => {
    if (user) {
      navigate('/eligibility');
    } else {
      navigate('/login');
    }
  };

  const faqs = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') }
  ];

  const genericSchemes = [
    { name: "PM-KISAN", category: lang === 'hi' ? "किसान सहायता" : "Farmer support" },
    { name: "Ayushman Bharat", category: lang === 'hi' ? "स्वास्थ्य बीमा" : "Health coverage" },
    { name: "PMAY", category: lang === 'hi' ? "आवास सहायता" : "Housing support" },
    { name: "National Scholarship", category: lang === 'hi' ? "छात्र प्रोत्साहन" : "Student support" },
    { name: "Ujjwala Yojana", category: lang === 'hi' ? "एलपीजी कनेक्शन" : "LPG support" },
    { name: "Skill India", category: lang === 'hi' ? "कौशल विकास" : "Skill development" },
    { name: "Atal Pension Yojana", category: lang === 'hi' ? "पेंशन सुरक्षा" : "Pension support" },
    { name: "Stand-Up India", category: lang === 'hi' ? "उद्यमिता ऋण" : "Business support" }
  ];

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background Field Texture */}
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
                ? 'अपने बारे में कुछ प्रश्नों के उत्तर दें और उन सरकारी योजनाओं की खोज करें जिनके आप पात्र हैं — आपकी प्रोफ़ाइल से मेल खाती और सरल स्पष्टीकरण।'
                : 'Answer a few questions about yourself and discover the government schemes you are actually eligible for — matched to your profile and explained simply.'}
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={handleCheckEligibility} 
                className="btn-primary big text-base font-semibold"
                type="button"
              >
                <span>{t('checkEligibility')}</span>
                <svg className="arrow w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </button>

              <button 
                onClick={handleLogin} 
                className="btn-secondary big text-base font-semibold"
                type="button"
              >
                <span>{user ? (lang === 'hi' ? 'मेरी पासबुक' : 'My Passbook') : (lang === 'hi' ? 'लॉगिन करें' : 'Login to Continue')}</span>
              </button>
            </div>

            {/* Trust Assurance Row */}
            <div className="pt-4 flex items-center gap-3 text-xs font-sans text-ink-soft">
              <div className="flex -space-x-2">
                <span className="w-6 h-6 rounded-full bg-marigold border-2 border-paper inline-block" />
                <span className="w-6 h-6 rounded-full bg-terracotta border-2 border-paper inline-block" />
                <span className="w-6 h-6 rounded-full bg-teal border-2 border-paper inline-block" />
              </div>
              <span>{lang === 'hi' ? 'अपनी निजी पात्रता प्रोफ़ाइल के आधार पर सुरक्षित रूप से योजनाओं की खोज करें' : 'Securely discover schemes based on your own eligibility profile'}</span>
            </div>
          </div>

          {/* Hero Right Secure Product Discovery Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div 
              ref={stageRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="stage w-full max-w-md"
            >
              <div className="blob" />
              
              <div ref={cardRef} className="card-stage relative">
                {/* Card Header */}
                <div className="card-top">
                  <span className="live">
                    <span className="pulse"></span>
                    <span>PERSONALIZED DISCOVERY</span>
                  </span>
                  <span className="demo-tag">SECURE ACCESS</span>
                </div>

                {/* Card Title & Description */}
                <div className="mt-5">
                  <div className="font-serif font-semibold text-2xl text-navy leading-snug">
                    {lang === 'hi' ? (
                      <>आपकी योजनाएं, <span className="italic text-terracotta">आपकी प्रोफ़ाइल।</span></>
                    ) : (
                      <>Your benefits, <span className="italic text-terracotta">your profile.</span></>
                    )}
                  </div>
                  <p className="text-xs text-ink-soft mt-2 leading-relaxed font-sans">
                    {lang === 'hi' 
                      ? 'स्कीमसेतु आपकी जानकारी की तुलना सरकारी कल्याणकारी योजनाओं से सुरक्षित रूप से करता है ताकि आप उन लाभों की खोज कर सकें जिनके आप पात्र हैं।' 
                      : 'SchemeSetu securely matches your information with government welfare schemes so you can discover the benefits you may be eligible for.'}
                  </p>
                </div>

                {/* Login Gate Box */}
                <div className="match-panel my-5 bg-gradient-to-b from-white to-[#FBF7EE] border border-navy/15 rounded-xl p-4">
                  <div className="w-10 h-10 rounded-lg bg-teal/10 text-teal flex items-center justify-center mb-3">
                    <Lock className="w-5 h-5 text-teal" />
                  </div>
                  <div className="font-sans font-bold text-sm text-navy">
                    {lang === 'hi' ? 'अपनी योजनाओं की खोज के लिए लॉगिन करें' : 'Login to discover your schemes'}
                  </div>
                  <p className="text-[12px] text-ink-soft mt-1 leading-relaxed">
                    {lang === 'hi'
                      ? 'आपके पात्रता परिणाम आपकी प्रोफ़ाइल के अनुसार व्यक्तिगत हैं। अपनी जानकारी और सिफारिशों को सुरक्षित रखने के लिए पहले साइन इन करें।'
                      : 'Your eligibility results are personalized to your profile. Sign in first to keep your information and recommendations secure.'}
                  </p>

                  {/* 3 Step Overview */}
                  <div className="criteria mt-4 pt-3 border-t border-dashed border-navy/15 space-y-2">
                    <div className="flex items-center gap-2.5 text-xs text-navy font-sans">
                      <span className="w-5 h-5 rounded-full bg-teal text-paper text-[10px] font-extrabold flex items-center justify-center flex-none">1</span>
                      <span>{lang === 'hi' ? <>अपनी <strong>नागरिक प्रोफ़ाइल</strong> बनाएं</> : <>Create your <strong>citizen profile</strong></>}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-navy font-sans">
                      <span className="w-5 h-5 rounded-full bg-teal text-paper text-[10px] font-extrabold flex items-center justify-center flex-none">2</span>
                      <span>{lang === 'hi' ? <>व्यक्तिगत <strong>पात्रता मिलान</strong> प्राप्त करें</> : <>Get <strong>personalized matches</strong></>}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-navy font-sans">
                      <span className="w-5 h-5 rounded-full bg-teal text-paper text-[10px] font-extrabold flex items-center justify-center flex-none">3</span>
                      <span>{lang === 'hi' ? <>लाभ और <strong>आवेदन मार्गदर्शिका</strong> समझें</> : <>Understand <strong>benefits & application</strong></>}</span>
                    </div>
                  </div>
                </div>

                {/* Card Login Button */}
                <button 
                  onClick={handleLogin} 
                  className="stamp-btn hover:opacity-95 transition-all cursor-pointer w-full py-3.5"
                  type="button"
                >
                  <span>{user ? (lang === 'hi' ? 'पात्रता जांचें →' : 'Check Eligibility →') : (lang === 'hi' ? 'लॉगिन / खाता बनाएं →' : 'Login / Create Account →')}</span>
                </button>

                {/* Security Badges */}
                <div className="flex items-center justify-center gap-4 mt-3.5 text-[11px] text-ink-soft font-sans">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-teal" /> {lang === 'hi' ? 'सुरक्षित प्रोफ़ाइल' : 'Secure profile'}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-teal" /> {lang === 'hi' ? 'व्यक्तिगत' : 'Personalized'}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-teal" /> {lang === 'hi' ? 'द्विभाषी' : 'Multilingual'}
                  </span>
                </div>

                {/* Product Trust Stamp Overlay */}
                <div className="stamp">
                  <div className="stamp-text">
                    READY TO
                    <span className="big">DISCOVER</span>
                    BENEFITS
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Scheme Information Ticker Ledger */}
      <div className="ledger py-3.5 border-y border-navy/15 bg-gradient-to-r from-cream-2/50 via-cream/70 to-cream-2/50 relative z-10 overflow-hidden">
        <div className="ledger-track flex gap-8 animate-marquee whitespace-nowrap">
          {genericSchemes.concat(genericSchemes).map((sch, idx) => (
            <div key={idx} className="ledger-item flex items-baseline gap-2 text-sm text-navy px-6 border-r border-dashed border-navy/20">
              <span className="font-serif font-semibold italic">{sch.name}</span>
              <span className="text-terracotta font-semibold text-xs">{sch.category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Why SchemeSetu Section */}
      <section className="py-16 bg-card/70 border-b border-navy/15 relative z-10" id="why">
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

      {/* How It Works Process Section */}
      <section className="py-16 relative z-10" id="how">
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
                    type="button"
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

      {/* Final CTA Section */}
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
              <button onClick={handleCheckEligibility} className="btn-primary big text-base font-semibold" type="button">
                <span>{t('checkEligibility')}</span>
                <svg className="arrow w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </button>
              <button onClick={handleLogin} className="btn-secondary big text-base font-semibold" type="button">
                <span>{user ? (lang === 'hi' ? 'मेरी पासबुक' : 'My Passbook') : (lang === 'hi' ? 'लॉगिन करें' : 'Login to Continue')}</span>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default Landing;
