import {
  AppNotification,
  DailyDiary,
  DiaryComment,
  ForumPost,
  Invoice,
  Profile,
  Pupil,
  SchoolClass,
  StepClassKey,
  TeacherAssignment,
  WeeklyReport,
} from "./types";

export const SCHOOL_CLASSES: SchoolClass[] = [
  {
    id: "cls-step-1",
    name: "step_1",
    display_name: "Step 1 (Daycare / Early Toddler)",
  },
  {
    id: "cls-step-2",
    name: "step_2",
    display_name: "Step 2 (Nursery / Mid Toddler)",
  },
  {
    id: "cls-step-3",
    name: "step_3",
    display_name: "Step 3 (Pre-Unit / Transition to Primary)",
  },
];

export const STEP_META: Record<
  StepClassKey,
  {
    shortLabel: string;
    title: string;
    ageRange: string;
    ratio: string;
    badgeColor: string;
    summary: string;
    pillars: string[];
  }
> = {
  step_1: {
    shortLabel: "Step 1 • Daycare",
    title: "Step 1 (Daycare / Early Toddler)",
    ageRange: "18 Months – 3 Years",
    ratio: "1:5 Teacher-to-Child Ratio",
    badgeColor: "bg-[#fffbeb] text-[#a36102] border-[#fde58a]",
    summary:
      "Sensory discovery, motor coordination, gentle routines, and joyful language immersion in a warm, secure home-away-from-home.",
    pillars: [
      "Tactile sensory & Montessori play",
      "Early Swahili & English vocabulary songs",
      "Social-emotional attachment & sharing",
      "Restful nap & nutrition tracking",
    ],
  },
  step_2: {
    shortLabel: "Step 2 • Nursery",
    title: "Step 2 (Nursery / Mid Toddler)",
    ageRange: "3 – 4.5 Years",
    ratio: "1:8 Teacher-to-Child Ratio",
    badgeColor: "bg-[#e2eef5] text-[#275169] border-[#9bc6de]",
    summary:
      "Phonics foundations, early number sense, expressive storytelling, and collaborative classroom discovery.",
    pillars: [
      "Jolly Phonics & sound recognition",
      "Hands-on counting, sorting & pattern logic",
      "Creative arts, rhythm & outdoor gardening",
      "Confidence in self-care & group etiquette",
    ],
  },
  step_3: {
    shortLabel: "Step 3 • Pre-Unit",
    title: "Step 3 (Pre-Unit / Transition to Primary)",
    ageRange: "4.5 – 6 Years",
    ratio: "1:10 Teacher-to-Child Ratio",
    badgeColor: "bg-[#1e3f52] text-[#fbd24d] border-[#3b7a9e]",
    summary:
      "Structured primary school readiness: fluent early reading, foundational arithmetic, critical inquiry, and leadership skills.",
    pillars: [
      "Reading fluency & sentence writing",
      "Addition, subtraction & early geometry",
      "Science curiosity & environmental stewardship",
      "Primary entrance readiness & independence",
    ],
  },
};

// Clean production initialization: Only the Owner (Madam Elizabeth Nkya)
export const INITIAL_PROFILES: Profile[] = [
  {
    id: "usr-owner-1",
    phone_number: "+255716004601",
    full_name: "Madam Elizabeth Nkya",
    role: "owner",
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_TEACHER_ASSIGNMENTS: TeacherAssignment[] = [];

export const INITIAL_PUPILS: Pupil[] = [];

export const INITIAL_INVOICES: Invoice[] = [];

export const INITIAL_DIARIES: DailyDiary[] = [];

export const INITIAL_DIARY_COMMENTS: DiaryComment[] = [];

export const INITIAL_WEEKLY_REPORTS: WeeklyReport[] = [];

export const INITIAL_FORUM_POSTS: ForumPost[] = [];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];
