import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, ExternalLink, Sparkles } from 'lucide-react';
import { chatbotAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export const Chatbot = () => {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
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

  const handleSend = async (e, customText = null) => {
    if (e) e.preventDefault();
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
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="btn-primary rounded-full px-5 py-3.5 shadow-2xl flex items-center gap-2.5 text-xs font-mono font-bold tracking-wider"
        >
          <Bot className="w-5 h-5 text-gold" />
          <span>{t('askChatbotHeader')}</span>
        </button>
      ) : (
        <div className="bg-card border border-navy/30 rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col h-[520px] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
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
                    <span className="text-[10px] font-mono text-ink-soft uppercase font-bold">
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
                  <span className="text-[9.5px] font-mono text-rust/80 mt-1 italic max-w-[85%]">
                    * {msg.disclaimer}
                  </span>
                )}
              </div>
            ))}
            {loading && (
              <div className="text-xs text-ink-soft italic font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-deep animate-spin" />
                <span>{lang === 'hi' ? 'योजना डेटाबेस में खोज की जा रही है...' : 'Searching scheme database...'}</span>
              </div>
            )}
          </div>

          {/* Suggested Quick Question Pills */}
          <div className="px-3 py-2 bg-paper/60 border-t border-navy/10 flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono">
            {suggestedQuestions.map((qText, i) => (
              <button
                key={i}
                onClick={(e) => handleSend(e, qText)}
                className="bg-card hover:bg-navy/10 border border-navy/15 text-navy px-2.5 py-1 rounded whitespace-nowrap"
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
              className="flex-1 bg-card border border-navy/20 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold-deep font-sans"
            />
            <button type="submit" disabled={loading} className="btn-primary text-xs p-2.5">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
