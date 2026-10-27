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
  Sparkles,
  Sun,
  UserCheck,
} from "lucide-react";
import { usePortal } from "@/components/ui/portal-context";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";

export default function PortalLoginPage() {
  const router = useRouter();
  const { profiles, loginByPhone, switchUserById } = usePortal();

  const [phoneNumber, setPhoneNumber] = useState("+255716004601");
  const [password, setPassword] = useState("Aberdeen2026!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = phoneNumber.trim();
    if (!/^\+255\d{9}$/.test(trimmed)) {
      setError(
        "Phone number must strictly start with +255 followed by 9 digits (e.g., +255716004601)."
      );
      return;
    }

    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { error: sbPhoneErr } = await supabase.auth.signInWithPassword({
          phone: trimmed,
          password,
        });
        if (!sbPhoneErr) {
          loginByPhone(trimmed);
          router.push("/portal");
          return;
        }

        const syntheticEmail = `${trimmed.replace(/^\+/, "")}@aberdeen.sc.tz`;
        const { error: sbEmailErr } = await supabase.auth.signInWithPassword({
          email: syntheticEmail,
          password,
        });
        if (!sbEmailErr) {
          loginByPhone(trimmed);
          router.push("/portal");
          return;
        }
      }

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
    <div className="min-h-screen bg-gradient-to-br from-[#7aa7c2] via-[#548eb0] to-[#1e3f52] flex flex-col justify-between p-4 sm:p-8 text-[#132936]">
      {/* Top Bar */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between text-white">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-xs text-xs sm:text-sm font-bold transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-[#fbd24d]" />
          <span>Back to School Reception</span>
        </Link>
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#e2eef5] font-medium">
          <ShieldCheck className="w-4 h-4 text-[#fbd24d]" />
          <span>Aberdeen Secure Portal (+255 Phone Identification)</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl w-full mx-auto my-8 grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Login Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-4 border-[#e59500] shadow-2xl p-6 sm:p-9 space-y-6">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 p-3 rounded-2xl bg-[#1e3f52] text-[#fbd24d] flex items-center justify-center shadow-md">
              <Sun className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[#e59500]">
                <Sparkles className="w-3 h-3" /> Aberdeen Daycare &amp; Nursery
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1e3f52]">
                School Portal Login
              </h1>
              <p className="text-xs font-semibold text-[#3b7a9e] italic">
                &ldquo;Step by Step, the child is prospering&rdquo;
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#275169] mb-1.5">
                Registered Phone Number (+255XXXXXXXXX)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#548eb0] absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+255716004601"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#c6dfed] font-mono text-sm focus:outline-none focus:border-[#3b7a9e]"
                />
              </div>
              <p className="text-[11px] text-[#548eb0] mt-1">
                Strictly formatted as <code className="font-mono">+255XXXXXXXXX</code>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#275169] mb-1.5">
                Portal Password / PIN
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#548eb0] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#c6dfed] text-sm focus:outline-none focus:border-[#3b7a9e]"
                />
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#e59500] hover:bg-[#c97d00] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? "Signing In..." : "Enter Aberdeen Portal"}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-[#e2eef5] text-xs text-[#2f6280] space-y-1">
            <p className="font-bold text-[#1e3f52]">
              How Accounts Work:
            </p>
            <p>
              <strong>Madam Elizabeth Nkya (Owner)</strong> creates accounts for the{" "}
              <strong>Secretary</strong>, <strong>Step 1–3 Teachers</strong>, and{" "}
              <strong>Parents/Pupils</strong> inside the portal. Once created, they
              appear in the registered directory and can sign in with their{" "}
              <code className="font-mono">+255</code> phone number.
            </p>
          </div>
        </div>

        {/* Right: Active Registered Accounts */}
        <div className="lg:col-span-5 bg-white/95 backdrop-blur-md rounded-3xl border-2 border-white/60 shadow-xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2eef5] pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3b7a9e]">
                Active Portal Directory ({profiles.length})
              </span>
              <h2 className="font-display text-lg font-bold text-[#1e3f52]">
                Registered Accounts
              </h2>
            </div>
            <UserCheck className="w-5 h-5 text-[#e59500]" />
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {profiles.map((prof) => {
              const isSelected = phoneNumber.trim() === prof.phone_number;
              const roleBadgeColors: Record<string, string> = {
                owner: "bg-[#e59500] text-white",
                admin: "bg-[#1e3f52] text-[#fbd24d]",
                secretary: "bg-[#3b7a9e] text-white",
                teacher: "bg-[#e2eef5] text-[#1e3f52]",
                parent: "bg-[#fffbeb] text-[#a36102] border border-[#fde58a]",
              };

              return (
                <button
                  key={prof.id}
                  type="button"
                  onClick={() => quickSelectAccount(prof.id, prof.phone_number)}
                  className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-[#f2f7fa] border-[#3b7a9e] shadow-xs"
                      : "bg-white hover:bg-[#f2f7fa] border-[#e2eef5]"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1e3f52]">
                        {prof.full_name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          roleBadgeColors[prof.role] || ""
                        }`}
                      >
                        {prof.role}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#3b7a9e] mt-0.5">
                      {prof.phone_number}
                    </p>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-[#e59500] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-white/80">
        Aberdeen Daycare &amp; Nursery School • +255 716 004 601 • @aberdeen_daycare_nursery
      </div>
    </div>
  );
}
