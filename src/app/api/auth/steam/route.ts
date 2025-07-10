import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { steamId } = await request.json();

    if (!steamId) {
      return NextResponse.json(
        { error: 'Steam ID is required' },
        { status: 400 }
      );
    }

    // Validate Steam ID format (basic validation)
    if (!/^\d{17}$/.test(steamId)) {
      return NextResponse.json(
        { error: 'Invalid Steam ID format' },
        { status: 400 }
      );
    }

    // Fetch Steam profile data
    const steamApiKey = process.env.STEAM_API_KEY;
    if (!steamApiKey) {
      return NextResponse.json(
        { error: 'Steam API key not configured' },
        { status: 500 }
      );
    }

    // Get player summary from Steam API
    const response = await fetch(
      `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamId}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch Steam profile' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const player = data.response.players[0];

    if (!player) {
      return NextResponse.json(
        { error: 'Steam profile not found' },
        { status: 404 }
      );
    }

    // Return user profile data
    return NextResponse.json({
      success: true,
      profile: {
        steamId: player.steamid,
        username: player.personaname,
        avatar: player.avatarfull,
        profileUrl: player.profileurl,
        realName: player.realname || null,
        country: player.loccountrycode || null,
        lastOnline: player.lastlogoff ? new Date(player.lastlogoff * 1000) : null,
        timeCreated: player.timecreated ? new Date(player.timecreated * 1000) : null,
        status: player.personastate,
      }
    });

  } catch (error) {
    console.error('Steam auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 