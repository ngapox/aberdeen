export type UserRole = "admin" | "owner" | "secretary" | "teacher" | "parent";

export type StepClassKey = "step_1" | "step_2" | "step_3";

export interface Profile {
  id: string;
  phone_number: string; // Strictly +255XXXXXXXXX
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface SchoolClass {
  id: string;
  name: StepClassKey;
  display_name: string;
}

export interface TeacherAssignment {
  id: string;
  teacher_id: string;
  class_id: string;
}

export interface Pupil {
  id: string;
  pupil_name: string;
  parent_id: string;
  parent_name: string;
  parent_phone: string;
  class_id: string;
  class_key: StepClassKey;
  enrollment_date: string;
  is_active: boolean;
}

export type InvoiceStatus = "pending" | "partial" | "paid";

export interface Invoice {
  id: string;
  invoice_no: string;
  pupil_id: string;
  pupil_name: string;
  parent_name: string;
  parent_phone: string;
  class_key: StepClassKey;
  amount: number;
  amount_paid: number;
  status: InvoiceStatus;
  due_date: string;
  created_by: string;
  created_at: string;
}

export interface DailyDiary {
  id: string;
  pupil_id: string;
  pupil_name: string;
  class_key: StepClassKey;
  teacher_id: string;
  teacher_name: string;
  entry_date: string;
  activities_learned: string;
  homework: string;
  parent_signed: boolean;
  parent_signed_at: string | null;
}

export interface DiaryComment {
  id: string;
  diary_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: UserRole;
  comment: string;
  created_at: string;
}

export interface WeeklyReport {
  id: string;
  pupil_id: string;
  pupil_name: string;
  class_key: StepClassKey;
  teacher_id: string;
  teacher_name: string;
  week_ending: string;
  literacy_numeracy_notes: string;
  social_emotional_notes: string;
  teacher_remark: string;
  status: "draft" | "submitted" | "reviewed";
  created_at: string;
}

export interface ForumPost {
  id: string;
  class_id: string | null; // null = Main School Forum
  class_key: StepClassKey | null;
  author_id: string;
  author_name: string;
  author_role: UserRole;
  title: string;
  content: string;
  created_at: string;
}

export interface AppNotification {
  id: string;
  recipient_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
