"use client";

import React, { useState } from "react";
import { Check, Copy, Database, ShieldCheck } from "lucide-react";

const SQL_MIGRATION_PREVIEW = `-- =============================================================================
-- ABERDEEN DAYCARE AND NURSERY SCHOOL - SUPABASE POSTGRESQL SCHEMA & RLS
-- Complete file located at: /supabase/schema.sql
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES (+255XXXXXXXXX strict constraint)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL UNIQUE CHECK (phone_number ~ '^\\+255[0-9]{9}$'),
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'owner', 'secretary', 'teacher', 'parent')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CLASSES (step_1, step_2, step_3)
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE CHECK (name IN ('step_1', 'step_2', 'step_3')),
  display_name TEXT NOT NULL
);

-- 3. TEACHER ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.teacher_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  UNIQUE (teacher_id, class_id)
);

-- 4. PUPILS (Stores both Pupil Name & Parent Name, linked to Parent +255 Profile)
CREATE TABLE IF NOT EXISTS public.pupils (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pupil_name TEXT NOT NULL,
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  parent_name TEXT NOT NULL,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE RESTRICT,
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 5. INVOICES
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no TEXT NOT NULL UNIQUE,
  pupil_id UUID NOT NULL REFERENCES public.pupils(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
  amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (amount_paid >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid')),
  due_date DATE NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 6. DAILY DIARIES
CREATE TABLE IF NOT EXISTS public.daily_diaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pupil_id UUID NOT NULL REFERENCES public.pupils(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  activities_learned TEXT NOT NULL,
  homework TEXT NOT NULL DEFAULT '',
  parent_signed BOOLEAN NOT NULL DEFAULT FALSE,
  parent_signed_at TIMESTAMPTZ,
  UNIQUE (pupil_id, entry_date)
);

-- 7. DIARY COMMENTS (With Trigger to Notify Teacher & Admin/Owner on Parent Comment)
CREATE TABLE IF NOT EXISTS public.diary_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_id UUID NOT NULL REFERENCES public.daily_diaries(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. FORUM POSTS (NULL class_id = Main School Forum, UUID = Step Forum)
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`;

export function SqlAndRlsViewer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_MIGRATION_PREVIEW);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border-2 border-[#c6dfed] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3b7a9e]">
              Supabase PostgreSQL &amp; Row Level Security (Free-Tier Optimized)
            </span>
            <h2 className="font-display text-2xl font-bold text-[#1e3f52]">
              Database Architecture &amp; Strict RLS Policies
            </h2>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e59500] hover:bg-[#c97d00] text-white text-xs font-bold shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied SQL Summary</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy SQL Migration</span>
              </>
            )}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#f2f7fa] border border-[#c6dfed] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#1e3f52]">
              <ShieldCheck className="w-4 h-4 text-[#e59500]" />
              <span>Parent RLS Policy</span>
            </div>
            <p className="text-[#275169]">
              Parents can only SELECT pupils, invoices, and diaries where{" "}
              <code className="font-mono">parent_id = auth.uid()</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f2f7fa] border border-[#c6dfed] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#1e3f52]">
              <ShieldCheck className="w-4 h-4 text-[#e59500]" />
              <span>Teacher RLS Policy</span>
            </div>
            <p className="text-[#275169]">
              Teachers can only INSERT/UPDATE diaries and view pupils in their{" "}
              <code className="font-mono">teacher_assignments</code> Step class.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f2f7fa] border border-[#c6dfed] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#1e3f52]">
              <ShieldCheck className="w-4 h-4 text-[#e59500]" />
              <span>Admin &amp; Owner Bypass</span>
            </div>
            <p className="text-[#275169]">
              <code className="font-mono">is_admin_or_owner()</code> grants
              unrestricted CRUD across all 3 Steps, invoices, and forums.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f2f7fa] border border-[#c6dfed] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#1e3f52]">
              <Database className="w-4 h-4 text-[#e59500]" />
              <span>Free-Tier Constraint</span>
            </div>
            <p className="text-[#275169]">
              100% structured relational text—zero file/photo bloat to preserve
              Supabase Free Tier bandwidth &amp; storage.
            </p>
          </div>
        </div>

        <pre className="p-5 rounded-2xl bg-[#132936] text-white font-mono text-xs overflow-x-auto leading-relaxed">
          {SQL_MIGRATION_PREVIEW}
        </pre>
      </div>
    </div>
  );
}
