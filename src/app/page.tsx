'use client';
import { useState } from 'react';
import Image from 'next/image';
import { fetchSteamGames, fetchSteamAchievements, fetchSteamProfile, type SteamGame, type SteamAchievement, type SteamProfile } from '@/lib/steamApi';

export default function Home() {
  const [steamId, setSteamId] = useState<string>('');
  const [games, setGames] = useState<SteamGame[]>([]);
  const [achievements, setAchievements] = useState<SteamAchievement[]>([]);
  const [profile, setProfile] = useState<SteamProfile | null>(null);
  const [selectedGame, setSelectedGame] = useState<SteamGame | null>(null);
  const [view, setView] = useState<'games' | 'achievements'>('games');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (steamId.trim()) {
      loadSteamData(steamId.trim());
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Steam Achievements Tracker</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setView('games')}
                className={`px-4 py-2 rounded-md ${
                  view === 'games' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Games
              </button>
              <button
                onClick={() => setView('achievements')}
                className={`px-4 py-2 rounded-md ${
                  view === 'achievements' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Achievements
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Steam ID Input */}
        {!profile && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Your Steam ID</h2>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="text"
                value={steamId}
                onChange={(e) => setSteamId(e.target.value)}
                placeholder="Enter your Steam ID (e.g., 76561198000000000)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !steamId.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Load Games'}
              </button>
            </form>
            {error && (
              <p className="text-red-600 mt-2">{error}</p>
            )}
            <p className="text-sm text-gray-600 mt-2">
              Find your Steam ID at <a href="https://steamidfinder.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">steamidfinder.com</a>
            </p>
          </div>
        )}

        {/* Profile Info */}
        {profile && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center space-x-4">
              <Image 
                src={profile.avatar} 
                alt={profile.username} 
                width={64}
                height={64}
                className="rounded-full"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{profile.username}</h2>
                <p className="text-gray-600">Steam ID: {profile.steamId}</p>
                {profile.realName && <p className="text-gray-600">Real Name: {profile.realName}</p>}
              </div>
              <button
                onClick={() => {
                  setProfile(null);
                  setGames([]);
                  setSelectedGame(null);
                  setAchievements([]);
                  setSteamId('');
                  setError(null);
                }}
                className="ml-auto px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Change Steam ID
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading Steam data...</p>
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
    </main>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Games Found</h2>
        <p className="text-gray-600">This Steam account doesn&apos;t have any games with achievements, or the profile is private.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Games</h2>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-blue-600">{games.length}</div>
          <div className="text-gray-600">Total Games</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-green-600">
            {games.reduce((sum, game) => sum + game.completed, 0)}
          </div>
          <div className="text-gray-600">Achievements Unlocked</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-purple-600">
            {games.length > 0 ? Math.round(games.reduce((sum, game) => sum + (game.completed / game.achievements), 0) / games.length * 100) : 0}%
          </div>
          <div className="text-gray-600">Average Completion</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-orange-600">
            {games.filter(game => game.completed === game.achievements).length}
          </div>
          <div className="text-gray-600">100% Completed</div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => onGameSelect(game)}
            className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all hover:shadow-lg ${
              selectedGame?.id === game.id ? 'ring-2 ring-blue-500' : ''
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
                <h3 className="font-semibold text-gray-900">{game.name}</h3>
                <div className="text-sm text-gray-600">
                  {game.completed} / {game.achievements} achievements
                </div>
                {game.achievements > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Select a Game</h2>
        <p className="text-gray-600">Choose a game from the Games view to see its achievements.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Games
        </button>
        <h2 className="text-3xl font-bold text-gray-900">{selectedGame.name} Achievements</h2>
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Achievements Found</h3>
          <p className="text-gray-600">This game doesn&apos;t have any achievements, or they&apos;re not available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-white rounded-lg shadow-md p-6 ${
                achievement.completed ? 'border-l-4 border-green-500' : 'border-l-4 border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    achievement.completed ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {achievement.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{achievement.description}</p>
                  {achievement.unlockTime && (
                    <p className="text-xs text-gray-500 mt-1">
                      Unlocked: {achievement.unlockTime.toLocaleDateString()}
                    </p>
                  )}
                  <div className="mt-2">
                    {achievement.completed ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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
