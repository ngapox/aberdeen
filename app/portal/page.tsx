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
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Phone,
  Shield,
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

  // Build dynamic navigation items based on RBAC
  const navItems: {
    id: PortalTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = React.useMemo(() => {
    if (isOwnerOrAdmin) {
      return [
        { id: "overview", label: "Executive Overview", icon: LayoutDashboard },
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
        { id: "overview", label: "Secretary Desk", icon: LayoutDashboard },
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
    // Parent mobile-first view
    return [
      {
        id: "diaries",
        label: "Child Diary, Sign-Off & Fees",
        icon: BookOpen,
      },
      { id: "forums", label: "School & Step Forum", icon: MessageSquare },
    ];
  }, [isOwnerOrAdmin, isSecretary, isTeacher]);

  // Ensure activeTab is valid for the current role
  const effectiveTab: PortalTab = navItems.some((item) => item.id === activeTab)
    ? activeTab
    : navItems[0].id;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#faf8f4] text-stone-900">
      {/* Left Sidebar Navigation */}
      <aside className="lg:w-72 bg-aberdeen-950 text-stone-100 flex flex-col justify-between shrink-0 border-b lg:border-b-0 lg:border-r border-aberdeen-900">
        <div className="p-5 sm:p-6 space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-aberdeen-800 text-amber-300 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-display text-lg font-bold text-white leading-none">
                  Aberdeen
                </span>
                <span className="block text-[11px] text-amber-300/90 font-medium mt-0.5">
                  School Management Portal
                </span>
              </div>
            </Link>

            <Link
              href="/"
              title="Public Website"
              className="p-2 rounded-xl bg-aberdeen-900 hover:bg-aberdeen-800 text-stone-300 text-xs"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Active User Profile Badge */}
          <div className="p-4 rounded-2xl bg-aberdeen-900/90 border border-aberdeen-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-bold uppercase tracking-wider">
                {currentUser.role}
              </span>
              <span className="font-mono text-xs text-stone-300 flex items-center gap-1">
                <Phone className="w-3 h-3 text-amber-300" />
                {currentUser.phone_number}
              </span>
            </div>
            <p className="font-bold text-sm text-white">
              {currentUser.full_name}
            </p>
            {isTeacher && assignedTeacherStep && (
              <p className="text-xs text-emerald-300 font-medium">
                Assigned: {STEP_META[assignedTeacherStep].shortLabel}
              </p>
            )}
            {isParent && parentPupils.length > 0 && (
              <p className="text-xs text-sky-300 font-medium">
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    active
                      ? "bg-amber-400 text-stone-950 font-bold shadow-sm"
                      : "text-stone-300 hover:bg-aberdeen-900 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Interactive Role Switcher inside Sidebar */}
        <div className="p-5 sm:p-6 border-t border-aberdeen-900 space-y-3 bg-aberdeen-950">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Interactive Role Switcher
            </span>
          </div>
          <select
            aria-label="Switch active role account"
            value={currentUser.id}
            onChange={(e) => switchUserById(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-aberdeen-900 border border-aberdeen-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {profiles.map((prof) => (
              <option key={prof.id} value={prof.id}>
                [{prof.role.toUpperCase()}] {prof.full_name} ({prof.phone_number}
                )
              </option>
            ))}
          </select>
          <div className="flex items-center justify-between pt-1 text-[11px] text-stone-400">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 hover:text-white"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Phone Login Screen</span>
            </Link>
            <span>Supabase Free Tier</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Portal Header with Real-Time Notification Badge */}
        <header className="sticky top-0 z-30 bg-[#faf8f4]/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="font-display text-lg sm:text-xl font-bold text-stone-900 truncate">
              {navItems.find((i) => i.id === effectiveTab)?.label}
            </h1>
            {isTeacher && (
              <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700 text-[11px] font-semibold">
                Beem SMS Restricted
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Role Pill Buttons for Desktop Evaluators */}
            <div className="hidden xl:flex items-center gap-1.5 bg-stone-200/70 p-1 rounded-xl text-xs">
              {[
                { id: "usr-owner-1", label: "Owner" },
                { id: "usr-sec-1", label: "Secretary" },
                { id: "usr-tchr-1", label: "Step 1 Teacher" },
                { id: "usr-par-1", label: "Step 1 Parent" },
              ].map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => switchUserById(preset.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    currentUser.id === preset.id
                      ? "bg-aberdeen-800 text-white shadow-xs"
                      : "text-stone-700 hover:bg-white"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Notification Bell with Red Unread Badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200/90 text-xs font-bold text-stone-800 shadow-xs"
              >
                <Bell className="w-4 h-4 text-aberdeen-800" />
                <span className="hidden sm:inline">Notifications</span>
                {unreadNotificationCount > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 min-w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-bold animate-pulse">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl border border-stone-200 shadow-2xl p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                    <div>
                      <span className="text-xs font-bold text-stone-900">
                        In-App Notifications ({unreadNotificationCount} Unread)
                      </span>
                      <p className="text-[11px] text-stone-500">
                        For {currentUser.full_name}
                      </p>
                    </div>
                    {unreadNotificationCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-aberdeen-700 hover:underline"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                    {userNotifications.length === 0 ? (
                      <p className="text-xs text-stone-500 text-center py-6">
                        No notifications for this account yet.
                      </p>
                    ) : (
                      userNotifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 rounded-2xl border text-xs cursor-pointer transition-colors ${
                            !n.is_read
                              ? "bg-red-50/70 border-red-200"
                              : "bg-[#faf8f4] border-stone-200/70 opacity-75"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-stone-900">
                              {n.title}
                            </span>
                            {!n.is_read && (
                              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-stone-600 mt-1 leading-relaxed">
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
              {/* Role Welcome Banner */}
              <div className="bg-aberdeen-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                    Karibu • {currentUser.role.toUpperCase()} Portal
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold">
                    Habari, {currentUser.full_name}
                  </h2>
                  <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                    {isOwnerOrAdmin &&
                      "You have unrestricted executive access across Step 1, Step 2, and Step 3, account provisioning, fee invoicing, Beem Africa SMS, and all daily diaries."}
                    {isSecretary &&
                      "Manage pupil admissions, generate and dispatch fee invoices via Beem Africa SMS (+255), update payment statuses, and moderate school forums."}
                    {isTeacher &&
                      assignedTeacherStep &&
                      `You are assigned to ${STEP_META[assignedTeacherStep].title}. Manage your pupils' Daily Digital Diaries, Weekly Progress Reports, and Step Forum.`}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {(isOwnerOrAdmin || isSecretary) && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("invoices")}
                      className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-sm"
                    >
                      Invoices &amp; Beem SMS
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab(isSecretary ? "accounts" : "diaries")
                    }
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20"
                  >
                    {isSecretary
                      ? "Register New Pupil (+255)"
                      : "Open Daily Diaries"}
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-stone-200/90 p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Enrolled Pupils
                  </span>
                  <p className="font-display text-3xl font-bold text-stone-900 mt-1">
                    {isTeacher && assignedTeacherStep
                      ? pupils.filter(
                          (p) => p.class_key === assignedTeacherStep
                        ).length
                      : pupils.length}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    {isTeacher && assignedTeacherStep
                      ? `In ${STEP_META[assignedTeacherStep].shortLabel}`
                      : "Across Step 1, Step 2 & Step 3"}
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200/90 p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Daily Diaries Logged
                  </span>
                  <p className="font-display text-3xl font-bold text-aberdeen-800 mt-1">
                    {diaries.length}
                  </p>
                  <p className="text-xs text-emerald-700 font-semibold mt-1">
                    {diaries.filter((d) => d.parent_signed).length} Signed Off by
                    Parents
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200/90 p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Active Forum Posts
                  </span>
                  <p className="font-display text-3xl font-bold text-stone-900 mt-1">
                    {forumPosts.length}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Main Forum + 3 Step Boards
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200/90 p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Fee Invoices Tracked
                  </span>
                  <p className="font-display text-3xl font-bold text-amber-700 mt-1">
                    {invoices.length}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
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
                      className="bg-white rounded-3xl border border-stone-200/90 p-6 space-y-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${meta.badgeColor}`}
                        >
                          {meta.shortLabel}
                        </span>
                        <span className="text-xs font-bold text-stone-500">
                          {stepPupils.length} Pupils
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-stone-900">
                        {meta.title}
                      </h3>
                      <div className="space-y-2 pt-2 border-t border-stone-100">
                        {stepPupils.map((p) => (
                          <div
                            key={p.id}
                            className="p-3 rounded-xl bg-[#faf8f4] border border-stone-200/70 flex items-center justify-between text-xs"
                          >
                            <div>
                              <p className="font-bold text-stone-900">
                                {p.pupil_name}
                              </p>
                              <p className="text-stone-500">
                                Parent: {p.parent_name}
                              </p>
                            </div>
                            <span className="font-mono text-stone-600">
                              {p.parent_phone}
                            </span>
                          </div>
                        ))}
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
