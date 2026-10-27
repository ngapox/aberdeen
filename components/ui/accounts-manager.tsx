"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  GraduationCap,
  Phone,
  PlusCircle,
  Shield,
  UserCheck,
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
  } = usePortal();

  const isSecretary = currentUser.role === "secretary";

  const [accountRole, setAccountRole] = useState<UserRole>(
    isSecretary ? "parent" : "parent"
  );
  const [phoneNumber, setPhoneNumber] = useState("+255754");
  const [fullName, setFullName] = useState("");
  const [pupilName, setPupilName] = useState("");
  const [stepClass, setStepClass] = useState<StepClassKey>("step_1");
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
          (isSecretary || accountRole === "parent") ? pupilName : undefined,
        stepClass:
          isSecretary || accountRole === "parent" || accountRole === "teacher"
            ? stepClass
            : undefined,
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
              ? `Provisioned Pupil Account for ${pupilName} (Parent: ${fullName}, ${phoneNumber}) in ${STEP_META[stepClass].shortLabel}.`
              : `Provisioned ${accountRole.toUpperCase()} account for ${fullName} (${phoneNumber}).`,
        });
        setPhoneNumber("+255754");
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

  return (
    <div className="space-y-8">
      {/* Account Provisioning Form */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-aberdeen-700">
              {isSecretary
                ? "Secretary Admissions Desk"
                : "Admin & Owner Account Provisioning"}
            </span>
            <h2 className="font-display text-2xl font-bold text-stone-900 mt-0.5">
              {isSecretary
                ? "Register New Pupil & Parent Account (+255)"
                : "Create & Assign Staff, Teacher or Pupil Account"}
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-aberdeen-50 border border-aberdeen-200 text-xs font-semibold text-aberdeen-800">
            <Phone className="w-3.5 h-3.5" /> Strict +255XXXXXXXXX Identification
          </span>
        </div>

        <form onSubmit={handleCreateAccount} className="space-y-5">
          {!isSecretary && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                Select Account Type to Provision
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {(
                  [
                    { role: "parent", label: "Pupil / Parent" },
                    { role: "teacher", label: "Step Teacher" },
                    { role: "secretary", label: "Secretary" },
                    { role: "admin", label: "Admin" },
                    { role: "owner", label: "Owner / CEO" },
                  ] as { role: UserRole; label: string }[]
                ).map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setAccountRole(item.role)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      accountRole === item.role
                        ? "bg-aberdeen-800 text-white border-aberdeen-800 shadow-sm"
                        : "bg-[#faf8f4] text-stone-700 border-stone-200 hover:bg-stone-100"
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
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {accountRole === "parent" || isSecretary
                  ? "Parent's Phone Number (+255XXXXXXXXX) *"
                  : `${accountRole.toUpperCase()} Phone Number (+255XXXXXXXXX) *`}
              </label>
              <input
                type="tel"
                required
                placeholder="+255754123456"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-aberdeen-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {accountRole === "parent" || isSecretary
                  ? "Parent / Guardian's Full Name *"
                  : "Staff Member's Full Name *"}
              </label>
              <input
                type="text"
                required
                placeholder={
                  accountRole === "parent" || isSecretary
                    ? "e.g. Bw. Josephat Mushi"
                    : "e.g. Mwl. Neema Paulo"
                }
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-aberdeen-600"
              />
            </div>

            {(accountRole === "parent" || isSecretary) && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Pupil&apos;s Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Josephat Mushi"
                  value={pupilName}
                  onChange={(e) => setPupilName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-aberdeen-600"
                />
              </div>
            )}

            {(accountRole === "parent" ||
              accountRole === "teacher" ||
              isSecretary) && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Assigned Developmental Class (Step 1 / 2 / 3) *
                </label>
                <select
                  value={stepClass}
                  onChange={(e) =>
                    setStepClass(e.target.value as StepClassKey)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-aberdeen-600"
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
          </div>

          {feedback && (
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-aberdeen-800 hover:bg-aberdeen-900 text-white text-sm font-semibold shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>
                {submitting
                  ? "Provisioning..."
                  : isSecretary || accountRole === "parent"
                  ? "Register Pupil & Parent Account"
                  : `Create ${accountRole.toUpperCase()} Account`}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Enrolled Pupils Directory (Shows both Pupil Name & Parent Name + Phone + Step) */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-aberdeen-700">
              Enrolled Student Roster
            </span>
            <h3 className="font-display text-xl font-bold text-stone-900">
              Pupils &amp; Linked Parent Accounts ({pupils.length})
            </h3>
          </div>
          <GraduationCap className="w-6 h-6 text-aberdeen-700" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase tracking-wider text-stone-500">
                <th className="py-3 px-3">Pupil Full Name</th>
                <th className="py-3 px-3">Parent / Guardian Name</th>
                <th className="py-3 px-3">Parent Phone (+255)</th>
                <th className="py-3 px-3">Assigned Step Class</th>
                <th className="py-3 px-3">Enrolled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {pupils.map((p) => (
                <tr key={p.id} className="hover:bg-[#faf8f4]">
                  <td className="py-3.5 px-3 font-bold text-stone-900">
                    {p.pupil_name}
                  </td>
                  <td className="py-3.5 px-3 text-stone-700 font-medium">
                    {p.parent_name}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-xs text-stone-600">
                    {p.parent_phone}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        STEP_META[p.class_key].badgeColor
                      }`}
                    >
                      {STEP_META[p.class_key].shortLabel}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-xs text-stone-500">
                    {p.enrollment_date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff & Teachers Directory */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-aberdeen-700">
              Staff &amp; Educators
            </span>
            <h3 className="font-display text-xl font-bold text-stone-900">
              Provisioned Staff &amp; Teacher Accounts
            </h3>
          </div>
          <Users className="w-6 h-6 text-aberdeen-700" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles
            .filter((p) => p.role !== "parent")
            .map((staff) => (
              <div
                key={staff.id}
                className="p-4 rounded-2xl bg-[#faf8f4] border border-stone-200 flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {staff.full_name}
                    </h4>
                    <p className="font-mono text-xs text-stone-600 mt-0.5">
                      {staff.phone_number}
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-aberdeen-100 text-aberdeen-800 text-[11px] font-bold uppercase">
                    {staff.role}
                  </span>
                </div>

                {staff.role === "teacher" ? (
                  <div className="pt-2 border-t border-stone-200/70 flex items-center justify-between text-xs">
                    <span className="text-stone-500">Assigned Class:</span>
                    <span className="font-bold text-emerald-800">
                      {getTeacherStepLabel(staff.id)}
                    </span>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-stone-200/70 flex items-center gap-1.5 text-xs text-stone-500">
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
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
