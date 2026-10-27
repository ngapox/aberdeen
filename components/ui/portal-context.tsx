"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AppNotification,
  DailyDiary,
  DiaryComment,
  ForumPost,
  Invoice,
  InvoiceStatus,
  Profile,
  Pupil,
  StepClassKey,
  TeacherAssignment,
  UserRole,
  WeeklyReport,
} from "@/lib/supabase/types";
import {
  INITIAL_DIARIES,
  INITIAL_DIARY_COMMENTS,
  INITIAL_FORUM_POSTS,
  INITIAL_INVOICES,
  INITIAL_NOTIFICATIONS,
  INITIAL_PROFILES,
  INITIAL_PUPILS,
  INITIAL_TEACHER_ASSIGNMENTS,
  INITIAL_WEEKLY_REPORTS,
  SCHOOL_CLASSES,
} from "@/lib/supabase/seed-data";

export interface SmsDispatchLog {
  id: string;
  sentAt: string;
  senderName: string;
  senderRole: UserRole;
  recipients: string[];
  message: string;
  templateType: "invoice" | "broadcast" | "custom";
  simulated: boolean;
}

interface PortalContextValue {
  currentUser: Profile;
  profiles: Profile[];
  teacherAssignments: TeacherAssignment[];
  pupils: Pupil[];
  invoices: Invoice[];
  diaries: DailyDiary[];
  diaryComments: DiaryComment[];
  weeklyReports: WeeklyReport[];
  forumPosts: ForumPost[];
  notifications: AppNotification[];
  smsLogs: SmsDispatchLog[];

  // Auth & Role Switcher
  switchUserById: (userId: string) => void;
  loginByPhone: (phoneNumber: string) => { ok: boolean; error?: string };

  // Derived RBAC helpers for currentUser
  assignedTeacherStep: StepClassKey | null;
  parentPupils: Pupil[];
  unreadNotificationCount: number;
  userNotifications: AppNotification[];

  // Actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  provisionAccount: (input: {
    role: UserRole;
    phoneNumber: string;
    fullName: string;
    pupilName?: string;
    stepClass?: StepClassKey;
    tempPassword?: string;
    sendWelcomeSms?: boolean;
  }) => Promise<{ ok: boolean; error?: string }>;

  deleteProfile: (profileId: string) => void;
  deletePupil: (pupilId: string) => void;
  updatePupilStep: (pupilId: string, newStep: StepClassKey) => void;

  createInvoice: (input: {
    pupilId: string;
    amount: number;
    dueDate: string;
    sendSms: boolean;
  }) => Promise<{ ok: boolean; invoiceNo?: string; error?: string }>;

  recordInvoicePayment: (invoiceId: string, additionalPaid: number) => void;
  deleteInvoice: (invoiceId: string) => void;

  sendInvoiceAlertAndSms: (invoiceId: string) => Promise<{
    ok: boolean;
    messageDispatched?: string;
    error?: string;
  }>;

  sendBroadcastSms: (input: {
    recipients: string[];
    subject: string;
    messageBody: string;
    parentName?: string;
  }) => Promise<{ ok: boolean; messageDispatched?: string; error?: string }>;

  upsertDailyDiary: (input: {
    pupilId: string;
    entryDate: string;
    activitiesLearned: string;
    homework: string;
  }) => void;

  prefillClassDiaries: (input: {
    stepClass: StepClassKey;
    entryDate: string;
    sharedActivities: string;
    sharedHomework: string;
    individualNotes: Record<string, string>;
  }) => void;

  signOffDiary: (diaryId: string) => void;

  addDiaryComment: (diaryId: string, commentText: string) => void;

  submitWeeklyReport: (input: {
    pupilId: string;
    weekEnding: string;
    literacyNumeracyNotes: string;
    socialEmotionalNotes: string;
    teacherRemark: string;
  }) => void;

  markWeeklyReportReviewed: (reportId: string) => void;

  createForumPost: (input: {
    classKey: StepClassKey | null;
    title: string;
    content: string;
  }) => void;

  deleteForumPost: (postId: string) => void;
}

const STORAGE_KEY = "aberdeen_portal_clean_v1";

const PortalContext = createContext<PortalContextValue | undefined>(undefined);

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [currentUserId, setCurrentUserId] = useState<string>("usr-owner-1");
  const [teacherAssignments, setTeacherAssignments] = useState<
    TeacherAssignment[]
  >(INITIAL_TEACHER_ASSIGNMENTS);
  const [pupils, setPupils] = useState<Pupil[]>(INITIAL_PUPILS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [diaries, setDiaries] = useState<DailyDiary[]>(INITIAL_DIARIES);
  const [diaryComments, setDiaryComments] = useState<DiaryComment[]>(
    INITIAL_DIARY_COMMENTS
  );
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>(
    INITIAL_WEEKLY_REPORTS
  );
  const [forumPosts, setForumPosts] =
    useState<ForumPost[]>(INITIAL_FORUM_POSTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(
    INITIAL_NOTIFICATIONS
  );
  const [smsLogs, setSmsLogs] = useState<SmsDispatchLog[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate persisted state from localStorage so real records created by Madam Elizabeth stay saved
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
          setProfiles(parsed.profiles);
        }
        if (Array.isArray(parsed.teacherAssignments)) {
          setTeacherAssignments(parsed.teacherAssignments);
        }
        if (Array.isArray(parsed.pupils)) {
          setPupils(parsed.pupils);
        }
        if (Array.isArray(parsed.invoices)) {
          setInvoices(parsed.invoices);
        }
        if (Array.isArray(parsed.diaries)) {
          setDiaries(parsed.diaries);
        }
        if (Array.isArray(parsed.diaryComments)) {
          setDiaryComments(parsed.diaryComments);
        }
        if (Array.isArray(parsed.weeklyReports)) {
          setWeeklyReports(parsed.weeklyReports);
        }
        if (Array.isArray(parsed.forumPosts)) {
          setForumPosts(parsed.forumPosts);
        }
        if (Array.isArray(parsed.notifications)) {
          setNotifications(parsed.notifications);
        }
        if (Array.isArray(parsed.smsLogs)) {
          setSmsLogs(parsed.smsLogs);
        }
      }
      const savedUser = sessionStorage.getItem("aberdeen_active_user_id");
      if (savedUser) {
        setCurrentUserId(savedUser);
      }
    } catch {
      // Ignore storage errors
    } finally {
      setHydrated(true);
    }
  }, []);

  // Save state whenever records change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          profiles,
          teacherAssignments,
          pupils,
          invoices,
          diaries,
          diaryComments,
          weeklyReports,
          forumPosts,
          notifications,
          smsLogs,
        })
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [
    hydrated,
    profiles,
    teacherAssignments,
    pupils,
    invoices,
    diaries,
    diaryComments,
    weeklyReports,
    forumPosts,
    notifications,
    smsLogs,
  ]);

  const currentUser =
    profiles.find((p) => p.id === currentUserId) || profiles[0];

  const switchUserById = (userId: string) => {
    if (profiles.some((p) => p.id === userId)) {
      setCurrentUserId(userId);
      sessionStorage.setItem("aberdeen_active_user_id", userId);
    }
  };

  const loginByPhone = (phoneNumber: string) => {
    const normalized = phoneNumber.trim();
    const matched = profiles.find((p) => p.phone_number === normalized);
    if (!matched) {
      return {
        ok: false,
        error:
          "No account found for this +255 phone number. Accounts must be registered by Madam Elizabeth Nkya (Owner), Admin, or Secretary.",
      };
    }
    switchUserById(matched.id);
    return { ok: true };
  };

  const assignedTeacherStep: StepClassKey | null = React.useMemo(() => {
    if (currentUser.role !== "teacher") return null;
    const assignment = teacherAssignments.find(
      (ta) => ta.teacher_id === currentUser.id
    );
    if (!assignment) return "step_1";
    const cls = SCHOOL_CLASSES.find((c) => c.id === assignment.class_id);
    return cls ? cls.name : "step_1";
  }, [currentUser, teacherAssignments]);

  const parentPupils: Pupil[] = React.useMemo(() => {
    if (currentUser.role !== "parent") return [];
    return pupils.filter(
      (p) => p.parent_id === currentUser.id && p.is_active
    );
  }, [currentUser, pupils]);

  const userNotifications = React.useMemo(() => {
    return notifications
      .filter((n) => n.recipient_id === currentUser.id)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }, [notifications, currentUser.id]);

  const unreadNotificationCount = React.useMemo(() => {
    return userNotifications.filter((n) => !n.is_read).length;
  }, [userNotifications]);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.recipient_id === currentUser.id ? { ...n, is_read: true } : n
      )
    );
  };

  const provisionAccount = async (input: {
    role: UserRole;
    phoneNumber: string;
    fullName: string;
    pupilName?: string;
    stepClass?: StepClassKey;
    tempPassword?: string;
    sendWelcomeSms?: boolean;
  }) => {
    const cleanPhone = input.phoneNumber.trim();
    if (!/^\+255\d{9}$/.test(cleanPhone)) {
      return {
        ok: false,
        error: "Phone number must strictly follow +255XXXXXXXXX (12 digits with +).",
      };
    }

    const res = await fetch("/api/accounts/provision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        actorRole: currentUser.role,
        accountType: input.role,
        phoneNumber: cleanPhone,
        fullName: input.fullName.trim(),
        pupilName: input.pupilName?.trim(),
        assignedClass: input.stepClass,
        tempPassword: input.tempPassword || "Aberdeen2026!",
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: data.error || "Failed to provision account" };
    }

    let targetProfile = profiles.find((p) => p.phone_number === cleanPhone);
    const newUserId =
      data.userId || (targetProfile ? targetProfile.id : `usr-${Date.now()}`);

    if (!targetProfile) {
      targetProfile = {
        id: newUserId,
        phone_number: cleanPhone,
        full_name: input.fullName.trim(),
        role: input.role,
        created_at: new Date().toISOString(),
      };
      setProfiles((prev) => [...prev, targetProfile!]);
    }

    if (input.role === "teacher" && input.stepClass) {
      const cls = SCHOOL_CLASSES.find((c) => c.name === input.stepClass)!;
      setTeacherAssignments((prev) => [
        ...prev.filter((ta) => ta.teacher_id !== newUserId),
        {
          id: `ta-${Date.now()}`,
          teacher_id: newUserId,
          class_id: cls.id,
        },
      ]);
    }

    if (input.role === "parent" && input.pupilName && input.stepClass) {
      const cls = SCHOOL_CLASSES.find((c) => c.name === input.stepClass)!;
      const newPupil: Pupil = {
        id: `pup-${Date.now()}`,
        pupil_name: input.pupilName.trim(),
        parent_id: newUserId,
        parent_name: input.fullName.trim(),
        parent_phone: cleanPhone,
        class_id: cls.id,
        class_key: input.stepClass,
        enrollment_date: new Date().toISOString().split("T")[0],
        is_active: true,
      };
      setPupils((prev) => [newPupil, ...prev]);

      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          recipient_id: newUserId,
          title: `Welcome to Aberdeen • ${newPupil.pupil_name}`,
          message: `${newPupil.pupil_name} is enrolled in ${cls.display_name}. Step by Step, the child is prospering!`,
          is_read: false,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    // Optional Welcome SMS via Beem Africa
    if (input.sendWelcomeSms) {
      const welcomeMsg =
        input.role === "parent"
          ? `Karibu Aberdeen Daycare & Nursery, ${input.fullName.trim()}! Akaunti ya ${input.pupilName?.trim()} imefunguliwa. Namba ya kuingia: ${cleanPhone}. Asante - Madam Elizabeth Nkya.`
          : `Karibu Aberdeen Daycare & Nursery, ${input.fullName.trim()}! Akaunti yako ya (${input.role.toUpperCase()}) imefunguliwa kwa namba ${cleanPhone}.`;

      const smsRes = await fetch("/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: currentUser.role,
          templateType: "custom",
          recipients: [cleanPhone],
          customMessage: welcomeMsg,
        }),
      });
      const smsData = await smsRes.json();
      if (smsRes.ok && smsData.messageDispatched) {
        setSmsLogs((prev) => [
          {
            id: `sms-${Date.now()}`,
            sentAt: new Date().toISOString(),
            senderName: currentUser.full_name,
            senderRole: currentUser.role,
            recipients: [cleanPhone],
            message: smsData.messageDispatched,
            templateType: "custom",
            simulated: Boolean(smsData.simulated),
          },
          ...prev,
        ]);
      }
    }

    return { ok: true };
  };

  const deleteProfile = (profileId: string) => {
    if (profileId === "usr-owner-1") return; // Protect primary Owner account
    setProfiles((prev) => prev.filter((p) => p.id !== profileId));
    setTeacherAssignments((prev) =>
      prev.filter((ta) => ta.teacher_id !== profileId)
    );
    setPupils((prev) => prev.filter((p) => p.parent_id !== profileId));
    if (currentUserId === profileId) {
      setCurrentUserId("usr-owner-1");
    }
  };

  const deletePupil = (pupilId: string) => {
    setPupils((prev) => prev.filter((p) => p.id !== pupilId));
    setInvoices((prev) => prev.filter((i) => i.pupil_id !== pupilId));
    setDiaries((prev) => prev.filter((d) => d.pupil_id !== pupilId));
    setWeeklyReports((prev) => prev.filter((r) => r.pupil_id !== pupilId));
  };

  const updatePupilStep = (pupilId: string, newStep: StepClassKey) => {
    const cls = SCHOOL_CLASSES.find((c) => c.name === newStep);
    if (!cls) return;
    setPupils((prev) =>
      prev.map((p) =>
        p.id === pupilId ? { ...p, class_id: cls.id, class_key: newStep } : p
      )
    );
  };

  const createInvoice = async (input: {
    pupilId: string;
    amount: number;
    dueDate: string;
    sendSms: boolean;
  }) => {
    const pupil = pupils.find((p) => p.id === input.pupilId);
    if (!pupil) return { ok: false, error: "Please select an enrolled pupil first." };

    const invoiceNo = `ABD-${new Date().getFullYear()}-${String(
      invoices.length + 101
    ).padStart(3, "0")}`;
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoice_no: invoiceNo,
      pupil_id: pupil.id,
      pupil_name: pupil.pupil_name,
      parent_name: pupil.parent_name,
      parent_phone: pupil.parent_phone,
      class_key: pupil.class_key,
      amount: input.amount,
      amount_paid: 0,
      status: "pending",
      due_date: input.dueDate,
      created_by: currentUser.id,
      created_at: new Date().toISOString(),
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-inv-${Date.now()}`,
        recipient_id: pupil.parent_id,
        title: `New Fee Invoice Issued (${invoiceNo})`,
        message: `Habari ${pupil.parent_name}, invoice ${invoiceNo} for ${pupil.pupil_name} of TZS ${input.amount.toLocaleString()} is due on ${input.dueDate}.`,
        is_read: false,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    if (input.sendSms) {
      const smsRes = await fetch("/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: currentUser.role,
          templateType: "invoice",
          recipients: [pupil.parent_phone],
          invoiceParams: {
            parentName: pupil.parent_name,
            pupilName: pupil.pupil_name,
            amount: input.amount,
            invoiceNo,
            dueDate: input.dueDate,
          },
        }),
      });
      const smsData = await smsRes.json();
      if (smsRes.ok && smsData.messageDispatched) {
        setSmsLogs((prev) => [
          {
            id: `sms-${Date.now()}`,
            sentAt: new Date().toISOString(),
            senderName: currentUser.full_name,
            senderRole: currentUser.role,
            recipients: [pupil.parent_phone],
            message: smsData.messageDispatched,
            templateType: "invoice",
            simulated: Boolean(smsData.simulated),
          },
          ...prev,
        ]);
      }
    }

    return { ok: true, invoiceNo };
  };

  const recordInvoicePayment = (invoiceId: string, additionalPaid: number) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const updatedPaid = Math.min(inv.amount, inv.amount_paid + additionalPaid);
        let status: InvoiceStatus = "pending";
        if (updatedPaid >= inv.amount) status = "paid";
        else if (updatedPaid > 0) status = "partial";

        const pupil = pupils.find((p) => p.id === inv.pupil_id);
        if (pupil) {
          setNotifications((nPrev) => [
            {
              id: `notif-pay-${Date.now()}`,
              recipient_id: pupil.parent_id,
              title: `Payment Recorded • ${inv.invoice_no}`,
              message: `TZS ${additionalPaid.toLocaleString()} received for ${inv.pupil_name}. Status: ${status.toUpperCase()}.`,
              is_read: false,
              created_at: new Date().toISOString(),
            },
            ...nPrev,
          ]);
        }

        return {
          ...inv,
          amount_paid: updatedPaid,
          status,
        };
      })
    );
  };

  const deleteInvoice = (invoiceId: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
  };

  const sendInvoiceAlertAndSms = async (invoiceId: string) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return { ok: false, error: "Invoice not found" };

    const pupil = pupils.find((p) => p.id === inv.pupil_id);
    const outstanding = Math.max(0, inv.amount - inv.amount_paid);

    const res = await fetch("/api/sms/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: currentUser.role,
        templateType: "invoice",
        recipients: [inv.parent_phone],
        invoiceParams: {
          parentName: inv.parent_name,
          pupilName: inv.pupil_name,
          amount: outstanding > 0 ? outstanding : inv.amount,
          invoiceNo: inv.invoice_no,
          dueDate: inv.due_date,
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: data.error || "SMS gateway error" };
    }

    if (pupil) {
      setNotifications((prev) => [
        {
          id: `notif-alert-${Date.now()}`,
          recipient_id: pupil.parent_id,
          title: `Fee Invoice Alert (${inv.invoice_no})`,
          message: data.messageDispatched,
          is_read: false,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    setSmsLogs((prev) => [
      {
        id: `sms-${Date.now()}`,
        sentAt: new Date().toISOString(),
        senderName: currentUser.full_name,
        senderRole: currentUser.role,
        recipients: [inv.parent_phone],
        message: data.messageDispatched,
        templateType: "invoice",
        simulated: Boolean(data.simulated),
      },
      ...prev,
    ]);

    return { ok: true, messageDispatched: data.messageDispatched };
  };

  const sendBroadcastSms = async (input: {
    recipients: string[];
    subject: string;
    messageBody: string;
    parentName?: string;
  }) => {
    const res = await fetch("/api/sms/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: currentUser.role,
        templateType: "broadcast",
        recipients: input.recipients,
        broadcastParams: {
          parentName: input.parentName,
          subject: input.subject,
          messageBody: input.messageBody,
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: data.error || "Failed to send SMS" };
    }

    setSmsLogs((prev) => [
      {
        id: `sms-${Date.now()}`,
        sentAt: new Date().toISOString(),
        senderName: currentUser.full_name,
        senderRole: currentUser.role,
        recipients: input.recipients,
        message: data.messageDispatched,
        templateType: "broadcast",
        simulated: Boolean(data.simulated),
      },
      ...prev,
    ]);

    return { ok: true, messageDispatched: data.messageDispatched };
  };

  const upsertDailyDiary = (input: {
    pupilId: string;
    entryDate: string;
    activitiesLearned: string;
    homework: string;
  }) => {
    const pupil = pupils.find((p) => p.id === input.pupilId);
    if (!pupil) return;

    setDiaries((prev) => {
      const existingIndex = prev.findIndex(
        (d) => d.pupil_id === input.pupilId && d.entry_date === input.entryDate
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          activities_learned: input.activitiesLearned,
          homework: input.homework,
          teacher_id: currentUser.id,
          teacher_name: currentUser.full_name,
        };
        return updated;
      }
      return [
        {
          id: `dry-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          pupil_id: pupil.id,
          pupil_name: pupil.pupil_name,
          class_key: pupil.class_key,
          teacher_id: currentUser.id,
          teacher_name: currentUser.full_name,
          entry_date: input.entryDate,
          activities_learned: input.activitiesLearned,
          homework: input.homework,
          parent_signed: false,
          parent_signed_at: null,
        },
        ...prev,
      ];
    });

    setNotifications((prev) => [
      {
        id: `notif-dry-${Date.now()}-${pupil.id}`,
        recipient_id: pupil.parent_id,
        title: `Daily Diary Updated • ${pupil.pupil_name}`,
        message: `${currentUser.full_name} posted ${pupil.pupil_name}'s daily activities & homework for ${input.entryDate}.`,
        is_read: false,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const prefillClassDiaries = (input: {
    stepClass: StepClassKey;
    entryDate: string;
    sharedActivities: string;
    sharedHomework: string;
    individualNotes: Record<string, string>;
  }) => {
    const classPupils = pupils.filter(
      (p) => p.class_key === input.stepClass && p.is_active
    );
    classPupils.forEach((pupil) => {
      const extraNote = input.individualNotes[pupil.id]?.trim();
      const combinedActivities = extraNote
        ? `${input.sharedActivities.trim()} Individual Note: ${extraNote}`
        : input.sharedActivities.trim();

      upsertDailyDiary({
        pupilId: pupil.id,
        entryDate: input.entryDate,
        activitiesLearned: combinedActivities,
        homework: input.sharedHomework.trim(),
      });
    });
  };

  const signOffDiary = (diaryId: string) => {
    const nowIso = new Date().toISOString();
    const targetDiary = diaries.find((d) => d.id === diaryId);
    setDiaries((prev) =>
      prev.map((d) =>
        d.id === diaryId
          ? { ...d, parent_signed: true, parent_signed_at: nowIso }
          : d
      )
    );

    if (targetDiary) {
      setNotifications((prev) => [
        {
          id: `notif-sign-${Date.now()}`,
          recipient_id: targetDiary.teacher_id,
          title: `Diary Signed Off • ${targetDiary.pupil_name}`,
          message: `Acknowledged by ${currentUser.full_name} at ${new Date(
            nowIso
          ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`,
          is_read: false,
          created_at: nowIso,
        },
        ...prev,
      ]);
    }
  };

  const addDiaryComment = (diaryId: string, commentText: string) => {
    const trimmed = commentText.trim();
    if (!trimmed) return;

    const targetDiary = diaries.find((d) => d.id === diaryId);
    if (!targetDiary) return;

    const newComment: DiaryComment = {
      id: `cmt-${Date.now()}`,
      diary_id: diaryId,
      sender_id: currentUser.id,
      sender_name: currentUser.full_name,
      sender_role: currentUser.role,
      comment: trimmed,
      created_at: new Date().toISOString(),
    };

    setDiaryComments((prev) => [...prev, newComment]);

    if (currentUser.role === "parent") {
      const newNotifs: AppNotification[] = [];

      if (targetDiary.teacher_id) {
        newNotifs.push({
          id: `notif-cmt-tchr-${Date.now()}`,
          recipient_id: targetDiary.teacher_id,
          title: `New Parent Diary Comment: ${targetDiary.pupil_name}`,
          message: `${currentUser.full_name} commented on ${targetDiary.pupil_name}'s diary: "${trimmed}"`,
          is_read: false,
          created_at: new Date().toISOString(),
        });
      }

      const adminProfiles = profiles.filter(
        (p) => p.role === "owner" || p.role === "admin"
      );
      adminProfiles.forEach((adm) => {
        newNotifs.push({
          id: `notif-cmt-adm-${Date.now()}-${adm.id}`,
          recipient_id: adm.id,
          title: `Parent Comment (${targetDiary.pupil_name})`,
          message: `${currentUser.full_name} commented on ${targetDiary.pupil_name}'s daily diary: "${trimmed}"`,
          is_read: false,
          created_at: new Date().toISOString(),
        });
      });

      setNotifications((prev) => [...newNotifs, ...prev]);
    } else {
      const pupil = pupils.find((p) => p.id === targetDiary.pupil_id);
      if (pupil) {
        setNotifications((prev) => [
          {
            id: `notif-cmt-par-${Date.now()}`,
            recipient_id: pupil.parent_id,
            title: `Teacher Reply on ${pupil.pupil_name}'s Diary`,
            message: `${currentUser.full_name} replied: "${trimmed}"`,
            is_read: false,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    }
  };

  const submitWeeklyReport = (input: {
    pupilId: string;
    weekEnding: string;
    literacyNumeracyNotes: string;
    socialEmotionalNotes: string;
    teacherRemark: string;
  }) => {
    const pupil = pupils.find((p) => p.id === input.pupilId);
    if (!pupil) return;

    const newReport: WeeklyReport = {
      id: `rep-${Date.now()}`,
      pupil_id: pupil.id,
      pupil_name: pupil.pupil_name,
      class_key: pupil.class_key,
      teacher_id: currentUser.id,
      teacher_name: currentUser.full_name,
      week_ending: input.weekEnding,
      literacy_numeracy_notes: input.literacyNumeracyNotes,
      social_emotional_notes: input.socialEmotionalNotes,
      teacher_remark: input.teacherRemark,
      status: "submitted",
      created_at: new Date().toISOString(),
    };

    setWeeklyReports((prev) => [newReport, ...prev]);

    const adminProfiles = profiles.filter(
      (p) => p.role === "owner" || p.role === "admin"
    );
    setNotifications((prev) => [
      {
        id: `notif-rep-par-${Date.now()}`,
        recipient_id: pupil.parent_id,
        title: `Weekly Progress Report • ${pupil.pupil_name}`,
        message: `${currentUser.full_name} submitted the weekly report for week ending ${input.weekEnding}.`,
        is_read: false,
        created_at: new Date().toISOString(),
      },
      ...adminProfiles.map((adm) => ({
        id: `notif-rep-adm-${Date.now()}-${adm.id}`,
        recipient_id: adm.id,
        title: `Weekly Report Submitted (${pupil.pupil_name})`,
        message: `${currentUser.full_name} submitted ${pupil.pupil_name}'s report for review.`,
        is_read: false,
        created_at: new Date().toISOString(),
      })),
      ...prev,
    ]);
  };

  const markWeeklyReportReviewed = (reportId: string) => {
    setWeeklyReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: "reviewed" } : r))
    );
  };

  const createForumPost = (input: {
    classKey: StepClassKey | null;
    title: string;
    content: string;
  }) => {
    const cls = input.classKey
      ? SCHOOL_CLASSES.find((c) => c.name === input.classKey)
      : null;

    const newPost: ForumPost = {
      id: `fp-${Date.now()}`,
      class_id: cls ? cls.id : null,
      class_key: input.classKey,
      author_id: currentUser.id,
      author_name: currentUser.full_name,
      author_role: currentUser.role,
      title: input.title.trim(),
      content: input.content.trim(),
      created_at: new Date().toISOString(),
    };

    setForumPosts((prev) => [newPost, ...prev]);
  };

  const deleteForumPost = (postId: string) => {
    if (!["admin", "owner", "secretary"].includes(currentUser.role)) return;
    setForumPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <PortalContext.Provider
      value={{
        currentUser,
        profiles,
        teacherAssignments,
        pupils,
        invoices,
        diaries,
        diaryComments,
        weeklyReports,
        forumPosts,
        notifications,
        smsLogs,
        switchUserById,
        loginByPhone,
        assignedTeacherStep,
        parentPupils,
        unreadNotificationCount,
        userNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        provisionAccount,
        deleteProfile,
        deletePupil,
        updatePupilStep,
        createInvoice,
        recordInvoicePayment,
        deleteInvoice,
        sendInvoiceAlertAndSms,
        sendBroadcastSms,
        upsertDailyDiary,
        prefillClassDiaries,
        signOffDiary,
        addDiaryComment,
        submitWeeklyReport,
        markWeeklyReportReviewed,
        createForumPost,
        deleteForumPost,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) {
    throw new Error("usePortal must be used within a PortalProvider");
  }
  return ctx;
}
