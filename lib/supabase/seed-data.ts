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
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    summary:
      "Sensory discovery, motor coordination, gentle routines, and joyful language immersion in a warm, secure home-away-from-home.",
    pillars: [
      "Tactile sensory &Montessori play",
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
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
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
    badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
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

export const INITIAL_PROFILES: Profile[] = [
  {
    id: "usr-owner-1",
    phone_number: "+255754100100",
    full_name: "Dr. Neema Mwakasege",
    role: "owner",
    created_at: "2026-01-05T08:00:00Z",
  },
  {
    id: "usr-admin-1",
    phone_number: "+255754100101",
    full_name: "Bw. Godfrey Lema",
    role: "admin",
    created_at: "2026-01-05T08:15:00Z",
  },
  {
    id: "usr-sec-1",
    phone_number: "+255754200200",
    full_name: "Bi. Salma Kikwete",
    role: "secretary",
    created_at: "2026-01-06T09:00:00Z",
  },
  {
    id: "usr-tchr-1",
    phone_number: "+255754300301",
    full_name: "Mwl. Grace Komba",
    role: "teacher",
    created_at: "2026-01-08T08:00:00Z",
  },
  {
    id: "usr-tchr-2",
    phone_number: "+255754300302",
    full_name: "Mwl. David Massawe",
    role: "teacher",
    created_at: "2026-01-08T08:10:00Z",
  },
  {
    id: "usr-tchr-3",
    phone_number: "+255754300303",
    full_name: "Mwl. Amina Said",
    role: "teacher",
    created_at: "2026-01-08T08:20:00Z",
  },
  {
    id: "usr-par-1",
    phone_number: "+255754400401",
    full_name: "Bw. Josephat Mushi",
    role: "parent",
    created_at: "2026-01-12T10:00:00Z",
  },
  {
    id: "usr-par-2",
    phone_number: "+255754400402",
    full_name: "Bi. Halima Nyerere",
    role: "parent",
    created_at: "2026-01-12T10:30:00Z",
  },
  {
    id: "usr-par-3",
    phone_number: "+255754400403",
    full_name: "Eng. Patrick Kweka",
    role: "parent",
    created_at: "2026-01-12T11:00:00Z",
  },
  {
    id: "usr-par-4",
    phone_number: "+255754400404",
    full_name: "Dr. Rehema Mtui",
    role: "parent",
    created_at: "2026-01-14T09:00:00Z",
  },
  {
    id: "usr-par-5",
    phone_number: "+255754400405",
    full_name: "Bw. Kelvin Shirima",
    role: "parent",
    created_at: "2026-01-15T11:00:00Z",
  },
];

export const INITIAL_TEACHER_ASSIGNMENTS: TeacherAssignment[] = [
  { id: "ta-1", teacher_id: "usr-tchr-1", class_id: "cls-step-1" },
  { id: "ta-2", teacher_id: "usr-tchr-2", class_id: "cls-step-2" },
  { id: "ta-3", teacher_id: "usr-tchr-3", class_id: "cls-step-3" },
];

export const INITIAL_PUPILS: Pupil[] = [
  {
    id: "pup-1",
    pupil_name: "Liam Josephat Mushi",
    parent_id: "usr-par-1",
    parent_name: "Bw. Josephat Mushi",
    parent_phone: "+255754400401",
    class_id: "cls-step-1",
    class_key: "step_1",
    enrollment_date: "2026-01-12",
    is_active: true,
  },
  {
    id: "pup-2",
    pupil_name: "Nia Rehema Mtui",
    parent_id: "usr-par-4",
    parent_name: "Dr. Rehema Mtui",
    parent_phone: "+255754400404",
    class_id: "cls-step-1",
    class_key: "step_1",
    enrollment_date: "2026-01-14",
    is_active: true,
  },
  {
    id: "pup-3",
    pupil_name: "Zuri Halima Nyerere",
    parent_id: "usr-par-2",
    parent_name: "Bi. Halima Nyerere",
    parent_phone: "+255754400402",
    class_id: "cls-step-2",
    class_key: "step_2",
    enrollment_date: "2026-01-12",
    is_active: true,
  },
  {
    id: "pup-4",
    pupil_name: "Kairo Kelvin Shirima",
    parent_id: "usr-par-5",
    parent_name: "Bw. Kelvin Shirima",
    parent_phone: "+255754400405",
    class_id: "cls-step-2",
    class_key: "step_2",
    enrollment_date: "2026-01-15",
    is_active: true,
  },
  {
    id: "pup-5",
    pupil_name: "Ethan Patrick Kweka",
    parent_id: "usr-par-3",
    parent_name: "Eng. Patrick Kweka",
    parent_phone: "+255754400403",
    class_id: "cls-step-3",
    class_key: "step_3",
    enrollment_date: "2026-01-12",
    is_active: true,
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv-1",
    invoice_no: "ABD-2026-101",
    pupil_id: "pup-1",
    pupil_name: "Liam Josephat Mushi",
    parent_name: "Bw. Josephat Mushi",
    parent_phone: "+255754400401",
    class_key: "step_1",
    amount: 650000,
    amount_paid: 400000,
    status: "partial",
    due_date: "2026-11-05",
    created_by: "usr-sec-1",
    created_at: "2026-10-01T09:00:00Z",
  },
  {
    id: "inv-2",
    invoice_no: "ABD-2026-102",
    pupil_id: "pup-2",
    pupil_name: "Nia Rehema Mtui",
    parent_name: "Dr. Rehema Mtui",
    parent_phone: "+255754400404",
    class_key: "step_1",
    amount: 650000,
    amount_paid: 650000,
    status: "paid",
    due_date: "2026-10-15",
    created_by: "usr-sec-1",
    created_at: "2026-10-01T09:15:00Z",
  },
  {
    id: "inv-3",
    invoice_no: "ABD-2026-103",
    pupil_id: "pup-3",
    pupil_name: "Zuri Halima Nyerere",
    parent_name: "Bi. Halima Nyerere",
    parent_phone: "+255754400402",
    class_key: "step_2",
    amount: 720000,
    amount_paid: 0,
    status: "pending",
    due_date: "2026-11-10",
    created_by: "usr-sec-1",
    created_at: "2026-10-03T10:00:00Z",
  },
  {
    id: "inv-4",
    invoice_no: "ABD-2026-104",
    pupil_id: "pup-4",
    pupil_name: "Kairo Kelvin Shirima",
    parent_name: "Bw. Kelvin Shirima",
    parent_phone: "+255754400405",
    class_key: "step_2",
    amount: 720000,
    amount_paid: 500000,
    status: "partial",
    due_date: "2026-11-10",
    created_by: "usr-sec-1",
    created_at: "2026-10-04T10:30:00Z",
  },
  {
    id: "inv-5",
    invoice_no: "ABD-2026-105",
    pupil_id: "pup-5",
    pupil_name: "Ethan Patrick Kweka",
    parent_name: "Eng. Patrick Kweka",
    parent_phone: "+255754400403",
    class_key: "step_3",
    amount: 780000,
    amount_paid: 780000,
    status: "paid",
    due_date: "2026-10-20",
    created_by: "usr-owner-1",
    created_at: "2026-10-02T14:00:00Z",
  },
];

export const INITIAL_DIARIES: DailyDiary[] = [
  {
    id: "dry-1",
    pupil_id: "pup-1",
    pupil_name: "Liam Josephat Mushi",
    class_key: "step_1",
    teacher_id: "usr-tchr-1",
    teacher_name: "Mwl. Grace Komba",
    entry_date: "2026-10-27",
    activities_learned:
      "Sensory wooden block sorting by color (Red, Yellow, Blue), Swahili greeting song ('Habari za Asubuhi'), and 20 minutes of guided courtyard balance beam play. Individual Note: Liam shared his building blocks warmly with Nia today!",
    homework:
      "Practice naming 3 yellow objects around the house together for 5 minutes before bedtime.",
    parent_signed: false,
    parent_signed_at: null,
  },
  {
    id: "dry-2",
    pupil_id: "pup-2",
    pupil_name: "Nia Rehema Mtui",
    class_key: "step_1",
    teacher_id: "usr-tchr-1",
    teacher_name: "Mwl. Grace Komba",
    entry_date: "2026-10-27",
    activities_learned:
      "Sensory wooden block sorting by color (Red, Yellow, Blue), Swahili greeting song ('Habari za Asubuhi'), and 20 minutes of guided courtyard balance beam play. Individual Note: Nia clapped along to every verse and finished her fruit bowl.",
    homework:
      "Practice naming 3 yellow objects around the house together for 5 minutes before bedtime.",
    parent_signed: true,
    parent_signed_at: "2026-10-27T14:20:00Z",
  },
  {
    id: "dry-3",
    pupil_id: "pup-3",
    pupil_name: "Zuri Halima Nyerere",
    class_key: "step_2",
    teacher_id: "usr-tchr-2",
    teacher_name: "Mwl. David Massawe",
    entry_date: "2026-10-27",
    activities_learned:
      "Jolly Phonics letter sounds /s/, /a/, /t/ with sand-tracing trays; counting seashells 1 to 15; story circle about 'The Helpful Giraffe in Serengeti'. Individual Note: Zuri traced the letter 'S' neatly without assistance.",
    homework:
      "Read page 4 of the Phonics booklet and trace the letter 'T' three times with a crayon.",
    parent_signed: false,
    parent_signed_at: null,
  },
  {
    id: "dry-4",
    pupil_id: "pup-5",
    pupil_name: "Ethan Patrick Kweka",
    class_key: "step_3",
    teacher_id: "usr-tchr-3",
    teacher_name: "Mwl. Amina Said",
    entry_date: "2026-10-27",
    activities_learned:
      "Single-digit addition using number lines (up to 20), reading short CVC sentences aloud, and seed germination observation in our classroom science corner. Individual Note: Ethan volunteered to lead morning assembly prayers.",
    homework:
      "Complete the 5 number-line addition exercises in the Pre-Unit workbook (Page 12).",
    parent_signed: true,
    parent_signed_at: "2026-10-27T16:05:00Z",
  },
];

export const INITIAL_DIARY_COMMENTS: DiaryComment[] = [
  {
    id: "cmt-1",
    diary_id: "dry-1",
    sender_id: "usr-par-1",
    sender_name: "Bw. Josephat Mushi",
    sender_role: "parent",
    comment:
      "Asante sana Mwl. Grace! Liam was singing 'Habari za Asubuhi' all the way home in the car. Did he nap well after lunch today?",
    created_at: "2026-10-27T15:10:00Z",
  },
  {
    id: "cmt-2",
    diary_id: "dry-1",
    sender_id: "usr-tchr-1",
    sender_name: "Mwl. Grace Komba",
    sender_role: "teacher",
    comment:
      "Karibu sana Baba Liam! Yes, he slept peacefully from 12:45 PM to 2:10 PM and drank all his warm milk.",
    created_at: "2026-10-27T15:25:00Z",
  },
];

export const INITIAL_WEEKLY_REPORTS: WeeklyReport[] = [
  {
    id: "rep-1",
    pupil_id: "pup-1",
    pupil_name: "Liam Josephat Mushi",
    class_key: "step_1",
    teacher_id: "usr-tchr-1",
    teacher_name: "Mwl. Grace Komba",
    week_ending: "2026-10-23",
    literacy_numeracy_notes:
      "Recognizes primary colors (red, blue, yellow) and counts 1 to 5 aloud during circle time.",
    social_emotional_notes:
      "Demonstrates warm empathy toward peers, transitions smoothly from outdoor play to quiet story time.",
    teacher_remark:
      "Wonderful week of growth for Liam. Keep encouraging him to use two-word polite requests at home.",
    status: "reviewed",
    created_at: "2026-10-23T15:00:00Z",
  },
  {
    id: "rep-2",
    pupil_id: "pup-3",
    pupil_name: "Zuri Halima Nyerere",
    class_key: "step_2",
    teacher_id: "usr-tchr-2",
    teacher_name: "Mwl. David Massawe",
    week_ending: "2026-10-23",
    literacy_numeracy_notes:
      "Blends 3-letter phonetic sounds (/s/-/a/-/t/) and matches numerals 1–15 with bead counters.",
    social_emotional_notes:
      "Eager classroom helper; takes turns patiently during group puzzle stations.",
    teacher_remark:
      "Zuri shows strong pencil grip improvement. We will focus on sound /p/ and /i/ next week.",
    status: "submitted",
    created_at: "2026-10-23T15:30:00Z",
  },
  {
    id: "rep-3",
    pupil_id: "pup-5",
    pupil_name: "Ethan Patrick Kweka",
    class_key: "step_3",
    teacher_id: "usr-tchr-3",
    teacher_name: "Mwl. Amina Said",
    week_ending: "2026-10-23",
    literacy_numeracy_notes:
      "Reads 4-sentence short stories independently; solves addition up to 20 with 95% accuracy.",
    social_emotional_notes:
      "Confident team leader in science group projects and respectful listener.",
    teacher_remark:
      "Ethan is well on track for Primary Standard 1 transition. Excellent neatness in his workbook.",
    status: "reviewed",
    created_at: "2026-10-23T16:00:00Z",
  },
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: "fp-1",
    class_id: null,
    class_key: null,
    author_id: "usr-owner-1",
    author_name: "Dr. Neema Mwakasege",
    author_role: "owner",
    title: "Term II Parents & Teachers Fellowship Day – Friday, 13th November",
    content:
      "Warm greetings to our Aberdeen family! We invite all parents and guardians to our Term II Fellowship & Developmental Showcase from 9:00 AM to 12:30 PM. Pupils from Step 1, Step 2, and Step 3 will present recitations, phonics demonstrations, and artwork.",
    created_at: "2026-10-25T09:00:00Z",
  },
  {
    id: "fp-2",
    class_id: null,
    class_key: null,
    author_id: "usr-sec-1",
    author_name: "Bi. Salma Kikwete",
    author_role: "secretary",
    title: "Updated School Nutrition Menu & Rainy Season Attire Reminder",
    content:
      "Kindly ensure every child carries a labeled light raincoat or sweater in their backpack this week. Our kitchen continues to serve fresh seasonal fruits, millet porridge at 10:00 AM, and balanced hot lunches at 12:15 PM.",
    created_at: "2026-10-26T11:20:00Z",
  },
  {
    id: "fp-3",
    class_id: "cls-step-1",
    class_key: "step_1",
    author_id: "usr-tchr-1",
    author_name: "Mwl. Grace Komba",
    author_role: "teacher",
    title: "Step 1 Sensory Basket Week: Natural Textures",
    content:
      "Dear Step 1 Parents, this Thursday we are exploring safe natural textures (smooth river stones, pine cones, and soft cotton). No items need to be bought—everything is prepared in our daycare classroom!",
    created_at: "2026-10-26T14:00:00Z",
  },
  {
    id: "fp-4",
    class_id: "cls-step-2",
    class_key: "step_2",
    author_id: "usr-tchr-2",
    author_name: "Mwl. David Massawe",
    author_role: "teacher",
    title: "Step 2 Phonics Flashcards Practice Guide",
    content:
      "Habari Wazazi wa Step 2! When practicing Jolly Phonics at home, focus on the pure sound ('ssss' rather than 'es'). Just 5 playful minutes an evening makes a huge difference.",
    created_at: "2026-10-26T15:10:00Z",
  },
  {
    id: "fp-5",
    class_id: "cls-step-3",
    class_key: "step_3",
    author_id: "usr-tchr-3",
    author_name: "Mwl. Amina Said",
    author_role: "teacher",
    title: "Step 3 Primary Readiness Mock Assessment Schedule",
    content:
      "Dear Step 3 Parents, next Wednesday morning we will hold a gentle, stress-free reading and numeracy check-in to celebrate how far our Pre-Unit scholars have progressed.",
    created_at: "2026-10-26T16:00:00Z",
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    recipient_id: "usr-owner-1",
    title: "Parent Comment (Liam Josephat Mushi)",
    message:
      "Bw. Josephat Mushi commented on Liam Josephat Mushi's daily diary: \"Asante sana Mwl. Grace! Liam was singing...\"",
    is_read: false,
    created_at: "2026-10-27T15:10:00Z",
  },
  {
    id: "notif-2",
    recipient_id: "usr-tchr-1",
    title: "New Parent Diary Comment: Liam Josephat Mushi",
    message:
      "Bw. Josephat Mushi commented on Liam Josephat Mushi's diary: \"Asante sana Mwl. Grace! Liam was singing...\"",
    is_read: false,
    created_at: "2026-10-27T15:10:00Z",
  },
  {
    id: "notif-3",
    recipient_id: "usr-par-1",
    title: "New Daily Diary Entry • Liam Josephat Mushi",
    message:
      "Mwl. Grace Komba posted today's Step 1 activities and homework. Tap to review and sign off.",
    is_read: false,
    created_at: "2026-10-27T14:00:00Z",
  },
  {
    id: "notif-4",
    recipient_id: "usr-par-1",
    title: "Fee Invoice Balance Reminder (ABD-2026-101)",
    message:
      "Remaining Term II balance of TZS 250,000 is due by 2026-11-05.",
    is_read: false,
    created_at: "2026-10-25T09:00:00Z",
  },
  {
    id: "notif-5",
    recipient_id: "usr-par-2",
    title: "New Fee Invoice Issued (ABD-2026-103)",
    message:
      "Term II Invoice for Zuri Halima Nyerere (TZS 720,000) has been generated by the Secretary.",
    is_read: false,
    created_at: "2026-10-26T10:00:00Z",
  },
];
