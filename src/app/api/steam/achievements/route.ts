import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const steamId = searchParams.get('steamId');
    const appId = searchParams.get('appId');
    
    if (!steamId || !appId) {
      return NextResponse.json({ error: 'Steam ID and App ID are required' }, { status: 400 });
    }

    // Steam API endpoint for getting achievements
    const steamApiUrl = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}&appid=${appId}&format=json`;

    const response = await fetch(steamApiUrl);
    
    if (!response.ok) {
      throw new Error(`Steam API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the data to match our UI structure
    const achievements = data.playerstats.achievements?.map((achievement: any) => ({
      id: achievement.apiname,
      name: achievement.apiname.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      description: achievement.description || '',
      completed: achievement.achieved === 1,
      icon: achievement.icon || '🏆',
      unlockTime: achievement.unlocktime ? new Date(achievement.unlocktime * 1000) : null,
    })) || [];

    return NextResponse.json({ achievements });
  } catch (error) {
    console.error('Error fetching Steam achievements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements from Steam API' },
      { status: 500 }
    );
  }
} 