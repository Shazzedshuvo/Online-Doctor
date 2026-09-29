'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Brain,
  Shield,
  Trash2,
  Edit2,
  Check,
  X,
  Plus,
  RefreshCw,
  AlertCircle,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Info,
} from 'lucide-react';
import Link from 'next/link';

interface MemoryItem {
  id: string;
  infoType: 'allergy' | 'condition' | 'medicine' | 'preference' | 'vital_note' | 'pregnancy';
  key: string;
  value: string;
  isConfirmed: boolean;
  source: string;
  status: 'active' | 'outdated' | 'dismissed';
  recordedAt: string;
  lastConfirmedAt: string;
}

export default function MemoryManagementPage() {
  const { language, t, user, isGuest } = useApp();
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Consent toggles state
  const [saveChatHistory, setSaveChatHistory] = useState(true);
  const [rememberHealthInfo, setRememberHealthInfo] = useState(true);

  // New memory modal / form state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newType, setNewType] = useState<MemoryItem['infoType']>('allergy');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  // Inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (user) {
      setSaveChatHistory(user.settings.saveChatHistory);
      setRememberHealthInfo(user.settings.rememberHealthInfo);
      fetchMemories();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchMemories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/memory');
      const data = await res.json();
      if (data.memories) {
        setMemories(data.memories);
      }
    } catch (e) {
      console.error('Fetch memory error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSetting = async (field: 'saveChatHistory' | 'rememberHealthInfo', val: boolean) => {
    try {
      if (field === 'saveChatHistory') setSaveChatHistory(val);
      if (field === 'rememberHealthInfo') setRememberHealthInfo(val);

      await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            [field]: val,
          },
        }),
      });
    } catch (e) {
      console.error('Toggle error:', e);
    }
  };

  const handleAddNewMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          infoType: newType,
          key: newKey.trim(),
          value: newValue.trim(),
          isConfirmed: true,
          source: 'user_manual',
        }),
      });

      if (res.ok) {
        setNewKey('');
        setNewValue('');
        setIsAddingNew(false);
        fetchMemories();
      }
    } catch (e) {
      console.error('Add memory error:', e);
    }
  };

  const handleSaveEdit = async (id: string) => {
    if (!editValue.trim()) return;
    try {
      const res = await fetch(`/api/memory/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: editValue.trim() }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchMemories();
      }
    } catch (e) {
      console.error('Edit error:', e);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm(language === 'bn' ? 'এই তথ্যটি স্মৃতি থেকে মুছে ফেলতে চান?' : 'Delete this memory?')) {
      return;
    }
    try {
      const res = await fetch(`/api/memory/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMemories();
      }
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  const handleClearAll = async () => {
    if (!confirm(t.memory.clearAllConfirm)) return;
    try {
      const res = await fetch('/api/memory?all=true', { method: 'DELETE' });
      if (res.ok) {
        fetchMemories();
      }
    } catch (e) {
      console.error('Clear all error:', e);
    }
  };

  const handleToggleConfirm = async (item: MemoryItem) => {
    try {
      const res = await fetch(`/api/memory/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isConfirmed: !item.isConfirmed }),
      });
      if (res.ok) {
        fetchMemories();
      }
    } catch (e) {
      console.error('Confirm error:', e);
    }
  };

  if (isGuest) {
    return (
      <div className="flex-1 max-w-3xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
          <Brain className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">{t.memory.title}</h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          {language === 'bn'
            ? 'রোগীর ব্যক্তিগত স্বাস্থ্য স্মৃতি সক্রিয় করতে অনুগ্রহ করে লগইন করুন। গেস্ট মোডে কোনো স্বাস্থ্য তথ্য স্থায়ীভাবে মনে রাখা হয় না।'
            : 'Please login to access personalized health memory. In guest mode, no health records are saved across sessions.'}
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/login"
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition"
          >
            {t.nav.login}
          </Link>
          <Link
            href="/register"
            className="px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-sm transition"
          >
            {t.nav.register}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 py-5 sm:py-8 px-3 sm:px-4 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
            <Brain className="w-3.5 h-3.5" />
            <span>Cross-Conversation Memory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.memory.title}
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            {t.memory.subtitle}
          </p>
        </div>

        {/* Independent Consent Toggles */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-600" />
            <span>{t.memory.togglesTitle}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Save Chat History Toggle */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-sm font-bold text-slate-900 block">
                  {t.memory.saveChatHistoryToggle}
                </span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.memory.saveChatHistoryDesc}
                </p>
              </div>

              <button
                onClick={() => handleToggleSetting('saveChatHistory', !saveChatHistory)}
                className="shrink-0 p-1 cursor-pointer"
              >
                {saveChatHistory ? (
                  <ToggleRight className="w-9 h-9 text-teal-600 transition" />
                ) : (
                  <ToggleLeft className="w-9 h-9 text-slate-300 transition" />
                )}
              </button>
            </div>

            {/* Remember Health Info Toggle */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-sm font-bold text-slate-900 block">
                  {t.memory.rememberHealthToggle}
                </span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.memory.rememberHealthDesc}
                </p>
              </div>

              <button
                onClick={() => handleToggleSetting('rememberHealthInfo', !rememberHealthInfo)}
                className="shrink-0 p-1 cursor-pointer"
              >
                {rememberHealthInfo ? (
                  <ToggleRight className="w-9 h-9 text-teal-600 transition" />
                ) : (
                  <ToggleLeft className="w-9 h-9 text-slate-300 transition" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Memory Items Section */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t.memory.activeItems} ({memories.length})
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'এই তথ্যগুলো স্বাস্থ্য আলোচনার সময় স্বয়ংক্রিয়ভাবে বিবেচনা করা হয়।'
                  : 'These facts are factored in during consultations.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.memory.addMemoryBtn}</span>
              </button>

              {memories.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t.memory.clearAllBtn}</span>
                </button>
              )}
            </div>
          </div>

          {/* Add New Memory Form Modal / Collapsible */}
          {isAddingNew && (
            <form
              onSubmit={handleAddNewMemory}
              className="p-4 bg-teal-50/60 rounded-xl border border-teal-200 space-y-3"
            >
              <h3 className="text-xs font-bold text-teal-900 uppercase">
                {t.memory.addMemoryBtn}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">
                    {t.memory.typeSelect}
                  </label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="allergy">{t.chat.allergy}</option>
                    <option value="condition">{t.chat.condition}</option>
                    <option value="medicine">{t.chat.medicine}</option>
                    <option value="pregnancy">{t.chat.pregnancy}</option>
                    <option value="vital_note">স্বাস্থ্য নোট (Health Note)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">
                    তথ্য শিরোনাম (Label)
                  </label>
                  <input
                    type="text"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder={t.memory.keyPlaceholder}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-teal-500 text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">
                    বিবরণ (Details)
                  </label>
                  <input
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder={t.memory.valPlaceholder}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-teal-500 text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  {t.memory.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  {t.memory.save}
                </button>
              </div>
            </form>
          )}

          {/* List of Memories */}
          {isLoading ? (
            <div className="text-center py-10">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-600" />
            </div>
          ) : memories.length > 0 ? (
            <div className="space-y-2.5">
              {memories.map((mem) => {
                const isEditing = editingId === mem.id;

                return (
                  <div
                    key={mem.id}
                    className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 uppercase">
                          {mem.infoType === 'allergy'
                            ? t.chat.allergy
                            : mem.infoType === 'condition'
                            ? t.chat.condition
                            : mem.infoType === 'medicine'
                            ? t.chat.medicine
                            : mem.infoType}
                        </span>

                        <span className="text-xs font-bold text-slate-900">
                          {mem.key}
                        </span>

                        {mem.isConfirmed ? (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {t.memory.confirmedBadge}
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {t.memory.unconfirmedBadge}
                          </span>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="bg-slate-50 border border-teal-400 rounded-lg px-2.5 py-1 text-xs text-slate-800 w-full focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(mem.id)}
                            className="p-1.5 bg-teal-600 text-white rounded-lg text-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 bg-slate-200 text-slate-600 rounded-lg text-xs"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {mem.value}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-0.5">
                        <span suppressHydrationWarning>
                          {t.memory.recordedOn}{' '}
                          {new Date(mem.recordedAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>
                          {t.memory.source}{' '}
                          {mem.source === 'profile'
                            ? 'প্রোফাইল'
                            : mem.source === 'chat_consultation'
                            ? 'পরামর্শ চ্যাট'
                            : 'সরাসরি যোগ করা'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleToggleConfirm(mem)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                          mem.isConfirmed
                            ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            : 'bg-emerald-600 text-white border-transparent hover:bg-emerald-700'
                        }`}
                        title="নিশ্চিতকরণ পরিবর্তন করুন"
                      >
                        {mem.isConfirmed ? 'বাতিল' : 'নিশ্চিত করুন'}
                      </button>

                      <button
                        onClick={() => {
                          setEditingId(mem.id);
                          setEditValue(mem.value);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                        title={t.memory.edit}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteItem(mem.id)}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                        title={t.memory.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl space-y-2">
              <Brain className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-500">
                {t.memory.emptyState}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
