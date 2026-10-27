"use client";

import React, { useState } from "react";
import {
  Globe,
  Lock,
  MessageSquarePlus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { usePortal } from "./portal-context";
import { STEP_META } from "@/lib/supabase/seed-data";
import { StepClassKey } from "@/lib/supabase/types";

type ForumChannel = "main" | StepClassKey;

export function ForumsBoard() {
  const {
    currentUser,
    forumPosts,
    assignedTeacherStep,
    parentPupils,
    createForumPost,
    deleteForumPost,
  } = usePortal();

  const canModerateAll = ["admin", "owner", "secretary"].includes(
    currentUser.role
  );

  // Determine which channels this user is permitted to access under RLS
  const allowedStepChannels: StepClassKey[] = React.useMemo(() => {
    if (canModerateAll) return ["step_1", "step_2", "step_3"];
    if (currentUser.role === "teacher" && assignedTeacherStep) {
      return [assignedTeacherStep];
    }
    if (currentUser.role === "parent") {
      const steps = Array.from(new Set(parentPupils.map((p) => p.class_key)));
      return steps.length > 0 ? steps : ["step_1"];
    }
    return [];
  }, [canModerateAll, currentUser.role, assignedTeacherStep, parentPupils]);

  const [activeChannel, setActiveChannel] = useState<ForumChannel>("main");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Ensure activeChannel is always permitted when switching roles
  const effectiveChannel: ForumChannel =
    activeChannel === "main" || allowedStepChannels.includes(activeChannel)
      ? activeChannel
      : "main";

  const visiblePosts = forumPosts.filter((post) => {
    if (effectiveChannel === "main") return post.class_key === null;
    return post.class_key === effectiveChannel;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    createForumPost({
      classKey: effectiveChannel === "main" ? null : effectiveChannel,
      title,
      content,
    });
    setTitle("");
    setContent("");
  };

  return (
    <div className="space-y-6">
      {/* Forum Channel Selector with RLS Locks */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-aberdeen-700">
              School &amp; Classroom Communication Boards
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-stone-900">
              Main School Forum &amp; Step-Specific Forums
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500">
            <ShieldCheck className="w-4 h-4 text-aberdeen-700" />
            Protected by Postgres RLS
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setActiveChannel("main")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              effectiveChannel === "main"
                ? "bg-aberdeen-900 text-white border-aberdeen-900 shadow-sm"
                : "bg-[#faf8f4] text-stone-800 border-stone-200 hover:bg-stone-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <Globe className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
                School-Wide
              </span>
            </div>
            <p className="font-bold text-sm mt-2">Main School Forum</p>
            <p className="text-[11px] opacity-80">
              All Staff, Teachers &amp; Parents
            </p>
          </button>

          {(["step_1", "step_2", "step_3"] as StepClassKey[]).map((stepKey) => {
            const isAllowed = allowedStepChannels.includes(stepKey);
            const isSelected = effectiveChannel === stepKey;
            const meta = STEP_META[stepKey];

            return (
              <button
                key={stepKey}
                type="button"
                disabled={!isAllowed}
                onClick={() => isAllowed && setActiveChannel(stepKey)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  !isAllowed
                    ? "bg-stone-100/70 text-stone-400 border-stone-200 cursor-not-allowed opacity-60"
                    : isSelected
                    ? "bg-aberdeen-900 text-white border-aberdeen-900 shadow-sm"
                    : "bg-[#faf8f4] text-stone-800 border-stone-200 hover:bg-stone-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase">
                    {meta.shortLabel}
                  </span>
                  {!isAllowed && <Lock className="w-3.5 h-3.5 text-stone-400" />}
                </div>
                <p className="font-bold text-sm mt-2">
                  {stepKey.replace("_", " ").toUpperCase()} Forum
                </p>
                <p className="text-[11px] opacity-80">
                  {isAllowed
                    ? "Authorized Step Access"
                    : "Restricted by Step RLS"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: New Forum Post Composer */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-aberdeen-700">
                Post to{" "}
                {effectiveChannel === "main"
                  ? "Main School Forum"
                  : `${STEP_META[effectiveChannel].shortLabel} Forum`}
              </span>
              <h3 className="font-display text-lg font-bold text-stone-900">
                Start a Discussion or Announcement
              </h3>
            </div>
            <MessageSquarePlus className="w-5 h-5 text-aberdeen-700" />
          </div>

          <form onSubmit={handleCreatePost} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Post Title / Topic *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Question about Friday's Fellowship showcase..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Message Content (Structured Text) *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Write your announcement or classroom discussion message..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-aberdeen-800 hover:bg-aberdeen-900 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              Publish to{" "}
              {effectiveChannel === "main"
                ? "Main School Forum"
                : `${STEP_META[effectiveChannel].shortLabel} Forum`}
            </button>
          </form>
        </div>

        {/* Right: Forum Feed */}
        <div className="lg:col-span-7 space-y-4">
          {visiblePosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-aberdeen-100 text-aberdeen-900 text-[10px] font-bold uppercase">
                      {post.author_role}
                    </span>
                    <span className="text-xs font-bold text-stone-800">
                      {post.author_name}
                    </span>
                    <span className="text-xs text-stone-400">
                      • {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-bold text-stone-900 mt-1">
                    {post.title}
                  </h4>
                </div>

                {canModerateAll && (
                  <button
                    type="button"
                    onClick={() => deleteForumPost(post.id)}
                    title="Moderate / Remove Post"
                    className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="text-sm text-stone-600 leading-relaxed">
                {post.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
