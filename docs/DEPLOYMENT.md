# Deployment

## Stack

- **Frontend/Backend**: Next.js on Vercel
- **Database**: Supabase Postgres
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage (frog photos)
- **Email**: Resend or Postmark
- **SMS**: Twilio
- **Monitoring**: Sentry (error tracking)
- **Analytics**: Future charting library (Recharts/Chart.js)

## Environments

### Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

### Staging

- Vercel preview deployments on PRs
- Separate Supabase project for staging
- Test notification channels in sandbox mode

### Production

- Vercel production deployment
- Production Supabase project
- Live email/SMS channels
- Sentry error tracking

## Supabase Setup

1. Create Supabase project
2. Run schema.sql to create tables
3. Run policies.sql to set up RLS
4. Run seed.sql for test data
5. Create storage bucket `frog-photos`
6. Configure auth providers (email/password, magic link)
7. Set environment variables

## Vercel Setup

1. Connect GitHub repo
2. Set environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - RESEND_API_KEY
   - TWILIO_ACCOUNT_SID
   - TWILIO_AUTH_TOKEN
   - TWILIO_PHONE_NUMBER
   - NEXT_PUBLIC_APP_URL
3. Deploy

## Cron / Scheduled Jobs

Required for notifications:

- Daily: Check for rest-complete, overdue, and missing data
- Weekly: Generate colony summary notifications
- Monthly: Generate forecast summaries

Options:
- Vercel Cron (vercel.json)
- Supabase Edge Functions with pg_cron
- External scheduler (e.g., Inngest, Trigger.dev)

## Scale Considerations

- 50+ labs at launch
- 300–400 frogs per lab = 15,000–20,000 frog records
- 50–75 bins per lab = 2,500–3,750 location records
- Events accumulate over time — index on organization_id, event_date
- Performance ratings accumulate — index on frog_id, location_id
- Environmental observations — index on organization_id, observed_at

## Security

- RLS policies enforce organization-level data isolation
- Service role key never exposed to client
- Auth tokens validated on all API routes
- File uploads scoped to organization paths in storage
