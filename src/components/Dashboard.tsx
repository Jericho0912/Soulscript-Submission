import React, { useState, useEffect } from 'react';
import { User, db } from '../lib/firebase';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { JournalEntry } from '../types';
import { Plus, Search, BookOpen, Sparkles, Trash2, Calendar, Clock, Smile, Compass, CloudRain, Heart, Flame, ShieldCheck } from 'lucide-react';

interface DashboardProps {
  user: User;
  onOpenNewEntry: () => void;
  onOpenEntry: (entry: JournalEntry) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onOpenNewEntry, onOpenEntry }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const colRef = collection(db, `users/${user.uid}/entries`);
      const q = query(colRef, orderBy('updatedAt', 'desc'));
      const snapshot = await getDocs(q);
      const loadedEntries: JournalEntry[] = [];
      snapshot.forEach((docSnap) => {
        loadedEntries.push({
          id: docSnap.id,
          ...docSnap.data()
        } as JournalEntry);
      });
      setEntries(loadedEntries);
    } catch (err) {
      console.error('Error fetching entries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [user.uid]);

  const handleDelete = async (e: React.MouseEvent, entryId: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this journal entry?")) return;
    try {
      setDeletingId(entryId);
      const docRef = doc(db, `users/${user.uid}/entries`, entryId);
      await deleteDoc(docRef);
      setEntries(entries.filter(en => en.id !== entryId));
    } catch (err) {
      console.error("Error deleting entry:", err);
      alert("Failed to delete entry.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          entry.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          entry.aiSummary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = selectedMoodFilter === 'all' || entry.mood === selectedMoodFilter;
    return matchesSearch && matchesMood;
  });

  const getMoodIcon = (mood: JournalEntry['mood']) => {
    switch (mood) {
      case 'peaceful': return <Smile className="w-4 h-4 text-[#7D8C7F]" />;
      case 'inspired': return <Sparkles className="w-4 h-4 text-[#7D8C7F]" />;
      case 'anxious': return <CloudRain className="w-4 h-4 text-[#7D766B]" />;
      case 'grateful': return <Heart className="w-4 h-4 text-[#7D8C7F]" />;
      case 'exhausted': return <Flame className="w-4 h-4 text-[#9C9384]" />;
      default: return <Compass className="w-4 h-4 text-[#7D8C7F]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-[#F1EDE4] text-[#3E3A35] rounded-3xl p-8 border border-[#E5E0D5] shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 text-[#7D8C7F] text-xs font-semibold backdrop-blur-md border border-[#E5E0D5]">
            <ShieldCheck className="w-3.5 h-3.5" /> Private User-Isolated Vault
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#2C2A26]">
            Welcome back, {user.displayName || user.email?.split('@')[0]}
          </h1>
          <p className="text-[#7D766B] text-sm max-w-xl font-light">
            Your personal reflection journal powered by Gemini 3.7 Flash and Firestore. Take a moment to unpack your thoughts today.
          </p>
        </div>

        <button
          onClick={onOpenNewEntry}
          className="relative z-10 flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#7D8C7F] hover:bg-[#6B7A6D] text-white font-semibold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer text-sm shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>New Reflection</span>
        </button>
      </div>

      {/* Stats & Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#F1EDE4] p-5 rounded-2xl border border-[#E5E0D5] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#7D8C7F]/20 text-[#7D8C7F] flex items-center justify-center font-bold text-lg">
            {entries.length}
          </div>
          <div>
            <p className="text-xs text-[#7D766B] font-medium">Total Reflections</p>
            <p className="text-sm font-bold text-[#2C2A26]">In your private journal</p>
          </div>
        </div>

        <div className="md:col-span-3 bg-[#F1EDE4] p-4 rounded-2xl border border-[#E5E0D5] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C9384]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past entries..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#E5E0D5] text-xs text-[#3E3A35] focus:outline-none focus:ring-2 focus:ring-[#7D8C7F]/20 focus:border-[#7D8C7F]"
            />
          </div>

          {/* Mood Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['all', 'reflective', 'peaceful', 'inspired', 'anxious', 'grateful', 'exhausted'].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMoodFilter(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-all ${
                  selectedMoodFilter === m 
                    ? 'bg-[#7D8C7F] text-white' 
                    : 'bg-white text-[#7D766B] hover:bg-white/60 border border-[#E5E0D5]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Entries List */}
      <div>
        <h2 className="text-lg font-serif font-bold text-[#2C2A26] mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#7D8C7F]" />
          <span>Journal History ({filteredEntries.length})</span>
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-[#F1EDE4] p-6 rounded-2xl border border-[#E5E0D5] h-48 animate-pulse space-y-4">
                <div className="h-4 bg-[#E5E0D5] rounded w-3/4" />
                <div className="h-3 bg-[#E5E0D5] rounded w-1/2" />
                <div className="space-y-2 pt-4">
                  <div className="h-3 bg-[#E5E0D5] rounded" />
                  <div className="h-3 bg-[#E5E0D5] rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-20 bg-[#F1EDE4] rounded-3xl border border-[#E5E0D5] shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#7D8C7F]/20 text-[#7D8C7F] flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-[#2C2A26] text-xl">No journal entries found</h3>
            <p className="text-sm text-[#7D766B] max-w-sm mx-auto">
              {searchQuery || selectedMoodFilter !== 'all' 
                ? 'Try adjusting your search query or mood filter.' 
                : 'Begin your first reflection session with Gemini to record your thoughts.'}
            </p>
            {!searchQuery && selectedMoodFilter === 'all' && (
              <button
                onClick={onOpenNewEntry}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7D8C7F] text-white font-medium text-xs hover:bg-[#6B7A6D] transition-all"
              >
                <Plus className="w-4 h-4" /> Start Reflection
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => onOpenEntry(entry)}
                className="bg-[#F1EDE4] p-6 rounded-2xl border border-[#E5E0D5] shadow-sm hover:shadow-md hover:border-[#7D8C7F] transition-all cursor-pointer flex flex-col justify-between group relative"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[#3E3A35] text-[11px] font-medium capitalize border border-[#E5E0D5]">
                      {getMoodIcon(entry.mood)}
                      {entry.mood}
                    </span>
                    <button
                      onClick={(e) => handleDelete(e, entry.id)}
                      disabled={deletingId === entry.id}
                      className="text-[#9C9384] hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-[#7D8C7F] uppercase tracking-wider block mb-1">
                      {entry.topic || 'Reflection'}
                    </span>
                    <h3 className="font-serif font-bold text-[#2C2A26] text-base line-clamp-1 group-hover:text-[#7D8C7F] transition-colors">
                      {entry.title || 'Untitled Entry'}
                    </h3>
                  </div>

                  <p className="text-xs text-[#7D766B] line-clamp-3 leading-relaxed bg-white/60 p-3 rounded-xl border border-[#E5E0D5]">
                    {entry.aiSummary || 'Reflection session in progress...'}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E5E0D5] flex items-center justify-between text-[11px] text-[#9C9384]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(entry.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {entry.messages?.length || 0} messages
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

