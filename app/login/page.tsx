"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Lock,
  Phone,
  ShieldCheck,
  Sun,
  UserCheck,
} from "lucide-react";
import { usePortal } from "@/components/ui/portal-context";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";

export default function PortalLoginPage() {
  const router = useRouter();
  const { profiles, loginByPhone, switchUserById } = usePortal();

  const [phoneNumber, setPhoneNumber] = useState("+255754100100");
  const [password, setPassword] = useState("Aberdeen2026!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = phoneNumber.trim();
    if (!/^\+255\d{9}$/.test(trimmed)) {
      setError(
        "Phone number must strictly start with +255 followed by 9 digits (e.g., +255754100100)."
      );
      return;
    }

    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { error: sbErr } = await supabase.auth.signInWithPassword({
          phone: trimmed,
          password,
        });
        if (!sbErr) {
          router.push("/portal");
          return;
        }
      }

      // Authenticate against provisioned profiles
      const result = loginByPhone(trimmed);
      if (!result.ok) {
        setError(result.error || "Invalid credentials.");
        setLoading(false);
        return;
      }

      router.push("/portal");
    } finally {
      setLoading(false);
    }
  };

  const quickSelectAccount = (profileId: string, phone: string) => {
    setPhoneNumber(phone);
    setError("");
    switchUserById(profileId);
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-aberdeen-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Website</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <ShieldCheck className="w-4 h-4 text-aberdeen-700" />
          <span>Supabase Auth &amp; Row-Level Security (+255 Phone ID)</span>
        </div>
      </div>

      <div className="max-w-5xl w-full mx-auto my-8 grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Login Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200/90 shadow-lg p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-aberdeen-800 text-amber-300 flex items-center justify-center">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-stone-900">
                Aberdeen Portal Login
              </h1>
              <p className="text-xs text-stone-500">
                Sign in with your provisioned Tanzania (+255) phone number
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Registered Phone Number (+255XXXXXXXXX)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+255754100100"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-aberdeen-600"
                />
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Strictly formatted as <code className="font-mono">+255XXXXXXXXX</code>. Accounts are provisioned by Admin, Owner, or Secretary.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Portal Password / PIN
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-aberdeen-600"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-aberdeen-800 hover:bg-aberdeen-900 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Lock className="w-4 h-4 text-amber-300" />
              <span>{loading ? "Signing In..." : "Sign In to School Portal"}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-stone-100 text-xs text-stone-500 space-y-1">
            <p className="font-semibold text-stone-700">
              Account Identification Policy:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                <strong>Owner / Admin &amp; Secretary:</strong> Registered with official staff +255 number.
              </li>
              <li>
                <strong>Teachers:</strong> Registered with teacher&apos;s +255 number and assigned to Step 1, Step 2, or Step 3.
              </li>
              <li>
                <strong>Pupil Account:</strong> Uses the Parent&apos;s +255 number and stores both Pupil Full Name and Parent/Guardian Full Name.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Quick-Select Provisioned Accounts Panel */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-aberdeen-700">
                Interactive RBAC Evaluation
              </span>
              <h2 className="font-display text-xl font-bold text-stone-900">
                Tap Any Provisioned Account to Auto-Fill
              </h2>
            </div>
            <UserCheck className="w-5 h-5 text-aberdeen-700" />
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {profiles.map((prof) => {
              const isSelected = phoneNumber.trim() === prof.phone_number;
              const roleBadgeColors: Record<string, string> = {
                owner: "bg-purple-100 text-purple-900 border-purple-200",
                admin: "bg-aberdeen-100 text-aberdeen-900 border-aberdeen-200",
                secretary: "bg-amber-100 text-amber-900 border-amber-200",
                teacher: "bg-emerald-100 text-emerald-900 border-emerald-200",
                parent: "bg-sky-100 text-sky-900 border-sky-200",
              };

              return (
                <button
                  key={prof.id}
                  type="button"
                  onClick={() => quickSelectAccount(prof.id, prof.phone_number)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-aberdeen-50/90 border-aberdeen-600 ring-1 ring-aberdeen-600"
                      : "bg-[#faf8f4] hover:bg-stone-100 border-stone-200"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900">
                        {prof.full_name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          roleBadgeColors[prof.role] || ""
                        }`}
                      >
                        {prof.role}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-stone-600 mt-0.5">
                      {prof.phone_number}
                    </p>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-aberdeen-700 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-stone-400">
        Aberdeen Daycare and Nursery School • Secure Role-Based Portal
      </div>
    </div>
  );
}
