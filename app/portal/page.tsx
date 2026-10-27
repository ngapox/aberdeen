"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  CheckCheck,
  CreditCard,
  Database,
  ExternalLink,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Phone,
  PlusCircle,
  Shield,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";
import { usePortal } from "@/components/ui/portal-context";
import { AccountsManager } from "@/components/ui/accounts-manager";
import { InvoicesAndBeemManager } from "@/components/ui/invoices-beem-manager";
import { DiariesAndReportsManager } from "@/components/ui/diaries-reports-manager";
import { ForumsBoard } from "@/components/ui/forums-board";
import { SqlAndRlsViewer } from "@/components/ui/sql-rls-viewer";
import { STEP_META } from "@/lib/supabase/seed-data";

type PortalTab =
  | "overview"
  | "diaries"
  | "accounts"
  | "invoices"
  | "forums"
  | "schema";

export default function SchoolPortalPage() {
  const {
    currentUser,
    profiles,
    pupils,
    invoices,
    diaries,
    forumPosts,
    assignedTeacherStep,
    parentPupils,
    unreadNotificationCount,
    userNotifications,
    switchUserById,
    markNotificationRead,
    markAllNotificationsRead,
  } = usePortal();

  const [activeTab, setActiveTab] = useState<PortalTab>("overview");
  const [notifOpen, setNotifOpen] = useState(false);

  const role = currentUser.role;
  const isOwnerOrAdmin = role === "owner" || role === "admin";
  const isSecretary = role === "secretary";
  const isTeacher = role === "teacher";
  const isParent = role === "parent";

  const navItems: {
    id: PortalTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = React.useMemo(() => {
    if (isOwnerOrAdmin) {
      return [
        { id: "overview", label: "School Overview", icon: LayoutDashboard },
        {
          id: "accounts",
          label: "Accounts & Pupils (+255)",
          icon: Users,
        },
        {
          id: "invoices",
          label: "Fees, Invoices & Beem SMS",
          icon: CreditCard,
        },
        {
          id: "diaries",
          label: "Diaries & Weekly Reports",
          icon: BookOpen,
        },
        { id: "forums", label: "School & Step Forums", icon: MessageSquare },
        { id: "schema", label: "Supabase SQL & RLS", icon: Database },
      ];
    }
    if (isSecretary) {
      return [
        { id: "overview", label: "Secretary Reception", icon: LayoutDashboard },
        {
          id: "accounts",
          label: "Register Pupils (+255)",
          icon: Users,
        },
        {
          id: "invoices",
          label: "Invoices & Beem SMS",
          icon: CreditCard,
        },
        { id: "forums", label: "School & Step Forums", icon: MessageSquare },
      ];
    }
    if (isTeacher) {
      return [
        {
          id: "diaries",
          label: "Daily Diary & Reports",
          icon: BookOpen,
        },
        { id: "forums", label: "Main & Step Forum", icon: MessageSquare },
        { id: "overview", label: "My Step Class Roster", icon: Users },
      ];
    }
    return [
      {
        id: "diaries",
        label: "Child Diary, Sign-Off & Fees",
        icon: BookOpen,
      },
      { id: "forums", label: "School & Step Forum", icon: MessageSquare },
    ];
  }, [isOwnerOrAdmin, isSecretary, isTeacher]);

  const effectiveTab: PortalTab = navItems.some((item) => item.id === activeTab)
    ? activeTab
    : navItems[0].id;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f4f8fb] text-[#132936]">
      {/* Left Sidebar Navigation — Signature Deep Ocean Teal (#1e3f52) & Golden Marigold (#e59500) */}
      <aside className="lg:w-72 bg-gradient-to-b from-[#1e3f52] via-[#183444] to-[#132936] text-white flex flex-col justify-between shrink-0 border-b lg:border-b-0 lg:border-r border-[#2f6280]">
        <div className="p-5 sm:p-6 space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#3b7a9e] text-[#fbd24d] flex items-center justify-center shadow-md ring-2 ring-[#7aa7c2]/40">
                <Sun className="w-6 h-6" />
              </div>
              <div>
                <span className="block font-display text-lg font-bold text-white leading-none tracking-tight">
                  ABERDEEN
                </span>
                <span className="block text-[10px] text-[#fbd24d] font-bold uppercase tracking-widest mt-0.5">
                  Daycare &amp; Nursery
                </span>
              </div>
            </Link>

            <Link
              href="/"
              title="Public Reception Website"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#c6dfed] text-xs transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Active User Profile Card */}
          <div className="p-4 rounded-2xl bg-[#275169]/90 border border-[#548eb0]/40 space-y-2 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#e59500] text-white text-[10px] font-bold uppercase tracking-wider">
                {currentUser.role}
              </span>
              <span className="font-mono text-xs text-[#c6dfed] flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#fbd24d]" />
                {currentUser.phone_number}
              </span>
            </div>
            <p className="font-bold text-sm text-white">
              {currentUser.full_name}
            </p>
            {isTeacher && assignedTeacherStep && (
              <p className="text-xs text-[#fbd24d] font-semibold">
                Assigned: {STEP_META[assignedTeacherStep].shortLabel}
              </p>
            )}
            {isParent && parentPupils.length > 0 && (
              <p className="text-xs text-[#9bc6de] font-semibold">
                Pupil: {parentPupils.map((p) => p.pupil_name).join(", ")}
              </p>
            )}
          </div>

          {/* Role-Adaptive Navigation Links */}
          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = effectiveTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    active
                      ? "bg-[#e59500] text-white shadow-md"
                      : "text-[#c6dfed] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Account Switcher (Only shows real provisioned accounts) */}
        <div className="p-5 sm:p-6 border-t border-[#275169] space-y-3 bg-[#132936]/90">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-[#fbd24d] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Active Account ({profiles.length})
            </span>
          </div>
          <select
            aria-label="Switch active role account"
            value={currentUser.id}
            onChange={(e) => switchUserById(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#1e3f52] border border-[#3b7a9e] text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#e59500]"
          >
            {profiles.map((prof) => (
              <option key={prof.id} value={prof.id}>
                [{prof.role.toUpperCase()}] {prof.full_name} ({prof.phone_number}
                )
              </option>
            ))}
          </select>
          <div className="flex items-center justify-between pt-1 text-[11px] text-[#9bc6de]">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 hover:text-white"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Login Screen</span>
            </Link>
            <span>+255 716 004 601</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Portal Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#c6dfed] px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="font-display text-lg sm:text-xl font-bold text-[#1e3f52] truncate">
              {navItems.find((i) => i.id === effectiveTab)?.label}
            </h1>
            <span className="hidden md:inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#f2f7fa] border border-[#c6dfed] text-[#3b7a9e] text-xs font-semibold italic">
              <Sparkles className="w-3 h-3 text-[#e59500]" />
              &ldquo;Step by Step, the child is prospering&rdquo;
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell with Red Unread Badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#f2f7fa] hover:bg-[#e2eef5] border border-[#c6dfed] text-xs font-bold text-[#1e3f52] transition-colors"
              >
                <Bell className="w-4 h-4 text-[#3b7a9e]" />
                <span className="hidden sm:inline">Notifications</span>
                {unreadNotificationCount > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 min-w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-bold animate-pulse">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl border-2 border-[#7aa7c2] shadow-2xl p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#e2eef5] pb-2.5">
                    <div>
                      <span className="text-xs font-bold text-[#1e3f52]">
                        In-App Notifications ({unreadNotificationCount} Unread)
                      </span>
                      <p className="text-[11px] text-[#548eb0]">
                        For {currentUser.full_name}
                      </p>
                    </div>
                    {unreadNotificationCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3b7a9e] hover:underline"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                    {userNotifications.length === 0 ? (
                      <p className="text-xs text-[#548eb0] text-center py-6">
                        No notifications yet.
                      </p>
                    ) : (
                      userNotifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 rounded-2xl border text-xs cursor-pointer transition-colors ${
                            !n.is_read
                              ? "bg-red-50/70 border-red-200"
                              : "bg-[#f2f7fa] border-[#e2eef5] opacity-75"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-[#1e3f52]">
                              {n.title}
                            </span>
                            {!n.is_read && (
                              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-[#275169] mt-1 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Active Module Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {effectiveTab === "overview" && (
            <div className="space-y-8">
              {/* Welcome Banner — Aberdeen Sky Blue & Deep Teal */}
              <div className="bg-gradient-to-r from-[#1e3f52] via-[#2f6280] to-[#3b7a9e] text-white rounded-3xl p-6 sm:p-8 shadow-lg border-b-4 border-[#e59500] flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e59500] text-white text-xs font-bold uppercase tracking-wider">
                    Karibu • {currentUser.role.toUpperCase()} Portal
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold">
                    Habari, {currentUser.full_name}
                  </h2>
                  <p className="text-[#e2eef5] text-xs sm:text-sm max-w-2xl leading-relaxed">
                    {isOwnerOrAdmin &&
                      "Welcome to your clean Aberdeen command center. Create accounts for your Secretary, Step 1–3 Teachers, and Pupils/Parents (+255), manage fee invoices, and send Beem Africa SMS."}
                    {isSecretary &&
                      "Register new pupils and parents (+255), generate and send fee invoices via Beem Africa SMS, and moderate school forums."}
                    {isTeacher &&
                      assignedTeacherStep &&
                      `You are assigned to ${STEP_META[assignedTeacherStep].title}. Manage your pupils' Daily Digital Diaries, Weekly Progress Reports, and Step Forum.`}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {(isOwnerOrAdmin || isSecretary) && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("accounts")}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#e59500] hover:bg-[#c97d00] text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Create New Account / Pupil</span>
                    </button>
                  )}
                  {(isOwnerOrAdmin || isSecretary) && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("invoices")}
                      className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/25 transition-all"
                    >
                      Fees &amp; Beem SMS
                    </button>
                  )}
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border-2 border-[#c6dfed] p-5 shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#3b7a9e]">
                    Enrolled Pupils
                  </span>
                  <p className="font-display text-3xl font-bold text-[#1e3f52] mt-1">
                    {isTeacher && assignedTeacherStep
                      ? pupils.filter(
                          (p) => p.class_key === assignedTeacherStep
                        ).length
                      : pupils.length}
                  </p>
                  <p className="text-xs text-[#548eb0] mt-1">
                    {isTeacher && assignedTeacherStep
                      ? `In ${STEP_META[assignedTeacherStep].shortLabel}`
                      : "Across Step 1, Step 2 & Step 3"}
                  </p>
                </div>

                <div className="bg-white rounded-2xl border-2 border-[#c6dfed] p-5 shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#3b7a9e]">
                    Staff &amp; Teachers
                  </span>
                  <p className="font-display text-3xl font-bold text-[#1e3f52] mt-1">
                    {profiles.filter((p) => p.role !== "parent").length}
                  </p>
                  <p className="text-xs text-[#548eb0] mt-1">
                    Active Staff Accounts
                  </p>
                </div>

                <div className="bg-white rounded-2xl border-2 border-[#c6dfed] p-5 shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#3b7a9e]">
                    Daily Diaries Logged
                  </span>
                  <p className="font-display text-3xl font-bold text-[#3b7a9e] mt-1">
                    {diaries.length}
                  </p>
                  <p className="text-xs text-[#e59500] font-bold mt-1">
                    {diaries.filter((d) => d.parent_signed).length} Signed Off by
                    Parents
                  </p>
                </div>

                <div className="bg-white rounded-2xl border-2 border-[#c6dfed] p-5 shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#3b7a9e]">
                    Fee Invoices Tracked
                  </span>
                  <p className="font-display text-3xl font-bold text-[#e59500] mt-1">
                    {invoices.length}
                  </p>
                  <p className="text-xs text-[#548eb0] mt-1">
                    {invoices.filter((i) => i.status === "paid").length} Paid in
                    Full
                  </p>
                </div>
              </div>

              {/* 3 Developmental Step Classes Breakdown */}
              <div className="grid lg:grid-cols-3 gap-6">
                {(["step_1", "step_2", "step_3"] as const).map((sk) => {
                  const stepPupils = pupils.filter((p) => p.class_key === sk);
                  const meta = STEP_META[sk];
                  return (
                    <div
                      key={sk}
                      className="bg-white rounded-3xl border-2 border-[#c6dfed] p-6 space-y-4 shadow-xs flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${meta.badgeColor}`}
                          >
                            {meta.shortLabel}
                          </span>
                          <span className="text-xs font-bold text-[#3b7a9e]">
                            {stepPupils.length} Pupil(s)
                          </span>
                        </div>
                        <h3 className="font-display text-lg font-bold text-[#1e3f52]">
                          {meta.title}
                        </h3>

                        {stepPupils.length === 0 ? (
                          <div className="p-5 rounded-2xl bg-[#f2f7fa] border border-dashed border-[#9bc6de] text-center space-y-2">
                            <GraduationCap className="w-6 h-6 text-[#548eb0] mx-auto" />
                            <p className="text-xs font-semibold text-[#275169]">
                              No pupils enrolled in {meta.shortLabel} yet.
                            </p>
                            {(isOwnerOrAdmin || isSecretary) && (
                              <button
                                type="button"
                                onClick={() => setActiveTab("accounts")}
                                className="inline-flex items-center gap-1 text-xs font-bold text-[#e59500] hover:underline"
                              >
                                <PlusCircle className="w-3.5 h-3.5" />
                                <span>Enroll First Pupil</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2 pt-2 border-t border-[#e2eef5]">
                            {stepPupils.map((p) => (
                              <div
                                key={p.id}
                                className="p-3 rounded-xl bg-[#f2f7fa] border border-[#c6dfed] flex items-center justify-between text-xs"
                              >
                                <div>
                                  <p className="font-bold text-[#1e3f52]">
                                    {p.pupil_name}
                                  </p>
                                  <p className="text-[#3b7a9e]">
                                    Parent: {p.parent_name}
                                  </p>
                                </div>
                                <span className="font-mono text-[#275169]">
                                  {p.parent_phone}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {effectiveTab === "accounts" && <AccountsManager />}
          {effectiveTab === "invoices" && <InvoicesAndBeemManager />}
          {effectiveTab === "diaries" && <DiariesAndReportsManager />}
          {effectiveTab === "forums" && <ForumsBoard />}
          {effectiveTab === "schema" && <SqlAndRlsViewer />}
        </main>
      </div>
    </div>
  );
}
