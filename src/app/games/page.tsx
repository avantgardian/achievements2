'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchSteamGames, fetchSteamAchievements, fetchSteamProfile, type SteamGame, type SteamAchievement, type SteamProfile } from '@/lib/steamApi';
import { useUser } from '@/lib/userContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function GamesPage() {
  const { user, steamId, signOut } = useUser();
  const [games, setGames] = useState<SteamGame[]>([]);
  const [achievements, setAchievements] = useState<SteamAchievement[]>([]);
  const [profile, setProfile] = useState<SteamProfile | null>(null);
  const [selectedGame, setSelectedGame] = useState<SteamGame | null>(null);
  const [view, setView] = useState<'games' | 'achievements'>('games');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Steam data when component mounts and steamId is available
  useEffect(() => {
    if (steamId) {
      loadSteamData(steamId);
    }
  }, [steamId]);

  const loadSteamData = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch profile first
      const profileData = await fetchSteamProfile(id);
      setProfile(profileData);
      
      // Fetch games
      const gamesData = await fetchSteamGames(id);
      setGames(gamesData);
      
      // Reset selected game and achievements
      setSelectedGame(null);
      setAchievements([]);
    } catch (err) {
      setError('Failed to load Steam data. Please check your Steam ID and try again.');
      console.error('Error loading Steam data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAchievements = async (game: SteamGame) => {
    if (!steamId) return;
    
    setLoading(true);
    try {
      const achievementsData = await fetchSteamAchievements(steamId, game.id.toString());
      setAchievements(achievementsData);
      setSelectedGame(game);
      setView('achievements');
    } catch (err) {
      setError('Failed to load achievements for this game.');
      console.error('Error loading achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        {/* Navigation */}
        <nav className="relative z-50 bg-black/20 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Logo and Menu */}
              <div className="flex items-center space-x-8">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">🎮</span>
                  </div>
                  <span className="text-white font-bold text-xl">AchievementTracker</span>
                </Link>
                
                {/* Menu Items */}
                <div className="hidden md:flex space-x-6">
                  <Link 
                    href="/games" 
                    className="text-white font-medium border-b-2 border-purple-500"
                  >
                    My Games
                  </Link>
                  {/* Future menu items will go here */}
                </div>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-white text-sm font-medium">{user.user_metadata?.username || 'Steam User'}</p>
                      <p className="text-gray-400 text-xs">Steam ID: {steamId}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Info */}
          {profile && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 p-6 mb-8">
              <div className="flex items-center space-x-4">
                <Image 
                  src={profile.avatar} 
                  alt={profile.username} 
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div>
                  <h2 className="text-xl font-semibold text-white">{profile.username}</h2>
                  <p className="text-gray-400">Steam ID: {profile.steamId}</p>
                  {profile.realName && <p className="text-gray-400">Real Name: {profile.realName}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <p className="mt-2 text-gray-400">Loading Steam data...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-red-700 p-6 mb-8">
              <div className="flex items-center space-x-3">
                <svg className="h-6 w-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Content */}
          {!loading && profile && (
            <>
              {view === 'games' ? (
                <GamesView 
                  games={games} 
                  onGameSelect={loadAchievements} 
                  selectedGame={selectedGame} 
                />
              ) : (
                <AchievementsView 
                  selectedGame={selectedGame} 
                  achievements={achievements}
                  onBack={() => setView('games')}
                />
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

function GamesView({ 
  games, 
  onGameSelect, 
  selectedGame 
}: { 
  games: SteamGame[];
  onGameSelect: (game: SteamGame) => void;
  selectedGame: SteamGame | null;
}) {
  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">No Games Found</h2>
        <p className="text-gray-400">This Steam account doesn&apos;t have any games with achievements, or the profile is private.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">Your Games</h2>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <div className="text-2xl font-bold text-blue-400">{games.length}</div>
          <div className="text-gray-400">Total Games</div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <div className="text-2xl font-bold text-green-400">
            {games.reduce((sum, game) => sum + game.completed, 0)}
          </div>
          <div className="text-gray-400">Achievements Unlocked</div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <div className="text-2xl font-bold text-purple-400">
            {games.length > 0 ? Math.round(games.reduce((sum, game) => sum + (game.completed / game.achievements), 0) / games.length * 100) : 0}%
          </div>
          <div className="text-gray-400">Average Completion</div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <div className="text-2xl font-bold text-orange-400">
            {games.filter(game => game.completed === game.achievements).length}
          </div>
          <div className="text-gray-400">100% Completed</div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => onGameSelect(game)}
            className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 cursor-pointer transition-all hover:border-purple-500 hover:shadow-lg ${
              selectedGame?.id === game.id ? 'ring-2 ring-purple-500' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <Image 
                src={game.image} 
                alt={game.name}
                width={64}
                height={64}
                className="rounded-lg object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiA0OEw0OCAzMkwzMiAxNkwxNiAzMkwzMiA0OFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                }}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-white">{game.name}</h3>
                <div className="text-sm text-gray-400">
                  {game.completed} / {game.achievements} achievements
                </div>
                {game.achievements > 0 && (
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                      style={{ width: `${(game.completed / game.achievements) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementsView({ 
  selectedGame, 
  achievements,
  onBack
}: { 
  selectedGame: SteamGame | null;
  achievements: SteamAchievement[];
  onBack: () => void;
}) {
  if (!selectedGame) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Select a Game</h2>
        <p className="text-gray-400">Choose a game from the Games view to see its achievements.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={onBack}
          className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
        >
          ← Back to Games
        </button>
        <h2 className="text-3xl font-bold text-white">{selectedGame.name} Achievements</h2>
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-white mb-2">No Achievements Found</h3>
          <p className="text-gray-400">This game doesn&apos;t have any achievements, or they&apos;re not available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 ${
                achievement.completed ? 'border-l-4 border-green-500' : 'border-l-4 border-gray-600'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    achievement.completed ? 'text-green-400' : 'text-white'
                  }`}>
                    {achievement.name}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">{achievement.description}</p>
                  {achievement.unlockTime && (
                    <p className="text-xs text-gray-500 mt-1">
                      Unlocked: {achievement.unlockTime.toLocaleDateString()}
                    </p>
                  )}
                  <div className="mt-2">
                    {achievement.completed ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900/50 text-green-400 border border-green-500">
                        ✓ Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-400 border border-gray-600">
                        ○ Locked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 