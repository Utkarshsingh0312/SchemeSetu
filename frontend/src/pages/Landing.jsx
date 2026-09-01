import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import DisclaimerBanner from '../components/DisclaimerBanner';
import ScrollReveal from '../components/ScrollReveal';
import { UserRound, Sparkles, SearchCheck, ArrowUpRight, Check } from 'lucide-react';

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

      {/* Why SchemeSetu Section (Second Section) */}
      <section className="py-[44px] md:py-[52px] lg:py-[64px] px-4 md:px-5 lg:px-6 bg-[#F3EEDF] border-y border-[#16213C]/15 relative z-10 font-sans" id="why">
        <div className="max-w-[1180px] mx-auto w-full">
          {/* Header Block */}
          <div className="text-center max-w-[900px] mx-auto mb-[28px] md:mb-[34px] lg:mb-[40px]">
            <ScrollReveal delay={0}>
              <div className="inline-flex items-center gap-2 h-[38px] px-4 py-1.5 rounded-full bg-[#FBF8F1] border border-[#16213C]/15 text-[#16213C] font-semibold text-[13px] shadow-sm mb-3.5 mx-auto">
                <span className="w-2 h-2 rounded-full bg-[#B7975A] flex-none" />
                <span>{t('navWhy')}</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={60}>
              <h2 className="font-serif font-bold text-[30px] sm:text-[36px] md:text-[40px] lg:text-[48px] leading-[1.12] lg:leading-[1.08] text-[#16213C] tracking-tight max-w-[900px] mx-auto">
                {lang === 'hi' ? 'पात्र और नामांकित के बीच की दूरी को मिटाना' : 'The gap between eligible and enrolled'}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <p className="text-[#5C5643] text-[14px] md:text-[16px] leading-[1.5] max-w-[720px] mx-auto mt-3.5 font-medium">
                {lang === 'hi' ? 'स्कीमसेतु नागरिकों को उनके अधिकारों और कल्याणकारी योजनाओं से पारदर्शी रूप से जोड़ता है।' : 'SchemeSetu transparently connects citizens directly to their official government rights.'}
              </p>
            </ScrollReveal>
          </div>

          {/* 4 Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
            {/* Card 1 */}
            <ScrollReveal delay={80}>
              <div className="group relative bg-[#FBF8F1] border border-[#16213C]/12 rounded-[18px] p-5 sm:p-6 lg:p-[26px] min-h-[195px] flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#2C6350]/40 hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#16213C] to-[#2C6350] opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <div className="font-mono text-[13px] font-bold text-[#B7975A] tracking-wider">01</div>
                  <h3 className="font-serif text-[22px] lg:text-[24px] font-bold text-[#16213C] group-hover:text-[#2C6350] transition-colors duration-200 mt-2.5">
                    {lang === 'hi' ? 'स्पष्टता' : 'Clarity'}
                  </h3>
                  <p className="text-[14px] text-[#5C5643] leading-[1.55] mt-2.5 font-normal">
                    {lang === 'hi' ? 'सरल और स्पष्ट भाषा में हर योजना की पात्रता का स्पष्टीकरण।' : 'No scheme names hidden in bureaucratic jargon. Every match explained in plain language.'}
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2 */}
            <ScrollReveal delay={160}>
              <div className="group relative bg-[#FBF8F1] border border-[#16213C]/12 rounded-[18px] p-5 sm:p-6 lg:p-[26px] min-h-[195px] flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#2C6350]/40 hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#2C6350] to-[#B7975A] opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <div className="font-mono text-[13px] font-bold text-[#B7975A] tracking-wider">02</div>
                  <h3 className="font-serif text-[22px] lg:text-[24px] font-bold text-[#16213C] group-hover:text-[#2C6350] transition-colors duration-200 mt-2.5">
                    {lang === 'hi' ? 'प्रमाण' : 'Proof'}
                  </h3>
                  <p className="text-[14px] text-[#5C5643] leading-[1.55] mt-2.5 font-normal">
                    {lang === 'hi' ? 'सटीक नियम मिलान दिखाता है कि आपकी कौन सी जानकारी पात्र बनाती है।' : 'Each match shows exactly which of your details qualified you — never a black-box answer.'}
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3 */}
            <ScrollReveal delay={240}>
              <div className="group relative bg-[#FBF8F1] border border-[#16213C]/12 rounded-[18px] p-5 sm:p-6 lg:p-[26px] min-h-[195px] flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#2C6350]/40 hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B7975A] to-[#C45B38] opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <div className="font-mono text-[13px] font-bold text-[#B7975A] tracking-wider">03</div>
                  <h3 className="font-serif text-[22px] lg:text-[24px] font-bold text-[#16213C] group-hover:text-[#2C6350] transition-colors duration-200 mt-2.5">
                    {lang === 'hi' ? 'तैयारी' : 'Readiness'}
                  </h3>
                  <p className="text-[14px] text-[#5C5643] leading-[1.55] mt-2.5 font-normal">
                    {lang === 'hi' ? 'दस्तावेज़ सूची और अंतिम तिथि पहले ही बता दी जाती है।' : 'Document checklist and deadline given upfront, so applying on government portals is straightforward.'}
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 4 */}
            <ScrollReveal delay={320}>
              <div className="group relative bg-[#FBF8F1] border border-[#16213C]/12 rounded-[18px] p-5 sm:p-6 lg:p-[26px] min-h-[195px] flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#2C6350]/40 hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C45B38] to-[#16213C] opacity-80 group-hover:opacity-100 transition-opacity" />
                <div>
                  <div className="font-mono text-[13px] font-bold text-[#B7975A] tracking-wider">04</div>
                  <h3 className="font-serif text-[22px] lg:text-[24px] font-bold text-[#16213C] group-hover:text-[#2C6350] transition-colors duration-200 mt-2.5">
                    {lang === 'hi' ? 'पहुंच' : 'Access'}
                  </h3>
                  <p className="text-[14px] text-[#5C5643] leading-[1.55] mt-2.5 font-normal">
                    {lang === 'hi' ? 'आपकी सभी सहेजी गई और आवेदित योजनाओं की एक दृश्यमान पासबुक।' : 'A visible digital passbook of what you have claimed and what opens next.'}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How It Works Section (Page 3 — 4-Step Connected Journey) */}
      <section className="py-[52px] md:py-[64px] lg:py-[76px] px-4 md:px-5 lg:px-6 bg-[#F3EEDF] border-t border-[#16213C]/15 relative overflow-hidden z-10 font-sans" id="how">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#2C6350]/[0.07] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#B7975A]/[0.08] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1180px] mx-auto w-full relative z-10">
          {/* Header Block */}
          <div className="text-center max-w-[900px] mx-auto mb-[32px] md:mb-[42px] lg:mb-[48px]">
            <ScrollReveal delay={0}>
              <div className="inline-flex items-center justify-center gap-[9px] h-[40px] px-4 rounded-full bg-[#FBF8F1]/85 backdrop-blur-sm border border-[#16213C]/14 text-[#2C6350] font-sans font-semibold text-[13px] tracking-[0.04em] leading-none shadow-[0_4px_14px_rgba(22,33,60,0.06)] hover:bg-[#FBF8F1] hover:border-[#B7975A]/35 transition-all duration-300 mb-5 mx-auto cursor-default group">
                <span className="w-[7px] h-[7px] rounded-full bg-[#B7975A] shadow-[0_0_0_3px_rgba(183,151,90,0.10)] group-hover:shadow-[0_0_0_4px_rgba(183,151,90,0.20)] transition-all duration-300 flex-none" />
                <span>{t('navRitual')}</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h2 className="font-serif font-bold text-[30px] sm:text-[36px] md:text-[42px] lg:text-[48px] leading-[1.12] lg:leading-[1.08] text-[#16213C] tracking-tight max-w-[900px] mx-auto">
                {lang === 'hi' ? (
                  <>
                    पात्रता से <span className="relative inline-block">नामांकन<span className="absolute left-0 right-0 -bottom-1 h-[3px] bg-gradient-to-r from-[#B7975A] to-[#2C6350] rounded-full" /></span> तक चार आसान चरण
                  </>
                ) : (
                  <>
                    Four steps from eligible to <span className="relative inline-block">enrolled<span className="absolute left-0 right-0 -bottom-1 h-[3px] bg-gradient-to-r from-[#B7975A] to-[#2C6350] rounded-full" /></span>
                  </>
                )}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={180}>
              <p className="text-[#5C5643] text-[14px] md:text-[16px] leading-[1.5] max-w-[700px] mx-auto mt-3.5 font-medium">
                {lang === 'hi' ? 'अपनी डिजिटल पासबुक एक बार बनाएं — स्कीमसेतु स्वतः आपके मानदंडों का मूल्यांकन करता है।' : 'Build your digital passbook once — SchemeSetu evaluates your criteria automatically.'}
              </p>
            </ScrollReveal>
          </div>

          {/* 4-Step Connected Journey Container */}
          <div className="relative">
            {/* Desktop Horizontal Connecting Line (Behind Cards) */}
            <div className="hidden lg:block absolute top-[48px] left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-[#2C6350]/30 via-[#B7975A]/40 to-[#C45B38]/30 pointer-events-none z-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 relative z-10">
              
              {/* STEP 01 — Create Your Profile */}
              <ScrollReveal delay={280}>
                <div className="group relative bg-[#FBF8F1] border border-[#16213C]/12 rounded-[20px] p-6 lg:p-[26px] min-h-[220px] flex flex-col justify-between shadow-sm hover:shadow-lg hover:border-[#2C6350]/40 hover:-translate-y-1.5 transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#2C6350] opacity-80 group-hover:opacity-100 transition-opacity" />
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {/* Step Circular Badge */}
                      <div className="w-[42px] h-[42px] rounded-full bg-[#E7F1EB] border border-[#2C6350]/20 flex items-center justify-center font-mono font-bold text-sm text-[#16213C] group-hover:bg-[#2C6350] group-hover:text-[#FBF8F1] group-hover:scale-105 transition-all duration-300 shadow-xs">
                        01
                      </div>
                      {/* Step Icon */}
                      <div className="w-9 h-9 rounded-xl bg-[#2C6350]/10 flex items-center justify-center group-hover:translate-y-[-2px] transition-transform duration-300">
                        <UserRound className="w-5 h-5 text-[#2C6350]" />
                      </div>
                    </div>

                    <div className="font-mono text-[11px] font-bold text-[#2C6350] uppercase tracking-wider mb-1">
                      STEP 01
                    </div>

                    <h3 className="font-serif text-[22px] lg:text-[24px] font-bold text-[#16213C] group-hover:text-[#2C6350] transition-colors duration-200">
                      {lang === 'hi' ? 'अपनी प्रोफ़ाइल बनाएं' : 'Create Your Profile'}
                    </h3>

                    <p className="text-[14px] text-[#5C5643] leading-[1.55] mt-2.5 font-normal">
                      {lang === 'hi' ? 'अपने बारे में बुनियादी जनसांख्यिकी, आय, व्यवसाय और सामाजिक वर्ग दर्ज करें।' : 'Tell us about yourself once: demographics, income, occupation, and category.'}
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* STEP 02 — Get Personalized Matches */}
              <ScrollReveal delay={380}>
                <div className="group relative bg-[#FBF8F1] border border-[#16213C]/12 rounded-[20px] p-6 lg:p-[26px] min-h-[220px] flex flex-col justify-between shadow-sm hover:shadow-lg hover:border-[#B7975A]/50 hover:-translate-y-1.5 transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#B7975A] opacity-80 group-hover:opacity-100 transition-opacity" />
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {/* Step Circular Badge */}
                      <div className="w-[42px] h-[42px] rounded-full bg-[#F4E9D0] border border-[#B7975A]/30 flex items-center justify-center font-mono font-bold text-sm text-[#16213C] group-hover:bg-[#B7975A] group-hover:text-[#FBF8F1] group-hover:scale-105 transition-all duration-300 shadow-xs">
                        02
                      </div>
                      {/* Step Icon */}
                      <div className="w-9 h-9 rounded-xl bg-[#B7975A]/15 flex items-center justify-center group-hover:translate-y-[-2px] transition-transform duration-300">
                        <Sparkles className="w-5 h-5 text-[#B7975A]" />
                      </div>
                    </div>

                    <div className="font-mono text-[11px] font-bold text-[#B7975A] uppercase tracking-wider mb-1">
                      STEP 02
                    </div>

                    <h3 className="font-serif text-[22px] lg:text-[24px] font-bold text-[#16213C] group-hover:text-[#2C6350] transition-colors duration-200">
                      {lang === 'hi' ? 'व्यक्तिगत मिलान प्राप्त करें' : 'Get Personalized Matches'}
                    </h3>

                    <p className="text-[14px] text-[#5C5643] leading-[1.55] mt-2.5 font-normal">
                      {lang === 'hi' ? 'स्कीमसेतु आपकी प्रोफ़ाइल की तुलना सक्रिय केंद्र और राज्य योजना नियमों से करता है।' : 'SchemeSetu compares your profile with active central and state scheme rules in real time.'}
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* STEP 03 — Understand Why */}
              <ScrollReveal delay={480}>
                <div className="group relative bg-[#FBF8F1] border border-[#16213C]/12 rounded-[20px] p-6 lg:p-[26px] min-h-[220px] flex flex-col justify-between shadow-sm hover:shadow-lg hover:border-[#16213C]/40 hover:-translate-y-1.5 transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#16213C] opacity-80 group-hover:opacity-100 transition-opacity" />
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {/* Step Circular Badge */}
                      <div className="w-[42px] h-[42px] rounded-full bg-[#16213C]/10 border border-[#16213C]/20 flex items-center justify-center font-mono font-bold text-sm text-[#16213C] group-hover:bg-[#16213C] group-hover:text-[#FBF8F1] group-hover:scale-105 transition-all duration-300 shadow-xs">
                        03
                      </div>
                      {/* Step Icon */}
                      <div className="w-9 h-9 rounded-xl bg-[#16213C]/10 flex items-center justify-center group-hover:translate-y-[-2px] transition-transform duration-300">
                        <SearchCheck className="w-5 h-5 text-[#16213C]" />
                      </div>
                    </div>

                    <div className="font-mono text-[11px] font-bold text-[#16213C] uppercase tracking-wider mb-1">
                      STEP 03
                    </div>

                    <h3 className="font-serif text-[22px] lg:text-[24px] font-bold text-[#16213C] group-hover:text-[#2C6350] transition-colors duration-200">
                      {lang === 'hi' ? 'पात्रता का कारण समझें' : 'Understand Why'}
                    </h3>

                    <p className="text-[14px] text-[#5C5643] leading-[1.55] mt-2.5 font-normal">
                      {lang === 'hi' ? 'सटीक नियम मिलान देखें — आयु, आय सीमा, व्यवसाय या राज्य निवास नियम।' : 'See exact matched criteria — age, income ceiling, occupation, or state rules.'}
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* STEP 04 — Apply & Track */}
              <ScrollReveal delay={580}>
                <div className="group relative bg-[#FBF8F1] border border-[#16213C]/12 rounded-[20px] p-6 lg:p-[26px] min-h-[220px] flex flex-col justify-between shadow-sm hover:shadow-lg hover:border-[#C45B38]/40 hover:-translate-y-1.5 transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#C45B38] opacity-80 group-hover:opacity-100 transition-opacity" />
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {/* Step Circular Badge */}
                      <div className="w-[42px] h-[42px] rounded-full bg-[#C45B38]/10 border border-[#C45B38]/25 flex items-center justify-center font-mono font-bold text-sm text-[#16213C] group-hover:bg-[#C45B38] group-hover:text-[#FBF8F1] group-hover:scale-105 transition-all duration-300 shadow-xs">
                        04
                      </div>
                      {/* Step Icon */}
                      <div className="w-9 h-9 rounded-xl bg-[#C45B38]/10 flex items-center justify-center group-hover:translate-y-[-2px] transition-transform duration-300">
                        <ArrowUpRight className="w-5 h-5 text-[#C45B38]" />
                      </div>
                    </div>

                    <div className="font-mono text-[11px] font-bold text-[#C45B38] uppercase tracking-wider mb-1">
                      STEP 04
                    </div>

                    <h3 className="font-serif text-[22px] lg:text-[24px] font-bold text-[#16213C] group-hover:text-[#2C6350] transition-colors duration-200">
                      {lang === 'hi' ? 'आवेदन करें और ट्रैक करें' : 'Apply & Track'}
                    </h3>

                    <p className="text-[14px] text-[#5C5643] leading-[1.55] mt-2.5 font-normal">
                      {lang === 'hi' ? 'दस्तावेज़ चेकलिस्ट तैयार करें, आधिकारिक पोर्टल खोलें और प्रगति ट्रैक करें।' : 'Prepare document checklists, open official portals, and track progress.'}
                    </p>
                  </div>

                  {/* Completion Accent Indicator */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F1EB] border border-[#2C6350]/30 text-[#2C6350] font-bold text-[12px] mt-4 self-start">
                    <Check className="w-3.5 h-3.5 text-[#2C6350]" />
                    <span>{lang === 'hi' ? 'आवेदन के लिए तैयार' : 'Ready to apply'}</span>
                  </div>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section (Redesigned Editorial & Interactive) */}
      <section className="py-[64px] lg:py-[100px] px-4 sm:px-6 bg-[#F3EEDF] border-t border-[#16213C]/15 relative overflow-hidden z-10 font-sans" id="faq">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#B7975A]/[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#2C6350]/[0.07] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[820px] mx-auto w-full relative z-10">
          {/* Header Block */}
          <div className="text-center max-w-[680px] mx-auto mb-[44px] sm:mb-[48px]">
            <ScrollReveal delay={0}>
              <div className="inline-flex items-center justify-center gap-[9px] h-[38px] px-[15px] rounded-full bg-[#FBF8F1] border border-[#16213C]/14 text-[#2C6350] font-sans font-semibold text-[12px] tracking-[0.06em] leading-none shadow-[0_4px_14px_rgba(22,33,60,0.06)] hover:bg-[#FBF8F1] hover:border-[#B7975A]/35 transition-all duration-300 mb-4 mx-auto cursor-default group">
                <span className="w-[7px] h-[7px] rounded-full bg-[#B7975A] shadow-[0_0_0_3px_rgba(183,151,90,0.10)] flex-none" />
                <span>{t('navFaq')}</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <h2 className="font-serif font-bold text-[32px] sm:text-[40px] lg:text-[48px] leading-[1.05] tracking-[-0.025em] text-[#16213C] max-w-[650px] mx-auto">
                {lang === 'hi' ? (
                  <>
                    अक्सर पूछे जाने वाले <span className="relative inline-block">सवाल<span className="absolute left-0 right-0 -bottom-1 h-[5px] bg-[#B7975A]/30 rounded-full" /></span>
                  </>
                ) : (
                  <>
                    Frequently Asked <span className="relative inline-block">Questions<span className="absolute left-0 right-0 -bottom-1 h-[5px] bg-[#B7975A]/30 rounded-full" /></span>
                  </>
                )}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={140}>
              <p className="text-[#6B6659] text-[15px] sm:text-[16px] leading-[1.6] max-w-[650px] mx-auto mt-3.5 font-medium">
                {t('faqSubtitle')}
              </p>
            </ScrollReveal>
          </div>

          {/* Editorial FAQ Rows */}
          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              const numStr = `0${i + 1}`;
              return (
                <ScrollReveal key={i} delay={200 + i * 60}>
                  <div 
                    className={`group rounded-[16px] p-5 sm:p-[22px_24px] mb-3 transition-all duration-250 ease-out border shadow-[0_4px_18px_rgba(22,33,60,0.035)] hover:shadow-[0_8px_24px_rgba(22,33,60,0.07)] hover:-translate-y-[2px] ${
                      isOpen 
                        ? 'bg-gradient-to-br from-[#FBF8F1] to-[#F4E9D0] border-[#B7975A]/35 border-l-[4px] border-l-[#B7975A]' 
                        : 'bg-[#FBF8F1] border-[#16213C]/12 hover:border-[#2C6350]/25'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full text-left flex items-center justify-between gap-3 font-sans focus:outline-none cursor-pointer"
                      type="button"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 pr-2">
                        {/* Number */}
                        <span className="font-mono text-[11px] font-bold text-[#B7975A] tracking-[0.08em] flex-none">
                          {numStr}
                        </span>
                        {/* Question */}
                        <span className={`font-serif font-semibold text-[16px] sm:text-[18px] leading-[1.35] transition-colors duration-200 ${isOpen ? 'text-[#2C6350]' : 'text-[#16213C] group-hover:text-[#2C6350]'}`}>
                          {faq.q}
                        </span>
                      </div>

                      {/* Circular Plus Icon */}
                      <div className={`w-[34px] h-[34px] rounded-full border border-[#16213C]/15 flex items-center justify-center font-sans font-bold text-sm text-[#16213C] transition-all duration-250 flex-none ml-2 ${
                        isOpen 
                          ? 'bg-[#2C6350] border-[#2C6350] text-[#FBF8F1] rotate-45 shadow-sm' 
                          : 'bg-transparent group-hover:bg-[#E7F1EB] group-hover:border-[#2C6350]/30 group-hover:text-[#2C6350]'
                      }`}>
                        +
                      </div>
                    </button>

                    {/* Answer Animation */}
                    {isOpen && (
                      <div className="text-[14px] sm:text-[15px] font-sans text-[#5C5643] leading-[1.7] mt-3.5 pt-3.5 border-t border-[#16213C]/10 animate-fade-in pl-7 sm:pl-8">
                        {faq.a}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Centered Trust Statement */}
          <ScrollReveal delay={440}>
            <div className="text-center mt-10 text-[#7A7568] font-serif italic text-[14px] flex items-center justify-center gap-2.5">
              <span className="text-[#B7975A] text-xs">✦</span>
              <span>{lang === 'hi' ? 'स्पष्टता के लिए निर्मित। नागरिकों के लिए डिज़ाइन किया गया।' : 'Built for clarity. Designed for citizens.'}</span>
              <span className="text-[#B7975A] text-xs">✦</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Final CTA Section (Page 5 — Editorial Civic-Tech Conclusion) */}
      <section className="py-[90px] lg:py-[110px] min-h-[560px] flex items-center justify-center bg-[#F3EEDF] border-t border-[#16213C]/15 relative overflow-hidden z-10 font-sans" id="cta">
        {/* Barely-visible Ambient Radial Glows */}
        <div className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-[#B7975A]/[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[450px] h-[450px] bg-[#2C6350]/[0.08] rounded-full blur-3xl pointer-events-none" />

        {/* Decorative Editorial Flanking Elements */}
        <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none text-[#16213C] font-serif text-6xl">
          ✦
        </div>
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none text-[#16213C] font-serif text-6xl">
          ✦
        </div>

        <div className="max-w-[840px] mx-auto px-4 sm:px-6 w-full text-center relative z-10">
          
          {/* Eyebrow */}
          <ScrollReveal delay={0}>
            <div className="inline-flex items-center justify-center gap-2 mb-[22px] font-sans font-semibold text-[12px] uppercase tracking-[0.14em] text-[#2C6350]">
              <span className="text-[#B7975A] text-xs">✦</span>
              <span>{lang === 'hi' ? 'आपकी सुविधाएं, सरलीकृत' : 'YOUR BENEFITS, SIMPLIFIED'}</span>
            </div>
          </ScrollReveal>

          {/* Main Heading */}
          <ScrollReveal delay={100}>
            <h2 className="font-serif font-bold text-[34px] sm:text-[44px] lg:text-[54px] leading-[1.02] tracking-[-0.035em] text-[#16213C] max-w-[780px] mx-auto">
              {lang === 'hi' ? (
                <>
                  आपकी योजना लाभ खोजने की <span className="relative inline-block">क्षमता पर नहीं<span className="absolute left-0 right-0 -bottom-1 h-[5px] bg-[#B7975A]/35 rounded-full" /></span> निर्भर करने चाहिए।
                </>
              ) : (
                <>
                  Your benefits <span className="relative inline-block">should not depend<span className="absolute left-0 right-0 -bottom-1 h-[5px] bg-[#B7975A]/35 rounded-full" /></span> on how well you search.
                </>
              )}
            </h2>
          </ScrollReveal>

          {/* Supporting Description */}
          <ScrollReveal delay={180}>
            <p className="text-[#5C5643] text-[15px] sm:text-[16px] leading-[1.65] max-w-[650px] mx-auto mt-[22px] font-medium font-sans">
              {lang === 'hi'
                ? 'अपनी डिजिटल पात्रता पासबुक बनाएं — एक बार जांच की गई, अगली हर खुलने वाली योजना के लिए मान्य।'
                : 'Build your digital eligibility passbook — checked once, valid for every scheme that opens next.'}
            </p>
          </ScrollReveal>

          {/* Compact Editorial Passbook Strip Visual */}
          <ScrollReveal delay={260}>
            <div className="max-w-[600px] min-h-[64px] py-3.5 px-5 sm:px-7 mx-auto my-[28px] bg-[#FBF8F1]/75 backdrop-blur-sm border border-[#16213C]/12 rounded-[14px] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs font-sans font-medium text-[#16213C] hover:shadow-md hover:-translate-y-[2px] transition-all duration-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2C6350] animate-pulse" />
                <span className="text-[#2C6350] font-bold">✓ Profile verified</span>
              </div>
              <span className="hidden sm:inline text-[#B7975A] font-bold">•</span>
              <div className="text-[#16213C] font-semibold">Personalized matching</div>
              <span className="hidden sm:inline text-[#B7975A] font-bold">•</span>
              <div className="text-[#16213C]/80 font-normal">Official scheme links</div>
            </div>
          </ScrollReveal>

          {/* Focal CTA Button */}
          <ScrollReveal delay={340}>
            <div className="flex flex-col items-center justify-center">
              <button
                onClick={handleGoToAuthOrWizard}
                className="w-full sm:w-auto min-w-[280px] max-w-[340px] sm:max-w-none h-[54px] px-7 rounded-[12px] bg-[#16213C] text-[#FBF8F1] font-sans font-semibold text-[15px] shadow-md hover:bg-[#202F52] hover:-translate-y-[2px] active:scale-[0.98] transition-all duration-200 btn-shine inline-flex items-center justify-center gap-2.5 border-b-2 border-b-[#B7975A] group cursor-pointer"
                type="button"
              >
                <span>{user ? t('checkEligibility') : (lang === 'hi' ? 'पात्रता जांचने हेतु लॉग इन करें' : 'Login to Check Eligibility')}</span>
                <svg className="w-4 h-4 text-[#FBF8F1] group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </button>

              {/* Secondary Trust Message */}
              <div className="text-center text-[12px] font-sans text-[#7A7568] mt-4 flex items-center justify-center gap-1.5">
                <span className="text-[#B7975A]">✦</span>
                <span>{lang === 'hi' ? 'कोई अंतहीन खोज नहीं। केवल वे योजनाएं जिनके आप पात्र हैं।' : 'No endless searching. Just the schemes you qualify for.'}</span>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>
    </div>
  );
};

export default Landing;
