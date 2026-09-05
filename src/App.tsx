import React, { useState, useEffect } from 'react';
import { auth, googleProvider, User } from './lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { JournalChat } from './components/JournalChat';
import { JournalEntry } from './types';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeView, setActiveView] = useState<'dashboard' | 'chat'>('dashboard');
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setInitialLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Sign-in error:", err);
      setAuthError(err.message || "Failed to sign in with Google. Please check your browser popup settings.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setActiveView('dashboard');
      setActiveEntry(null);
    } catch (err) {
      console.error("Sign-out error:", err);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-xs font-medium text-stone-500 uppercase tracking-widest">Loading SoulScript...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/70 text-stone-900 flex flex-col selection:bg-amber-500 selection:text-white">
      <Navbar 
        user={user} 
        onSignOut={handleSignOut} 
        onGoHome={() => {
          setActiveView('dashboard');
          setActiveEntry(null);
        }} 
      />

      <main className="flex-1">
        {!user ? (
          <LandingPage 
            onSignIn={handleSignIn} 
            loading={authLoading} 
            error={authError} 
          />
        ) : activeView === 'chat' ? (
          <JournalChat 
            user={user}
            activeEntry={activeEntry}
            onBack={() => {
              setActiveView('dashboard');
              setActiveEntry(null);
            }}
            onSaveSuccess={() => {
              // Successfully saved
            }}
          />
        ) : (
          <Dashboard 
            user={user}
            onOpenNewEntry={() => {
              setActiveEntry(null);
              setActiveView('chat');
            }}
            onOpenEntry={(entry) => {
              setActiveEntry(entry);
              setActiveView('chat');
            }}
          />
        )}
      </main>

      <footer className="py-6 text-center text-xs text-stone-400 border-t border-stone-200/60">
        <p>SoulScript — Private AI Reflection Journal powered by Firebase Firestore & Gemini 3.7 Flash.</p>
      </footer>
    </div>
  );
}
