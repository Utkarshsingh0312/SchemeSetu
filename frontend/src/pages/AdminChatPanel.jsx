import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { adminAPI } from '../services/api';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { MessageSquare, Search, Send, User as UserIcon, Shield, ArrowLeft, RefreshCw, CheckCheck, Clock, Sparkles } from 'lucide-react';

export const AdminChatPanel = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { lang } = useLanguage();

  const [conversations, setConversations] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch Conversations List
  const fetchConversations = async (showSpinner = false) => {
    if (showSpinner) setLoadingConvs(true);
    try {
      const res = await adminAPI.getConversations();
      setConversations(res.data);
      if (res.data.length > 0 && !selectedConvId) {
        setSelectedConvId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch support conversations:', err);
      setError('Failed to load support conversations. Please check your admin privileges.');
    } finally {
      if (showSpinner) setLoadingConvs(false);
    }
  };

  // Fetch Messages for Selected Conversation
  const fetchMessages = async (convId, showSpinner = false) => {
    if (!convId) return;
    if (showSpinner) setLoadingMessages(true);
    try {
      const res = await adminAPI.getConversationMessages(convId);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch conversation messages:', err);
    } finally {
      if (showSpinner) setLoadingMessages(false);
    }
  };

  // Initial Load & Real-time Polling Loop
  useEffect(() => {
    fetchConversations(true);
    const interval = setInterval(() => {
      fetchConversations(false);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedConvId) {
      fetchMessages(selectedConvId, true);
      const interval = setInterval(() => {
        fetchMessages(selectedConvId, false);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [selectedConvId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendReply = async (e) => {
    if (e) e.preventDefault();
    if (!selectedConvId || !replyText.trim() || sending) return;

    const textToSend = replyText.trim();
    setReplyText('');
    setSending(true);

    try {
      await adminAPI.sendAdminReply(selectedConvId, textToSend);
      // Immediately refresh messages & conversation list
      await fetchMessages(selectedConvId, false);
      await fetchConversations(false);
      scrollToBottom();
    } catch (err) {
      console.error('Failed to send admin reply:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Filter conversations by user name or email
  const filteredConversations = conversations.filter(c => 
    c.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.last_message && c.last_message.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedConv = conversations.find(c => c.id === selectedConvId);

  return (
    <div className="min-h-screen bg-paper text-ink font-sans flex flex-col page-entrance">
      <DisclaimerBanner />

      {/* TOP ADMIN SUPPORT HEADER */}
      <header className="bg-[#16213C] text-[#FBF8F1] border-b border-navy/20 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-md font-sans">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin" 
            className="inline-flex items-center gap-2 text-xs font-bold text-marigold hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-lg border border-white/15"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-serif font-bold text-xl text-[#FBF8F1]">SchemeSetu Support Console</h1>
              <span className="bg-[#2C6350] text-[#FBF8F1] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LIVE CHAT
              </span>
            </div>
            <p className="text-xs text-[#FBF8F1]/70">Direct one-on-one citizen support and query management</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { fetchConversations(true); if (selectedConvId) fetchMessages(selectedConvId, true); }}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-lg border border-white/15 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <div className="text-xs font-mono text-marigold bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
            Admin: <b>{user?.name || 'Administrator'}</b>
          </div>
        </div>
      </header>

      {/* MAIN TWO-COLUMN CHAT INTERFACE */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6 min-h-[calc(100vh-140px)]">
        
        {/* LEFT SIDEBAR (340px) — USER CONVERSATIONS LIST */}
        <div className="w-full md:w-[360px] bg-[#FBF8F1] border border-navy/15 rounded-[22px] shadow-lg flex flex-col overflow-hidden flex-none font-sans">
          
          {/* SEARCH & CONVERSATIONS HEADER */}
          <div className="p-4 border-b border-navy/12 bg-cream/50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-serif font-bold text-base text-navy flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#2C6350]" />
                <span>Conversations</span>
              </span>
              <span className="text-xs font-mono font-bold bg-[#2C6350]/10 text-[#2C6350] px-2 py-0.5 rounded-full">
                {conversations.length} total
              </span>
            </div>

            {/* SEARCH USERS */}
            <div className="relative">
              <Search className="w-4 h-4 text-navy/40 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 bg-white border border-navy/15 rounded-xl pl-9 pr-3 text-xs font-medium text-navy focus:outline-none focus:border-[#2C6350] transition-colors"
              />
            </div>
          </div>

          {/* USER CONVERSATIONS SCROLL AREA */}
          <div className="flex-1 overflow-y-auto divide-y divide-navy/8 no-scrollbar">
            {loadingConvs ? (
              <div className="p-8 text-center text-xs text-navy/60 space-y-2">
                <div className="w-5 h-5 border-2 border-[#2C6350] border-t-transparent rounded-full animate-spin mx-auto" />
                <div>Loading citizen support chats...</div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-navy/60">
                No user support conversations found.
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = c.id === selectedConvId;
                const hasUnread = c.unread_count > 0;

                return (
                  <div
                    key={c.id}
                    onClick={() => { setSelectedConvId(c.id); setError(''); }}
                    className={`p-4 transition-all duration-200 cursor-pointer flex items-start gap-3 relative ${
                      isSelected 
                        ? 'bg-[#16213C] text-[#FBF8F1] border-l-4 border-l-[#B7975A]' 
                        : 'hover:bg-[#2C6350]/8 text-navy'
                    }`}
                  >
                    {/* User Initials Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-none border shadow-xs ${
                      isSelected 
                        ? 'bg-marigold text-navy border-white' 
                        : 'bg-[#2C6350] text-white border-navy/10'
                    }`}>
                      {c.user_name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-2">
                        <h4 className={`font-semibold text-sm truncate ${isSelected ? 'text-white' : 'text-navy'}`}>
                          {c.user_name}
                        </h4>
                        <span className={`text-[10px] font-mono flex-none ${isSelected ? 'text-[#FBF8F1]/70' : 'text-navy/50'}`}>
                          {c.last_message_time ? new Date(c.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>

                      <p className={`text-xs truncate mt-0.5 ${isSelected ? 'text-[#FBF8F1]/80' : 'text-navy/60'}`}>
                        {c.last_message || 'No messages yet'}
                      </p>

                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-[11px] font-mono ${isSelected ? 'text-marigold' : 'text-[#2C6350]'}`}>
                          {c.user_email}
                        </span>

                        {hasUnread && (
                          <span className="bg-[#B24B2C] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-bounce">
                            ● {c.unread_count} new
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT SIDE — SELECTED USER CHAT WINDOW */}
        <div className="flex-1 bg-[#FBF8F1] border border-navy/15 rounded-[22px] shadow-lg flex flex-col overflow-hidden font-sans">
          
          {selectedConv ? (
            <>
              {/* CHAT HEADER FOR SELECTED USER */}
              <div className="p-4 sm:p-5 border-b border-navy/12 bg-white flex items-center justify-between gap-4 font-sans shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#2C6350] text-white font-bold text-base flex items-center justify-center border border-navy/15 shadow-xs">
                    {selectedConv.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-lg text-navy flex items-center gap-2">
                      <span>{selectedConv.user_name}</span>
                      <span className="text-xs font-sans font-semibold text-[#2C6350] bg-[#2C6350]/10 px-2.5 py-0.5 rounded-full">
                        Citizen Support
                      </span>
                    </h2>
                    <div className="text-xs font-mono text-navy/60">
                      Email: <b>{selectedConv.user_email}</b> • User ID: <b>#{selectedConv.user_id}</b>
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs text-navy/60 font-mono hidden sm:block">
                  <div>Conversation #{selectedConv.id}</div>
                  <div className="text-[#2C6350] font-semibold">● Active Session</div>
                </div>
              </div>

              {/* MESSAGES DISPLAY CONTAINER */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#F2ECDD]/40 no-scrollbar">
                {loadingMessages ? (
                  <div className="p-8 text-center text-xs text-navy/60 space-y-2">
                    <div className="w-5 h-5 border-2 border-[#2C6350] border-t-transparent rounded-full animate-spin mx-auto" />
                    <div>Loading user chat transcript...</div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-12 text-center text-sm text-navy/60 space-y-2">
                    <MessageSquare className="w-8 h-8 text-navy/30 mx-auto" />
                    <div>No messages in this support conversation yet.</div>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isUser = m.sender_type === 'user';
                    const isAI = m.sender_type === 'ai';
                    const isAdminMsg = m.sender_type === 'admin';

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isAdminMsg ? 'items-end' : 'items-start'} animate-fade-in`}
                      >
                        {/* Sender Badge */}
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold mb-1 text-navy/70 px-1">
                          {isUser && <span className="text-[#16213C]">👤 {selectedConv.user_name}</span>}
                          {isAI && <span className="text-[#16213C] bg-navy/10 px-2 py-0.5 rounded">🤖 SchemeSetu AI</span>}
                          {isAdminMsg && <span className="text-marigold bg-[#16213C] px-2 py-0.5 rounded">🛡️ SchemeSetu Admin (You)</span>}
                          <span className="text-[10px] text-navy/40 font-normal">
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Bubble */}
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm font-sans ${
                            isAdminMsg
                              ? 'bg-[#16213C] text-[#FBF8F1] rounded-tr-none border border-marigold/40'
                              : isAI
                              ? 'bg-white text-navy border border-navy/15 rounded-tl-none'
                              : 'bg-[#2C6350] text-[#FBF8F1] rounded-tl-none'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{m.message}</div>

                          {m.disclaimer && (
                            <div className="mt-2 pt-2 border-t border-navy/10 text-[11px] text-navy/60 italic font-sans">
                              {m.disclaimer}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* REPLY INPUT BAR */}
              <form onSubmit={handleSendReply} className="p-4 bg-white border-t border-navy/12 flex items-center gap-3">
                <input
                  type="text"
                  placeholder={`Type your official support reply to ${selectedConv.user_name}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={sending}
                  className="flex-1 h-12 bg-paper border border-navy/18 rounded-xl px-4 text-sm font-sans font-medium text-navy focus:outline-none focus:border-[#2C6350] focus:ring-2 focus:ring-[#2C6350]/10 transition-all"
                />

                <button
                  type="submit"
                  disabled={sending || !replyText.trim()}
                  className="h-12 px-6 bg-[#16213C] hover:bg-[#202F52] text-[#FBF8F1] font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 flex-none"
                >
                  {sending ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Reply</span>
                      <Send className="w-4 h-4 text-marigold" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-navy/60 space-y-3 font-sans">
              <MessageSquare className="w-12 h-12 text-[#2C6350] opacity-40" />
              <h3 className="font-serif font-bold text-xl text-navy">Select a Citizen Conversation</h3>
              <p className="text-sm max-w-md text-navy/60">
                Choose a user from the left sidebar to inspect their conversation transcript and send a targeted support reply.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatPanel;
