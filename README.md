<p align="center">
  <img src="public/logo.svg" width="160" alt="APEX Logo" />
</p>

<h1 align="center">APEX - Career AI</h1>

<p align="center">
  <strong>Your unfair advantage in the job market.</strong>
</p>

<p align="center">
  AI-powered career intelligence platform that helps you track opportunities, tailor resumes, analyse job descriptions, and learn from every interview.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Vercel-Deploy-000?logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## What is APEX?

APEX is a full-stack career intelligence system that combines job tracking, AI-powered resume tailoring, JD analysis, and interview post-mortems into a single private workspace. Every AI request goes directly from your browser to the AI provider using your own API key - we never see or store your conversations.

### Key Features

**Job Intelligence**
- Track roles across companies with status (New, Applied, Interview, Rejected, Offer)
- Paste a JD and get instant AI analysis: fit score, top keywords, role hypothesis, 90-day success criteria, and gap identification
- Dashboard metrics: roles tracked, applied count, interview pipeline

**CV Builder**
- Paste any JD + your master resume and get an AI-tailored version optimised for that specific role
- Match analysis with keyword coverage percentage
- Em-dash free output - no AI tells that flag your resume
- Built-in defense against AI-detection prompts hidden in JDs
- Copy, download as .txt, or iterate

**Interview Post-Mortems**
- Log every interview round: what went well, where you struggled, questions asked, culture signals
- AI-generated tactical prep tips specific to your experience
- Track patterns across companies and rounds

**Multi-Provider AI**
- Bring your own key: Anthropic (Claude), OpenAI (GPT-4o), Google (Gemini), Perplexity (Sonar)
- Switch providers and models from Settings at any time

**LinkedIn Import**
- Paste your LinkedIn profile text and AI converts it into a structured resume

**Privacy First**
- All data stored with Row Level Security - users can only access their own rows
- AI calls go browser-to-provider, never through our servers
- No analytics, no tracking, no data selling

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |
| Auth | Supabase Auth (Email, Google, LinkedIn) |
| Database | Supabase Postgres with RLS |
| AI | Multi-provider (Anthropic, OpenAI, Google, Perplexity) |
| Deploy | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)
- An API key from at least one AI provider

### 1. Clone and install

```bash
git clone https://github.com/PraveenkumarD-work/Apex.git
cd Apex
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of:
   - `supabase/migrations/001_initial_schema.sql` (tables, RLS, triggers)
   - `supabase/migrations/002_multi_provider.sql` (multi-provider columns)
3. Go to **Authentication > Providers** and enable Email
4. (Optional) Enable Google and LinkedIn OAuth providers

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials (found in **Project Settings > API**):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 5. Deploy to Vercel

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables
4. Deploy

---

## Project Structure

```
src/
  components/
    Auth/           # Login, signup, OAuth buttons
    JobIntelligence/# Job tracking, JD analysis, metric bar
    CVBuilder/      # Resume tailoring, match analysis
    PostMortem/     # Interview logging, prep tips
    Settings/       # API keys, resume, LinkedIn import, theme
    ui/             # Toast, Spinner, Badge, EmptyState
  contexts/         # Auth, Toast, App, Theme contexts
  hooks/            # useAuth, useJobs, usePostMortems, useAI
  lib/
    ai.ts           # Multi-provider AI abstraction
    supabase.ts     # Database helpers
    types.ts        # TypeScript interfaces
supabase/
  migrations/       # SQL schema files
public/
  logo.svg          # Full logo
  logo-mark.svg     # Icon mark
  privacy.html      # Privacy policy
```

---

## Supported AI Providers

| Provider | Models | Key Format |
|----------|--------|-----------|
| Anthropic | Claude Sonnet 4, Claude Haiku 4.5 | `sk-ant-...` |
| OpenAI | GPT-4o, GPT-4o Mini, o3-mini | `sk-...` |
| Google | Gemini 2.5 Flash, Gemini 2.5 Pro | `AIza...` |
| Perplexity | Sonar, Sonar Pro | `pplx-...` |

Add your key in **Settings > AI Provider & Keys**. You can add keys for multiple providers and switch between them.

---

## Security

- **Row Level Security**: Every table has RLS policies ensuring users can only read/write their own data
- **No backend proxy**: AI requests go directly from the browser to the provider API
- **API keys**: Stored in your Supabase profile row, never exposed to other users
- **Auth**: Supabase handles password hashing (bcrypt), JWT sessions, and OAuth flows
- **Transport**: All traffic over HTTPS/TLS

---

## Privacy

Your data is yours. Read the full [Privacy Policy](public/privacy.html).

**TL;DR**: We store your data in your personal database row with RLS. AI requests go directly from your browser to the AI provider. No analytics, no tracking, no data selling.

---

## License

MIT

---

<p align="center">
  Built with purpose. Land the role you deserve.
</p>
