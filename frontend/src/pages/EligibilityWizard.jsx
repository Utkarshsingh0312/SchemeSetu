import React, { useState } from 'react';
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
  const [error, setError] = useState('');
  const [isMatching, setIsMatching] = useState(false);

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

    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setError('');
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
      }, 1400);
    } catch (err) {
      setIsMatching(false);
      setError(lang === 'hi' ? 'पात्रता जांचने में त्रुटि। कृपया पुनः प्रयास करें।' : 'Failed to calculate scheme matches. Please try again.');
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 max-w-4xl mx-auto relative">
      <DisclaimerBanner />

      {/* FULL MATCHING OVERLAY */}
      {isMatching && (
        <div className="fixed inset-0 z-50 bg-navy/90 backdrop-blur-md flex flex-col items-center justify-center text-paper p-6 animate-fade-in">
          <div className="w-20 h-20 rounded-full border-4 border-marigold border-t-transparent animate-spin flex items-center justify-center mb-6 shadow-2xl">
            <Sparkles className="w-8 h-8 text-marigold" />
          </div>
          <h2 className="font-serif font-bold text-3xl text-center mb-2">
            {lang === 'hi' ? 'आपकी प्रोफ़ाइल का मिलान किया जा रहा है...' : 'Matching your profile...'}
          </h2>
          <p className="text-sm font-mono text-cream-2/80 text-center max-w-md">
            {lang === 'hi' 
              ? 'उपलब्ध 894+ केंद्रीय और राज्य योजनाओं के नियमों से आपकी पात्रता जांची जा रही है...' 
              : 'Checking eligibility across 894+ available central and state welfare schemes...'}
          </p>
          <div className="mt-8 flex items-center gap-2 text-xs font-mono text-marigold bg-navy/80 px-4 py-2 rounded-full border border-marigold/30">
            <CheckCircle2 className="w-4 h-4 text-marigold" />
            <span>{lang === 'hi' ? 'नियम-आधारित मूल्यांकन जारी' : 'Evaluating precise eligibility criteria'}</span>
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
        <div className="mb-8 space-y-3">
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

          <div className="w-full bg-cream border border-navy/15 h-3 rounded-full overflow-hidden p-0.5">
            <div 
              className="bg-gradient-to-r from-marigold to-teal-deep h-full rounded-full transition-all duration-500" 
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-rust/10 border border-rust/30 text-rust text-xs font-mono p-3.5 rounded-lg mb-6 flex items-center gap-2 animate-fade-in">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

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
                <input
                  type="number"
                  min="1"
                  max="120"
                  placeholder="e.g. 25"
                  value={profile.age || ''}
                  onChange={(e) => updateProfileField('age', parseInt(e.target.value) || '')}
                  className="w-full bg-paper border border-navy/20 rounded-xl p-3.5 text-sm font-medium focus:outline-none focus:border-marigold focus:ring-1 focus:ring-marigold"
                />
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
                      className={`p-3 rounded-xl border text-center font-bold transition-all ${
                        profile.gender === gen
                          ? 'bg-navy text-paper border-navy shadow-md'
                          : 'bg-paper text-navy border-navy/15 hover:border-navy/40'
                      }`}
                    >
                      {gen === 'Male' && (lang === 'hi' ? 'पुरुष' : 'Male')}
                      {gen === 'Female' && (lang === 'hi' ? 'महिला' : 'Female')}
                      {gen === 'Other' && (lang === 'hi' ? 'अन्य' : 'Other')}
                      {gen === 'Prefer not to say' && (lang === 'hi' ? 'नहीं बताना चाहते' : 'Prefer not to say')}
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
                    className={`p-4 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                      !profile.rural_resident
                        ? 'bg-navy text-paper border-navy shadow-md'
                        : 'bg-paper text-navy border-navy/15 hover:border-navy/40'
                    }`}
                  >
                    🏢 {lang === 'hi' ? 'शहरी (Urban)' : 'Urban Resident'}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateProfileField('rural_resident', true)}
                    className={`p-4 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                      profile.rural_resident
                        ? 'bg-navy text-paper border-navy shadow-md'
                        : 'bg-paper text-navy border-navy/15 hover:border-navy/40'
                    }`}
                  >
                    🌾 {lang === 'hi' ? 'ग्रामीण (Rural)' : 'Rural Resident'}
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
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    profile.occupation === item.id
                      ? 'bg-navy text-paper border-navy shadow-lg scale-[1.02]'
                      : 'bg-paper text-navy border-navy/15 hover:border-navy/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-2xl">{item.icon}</span>
                    {profile.occupation === item.id && <Check className="w-4 h-4 text-marigold" />}
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
                  className={`p-5 rounded-xl border text-left transition-all cursor-pointer ${
                    profile.annual_income === tier.value
                      ? 'bg-navy text-paper border-navy shadow-lg scale-[1.02]'
                      : 'bg-paper text-navy border-navy/15 hover:border-navy/40'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-serif font-bold text-base">{tier.label}</span>
                    {profile.annual_income === tier.value && <Check className="w-4 h-4 text-marigold" />}
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
              {/* Category */}
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
                      className={`p-3 rounded-xl border text-center font-bold transition-all ${
                        profile.category === cat
                          ? 'bg-navy text-paper border-navy shadow-md'
                          : 'bg-paper text-navy border-navy/15 hover:border-navy/40'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Disability & BPL Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                {/* Disability */}
                <div className="p-4 bg-paper border border-navy/15 rounded-xl space-y-2">
                  <span className="font-bold text-navy block">{lang === 'hi' ? 'दिव्यांगता (Disability)?' : 'Differently Abled (PwD)?'}</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateProfileField('disability_status', true)}
                      className={`py-2 rounded-lg border font-bold ${profile.disability_status ? 'bg-teal text-paper border-teal' : 'bg-cream/50 text-navy border-navy/15'}`}
                    >
                      {lang === 'hi' ? 'हाँ (Yes)' : 'Yes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateProfileField('disability_status', false)}
                      className={`py-2 rounded-lg border font-bold ${!profile.disability_status ? 'bg-navy text-paper border-navy' : 'bg-cream/50 text-navy border-navy/15'}`}
                    >
                      {lang === 'hi' ? 'नहीं (No)' : 'No'}
                    </button>
                  </div>
                </div>

                {/* BPL */}
                <div className="p-4 bg-paper border border-navy/15 rounded-xl space-y-2">
                  <span className="font-bold text-navy block">{lang === 'hi' ? 'गरीबी रेखा (BPL)?' : 'BPL Card Holder?'}</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateProfileField('bpl', true)}
                      className={`py-2 rounded-lg border font-bold ${profile.bpl ? 'bg-teal text-paper border-teal' : 'bg-cream/50 text-navy border-navy/15'}`}
                    >
                      {lang === 'hi' ? 'हाँ (Yes)' : 'Yes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateProfileField('bpl', false)}
                      className={`py-2 rounded-lg border font-bold ${!profile.bpl ? 'bg-navy text-paper border-navy' : 'bg-cream/50 text-navy border-navy/15'}`}
                    >
                      {lang === 'hi' ? 'नहीं (No)' : 'No'}
                    </button>
                  </div>
                </div>

                {/* Senior Citizen */}
                <div className="p-4 bg-paper border border-navy/15 rounded-xl space-y-2">
                  <span className="font-bold text-navy block">{lang === 'hi' ? 'वरिष्ठ नागरिक (Senior)?' : 'Senior Citizen (60+)?'}</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateProfileField('senior_citizen', true)}
                      className={`py-2 rounded-lg border font-bold ${profile.senior_citizen ? 'bg-teal text-paper border-teal' : 'bg-cream/50 text-navy border-navy/15'}`}
                    >
                      {lang === 'hi' ? 'हाँ (Yes)' : 'Yes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateProfileField('senior_citizen', false)}
                      className={`py-2 rounded-lg border font-bold ${!profile.senior_citizen ? 'bg-navy text-paper border-navy' : 'bg-cream/50 text-navy border-navy/15'}`}
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
                  className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                    profile[key] 
                      ? 'bg-teal/15 border-teal text-teal-deep font-bold shadow-sm' 
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
            <button type="button" onClick={handleNext} className="btn-primary text-xs py-3 px-6 flex items-center gap-2">
              <span>{t('btnNext')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handleSubmit} 
              disabled={loading || isMatching} 
              className="btn-primary big text-sm font-semibold flex items-center gap-2 py-3.5 px-8"
            >
              {loading || isMatching ? (
                <span>{lang === 'hi' ? 'मूल्यांकन जारी...' : 'Evaluating Matches...'}</span>
              ) : (
                <>
                  <span>{lang === 'hi' ? 'मेरी योजनाएं खोजें →' : 'Find My Schemes →'}</span>
                  <CheckCircle2 className="w-4 h-4 text-marigold" />
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
