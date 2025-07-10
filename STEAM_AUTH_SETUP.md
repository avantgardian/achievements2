# Steam OAuth Authentication Setup

This project now supports proper Steam OAuth authentication, allowing users to sign in using Steam's official authentication system.

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Steam API Configuration (for profile data)
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

1. **User clicks "Sign in with Steam"**: Users are redirected to Steam's official login page
2. **Steam OAuth authentication**: Users authenticate with Steam using their credentials
3. **Steam redirects back**: Steam redirects to your app with authentication data
4. **Profile creation**: A Supabase user is created with Steam profile data
5. **Authentication**: Users are signed in and redirected to their games

## Features

- ✅ **Proper OAuth flow** - Uses Steam's official authentication system
- ✅ **No manual Steam ID input** - Users don't need to know their Steam ID
- ✅ **Secure verification** - Validates responses with Steam's servers
- ✅ **Automatic user creation** - Users are created in Supabase automatically
- ✅ **Protected routes** - Unauthenticated users are redirected to auth
- ✅ **User context** - Authentication state available throughout the app
- ✅ **Automatic redirects** - Authenticated users go straight to games

## User Flow

1. User visits the app
2. If not authenticated, redirected to `/auth`
3. User clicks "Sign in with Steam"
4. User is redirected to Steam's login page
5. User authenticates with Steam
6. Steam redirects back to your app
7. User is created/signed in to Supabase
8. User is redirected to `/games` to see their Steam games

## Security Notes

- Uses Steam's official OpenID authentication
- Steam IDs are validated using Steam's servers
- User passwords are generated securely for Supabase
- All Steam profile data is stored in Supabase user metadata
- No sensitive Steam data is stored in plain text

## Testing

To test the authentication:

1. Visit `/auth` in your app
2. Click "Sign in with Steam"
3. Complete the Steam login process
4. Verify that you're redirected to the games page
5. Check that your Steam profile data is displayed

## Troubleshooting

- **"Authentication failed"**: Check that your Steam API key is configured correctly
- **"Steam profile not found"**: The Steam profile might be private
- **CORS issues**: Make sure your domain is configured in Steam API settings
- **Redirect issues**: Verify that your callback URL is correct

## Files Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── page.tsx              # Steam OAuth login page
│   │   └── callback/
│   │       └── page.tsx          # OAuth callback handler
│   └── games/
│       └── page.tsx              # Protected games page
├── lib/
│   ├── steamAuth.ts              # Steam OAuth functions
│   ├── userContext.tsx           # User authentication context
│   └── supabaseClient.ts         # Supabase client
└── components/
    └── ProtectedRoute.tsx        # Route protection component
``` 