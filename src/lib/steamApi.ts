// Types for Steam API responses
export interface SteamGame {
  id: number;
  name: string;
  image: string;
  achievements: number;
  completed: number;
  playtime?: number;
  lastPlayed?: Date | null;
}

export interface SteamAchievement {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  icon: string;
  unlockTime?: Date | null;
}

export interface SteamProfile {
  steamId: string;
  username: string;
  avatar: string;
  profileUrl: string;
  realName?: string;
  country?: string;
  lastOnline?: Date | null;
  timeCreated?: Date | null;
  status: number;
}

// API functions
export async function fetchSteamGames(steamId: string): Promise<SteamGame[]> {
  try {
    const response = await fetch(`/api/steam/games?steamId=${steamId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.games || [];
  } catch (error) {
    console.error('Error fetching Steam games:', error);
    return [];
  }
}

export async function fetchSteamAchievements(steamId: string, appId: string): Promise<SteamAchievement[]> {
  try {
    const response = await fetch(`/api/steam/achievements?steamId=${steamId}&appId=${appId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.achievements || [];
  } catch (error) {
    console.error('Error fetching Steam achievements:', error);
    return [];
  }
}

export async function fetchSteamProfile(steamId: string): Promise<SteamProfile | null> {
  try {
    const response = await fetch(`/api/steam/profile?steamId=${steamId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.profile || null;
  } catch (error) {
    console.error('Error fetching Steam profile:', error);
    return null;
  }
}

// Helper function to get Steam ID from vanity URL or Steam ID
export async function resolveSteamId(steamIdOrVanity: string): Promise<string | null> {
  // If it's already a Steam ID (17 digits), return it
  if (/^\d{17}$/.test(steamIdOrVanity)) {
    return steamIdOrVanity;
  }

  // If it's a vanity URL, we'd need to resolve it
  // For now, we'll assume it's a Steam ID
  // TODO: Implement vanity URL resolution
  return steamIdOrVanity;
} 