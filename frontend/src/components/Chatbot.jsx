import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, ExternalLink, Sparkles, ArrowRight } from 'lucide-react';
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
            <Bot className="w-5 h-5 text-gold flex-none" />
            <span className="hidden sm:inline">{t('askChatbotHeader')}</span>
          </button>
        ) : (
          <div className="bg-card border border-navy/30 rounded-2xl shadow-2xl w-[90vw] max-w-[380px] sm:w-96 flex flex-col h-[500px] sm:h-[520px] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 font-sans">
            {/* Header */}
            <div className="bg-navy text-paper p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-serif font-semibold text-sm">
                <Bot className="w-4 h-4 text-gold" />
                <span>{t('chatbotTitle')}</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-paper/70 hover:text-paper">
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
                  className="bg-card hover:bg-navy/10 border border-navy/15 text-navy px-2.5 py-1 rounded-full whitespace-nowrap"
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
              <button type="submit" disabled={loading} className="btn-primary text-xs p-2.5">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* PREMIUM SCHEMESETU LOGIN REQUIRED MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-navy/50 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#FBF8F1] border border-navy/15 rounded-[22px] p-6 sm:p-8 max-w-[440px] w-full shadow-2xl relative space-y-5 transform transition-all animate-in zoom-in-95 duration-300 font-sans">
            {/* Close Button */}
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-navy/60 hover:text-navy p-1.5 rounded-full hover:bg-navy/5 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Icon + Title */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#16213C] border-2 border-marigold flex items-center justify-center text-marigold shadow-md flex-none">
                <Bot className="w-6 h-6 text-marigold" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-navy leading-tight">
                  SchemeSetu Assistant
                </h3>
                <span className="text-[11px] font-bold text-marigold uppercase tracking-wider block mt-0.5 font-sans">
                  Authentication Required
                </span>
              </div>
            </div>

            {/* Message */}
            <p className="text-sm text-[#5C5643] leading-relaxed font-sans">
              Please log in to access your personalized SchemeSetu Assistant.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  navigate('/login');
                }}
                className="w-full sm:flex-1 h-11 bg-[#16213C] text-[#FBF8F1] rounded-xl font-semibold text-sm hover:bg-[#202F52] hover:-translate-y-0.5 active:translate-y-0 transition-all btn-shine shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-full sm:flex-1 h-11 bg-transparent border border-navy/20 text-navy rounded-xl font-semibold text-sm hover:bg-navy/5 hover:border-navy transition-all flex items-center justify-center cursor-pointer"
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
