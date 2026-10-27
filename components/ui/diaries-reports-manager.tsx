"use client";

import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileCheck2,
  GraduationCap,
  MessageCircle,
  Send,
  Sparkles,
  UserCheck,
  X,
} from "lucide-react";
import { usePortal } from "./portal-context";
import { STEP_META } from "@/lib/supabase/seed-data";
import { StepClassKey } from "@/lib/supabase/types";

export function DiariesAndReportsManager() {
  const {
    currentUser,
    pupils,
    diaries,
    diaryComments,
    weeklyReports,
    invoices,
    assignedTeacherStep,
    parentPupils,
    prefillClassDiaries,
    signOffDiary,
    addDiaryComment,
    submitWeeklyReport,
    markWeeklyReportReviewed,
  } = usePortal();

  const isParent = currentUser.role === "parent";
  const isTeacher = currentUser.role === "teacher";
  const isAdminOrOwner =
    currentUser.role === "admin" || currentUser.role === "owner";

  const [selectedStep, setSelectedStep] = useState<StepClassKey>(
    assignedTeacherStep || "step_1"
  );
  const activeStep: StepClassKey = isTeacher
    ? assignedTeacherStep || "step_1"
    : selectedStep;

  const [activeCommentDiaryId, setActiveCommentDiaryId] = useState<
    string | null
  >(null);
  const [commentInput, setCommentInput] = useState("");

  const [entryDate, setEntryDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [sharedActivities, setSharedActivities] = useState("");
  const [sharedHomework, setSharedHomework] = useState("");
  const [individualNotes, setIndividualNotes] = useState<
    Record<string, string>
  >({});
  const [diarySavedBanner, setDiarySavedBanner] = useState<string | null>(null);

  const classPupils = pupils.filter(
    (p) => p.class_key === activeStep && p.is_active
  );
  const [reportPupilId, setReportPupilId] = useState<string>(
    classPupils[0]?.id || ""
  );
  const [weekEnding, setWeekEnding] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [litNumNotes, setLitNumNotes] = useState("");
  const [socialNotes, setSocialNotes] = useState("");
  const [teacherRemark, setTeacherRemark] = useState("");

  const [selectedChildId, setSelectedChildId] = useState<string>(
    parentPupils[0]?.id || ""
  );

  const handlePrefillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (classPupils.length === 0) return;
    prefillClassDiaries({
      stepClass: activeStep,
      entryDate,
      sharedActivities,
      sharedHomework,
      individualNotes,
    });
    setDiarySavedBanner(
      `Published Daily Digital Diaries for all ${classPupils.length} pupil(s) in ${STEP_META[activeStep].shortLabel}!`
    );
  };

  const handleWeeklyReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!litNumNotes.trim() || !socialNotes.trim() || !teacherRemark.trim())
      return;

    const targetPupilId = classPupils.some((p) => p.id === reportPupilId)
      ? reportPupilId
      : classPupils[0]?.id;
    if (!targetPupilId) return;

    submitWeeklyReport({
      pupilId: targetPupilId,
      weekEnding,
      literacyNumeracyNotes: litNumNotes.trim(),
      socialEmotionalNotes: socialNotes.trim(),
      teacherRemark: teacherRemark.trim(),
    });

    setLitNumNotes("");
    setSocialNotes("");
    setTeacherRemark("");
    setDiarySavedBanner(
      "Weekly Progress Report submitted and shared with Parent & Madam Elizabeth Nkya!"
    );
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCommentDiaryId || !commentInput.trim()) return;
    addDiaryComment(activeCommentDiaryId, commentInput);
    setCommentInput("");
  };

  const activeDrawerDiary = diaries.find((d) => d.id === activeCommentDiaryId);
  const activeDrawerComments = diaryComments.filter(
    (c) => c.diary_id === activeCommentDiaryId
  );

  // =========================================================================
  // PARENT MOBILE-FIRST RESPONSIVE VIEW
  // =========================================================================
  if (isParent) {
    const activeChild =
      parentPupils.find((p) => p.id === selectedChildId) || parentPupils[0];

    if (!activeChild) {
      return (
        <div className="bg-white rounded-3xl border-2 border-[#c6dfed] p-8 text-center">
          <p className="text-sm text-[#275169]">
            No enrolled pupil linked to this parent account yet.
          </p>
        </div>
      );
    }

    const childDiaries = diaries.filter((d) => d.pupil_id === activeChild.id);
    const childReports = weeklyReports.filter(
      (r) => r.pupil_id === activeChild.id
    );
    const childInvoices = invoices.filter((i) => i.pupil_id === activeChild.id);
    const totalBalance = childInvoices.reduce(
      (sum, inv) => sum + Math.max(0, inv.amount - inv.amount_paid),
      0
    );

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Mobile-First Child Header Card */}
        <div className="bg-gradient-to-r from-[#1e3f52] to-[#3b7a9e] text-white rounded-3xl p-6 shadow-md border-b-4 border-[#e59500] space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#fbd24d]">
                Parent Mobile Portal • {currentUser.full_name}
              </span>
              <h2 className="font-display text-2xl font-bold mt-0.5">
                {activeChild.pupil_name}
              </h2>
              <p className="text-xs text-[#e2eef5] mt-0.5">
                Enrolled in {STEP_META[activeChild.class_key].title}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#e59500] text-white text-xs font-bold">
              {STEP_META[activeChild.class_key].shortLabel}
            </span>
          </div>

          {parentPupils.length > 1 && (
            <div className="pt-3 border-t border-white/20 flex items-center gap-2">
              <span className="text-xs text-[#e2eef5]">Switch Child:</span>
              {parentPupils.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => setSelectedChildId(child.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    child.id === activeChild.id
                      ? "bg-white text-[#1e3f52]"
                      : "bg-[#1e3f52] text-[#c6dfed]"
                  }`}
                >
                  {child.pupil_name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Daily Digital Diary & One-Tap Sign-Off */}
        <div className="space-y-4">
          <h3 className="font-display text-xl font-bold text-[#1e3f52] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#e59500]" />
            <span>Daily Digital Diary &amp; Homework</span>
          </h3>

          {childDiaries.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-[#c6dfed] p-6 text-center text-xs text-[#2f6280]">
              No daily diary entries posted for {activeChild.pupil_name} yet.
            </div>
          ) : (
            childDiaries.map((diary) => {
              const cmtCount = diaryComments.filter(
                (c) => c.diary_id === diary.id
              ).length;

              return (
                <div
                  key={diary.id}
                  className="bg-white rounded-3xl border-2 border-[#c6dfed] p-5 sm:p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-[#e2eef5] pb-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#3b7a9e]">
                        Date: {diary.entry_date}
                      </span>
                      <p className="text-xs text-[#548eb0]">
                        Logged by <strong>{diary.teacher_name}</strong>
                      </p>
                    </div>
                    {diary.parent_signed ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Signed Off
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#fffbeb] text-[#a36102] border border-[#fde58a] text-xs font-bold">
                        <Clock className="w-3.5 h-3.5" /> Awaiting Sign-Off
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="p-3.5 rounded-2xl bg-[#f2f7fa] border border-[#c6dfed]">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#1e3f52] mb-1">
                        Activities Learned Today
                      </p>
                      <p className="text-[#275169] leading-relaxed">
                        {diary.activities_learned}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#fffbeb] border border-[#fde58a]">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#a36102] mb-1">
                        Homework &amp; Evening Practice
                      </p>
                      <p className="text-[#1e3f52] leading-relaxed">
                        {diary.homework}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    {diary.parent_signed ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          Acknowledged by {currentUser.full_name} •{" "}
                          {diary.parent_signed_at
                            ? new Date(diary.parent_signed_at).toLocaleString()
                            : "Recorded"}
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => signOffDiary(diary.id)}
                        className="flex-1 py-3 px-4 rounded-xl bg-[#e59500] hover:bg-[#c97d00] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Acknowledged by {currentUser.full_name}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setActiveCommentDiaryId(diary.id)}
                      className="py-2.5 px-4 rounded-xl bg-[#f2f7fa] hover:bg-[#e2eef5] border border-[#c6dfed] text-[#1e3f52] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-[#3b7a9e]" />
                      <span>Comments Drawer ({cmtCount})</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Outstanding Fee Balance & Invoice History */}
        <div className="bg-white rounded-3xl border-2 border-[#c6dfed] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3b7a9e]">
                School Fee Statement
              </span>
              <h3 className="font-display text-lg font-bold text-[#1e3f52]">
                Fee Balance &amp; Invoice History
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[11px] uppercase text-[#548eb0] font-bold block">
                Outstanding Balance
              </span>
              <span
                className={`font-display text-lg font-bold ${
                  totalBalance > 0 ? "text-[#e59500]" : "text-emerald-700"
                }`}
              >
                TZS {totalBalance.toLocaleString()}
              </span>
            </div>
          </div>

          {childInvoices.length === 0 ? (
            <p className="text-xs text-[#548eb0]">
              No fee invoices issued for {activeChild.pupil_name} yet.
            </p>
          ) : (
            <div className="space-y-2.5">
              {childInvoices.map((inv) => {
                const bal = Math.max(0, inv.amount - inv.amount_paid);
                return (
                  <div
                    key={inv.id}
                    className="p-3.5 rounded-2xl bg-[#f2f7fa] border border-[#c6dfed] flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-mono font-bold text-[#1e3f52]">
                        {inv.invoice_no} • Due {inv.due_date}
                      </p>
                      <p className="text-[#275169] mt-0.5">
                        Billed: TZS {inv.amount.toLocaleString()} | Paid: TZS{" "}
                        {inv.amount_paid.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          inv.status === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : inv.status === "partial"
                            ? "bg-[#fffbeb] text-[#a36102]"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {inv.status}
                      </span>
                      {bal > 0 && (
                        <p className="font-bold text-red-700 mt-1">
                          Bal: TZS {bal.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Weekly Progress Reports for Parent */}
        <div className="bg-white rounded-3xl border-2 border-[#c6dfed] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3b7a9e]">
                Developmental Milestones
              </span>
              <h3 className="font-display text-lg font-bold text-[#1e3f52]">
                Weekly Progress Reports ({childReports.length})
              </h3>
            </div>
            <FileCheck2 className="w-5 h-5 text-[#e59500]" />
          </div>

          {childReports.length === 0 ? (
            <p className="text-xs text-[#548eb0]">
              No weekly progress reports submitted yet.
            </p>
          ) : (
            childReports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 rounded-2xl bg-[#f2f7fa] border border-[#c6dfed] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between font-bold text-[#1e3f52]">
                  <span>Week Ending: {rep.week_ending}</span>
                  <span className="text-[#3b7a9e]">{rep.teacher_name}</span>
                </div>
                <p className="text-[#275169]">
                  <strong>Literacy &amp; Numeracy:</strong>{" "}
                  {rep.literacy_numeracy_notes}
                </p>
                <p className="text-[#275169]">
                  <strong>Social &amp; Emotional:</strong>{" "}
                  {rep.social_emotional_notes}
                </p>
                <p className="text-[#275169]">
                  <strong>Teacher&apos;s Remark:</strong> {rep.teacher_remark}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Comments Drawer Modal */}
        {activeDrawerDiary && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl border-2 border-[#7aa7c2] shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-[#e2eef5] pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#3b7a9e]">
                    Diary Comments Drawer • {activeDrawerDiary.entry_date}
                  </span>
                  <h4 className="font-bold text-[#1e3f52] text-base">
                    {activeDrawerDiary.pupil_name}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCommentDiaryId(null)}
                  className="p-1.5 rounded-xl bg-[#f2f7fa] hover:bg-[#e2eef5] text-[#1e3f52]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {activeDrawerComments.length === 0 ? (
                  <p className="text-xs text-[#548eb0] text-center py-6">
                    No comments yet. Send a note below—your child&apos;s Teacher
                    and Madam Elizabeth Nkya will receive an instant red
                    notification badge.
                  </p>
                ) : (
                  activeDrawerComments.map((cmt) => (
                    <div
                      key={cmt.id}
                      className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                        cmt.sender_role === "parent"
                          ? "bg-[#e2eef5] border border-[#9bc6de] ml-6"
                          : "bg-[#fffbeb] border border-[#fde58a] mr-6"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-[#1e3f52]">
                        <span>
                          {cmt.sender_name} ({cmt.sender_role.toUpperCase()})
                        </span>
                        <span className="text-[10px] text-[#548eb0] font-normal">
                          {new Date(cmt.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-[#132936] leading-relaxed">
                        {cmt.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handlePostComment} className="pt-2 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Write a note to the Teacher & Madam Elizabeth..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border-2 border-[#c6dfed] text-xs sm:text-sm focus:outline-none focus:border-[#3b7a9e]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#e59500] hover:bg-[#c97d00] text-white text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // TEACHER & ADMIN/OWNER VIEW
  // =========================================================================
  const visibleDiaries = diaries.filter((d) => d.class_key === activeStep);
  const visibleReports = weeklyReports.filter(
    (r) => r.class_key === activeStep
  );

  return (
    <div className="space-y-8">
      {/* Step Class Header / Switcher */}
      <div className="bg-white rounded-3xl border-2 border-[#c6dfed] p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#3b7a9e]">
            {isTeacher
              ? "Assigned Classroom RLS Scope"
              : "Owner & Admin Multi-Class Oversight"}
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1e3f52]">
            {STEP_META[activeStep].title}
          </h2>
        </div>

        {isAdminOrOwner ? (
          <div className="flex items-center gap-2">
            {(["step_1", "step_2", "step_3"] as StepClassKey[]).map((sk) => (
              <button
                key={sk}
                type="button"
                onClick={() => {
                  setSelectedStep(sk);
                  const firstPupil = pupils.find((p) => p.class_key === sk);
                  if (firstPupil) setReportPupilId(firstPupil.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                  activeStep === sk
                    ? "bg-[#1e3f52] text-[#fbd24d] border-[#1e3f52]"
                    : "bg-[#f2f7fa] text-[#275169] border-[#c6dfed] hover:bg-[#e2eef5]"
                }`}
              >
                {STEP_META[sk].shortLabel}
              </button>
            ))}
          </div>
        ) : (
          <span
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border ${STEP_META[activeStep].badgeColor}`}
          >
            Assigned to {STEP_META[activeStep].shortLabel} Only
          </span>
        )}
      </div>

      {diarySavedBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{diarySavedBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setDiarySavedBanner(null)}
            className="text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Teacher Class Pre-Fill + Individual Student Notes Composer */}
      <div className="bg-white rounded-3xl border-2 border-[#c6dfed] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e2eef5] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3b7a9e]">
              Daily Digital Diary Composer (Class Pre-Fill + Individual Notes)
            </span>
            <h3 className="font-display text-xl font-bold text-[#1e3f52]">
              Publish Daily Activities &amp; Homework for{" "}
              {STEP_META[activeStep].shortLabel}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#548eb0]">
            <Sparkles className="w-4 h-4 text-[#e59500]" /> Structured Text
          </span>
        </div>

        {classPupils.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#f2f7fa] border-2 border-dashed border-[#9bc6de] text-center space-y-2">
            <GraduationCap className="w-7 h-7 text-[#3b7a9e] mx-auto" />
            <p className="font-bold text-sm text-[#1e3f52]">
              No pupils enrolled in {STEP_META[activeStep].shortLabel} yet.
            </p>
            <p className="text-xs text-[#2f6280]">
              Once pupils are enrolled in {STEP_META[activeStep].shortLabel},
              their names will appear here for daily diary logging.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePrefillSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1e3f52] mb-1">
                  Diary Date *
                </label>
                <input
                  type="date"
                  required
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#c6dfed] text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#1e3f52] mb-1">
                  Class-Wide Homework (Pre-filled for all{" "}
                  {STEP_META[activeStep].shortLabel} pupils) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Practice counting 1 to 10 and review today's phonics sound..."
                  value={sharedHomework}
                  onChange={(e) => setSharedHomework(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#c6dfed] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1e3f52] mb-1">
                Class-Wide Activities Learned Today (Pre-fill Template) *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Describe what the class learned and practiced today..."
                value={sharedActivities}
                onChange={(e) => setSharedActivities(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#c6dfed] text-sm"
              />
            </div>

            {/* Individual Student Notes */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3b7a9e]">
                Individual Student Notes ({classPupils.length} Pupils in{" "}
                {STEP_META[activeStep].shortLabel})
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {classPupils.map((pupil) => (
                  <div
                    key={pupil.id}
                    className="p-3.5 rounded-2xl bg-[#f2f7fa] border border-[#c6dfed] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#1e3f52]">
                        {pupil.pupil_name}
                      </span>
                      <span className="text-[#3b7a9e]">
                        Parent: {pupil.parent_name}
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder={`Specific note for ${pupil.pupil_name} (optional)...`}
                      value={individualNotes[pupil.id] || ""}
                      onChange={(e) =>
                        setIndividualNotes((prev) => ({
                          ...prev,
                          [pupil.id]: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#c6dfed] bg-white text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#e59500] hover:bg-[#c97d00] text-white text-sm font-bold shadow-md transition-all"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>
                  Publish Diaries to All {STEP_META[activeStep].shortLabel}{" "}
                  Parents
                </span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Published Daily Diaries, Parent Sign-Off Status & Comments Drawer */}
      <div className="bg-white rounded-3xl border-2 border-[#c6dfed] p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3b7a9e]">
              Parent Sign-Offs &amp; Feedback
            </span>
            <h3 className="font-display text-xl font-bold text-[#1e3f52]">
              {STEP_META[activeStep].shortLabel} Daily Diaries (
              {visibleDiaries.length})
            </h3>
          </div>
          <UserCheck className="w-6 h-6 text-[#e59500]" />
        </div>

        {visibleDiaries.length === 0 ? (
          <p className="text-xs text-[#548eb0] py-4">
            No daily diaries published for {STEP_META[activeStep].shortLabel}{" "}
            yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {visibleDiaries.map((diary) => {
              const cmtCount = diaryComments.filter(
                (c) => c.diary_id === diary.id
              ).length;

              return (
                <div
                  key={diary.id}
                  className="p-5 rounded-2xl bg-[#f2f7fa] border border-[#c6dfed] flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-[#1e3f52] text-base">
                          {diary.pupil_name}
                        </h4>
                        <p className="text-xs text-[#548eb0]">
                          Entry Date: {diary.entry_date} • By{" "}
                          {diary.teacher_name}
                        </p>
                      </div>
                      {diary.parent_signed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Signed Off
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fffbeb] text-[#a36102] border border-[#fde58a] text-xs font-bold">
                          <Clock className="w-3.5 h-3.5" /> Unsigned
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#275169] leading-relaxed">
                      <strong>Activities:</strong> {diary.activities_learned}
                    </p>
                    <p className="text-xs text-[#275169] leading-relaxed">
                      <strong>Homework:</strong> {diary.homework}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#c6dfed] flex items-center justify-between">
                    <span className="text-[11px] text-[#548eb0]">
                      {diary.parent_signed && diary.parent_signed_at
                        ? `Signed at ${new Date(
                            diary.parent_signed_at
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : "Waiting for parent one-tap sign-off"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveCommentDiaryId(diary.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#e2eef5] border border-[#c6dfed] text-xs font-bold text-[#1e3f52]"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#3b7a9e]" />
                      <span>Comments ({cmtCount})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Weekly Progress Reports Section */}
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-[#c6dfed] p-6 shadow-sm space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3b7a9e]">
              Weekly Progress Reports
            </span>
            <h3 className="font-display text-xl font-bold text-[#1e3f52]">
              Submit Student Weekly Report
            </h3>
          </div>

          <form onSubmit={handleWeeklyReportSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#1e3f52] mb-1">
                Select Pupil ({STEP_META[activeStep].shortLabel}) *
              </label>
              <select
                value={reportPupilId}
                onChange={(e) => setReportPupilId(e.target.value)}
                disabled={classPupils.length === 0}
                className="w-full px-3.5 py-2 rounded-xl border-2 border-[#c6dfed] text-sm bg-white"
              >
                {classPupils.length === 0 ? (
                  <option value="">No pupils in this Step yet</option>
                ) : (
                  classPupils.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.pupil_name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1e3f52] mb-1">
                Week Ending Friday *
              </label>
              <input
                type="date"
                required
                value={weekEnding}
                onChange={(e) => setWeekEnding(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border-2 border-[#c6dfed] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1e3f52] mb-1">
                Literacy &amp; Numeracy Observations *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Phonics recognition, counting, motor control..."
                value={litNumNotes}
                onChange={(e) => setLitNumNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border-2 border-[#c6dfed] text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1e3f52] mb-1">
                Social &amp; Emotional Development *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Sharing, classroom confidence, group participation..."
                value={socialNotes}
                onChange={(e) => setSocialNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border-2 border-[#c6dfed] text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1e3f52] mb-1">
                Overall Teacher Remark *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Summary note for parent & Madam Elizabeth Nkya..."
                value={teacherRemark}
                onChange={(e) => setTeacherRemark(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border-2 border-[#c6dfed] text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={classPupils.length === 0}
              className="w-full py-3 rounded-xl bg-[#1e3f52] hover:bg-[#132936] disabled:opacity-50 text-white text-xs font-bold shadow-sm"
            >
              Submit Weekly Progress Report
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-[#c6dfed] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3b7a9e]">
                Submitted Reports Archive
              </span>
              <h3 className="font-display text-xl font-bold text-[#1e3f52]">
                {STEP_META[activeStep].shortLabel} Weekly Reports (
                {visibleReports.length})
              </h3>
            </div>
            <FileCheck2 className="w-5 h-5 text-[#e59500]" />
          </div>

          {visibleReports.length === 0 ? (
            <p className="text-xs text-[#548eb0] py-6">
              No weekly reports submitted for {STEP_META[activeStep].shortLabel}{" "}
              yet.
            </p>
          ) : (
            <div className="space-y-3">
              {visibleReports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-2xl bg-[#f2f7fa] border border-[#c6dfed] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-[#1e3f52]">
                        {rep.pupil_name}
                      </span>
                      <span className="text-[#548eb0] ml-2">
                        • Week Ending {rep.week_ending}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          rep.status === "reviewed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-[#fffbeb] text-[#a36102]"
                        }`}
                      >
                        {rep.status}
                      </span>
                      {isAdminOrOwner && rep.status !== "reviewed" && (
                        <button
                          type="button"
                          onClick={() => markWeeklyReportReviewed(rep.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#e59500] text-white text-[11px] font-bold"
                        >
                          Approve Report
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[#275169]">
                    <strong>Literacy &amp; Numeracy:</strong>{" "}
                    {rep.literacy_numeracy_notes}
                  </p>
                  <p className="text-[#275169]">
                    <strong>Social-Emotional:</strong>{" "}
                    {rep.social_emotional_notes}
                  </p>
                  <p className="text-[#275169]">
                    <strong>Teacher Remark ({rep.teacher_name}):</strong>{" "}
                    {rep.teacher_remark}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comments Drawer Modal for Teacher / Admin */}
      {activeDrawerDiary && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border-2 border-[#7aa7c2] shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#e2eef5] pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3b7a9e]">
                  Diary Discussion • {activeDrawerDiary.entry_date}
                </span>
                <h4 className="font-bold text-[#1e3f52] text-base">
                  {activeDrawerDiary.pupil_name}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveCommentDiaryId(null)}
                className="p-1.5 rounded-xl bg-[#f2f7fa] hover:bg-[#e2eef5] text-[#1e3f52]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {activeDrawerComments.length === 0 ? (
                <p className="text-xs text-[#548eb0] text-center py-6">
                  No parent comments on this diary entry yet.
                </p>
              ) : (
                activeDrawerComments.map((cmt) => (
                  <div
                    key={cmt.id}
                    className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                      cmt.sender_role === "parent"
                        ? "bg-[#fffbeb] border border-[#fde58a] mr-6"
                        : "bg-[#e2eef5] border border-[#9bc6de] ml-6"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-[#1e3f52]">
                      <span>
                        {cmt.sender_name} ({cmt.sender_role.toUpperCase()})
                      </span>
                      <span className="text-[10px] text-[#548eb0] font-normal">
                        {new Date(cmt.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-[#132936] leading-relaxed">
                      {cmt.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handlePostComment} className="pt-2 flex gap-2">
              <input
                type="text"
                required
                placeholder="Reply to parent comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border-2 border-[#c6dfed] text-xs sm:text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#1e3f52] hover:bg-[#132936] text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
