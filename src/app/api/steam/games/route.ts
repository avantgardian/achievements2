import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get Steam ID from query params (we'll need to get this from user auth later)
    const { searchParams } = new URL(request.url);
    const steamId = searchParams.get('steamId');
    
    if (!steamId) {
      return NextResponse.json({ error: 'Steam ID is required' }, { status: 400 });
    }

    // Steam API endpoint for getting owned games
    const steamApiUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1&format=json`;

    const response = await fetch(steamApiUrl);
    
    if (!response.ok) {
      throw new Error(`Steam API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the data to match our UI structure
    const games = data.response.games?.map((game: any) => ({
      id: game.appid,
      name: game.name,
      image: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
      achievements: 0, // We'll need to fetch this separately
      completed: 0, // We'll need to fetch this separately
      playtime: game.playtime_forever || 0,
      lastPlayed: game.rtime_last_played ? new Date(game.rtime_last_played * 1000) : null,
    })) || [];

    return NextResponse.json({ games });
  } catch (error) {
    console.error('Error fetching Steam games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games from Steam API' },
      { status: 500 }
    );
  }
} 