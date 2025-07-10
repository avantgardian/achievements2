import { supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';

export interface SteamAuthUser {
  steamId: string;
  username: string;
  avatar: string;
  profileUrl: string;
}

export interface AuthResult {
  user: User | null;
  error: Error | null;
}

// Steam OpenID configuration
const STEAM_OPENID_URL = 'https://steamcommunity.com/openid/login';

// Generate Steam OpenID login URL
export function generateSteamLoginUrl(returnUrl: string): string {
  const params = new URLSearchParams({
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'checkid_setup',
    'openid.return_to': returnUrl,
    'openid.realm': `${window.location.origin}`,
    'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
  });

  return `${STEAM_OPENID_URL}?${params.toString()}`;
}

// Verify Steam OpenID response
export async function verifySteamOpenIDResponse(searchParams: URLSearchParams): Promise<string | null> {
  try {
    // Add required parameters for verification
    const verifyParams = new URLSearchParams(searchParams);
    verifyParams.set('openid.mode', 'check_authentication');

    const response = await fetch(STEAM_OPENID_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: verifyParams.toString(),
    });

    const result = await response.text();
    
    if (result.includes('is_valid:true')) {
      // Extract Steam ID from the response
      const claimedId = searchParams.get('openid.claimed_id');
      if (claimedId) {
        const steamIdMatch = claimedId.match(/\/id\/([^\/]+)/);
        if (steamIdMatch) {
          return steamIdMatch[1];
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error verifying Steam OpenID response:', error);
    return null;
  }
}

// Get Steam user profile data
export async function getSteamProfile(steamId: string): Promise<SteamAuthUser | null> {
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

// Create or get Supabase user for Steam authentication
export async function createOrGetSteamUser(steamId: string, profile: SteamAuthUser): Promise<AuthResult> {
  try {
    // First, try to get existing user by steam_id metadata
    const { data: { users }, error: searchError } = await supabase.auth.admin.listUsers();
    
    if (searchError) {
      console.error('Error searching for existing user:', searchError);
    }

    // Look for existing user with this steam_id
    const existingUser = users?.find(user => 
      user.user_metadata?.steam_id === steamId
    );

    if (existingUser) {
      // User exists, return them
      return { user: existingUser, error: null };
    }

    // Create new user with Steam data
    const { data: { user }, error } = await supabase.auth.signUp({
      email: `steam_${steamId}@steam.local`,
      password: generateSecurePassword(steamId),
      options: {
        data: {
          steam_id: steamId,
          username: profile.username,
          avatar: profile.avatar,
          profile_url: profile.profileUrl,
          provider: 'steam'
        }
      }
    });

    if (error) {
      return { user: null, error };
    }

    return { user, error: null };
  } catch (error) {
    console.error('Error creating Steam user:', error);
    return { user: null, error: error as Error };
  }
}

// Generate a secure password for Steam users
function generateSecurePassword(steamId: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2);
  return `steam_${steamId}_${timestamp}_${randomString}`;
}

// Sign in with Steam OAuth
export async function signInWithSteam(): Promise<void> {
  const returnUrl = `${window.location.origin}/auth/callback`;
  const steamLoginUrl = generateSteamLoginUrl(returnUrl);
  window.location.href = steamLoginUrl;
}

// Handle Steam OAuth callback
export async function handleSteamCallback(searchParams: URLSearchParams): Promise<AuthResult> {
  try {
    // Verify the OpenID response
    const steamId = await verifySteamOpenIDResponse(searchParams);
    if (!steamId) {
      return { user: null, error: new Error('Failed to verify Steam authentication') };
    }

    // Get Steam profile
    const profile = await getSteamProfile(steamId);
    if (!profile) {
      return { user: null, error: new Error('Failed to fetch Steam profile') };
    }

    // Create or get user
    const { user, error } = await createOrGetSteamUser(steamId, profile);
    if (error) {
      return { user: null, error };
    }

    // Sign in with the user
    const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
      email: `steam_${steamId}@steam.local`,
      password: generateSecurePassword(steamId),
    });

    if (signInError) {
      return { user: null, error: signInError };
    }

    return { user: session?.user || user, error: null };
  } catch (error) {
    console.error('Error handling Steam callback:', error);
    return { user: null, error: error as Error };
  }
}

// Sign out from Supabase
export async function signOut(): Promise<{ error: Error | null }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Get current user
export async function getCurrentUser(): Promise<AuthResult> {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

// Get user's Steam ID from current session
export async function getCurrentUserSteamId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.user_metadata?.steam_id || null;
} 