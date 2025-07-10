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

// Verify Steam ID and get profile data
export async function verifySteamId(steamId: string): Promise<SteamAuthUser | null> {
  try {
    const response = await fetch('/api/auth/steam', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ steamId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to verify Steam ID');
    }

    const data = await response.json();
    return data.profile || null;
  } catch (error) {
    console.error('Error verifying Steam ID:', error);
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

// Sign in with Steam ID (this would be called after Steam authentication)
export async function signInWithSteamId(steamId: string): Promise<AuthResult> {
  try {
    // Verify Steam ID and get profile
    const profile = await verifySteamId(steamId);
    if (!profile) {
      return { user: null, error: new Error('Failed to verify Steam ID') };
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
    console.error('Error signing in with Steam ID:', error);
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