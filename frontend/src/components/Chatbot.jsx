import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, ExternalLink, Sparkles, ArrowRight } from 'lucide-react';
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
    }, 200);
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

      {/* REWORKED MINIMAL & ELEGANT AUTHENTICATION REQUIRED MODAL */}
      {showAuthModal && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 bg-[#16213C]/48 backdrop-blur-[12px] animate-in fade-in duration-250"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          aria-describedby="auth-modal-desc"
        >
          <div className="bg-[#FBF8F1] border border-navy/12 rounded-[20px] sm:rounded-[24px] p-6 sm:p-[32px_34px] max-w-[520px] w-[calc(100%-28px)] sm:w-[calc(100%-32px)] shadow-[0_24px_70px_rgba(22,33,60,0.22)] relative overflow-hidden font-sans transform transition-all animate-in zoom-in-98 slide-in-from-bottom-3 duration-350">
            
            {/* Subtle Ambient Radial Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-marigold/10 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-[18px] right-[18px] w-8 h-8 rounded-full flex items-center justify-center text-navy/60 hover:text-navy hover:bg-navy/[0.06] hover:scale-[1.05] transition-all duration-200 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* CLEAN HORIZONTAL HEADER */}
            <div className="flex items-center gap-3.5 relative z-10">
              {/* 48px Desktop / 44px Mobile Landing Page SchemeSetu Logo */}
              <div className="w-[44px] h-[44px] sm:w-[48px] sm:h-[48px] rounded-full border border-navy bg-[#FBF8F1] ring-1 ring-marigold/60 flex items-center justify-center font-serif font-bold text-xl sm:text-2xl text-navy shadow-sm flex-none">
                S
              </div>
              
              <div>
                <h3 id="auth-modal-title" className="font-serif font-bold text-[20px] sm:text-[22px] text-navy leading-tight">
                  Scheme<span className="text-marigold italic font-normal">Setu</span> Assistant
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-none" />
                  <span className="text-[10px] font-bold text-marigold uppercase tracking-[0.12em] font-sans">
                    AUTHENTICATION REQUIRED
                  </span>
                </div>
              </div>
            </div>

            {/* MAIN MESSAGE WITH SMALL EYEBROW */}
            <div className="text-center mt-4 sm:mt-5 relative z-10">
              <span className="text-[10px] font-bold text-marigold uppercase tracking-[0.12em] block font-sans mb-1">
                PERSONALIZED ASSISTANCE
              </span>
              <p id="auth-modal-desc" className="text-[15px] sm:text-[17px] text-[#5C5643] leading-[1.55] max-w-[400px] mx-auto font-sans font-medium">
                Please log in to access your personalized SchemeSetu Assistant.
              </p>
            </div>

            {/* COMPACT HORIZONTAL FEATURE ROW */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 text-[12px] font-sans text-[#3F493F] relative z-10">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                <span>Personalized guidance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                <span>Eligibility matching</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                <span>Application help</span>
              </div>
            </div>

            {/* SUBTLE DIVIDER */}
            <div className="my-[22px] border-t border-navy/10 relative z-10" />

            {/* BUTTONS COMPOSITION */}
            <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10">
              <button
                type="button"
                onClick={handleLoginRedirect}
                disabled={navigatingLogin}
                className="w-full sm:w-[45%] h-[50px] bg-[#16213C] text-[#FBF8F1] rounded-[12px] font-bold text-sm shadow-[0_8px_20px_rgba(22,33,60,0.14)] hover:bg-[#202F52] hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer group"
              >
                {navigatingLogin ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#FBF8F1] border-t-transparent rounded-full animate-spin" />
                    <span>Opening Login...</span>
                  </span>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-[3px] transition-transform" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-full sm:w-[55%] h-[50px] bg-transparent border border-navy/18 text-navy rounded-[12px] font-semibold text-sm hover:bg-navy/[0.04] hover:-translate-y-[1px] active:translate-y-0 transition-all flex items-center justify-center cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>

            {/* TRUST FOOTER */}
            <div className="mt-3.5 text-center text-[10.5px] sm:text-[11px] text-[#7A7568] flex items-center justify-center gap-1.5 font-sans relative z-10">
              <span>🔒 Your profile remains protected and private.</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
