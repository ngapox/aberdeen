"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  GraduationCap,
  KeyRound,
  MessageSquareShare,
  Phone,
  PlusCircle,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { usePortal } from "./portal-context";
import { STEP_META, SCHOOL_CLASSES } from "@/lib/supabase/seed-data";
import { StepClassKey, UserRole } from "@/lib/supabase/types";

export function AccountsManager() {
  const {
    currentUser,
    profiles,
    pupils,
    teacherAssignments,
    provisionAccount,
    deleteProfile,
    deletePupil,
    updatePupilStep,
  } = usePortal();

  const isSecretary = currentUser.role === "secretary";
  const isOwnerOrAdmin =
    currentUser.role === "owner" || currentUser.role === "admin";

  const [accountRole, setAccountRole] = useState<UserRole>(
    isSecretary ? "parent" : "parent"
  );
  const [phoneNumber, setPhoneNumber] = useState("+255");
  const [fullName, setFullName] = useState("");
  const [pupilName, setPupilName] = useState("");
  const [stepClass, setStepClass] = useState<StepClassKey>("step_1");
  const [tempPassword, setTempPassword] = useState("Aberdeen2026!");
  const [sendWelcomeSms, setSendWelcomeSms] = useState(true);
  const [stepFilter, setStepFilter] = useState<"all" | StepClassKey>("all");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSubmitting(true);

    try {
      const res = await provisionAccount({
        role: isSecretary ? "parent" : accountRole,
        phoneNumber,
        fullName,
        pupilName:
          isSecretary || accountRole === "parent" ? pupilName : undefined,
        stepClass:
          isSecretary || accountRole === "parent" || accountRole === "teacher"
            ? stepClass
            : undefined,
        tempPassword,
        sendWelcomeSms,
      });

      if (!res.ok) {
        setFeedback({
          type: "error",
          message: res.error || "Could not provision account.",
        });
      } else {
        setFeedback({
          type: "success",
          message:
            accountRole === "parent" || isSecretary
              ? `Registered Pupil Account for ${pupilName} (Parent: ${fullName}, ${phoneNumber}) in ${STEP_META[stepClass].shortLabel}${
                  sendWelcomeSms ? " and dispatched Welcome SMS!" : "!"
                }`
              : `Created ${accountRole.toUpperCase()} account for ${fullName} (${phoneNumber})${
                  sendWelcomeSms ? " and dispatched Welcome SMS!" : "!"
                }`,
        });
        setPhoneNumber("+255");
        setFullName("");
        setPupilName("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getTeacherStepLabel = (teacherId: string) => {
    const ta = teacherAssignments.find((t) => t.teacher_id === teacherId);
    if (!ta) return "Unassigned";
    const cls = SCHOOL_CLASSES.find((c) => c.id === ta.class_id);
    return cls ? STEP_META[cls.name].shortLabel : "Unassigned";
  };

  const filteredPupils =
    stepFilter === "all"
      ? pupils
      : pupils.filter((p) => p.class_key === stepFilter);

  return (
    <div className="space-y-8">
      {/* Account Provisioning Form */}
      <div className="bg-white rounded-3xl border-2 border-[#c6dfed] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2eef5] pb-5 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3b7a9e]">
              {isSecretary
                ? "Secretary Admissions Desk"
                : "Owner & Admin Account Provisioning"}
            </span>
            <h2 className="font-display text-2xl font-bold text-[#1e3f52] mt-0.5">
              {isSecretary
                ? "Register New Pupil & Parent Account (+255)"
                : "Create Staff, Teacher or Pupil/Parent Account"}
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f2f7fa] border border-[#c6dfed] text-xs font-bold text-[#1e3f52]">
            <Phone className="w-3.5 h-3.5 text-[#e59500]" /> Strict +255XXXXXXXXX Format
          </span>
        </div>

        <form onSubmit={handleCreateAccount} className="space-y-5">
          {!isSecretary && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#275169] mb-2">
                1. Choose Account Type to Create
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {(
                  [
                    { role: "parent", label: "Pupil / Parent" },
                    { role: "teacher", label: "Step Teacher" },
                    { role: "secretary", label: "Secretary" },
                    { role: "admin", label: "Admin" },
                    { role: "owner", label: "Co-Owner" },
                  ] as { role: UserRole; label: string }[]
                ).map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setAccountRole(item.role)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border-2 transition-all ${
                      accountRole === item.role
                        ? "bg-[#1e3f52] text-[#fbd24d] border-[#1e3f52] shadow-sm"
                        : "bg-[#f2f7fa] text-[#275169] border-[#c6dfed] hover:bg-[#e2eef5]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1e3f52] mb-1">
                {accountRole === "parent" || isSecretary
                  ? "Parent's Phone Number (+255XXXXXXXXX) *"
                  : `${accountRole.toUpperCase()} Phone Number (+255XXXXXXXXX) *`}
              </label>
              <input
                type="tel"
                required
                placeholder="+255716004601"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#c6dfed] font-mono text-sm focus:outline-none focus:border-[#3b7a9e]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1e3f52] mb-1">
                {accountRole === "parent" || isSecretary
                  ? "Parent / Guardian's Full Name *"
                  : "Staff Member's Full Name *"}
              </label>
              <input
                type="text"
                required
                placeholder={
                  accountRole === "parent" || isSecretary
                    ? "e.g. Mama / Baba ..."
                    : "e.g. Madam / Mwl. ..."
                }
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#c6dfed] text-sm focus:outline-none focus:border-[#3b7a9e]"
              />
            </div>

            {(accountRole === "parent" || isSecretary) && (
              <div>
                <label className="block text-xs font-bold text-[#1e3f52] mb-1">
                  Pupil&apos;s Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Child's Full Name"
                  value={pupilName}
                  onChange={(e) => setPupilName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#c6dfed] text-sm focus:outline-none focus:border-[#3b7a9e]"
                />
              </div>
            )}

            {(accountRole === "parent" ||
              accountRole === "teacher" ||
              isSecretary) && (
              <div>
                <label className="block text-xs font-bold text-[#1e3f52] mb-1">
                  Assigned Developmental Class (Step 1 / 2 / 3) *
                </label>
                <select
                  value={stepClass}
                  onChange={(e) =>
                    setStepClass(e.target.value as StepClassKey)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#c6dfed] text-sm bg-white focus:outline-none focus:border-[#3b7a9e]"
                >
                  <option value="step_1">
                    Step 1 (Daycare / Early Toddler)
                  </option>
                  <option value="step_2">
                    Step 2 (Nursery / Mid Toddler)
                  </option>
                  <option value="step_3">
                    Step 3 (Pre-Unit / Transition to Primary)
                  </option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#1e3f52] mb-1">
                Initial Login Password / PIN *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#548eb0] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border-2 border-[#c6dfed] text-sm font-mono focus:outline-none focus:border-[#3b7a9e]"
                />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-[#fffbeb] border border-[#fde58a] cursor-pointer">
            <input
              type="checkbox"
              checked={sendWelcomeSms}
              onChange={(e) => setSendWelcomeSms(e.target.checked)}
              className="rounded border-[#e59500] text-[#3b7a9e] focus:ring-[#3b7a9e]"
            />
            <span className="text-xs font-semibold text-[#1e3f52] flex items-center gap-1.5">
              <MessageSquareShare className="w-4 h-4 text-[#e59500]" />
              Send Welcome SMS via Beem Africa to this +255 number upon creation
            </span>
          </label>

          {feedback && (
            <div
              className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedback.message}</span>
            </div>
          )}

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#e59500] hover:bg-[#c97d00] text-white text-sm font-bold shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>
                {submitting
                  ? "Creating Account..."
                  : isSecretary || accountRole === "parent"
                  ? "Register Pupil & Parent Account"
                  : `Create ${accountRole.toUpperCase()} Account`}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Enrolled Pupils Directory */}
      <div className="bg-white rounded-3xl border-2 border-[#c6dfed] p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3b7a9e]">
              Enrolled Student Roster
            </span>
            <h3 className="font-display text-xl font-bold text-[#1e3f52]">
              Pupils &amp; Linked Parent Accounts ({filteredPupils.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {(["all", "step_1", "step_2", "step_3"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setStepFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  stepFilter === f
                    ? "bg-[#1e3f52] text-white border-[#1e3f52]"
                    : "bg-[#f2f7fa] text-[#275169] border-[#c6dfed] hover:bg-[#e2eef5]"
                }`}
              >
                {f === "all" ? "All Steps" : STEP_META[f].shortLabel}
              </button>
            ))}
          </div>
        </div>

        {filteredPupils.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#f2f7fa] border-2 border-dashed border-[#9bc6de] text-center space-y-2">
            <GraduationCap className="w-8 h-8 text-[#3b7a9e] mx-auto" />
            <p className="font-bold text-sm text-[#1e3f52]">
              No pupils registered yet.
            </p>
            <p className="text-xs text-[#2f6280] max-w-md mx-auto">
              Use the form above to enroll your first pupil—storing both the
              Pupil&apos;s Full Name, Parent/Guardian&apos;s Full Name, and
              Parent&apos;s <code className="font-mono">+255</code> phone number.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-[#e2eef5] text-xs uppercase tracking-wider text-[#3b7a9e]">
                  <th className="py-3 px-3">Pupil Full Name</th>
                  <th className="py-3 px-3">Parent / Guardian Name</th>
                  <th className="py-3 px-3">Parent Phone (+255)</th>
                  <th className="py-3 px-3">Assigned Step Class</th>
                  <th className="py-3 px-3">Enrolled</th>
                  <th className="py-3 px-3 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2eef5]">
                {filteredPupils.map((p) => (
                  <tr key={p.id} className="hover:bg-[#f2f7fa]">
                    <td className="py-3.5 px-3 font-bold text-[#1e3f52]">
                      {p.pupil_name}
                    </td>
                    <td className="py-3.5 px-3 text-[#275169] font-semibold">
                      {p.parent_name}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-xs text-[#3b7a9e]">
                      {p.parent_phone}
                    </td>
                    <td className="py-3.5 px-3">
                      <select
                        aria-label="Change pupil step class"
                        value={p.class_key}
                        onChange={(e) =>
                          updatePupilStep(p.id, e.target.value as StepClassKey)
                        }
                        className="px-2.5 py-1 rounded-xl text-xs font-bold border border-[#c6dfed] bg-white text-[#1e3f52]"
                      >
                        <option value="step_1">Step 1 • Daycare</option>
                        <option value="step_2">Step 2 • Nursery</option>
                        <option value="step_3">Step 3 • Pre-Unit</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-3 text-xs text-[#548eb0]">
                      {p.enrollment_date}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {isOwnerOrAdmin && (
                        <button
                          type="button"
                          onClick={() => deletePupil(p.id)}
                          title="Remove Pupil"
                          className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Staff & Teachers Directory */}
      <div className="bg-white rounded-3xl border-2 border-[#c6dfed] p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3b7a9e]">
              Staff &amp; Educators
            </span>
            <h3 className="font-display text-xl font-bold text-[#1e3f52]">
              Provisioned Staff &amp; Teacher Accounts (
              {profiles.filter((p) => p.role !== "parent").length})
            </h3>
          </div>
          <Users className="w-6 h-6 text-[#e59500]" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles
            .filter((p) => p.role !== "parent")
            .map((staff) => (
              <div
                key={staff.id}
                className="p-4 rounded-2xl bg-[#f2f7fa] border-2 border-[#c6dfed] flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-[#1e3f52] text-sm">
                      {staff.full_name}
                    </h4>
                    <p className="font-mono text-xs text-[#3b7a9e] mt-0.5">
                      {staff.phone_number}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1e3f52] text-[#fbd24d] text-[10px] font-bold uppercase">
                      {staff.role}
                    </span>
                    {isOwnerOrAdmin && staff.id !== "usr-owner-1" && (
                      <button
                        type="button"
                        onClick={() => deleteProfile(staff.id)}
                        title="Remove Account"
                        className="p-1 rounded-lg text-stone-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {staff.role === "teacher" ? (
                  <div className="pt-2 border-t border-[#c6dfed] flex items-center justify-between text-xs">
                    <span className="text-[#548eb0]">Assigned Class:</span>
                    <span className="font-bold text-[#1e3f52]">
                      {getTeacherStepLabel(staff.id)}
                    </span>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-[#c6dfed] flex items-center gap-1.5 text-xs text-[#275169] font-medium">
                    <Shield className="w-3.5 h-3.5 text-[#e59500]" />
                    <span>Beem SMS &amp; Invoice Authorized</span>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
