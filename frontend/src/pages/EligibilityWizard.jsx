import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEligibility } from '../context/EligibilityContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, User, MapPin, Briefcase, IndianRupee, Users, Check } from 'lucide-react';

export const EligibilityWizard = () => {
  const navigate = useNavigate();
  const { profile, updateProfileField, runEligibilityCheck, loading } = useEligibility();
  const { lang, t } = useLanguage();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState('next'); // 'next' or 'prev'
  const [error, setError] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [matchingStatusIndex, setMatchingStatusIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const statusMessages = [
    lang === 'hi' ? 'आपकी प्रोफ़ाइल पढ़ी जा रही है...' : 'Reading your profile...',
    lang === 'hi' ? 'पात्रता मानदंडों की जाँच की जा रही है...' : 'Checking eligibility criteria...',
    lang === 'hi' ? 'उपलब्ध 894+ योजनाओं का मिलान किया जा रहा है...' : 'Matching available schemes...',
    lang === 'hi' ? 'आपके लिए सर्वोत्तम लाभों की खोज की जा रही है...' : 'Finding benefits for you...'
  ];

  useEffect(() => {
    let timer;
    let progressInterval;
    if (isMatching) {
      setMatchingStatusIndex(0);
      setProgressPercent(15);

      timer = setInterval(() => {
        setMatchingStatusIndex(prev => (prev + 1) % statusMessages.length);
      }, 550);

      progressInterval = setInterval(() => {
        setProgressPercent(prev => {
          if (prev >= 95) return 95;
          return prev + 5;
        });
      }, 100);
    } else {
      setProgressPercent(0);
    }
    return () => {
      clearInterval(timer);
      clearInterval(progressInterval);
    };
  }, [isMatching, lang]);

  const indianStates = [
    "All India", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const occupationsList = [
    { id: 'Student', label: lang === 'hi' ? 'छात्र' : 'Student', icon: '🎓', desc: lang === 'hi' ? 'स्कूल/कॉलेज में अध्ययनरत' : 'Enrolled in school or college' },
    { id: 'Farmer', label: lang === 'hi' ? 'किसान' : 'Farmer', icon: '🌾', desc: lang === 'hi' ? 'कृषि एवं संबद्ध कार्य' : 'Agriculture & farming' },
    { id: 'Salaried Employee', label: lang === 'hi' ? 'वेतनभोगी कर्मचारी' : 'Salaried Employee', icon: '💼', desc: lang === 'hi' ? 'सरकारी या निजी नौकरी' : 'Government or private job' },
    { id: 'Self Employed', label: lang === 'hi' ? 'स्वरोजगार' : 'Self Employed', icon: '🛠️', desc: lang === 'hi' ? 'स्वतंत्र पेशेवर/कारीगर' : 'Independent worker or artisan' },
    { id: 'Small Business Owner', label: lang === 'hi' ? 'छोटा व्यवसायी' : 'Small Business Owner', icon: '🏪', desc: lang === 'hi' ? 'दुकानदार या उद्यमी' : 'Shopkeeper or MSME owner' },
    { id: 'Daily Wage Worker', label: lang === 'hi' ? 'दैनिक वेतनभोगी' : 'Daily Wage Worker', icon: '👷', desc: lang === 'hi' ? 'श्रम और निर्माण कार्य' : 'Manual labourer or MGNREGA worker' },
    { id: 'Unemployed', label: lang === 'hi' ? 'बेरोजगार' : 'Unemployed', icon: '🔍', desc: lang === 'hi' ? 'रोजगार की तलाश में' : 'Seeking job opportunities' },
    { id: 'Other', label: lang === 'hi' ? 'अन्य' : 'Other', icon: '🤝', desc: lang === 'hi' ? 'गृहणी/निवृत्त' : 'Homemaker or retiree' },
  ];

  const incomeTiers = [
    { id: 50000, value: 50000, label: lang === 'hi' ? '₹1 लाख से कम' : 'Below ₹1 Lakh', text: '< ₹1,00,000 / yr' },
    { id: 150000, value: 150000, label: lang === 'hi' ? '₹1–2 लाख' : '₹1–2 Lakh', text: '₹1.0L – ₹2.0L / yr' },
    { id: 350000, value: 350000, label: lang === 'hi' ? '₹2–5 लाख' : '₹2–5 Lakh', text: '₹2.0L – ₹5.0L / yr' },
    { id: 750000, value: 750000, label: lang === 'hi' ? '₹5–10 लाख' : '₹5–10 Lakh', text: '₹5.0L – ₹10.0L / yr' },
    { id: 1200000, value: 1200000, label: lang === 'hi' ? '₹10 लाख से अधिक' : 'Above ₹10 Lakh', text: '> ₹10,00,000 / yr' },
  ];

  const categories = ['General', 'OBC', 'SC', 'ST', 'Other'];

  const handleNext = () => {
    setError('');
    
    if (step === 1) {
      if (!profile.age || profile.age <= 0) {
        setError(lang === 'hi' ? 'कृपया अपनी वैध आयु दर्ज करें।' : 'Please enter a valid age to continue.');
        return;
      }
    }
    if (step === 2) {
      if (!profile.state) {
        setError(lang === 'hi' ? 'कृपया अपना राज्य चुनें।' : 'Please select your state to continue.');
        return;
      }
    }
    if (step === 3) {
      if (!profile.occupation) {
        setError(lang === 'hi' ? 'कृपया अपना व्यवसाय चुनें।' : 'Please select your occupation.');
        return;
      }
    }

    setSlideDirection('next');
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setError('');
    setSlideDirection('prev');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsMatching(true);

    try {
      await runEligibilityCheck();
      setTimeout(() => {
        setIsMatching(false);
        addToast(lang === 'hi' ? '✓ आपकी प्रोफ़ाइल से मेल खाती योजनाएं तैयार हैं!' : '✓ Your personalized scheme matches are ready!', 'success');
        navigate('/results');
      }, 2200);
    } catch (err) {
      setIsMatching(false);
      setError(lang === 'hi' ? 'पात्रता जांचने में त्रुटि। कृपया पुनः प्रयास करें।' : 'Failed to calculate scheme matches. Please try again.');
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 max-w-4xl mx-auto relative page-entrance">
      <DisclaimerBanner />

      {/* DIGITAL PASSBOOK ELIGIBILITY EVALUATION OVERLAY */}
      {isMatching && (
        <div 
          className="fixed inset-0 z-50 bg-[#FBF8F1]/82 backdrop-blur-[5px] flex items-center justify-center p-4 animate-in fade-in duration-300 font-sans"
          role="dialog"
          aria-busy="true"
          aria-live="polite"
        >
          {/* CENTERED LOADING PANEL */}
          <div className="bg-[#FBF8F1]/96 border border-navy/10 rounded-[20px] sm:rounded-[24px] p-6 sm:p-[34px_32px] w-[calc(100vw-28px)] sm:w-[min(520px,calc(100vw-32px))] shadow-[0_20px_60px_rgba(22,33,60,0.16)] flex flex-col items-center text-center relative overflow-hidden font-sans transform transition-all animate-in zoom-in-98 slide-in-from-bottom-3 duration-400">
            
            {/* 72px Desktop / 64px Mobile Loading Icon */}
            <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] flex items-center justify-center mb-5 animate-in fade-in duration-300 delay-200">
              {/* Ring Progress */}
              <div className="absolute inset-0 rounded-full border-[3px] border-[#2C6350]/20" />
              <div className="absolute inset-0 rounded-full border-[3px] border-[#2C6350] border-t-marigold animate-spin duration-[1500ms]" />
              {/* Inner Logo Mark "S" */}
              <div className="w-8 h-8 rounded-full border border-navy bg-[#FBF8F1] ring-1 ring-marigold/60 flex items-center justify-center font-serif font-bold text-sm text-navy shadow-xs">
                S
              </div>
            </div>

            {/* EYEBROW */}
            <div className="text-[10px] sm:text-[11px] font-bold text-marigold uppercase tracking-[0.14em] font-sans mb-2 animate-in fade-in slide-in-from-bottom-1 duration-300 delay-350">
              DIGITAL PASSBOOK EVALUATION
            </div>

            {/* MAIN HEADING */}
            <h2 className="font-serif font-bold text-[23px] sm:text-[30px] text-navy leading-[1.2] mb-2.5 min-h-[36px] sm:min-h-[44px] flex items-center justify-center animate-in fade-in slide-in-from-bottom-1 duration-300 delay-450">
              {statusMessages[matchingStatusIndex]}
            </h2>

            {/* DESCRIPTION */}
            <p className="text-[13px] sm:text-[14px] text-[#5C5643] leading-[1.5] max-w-[390px] mx-auto font-sans mb-5 animate-in fade-in slide-in-from-bottom-1 duration-300 delay-550">
              {lang === 'hi' 
                ? 'उपलब्ध 894+ केंद्रीय और राज्य योजनाओं के नियमों से आपकी पात्रता जांची जा रही है...' 
                : 'Checking your eligibility across available central and state welfare schemes.'}
            </p>

            {/* PROGRESS STATUS ROW */}
            <div className="inline-flex items-center gap-2 bg-[#2C6350]/10 border border-[#2C6350]/18 text-[#2C6350] text-[12px] font-semibold rounded-full px-4 py-2 mb-4 animate-in fade-in slide-in-from-bottom-1 duration-300 delay-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2C6350] flex-none" />
              <span>{lang === 'hi' ? 'प्रोफ़ाइल मानदंड विश्लेषित किए गए' : 'Profile criteria analyzed'}</span>
            </div>

            {/* SUBTLE PROGRESS BAR */}
            <div className="w-[min(240px,80%)] sm:w-[260px] h-1 rounded-full bg-navy/10 overflow-hidden animate-in fade-in duration-300 delay-800">
              <div 
                className="h-full bg-[#2C6350] rounded-full transition-all duration-200 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

          </div>
        </div>
      )}

      <div className="bg-card border border-navy/20 rounded-2xl p-6 sm:p-10 shadow-xl my-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-navy/15">
          <div>
            <div className="eyebrow mb-1">
              <span className="dot" />
              <span>SCHEMESETU ELIGIBILITY ENGINE</span>
            </div>
            <h1 className="font-serif font-bold text-3xl text-navy">
              {lang === 'hi' ? 'अपनी पात्रता जांचें' : 'Check your eligibility'}
            </h1>
            <p className="text-xs font-mono text-ink-soft mt-1">
              {lang === 'hi' 
                ? 'कुछ प्रश्नों के उत्तर दें और हम आपकी प्रोफ़ाइल से मेल खाती योजनाएं खोजेंगे।' 
                : 'Answer a few questions and we\'ll find schemes matched to your profile.'}
            </p>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex justify-between items-center text-xs font-mono font-bold text-navy">
            <span>{lang === 'hi' ? `चरण ${step} / 6` : `STEP ${step} OF 6`}</span>
            <span className="text-terracotta">
              {step === 1 && (lang === 'hi' ? 'बुनियादी विवरण' : 'Basic Details')}
              {step === 2 && (lang === 'hi' ? 'स्थान' : 'Location')}
              {step === 3 && (lang === 'hi' ? 'व्यवसाय' : 'Occupation')}
              {step === 4 && (lang === 'hi' ? 'वार्षिक आय' : 'Annual Income')}
              {step === 5 && (lang === 'hi' ? 'सामाजिक वर्ग' : 'Category & Status')}
              {step === 6 && (lang === 'hi' ? 'अतिरिक्त विवरण' : 'Additional Conditions')}
            </span>
          </div>

          {/* Stepper Nodes */}
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-cream border-t border-navy/15 -translate-y-1/2 z-0" />
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div 
                key={s} 
                className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                  s < step 
                    ? 'bg-teal text-paper shadow' 
                    : s === step 
                    ? 'bg-marigold text-navy ring-4 ring-marigold/30 shadow-md scale-110' 
                    : 'bg-paper text-navy/40 border border-navy/20'
                }`}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
            ))}
          </div>

          <div className="w-full bg-cream border border-navy/15 h-2.5 rounded-full overflow-hidden p-0.5">
            <div 
              className="bg-gradient-to-r from-marigold via-terracotta to-teal-deep h-full rounded-full transition-all duration-500" 
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-rust/10 border border-rust/30 text-rust text-xs font-mono p-3.5 rounded-lg mb-6 flex items-center gap-2 shake-input">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* MULTI-STEP SLIDE CONTENT CONTAINER */}
        <div key={step} className={slideDirection === 'next' ? 'step-enter-next' : 'step-enter-prev'}>
          {/* STEP 1: BASIC DETAILS */}
          {step === 1 && (
            <div className="space-y-6 font-sans">
              <div>
                <h3 className="font-serif font-bold text-xl text-navy flex items-center gap-2 mb-1">
                  <User className="w-5 h-5 text-teal" />
                  <span>{lang === 'hi' ? 'चरण 1: बुनियादी विवरण' : 'Step 1: Basic Details'}</span>
                </h3>
                <p className="text-xs text-ink-soft">{lang === 'hi' ? 'आपकी आयु और लिंग योजना की पात्रता निर्धारित करते हैं।' : 'Your age and gender help determine age-restricted welfare schemes.'}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono font-bold text-navy mb-2">
                    {lang === 'hi' ? 'आपकी आयु कितनी है?*' : 'What is your age?*'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="120"
                      placeholder="e.g. 25"
                      value={profile.age || ''}
                      onChange={(e) => updateProfileField('age', parseInt(e.target.value) || '')}
                      className="w-full bg-paper border border-navy/20 rounded-xl p-3.5 text-sm font-medium focus:outline-none focus:border-marigold focus:ring-1 focus:ring-marigold transition-all"
                    />
                    {profile.age > 0 && (
                      <span className="absolute right-3.5 top-3.5 text-teal scale-check-spring">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-navy mb-2">
                    {lang === 'hi' ? 'आपका लिंग क्या है?*' : 'What is your gender?*'}
                  </label>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    {['Male', 'Female', 'Other', 'Prefer not to say'].map((gen) => (
                      <button
                        key={gen}
                        type="button"
                        onClick={() => updateProfileField('gender', gen)}
                        className={`p-3.5 rounded-xl border text-center font-bold transition-all card-hover-effect flex items-center justify-center gap-2 ${
                          profile.gender === gen
                            ? 'bg-navy text-paper border-navy shadow-md scale-[1.02]'
                            : 'bg-paper text-navy border-navy/15 hover:border-navy/40'
                        }`}
                      >
                        <span>
                          {gen === 'Male' && (lang === 'hi' ? 'पुरुष' : 'Male')}
                          {gen === 'Female' && (lang === 'hi' ? 'महिला' : 'Female')}
                          {gen === 'Other' && (lang === 'hi' ? 'अन्य' : 'Other')}
                          {gen === 'Prefer not to say' && (lang === 'hi' ? 'नहीं बताना चाहते' : 'Prefer not to say')}
                        </span>
                        {profile.gender === gen && (
                          <span className="scale-check-spring text-marigold">
                            <Check className="w-4 h-4" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="space-y-6 font-sans">
              <div>
                <h3 className="font-serif font-bold text-xl text-navy flex items-center gap-2 mb-1">
                  <MapPin className="w-5 h-5 text-teal" />
                  <span>{lang === 'hi' ? 'चरण 2: स्थान' : 'Step 2: Location'}</span>
                </h3>
                <p className="text-xs text-ink-soft">{lang === 'hi' ? 'कई योजनाएं विशेष राज्यों या ग्रामीण/शहरी निवासियों के लिए होती हैं।' : 'State and area residency determine regional benefit eligibility.'}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono font-bold text-navy mb-2">
                    {lang === 'hi' ? 'आप वर्तमान में किस राज्य में रहते हैं?*' : 'Where do you currently live? (State)*'}
                  </label>
                  <select
                    value={profile.state}
                    onChange={(e) => updateProfileField('state', e.target.value)}
                    className="w-full bg-paper border border-navy/20 rounded-xl p-3.5 text-sm font-medium focus:outline-none focus:border-marigold"
                  >
                    {indianStates.map((st) => (
                      <option key={st} value={st}>{st === 'All India' ? t('allStates') : st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-navy mb-2">
                    {lang === 'hi' ? 'जिला (District)' : 'District'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lucknow / Varanasi"
                    value={profile.district || ''}
                    onChange={(e) => updateProfileField('district', e.target.value)}
                    className="w-full bg-paper border border-navy/20 rounded-xl p-3.5 text-sm font-medium focus:outline-none focus:border-marigold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-bold text-navy mb-2">
                    {lang === 'hi' ? 'शहरी या ग्रामीण? (Urban or Rural)' : 'Urban or Rural residency?'}
                  </label>
                  <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => updateProfileField('rural_resident', false)}
                      className={`p-4 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all card-hover-effect ${
                        !profile.rural_resident
                          ? 'bg-navy text-paper border-navy shadow-md scale-[1.02]'
                          : 'bg-paper text-navy border-navy/15 hover:border-navy/40'
                      }`}
                    >
                      <span>🏢 {lang === 'hi' ? 'शहरी (Urban)' : 'Urban Resident'}</span>
                      {!profile.rural_resident && <Check className="w-4 h-4 text-marigold scale-check-spring" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateProfileField('rural_resident', true)}
                      className={`p-4 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all card-hover-effect ${
                        profile.rural_resident
                          ? 'bg-navy text-paper border-navy shadow-md scale-[1.02]'
                          : 'bg-paper text-navy border-navy/15 hover:border-navy/40'
                      }`}
                    >
                      <span>🌾 {lang === 'hi' ? 'ग्रामीण (Rural)' : 'Rural Resident'}</span>
                      {profile.rural_resident && <Check className="w-4 h-4 text-marigold scale-check-spring" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: OCCUPATION */}
          {step === 3 && (
            <div className="space-y-6 font-sans">
              <div>
                <h3 className="font-serif font-bold text-xl text-navy flex items-center gap-2 mb-1">
                  <Briefcase className="w-5 h-5 text-teal" />
                  <span>{lang === 'hi' ? 'चरण 3: व्यवसाय' : 'Step 3: Occupation'}</span>
                </h3>
                <p className="text-xs text-ink-soft">{lang === 'hi' ? 'आपकी आजीविका का प्रकार संबंधित योजनाओं का सही मिलान करता है।' : 'Select the card that best describes your primary occupation.'}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {occupationsList.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      updateProfileField('occupation', item.id);
                      if (item.id === 'Student') updateProfileField('student', true);
                      if (item.id === 'Farmer') updateProfileField('farmer', true);
                    }}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer card-hover-effect ${
                      profile.occupation === item.id
                        ? 'bg-navy text-paper border-navy shadow-lg scale-[1.02]'
                        : 'bg-paper text-navy border-navy/15 hover:border-navy/40'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-2xl">{item.icon}</span>
                      {profile.occupation === item.id && <Check className="w-4 h-4 text-marigold scale-check-spring" />}
                    </div>
                    <div className="mt-3">
                      <div className="font-serif font-bold text-sm">{item.label}</div>
                      <div className={`text-[11px] mt-0.5 leading-tight ${profile.occupation === item.id ? 'text-cream-2/80' : 'text-ink-soft'}`}>
                        {item.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: INCOME */}
          {step === 4 && (
            <div className="space-y-6 font-sans">
              <div>
                <h3 className="font-serif font-bold text-xl text-navy flex items-center gap-2 mb-1">
                  <IndianRupee className="w-5 h-5 text-teal" />
                  <span>{lang === 'hi' ? 'चरण 4: वार्षिक परिवार आय' : 'Step 4: Household Income'}</span>
                </h3>
                <p className="text-xs text-ink-soft">{lang === 'hi' ? 'सरकारी योजनाएं आय सीमा के आधार पर वित्तीय सहायता प्रदान करती हैं।' : 'Select your approximate annual household income tier.'}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {incomeTiers.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => updateProfileField('annual_income', tier.value)}
                    className={`p-5 rounded-xl border text-left transition-all cursor-pointer card-hover-effect ${
                      profile.annual_income === tier.value
                        ? 'bg-navy text-paper border-navy shadow-lg scale-[1.02]'
                        : 'bg-paper text-navy border-navy/15 hover:border-navy/40'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-serif font-bold text-base">{tier.label}</span>
                      {profile.annual_income === tier.value && <Check className="w-4 h-4 text-marigold scale-check-spring" />}
                    </div>
                    <div className={`font-mono text-xs ${profile.annual_income === tier.value ? 'text-marigold' : 'text-terracotta'}`}>
                      {tier.text}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: SOCIAL CATEGORY & ELIGIBILITY */}
          {step === 5 && (
            <div className="space-y-6 font-sans">
              <div>
                <h3 className="font-serif font-bold text-xl text-navy flex items-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-teal" />
                  <span>{lang === 'hi' ? 'चरण 5: सामाजिक वर्ग एवं श्रेणी' : 'Step 5: Category & Social Details'}</span>
                </h3>
                <p className="text-xs text-ink-soft">{lang === 'hi' ? 'ये प्रश्न लक्षित आरक्षण व छात्रवृत्ति योजनाओं की खोज में मदद करते हैं।' : 'Social categories help match targeted welfare scholarships and subsidies.'}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-mono font-bold text-navy mb-2">
                    {lang === 'hi' ? 'आपकी सामाजिक श्रेणी क्या है?*' : 'Social Category*'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => updateProfileField('category', cat)}
                        className={`p-3 rounded-xl border text-center font-bold transition-all card-hover-effect flex items-center justify-center gap-1.5 ${
                          profile.category === cat
                            ? 'bg-navy text-paper border-navy shadow-md scale-[1.02]'
                            : 'bg-paper text-navy border-navy/15 hover:border-navy/40'
                        }`}
                      >
                        <span>{cat}</span>
                        {profile.category === cat && <Check className="w-3.5 h-3.5 text-marigold scale-check-spring" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-4 bg-paper border border-navy/15 rounded-xl space-y-2">
                    <span className="font-bold text-navy block">{lang === 'hi' ? 'दिव्यांगता (Disability)?' : 'Differently Abled (PwD)?'}</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateProfileField('disability_status', true)}
                        className={`py-2 rounded-lg border font-bold transition-all ${profile.disability_status ? 'bg-teal text-paper border-teal shadow' : 'bg-cream/50 text-navy border-navy/15'}`}
                      >
                        {lang === 'hi' ? 'हाँ (Yes)' : 'Yes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => updateProfileField('disability_status', false)}
                        className={`py-2 rounded-lg border font-bold transition-all ${!profile.disability_status ? 'bg-navy text-paper border-navy shadow' : 'bg-cream/50 text-navy border-navy/15'}`}
                      >
                        {lang === 'hi' ? 'नहीं (No)' : 'No'}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-paper border border-navy/15 rounded-xl space-y-2">
                    <span className="font-bold text-navy block">{lang === 'hi' ? 'गरीबी रेखा (BPL)?' : 'BPL Card Holder?'}</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateProfileField('bpl', true)}
                        className={`py-2 rounded-lg border font-bold transition-all ${profile.bpl ? 'bg-teal text-paper border-teal shadow' : 'bg-cream/50 text-navy border-navy/15'}`}
                      >
                        {lang === 'hi' ? 'हाँ (Yes)' : 'Yes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => updateProfileField('bpl', false)}
                        className={`py-2 rounded-lg border font-bold transition-all ${!profile.bpl ? 'bg-navy text-paper border-navy shadow' : 'bg-cream/50 text-navy border-navy/15'}`}
                      >
                        {lang === 'hi' ? 'नहीं (No)' : 'No'}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-paper border border-navy/15 rounded-xl space-y-2">
                    <span className="font-bold text-navy block">{lang === 'hi' ? 'वरिष्ठ नागरिक (Senior)?' : 'Senior Citizen (60+)?'}</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateProfileField('senior_citizen', true)}
                        className={`py-2 rounded-lg border font-bold transition-all ${profile.senior_citizen ? 'bg-teal text-paper border-teal shadow' : 'bg-cream/50 text-navy border-navy/15'}`}
                      >
                        {lang === 'hi' ? 'हाँ (Yes)' : 'Yes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => updateProfileField('senior_citizen', false)}
                        className={`py-2 rounded-lg border font-bold transition-all ${!profile.senior_citizen ? 'bg-navy text-paper border-navy shadow' : 'bg-cream/50 text-navy border-navy/15'}`}
                      >
                        {lang === 'hi' ? 'नहीं (No)' : 'No'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: ADDITIONAL CONDITIONS */}
          {step === 6 && (
            <div className="space-y-6 font-sans">
              <div>
                <h3 className="font-serif font-bold text-xl text-navy flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-teal" />
                  <span>{lang === 'hi' ? 'चरण 6: अतिरिक्त स्थितियां' : 'Step 6: Additional Conditions'}</span>
                </h3>
                <p className="text-xs text-ink-soft">{lang === 'hi' ? 'अपनी स्थिति से मेल खाने वाली विशेष शर्तें चुनें:' : 'Select all conditions that apply to you or your household:'}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                {[
                  { key: 'student', label: lang === 'hi' ? 'क्या आप छात्र हैं? (Student)' : 'Are you currently a student?' },
                  { key: 'farmer', label: lang === 'hi' ? 'क्या आप किसान हैं? (Farmer)' : 'Are you a farmer or landowner?' },
                  { key: 'entrepreneur', label: lang === 'hi' ? 'क्या आप छोटा व्यवसाय चलाते हैं?' : 'Do you own or plan a business?' },
                  { key: 'widow', label: lang === 'hi' ? 'विधवा पेंशन योजना श्रेणी?' : 'Widow pension criteria applicable?' },
                  { key: 'pregnant', label: lang === 'hi' ? 'गर्भवती / धात्री महिला?' : 'Maternity benefits applicable?' },
                  { key: 'rural_resident', label: lang === 'hi' ? 'ग्रामीण क्षेत्र का निवास प्रमाणपत्र?' : 'Rural domicile documentation?' },
                ].map(({ key, label }) => (
                  <label 
                    key={key} 
                    className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all card-hover-effect ${
                      profile[key] 
                        ? 'bg-teal/15 border-teal text-teal-deep font-bold shadow-sm scale-[1.01]' 
                        : 'bg-paper border-navy/15 text-navy hover:border-navy/30'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!profile[key]}
                      onChange={(e) => updateProfileField(key, e.target.checked)}
                      className="w-4 h-4 accent-teal"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Actions Footer */}
        <div className="mt-10 pt-6 border-t border-navy/15 flex items-center justify-between">
          {step > 1 ? (
            <button type="button" onClick={handlePrev} className="btn-ghost text-xs py-2.5 px-5 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>{t('btnBack')}</span>
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button type="button" onClick={handleNext} className="btn-primary btn-shine text-xs py-3 px-6 flex items-center gap-2">
              <span>{t('btnNext')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handleSubmit} 
              disabled={loading || isMatching} 
              className="btn-primary btn-shine big text-sm font-semibold flex items-center gap-2 py-3.5 px-8"
            >
              {loading || isMatching ? (
                <span>{lang === 'hi' ? 'मूल्यांकन जारी...' : 'Evaluating Matches...'}</span>
              ) : (
                <>
                  <span>{lang === 'hi' ? 'मेरी योजनाएं खोजें →' : 'Find My Schemes →'}</span>
                  <CheckCircle2 className="w-4 h-4 text-marigold animate-pulse" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EligibilityWizard;
