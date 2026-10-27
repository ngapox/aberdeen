# Aberdeen Daycare and Nursery School — Web Application & Portal

A modern, production-grade Next.js (App Router) + Supabase + Beem Africa SMS platform built for **Aberdeen Daycare and Nursery School** in Tanzania.

## Architecture & Cost Optimization (Supabase Free Tier)
- **Framework**: Next.js (App Router), TypeScript, Tailwind CSS, Lucide React icons.
- **Database & Auth**: Supabase PostgreSQL, Supabase Auth (`+255XXXXXXXXX` phone identification), and strict Row Level Security (RLS).
- **SMS Gateway**: Beem Africa REST API (`/api/sms/send`) for Tanzania `+255` numbers.
- **Free Tier Optimization**: Zero continuous media/photo uploads or storage bloat. All daily diaries, weekly progress reports, invoices, and forum posts are stored as structured relational text.

## Core Folder Structure
- `/app`
  - [`app/page.tsx`](./app/page.tsx) — Public Showcase Website (Hero, Mission & Values, Step 1/2/3 Developmental Stages, Staff & Leadership Showcase, Events Calendar, Quick Admission Inquiry CTA).
  - [`app/login/page.tsx`](./app/login/page.tsx) — `+255XXXXXXXXX` Portal Login + One-Click Provisioned Account Selector.
  - [`app/portal/page.tsx`](./app/portal/page.tsx) — Role-Adaptive Authenticated Portal (Admin/Owner, Secretary, Step Teacher, Parent Mobile View) with Real-Time Notification Badge & Role Switcher.
  - [`app/api/sms/send/route.ts`](./app/api/sms/send/route.ts) — Server-side Beem Africa SMS endpoint with strict Admin/Owner/Secretary authorization enforcement.
  - [`app/api/accounts/provision/route.ts`](./app/api/accounts/provision/route.ts) — Server-side account provisioning route for `+255XXXXXXXXX` accounts.
- `/components/ui`
  - [`components/ui/portal-context.tsx`](./components/ui/portal-context.tsx) — State, RBAC, notifications, and live actions provider.
  - [`components/ui/accounts-manager.tsx`](./components/ui/accounts-manager.tsx) — Account provisioning & Student/Staff directory.
  - [`components/ui/invoices-beem-manager.tsx`](./components/ui/invoices-beem-manager.tsx) — Fee invoicing, payment tracking, and Beem Africa SMS dispatch.
  - [`components/ui/diaries-reports-manager.tsx`](./components/ui/diaries-reports-manager.tsx) — Teacher Class Pre-Fill Daily Diary, Weekly Progress Reports, Parent One-Tap Digital Sign-Off, and Comments Drawer.
  - [`components/ui/forums-board.tsx`](./components/ui/forums-board.tsx) — Main School Forum & Step-isolated Forums (`step_1`, `step_2`, `step_3`).
  - [`components/ui/sql-rls-viewer.tsx`](./components/ui/sql-rls-viewer.tsx) — Interactive SQL & RLS viewer.
- `/lib/supabase` & `/lib/beem`
  - [`lib/supabase/types.ts`](./lib/supabase/types.ts), [`lib/supabase/client.ts`](./lib/supabase/client.ts), [`lib/supabase/server.ts`](./lib/supabase/server.ts), [`lib/supabase/seed-data.ts`](./lib/supabase/seed-data.ts)
  - [`lib/beem/sms.ts`](./lib/beem/sms.ts) — Beem Africa REST API integration & Swahili SMS templates.
- `/supabase`
  - [`supabase/schema.sql`](./supabase/schema.sql) — Complete PostgreSQL schema, triggers, and RLS policies ready to run in the Supabase SQL Editor.

## Getting Started
1. Copy `.env.example` to `.env.local` and fill in your Supabase and Beem Africa credentials.
2. Run the SQL script in [`supabase/schema.sql`](./supabase/schema.sql) inside your Supabase SQL Editor.
3. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```
