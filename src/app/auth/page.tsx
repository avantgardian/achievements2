'use client';

import { useState } from 'react';
import { signInWithSteam } from '@/lib/steamAuth';
import Link from 'next/link';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSteamLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithSteam();
    } catch (error) {
      console.error('Steam login error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 pointer-events-none" />
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 p-8 flex flex-col items-center">
          {/* Logo/Icon */}
          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
            <span className="text-white text-3xl">🎮</span>
          </div>
          {/* Heading */}
          <h2 className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight">
            Sign in to <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">AchievementTracker</span>
          </h2>
          <p className="text-center text-sm text-gray-300 mb-8">
            Connect with your Steam account to track your achievements
          </p>
          
          {/* Steam Login Button */}
          <button
            onClick={handleSteamLogin}
            disabled={isLoading}
            className="w-full flex justify-center items-center py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg text-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="-ml-1 mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            )}
            {isLoading ? 'Redirecting to Steam...' : 'Sign in with Steam'}
          </button>

          {/* Info Text */}
          <div className="text-center text-sm text-gray-400">
            <p>You&apos;ll be redirected to Steam to complete the sign-in process</p>
          </div>

          <div className="mt-8 text-center">
            <span className="text-gray-400 text-sm">Back to{' '}
              <Link href="/" className="text-purple-400 hover:underline">Home</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}