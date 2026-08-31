import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, ExternalLink, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { chatbotAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export const Chatbot = () => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [navigatingLogin, setNavigatingLogin] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([
      {
        sender: 'bot',
        text: lang === 'hi' 
          ? 'नमस्ते! मैं आपका स्कीमसेतु सहायक हूं। आज मैं आपको सही सरकारी योजनाएं खोजने में कैसे मदद कर सकता हूं?'
          : 'Namaste! I am your SchemeSetu Assistant. How can I help you find government welfare schemes today?',
        related: []
      }
    ]);
  }, [lang]);

  // ESC Keyboard Listener to Close Modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showAuthModal) {
        setShowAuthModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAuthModal]);

  const suggestedQuestions = lang === 'hi' ? [
    t('prompt1'),
    t('prompt2'),
    t('prompt3')
  ] : [
    t('prompt1'),
    t('prompt2'),
    t('prompt3')
  ];

  const handleToggleChat = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setIsOpen(!isOpen);
  };

  const handleSend = async (e, customText = null) => {
    if (e) e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const textToSend = customText || query;
    if (!textToSend.trim() || loading) return;

    setQuery('');
    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    setLoading(true);

    try {
      const res = await chatbotAPI.query(textToSend);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: res.data.answer,
          related: res.data.related_schemes || [],
          disclaimer: res.data.disclaimer
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: lang === 'hi'
            ? 'योजना डेटाबेस में खोजने में समस्या हुई। कृपया योजनाएं सीधे ब्राउज़ करें या पुनः प्रयास करें।'
            : 'I had trouble searching the scheme database. Please browse the schemes directly or try again.',
          related: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    setNavigatingLogin(true);
    setTimeout(() => {
      setShowAuthModal(false);
      setNavigatingLogin(false);
      navigate('/login');
    }, 250);
  };

  return (
    <>
      {/* FLOATING CHATBOT BUTTON AND CHAT PANEL CONTAINER */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[90]">
        {!isOpen ? (
          <button
            onClick={handleToggleChat}
            className="btn-primary btn-shine rounded-full p-3.5 sm:px-5 sm:py-3.5 shadow-2xl flex items-center justify-center gap-2.5 text-xs font-sans font-bold tracking-wider cursor-pointer"
            aria-label="Open SchemeSetu Assistant Chatbot"
          >
            {/* EXACT SCHEMESETU BRAND LOGO MARK */}
            <div className="w-6 h-6 rounded-full border border-marigold bg-[#16213C] flex items-center justify-center font-serif font-bold text-xs text-[#FBF8F1] flex-none">
              S
            </div>
            <span className="hidden sm:inline">{t('askChatbotHeader')}</span>
          </button>
        ) : (
          <div className="bg-card border border-navy/30 rounded-2xl shadow-2xl w-[90vw] max-w-[380px] sm:w-96 flex flex-col h-[500px] sm:h-[520px] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 font-sans">
            {/* Header */}
            <div className="bg-navy text-paper p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5 font-serif font-semibold text-sm">
                <div className="w-6 h-6 rounded-full border border-marigold bg-[#16213C] flex items-center justify-center font-serif font-bold text-xs text-[#FBF8F1] flex-none">
                  S
                </div>
                <span>{t('chatbotTitle')}</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-paper/70 hover:text-paper cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3.5 rounded-xl max-w-[88%] leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-navy text-paper rounded-br-none font-medium' 
                      : 'bg-paper border border-navy/15 text-ink rounded-bl-none'
                  }`}>
                    <p>{msg.text}</p>
                  </div>

                  {msg.related && msg.related.length > 0 && (
                    <div className="mt-2 space-y-1.5 w-full">
                      <span className="text-[10px] font-sans text-ink-soft uppercase font-bold">
                        {lang === 'hi' ? 'संबंधित योजनाएं:' : 'Related Scheme Matches:'}
                      </span>
                      {msg.related.map(s => (
                        <Link 
                          key={s.id} 
                          to={`/scheme/${s.id}`} 
                          onClick={() => setIsOpen(false)}
                          className="block bg-paper hover:bg-gold/15 border border-navy/15 p-2 rounded text-[11px] font-semibold text-navy flex items-center justify-between"
                        >
                          <span className="truncate">{s.name}</span>
                          <ExternalLink className="w-3 h-3 text-gold-deep flex-none" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {msg.disclaimer && (
                    <span className="text-[9.5px] font-sans text-rust/80 mt-1 italic max-w-[85%]">
                      * {msg.disclaimer}
                    </span>
                  )}
                </div>
              ))}
              {loading && (
                <div className="text-xs text-ink-soft italic font-sans flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-deep animate-spin" />
                  <span>{lang === 'hi' ? 'योजना डेटाबेस में खोज की जा रही है...' : 'Searching scheme database...'}</span>
                </div>
              )}
            </div>

            {/* Suggested Quick Question Pills */}
            <div className="px-3 py-2 bg-paper/60 border-t border-navy/10 flex items-center gap-1.5 overflow-x-auto text-[10px] font-sans">
              {suggestedQuestions.map((qText, i) => (
                <button
                  key={i}
                  onClick={(e) => handleSend(e, qText)}
                  className="bg-card hover:bg-navy/10 border border-navy/15 text-navy px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer"
                >
                  {qText}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-navy/15 bg-paper flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('chatbotPlaceholder')}
                className="flex-1 bg-card border border-navy/20 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold-deep font-sans"
              />
              <button type="submit" disabled={loading} className="btn-primary text-xs p-2.5 cursor-pointer">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* REDESIGNED PREMIUM SCHEMESETU AUTHENTICATION REQUIRED MODAL */}
      {showAuthModal && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0A1223]/58 backdrop-blur-md animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          aria-describedby="auth-modal-desc"
        >
          <div className="bg-[#FBF8F1] border border-navy/12 rounded-[26px] p-6 sm:p-8 max-w-[560px] w-[calc(100%-32px)] shadow-[0_30px_80px_rgba(22,33,60,0.25)] relative overflow-hidden font-sans transform transition-all animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            
            {/* Decorative Top Accent Bar */}
            <div className="w-full h-[3px] bg-gradient-to-r from-marigold via-amber-400 to-transparent absolute top-0 left-0 rounded-t-[26px]" />

            {/* Ambient Background Radial Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-marigold/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal/15 rounded-full blur-3xl pointer-events-none" />

            {/* Circular Close X Button */}
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full flex items-center justify-center text-navy/60 hover:text-navy hover:bg-navy/10 hover:rotate-90 hover:scale-105 transition-all duration-200 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* HEADER: EXACT SCHEMESETU LANDING PAGE LOGO MARK + TITLES */}
            <div className="flex items-center gap-4 relative z-10">
              {/* Landing Page SchemeSetu Logo Container (52px Mobile / 58px Desktop) */}
              <div className="w-[52px] h-[52px] sm:w-[58px] sm:h-[58px] rounded-full border-2 border-navy bg-[#FBF8F1] ring-2 ring-marigold/60 flex items-center justify-center font-serif font-bold text-2xl sm:text-3xl text-navy shadow-md hover:rotate-6 hover:scale-105 transition-transform flex-none cursor-pointer">
                S
              </div>
              
              <div>
                <h3 id="auth-modal-title" className="font-serif font-bold text-[21px] sm:text-[24px] text-navy leading-tight">
                  Scheme<span className="text-marigold italic font-normal">Setu</span> Assistant
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-marigold animate-pulse flex-none" />
                  <span className="text-[10px] sm:text-[11px] font-bold text-marigold uppercase tracking-[0.12em] font-sans">
                    AUTHENTICATION REQUIRED
                  </span>
                </div>
              </div>
            </div>

            {/* MAIN MESSAGE & ACCENT */}
            <div className="relative z-10 pt-2 space-y-1.5">
              <span className="font-serif italic text-xs font-semibold text-marigold tracking-wide block">
                ✦ Personalized assistance awaits
              </span>
              <p id="auth-modal-desc" className="text-[15px] sm:text-[16px] text-[#5C5643] leading-relaxed font-sans">
                Please log in to access your personalized SchemeSetu Assistant.
              </p>
            </div>

            {/* COMPACT BENEFIT INDICATOR PILLS */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="bg-[#1F4B3E]/[0.06] border border-[#1F4B3E]/12 rounded-xl p-2.5 flex items-center gap-2 text-xs font-medium text-navy font-sans hover:-translate-y-0.5 transition-transform">
                <CheckCircle2 className="w-4 h-4 text-teal flex-none" />
                <span>Personalized guidance</span>
              </div>
              <div className="bg-[#1F4B3E]/[0.06] border border-[#1F4B3E]/12 rounded-xl p-2.5 flex items-center gap-2 text-xs font-medium text-navy font-sans hover:-translate-y-0.5 transition-transform">
                <ShieldCheck className="w-4 h-4 text-teal flex-none" />
                <span>Eligibility awareness</span>
              </div>
              <div className="bg-[#1F4B3E]/[0.06] border border-[#1F4B3E]/12 rounded-xl p-2.5 flex items-center gap-2 text-xs font-medium text-navy font-sans hover:-translate-y-0.5 transition-transform">
                <Zap className="w-4 h-4 text-teal flex-none" />
                <span>Application help</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleLoginRedirect}
                disabled={navigatingLogin}
                className="w-full sm:flex-1 h-[52px] bg-[#16213C] text-[#FBF8F1] rounded-[13px] font-bold text-sm hover:bg-[#202F52] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 btn-shine shadow-md flex items-center justify-center gap-2 cursor-pointer group"
              >
                {navigatingLogin ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#FBF8F1] border-t-transparent rounded-full animate-spin" />
                    <span>Opening Login...</span>
                  </span>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-full sm:flex-1 h-[52px] bg-transparent border border-navy/18 text-navy rounded-[13px] font-semibold text-sm hover:bg-navy/5 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
