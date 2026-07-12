-- Migration 005: User legal acceptances table
-- Records Terms of Service and Privacy Policy acceptance per user
-- Safe to run multiple times (idempotent)

create table if not exists public.user_legal_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  terms_version text not null,
  privacy_version text not null,
  accepted_at timestamptz not null default now(),
  user_agent text,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.user_legal_acceptances enable row level security;

-- Users can read their own acceptances
drop policy if exists "user_legal_acceptances_select_own" on public.user_legal_acceptances;
create policy "user_legal_acceptances_select_own" on public.user_legal_acceptances
  for select using (auth.uid() = user_id);

-- Users can insert their own acceptances
drop policy if exists "user_legal_acceptances_insert_own" on public.user_legal_acceptances;
create policy "user_legal_acceptances_insert_own" on public.user_legal_acceptances
  for insert with check (auth.uid() = user_id);
