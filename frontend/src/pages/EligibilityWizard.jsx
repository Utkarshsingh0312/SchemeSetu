import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEligibility } from '../context/EligibilityContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { ArrowLeft, ArrowRight, CheckCircle2, UserCheck, ShieldCheck } from 'lucide-react';

export const EligibilityWizard = () => {
  const navigate = useNavigate();
  const { profile, updateProfileField, runEligibilityCheck, loading } = useEligibility();
  const { lang, t } = useLanguage();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const indianStates = [
    "All India", "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"
  ];

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!profile.age || profile.age <= 0) {
        setError(lang === 'hi' ? 'कृपया जारी रखने के लिए अपनी आयु दर्ज करें।' : 'Please enter your age to continue.');
        return;
      }
      if (!profile.state) {
        setError(lang === 'hi' ? 'कृपया जारी रखने के लिए अपना राज्य चुनें।' : 'Please select your state to continue.');
        return;
      }
    }
    if (step === 2) {
      if (profile.annual_income === '' || profile.annual_income < 0) {
        setError(lang === 'hi' ? 'कृपया जारी रखने के लिए अपनी वार्षिक आय दर्ज करें।' : 'Please enter your annual household income to continue.');
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
    const results = await runEligibilityCheck();
    addToast(lang === 'hi' ? "✓ योजना डेटाबेस के विरुद्ध पात्रता का मूल्यांकन किया गया!" : "✓ Eligibility evaluated against scheme database!", "success");
    navigate('/results');
  };

  const stepTitles = [t('step1'), t('step2'), t('step3'), t('step4')];

  return (
    <div className="min-h-screen py-10 px-4 max-w-3xl mx-auto">
      <DisclaimerBanner />

      <div className="bg-card border border-navy/20 rounded-lg p-6 sm:p-10 shadow-xl my-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-navy/15">
          <div>
            <div className="eyebrow mb-1">{t('wizardTitle')}</div>
            <h1 className="font-serif font-bold text-3xl text-navy">{t('wizardTitle')}</h1>
            <p className="text-xs font-mono text-ink-soft mt-1">{t('wizardSubtext')}</p>
          </div>
        </div>

        {/* Progress Bar & Stepper */}
        <div className="mb-8 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono font-bold text-navy">
            <span>{lang === 'hi' ? `चरण ${step} / 4` : `STEP ${step} OF 4`}</span>
            <span className="text-gold-deep">{stepTitles[step - 1]}</span>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-4 gap-2 font-mono text-[11px]">
            {stepTitles.map((title, i) => (
              <div 
                key={i}
                className={`py-1.5 text-center rounded border transition-all ${
                  step === i + 1
                    ? 'bg-navy text-paper font-bold border-navy'
                    : step > i + 1
                    ? 'bg-teal/15 text-teal-deep border-teal/30 font-semibold'
                    : 'bg-paper text-navy/40 border-navy/15'
                }`}
              >
                {title}
              </div>
            ))}
          </div>

          <div className="w-full bg-paper border border-navy/15 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-teal h-full transition-all duration-500" 
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {error && (
          <div className="bg-rust/10 border border-rust/30 text-rust text-xs font-mono p-3 rounded mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* Step 1: Basic Details */}
        {step === 1 && (
          <div className="space-y-6 font-sans">
            <h3 className="font-serif font-bold text-xl text-navy">{t('step1')}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono font-bold text-navy mb-2">{t('labelAge')}*</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={profile.age}
                  onChange={(e) => updateProfileField('age', parseInt(e.target.value) || '')}
                  className="w-full bg-paper border border-navy/20 rounded-md p-3 text-sm font-medium focus:outline-none focus:border-gold-deep"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-navy mb-2">{t('labelGender')}*</label>
                <select
                  value={profile.gender}
                  onChange={(e) => updateProfileField('gender', e.target.value)}
                  className="w-full bg-paper border border-navy/20 rounded-md p-3 text-sm font-medium focus:outline-none focus:border-gold-deep"
                >
                  <option value="Male">{t('optMale')}</option>
                  <option value="Female">{t('optFemale')}</option>
                  <option value="Other">{t('optTransgender')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-navy mb-2">{t('labelState')}*</label>
                <select
                  value={profile.state}
                  onChange={(e) => updateProfileField('state', e.target.value)}
                  className="w-full bg-paper border border-navy/20 rounded-md p-3 text-sm font-medium focus:outline-none focus:border-gold-deep"
                >
                  {indianStates.map((st) => (
                    <option key={st} value={st}>{st === 'All India' ? t('allStates') : st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-navy mb-2">{t('labelDistrict')}</label>
                <input
                  type="text"
                  placeholder="e.g. Lucknow"
                  value={profile.district}
                  onChange={(e) => updateProfileField('district', e.target.value)}
                  className="w-full bg-paper border border-navy/20 rounded-md p-3 text-sm font-medium focus:outline-none focus:border-gold-deep"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Economic Status */}
        {step === 2 && (
          <div className="space-y-6 font-sans">
            <h3 className="font-serif font-bold text-xl text-navy">{t('step2')}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono font-bold text-navy mb-2">{t('labelIncome')}*</label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={profile.annual_income}
                  onChange={(e) => updateProfileField('annual_income', parseFloat(e.target.value) || 0)}
                  className="w-full bg-paper border border-navy/20 rounded-md p-3 text-sm font-medium focus:outline-none focus:border-gold-deep"
                />
                <span className="text-[11.5px] font-mono text-ink-soft mt-1.5 block">
                  {lang === 'hi' ? 'आय स्तर:' : 'Income level:'} <b>₹{Number(profile.annual_income).toLocaleString('en-IN')} / {lang === 'hi' ? 'वर्ष' : 'year'}</b>
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-navy mb-2">{t('labelOccupation')}*</label>
                <select
                  value={profile.occupation}
                  onChange={(e) => updateProfileField('occupation', e.target.value)}
                  className="w-full bg-paper border border-navy/20 rounded-md p-3 text-sm font-medium focus:outline-none focus:border-gold-deep"
                >
                  <option value="Student">{t('optStudent')}</option>
                  <option value="Farmer">{t('optFarmer')}</option>
                  <option value="Unemployed">{t('optUnemployed')}</option>
                  <option value="Self Employed">{t('optSelfEmployed')}</option>
                  <option value="Artisan">{t('optArtisan')}</option>
                  <option value="Government Employee">{t('optSalaried')}</option>
                  <option value="Retired">{t('optRetired')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-navy mb-2">{t('labelEmployment')}*</label>
                <select
                  value={profile.employment_status}
                  onChange={(e) => updateProfileField('employment_status', e.target.value)}
                  className="w-full bg-paper border border-navy/20 rounded-md p-3 text-sm font-medium focus:outline-none focus:border-gold-deep"
                >
                  <option value="Employed">{t('optSalaried')}</option>
                  <option value="Self Employed">{t('optSelfEmployed')}</option>
                  <option value="Unemployed">{t('optUnemployed')}</option>
                  <option value="Student">{t('optStudent')}</option>
                  <option value="Retired">{t('optRetired')}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Social Category */}
        {step === 3 && (
          <div className="space-y-6 font-sans">
            <h3 className="font-serif font-bold text-xl text-navy">{t('step3')}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono font-bold text-navy mb-2">{t('labelCategory')}*</label>
                <select
                  value={profile.category}
                  onChange={(e) => updateProfileField('category', e.target.value)}
                  className="w-full bg-paper border border-navy/20 rounded-md p-3 text-sm font-medium focus:outline-none focus:border-gold-deep"
                >
                  <option value="General">{t('optGeneral')}</option>
                  <option value="OBC">{t('optOBC')}</option>
                  <option value="SC">{t('optSC')}</option>
                  <option value="ST">{t('optST')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-navy mb-2">{t('labelMarital')}</label>
                <select
                  value={profile.marital_status}
                  onChange={(e) => updateProfileField('marital_status', e.target.value)}
                  className="w-full bg-paper border border-navy/20 rounded-md p-3 text-sm font-medium focus:outline-none focus:border-gold-deep"
                >
                  <option value="Single">{t('optSingle')}</option>
                  <option value="Married">{t('optMarried')}</option>
                  <option value="Widowed">{t('optWidow')}</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-3 p-4 bg-paper border border-navy/15 rounded-md cursor-pointer hover:border-gold-deep transition-colors">
                  <input
                    type="checkbox"
                    checked={profile.disability_status}
                    onChange={(e) => updateProfileField('disability_status', e.target.checked)}
                    className="w-4 h-4 text-teal accent-teal"
                  />
                  <span className="text-xs font-mono text-navy font-bold">{t('labelDisability')}</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Special Conditions */}
        {step === 4 && (
          <div className="space-y-6 font-sans">
            <h3 className="font-serif font-bold text-xl text-navy">{t('step4')}</h3>
            <p className="text-xs text-ink-soft">{lang === 'hi' ? 'अपनी स्थिति से मेल खाने वाली शर्तें चुनें:' : 'Select all conditions that apply to you or your household:'}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              {[
                { key: 'student', label: t('specialStudent') },
                { key: 'farmer', label: t('specialFarmer') },
                { key: 'bpl', label: t('specialBpl') },
                { key: 'senior_citizen', label: t('specialSenior') },
                { key: 'widow', label: t('specialWidow') },
                { key: 'pregnant', label: t('specialPregnant') },
                { key: 'rural_resident', label: t('specialRural') },
                { key: 'entrepreneur', label: t('specialEntrepreneur') },
              ].map(({ key, label }) => (
                <label key={key} className={`flex items-center gap-3 p-4 border rounded-md cursor-pointer transition-all ${profile[key] ? 'bg-teal/10 border-teal text-teal-deep font-bold shadow-sm' : 'bg-paper border-navy/15 text-navy hover:border-navy/30'}`}>
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

        {/* Navigation Actions */}
        <div className="mt-10 pt-6 border-t border-navy/15 flex items-center justify-between">
          {step > 1 ? (
            <button onClick={handlePrev} className="btn-ghost text-xs py-2.5 px-4 flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('btnBack')}</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button onClick={handleNext} className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2">
              <span>{t('btnNext')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="btn-primary big text-sm font-semibold flex items-center gap-2">
              {loading ? (
                <span>{t('btnEvaluating')}</span>
              ) : (
                <>
                  <span>{t('btnSubmit')}</span>
                  <CheckCircle2 className="w-4 h-4 text-gold" />
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
