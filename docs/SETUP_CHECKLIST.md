# Setup Checklist

## Local Development

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env.local`
- [ ] Create Supabase project
- [ ] Run `supabase/schema.sql` in Supabase SQL editor
- [ ] Run `supabase/policies.sql` for RLS
- [ ] Run `supabase/seed.sql` for test data (optional)
- [ ] Create storage bucket `frog-photos` in Supabase
- [ ] Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Fill in SUPABASE_SERVICE_ROLE_KEY
- [ ] Run `npm run dev`
- [ ] Verify app loads at http://localhost:3000

## Auth Setup

- [ ] Enable email/password auth in Supabase
- [ ] Configure email templates for magic links
- [ ] Test sign-up and sign-in flows
- [ ] Verify organization membership creation on sign-up

## Organization Setup

- [ ] Create first organization record
- [ ] Set primary_lab_mode (extract, developmental, ovary_oocyte, transgenic, general)
- [ ] Configure rotation_settings (minimum_rest_days, target_rest_days, overdue_after_days)
- [ ] Add team members with appropriate roles

## Notification Setup

- [ ] Configure Resend/Postmark API key (for email)
- [ ] Configure Twilio credentials (for SMS)
- [ ] Create initial notification_rules for organization
- [ ] Test email delivery
- [ ] Test SMS delivery (if enabled)
- [ ] Set up cron jobs for scheduled notifications

## Storage Setup

- [ ] Create `frog-photos` bucket in Supabase Storage
- [ ] Configure storage policies for organization-scoped access
- [ ] Test photo upload flow

## Data Import

- [ ] Import location hierarchy (rooms, racks, bins)
- [ ] Import frog records (manual or bulk CSV)
- [ ] Associate frogs with locations
- [ ] Set initial cycle states
- [ ] Import historical events if available

## Production Deployment

- [ ] Connect repo to Vercel
- [ ] Set all environment variables in Vercel
- [ ] Create production Supabase project
- [ ] Run schema in production
- [ ] Configure production email/SMS
- [ ] Set up error monitoring (Sentry)
- [ ] Set up cron jobs for notifications
- [ ] Verify all routes load correctly
- [ ] Test end-to-end flow: sign up → create org → add frogs → log event

## Post-Launch

- [ ] Monitor error rates
- [ ] Review notification delivery
- [ ] Gather user feedback on lab mode presets
- [ ] Iterate on rotation settings defaults
- [ ] Plan visual analytics integration (charting library)
