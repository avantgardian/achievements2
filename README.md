# Steam Achievements Tracker

A web application to track and visualize your Steam achievements. The app fetches achievement data from the Steam Web API, stores user data with Supabase, and is hosted on Vercel.

## Features

- 🔐 **User Authentication** - Sign up/login with email, Google, or Discord
- 🎮 **Steam Integration** - Connect your Steam account and view your games
- 🏆 **Achievement Tracking** - See all achievements for your games with progress
- 📊 **Progress Visualization** - Track completion rates and statistics
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Auth)
- **APIs**: Steam Web API
- **Hosting**: Vercel
- **Testing**: Playwright (planned)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Steam API Key (get from [Steam Community](https://steamcommunity.com/dev/apikey))
- Supabase account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/avantgardian/achievements2.git
   cd achievements2
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # Steam API Key
   STEAM_API_KEY=your_steam_api_key_here
   
   # Supabase (if using auth)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Development Workflow

### Code Quality Checks

Before committing changes, run these commands to ensure code quality:

```bash
# Check for linting issues
npm run lint

# Test the build locally
npm run build

# Run type checking
npm run type-check
```

### Recommended Pre-commit Workflow

1. Make your changes
2. Run `npm run lint` to check for issues
3. Run `npm run build` to ensure everything builds correctly
4. Commit and push your changes

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `STEAM_API_KEY` | Your Steam Web API key | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Optional |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Optional |

## API Endpoints

- `GET /api/steam/games` - Fetch user's Steam games
- `GET /api/steam/achievements` - Fetch achievements for a specific game
- `GET /api/steam/profile` - Fetch Steam user profile

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and build checks
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
