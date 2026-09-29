'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import {
  MessageSquare,
  Plus,
  Send,
  Activity,
  AlertTriangle,
  FileText,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  ChevronRight,
  Shield,
  Clock,
  Sparkles,
  PhoneCall,
  User,
  PanelRightClose,
  PanelRightOpen,
  ArrowRight,
  RefreshCw,
  Info,
} from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string | Date;
  isEmergency?: boolean;
  emergencySummary?: string;
  proposedMemories?: Array<{
    type: 'allergy' | 'condition' | 'medicine' | 'preference' | 'vital_note';
    key: string;
    value: string;
  }>;
  suggestedActions?: string[];
}

interface ConversationItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  preview: string;
}

interface MemoryItemDisplay {
  id: string;
  infoType: string;
  key: string;
  value: string;
  isConfirmed: boolean;
}

function renderFormattedContent(content: string, isUser: boolean) {
  if (isUser) {
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  // Remove any leftover raw asterisks or markdown star markers
  const cleanContent = content
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\*/g, '');

  const lines = cleanContent.split('\n');

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Emergency or legal disclaimer box
        if (trimmed.startsWith('⚠️') || trimmed.startsWith('>')) {
          const text = trimmed.replace(/^[>⚠️\s]+/, '');
          return (
            <div
              key={idx}
              className="p-2.5 my-2 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2"
            >
              <span className="text-amber-600 font-bold shrink-0">⚠️</span>
              <span>{text}</span>
            </div>
          );
        }

        // Bullet point lines (starts with • or -)
        if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
          const itemText = trimmed.replace(/^[•\-]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-2 shrink-0" />
              <span className="flex-1">{itemText}</span>
            </div>
          );
        }

        // Numbered list items like ১. or 1.
        if (/^[০-৯0-9]+[.)]/.test(trimmed)) {
          return (
            <div key={idx} className="font-semibold text-slate-900 pt-1">
              {trimmed}
            </div>
          );
        }

        return (
          <p key={idx} className="text-slate-800">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

export default function ChatDashboardPage() {
  const { language, t, user, isGuest } = useApp();

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeMemories, setActiveMemories] = useState<MemoryItemDisplay[]>([]);

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar
  const [isContextPanelOpen, setIsContextPanelOpen] = useState(true); // Desktop right panel
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedMemoriesMap, setConfirmedMemoriesMap] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load conversations on mount or when user changes
  useEffect(() => {
    if (user) {
      loadConversations();
      loadUserMemories();
    } else {
      setConversations([]);
      setActiveMemories([]);
    }
  }, [user]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const loadConversations = async (query = '') => {
    try {
      const url = query ? `/api/conversations?q=${encodeURIComponent(query)}` : '/api/conversations';
      const res = await fetch(url);
      const data = await res.json();
      if (data.conversations) {
        setConversations(data.conversations);
      }
    } catch (e) {
      console.error('Failed to load conversations:', e);
    }
  };

  const loadUserMemories = async () => {
    try {
      const res = await fetch('/api/memory');
      const data = await res.json();
      if (data.memories) {
        setActiveMemories(data.memories.filter((m: MemoryItemDisplay) => m.isConfirmed));
      }
    } catch (e) {
      console.error('Failed to load memories:', e);
    }
  };

  const loadConversationMessages = async (convId: string) => {
    try {
      setErrorMessage(null);
      const res = await fetch(`/api/conversations/${convId}`);
      const data = await res.json();
      if (data.messages) {
        setActiveConversationId(convId);
        setMessages(data.messages);
        setIsSidebarOpen(false);
      }
    } catch (e) {
      console.error('Failed to load conversation messages:', e);
    }
  };

  const handleStartNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setInputMessage('');
    setErrorMessage(null);
    setIsSidebarOpen(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isSending) return;

    setInputMessage('');
    setErrorMessage(null);

    const tempUserMsgId = `user_${Date.now()}`;
    const userMsg: Message = {
      id: tempUserMsgId,
      role: 'user',
      content: text,
      status: 'completed',
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsSending(true);

    try {
      const payload: any = {
        conversationId: activeConversationId,
        message: text,
        language,
        clientMessageId: tempUserMsgId,
      };

      // If guest or no saved conversation yet, pass message history
      if (!activeConversationId || isGuest) {
        payload.messagesHistory = updatedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response from Doctor AI');
      }

      const assistantMsg: Message = {
        id: data.assistantMessageId || `ast_${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        status: 'completed',
        timestamp: new Date().toISOString(),
        isEmergency: data.isEmergency,
        emergencySummary: data.emergencySummary,
        proposedMemories: data.proposedMemories,
        suggestedActions: data.suggestedFollowUps,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (data.conversationId && data.conversationId !== activeConversationId) {
        setActiveConversationId(data.conversationId);
      }

      if (user) {
        loadConversations();
        loadUserMemories();
      }
    } catch (err: any) {
      console.error('Send error:', err);
      setErrorMessage(err.message || 'মেসেজ পাঠানো সম্ভব হয়নি। দয়া করে আবার চেষ্টা করুন।');
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: `⚠️ ${err.message || 'সেবায় সাময়িক বিলম্ব হচ্ছে। অনুগ্রহ করে একটু পর আবার চেষ্টা করুন।'}`,
          status: 'failed',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleConfirmMemory = async (type: string, key: string, value: string) => {
    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          infoType: type,
          key,
          value,
          isConfirmed: true,
          source: 'chat_consultation',
        }),
      });

      if (res.ok) {
        setConfirmedMemoriesMap((prev) => ({ ...prev, [`${type}_${key}`]: true }));
        loadUserMemories();
      }
    } catch (e) {
      console.error('Confirm memory error:', e);
    }
  };

  const handleDeleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(language === 'bn' ? 'আপনি কি এই আলোচনাটি মুছে ফেলতে চান?' : 'Delete this conversation?')) {
      return;
    }

    try {
      const res = await fetch(`/api/conversations/${convId}`, { method: 'DELETE' });
      if (res.ok) {
        if (activeConversationId === convId) {
          handleStartNewChat();
        }
        loadConversations();
        loadUserMemories();
      }
    } catch (e) {
      console.error('Delete conversation error:', e);
    }
  };

  const handleSaveTitle = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editedTitle.trim()) {
      setEditingTitleId(null);
      return;
    }

    try {
      const res = await fetch(`/api/conversations/${convId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editedTitle.trim() }),
      });
      if (res.ok) {
        setEditingTitleId(null);
        loadConversations();
      }
    } catch (e) {
      console.error('Rename title error:', e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden w-full h-[calc(100dvh-4.75rem)] sm:h-[calc(100dvh-5.5rem)] min-h-0">
      {/* 1. LEFT SIDEBAR: Conversation History (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[84vw] max-w-[300px] sm:w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out md:static md:w-72 md:h-full md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-3 sm:p-3.5 border-b border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={handleStartNewChat}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition shadow-sm cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t.chat.newChat}</span>
          </button>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
            aria-label="Close chat history"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Chat History */}
        {user && (
          <div className="px-3 pt-3 pb-1">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  loadConversations(e.target.value);
                }}
                placeholder={t.chat.searchHistory}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>
        )}

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {user ? (
            conversations.length > 0 ? (
              conversations.map((conv) => {
                const isActive = activeConversationId === conv.id;
                const isEditing = editingTitleId === conv.id;

                return (
                  <div
                    key={conv.id}
                    onClick={() => !isEditing && loadConversationMessages(conv.id)}
                    className={`group relative flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition text-xs ${
                      isActive
                        ? 'bg-teal-50/80 text-teal-900 border border-teal-200/80 font-medium'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 truncate flex-1 min-w-0">
                      <MessageSquare
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          isActive ? 'text-teal-600' : 'text-slate-400'
                        }`}
                      />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-white border border-teal-300 rounded px-1.5 py-0.5 text-xs text-slate-900 w-full focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <div className="truncate">
                          <p className="truncate font-medium">{conv.title}</p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {conv.preview || (language === 'bn' ? 'আলোচনা শুরু হয়েছে' : 'Consultation started')}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="hidden group-hover:flex items-center gap-1 shrink-0 ml-1">
                      {isEditing ? (
                        <button
                          onClick={(e) => handleSaveTitle(conv.id, e)}
                          className="p-1 hover:text-teal-700 text-teal-600"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTitleId(conv.id);
                            setEditedTitle(conv.title);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-700"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDeleteConversation(conv.id, e)}
                        className="p-1 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 px-4 text-xs text-slate-400">
                <Clock className="w-6 h-6 mx-auto mb-2 opacity-40 text-slate-400" />
                <p>{language === 'bn' ? 'কোনো পূর্ববর্তী আলোচনা নেই' : 'No chat history yet'}</p>
              </div>
            )
          ) : (
            <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 space-y-2">
              <p className="font-semibold">{t.chat.guestWarning}</p>
              <Link
                href="/login"
                className="inline-block w-full py-1.5 text-center bg-teal-600 text-white font-bold rounded-lg text-xs hover:bg-teal-700"
              >
                {t.nav.login}
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-teal-700 font-medium">
            <Shield className="w-3.5 h-3.5" />
            SSL Encrypted
          </span>
          <span>BD 2026</span>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
          aria-label="Close sidebar"
        />
      )}

      {/* 2. CENTRAL CHAT AREA */}
      <section className="flex-1 flex flex-col bg-white overflow-hidden min-w-0">
        {/* Chat Header Bar */}
        <div className="h-13 sm:h-14 px-2.5 sm:px-4 border-b border-slate-200/80 flex items-center justify-between bg-white/95 backdrop-blur-xs shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100 cursor-pointer"
              title="চ্যাট হিস্ট্রি"
              aria-label="Open chat history"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
              <h1 className="text-xs sm:text-base font-bold text-slate-900 truncate max-w-[140px] xs:max-w-[200px] sm:max-w-md">
                {activeConversationId
                  ? conversations.find((c) => c.id === activeConversationId)?.title ||
                    t.appName
                  : t.appName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Generate Report Button for this consultation */}
            {messages.length > 1 && (
              <Link
                href={`/reports?generateFrom=${activeConversationId || 'current'}`}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold hover:bg-teal-100 active:bg-teal-200 transition shadow-2xs"
                title={t.chat.generateReportBtn}
              >
                <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span className="hidden xs:inline">{t.chat.generateReportBtn}</span>
              </Link>
            )}

            {/* Context Panel Toggle */}
            <button
              onClick={() => setIsContextPanelOpen(!isContextPanelOpen)}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium cursor-pointer"
              title="রোগীর তথ্য প্যানেল"
            >
              {isContextPanelOpen ? (
                <>
                  <PanelRightClose className="w-4 h-4 text-slate-500" />
                  <span>তথ্য লুকান</span>
                </>
              ) : (
                <>
                  <PanelRightOpen className="w-4 h-4 text-teal-600" />
                  <span>স্বাস্থ্য তথ্য</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-5 bg-gradient-to-b from-slate-50/50 to-white">
          {messages.length === 0 ? (
            /* Empty State with Welcoming Doctor AI Persona and Quick Symptoms */
            <div className="max-w-2xl mx-auto py-6 sm:py-10 px-2 sm:px-4 text-center space-y-5 sm:space-y-6">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-teal-600/20 mx-auto">
                <img src="/icon.svg" alt="Online Doctor" className="w-full h-full object-contain" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
                  {t.chat.emptyChatTitle}
                </h2>
                <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  {t.chat.emptyChatSubtitle}
                </p>
              </div>

              {/* Bangladesh Medical Safety Notice Banner */}
              <div className="p-3 sm:p-3.5 bg-teal-50/80 rounded-xl border border-teal-200/70 text-teal-900 text-xs max-w-lg mx-auto text-left flex gap-2.5 shadow-2xs">
                <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium text-[11px] sm:text-xs">
                  {t.disclaimerText}
                </p>
              </div>

              {/* Quick Symptom Chips */}
              <div className="space-y-2.5 pt-1">
                <p className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t.chat.symptomSuggestionsTitle}
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                  {t.chat.chips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip)}
                      className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-slate-700 hover:text-teal-900 text-[11px] sm:text-xs font-medium transition cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Active Conversation Bubbles */
            messages.map((msg) => {
              const isUser = msg.role === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[90%] sm:max-w-3xl ${
                    isUser ? 'ml-auto' : 'mr-auto'
                  }`}
                >
                  <div className="flex items-start gap-2.5 max-w-full">
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 shadow-xs mt-1">
                        <img src="/icon.svg" alt="Doctor" className="w-full h-full object-contain" />
                      </div>
                    )}

                    <div
                      className={`rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-xs leading-relaxed text-sm ${
                        isUser
                          ? 'bg-teal-600 text-white rounded-tr-xs'
                          : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs'
                      }`}
                    >
                      {/* Emergency Warning Banner if detected by AI */}
                      {msg.isEmergency && (
                        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs flex items-start gap-2.5">
                          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5 animate-pulse" />
                          <div className="space-y-1">
                            <p className="font-bold text-red-700">
                              {language === 'bn' ? 'জরুরি চিকিৎসা সতর্কতা' : 'Urgent Emergency Warning'}
                            </p>
                            <p className="leading-snug">
                              {msg.emergencySummary ||
                                (language === 'bn'
                                  ? 'এই লক্ষণে অবিলম্বে জাতীয় জরুরি সেবা ৯৯৯ নম্বরে কল করুন বা নিকটস্থ হাসপাতালের ইমার্জেন্সিতে যান।'
                                  : 'Call 999 or proceed to the nearest hospital emergency room immediately.')}
                            </p>
                            <a
                              href="tel:999"
                              className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              {t.chat.emergencyAction}
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Message Content with Clean Formatting without raw stars */}
                      {renderFormattedContent(msg.content, isUser)}

                      {/* Proposed Memory Confirmation Cards */}
                      {msg.proposedMemories && msg.proposedMemories.length > 0 && user && (
                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                          <p className="text-[11px] font-bold text-teal-800 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-teal-600" />
                            {t.chat.memoryProposalTitle}
                          </p>
                          <div className="space-y-1.5">
                            {msg.proposedMemories.map((mem, idx) => {
                              const memKey = `${mem.type}_${mem.key}`;
                              const isConfirmed = confirmedMemoriesMap[memKey];

                              return (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-2 rounded-lg bg-teal-50/70 border border-teal-200/60 text-xs"
                                >
                                  <div>
                                    <span className="font-bold text-teal-900 capitalize mr-1.5">
                                      {mem.type === 'allergy'
                                        ? t.chat.allergy
                                        : mem.type === 'condition'
                                        ? t.chat.condition
                                        : t.chat.medicine}:
                                    </span>
                                    <span className="text-slate-700">{mem.value}</span>
                                  </div>

                                  {isConfirmed ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                                      <Check className="w-3 h-3" />
                                      {language === 'bn' ? 'সংরক্ষিত' : 'Saved'}
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        handleConfirmMemory(mem.type, mem.key, mem.value)
                                      }
                                      className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-[11px] font-bold transition shadow-xs"
                                    >
                                      {t.chat.confirmMemory}
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 mt-1 px-1" suppressHydrationWarning>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              );
            })
          )}

          {/* AI Thinking Animation */}
          {isSending && (
            <div className="flex items-start gap-2.5 max-w-xl mr-auto">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
                <Activity className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
                <div className="flex items-center space-x-2 text-xs text-teal-700 font-medium">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.chat.thinking}</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error message retry banner if any */}
        {errorMessage && (
          <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <span className="truncate">{errorMessage}</span>
            <button
              onClick={() => handleSendMessage()}
              className="text-xs font-bold underline hover:text-rose-900 shrink-0 ml-2"
            >
              {t.chat.retry}
            </button>
          </div>
        )}

        {/* Chat Composer Bar */}
        <div className="p-2 sm:p-3 border-t border-slate-200/80 bg-white shadow-lg safe-bottom shrink-0">
          <div className="max-w-4xl mx-auto space-y-1 sm:space-y-1.5">
            <div className="relative flex items-end gap-1.5 sm:gap-2 bg-slate-50 border border-slate-300 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 focus-within:bg-white transition">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder={t.chat.placeholder}
                className="w-full bg-transparent px-2 py-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none max-h-24 sm:max-h-32 min-h-[38px] leading-relaxed"
                style={{ fontSize: '16px' }}
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isSending}
                className={`p-2.5 rounded-lg sm:rounded-xl font-bold transition flex items-center justify-center cursor-pointer shrink-0 min-w-[40px] min-h-[40px] active:scale-95 ${
                  inputMessage.trim() && !isSending
                    ? 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white shadow-md'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 px-1">
              <span className="truncate max-w-[75%] sm:max-w-none">{t.disclaimerText}</span>
              <span className="hidden sm:inline-block shrink-0">Enter = পাঠাতে / Shift+Enter = নতুন লাইন</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RIGHT CONTEXT PANEL: Patient Health Snapshot (Collapsible, hidden on mobile & tablet) */}
      {isContextPanelOpen && (
        <aside className="hidden xl:flex w-72 2xl:w-80 bg-slate-50/70 border-l border-slate-200/80 flex-col p-4 space-y-5 overflow-y-auto shrink-0">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {t.chat.patientContextTitle}
              </h2>
            </div>
            <button
              onClick={() => setIsContextPanelOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          </div>

          {/* Patient Overview */}
          {user ? (
            <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{user.name}</span>
                <span className="text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-semibold border border-teal-200">
                  {user.profile?.gender || (language === 'bn' ? 'রোগী' : 'Patient')}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'bn' ? 'বয়স:' : 'Age:'}{' '}
                {user.profile?.age ? `${user.profile.age} বছর` : t.reports.notSpecified}
              </p>
            </div>
          ) : (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
              <p className="font-semibold">{t.nav.guestMode}</p>
              <p className="text-[11px] mt-0.5 text-amber-700">
                {language === 'bn'
                  ? 'রোগীর প্রোফাইল ও স্বাস্থ্য স্মৃতি সেভ করতে একটি ফ্রি অ্যাকাউন্ট তৈরি করুন।'
                  : 'Create a free account to save profile & health memories.'}
              </p>
            </div>
          )}

          {/* Active Health Memories */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">{t.chat.activeMemories}</span>
              <Link href="/memory" className="text-[11px] text-teal-600 font-semibold hover:underline">
                {language === 'bn' ? 'সম্পাদনা' : 'Manage'}
              </Link>
            </div>

            {activeMemories.length > 0 ? (
              <div className="space-y-1.5">
                {activeMemories.map((mem) => (
                  <div
                    key={mem.id}
                    className="p-2 rounded-lg bg-white border border-slate-200/80 text-xs shadow-2xs space-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-teal-900 capitalize text-[11px]">
                        {mem.infoType === 'allergy'
                          ? t.chat.allergy
                          : mem.infoType === 'condition'
                          ? t.chat.condition
                          : t.chat.medicine}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    </div>
                    <p className="text-slate-700 leading-snug">{mem.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-white rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
                {t.chat.noActiveMemories}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <Link
              href="/medicines"
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-teal-700 hover:border-teal-300 text-xs font-medium transition shadow-xs"
            >
              <span>{t.medicines.title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/reports"
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 hover:bg-teal-100 text-xs font-semibold transition shadow-xs"
            >
              <span>{t.reports.title}</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
            </Link>
          </div>
        </aside>
      )}
    </div>
  );
}
