# Deployment

## Stack

- **Frontend/Backend**: Next.js 15 on Vercel
- **Database**: Supabase Postgres
- **Auth**: Supabase Auth (email/password, magic link planned)
- **Storage**: Supabase Storage (`frog-photos` bucket, private)
- **Email**: Resend (or Postmark)
- **SMS**: Twilio
- **Monitoring**: Sentry (planned)

## Required Environment Variables

Set these in Vercel (or `.env.local` for local dev):

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase publishable anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server only) |
| `RESEND_API_KEY` | For email | Resend API key |
| `DEFAULT_FROM_EMAIL` | For email | Sender email address |
| `POSTMARK_API_KEY` | Alt email | Postmark API key (alternative to Resend) |
| `TWILIO_ACCOUNT_SID` | For SMS | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | For SMS | Twilio Auth Token |
| `TWILIO_FROM_NUMBER` | For SMS | Twilio sender phone number |
| `APP_BASE_URL` | Yes | App URL (e.g., https://yourapp.vercel.app) |
| `NEXT_PUBLIC_APP_URL` | Yes | Same as APP_BASE_URL (client-accessible) |

**Important:** `SUPABASE_SERVICE_ROLE_KEY` must NEVER be exposed to the client. It is only used in API routes and server-side code.

If email/SMS keys are not configured, the notification system logs to console instead of failing (safe dev mode).

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Fill in your Supabase URL, anon key, and service role key

# 3. Run dev server
npm run dev
# App available at http://localhost:3000
```

## Supabase Setup

### 1. Create Project

Create a new project at [supabase.com](https://supabase.com).

### 2. Run Schema

In the Supabase SQL Editor, run the contents of:

```
supabase/schema.sql
```

This creates all tables including: organizations, frogs, locations, events, cycle statuses, performance ratings, protocols, results, environmental observations, notifications, and more.

### 3. Run RLS Policies

Run the contents of:

```
supabase/policies.sql
```

This enables Row Level Security on all tables and creates policies that enforce organization-level data isolation.

### 4. Create Storage Bucket

1. Go to Storage in Supabase dashboard
2. Create a new bucket called `frog-photos`
3. Set it to **Private** (not public)
4. Apply storage policies from `supabase/policies.sql` (see commented section at bottom)

Storage path convention: `{organization_id}/{context_id}/{filename}`

### 5. Configure Auth

1. Go to Authentication settings
2. Enable Email/Password sign-in
3. Configure email templates (confirmation, magic link, password reset)
4. Set redirect URLs for your app domain

### 6. Seed Data (Optional)

Run `supabase/seed.sql` for test data in development.

## Vercel Deployment

### 1. Connect Repository

Connect your GitHub repository to Vercel.

### 2. Set Environment Variables

Add all required environment variables in Vercel project settings.

### 3. Deploy

Push to `main` branch. Vercel auto-deploys.

### 4. Post-Deploy Verification

- [ ] All routes load (check `/dashboard`, `/frogs`, `/rotation`)
- [ ] Auth flow works (signup, login, logout)
- [ ] Supabase connection works (API routes return data)
- [ ] Storage uploads work (photo upload)
- [ ] Email delivery works (if configured)
- [ ] RLS is active (users can only see their org data)

## Cron / Scheduled Jobs

Required for automated notifications:

| Schedule | Job | Description |
|----------|-----|-------------|
| Daily | `runDailyNotificationCheck` | Rest-complete, overdue, missing data |
| Weekly | `runWeeklySummary` | Colony summary to owners/managers |
| Monthly | `runMonthlyForecast` | Forecast summary |

Options for scheduling:
- Vercel Cron (vercel.json)
- Supabase Edge Functions with pg_cron
- External scheduler (Inngest, Trigger.dev)

## Security Checklist

- [ ] RLS enabled on all tables
- [ ] Storage bucket is private
- [ ] Service role key only used server-side
- [ ] `.env.local` is gitignored
- [ ] Auth tokens validated on API routes
- [ ] File uploads scoped to organization paths
- [ ] No public read access to photos
- [ ] Signed URLs used for photo delivery

## Scale Considerations

- 50+ labs at launch
- 300–400 frogs per lab ≈ 15,000–20,000 frog records
- 50–75 bins per lab ≈ 2,500–3,750 location records
- Events accumulate — indexed on org_id + event_date
- Performance ratings — indexed on frog_id + location_id
- Environmental observations — indexed on org_id + observed_at
