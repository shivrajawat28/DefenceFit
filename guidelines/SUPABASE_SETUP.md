# DefenceFit Supabase Setup

## 1. Create these tables in Supabase SQL editor

```sql
create table if not exists public.site_content (
  id text primary key,
  exams jsonb not null default '[]'::jsonb,
  questions jsonb not null default '[]'::jsonb,
  articles jsonb not null default '[]'::jsonb,
  sponsors jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.feedback_entries (
  id text primary key,
  name text not null default 'Anonymous',
  email text not null default '',
  message text not null,
  created_at timestamptz not null default now()
);
```

## 2. Add these Vercel environment variables

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_EMAIL_2`, `ADMIN_PASSWORD_2` (optional extra admin)
- `ADMIN_EMAIL_3`, `ADMIN_PASSWORD_3` (optional extra admin)
- `ADMIN_EMAIL_4`, `ADMIN_PASSWORD_4` (optional extra admin)
- `ADMIN_SESSION_SECRET`

## 3. Recommended values

- `ADMIN_EMAIL`: your live admin email
- `ADMIN_PASSWORD`: your live admin password
- `ADMIN_EMAIL_2` / `ADMIN_PASSWORD_2`: second admin login
- `ADMIN_EMAIL_3` / `ADMIN_PASSWORD_3`: third admin login
- `ADMIN_EMAIL_4` / `ADMIN_PASSWORD_4`: fourth admin login
- `ADMIN_SESSION_SECRET`: a long random secret string

## 4. Redeploy after adding env vars

Once these values are present, the admin panel and public website will both use the same live Supabase data.
