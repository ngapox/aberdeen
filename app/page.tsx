"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Baby,
  BookOpen,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Heart,
  Image as ImageIcon,
  Instagram,
  Lock,
  Music,
  Palette,
  Phone,
  Sparkles,
  Star,
  Sun,
  Users,
} from "lucide-react";
import { StepClassKey } from "@/lib/supabase/types";

const ENVIRONMENT_GALLERY = [
  {
    id: "env-1",
    title: "Sunshine Play Yard & Garden",
    subtitle: "Safe outdoor slides, tricycle track & morning sunshine",
    tag: "School Environment",
    slotHint: "/public/images/play-yard.jpg",
    aspect: "lg:col-span-7",
    bgGradient: "from-[#7aa7c2] via-[#548eb0] to-[#3b7a9e]",
    icon: Sun,
  },
  {
    id: "env-2",
    title: "Cozy Daycare Nap & Sensory Nook",
    subtitle: "Soft mats, gentle lullabies & tactile blocks for Step 1",
    tag: "Step 1 • Daycare",
    slotHint: "/public/images/daycare-nook.jpg",
    aspect: "lg:col-span-5",
    bgGradient: "from-[#e59500] via-[#d98800] to-[#b86f00]",
    icon: Baby,
  },
  {
    id: "env-3",
    title: "Creative Finger-Painting & Storytelling",
    subtitle: "Colorful easels, music & joyful group expression",
    tag: "Step 2 • Nursery",
    slotHint: "/public/images/art-studio.jpg",
    aspect: "lg:col-span-5",
    bgGradient: "from-[#3b7a9e] via-[#2f6280] to-[#1e3f52]",
    icon: Palette,
  },
  {
    id: "env-4",
    title: "Bright Reading & Numbers Corner",
    subtitle: "Phonics walls, storybooks & confident young leaders",
    tag: "Step 3 • Pre-Unit",
    slotHint: "/public/images/reading-corner.jpg",
    aspect: "lg:col-span-7",
    bgGradient: "from-[#679bb8] via-[#4a82a3] to-[#275169]",
    icon: BookOpen,
  },
];

const THREE_STEPS = [
  {
    key: "step_1" as StepClassKey,
    stepBadge: "Step 1",
    name: "Daycare & Early Toddler",
    ages: "18 Months – 3 Years",
    tagline: "Cuddles, sensory discovery, first words & happy songs.",
    highlights: ["Sensory & motor play", "Swahili & English songs", "Cozy naps & warm care"],
    accent: "border-[#e59500] bg-[#fffbeb]",
    pill: "bg-[#e59500] text-white",
    photoLabel: "Step 1 Classroom Photo Placeholder",
  },
  {
    key: "step_2" as StepClassKey,
    stepBadge: "Step 2",
    name: "Nursery & Mid Toddler",
    ages: "3 – 4.5 Years",
    tagline: "Playful phonics, counting games, painting & storytelling.",
    highlights: ["Jolly Phonics sounds", "Counting & color puzzles", "Creative arts & garden play"],
    accent: "border-[#7aa7c2] bg-[#f2f7fa]",
    pill: "bg-[#3b7a9e] text-white",
    photoLabel: "Step 2 Nursery Photo Placeholder",
  },
  {
    key: "step_3" as StepClassKey,
    stepBadge: "Step 3",
    name: "Pre-Unit (Primary Transition)",
    ages: "4.5 – 6 Years",
    tagline: "Confident early reading, number fluency & primary readiness.",
    highlights: ["Early reading & writing", "Everyday math & curiosity", "Standard 1 confidence"],
    accent: "border-[#3b7a9e] bg-[#e2eef5]/60",
    pill: "bg-[#1e3f52] text-[#fbd24d]",
    photoLabel: "Step 3 Pre-Unit Photo Placeholder",
  },
];

const STAFF_RECEPTION = [
  {
    name: "Madam Elizabeth Nkya",
    role: "Founder & School Director (Owner)",
    quote: "“Every child who walks through our gate is welcomed like family and inspired to shine.”",
    badge: "School Owner",
    photoSlot: "/public/images/staff-elizabeth-nkya.jpg",
    featured: true,
  },
  {
    name: "Bi. Salma Kikwete",
    role: "Reception & Admissions Secretary",
    quote: "Warmly welcoming parents, guiding tours, and keeping families connected.",
    badge: "Reception Desk",
    photoSlot: "/public/images/staff-secretary.jpg",
    featured: false,
  },
  {
    name: "Mwl. Grace Komba",
    role: "Step 1 Lead Educator (Daycare)",
    quote: "Nurturing our youngest toddlers with patience, music, and sensory play.",
    badge: "Step 1 Care",
    photoSlot: "/public/images/staff-step1.jpg",
    featured: false,
  },
  {
    name: "Mwl. David Massawe",
    role: "Step 2 Lead Educator (Nursery)",
    quote: "Turning phonics, numbers, and storytelling into an everyday adventure.",
    badge: "Step 2 Nursery",
    photoSlot: "/public/images/staff-step2.jpg",
    featured: false,
  },
  {
    name: "Mwl. Amina Said",
    role: "Step 3 Lead Educator (Pre-Unit)",
    quote: "Building proud readers and confident thinkers ready for primary school.",
    badge: "Step 3 Pre-Unit",
    photoSlot: "/public/images/staff-step3.jpg",
    featured: false,
  },
];

export default function PublicShowcasePage() {
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    parentName: "",
    phone: "+255",
    childName: "",
    step: "step_1" as StepClassKey,
  });
  const [phoneError, setPhoneError] = useState("");

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\+255\d{9}$/.test(inquiryForm.phone.trim())) {
      setPhoneError(
        "Please enter a valid Tanzania number starting with +255 (e.g. +255716004601)."
      );
      return;
    }
    setPhoneError("");
    setInquirySubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f8fb] text-[#132936] selection:bg-[#e59500] selection:text-white">
      {/* Top Reception Welcome Bar */}
      <div className="bg-[#1e3f52] text-white text-xs py-2.5 px-4 border-b border-[#2f6280]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e59500] text-white font-bold text-[11px] tracking-wide">
              <Sparkles className="w-3 h-3" /> Official School Motto
            </span>
            <span className="text-[#fbd24d] font-bold italic">
              &ldquo;Step by Step, the child is prospering&rdquo;
            </span>
          </div>
          <div className="flex items-center gap-5 text-[#e2eef5] font-medium">
            <a
              href="tel:+255716004601"
              className="inline-flex items-center gap-1.5 hover:text-[#fbd24d] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#fbd24d]" />
              <span>+255 716 004 601</span>
            </a>
            <a
              href="https://instagram.com/aberdeen_daycare_nursery"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#fbd24d] transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-[#fbd24d]" />
              <span>@aberdeen_daycare_nursery</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#c6dfed]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-2xl bg-[#3b7a9e] flex items-center justify-center text-[#fbd24d] shadow-md ring-4 ring-[#7aa7c2]/30 group-hover:bg-[#2f6280] transition-all">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-display text-xl sm:text-2xl font-bold tracking-tight text-[#1e3f52] leading-none">
                ABERDEEN
              </span>
              <span className="block text-xs font-bold uppercase tracking-widest text-[#e59500] mt-0.5">
                Daycare &amp; Nursery
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#275169]">
            <a href="#spaces" className="hover:text-[#e59500] transition-colors">
              Our Little World
            </a>
            <a href="#steps" className="hover:text-[#e59500] transition-colors">
              3 Learning Steps
            </a>
            <a href="#family" className="hover:text-[#e59500] transition-colors">
              Meet Our Family
            </a>
            <a href="#visit" className="hover:text-[#e59500] transition-colors">
              Visit Reception
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1e3f52] hover:bg-[#132936] text-white text-sm font-bold shadow-sm transition-all"
            >
              <Lock className="w-4 h-4 text-[#fbd24d]" />
              <span>Portal Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Reception Section — Signature Sky-Blue Canvas (#7aa7c2) & Golden Marigold (#e59500) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7aa7c2] via-[#679bb8] to-[#3b7a9e] text-white py-14 sm:py-20 border-b-4 border-[#e59500]">
        {/* Decorative Organic Shapes matching the Instagram graphic */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-6 right-10 w-64 h-64 rounded-full bg-[#e59500]/25 blur-2xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left: Warm, Creative Reception Welcome */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e3f52]/40 backdrop-blur-xs border border-white/25 text-xs font-bold tracking-wide uppercase">
                <Heart className="w-3.5 h-3.5 text-[#fbd24d] fill-[#fbd24d]" />
                <span>Aberdeen Daycare &amp; Nursery • Ages 18 Months – 6 Years</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight drop-shadow-xs">
                <span className="inline-block px-3.5 py-1 rounded-2xl bg-[#e59500] text-white transform -rotate-1 shadow-md">
                  Step by Step,
                </span>{" "}
                the Child is Prospering.
              </h1>

              <p className="text-base sm:text-lg text-white/95 leading-relaxed max-w-xl font-medium">
                Step inside <strong>Aberdeen Daycare &amp; Nursery School</strong>—where
                laughter fills the courtyard, curiosity leads every lesson, and
                parents stay connected to every smile through our live digital diary.
              </p>

              {/* Signature Speech-Bubble Quote (Inspired by Aberdeen's Instagram Graphic) */}
              <div className="relative max-w-lg pt-2">
                <div className="absolute -inset-1.5 rounded-3xl bg-[#e59500] transform rotate-1 opacity-90" />
                <div className="relative rounded-3xl bg-[#275169] px-6 py-4 border border-white/20 shadow-lg">
                  <p className="font-display italic text-sm sm:text-base text-white leading-snug">
                    &ldquo;Education is the warmest gift we give a child—sparking
                    wonder, kindness, and confidence from their very first steps.&rdquo;
                  </p>
                  <p className="text-xs font-bold text-[#fbd24d] mt-2">
                    — Madam Elizabeth Nkya • Founder &amp; Director
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#visit"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#e59500] hover:bg-[#c97d00] text-white font-bold text-sm shadow-lg transition-all"
                >
                  <span>Book a Warm School Visit</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <Link
                  href="/portal"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-[#f2f7fa] text-[#1e3f52] font-bold text-sm shadow-md transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#e59500]" />
                  <span>Open Parent &amp; Teacher Portal</span>
                </Link>
              </div>
            </div>

            {/* Right: Hero Visual Collage with Custom Photo Placeholders */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-lg">
                {/* Golden Marigold Brush Backing */}
                <div className="absolute -inset-3 rounded-[2.25rem] bg-[#e59500] transform -rotate-2 shadow-xl" />

                {/* Main Hero Photo Placeholder Frame */}
                <div className="relative rounded-[2rem] bg-[#1e3f52] border-4 border-white overflow-hidden shadow-2xl">
                  <div className="aspect-[4/3] bg-gradient-to-tr from-[#275169] via-[#3b7a9e] to-[#7aa7c2] p-6 flex flex-col justify-between relative">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-[#1e3f52] text-xs font-bold shadow-xs">
                        <Camera className="w-3.5 h-3.5 text-[#e59500]" />
                        Hero Photo Placeholder
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#e59500] text-white text-xs font-bold">
                        Happy Learners
                      </span>
                    </div>

                    {/* Center Illustration / Photo Guide */}
                    <div className="my-auto text-center space-y-2 py-6">
                      <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-xs border-2 border-dashed border-white/70 flex items-center justify-center mx-auto">
                        <ImageIcon className="w-8 h-8 text-white" />
                      </div>
                      <p className="font-display text-xl font-bold text-white">
                        Children Smiling &amp; Playing at Aberdeen
                      </p>
                      <p className="text-xs text-white/85 max-w-xs mx-auto">
                        Place your favorite main school photo here (e.g.{" "}
                        <code className="bg-black/25 px-1.5 py-0.5 rounded">
                          /public/images/hero-children.jpg
                        </code>
                        )
                      </p>
                    </div>

                    {/* Bottom Caption Bar */}
                    <div className="rounded-2xl bg-white/95 text-[#132936] p-3.5 flex items-center justify-between shadow-md">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#e59500] text-white flex items-center justify-center font-bold">
                          <Star className="w-5 h-5 fill-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1e3f52]">
                            Joyful Play, Safe Courtyard &amp; Caring Teachers
                          </p>
                          <p className="text-[11px] text-[#3b7a9e] font-semibold">
                            Reception Open Mon – Fri • Call +255 716 004 601
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Joyful Highlights Strip */}
      <section className="py-8 bg-white border-b border-[#c6dfed]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-[#f2f7fa] border border-[#c6dfed]">
              <Sun className="w-6 h-6 text-[#e59500] mx-auto mb-1" />
              <p className="font-display font-bold text-base text-[#1e3f52]">
                Safe &amp; Sunny Yard
              </p>
              <p className="text-xs text-[#2f6280]">Gated play &amp; garden discovery</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#fffbeb] border border-[#fde58a]">
              <Music className="w-6 h-6 text-[#e59500] mx-auto mb-1" />
              <p className="font-display font-bold text-base text-[#1e3f52]">
                Creative Play &amp; Songs
              </p>
              <p className="text-xs text-[#2f6280]">Phonics, art, rhythm &amp; stories</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#f2f7fa] border border-[#c6dfed]">
              <Heart className="w-6 h-6 text-[#3b7a9e] mx-auto mb-1" />
              <p className="font-display font-bold text-base text-[#1e3f52]">
                Loving Small Classes
              </p>
              <p className="text-xs text-[#2f6280]">Every child known &amp; cherished</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#fffbeb] border border-[#fde58a]">
              <BookOpen className="w-6 h-6 text-[#e59500] mx-auto mb-1" />
              <p className="font-display font-bold text-base text-[#1e3f52]">
                Daily Parent Diary
              </p>
              <p className="text-xs text-[#2f6280]">1-tap mobile updates &amp; SMS</p>
            </div>
          </div>
        </div>
      </section>

      {/* School Environment & Children in Action Photo Showcase (Placeholders) */}
      <section id="spaces" className="py-16 sm:py-20 bg-[#f4f8fb] border-b border-[#c6dfed]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e2eef5] text-[#2f6280] text-xs font-bold uppercase tracking-wider">
                <Camera className="w-3.5 h-3.5 text-[#e59500]" /> A Peek Inside Aberdeen
              </span>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#1e3f52]">
                Our School Environment &amp; Happy Moments
              </h2>
            </div>
            <p className="text-sm text-[#2f6280] max-w-md">
              Bright classrooms, cozy daycare corners, and an inviting outdoor
              play yard designed for safe everyday exploration.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            {ENVIRONMENT_GALLERY.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`${item.aspect} group relative rounded-3xl overflow-hidden border-4 border-white shadow-md hover:shadow-xl transition-all`}
                >
                  <div
                    className={`min-h-[260px] sm:min-h-[290px] bg-gradient-to-br ${item.bgGradient} p-6 sm:p-7 flex flex-col justify-between text-white relative`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-white/95 text-[#1e3f52] text-xs font-bold shadow-xs">
                        {item.tag}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/25 text-[11px] font-mono text-white/90">
                        <Camera className="w-3 h-3 text-[#fbd24d]" />
                        {item.slotHint}
                      </span>
                    </div>

                    <div className="my-auto py-4 flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-dashed border-white/70 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-[11px] uppercase tracking-widest font-bold text-[#fbd24d]">
                        Environment &amp; Children Photo Placeholder
                      </span>
                    </div>

                    <div className="bg-white/95 text-[#132936] rounded-2xl p-4 shadow-sm">
                      <h3 className="font-display text-lg font-bold text-[#1e3f52]">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#2f6280] mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The 3 Developmental Steps (Fun, Clear & Visual) */}
      <section id="steps" className="py-16 sm:py-20 bg-white border-b border-[#c6dfed]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#fffbeb] border border-[#fde58a] text-[#c97d00] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> &ldquo;Step by Step, the child is prospering&rdquo;
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1e3f52]">
              Three Joyful Stages of Early Learning
            </h2>
            <p className="text-sm text-[#2f6280]">
              From Step 1 to Step 3, we walk alongside every child as they blossom and prosper.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-7">
            {THREE_STEPS.map((st) => (
              <div
                key={st.key}
                className={`rounded-3xl border-2 ${st.accent} p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all`}
              >
                <div className="space-y-4">
                  {/* Classroom Photo Placeholder Banner */}
                  <div className="h-40 rounded-2xl bg-gradient-to-r from-[#7aa7c2] to-[#3b7a9e] border-2 border-dashed border-white/80 flex flex-col items-center justify-center text-white p-4 text-center relative overflow-hidden">
                    <ImageIcon className="w-7 h-7 text-[#fbd24d] mb-1.5" />
                    <p className="text-xs font-bold">{st.photoLabel}</p>
                    <span
                      className={`mt-2 px-3 py-0.5 rounded-full text-[11px] font-bold ${st.pill}`}
                    >
                      {st.stepBadge} • {st.ages}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl font-bold text-[#1e3f52]">
                      {st.name}
                    </h3>
                    <p className="text-sm text-[#2f6280] mt-1 leading-relaxed">
                      {st.tagline}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-2 border-t border-[#c6dfed]/70">
                    {st.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1e3f52]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#e59500] shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-[#c6dfed]/70 flex items-center justify-between">
                  <a
                    href="#visit"
                    onClick={() =>
                      setInquiryForm((f) => ({ ...f, step: st.key }))
                    }
                    className="text-xs font-bold text-[#3b7a9e] hover:text-[#e59500] inline-flex items-center gap-1"
                  >
                    <span>Enroll in {st.stepBadge}</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                  <span className="text-[11px] font-semibold text-[#548eb0]">
                    Dedicated Step Forum
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Family — Madam Elizabeth Nkya & Caring Educators (With Portrait Placeholders) */}
      <section id="family" className="py-16 sm:py-20 bg-[#e2eef5]/70 border-b border-[#c6dfed]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#3b7a9e] text-xs font-bold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-[#e59500]" /> Our Caring Team
              </span>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#1e3f52]">
                Meet Madam Elizabeth Nkya &amp; Our Educators
              </h2>
            </div>
            <p className="text-sm text-[#2f6280] max-w-md">
              Warm, qualified teachers who greet every child by name at the
              morning gate.
            </p>
          </div>

          {/* Director / Owner Spotlight + Staff Portrait Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {STAFF_RECEPTION.map((member) => (
              <div
                key={member.name}
                className={`rounded-3xl p-5 flex flex-col justify-between border-2 transition-all ${
                  member.featured
                    ? "bg-[#1e3f52] text-white border-[#e59500] shadow-lg sm:col-span-2 lg:col-span-1"
                    : "bg-white text-[#132936] border-white shadow-xs"
                }`}
              >
                <div className="space-y-4">
                  {/* Staff Portrait Photo Placeholder */}
                  <div
                    className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center relative overflow-hidden ${
                      member.featured
                        ? "bg-[#3b7a9e] border-[#fbd24d]"
                        : "bg-[#f2f7fa] border-[#9bc6de]"
                    }`}
                  >
                    <Camera
                      className={`w-7 h-7 mb-1.5 ${
                        member.featured ? "text-[#fbd24d]" : "text-[#3b7a9e]"
                      }`}
                    />
                    <span
                      className={`text-[11px] font-bold ${
                        member.featured ? "text-white" : "text-[#1e3f52]"
                      }`}
                    >
                      Staff Photo Placeholder
                    </span>
                    <span
                      className={`text-[10px] font-mono mt-0.5 ${
                        member.featured ? "text-[#c6dfed]" : "text-[#548eb0]"
                      }`}
                    >
                      {member.photoSlot}
                    </span>
                  </div>

                  <div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        member.featured
                          ? "bg-[#e59500] text-white"
                          : "bg-[#e2eef5] text-[#2f6280]"
                      }`}
                    >
                      {member.badge}
                    </span>
                    <h3
                      className={`font-display text-lg font-bold mt-2 ${
                        member.featured ? "text-white" : "text-[#1e3f52]"
                      }`}
                    >
                      {member.name}
                    </h3>
                    <p
                      className={`text-xs font-semibold ${
                        member.featured ? "text-[#fbd24d]" : "text-[#e59500]"
                      }`}
                    >
                      {member.role}
                    </p>
                  </div>

                  <p
                    className={`text-xs leading-relaxed ${
                      member.featured ? "text-[#e2eef5]" : "text-[#2f6280]"
                    }`}
                  >
                    {member.quote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reception Desk & Book a Visit Section */}
      <section
        id="visit"
        className="py-16 sm:py-20 bg-gradient-to-br from-[#275169] via-[#1e3f52] to-[#132936] text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e59500] text-white text-xs font-bold uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" /> School Reception Desk
              </span>

              <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
                Come Visit Us or Say Hello to Madam Elizabeth Nkya!
              </h2>

              <p className="text-sm sm:text-base text-[#c6dfed] leading-relaxed">
                We love welcoming parents for a morning tour of our daycare and
                nursery classrooms. Call us directly, follow our daily moments on
                Instagram, or leave your number below.
              </p>

              <div className="space-y-3.5 pt-2">
                <a
                  href="tel:+255716004601"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#e59500] text-white flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#c6dfed] font-semibold">
                      Direct School Reception &amp; Admissions
                    </p>
                    <p className="font-display text-lg font-bold text-white">
                      +255 716 004 601
                    </p>
                  </div>
                </a>

                <a
                  href="https://instagram.com/aberdeen_daycare_nursery"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#7aa7c2] text-[#132936] flex items-center justify-center shrink-0">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#c6dfed] font-semibold">
                      Follow Our Daily School Moments on Instagram
                    </p>
                    <p className="font-display text-lg font-bold text-[#fbd24d]">
                      @aberdeen_daycare_nursery
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Right: Simple Reception Visit Form */}
            <div className="lg:col-span-6">
              <div className="bg-white text-[#132936] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-[#7aa7c2]">
                {inquirySubmitted ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-[#e2eef5] text-[#3b7a9e] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-[#e59500]" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-[#1e3f52]">
                      Karibu Sana, {inquiryForm.parentName}!
                    </h3>
                    <p className="text-sm text-[#2f6280] max-w-md mx-auto">
                      Madam Elizabeth Nkya &amp; our reception desk have received
                      your inquiry for <strong>{inquiryForm.childName}</strong>.
                      We will reach out to you on{" "}
                      <strong>{inquiryForm.phone}</strong> shortly!
                    </p>
                    <button
                      type="button"
                      onClick={() => setInquirySubmitted(false)}
                      className="px-5 py-2.5 rounded-xl bg-[#3b7a9e] text-white text-xs font-bold"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#e59500]">
                        Quick Admission &amp; Tour Request
                      </span>
                      <h3 className="font-display text-2xl font-bold text-[#1e3f52]">
                        Introduce Your Little One
                      </h3>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#275169] mb-1">
                          Parent / Guardian Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mama / Baba Liam"
                          value={inquiryForm.parentName}
                          onChange={(e) =>
                            setInquiryForm({
                              ...inquiryForm,
                              parentName: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#c6dfed] text-sm focus:outline-none focus:ring-2 focus:ring-[#3b7a9e]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#275169] mb-1">
                          Phone Number (+255) *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+255716004601"
                          value={inquiryForm.phone}
                          onChange={(e) =>
                            setInquiryForm({
                              ...inquiryForm,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#c6dfed] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#3b7a9e]"
                        />
                      </div>
                    </div>

                    {phoneError && (
                      <p className="text-xs text-red-600 font-semibold">
                        {phoneError}
                      </p>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#275169] mb-1">
                          Child&apos;s Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Liam"
                          value={inquiryForm.childName}
                          onChange={(e) =>
                            setInquiryForm({
                              ...inquiryForm,
                              childName: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#c6dfed] text-sm focus:outline-none focus:ring-2 focus:ring-[#3b7a9e]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#275169] mb-1">
                          Class Stage *
                        </label>
                        <select
                          value={inquiryForm.step}
                          onChange={(e) =>
                            setInquiryForm({
                              ...inquiryForm,
                              step: e.target.value as StepClassKey,
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#c6dfed] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3b7a9e]"
                        >
                          <option value="step_1">
                            Step 1 (Daycare • 18m – 3y)
                          </option>
                          <option value="step_2">
                            Step 2 (Nursery • 3 – 4.5y)
                          </option>
                          <option value="step_3">
                            Step 3 (Pre-Unit • 4.5 – 6y)
                          </option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-2xl bg-[#e59500] hover:bg-[#c97d00] text-white font-bold text-sm shadow-md transition-all"
                    >
                      Request a Call or School Tour
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#132936] text-[#9bc6de] py-8 text-xs border-t border-[#1e3f52]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#e59500] text-white flex items-center justify-center font-bold">
              A
            </div>
            <span>
              © {new Date().getFullYear()} Aberdeen Daycare &amp; Nursery School •
              Director: Madam Elizabeth Nkya • +255 716 004 601
            </span>
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <a
              href="https://instagram.com/aberdeen_daycare_nursery"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              @aberdeen_daycare_nursery
            </a>
            <Link href="/login" className="hover:text-white transition-colors">
              Portal Login
            </Link>
            <Link href="/portal" className="hover:text-white transition-colors">
              School Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
