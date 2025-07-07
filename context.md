# Steam Achievements Tracker App - Project Context

## Project Overview
A web application to track and visualize your Steam achievements. The app will fetch achievement data from the Steam Web API, store and manage user data with Supabase, and be hosted on Vercel. The project will use modern web technologies for a robust, maintainable, and scalable solution.

---

## Technology Stack

| Layer         | Technology         | Why?                                 |
|---------------|--------------------|--------------------------------------|
| Frontend      | Next.js, Tailwind  | Fast, modern, Vercel-native          |
| State/API     | React Query/SWR    | Data fetching, caching               |
| Backend/Auth  | Supabase           | Managed DB, Auth, easy integration   |
| Steam Data    | Steam Web API      | Official source for achievements     |
| Hosting       | Vercel             | Fast, easy, serverless               |
| Language      | TypeScript         | Type safety, maintainability         |
| Testing       | Cypress            | End-to-end & regression testing      |
| Version Ctrl  | GitHub             | Collaboration, CI/CD, code backup    |

---

## Project Structure Example

```
/ (root)
├── /pages           # Next.js pages
├── /components      # React components
├── /styles          # Tailwind/global styles
├── /cypress         # Cypress tests & config
├── /public          # Static assets
├── /utils           # Utility functions
├── /lib             # Supabase/Steam API logic
├── /tests           # (Optional) Unit/integration tests
├── .github/workflows # GitHub Actions CI/CD
├── package.json
├── README.md
└── ...
```

---

## Recommended Workflow

1. **Codebase on GitHub**
   - Push all code to a GitHub repository.
   - Use branches and pull requests for features/fixes.

2. **Cypress for Testing**
   - Add Cypress for end-to-end and regression tests.
   - Store Cypress tests in a `/cypress` directory.
   - Optionally, use [Cypress GitHub Action](https://github.com/cypress-io/github-action) for automated test runs on PRs.

3. **CI/CD**
   - Vercel auto-deploys from GitHub on push/PR.
   - Optionally, set up GitHub Actions for:
     - Running Cypress tests on every PR/merge.
     - Linting, formatting, and type checks.

---

## Next Steps

1. **Set up Supabase project** (create tables for users, achievements, etc.)
2. **Bootstrap Next.js app** (with TypeScript and Tailwind)
3. **Integrate Supabase client** (for auth and DB)
4. **Connect to Steam API** (fetch and store achievements)
5. **Set up Cypress for testing**
6. **Initialize GitHub repo and push code**
7. **Add GitHub Actions for CI/CD (optional but recommended)**
8. **Connect Vercel to GitHub for auto-deploys**

---

## References
- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cypress](https://www.cypress.io/)
- [Steam Web API](https://partner.steamgames.com/doc/webapi_overview)
- [Cypress GitHub Action](https://github.com/cypress-io/github-action) 