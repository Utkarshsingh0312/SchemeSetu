import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEligibility } from '../context/EligibilityContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle2, UserCheck, ShieldCheck } from 'lucide-react';

export const EligibilityWizard = () => {
  const navigate = useNavigate();
  const { profile, updateProfileField, loadDemoProfile, runEligibilityCheck, loading } = useEligibility();
  const { t } = useLanguage();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const indianStates = [
    "All India", "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"
  ];

  const occupations = [
    "Student", "Farmer", "Unemployed", "Self Employed", "Street Vendor", "Artisan", 
    "Government Employee", "Private Sector Employee", "Daily Wage Laborer", "Homemaker", "Other"
  ];

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!profile.age || profile.age <= 0) {
        setError('Please enter your age to continue.');
        return;
      }
      if (!profile.state) {
        setError('Please select your state to continue.');
        return;
      }
    }
    if (step === 2) {
      if (profile.annual_income === '' || profile.annual_income < 0) {
        setError('Please enter your annual household income to continue.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleDemoClick = () => {
    loadDemoProfile();
    setStep(1);
    setError('');
    addToast("✓ Demo Profile loaded: Ramesh Kumar (Age 22, UP, Student)", "success");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const results = await runEligibilityCheck();
    addToast("✓ Eligibility evaluated against scheme database!", "success");
    navigate('/results');
  };

  const stepTitles = ["Basic", "Economic", "Social", "Special"];

  return (
    <div className="min-h-screen py-10 px-4 max-w-3xl mx-auto">
      <DisclaimerBanner />

      <div className="bg-card border border-navy/20 rounded-lg p-6 sm:p-10 shadow-xl my-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-navy/15">
          <div>
            <div className="eyebrow mb-1">Citizen Eligibility Wizard</div>
            <h1 className="font-serif font-bold text-3xl text-navy">LET'S FIND WHAT YOU QUALIFY FOR.</h1>
            <p className="text-xs font-mono text-ink-soft mt-1">Tell us a little about yourself. This takes about 2 minutes.</p>
          </div>

          <button 
            type="button"
            onClick={handleDemoClick}
            className="btn-ghost text-xs py-2.5 px-4 border-teal/40 text-teal-deep flex items-center gap-1.5 font-mono font-bold hover:bg-teal/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-deep" />
            <span>TRY DEMO PROFILE</span>
          </button>
        </div>

        {/* Progress Bar & Stepper */}
        <div className="mb-8 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono font-bold text-navy">
            <span>STEP {step} OF 4</span>
            <span className="text-gold-deep">{stepTitles[step - 1]} Information</span>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-4 gap-2 font-mono text-[11px]">
            {stepTitles.map((title, i) => (
              <div 
                key={title}
                className={`py-1.5 text-center rounded border transition-all ${
                  step === i + 1
                    ? 'bg-navy text-paper font-bold border-navy'
                    : step > i + 1
                    ? 'bg-teal/15 text-teal-deep border-teal/30 font-semibold'
                    : 'bg-paper text-navy/40 border-navy/15'
                }`}
              >
                {i + 1}. {title}
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
            <h3 className="font-serif font-bold text-xl text-navy">Step 1: Basic Demographic Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono font-bold text-navy mb-2">What's your age? (Years)*</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={profile.age}
                  onChange={(e) => updateProfileField('age', parseInt(e.target.value) || '')}
                  className="w-full bg-paper border border-navy/20 rounded-md p-3 text.sm font-medium focus:outline-none focus:border-gold-deep"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-navy mb-2">Gender*</label>
                <select
                  value={profile.gender}
                  onChange={(e) => updateProfileField('gender', e.target.value)}
                  className="w-full bg-paper border border-navy/20 rounded-md p-3 text-sm font-medium focus:outline-none focus:border-gold-deep"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other / Transgender</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-navy mb-2">Where do you live? (State)*</label>
                <select
                  value={profile.state}
                  onChange={(e) => updateProfileField('state', e.target.value)}
                  className="w-full bg-paper border border-navy/20 rounded-md p-3 text-sm font-medium focus:outline-none focus:border-gold-deep"
                >
                  {indianStates.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-navy mb-2">District (Optional)</label>
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
            <h3 className="font-serif font-bold text-xl text-navy">Step 2: Economic &amp; Income Status</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono font-bold text-navy mb-2">Annual Household Income (₹)*</label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={profile.annual_income}
                  onChange={(e) => updateProfileField('annual_income', parseFloat(e.target.value) || 0)}
                  className="w-full bg-paper border border-navy/20 rounded-md p-3 text-sm font-medium focus:outline-none focus:border-gold-deep"
                />
                <span className="text-[11.5px] font-mono text-ink-soft mt-1.5 block">
                  Income level: <b>₹{Number(profile.annual_income).toLocaleString('en-IN')} / year</b>
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-navy mb-2">Occupation / Profession*</label>
                <select
                  value={profile.occupation}
                  onChange={(e) => updateProfileField('occupation', e.target.value)}
                  className="w-full bg-paper border border-navy/20 rounded-md p-3 text-sm font-medium focus:outline-none focus:border-gold-deep"
                >
                  {occupations.map((occ) => (
                    <option key={occ} value={occ}>{occ}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-navy mb-2">Employment Status*</label>
                <select
                  value={profile.employment_status}
                  onChange={(e) => updateProfileField('employment_status', e.target.value)}
                  className="w-full bg-paper border border-navy/20 rounded-md p-3 text-sm font-medium focus:outline-none focus:border-gold-deep"
                >
                  <option value="Employed">Employed</option>
                  <option value="Self Employed">Self Employed</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Student">Student</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Social Category */}
        {step === 3 && (
          <div className="space-y-6 font-sans">
            <h3 className="font-serif font-bold text-xl text-navy">Step 3: Social Category &amp; Category Status</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono font-bold text-navy mb-2">Social Category*</label>
                <select
                  value={profile.category}
                  onChange={(e) => updateProfileField('category', e.target.value)}
                  className="w-full bg-paper border border-navy/20 rounded-md p-3 text-sm font-medium focus:outline-none focus:border-gold-deep"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC (Other Backward Class)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-navy mb-2">Marital Status</label>
                <select
                  value={profile.marital_status}
                  onChange={(e) => updateProfileField('marital_status', e.target.value)}
                  className="w-full bg-paper border border-navy/20 rounded-md p-3 text-sm font-medium focus:outline-none focus:border-gold-deep"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Divorced">Divorced</option>
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
                  <span className="text-xs font-mono text-navy font-bold">Person with Disability (Divyangjan)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Special Conditions */}
        {step === 4 && (
          <div className="space-y-6 font-sans">
            <h3 className="font-serif font-bold text-xl text-navy">Step 4: Special Conditions &amp; Household Criteria</h3>
            <p className="text-xs text-ink-soft">Select all conditions that apply to you or your household:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              {[
                { key: 'student', label: 'Enrolled Student' },
                { key: 'farmer', label: 'Landholding / Tenant Farmer' },
                { key: 'bpl', label: 'BPL / Ration Card Holder' },
                { key: 'senior_citizen', label: 'Senior Citizen (60+ years)' },
                { key: 'widow', label: 'Widow' },
                { key: 'pregnant', label: 'Pregnant Mother / Lactating' },
                { key: 'rural_resident', label: 'Rural Area Resident' },
                { key: 'entrepreneur', label: 'Small Business / Entrepreneur' },
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
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button onClick={handleNext} className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2">
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="btn-primary big text-sm font-semibold flex items-center gap-2">
              {loading ? (
                <span>Evaluating Engine...</span>
              ) : (
                <>
                  <span>Find My Schemes →</span>
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
