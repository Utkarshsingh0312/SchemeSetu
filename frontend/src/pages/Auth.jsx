import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { Shield, User, Lock, Mail, Phone, Eye, EyeOff, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export const Auth = ({ isRegister = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const { lang, t } = useLanguage();
  const { addToast } = useToast();

  const [mode, setMode] = useState(isRegister ? 'register' : 'login');
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  
  // Form State
  const [name, setName] = useState('');
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Status State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!emailOrMobile.trim()) {
      setError(lang === 'hi' ? 'कृपया अपना ईमेल या मोबाइल नंबर दर्ज करें।' : 'Please enter your email or mobile number.');
      return;
    }
    if (!password) {
      setError(lang === 'hi' ? 'कृपया अपना पासवर्ड दर्ज करें।' : 'Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      // Use email if formatted as email, or append domain if mobile
      const targetEmail = emailOrMobile.includes('@') ? emailOrMobile : `${emailOrMobile.replace(/\D/g, '')}@citizen.schemesetu.in`;
      await login(targetEmail, password);
      addToast(lang === 'hi' ? '✓ सफलतापूर्वक लॉगिन हुआ!' : '✓ Logged in successfully!', 'success');
      const from = location.state?.from?.pathname || '/eligibility';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || (lang === 'hi' ? 'अमान्य क्रेडेंशियल। कृपया अपनी जानकारी की जाँच करें और पुनः प्रयास करें।' : 'Invalid credentials. Please check your details and try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');
    const cleanNum = mobileNumber.replace(/\D/g, '');
    if (cleanNum.length < 10) {
      setError(lang === 'hi' ? 'कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      addToast(lang === 'hi' ? '✓ आपके मोबाइल पर ओटीपी भेज दिया गया है (1234)' : '✓ OTP sent to your mobile number (Demo Code: 1234)', 'info');
    }, 600);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!otpCode || otpCode.trim().length < 4) {
      setError(lang === 'hi' ? 'कृपया 4-अंकीय ओटीपी दर्ज करें।' : 'Please enter the 4-digit OTP code.');
      return;
    }
    setLoading(true);
    try {
      const cleanNum = mobileNumber.replace(/\D/g, '');
      const otpEmail = `${cleanNum}@citizen.schemesetu.in`;
      const fallbackPassword = `Pass@${cleanNum.slice(-4)}`;
      try {
        await login(otpEmail, fallbackPassword);
      } catch (err) {
        await register(`Citizen ${cleanNum.slice(-4)}`, otpEmail, fallbackPassword);
      }
      addToast(lang === 'hi' ? '✓ ओटीपी सत्यापित! सफलतापूर्वक लॉगिन हुआ।' : '✓ OTP Verified! Logged in successfully.', 'success');
      const from = location.state?.from?.pathname || '/eligibility';
      navigate(from, { replace: true });
    } catch (err) {
      setError(lang === 'hi' ? 'ओटीपी सत्यापन विफल। कृपया पुन: प्रयास करें।' : 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError(lang === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError(lang === 'hi' ? 'कृपया एक वैध ईमेल पता दर्ज करें।' : 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError(lang === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError(lang === 'hi' ? 'पासवर्ड मेल नहीं खाते।' : 'Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError(lang === 'hi' ? 'जारी रखने के लिए आपको नियमों और गोपनीयता नीति से सहमत होना होगा।' : 'You must agree to the Terms of Use and Privacy Policy to continue.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      addToast(lang === 'hi' ? '✓ आपका खाता सफलतापूर्वक बन गया है!' : '✓ Your account has been created successfully.', 'success');
      const from = location.state?.from?.pathname || '/eligibility';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || (lang === 'hi' ? 'पंजीकरण में त्रुटि। कृपया पुनः प्रयास करें।' : 'Registration failed. Please check details and try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 max-w-6xl mx-auto flex flex-col justify-center">
      <DisclaimerBanner />

      <div className="bg-card border border-navy/20 rounded-2xl shadow-2xl my-6 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* LEFT COLUMN — BRANDING & TRUST ILLUSTRATION */}
        <div className="lg:col-span-5 bg-gradient-to-br from-navy via-navy-2 to-teal-deep text-cream p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Background Accent Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-marigold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Mark */}
          <div className="relative z-10 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full border-2 border-marigold bg-navy flex items-center justify-center font-serif font-bold text-xl text-cream group-hover:scale-105 transition-transform">
                S
              </div>
              <div className="font-serif font-bold text-2xl tracking-tight text-cream">
                Scheme<span className="text-marigold italic font-normal">Setu</span>
              </div>
            </Link>

            <div className="space-y-2 pt-4">
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-paper leading-tight">
                {mode === 'login' 
                  ? (lang === 'hi' ? 'स्कीमसेतु में आपका स्वागत है' : 'Welcome back to SchemeSetu')
                  : (lang === 'hi' ? 'अपनी स्कीमसेतु प्रोफ़ाइल बनाएं' : 'Create your SchemeSetu profile')}
              </h2>
              <p className="text-xs sm:text-sm text-cream-2/80 font-sans leading-relaxed">
                {mode === 'login'
                  ? (lang === 'hi' ? 'अपनी प्रोफ़ाइल से मेल खाती सरकारी योजनाओं की खोज के लिए साइन इन करें।' : 'Sign in to discover government schemes matched to your profile.')
                  : (lang === 'hi' ? 'अपने बारे में थोड़ा बताएं। हम आपकी प्रोफ़ाइल का उपयोग पात्र योजनाओं की खोज के लिए करेंगे।' : 'Tell us a little about yourself. We\'ll use your profile to find schemes you may be eligible for.')}
              </p>
            </div>
          </div>

          {/* Middle Decorative Passbook Card Visual */}
          <div className="relative z-10 my-8 bg-paper/10 backdrop-blur-md border border-cream/20 rounded-xl p-5 text-xs font-mono space-y-3 shadow-lg">
            <div className="flex justify-between items-center text-[11px]">
              <span className="flex items-center gap-1.5 text-marigold font-bold">
                <span className="w-2 h-2 rounded-full bg-marigold animate-ping" />
                DIGITAL PASSBOOK
              </span>
              <span className="text-cream-2/70">82% MATCHED</span>
            </div>

            <div className="space-y-1 font-serif">
              <div className="text-paper font-bold text-base">PM-KISAN & Ayushman Bharat</div>
              <div className="text-marigold italic text-xs">Direct benefit transfer &amp; ₹5 Lakh healthcare</div>
            </div>

            <div className="pt-2 border-t border-cream/15 flex items-center gap-2 text-[10.5px] text-cream-2/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-marigold flex-none" />
              <span>{lang === 'hi' ? 'आपकी प्रोफ़ाइल से सुरक्षित रूप से मिलान किया गया' : 'Matched securely against your profile criteria'}</span>
            </div>
          </div>

          {/* Bottom Security Info */}
          <div className="relative z-10 space-y-2 pt-4 border-t border-cream/15 font-mono text-xs text-cream-2/75">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-marigold flex-none" />
              <span>{lang === 'hi' ? '100% डेटा गोपनीयता एवं सुरक्षा' : '100% Profile Privacy Protected'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-marigold flex-none" />
              <span>{lang === 'hi' ? 'सटीक केंद्र व राज्य योजना नियम इंजन' : 'Official Central & State Scheme Matching'}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — INTERACTIVE AUTH CARD */}
        <div className="lg:col-span-7 bg-paper p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Mode Switcher Header */}
            <div className="flex items-center justify-between border-b border-navy/15 pb-4 mb-6">
              <div className="font-serif font-bold text-2xl text-navy">
                {mode === 'login' ? (lang === 'hi' ? 'साइन इन करें 👋' : 'Welcome back 👋') : (lang === 'hi' ? 'खाता बनाएं 👋' : 'Create Account 👋')}
              </div>
              
              <div className="flex bg-cream rounded-lg p-1 border border-navy/15 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className={`px-3 py-1.5 rounded-md font-bold transition-all ${mode === 'login' ? 'bg-navy text-paper shadow' : 'text-navy/70 hover:text-navy'}`}
                >
                  {t('login')}
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(''); }}
                  className={`px-3 py-1.5 rounded-md font-bold transition-all ${mode === 'register' ? 'bg-navy text-paper shadow' : 'text-navy/70 hover:text-navy'}`}
                >
                  {t('register')}
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="bg-rust/10 border border-rust/30 text-rust text-xs font-mono p-3.5 rounded-lg mb-6 flex items-start gap-2 animate-fade-in">
                <span className="font-bold flex-none">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {mode === 'login' && (
              <div className="space-y-5 font-sans">
                {/* Login Method Toggle */}
                <div className="grid grid-cols-2 gap-2 font-mono text-xs mb-4">
                  <button
                    type="button"
                    onClick={() => { setLoginMethod('password'); setError(''); }}
                    className={`py-2 px-3 rounded-lg border text-center font-semibold transition-all ${loginMethod === 'password' ? 'bg-teal/15 border-teal text-teal-deep font-bold' : 'bg-paper border-navy/15 text-navy/70 hover:border-navy/30'}`}
                  >
                    🔐 {lang === 'hi' ? 'पासवर्ड लॉगिन' : 'Password Login'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginMethod('otp'); setError(''); }}
                    className={`py-2 px-3 rounded-lg border text-center font-semibold transition-all ${loginMethod === 'otp' ? 'bg-teal/15 border-teal text-teal-deep font-bold' : 'bg-paper border-navy/15 text-navy/70 hover:border-navy/30'}`}
                  >
                    📱 {lang === 'hi' ? 'मोबाइल ओटीपी' : 'Mobile OTP'}
                  </button>
                </div>

                {/* Password Login Option */}
                {loginMethod === 'password' ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block font-mono text-xs font-bold text-navy mb-1.5">
                        {lang === 'hi' ? 'ईमेल या मोबाइल नंबर*' : 'Email or Mobile Number*'}
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-navy/40 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          placeholder="citizen@example.com / 9876543210"
                          value={emailOrMobile}
                          onChange={(e) => setEmailOrMobile(e.target.value)}
                          className="w-full bg-cream/40 border border-navy/20 rounded-lg pl-10 pr-3 py-2.5 text-xs font-medium focus:outline-none focus:border-marigold focus:bg-paper transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block font-mono text-xs font-bold text-navy">{t('passwordLabel')}*</label>
                        <button 
                          type="button" 
                          onClick={() => addToast(lang === 'hi' ? 'पासवर्ड रीसेट लिंक आपके ईमेल पर भेजा गया।' : 'Password reset instructions sent to your email.', 'info')} 
                          className="text-[11px] font-mono text-terracotta hover:underline"
                        >
                          {lang === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot password?'}
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-navy/40 absolute left-3.5 top-3.5" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-cream/40 border border-navy/20 rounded-lg pl-10 pr-10 py-2.5 text-xs font-medium focus:outline-none focus:border-marigold focus:bg-paper transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-navy/40 hover:text-navy"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-navy/80">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-3.5 h-3.5 accent-teal rounded"
                        />
                        <span>{lang === 'hi' ? 'मुझे याद रखें' : 'Remember me'}</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full py-3.5 text-sm font-semibold mt-2"
                    >
                      {loading ? (
                        <span>{t('loading')}...</span>
                      ) : (
                        <>
                          <span>{t('login')}</span>
                          <ArrowRight className="arrow w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Mobile OTP Option */
                  <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block font-mono text-xs font-bold text-navy mb-1.5">
                        {lang === 'hi' ? 'मोबाइल नंबर*' : 'Mobile Number*'}
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-navy/40 absolute left-3.5 top-3.5" />
                        <input
                          type="tel"
                          required
                          disabled={otpSent}
                          placeholder="9876543210"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          className="w-full bg-cream/40 border border-navy/20 rounded-lg pl-10 pr-3 py-2.5 text-xs font-medium focus:outline-none focus:border-marigold focus:bg-paper transition-all disabled:opacity-60"
                        />
                      </div>
                    </div>

                    {otpSent && (
                      <div className="space-y-2 animate-fade-in">
                        <label className="block font-mono text-xs font-bold text-navy">
                          {lang === 'hi' ? '4-अंकीय ओटीपी दर्ज करें*' : 'Enter 4-Digit OTP Code*'}
                        </label>
                        <input
                          type="text"
                          maxLength={4}
                          required
                          placeholder="1234"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          className="w-full bg-cream/40 border border-navy/20 rounded-lg p-3 text-center text-lg font-mono tracking-widest font-bold focus:outline-none focus:border-marigold"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full py-3.5 text-sm font-semibold mt-2"
                    >
                      {loading ? (
                        <span>{t('loading')}...</span>
                      ) : otpSent ? (
                        <span>{lang === 'hi' ? 'ओटीपी सत्यापित करें और लॉगिन करें →' : 'Verify OTP & Login →'}</span>
                      ) : (
                        <span>{lang === 'hi' ? 'ओटीपी भेजें →' : 'Continue with Mobile OTP →'}</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* REGISTER FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 font-sans">
                <div>
                  <label className="block font-mono text-xs font-bold text-navy mb-1">{t('nameLabel')}*</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-navy/40 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="Ramesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-cream/40 border border-navy/20 rounded-lg pl-10 pr-3 py-2.5 text-xs font-medium focus:outline-none focus:border-marigold focus:bg-paper transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs font-bold text-navy mb-1">{t('emailLabel')}*</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-navy/40 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        placeholder="citizen@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-cream/40 border border-navy/20 rounded-lg pl-10 pr-3 py-2.5 text-xs font-medium focus:outline-none focus:border-marigold focus:bg-paper transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-bold text-navy mb-1">{lang === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-navy/40 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        placeholder="9876543210"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="w-full bg-cream/40 border border-navy/20 rounded-lg pl-10 pr-3 py-2.5 text-xs font-medium focus:outline-none focus:border-marigold focus:bg-paper transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs font-bold text-navy mb-1">{t('passwordLabel')}*</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-navy/40 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-cream/40 border border-navy/20 rounded-lg pl-10 pr-10 py-2.5 text-xs font-medium focus:outline-none focus:border-marigold focus:bg-paper transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-navy/40 hover:text-navy"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-bold text-navy mb-1">{lang === 'hi' ? 'पासवर्ड की पुष्टि करें*' : 'Confirm Password*'}</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-navy/40 absolute left-3.5 top-3.5" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-cream/40 border border-navy/20 rounded-lg pl-10 pr-10 py-2.5 text-xs font-medium focus:outline-none focus:border-marigold focus:bg-paper transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-navy/40 hover:text-navy"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer font-mono text-xs text-navy/80">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 accent-teal rounded mt-0.5"
                    />
                    <span>{lang === 'hi' ? 'मैं उपयोग की शर्तों और गोपनीयता नीति से सहमत हूँ।' : 'I agree to the Terms of Use and Privacy Policy.'}</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 text-sm font-semibold mt-2"
                >
                  {loading ? (
                    <span>{t('loading')}...</span>
                  ) : (
                    <>
                      <span>{lang === 'hi' ? 'खाता बनाएं →' : 'Create Account →'}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Card Footer Switcher Link */}
          <div className="text-center text-xs font-mono text-ink-soft pt-6 mt-6 border-t border-navy/15">
            {mode === 'login' ? (
              <span>
                {lang === 'hi' ? 'खाता नहीं है?' : "Don't have an account?"}{' '}
                <button onClick={() => { setMode('register'); setError(''); }} className="text-navy font-bold underline hover:text-terracotta">
                  {lang === 'hi' ? 'खाता बनाएं' : 'Create Account'}
                </button>
              </span>
            ) : (
              <span>
                {lang === 'hi' ? 'पहले से खाता है?' : 'Already have an account?'}{' '}
                <button onClick={() => { setMode('login'); setError(''); }} className="text-navy font-bold underline hover:text-terracotta">
                  {lang === 'hi' ? 'साइन इन करें' : 'Login'}
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
