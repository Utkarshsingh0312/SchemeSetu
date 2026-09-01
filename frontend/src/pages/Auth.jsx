import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { Shield, User, Lock, Mail, Phone, Eye, EyeOff, CheckCircle2, ArrowRight, Sparkles, Check } from 'lucide-react';

export const Auth = ({ isRegister = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const { lang, t } = useLanguage();
  const { addToast } = useToast();

  const [mode, setMode] = useState(isRegister ? 'register' : 'login');
  
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

  // Animated Match Percentage Counter
  const [matchPct, setMatchPct] = useState(0);
  const [matchDeg, setMatchDeg] = useState(0);

  // Status & Animation State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signedInSuccess, setSignedInSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  // 3D Parallax Refs
  const leftPanelRef = useRef(null);
  const passbookRef = useRef(null);

  useEffect(() => {
    // Count-up animation for match percentage (0 -> 82%)
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

      setMatchPct(currentPct);
      setMatchDeg(deg);

      if (progress < 1) {
        requestAnimationFrame(animFrame);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animFrame);
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  // Desktop Mouse Parallax Effect (Max 2-3 deg tilt)
  const handleMouseMove = (e) => {
    if (!leftPanelRef.current || !passbookRef.current || window.innerWidth < 1024) return;
    const r = leftPanelRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    passbookRef.current.style.transform = `rotateY(${x * 3}deg) rotateX(${-y * 2}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    if (passbookRef.current) {
      passbookRef.current.style.transform = 'rotateY(0deg) rotateX(0deg) translateY(0px)';
    }
  };

  // Password Strength Calculator
  const getPasswordStrength = (pass) => {
    if (!pass) return { label: '', color: '', pct: 0 };
    if (pass.length < 6) return { label: lang === 'hi' ? 'कमजोर' : 'Weak', color: 'bg-rust', pct: 33 };
    if (pass.length >= 6 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) {
      return { label: lang === 'hi' ? 'मजबूत' : 'Strong', color: 'bg-teal', pct: 100 };
    }
    return { label: lang === 'hi' ? 'साधारण' : 'Medium', color: 'bg-marigold', pct: 66 };
  };

  const strength = getPasswordStrength(password);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!emailOrMobile.trim()) {
      setError(lang === 'hi' ? 'कृपया अपना ईमेल या मोबाइल नंबर दर्ज करें।' : 'Invalid credentials. Please check your email/mobile and password.');
      return;
    }
    if (!password) {
      setError(lang === 'hi' ? 'कृपया अपना पासवर्ड दर्ज करें।' : 'Invalid credentials. Please check your email/mobile and password.');
      return;
    }

    setLoading(true);
    try {
      const targetEmail = emailOrMobile.includes('@') ? emailOrMobile : `${emailOrMobile.replace(/\D/g, '')}@citizen.schemesetu.in`;
      await login(targetEmail, password);
      setSignedInSuccess(true);
      addToast(lang === 'hi' ? '✓ सफलतापूर्वक लॉगिन हुआ!' : '✓ Signed in successfully!', 'success');
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/eligibility';
        navigate(from, { replace: true });
      }, 600);
    } catch (err) {
      setError(err.response?.data?.detail || (lang === 'hi' ? 'अमान्य क्रेडेंशियल। कृपया अपने ईमेल/मोबाइल और पासवर्ड की जाँच करें।' : 'Invalid credentials. Please check your email/mobile and password.'));
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
      setSignedInSuccess(true);
      addToast(lang === 'hi' ? '✓ आपका खाता सफलतापूर्वक बन गया है!' : '✓ Account created successfully!', 'success');
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/eligibility';
        navigate(from, { replace: true });
      }, 600);
    } catch (err) {
      setError(err.response?.data?.detail || (lang === 'hi' ? 'पंजीकरण में त्रुटि। कृपया पुनः प्रयास करें।' : 'Registration failed. Please check details and try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 flex flex-col items-center justify-center page-entrance font-sans">
      <DisclaimerBanner />

      {/* CENTERED AUTHENTICATION CONTAINER (1180px Max Width, 42% Left / 58% Right Desktop Split) */}
      <div className="w-full max-w-[1180px] min-h-[680px] rounded-[26px] overflow-hidden bg-paper border border-navy/15 shadow-2xl my-6 flex flex-col lg:flex-row login-container-entrance font-sans">
        
        {/* LEFT SIDE (42% WIDTH) — DARK GRADIENT BRAND & PASSBOOK PANEL */}
        <div 
          ref={leftPanelRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full lg:w-[42%] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden text-[#FBF8F1] perspective-1000"
          style={{
            background: 'linear-gradient(135deg, #16213C 0%, #1D3450 50%, #1F4B3E 100%)'
          }}
        >
          {/* Subtle Background Animated Glows & Data Particles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-marigold/15 rounded-full blur-3xl pointer-events-none ambient-glow-1" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal/25 rounded-full blur-3xl pointer-events-none ambient-glow-2" />

          {/* Floating Data Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
            <div className="particle particle-1" />
            <div className="particle particle-2" />
            <div className="particle particle-3" />
            <div className="particle particle-4" />
            <div className="particle particle-5" />
          </div>

          {/* Top Logo (High Contrast White / Cream on Dark Background) */}
          <div className="relative z-10 space-y-8">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full border-2 border-marigold bg-[#16213C] flex items-center justify-center font-serif font-bold text-xl text-[#FBF8F1] logo-mark shadow-md">
                S
              </div>
              <div className="font-serif font-bold text-2xl tracking-tight text-[#FBF8F1]">
                Scheme<span className="text-marigold italic font-normal">Setu</span>
              </div>
            </Link>

            {/* Left Side Headline (Staggered Entrance) */}
            <div className="space-y-3 pt-2">
              <h1 className="font-serif font-semibold text-[44px] sm:text-[48px] text-[#FBF8F1] leading-[1.05] tracking-tight">
                {mode === 'login' ? (
                  <>
                    <span className="block animate-stagger-1">Welcome back to</span>
                    <span className="italic text-marigold block animate-stagger-2">SchemeSetu</span>
                  </>
                ) : (
                  <>
                    <span className="block animate-stagger-1">Create your</span>
                    <span className="italic text-marigold block animate-stagger-2">SchemeSetu profile</span>
                  </>
                )}
              </h1>
              <p className="text-[16px] leading-[1.6] text-[#FBF8F1]/80 font-sans max-w-[400px] animate-stagger-3">
                {mode === 'login'
                  ? 'Sign in to discover government schemes matched to your profile.'
                  : 'Tell us a little about yourself. We\'ll use your profile to find schemes you may be eligible for.'}
              </p>
            </div>
          </div>

          {/* DIGITAL PASSBOOK CARD (Visual Illustration with Scan Line & Floating Animation) */}
          <div 
            ref={passbookRef}
            className="relative z-10 my-8 bg-[#FBF8F1]/[0.08] backdrop-blur-[10px] border border-[#FBF8F1]/35 rounded-[18px] p-6 shadow-xl space-y-4 font-sans passbook-card transition-transform duration-300 animate-stagger-4"
          >
            {/* Scan Line Overlay */}
            <div className="absolute inset-0 rounded-[18px] overflow-hidden pointer-events-none">
              <div className="passbook-scan-line" />
            </div>

            <div className="flex justify-between items-center text-xs font-sans font-bold">
              <span className="flex items-center gap-2 text-marigold">
                <span className="w-2.5 h-2.5 rounded-full bg-marigold animate-ping" />
                DIGITAL PASSBOOK
              </span>
              <div 
                className="text-[#FBF8F1] font-extrabold bg-[#FBF8F1]/20 px-3 py-1 rounded-full flex items-center gap-1.5 font-mono"
                style={{
                  background: `conic-gradient(var(--gold) 0deg, var(--green-2) ${matchDeg}deg, rgba(251,248,241,0.2) ${matchDeg}deg)`
                }}
              >
                <span>{matchPct}% MATCHED</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-serif font-bold text-lg text-[#FBF8F1]">
                PM-KISAN &amp; Ayushman Bharat
              </div>
              <div className="text-marigold italic text-xs font-serif font-medium">
                Direct benefit transfer &amp; ₹5 Lakh healthcare
              </div>
            </div>

            <div className="pt-3 border-t border-[#FBF8F1]/15 flex items-center gap-2 text-xs text-[#FBF8F1]/90">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-none" />
              <CheckCircle2 className="w-4 h-4 text-marigold flex-none" />
              <span>✓ Matched securely against your profile criteria</span>
            </div>
          </div>

          {/* LEFT BOTTOM TRUST INFORMATION (Staggered Entrance) */}
          <div className="relative z-10 pt-4 border-t border-[#FBF8F1]/15 flex flex-col sm:flex-row justify-between gap-3 text-xs font-sans text-[#FBF8F1]/75 animate-stagger-5">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-marigold flex-none scale-check-spring" />
              <span>✓ Profile privacy protected</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-marigold flex-none scale-check-spring" />
              <span>✓ Central &amp; state scheme matching</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (58% WIDTH) — LOGIN / REGISTER PANEL */}
        <div className="w-full lg:w-[58%] bg-[#FBF8F1] p-8 sm:p-12 lg:p-[48px_54px] flex flex-col justify-between font-sans">
          <div className="max-w-[560px] mx-auto w-full">
            
            {/* TOP SEGMENTED CONTROL ([ Login ] [ Register ]) */}
            <div className="flex justify-end mb-8 animate-stagger-1 font-sans">
              <div className="inline-flex bg-[#FBF8F1] p-1 border border-[#16213C]/15 rounded-full font-sans text-xs font-semibold shadow-sm">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className={`px-5 py-2 rounded-full font-bold transition-all duration-300 ${mode === 'login' ? 'bg-[#16213C] text-[#FBF8F1] shadow-md' : 'text-[#16213C] hover:text-[#1F4B3E]'}`}
                >
                  {t('login')}
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(''); }}
                  className={`px-5 py-2 rounded-full font-bold transition-all duration-300 ${mode === 'register' ? 'bg-[#16213C] text-[#FBF8F1] shadow-md' : 'text-[#16213C] hover:text-[#1F4B3E]'}`}
                >
                  {t('register')}
                </button>
              </div>
            </div>

            {/* LOGIN HEADER */}
            <div className="mb-6 space-y-1.5 animate-stagger-2 font-sans">
              <h2 className="font-serif font-semibold text-[38px] text-[#16213C] leading-tight">
                {mode === 'login' ? (lang === 'hi' ? 'साइन इन करें 👋' : 'Welcome back 👋') : (lang === 'hi' ? 'प्रोफ़ाइल बनाएं 👋' : 'Create account 👋')}
              </h2>
              <p className="text-[15px] text-[#6B6658] font-sans leading-relaxed">
                {mode === 'login' 
                  ? 'Sign in to continue to your personalized scheme recommendations.'
                  : 'Enter your details to create your personalized citizen profile.'}
              </p>
            </div>

            {/* INLINE ERROR BANNER */}
            {error && (
              <div className="bg-[#B24B2C]/10 border border-[#B24B2C]/30 text-[#B24B2C] text-xs font-sans font-medium p-3.5 rounded-xl mb-6 flex items-start gap-2.5 shake-input">
                <span className="font-bold flex-none">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 font-sans animate-stagger-3">
                <div>
                  <label className="block text-[14px] font-semibold text-[#16213C] mb-2 font-sans">
                    Email or Mobile Number
                  </label>
                  <div className="relative">
                    <Mail className={`w-4 h-4 absolute left-4 top-4 transition-colors duration-200 ${focusedField === 'email' ? 'text-[#2C6350]' : 'text-[#16213C]/40'}`} />
                    <input
                      type="text"
                      required
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      placeholder="citizen@example.com / 9876543210"
                      value={emailOrMobile}
                      onChange={(e) => setEmailOrMobile(e.target.value)}
                      className="w-full h-[52px] bg-white border border-[#16213C]/18 rounded-[11px] pl-11 pr-4 text-sm font-sans font-medium text-[#16213C] focus:outline-none focus:border-[#2C6350] focus:ring-4 focus:ring-[#2C6350]/[0.08] transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-[#16213C] mb-2 font-sans">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className={`w-4 h-4 absolute left-4 top-4 transition-colors duration-200 ${focusedField === 'password' ? 'text-[#2C6350]' : 'text-[#16213C]/40'}`} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('')}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-[52px] bg-white border border-[#16213C]/18 rounded-[11px] pl-11 pr-11 text-sm font-sans font-medium text-[#16213C] focus:outline-none focus:border-[#2C6350] focus:ring-4 focus:ring-[#2C6350]/[0.08] transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-[#16213C]/40 hover:text-[#16213C] hover:scale-110 transition-all duration-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* REMEMBER + FORGOT ROW */}
                <div className="flex items-center justify-between pt-1 text-[13px] font-sans">
                  <label className="flex items-center gap-2 cursor-pointer text-[#16213C]/80 font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 accent-[#1F4B3E] rounded"
                    />
                    <span>Remember me</span>
                  </label>

                  <button 
                    type="button" 
                    onClick={() => addToast(lang === 'hi' ? 'पासवर्ड रीसेट लिंक आपके ईमेल पर भेजा गया।' : 'Password reset instructions sent to your email.', 'info')} 
                    className="text-[#B24B2C] hover:underline font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* LOGIN BUTTON (HERO INTERACTION WITH SHINE AND HOVER ARROW) */}
                <button
                  type="submit"
                  disabled={loading || signedInSuccess}
                  className="w-full h-[54px] bg-[#16213C] text-[#FBF8F1] rounded-[12px] font-sans font-semibold text-base shadow-md hover:bg-[#202F52] hover:translate-y-[-2px] active:translate-y-0 transition-all duration-200 btn-shine flex items-center justify-center gap-2 mt-4 group cursor-pointer"
                >
                  {signedInSuccess ? (
                    <span className="flex items-center gap-2 text-marigold font-bold animate-fade-in">
                      <Check className="w-5 h-5 scale-check-spring" />
                      <span>✓ Signed in</span>
                    </span>
                  ) : loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#FBF8F1] border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </span>
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 font-sans animate-stagger-3">
                <div>
                  <label className="block text-[14px] font-semibold text-[#16213C] mb-1.5 font-sans">
                    Full Name*
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#16213C]/40 absolute left-4 top-4" />
                    <input
                      type="text"
                      required
                      placeholder="Ramesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-[52px] bg-white border border-[#16213C]/18 rounded-[11px] pl-11 pr-4 text-sm font-sans font-medium text-[#16213C] focus:outline-none focus:border-[#2C6350] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[14px] font-semibold text-[#16213C] mb-1.5 font-sans">
                      Email Address*
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#16213C]/40 absolute left-4 top-4" />
                      <input
                        type="email"
                        required
                        placeholder="citizen@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-[52px] bg-white border border-[#16213C]/18 rounded-[11px] pl-11 pr-4 text-sm font-sans font-medium text-[#16213C] focus:outline-none focus:border-[#2C6350] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[14px] font-semibold text-[#16213C] mb-1.5 font-sans">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#16213C]/40 absolute left-4 top-4" />
                      <input
                        type="tel"
                        placeholder="9876543210"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="w-full h-[52px] bg-white border border-[#16213C]/18 rounded-[11px] pl-11 pr-4 text-sm font-sans font-medium text-[#16213C] focus:outline-none focus:border-[#2C6350] transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[14px] font-semibold text-[#16213C] mb-1.5 font-sans">
                      Password*
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#16213C]/40 absolute left-4 top-4" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-[52px] bg-white border border-[#16213C]/18 rounded-[11px] pl-11 pr-11 text-sm font-sans font-medium text-[#16213C] focus:outline-none focus:border-[#2C6350] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-4 text-[#16213C]/40 hover:text-[#16213C]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* PASSWORD STRENGTH INDICATOR */}
                    {password && (
                      <div className="mt-2 space-y-1 font-sans text-xs">
                        <div className="flex justify-between items-center text-[11px] text-[#6B6658]">
                          <span>Strength:</span>
                          <span className="font-bold text-[#16213C]">{strength.label}</span>
                        </div>
                        <div className="w-full bg-[#EAE2CC] h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${strength.pct}%` }} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[14px] font-semibold text-[#16213C] mb-1.5 font-sans">
                      Confirm Password*
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#16213C]/40 absolute left-4 top-4" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-[52px] bg-white border border-[#16213C]/18 rounded-[11px] pl-11 pr-11 text-sm font-sans font-medium text-[#16213C] focus:outline-none focus:border-[#2C6350] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-4 text-[#16213C]/40 hover:text-[#16213C]"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs font-sans text-[#16213C]/80 font-medium">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 accent-[#1F4B3E] rounded mt-0.5"
                    />
                    <span>I agree to the Terms of Use and Privacy Policy.</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || signedInSuccess}
                  className="w-full h-[54px] bg-[#16213C] text-[#FBF8F1] rounded-[12px] font-sans font-semibold text-base shadow-md hover:bg-[#202F52] hover:translate-y-[-2px] active:translate-y-0 transition-all duration-200 btn-shine flex items-center justify-center gap-2 mt-4 group cursor-pointer"
                >
                  {signedInSuccess ? (
                    <span className="flex items-center justify-center gap-2 text-marigold font-bold animate-fade-in">
                      <Check className="w-5 h-5 scale-check-spring" />
                      <span>✓ Account Created</span>
                    </span>
                  ) : loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#FBF8F1] border-t-transparent rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </span>
                  ) : (
                    <span>Create Account →</span>
                  )}
                </button>
              </form>
            )}

            {/* CREATE ACCOUNT SWITCHER LINK */}
            <div className="text-center text-xs font-sans text-[#6B6658] pt-6 mt-6 border-t border-[#16213C]/15 animate-stagger-5">
              {mode === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => { setMode('login'); setMode('register'); setError(''); }} 
                    className="text-[#16213C] font-bold hover:underline hover:text-[#1F4B3E] transition-colors duration-200 cursor-pointer"
                  >
                    Create Account →
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button 
                    onClick={() => { setMode('register'); setMode('login'); setError(''); }} 
                    className="text-[#16213C] font-bold hover:underline hover:text-[#1F4B3E] transition-colors duration-200 cursor-pointer"
                  >
                    Login →
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
