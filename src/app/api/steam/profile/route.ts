import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const steamId = searchParams.get('steamId');
    
    if (!steamId) {
      return NextResponse.json({ error: 'Steam ID is required' }, { status: 400 });
    }

    // Steam API endpoint for getting player profile
    const steamApiUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${steamId}&format=json`;

    const response = await fetch(steamApiUrl);
    
    if (!response.ok) {
      throw new Error(`Steam API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.response.players || data.response.players.length === 0) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    const player = data.response.players[0];
    
    // Transform the data to match our UI structure
    const profile = {
      steamId: player.steamid,
      username: player.personaname,
      avatar: player.avatarfull,
      profileUrl: player.profileurl,
      realName: player.realname,
      country: player.loccountrycode,
      lastOnline: player.lastlogoff ? new Date(player.lastlogoff * 1000) : null,
      timeCreated: player.timecreated ? new Date(player.timecreated * 1000) : null,
      status: player.personastate, // 0=Offline, 1=Online, 2=Busy, 3=Away, 4=Snooze, 5=Looking to trade, 6=Looking to play
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching Steam profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile from Steam API' },
      { status: 500 }
    );
  }
} 