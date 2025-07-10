# Steam Authentication Setup

This project now supports Steam-only authentication, allowing users to sign in using their Steam ID.

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Steam API Configuration
STEAM_API_KEY=your_steam_api_key_here

# Optional: Supabase Service Role Key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

## Getting a Steam API Key

1. Go to [Steam Community](https://steamcommunity.com/dev/apikey)
2. Sign in with your Steam account
3. Accept the terms and conditions
4. Enter a domain name (can be localhost for development)
5. Copy the generated API key

## How It Works

1. **User enters Steam ID**: Users enter their Steam ID on the auth page
2. **Steam ID verification**: The system verifies the Steam ID using Steam's API
3. **Profile creation**: A Supabase user is created with Steam profile data
4. **Authentication**: Users are signed in and redirected to their games

## Features

- ✅ Steam ID validation
- ✅ Steam profile data fetching
- ✅ Automatic user creation in Supabase
- ✅ Protected routes for authenticated users
- ✅ User context throughout the app
- ✅ Automatic redirects for authenticated users

## User Flow

1. User visits the app
2. If not authenticated, redirected to `/auth`
3. User enters their Steam ID
4. System verifies Steam ID and fetches profile
5. User is created/signed in to Supabase
6. User is redirected to `/games` to see their Steam games

## Security Notes

- Steam IDs are validated using Steam's API
- User passwords are generated securely for Supabase
- All Steam profile data is stored in Supabase user metadata
- No sensitive Steam data is stored in plain text

## Testing

To test the authentication:

1. Get a valid Steam ID from [Steam ID Finder](https://steamidfinder.com/)
2. Enter the Steam ID on the auth page
3. Verify that you're redirected to the games page
4. Check that your Steam profile data is displayed

## Troubleshooting

- **"Steam API key not configured"**: Make sure `STEAM_API_KEY` is set in your environment
- **"Invalid Steam ID format"**: Steam IDs must be 17 digits
- **"Steam profile not found"**: The Steam ID might be invalid or the profile might be private 