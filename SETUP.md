# APEX - Career Intelligence System Setup

## Prerequisites
- Node.js 18+
- npm

## 1. Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com) (free tier)
2. Go to **Project Settings > API** and copy the **Project URL** and **anon public key**
3. Create `.env` file from `.env.example` and fill in both values:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
4. Go to **Supabase SQL Editor** and run the contents of `supabase/migrations/001_initial_schema.sql`
5. Go to **Authentication > Providers** and ensure **Email** is enabled

## 2. Install & Run Locally

```bash
npm install
npm run dev
```

## 3. Deploy to Vercel

1. Push repo to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

## Notes

- Claude API key is stored per-user in their Supabase profile row, not as an env variable
- All data is protected by Row Level Security - users can only access their own data
- AI requests go directly from the browser to the Anthropic API using the user's own key
