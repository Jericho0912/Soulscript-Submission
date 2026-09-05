import React from 'react';
import { Sparkles, Shield, Lock, BookOpen, Compass, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onSignIn: () => void;
  loading: boolean;
  error?: string | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSignIn, loading, error }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F9F7F2] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F1EDE4] border border-[#E5E0D5] text-[#3E3A35] text-xs font-semibold tracking-wide uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#7D8C7F]" />
          <span>Private & Secure AI Journaling</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#2C2A26] tracking-tight leading-[1.15]">
          Unpack your mind with <br className="hidden sm:inline" />
          <span className="text-[#7D8C7F]">
            intelligent reflections
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#7D766B] font-light leading-relaxed">
          Aurelius Reflection is your private sanctuary for daily thoughts, emotional check-ins, and deep reflections. Converse with Gemini 3.7 Flash to gain clarity, brainstorm ideas, and store your journal securely in Firestore.
        </p>

        {/* Sign In CTA */}
        <div className="pt-4 flex flex-col items-center gap-3">
          <button
            onClick={onSignIn}
            disabled={loading}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#7D8C7F] hover:bg-[#6B7A6D] text-white font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-75 cursor-pointer text-base"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Sign In with Google</span>
            <ArrowRight className="w-4 h-4 text-white/80" />
          </button>
          
          {error && (
            <p className="text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg max-w-md">
              {error}
            </p>
          )}

          <p className="text-xs text-[#9C9384] flex items-center gap-1.5 mt-2">
            <Lock className="w-3.5 h-3.5 text-[#9C9384]" /> Secure authentication via Firebase & strict user data isolation.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-[#E5E0D5] text-left">
          <div className="bg-[#F1EDE4] p-6 rounded-2xl border border-[#E5E0D5] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#7D8C7F]/20 text-[#7D8C7F] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-[#2C2A26]">Multi-Turn Reflections</h3>
            <p className="text-sm text-[#7D766B] leading-relaxed">
              Write freely about your day, goals, or worries, and hold deep conversational sessions with Gemini.
            </p>
          </div>

          <div className="bg-[#F1EDE4] p-6 rounded-2xl border border-[#E5E0D5] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#7D8C7F]/20 text-[#7D8C7F] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-[#2C2A26]">AI Insights & Summaries</h3>
            <p className="text-sm text-[#7D766B] leading-relaxed">
              Receive compassionate feedback, smart brainstorming prompts, and concise session takeaways automatically.
            </p>
          </div>

          <div className="bg-[#F1EDE4] p-6 rounded-2xl border border-[#E5E0D5] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#7D8C7F]/20 text-[#7D8C7F] flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-[#2C2A26]">Strictly Isolated Storage</h3>
            <p className="text-sm text-[#7D766B] leading-relaxed">
              Your entries are safely stored in Cloud Firestore, strictly isolated so only you can access your journal.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

