import React, { useState, useRef, useEffect } from 'react';
import { User, db } from '../lib/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { JournalEntry, ChatMessage } from '../types';
import { Send, Sparkles, ArrowLeft, Loader2, Smile, CloudRain, Flame, Heart, Compass, CheckCircle2, BookmarkCheck } from 'lucide-react';

interface JournalChatProps {
  user: User;
  activeEntry: JournalEntry | null;
  onBack: () => void;
  onSaveSuccess: () => void;
}

export const JournalChat: React.FC<JournalChatProps> = ({ user, activeEntry, onBack, onSaveSuccess }) => {
  const [title, setTitle] = useState(activeEntry?.title || '');
  const [topic, setTopic] = useState(activeEntry?.topic || 'Daily Reflection');
  const [mood, setMood] = useState<JournalEntry['mood']>(activeEntry?.mood || 'reflective');
  const [messages, setMessages] = useState<ChatMessage[]>(activeEntry?.messages || []);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState(activeEntry?.aiSummary || '');
  const [savedStatus, setSavedStatus] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || loading) return;

    const userMsgText = inputPrompt.trim();
    setInputPrompt('');
    setError(null);

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMsgText,
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setLoading(true);

    // Default title if empty
    const currentTitle = title.trim() || userMsgText.slice(0, 40) + '...';
    if (!title.trim()) setTitle(currentTitle);

    try {
      const res = await fetch('/api/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          userPrompt: userMsgText,
          contextTopic: topic
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get reflection response');

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: Date.now()
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);
      if (data.summary) {
        setAiSummary(data.summary);
      }

      // Auto-save to Firestore
      await saveToFirestore(finalMessages, data.summary || aiSummary, currentTitle);

    } catch (err: any) {
      setError(err.message || 'Something went wrong communicating with Gemini.');
    } finally {
      setLoading(false);
    }
  };

  const saveToFirestore = async (msgs: ChatMessage[], summary: string, currentTitle: string) => {
    try {
      setSaving(true);
      const entryData = {
        userId: user.uid,
        title: currentTitle || 'Untitled Reflection',
        topic,
        mood,
        messages: msgs,
        aiSummary: summary || 'Reflection session in progress.',
        updatedAt: Date.now(),
      };

      if (activeEntry?.id) {
        const docRef = doc(db, `users/${user.uid}/entries`, activeEntry.id);
        await updateDoc(docRef, entryData);
      } else {
        // Create new
        const colRef = collection(db, `users/${user.uid}/entries`);
        const docRef = await addDoc(colRef, {
          ...entryData,
          createdAt: Date.now()
        });
        // Update activeEntry so subsequent edits update this doc
        activeEntry = { id: docRef.id, ...entryData, createdAt: Date.now() } as JournalEntry;
      }

      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 3000);
      onSaveSuccess();
    } catch (err: any) {
      console.error('Error saving to Firestore:', err);
      setError('Failed to save to Firestore. Please check your network.');
    } finally {
      setSaving(false);
    }
  };

  const moods = [
    { id: 'reflective', label: 'Reflective', icon: Compass, color: 'text-[#7D8C7F] bg-[#F1EDE4] border-[#E5E0D5]' },
    { id: 'peaceful', label: 'Peaceful', icon: Smile, color: 'text-[#7D8C7F] bg-[#F1EDE4] border-[#E5E0D5]' },
    { id: 'inspired', label: 'Inspired', icon: Sparkles, color: 'text-[#7D8C7F] bg-[#F1EDE4] border-[#E5E0D5]' },
    { id: 'anxious', label: 'Anxious', icon: CloudRain, color: 'text-[#7D766B] bg-[#F1EDE4] border-[#E5E0D5]' },
    { id: 'grateful', label: 'Grateful', icon: Heart, color: 'text-[#7D8C7F] bg-[#F1EDE4] border-[#E5E0D5]' },
    { id: 'exhausted', label: 'Exhausted', icon: Flame, color: 'text-[#9C9384] bg-[#F1EDE4] border-[#E5E0D5]' },
  ];

  const topics = [
    'Daily Reflection',
    'Decision Brainstorming',
    'Stress & Clarity',
    'Gratitude & Joy',
    'Personal Growth',
    'Dreams & Ambitions'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-[#F1EDE4] p-4 rounded-2xl border border-[#E5E0D5] shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-[#3E3A35] hover:text-[#2C2A26] bg-white hover:bg-white/80 px-3.5 py-2 rounded-xl border border-[#E5E0D5] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          {saving && (
            <span className="text-xs text-[#9C9384] flex items-center gap-1.5 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
            </span>
          )}
          {savedStatus && (
            <span className="text-xs text-[#7D8C7F] flex items-center gap-1 font-medium bg-white px-3 py-1 rounded-full border border-[#E5E0D5]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved to Firestore
            </span>
          )}
          <button
            onClick={() => saveToFirestore(messages, aiSummary, title)}
            className="flex items-center gap-1.5 bg-[#7D8C7F] hover:bg-[#6B7A6D] text-white px-4 py-2 rounded-xl text-xs font-medium shadow-sm transition-all"
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Save Entry</span>
          </button>
        </div>
      </div>

      {/* Metadata Form Header */}
      <div className="bg-[#F1EDE4] p-6 rounded-2xl border border-[#E5E0D5] shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#9C9384] uppercase tracking-wider mb-1.5">
              Entry Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Finding calm amidst chaos..."
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E0D5] focus:outline-none focus:ring-2 focus:ring-[#7D8C7F]/20 focus:border-[#7D8C7F] text-[#2C2A26] font-serif text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9C9384] uppercase tracking-wider mb-1.5">
              Topic / Focus
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E5E0D5] focus:outline-none focus:ring-2 focus:ring-[#7D8C7F]/20 focus:border-[#7D8C7F] text-[#3E3A35] text-sm"
            >
              {topics.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mood Selector */}
        <div>
          <label className="block text-xs font-semibold text-[#9C9384] uppercase tracking-wider mb-2">
            Current Emotional State
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {moods.map((m) => {
              const Icon = m.icon;
              const isSelected = mood === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id as JournalEntry['mood'])}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    isSelected 
                      ? 'bg-[#7D8C7F] text-white border-[#7D8C7F] shadow-sm' 
                      : 'bg-white text-[#3E3A35] border-[#E5E0D5] hover:border-[#7D8C7F]/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : m.color.split(' ')[0]}`} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {aiSummary && (
          <div className="bg-white/80 border border-[#E5E0D5] p-3.5 rounded-xl flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#7D8C7F] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#2C2A26]">Gemini AI Takeaway Summary</p>
              <p className="text-xs text-[#7D766B] mt-0.5">{aiSummary}</p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Conversation Area */}
      <div className="bg-[#F1EDE4] rounded-2xl border border-[#E5E0D5] shadow-sm overflow-hidden flex flex-col min-h-[450px]">
        <div className="p-4 bg-white/60 border-b border-[#E5E0D5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#7D8C7F]" />
            <span className="text-xs font-bold text-[#2C2A26] tracking-wider uppercase">Conversation with Gemini 3.7 Flash</span>
          </div>
          <span className="text-[11px] text-[#9C9384] font-medium">{messages.length} messages</span>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[500px]">
          {messages.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#7D8C7F]/20 text-[#7D8C7F] flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-[#2C2A26] text-lg">Begin your reflection</h3>
              <p className="text-sm text-[#7D766B] max-w-md mx-auto">
                Write your thoughts, ask a question, or describe what's on your mind. Gemini will provide guidance, summaries, and brainstorming reflections.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-[#7D8C7F] text-white' : 'bg-white text-[#7D8C7F] border border-[#E5E0D5]'
                }`}>
                  {msg.role === 'user' ? 'U' : <Sparkles className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#7D8C7F] text-white rounded-tr-none' 
                    : 'bg-white text-[#3E3A35] rounded-tl-none border border-[#E5E0D5]'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span className={`block text-[10px] mt-2 ${msg.role === 'user' ? 'text-white/80 text-right' : 'text-[#9C9384]'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-3 max-w-md mr-auto">
              <div className="w-8 h-8 rounded-full bg-white text-[#7D8C7F] border border-[#E5E0D5] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-white text-[#7D766B] flex items-center gap-2 border border-[#E5E0D5]">
                <Loader2 className="w-4 h-4 animate-spin text-[#7D8C7F]" />
                <span className="text-xs font-medium">Gemini is reflecting on your input...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-[#E5E0D5] flex items-center gap-3">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Write your reflection, thought, or question here..."
            className="flex-1 px-4 py-3 rounded-xl bg-[#F9F7F2] border border-[#E5E0D5] focus:outline-none focus:ring-2 focus:ring-[#7D8C7F]/20 focus:border-[#7D8C7F] text-sm text-[#3E3A35]"
          />
          <button
            type="submit"
            disabled={loading || !inputPrompt.trim()}
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#7D8C7F] hover:bg-[#6B7A6D] text-white shadow-sm disabled:opacity-50 transition-all shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

