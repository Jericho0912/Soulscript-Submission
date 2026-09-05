import React from 'react';
import { User } from '../lib/firebase';
import { BookOpen, LogOut, User as UserIcon, Sparkles } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onSignOut: () => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onSignOut, onGoHome }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-[#E5E0D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button 
          onClick={onGoHome}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-[#7D8C7F] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif text-lg font-semibold text-[#2C2A26] tracking-tight block">Aurelius Reflection</span>
            <span className="text-xs text-[#7D766B] font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#7D8C7F]" /> AI Reflection Journal
            </span>
          </div>
        </button>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 bg-[#F1EDE4] px-3.5 py-1.5 rounded-full border border-[#E5E0D5]">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || "User"} 
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-white" 
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#7D8C7F]/20 text-[#7D8C7F] flex items-center justify-center text-xs font-semibold">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
              <div className="text-left">
                <p className="text-xs font-semibold text-[#3E3A35] leading-none">{user.displayName || user.email?.split('@')[0]}</p>
                <p className="text-[10px] text-[#7D766B] leading-none mt-0.5">{user.email}</p>
              </div>
            </div>

            <button
              onClick={onSignOut}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#3E3A35] hover:text-red-700 hover:bg-red-50 rounded-xl border border-[#E5E0D5] transition-all shadow-sm"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

