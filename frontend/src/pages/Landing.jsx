import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import DisclaimerBanner from '../components/DisclaimerBanner';
import ScrollReveal from '../components/ScrollReveal';

export const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  const [openFaq, setOpenFaq] = useState(null);
  const [matchCount, setMatchCount] = useState(3);
  const [ringPct, setRingPct] = useState(0);
  const [ringDeg, setRingDeg] = useState(0);

  // 3D tilt refs
  const stageRef = useRef(null);
  const passbookRef = useRef(null);

  useEffect(() => {
    // Number flicker animation (3 -> 9 -> 2 -> 5 -> 7)
    const seq = [3, 9, 2, 5, 7];
    let idx = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setMatchCount(seq[idx]);
        idx++;
        if (idx >= seq.length) {
          clearInterval(interval);
        }
      }, 90);
    }, 550);

    // Ring percentage animation (0 -> 82%)
    let startTime = null;
    const targetPct = 82;
    const duration = 900;

    const animFrame = (now) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentPct = Math.round(eased * targetPct);
      const deg = eased * 295;

      setRingPct(currentPct);
      setRingDeg(deg);

      if (progress < 1) {
        requestAnimationFrame(animFrame);
      }
    };

    const ringDelayTimer = setTimeout(() => {
      requestAnimationFrame(animFrame);
    }, 550);

    return () => {
      clearTimeout(timer);
      clearTimeout(ringDelayTimer);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!stageRef.current || !passbookRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    passbookRef.current.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  };

  const handleMouseLeave = () => {
    if (passbookRef.current) {
      passbookRef.current.style.transform = 'rotateY(0deg) rotateX(0deg)';
    }
  };

  const handleGoToAuthOrWizard = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/eligibility' } } });
    } else {
      navigate('/eligibility');
    }
  };

  const handleCreateProfile = () => {
    if (!user) {
      navigate('/register', { state: { from: { pathname: '/eligibility' } } });
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

  const ledgerItems = [
    { scheme: 'PM-KISAN', amt: '₹6,000/yr' },
    { scheme: 'Ayushman Bharat', amt: '₹5,00,000 cover' },
    { scheme: 'PMAY (Urban)', amt: 'Interest subsidy' },
    { scheme: 'National Scholarship', amt: 'Up to ₹20,000/yr' },
    { scheme: 'Ujjwala Yojana', amt: 'Free LPG connection' },
    { scheme: 'Skill India (PMKVY)', amt: 'Free certification' },
    { scheme: 'Atal Pension Yojana', amt: '₹1,000–5,000/mo pension' },
    { scheme: 'Stand-Up India', amt: '₹10L–1Cr loans' },
  ];

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background field texture */}
      <div className="field" />

      <DisclaimerBanner />

      {/* Hero Section */}
      <section className="hero">
        {/* Left Copy Column */}
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="dot"></span>
            {lang === 'hi' ? 'सरकारी योजना खोज सरलीकृत' : 'Government scheme discovery, made simple'}
          </span>

          <h1 className="hero-h1">
            <span className="line">
              <span>{lang === 'hi' ? 'अपने लिए बनी' : 'Find schemes made'}</span>
            </span>
            <span className="line">
              <span className="accent">{lang === 'hi' ? 'सरकारी योजनाएं खोजें' : 'for you'}</span>
            </span>
          </h1>

          <p className="lede">
            {lang === 'hi'
              ? 'अपने बारे में कुछ प्रश्नों के उत्तर दें और उन सरकारी योजनाओं की खोज करें जिनके आप पात्र हैं — तुरंत मिलान, सरल स्पष्टीकरण।'
              : 'Answer a few questions about yourself and discover the government schemes you are actually eligible for — matched instantly, explained simply.'}
          </p>

          <div className="cta-row">
            <button onClick={handleGoToAuthOrWizard} className="btn btn-primary big text-base" type="button">
              <span>{user ? t('checkEligibility') : (lang === 'hi' ? 'पात्रता जांचने हेतु लॉग इन करें' : 'Login to Check Eligibility')}</span>
              <svg className="arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M5 12h14M13 5l7 7-7 7"/>
              </svg>
            </button>

            {!user && (
              <button onClick={handleCreateProfile} className="btn btn-secondary big text-base" type="button">
                <span>{lang === 'hi' ? 'अपनी प्रोफ़ाइल बनाएं' : 'Create Your Profile'}</span>
              </button>
            )}
          </div>

          <div className="trust-row">
            <span className="avatars">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span>{lang === 'hi' ? 'सुरक्षित प्रोफ़ाइल-आधारित योजना मिलान' : 'Secure profile-based scheme matching'}</span>
          </div>
        </div>

        {/* Right Stage — Digital Passbook 3D Mockup */}
        <div 
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="stage"
        >
          <div className="blob" />

          <div ref={passbookRef} className="passbook" id="passbook">
            {/* Top Row */}
            <div className="row-top">
              <div className="badge-live">
                <span className="dot"></span>
                <span>DIGITAL PASSBOOK</span>
              </div>
              <div className="secure-label">
                🔒 SECURE PROFILE
              </div>
            </div>

            {/* Greeting Row */}
            <div className="greet-row">
              <div>
                <div className="hello">{lang === 'hi' ? 'नमस्ते 👋' : 'Hello 👋'}</div>
                <div className="headline">
                  <span className="num" id="matchNum">{matchCount}</span>{' '}
                  {lang === 'hi' ? 'संभावित पात्र योजनाएं' : 'possible matches'}
                </div>
              </div>

              <div 
                className="ring-wrap" 
                style={{
                  background: `conic-gradient(var(--gold) 0deg, var(--green-2) ${ringDeg}deg, #e4ddcc ${ringDeg}deg)`
                }}
              >
                <span className="ring-pct">{ringPct}%</span>
              </div>
            </div>

            {/* Match Card Preview */}
            <div className="match-card">
              <div className="match-top">
                <span className="top-match-label">TOP MATCH</span>
                <span className="match-pill">96% match</span>
              </div>

              <div className="scheme-name">
                PM-KISAN (Kisan Samman)
              </div>

              <div className="scheme-price">
                ₹6,000 / year · direct transfer
              </div>

              <hr className="divider" />

              <div className="recheck">
                🔒 {lang === 'hi' ? 'आपकी पात्रता लॉग इन के बाद सुरक्षित रूप से जांची जाती है' : 'Your eligibility is matched securely after login'}
              </div>

              <div className="checklist">
                <div className="check-item">
                  <span className="tick">✓</span>
                  <span>{lang === 'hi' ? 'राज्य:' : 'State:'} <b>Uttar Pradesh</b></span>
                </div>
                <div className="check-item">
                  <span className="tick">✓</span>
                  <span>{lang === 'hi' ? 'व्यवसाय:' : 'Occupation:'} <b>Farmer</b></span>
                </div>
                <div className="check-item">
                  <span className="tick">✓</span>
                  <span>{lang === 'hi' ? 'आय:' : 'Income:'} <b>Below ₹2L</b></span>
                </div>
              </div>
            </div>

            {/* Login Gate Action Button */}
            <button onClick={handleGoToAuthOrWizard} className="stamp-btn" type="button">
              <span>🔐</span>
              <span>{user ? t('checkEligibility') : (lang === 'hi' ? 'अपनी पात्र योजनाएं देखने के लिए लॉग इन करें' : 'Login to See Your Eligible Schemes')}</span>
            </button>

            {/* Stamp */}
            <div className="stamp">
              PROFILE<br />
              VERIFIED<br />
              SCHEMES
            </div>
          </div>
        </div>
      </section>

      {/* Scheme Ledger Marquee Ticker */}
      <div className="ledger">
        <div className="ledger-track">
          {[...ledgerItems, ...ledgerItems].map((item, idx) => (
            <div key={idx} className="ledger-item">
              <span className="scheme">{item.scheme}</span>
              <span className="amt">{item.amt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Why SchemeSetu Section */}
      <section className="py-16 bg-card/70 border-y border-navy/15 relative z-10" id="why">
        <div className="max-w-6xl mx-auto px-4 sm:px-7">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="eyebrow-badge mb-2">
                <span className="dot"></span>
                <span>{t('navWhy')}</span>
              </div>
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

      {/* How It Works Section */}
      <section className="py-16 relative z-10" id="how">
        <div className="max-w-6xl mx-auto px-4 sm:px-7">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="eyebrow-badge mb-2">
                <span className="dot"></span>
                <span>{t('navRitual')}</span>
              </div>
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
              <div className="eyebrow-badge mb-2">
                <span className="dot"></span>
                <span>{t('navFaq')}</span>
              </div>
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
              <button onClick={handleGoToAuthOrWizard} className="btn btn-primary big text-base" type="button">
                <span>{user ? t('checkEligibility') : (lang === 'hi' ? 'पात्रता जांचने हेतु लॉग इन करें' : 'Login to Check Eligibility')}</span>
                <svg className="arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
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
