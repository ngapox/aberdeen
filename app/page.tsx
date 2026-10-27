"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  GraduationCap,
  Heart,
  Lock,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";
import { STEP_META } from "@/lib/supabase/seed-data";
import { StepClassKey } from "@/lib/supabase/types";

const STAFF_SHOWCASE = [
  {
    name: "Dr. Neema Mwakasege",
    role: "Founder & School Director (Owner)",
    credentials: "Ph.D. Early Childhood Curriculum • 16+ Yrs Experience",
    bio: "Passionate about blending Montessori discovery with strong Tanzanian moral values, literacy, and family partnership.",
    badge: "Leadership",
    initials: "NM",
    color: "bg-aberdeen-800 text-amber-200",
  },
  {
    name: "Bi. Salma Kikwete",
    role: "Head of Administration & Admissions",
    credentials: "B.Com Accounting & School Administration",
    bio: "Coordinates parent admissions, transparent fee invoicing, and seamless school-to-home SMS communications.",
    badge: "Administration",
    initials: "SK",
    color: "bg-amber-700 text-amber-50",
  },
  {
    name: "Mwl. Grace Komba",
    role: "Lead Educator — Step 1 (Daycare / Early Toddler)",
    credentials: "Diploma in Montessori Early Toddler Care & Infant First Aid",
    bio: "Specializes in sensory exploration, early bilingual songs, and nurturing routines for 18-month to 3-year-old toddlers.",
    badge: "Step 1 Lead",
    initials: "GK",
    color: "bg-emerald-700 text-emerald-50",
  },
  {
    name: "Mwl. David Massawe",
    role: "Lead Educator — Step 2 (Nursery / Mid Toddler)",
    credentials: "B.Ed. Early Childhood Education • Jolly Phonics Certified",
    bio: "Guides children through joyful phonetic sound blending, hands-on counting games, and expressive storytelling.",
    badge: "Step 2 Lead",
    initials: "DM",
    color: "bg-teal-700 text-teal-50",
  },
  {
    name: "Mwl. Amina Said",
    role: "Lead Educator — Step 3 (Pre-Unit / Primary Transition)",
    credentials: "B.Ed. Primary Foundation & Numeracy Specialist",
    bio: "Prepares Pre-Unit scholars with confident reading fluency, mental arithmetic, and leadership readiness for Standard 1.",
    badge: "Step 3 Lead",
    initials: "AS",
    color: "bg-sky-800 text-sky-50",
  },
];

const UPCOMING_EVENTS = [
  {
    date: "NOV 06",
    day: "Friday • 09:00 AM",
    title: "Step 1 & Step 2 Open Classroom Sensory Morning",
    category: "Open House",
    description:
      "Prospective and current parents are invited to observe our Montessori sensory stations and outdoor discovery garden.",
  },
  {
    date: "NOV 13",
    day: "Friday • 09:00 AM – 12:30 PM",
    title: "Term II Parents & Teachers Fellowship Showcase",
    category: "School-Wide Event",
    description:
      "Recitations, Jolly Phonics demonstrations, and developmental progress exhibitions across Step 1, Step 2, and Step 3.",
  },
  {
    date: "NOV 20",
    day: "Friday • 10:00 AM",
    title: "Step 3 Pre-Unit Primary Readiness Celebration",
    category: "Step 3 Milestone",
    description:
      "Celebrating our graduating Pre-Unit scholars as they demonstrate early reading fluency and arithmetic mastery.",
  },
  {
    date: "DEC 04",
    day: "Friday • 08:30 AM",
    title: "End-of-Year Graduation & Cultural Family Festival",
    category: "Annual Ceremony",
    description:
      "Certificate presentation, traditional songs, and community luncheon for all Aberdeen families.",
  },
];

export default function PublicShowcasePage() {
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    parentName: "",
    phone: "+255",
    childName: "",
    step: "step_1" as StepClassKey,
    notes: "",
  });
  const [phoneError, setPhoneError] = useState("");

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\+255\d{9}$/.test(inquiryForm.phone.trim())) {
      setPhoneError(
        "Please enter a valid Tanzania phone number starting with +255 (e.g. +255754123456)."
      );
      return;
    }
    setPhoneError("");
    setInquirySubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f4] text-stone-900">
      {/* Top Announcement Strip */}
      <div className="bg-aberdeen-900 text-amber-100 text-xs sm:text-sm py-2.5 px-4 border-b border-aberdeen-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-semibold text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> 2026/2027 Admissions Open
            </span>
            <span className="text-stone-200">
              Enrolling Step 1 (Daycare), Step 2 (Nursery) &amp; Step 3 (Pre-Unit)
            </span>
          </div>
          <div className="hidden md:flex items-center gap-5 text-stone-300 text-xs">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" /> +255 754 100 100
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> Dar es Salaam / Arusha, Tanzania
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 bg-[#faf8f4]/95 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-aberdeen-800 flex items-center justify-center text-amber-300 shadow-sm group-hover:bg-aberdeen-700 transition-colors">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-display text-lg sm:text-xl font-bold tracking-tight text-aberdeen-950 leading-none">
                Aberdeen
              </span>
              <span className="block text-xs font-medium text-stone-600 tracking-wide mt-0.5">
                Daycare &amp; Nursery School
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-700">
            <a
              href="#mission"
              className="hover:text-aberdeen-700 transition-colors"
            >
              Our Values
            </a>
            <a
              href="#classes"
              className="hover:text-aberdeen-700 transition-colors"
            >
              3 Developmental Steps
            </a>
            <a
              href="#staff"
              className="hover:text-aberdeen-700 transition-colors"
            >
              Teachers &amp; Leadership
            </a>
            <a
              href="#events"
              className="hover:text-aberdeen-700 transition-colors"
            >
              Events &amp; Calendar
            </a>
            <a
              href="#admissions"
              className="hover:text-aberdeen-700 transition-colors"
            >
              Admission Inquiry
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-aberdeen-800 hover:bg-aberdeen-900 text-white text-sm font-semibold shadow-sm transition-all"
            >
              <Lock className="w-4 h-4 text-amber-300" />
              <span>Portal Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-20 sm:pt-16 sm:pb-24 border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-aberdeen-100/90 border border-aberdeen-200 text-aberdeen-800 text-xs font-semibold">
                <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>Warm, Safe &amp; Structured Early Learning in Tanzania</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-aberdeen-950 tracking-tight leading-[1.1]">
                Where Little Footsteps Grow Into{" "}
                <span className="text-aberdeen-700 underline decoration-amber-400/80 decoration-wavy decoration-2 underline-offset-8">
                  Confident Learners.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
                At <strong>Aberdeen Daycare and Nursery School</strong>, we
                nurture children from 18 months to 6 years through three
                purposeful developmental stages—supported by our real-time
                Parent &amp; Teacher Digital Diary, transparent fee tracking, and
                instant Beem SMS updates.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#admissions"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm shadow-sm transition-all"
                >
                  <span>Quick Admission Inquiry</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <Link
                  href="/portal"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-aberdeen-900 border border-stone-300 font-semibold text-sm shadow-sm transition-all"
                >
                  <BookOpen className="w-4 h-4 text-aberdeen-700" />
                  <span>Explore Interactive School Portal</span>
                </Link>
              </div>

              {/* Trust Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200/80">
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-aberdeen-900">
                    3 Steps
                  </p>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Daycare, Nursery &amp; Pre-Unit
                  </p>
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-aberdeen-900">
                    100%
                  </p>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Daily Digital Diary Sign-Off
                  </p>
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-aberdeen-900">
                    +255 SMS
                  </p>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Direct Beem Africa Alerts
                  </p>
                </div>
              </div>
            </div>

            {/* Right Interactive Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-7 space-y-5 relative">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-aberdeen-100 text-aberdeen-800 flex items-center justify-center font-bold">
                      AD
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-aberdeen-700">
                        Live Parent &amp; Teacher Portal
                      </span>
                      <h3 className="font-bold text-stone-900 text-sm">
                        Daily Digital Diary &amp; Sign-Off
                      </h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                    Step 1 • Today
                  </span>
                </div>

                <div className="rounded-2xl bg-[#faf8f4] p-4 border border-stone-200/70 space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>Pupil: <strong className="text-stone-800">Liam Josephat Mushi</strong></span>
                    <span>Teacher: <strong className="text-stone-800">Mwl. Grace Komba</strong></span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    <strong className="text-aberdeen-900">Activities Learned:</strong>{" "}
                    Sensory wooden block sorting by color, Swahili greeting song
                    (&ldquo;Habari za Asubuhi&rdquo;), and courtyard balance play.
                  </p>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    <strong className="text-amber-800">Homework:</strong> Practice
                    naming 3 yellow objects around the house together before bedtime.
                  </p>
                  <div className="pt-2 flex items-center justify-between border-t border-stone-200/70">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" /> Acknowledged by Bw. Josephat Mushi
                    </span>
                    <span className="text-[11px] text-stone-500">14:20 EAT</span>
                  </div>
                </div>

                {/* Role-Based Quick Launch */}
                <div className="space-y-2.5 pt-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Instant Portal Demo Access (All 4 Roles)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/portal"
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-aberdeen-50 hover:bg-aberdeen-100 border border-aberdeen-200 text-xs font-semibold text-aberdeen-900 transition-colors"
                    >
                      <span>Owner / Admin</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/portal"
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-semibold text-amber-900 transition-colors"
                    >
                      <span>Secretary</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/portal"
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold text-emerald-900 transition-colors"
                    >
                      <span>Step Teacher</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/portal"
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-xs font-semibold text-sky-900 transition-colors"
                    >
                      <span>Parent Mobile View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Mission & Core Values */}
      <section id="mission" className="py-16 sm:py-20 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-aberdeen-700">
              Our Mission &amp; Philosophy
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-stone-900">
              A Foundation of Curiosity, Character &amp; Community
            </h2>
            <p className="mt-3 text-stone-600 leading-relaxed">
              Every child at Aberdeen is known by name, celebrated for their
              unique pace, and guided closely through partnership between
              parents and teachers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#faf8f4] border border-stone-200/80 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-lg">
                Warm Care &amp; Safety
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Secure gated courtyard, small class ratios, nutritious freshly
                prepared meals, and attentive hygiene routines.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#faf8f4] border border-stone-200/80 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-aberdeen-100 text-aberdeen-800 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-lg">
                Montessori &amp; Phonics
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Hands-on tactile learning combined with structured Jolly Phonics
                and early numeracy for confident primary readiness.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#faf8f4] border border-stone-200/80 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-lg">
                Daily Digital Diary
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Parents receive structured daily updates on lessons and
                homework, with one-tap digital sign-off and direct teacher notes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#faf8f4] border border-stone-200/80 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-lg">
                Step-Protected Forums
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Dedicated classroom discussion boards for Step 1, Step 2, and
                Step 3 plus official Beem Africa SMS alerts to +255 numbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Class Breakdown: The 3 Developmental Stages */}
      <section id="classes" className="py-16 sm:py-24 bg-[#faf8f4] border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-aberdeen-700">
                Developmental Pathway
              </span>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-stone-900">
                Our 3 Developmental Class Stages
              </h2>
            </div>
            <p className="text-sm sm:text-base text-stone-600 max-w-xl">
              Each child is placed in their age-appropriate Step class with a
              dedicated lead teacher, tailored curriculum, and Step-specific
              parent-teacher forum.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {(["step_1", "step_2", "step_3"] as StepClassKey[]).map(
              (stepKey, idx) => {
                const meta = STEP_META[stepKey];
                return (
                  <div
                    key={stepKey}
                    className="bg-white rounded-3xl border border-stone-200/90 p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${meta.badgeColor}`}
                        >
                          {meta.shortLabel}
                        </span>
                        <span className="text-xs font-semibold text-stone-500">
                          Stage 0{idx + 1}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display text-2xl font-bold text-stone-900">
                          {meta.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-stone-600">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100">
                            <Clock className="w-3.5 h-3.5 text-aberdeen-700" />
                            {meta.ageRange}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100">
                            <Users className="w-3.5 h-3.5 text-aberdeen-700" />
                            {meta.ratio}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-stone-600 leading-relaxed">
                        {meta.summary}
                      </p>

                      <div className="space-y-2.5 pt-2 border-t border-stone-100">
                        <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                          Key Learning Milestones
                        </p>
                        <ul className="space-y-2">
                          {meta.pillars.map((pillar) => (
                            <li
                              key={pillar}
                              className="flex items-start gap-2 text-sm text-stone-700"
                            >
                              <CheckCircle2 className="w-4 h-4 text-aberdeen-600 shrink-0 mt-0.5" />
                              <span>{pillar}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-7 pt-4 border-t border-stone-100 flex items-center justify-between">
                      <a
                        href="#admissions"
                        onClick={() =>
                          setInquiryForm((f) => ({ ...f, step: stepKey }))
                        }
                        className="text-xs font-bold text-aberdeen-800 hover:text-aberdeen-600 inline-flex items-center gap-1"
                      >
                        <span>Inquire for {meta.shortLabel}</span>
                        <ChevronRight className="w-4 h-4" />
                      </a>
                      <GraduationCap className="w-5 h-5 text-stone-300" />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* About Us & Showcase Staff */}
      <section id="staff" className="py-16 sm:py-24 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-aberdeen-700">
              Qualified Educators &amp; Leadership
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-stone-900">
              Meet the Heart of Aberdeen
            </h2>
            <p className="mt-3 text-stone-600 leading-relaxed">
              Our teachers and leadership team are certified early childhood
              specialists dedicated to nurturing every pupil&apos;s intellectual
              and emotional growth.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STAFF_SHOWCASE.map((staff) => (
              <div
                key={staff.name}
                className="rounded-2xl bg-[#faf8f4] border border-stone-200/80 p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-base ${staff.color}`}
                    >
                      {staff.initials}
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-700">
                      {staff.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-stone-900">
                      {staff.name}
                    </h3>
                    <p className="text-xs font-semibold text-aberdeen-700 mt-0.5">
                      {staff.role}
                    </p>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {staff.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/70 flex items-center gap-2 text-xs text-stone-500">
                  <Award className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{staff.credentials}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* General Events & School News Calendar */}
      <section id="events" className="py-16 sm:py-24 bg-[#faf8f4] border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-aberdeen-700">
                School Calendar &amp; News
              </span>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-stone-900">
                Upcoming Events &amp; Term Highlights
              </h2>
            </div>
            <Link
              href="/portal"
              className="inline-flex items-center gap-2 text-sm font-semibold text-aberdeen-800 hover:text-aberdeen-600"
            >
              <Calendar className="w-4 h-4" />
              <span>View Full Forum Announcements in Portal</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {UPCOMING_EVENTS.map((evt) => (
              <div
                key={evt.title}
                className="bg-white rounded-2xl border border-stone-200/90 p-6 flex gap-5 items-start shadow-sm"
              >
                <div className="w-16 h-16 rounded-2xl bg-aberdeen-900 text-amber-300 flex flex-col items-center justify-center shrink-0 font-display">
                  <span className="text-[11px] uppercase tracking-wider font-sans font-bold text-amber-200">
                    {evt.date.split(" ")[0]}
                  </span>
                  <span className="text-xl font-bold leading-none mt-0.5">
                    {evt.date.split(" ")[1]}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                      {evt.category}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      {evt.day}
                    </span>
                  </div>
                  <h3 className="font-bold text-stone-900 text-base">
                    {evt.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {evt.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Admission Inquiry CTA Section */}
      <section id="admissions" className="py-16 sm:py-24 bg-aberdeen-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                Join the Aberdeen Family
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
                Schedule a Campus Visit or Request Admission Details
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Once enrolled, our Secretary or School Owner provisions your
                official <strong>+255 Parent Portal Account</strong>—giving you
                instant mobile access to your child&apos;s Daily Digital Diary,
                Step Forum, and fee statements.
              </p>

              <div className="space-y-3 pt-2 text-sm text-stone-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>
                    <strong>Step 1 (Daycare):</strong> 18 Months – 3 Years
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>
                    <strong>Step 2 (Nursery):</strong> 3 – 4.5 Years
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>
                    <strong>Step 3 (Pre-Unit):</strong> 4.5 – 6 Years
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-white text-stone-900 rounded-3xl p-6 sm:p-8 shadow-xl">
                {inquirySubmitted ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-stone-900">
                      Asante Sana, {inquiryForm.parentName}!
                    </h3>
                    <p className="text-sm text-stone-600 max-w-md mx-auto">
                      We have received your admission inquiry for{" "}
                      <strong>{inquiryForm.childName}</strong> (
                      {STEP_META[inquiryForm.step].shortLabel}). Our Secretary,{" "}
                      <strong>Bi. Salma Kikwete</strong>, will contact you on{" "}
                      <strong>{inquiryForm.phone}</strong> shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setInquirySubmitted(false)}
                      className="px-5 py-2.5 rounded-xl bg-aberdeen-800 text-white text-xs font-semibold"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <div>
                      <h3 className="font-display text-xl font-bold text-stone-900">
                        Quick Admission Inquiry
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Complete the form below and our Admissions Desk will
                        reach out via phone/SMS.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Parent / Guardian Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Bw. Josephat Mushi"
                          value={inquiryForm.parentName}
                          onChange={(e) =>
                            setInquiryForm({
                              ...inquiryForm,
                              parentName: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-aberdeen-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Tanzania Phone (+255XXXXXXXXX) *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+255754123456"
                          value={inquiryForm.phone}
                          onChange={(e) =>
                            setInquiryForm({
                              ...inquiryForm,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-aberdeen-600"
                        />
                      </div>
                    </div>

                    {phoneError && (
                      <p className="text-xs text-red-600 font-medium">
                        {phoneError}
                      </p>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Child&apos;s Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Liam Josephat"
                          value={inquiryForm.childName}
                          onChange={(e) =>
                            setInquiryForm({
                              ...inquiryForm,
                              childName: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-aberdeen-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Developmental Stage (Class) *
                        </label>
                        <select
                          value={inquiryForm.step}
                          onChange={(e) =>
                            setInquiryForm({
                              ...inquiryForm,
                              step: e.target.value as StepClassKey,
                            })
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
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Questions or Preferred Visit Date (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Any dietary notes, preferred tour morning, or questions..."
                        value={inquiryForm.notes}
                        onChange={(e) =>
                          setInquiryForm({
                            ...inquiryForm,
                            notes: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-aberdeen-600"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm shadow-sm transition-colors"
                    >
                      Send Admission Inquiry
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 py-10 text-xs border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-aberdeen-800 text-amber-300 flex items-center justify-center font-bold">
              A
            </div>
            <span>
              © {new Date().getFullYear()} Aberdeen Daycare and Nursery School.
              Optimized for Supabase Free Tier &amp; Beem Africa (+255).
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-white transition-colors">
              Portal Login
            </Link>
            <Link href="/portal" className="hover:text-white transition-colors">
              Interactive Role Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
