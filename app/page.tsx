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
  Lock,
  MapPin,
  Palette,
  Phone,
  Smile,
  Sparkles,
  Star,
  Sun,
  Users,
} from "lucide-react";
import { StepClassKey } from "@/lib/supabase/types";

const PLAYFUL_STEPS: {
  key: StepClassKey;
  badge: string;
  title: string;
  age: string;
  tagline: string;
  cardBg: string;
  badgeBg: string;
  accentColor: string;
  photoUrl: string;
  photoPlaceholderLabel: string;
  highlights: string[];
}[] = [
  {
    key: "step_1",
    badge: "Step 1 • Daycare",
    title: "Little Explorers",
    age: "18 Months – 3 Years",
    tagline:
      "Sensory play, singing, cuddles, and joyful first friendships in a safe home-away-from-home.",
    cardBg: "bg-[#FFF9E6] border-[#FFE082]",
    badgeBg: "bg-[#FFB703] text-[#144D63]",
    accentColor: "text-[#D98A00]",
    photoUrl:
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80",
    photoPlaceholderLabel: "Photo Placeholder: Step 1 Toddlers Playing with Blocks",
    highlights: [
      "Sensory & Montessori play",
      "Swahili & English songs",
      "Cozy naps & yummy meals",
    ],
  },
  {
    key: "step_2",
    badge: "Step 2 • Nursery",
    title: "Curious Builders",
    age: "3 – 4.5 Years",
    tagline:
      "Jolly Phonics sounds, finger painting, counting games, and outdoor garden adventures.",
    cardBg: "bg-[#E8F7FF] border-[#9AD9F5]",
    badgeBg: "bg-[#38A3D0] text-white",
    accentColor: "text-[#1F6E8C]",
    photoUrl:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80",
    photoPlaceholderLabel: "Photo Placeholder: Step 2 Nursery Painting & Phonics",
    highlights: [
      "Fun Jolly Phonics sounds",
      "Hands-on counting & puzzles",
      "Painting, storytelling & play",
    ],
  },
  {
    key: "step_3",
    badge: "Step 3 • Pre-Unit",
    title: "Rising Stars",
    age: "4.5 – 6 Years",
    tagline:
      "Confident early reading, fun number games, and leadership skills ready for Primary Standard 1!",
    cardBg: "bg-[#EDFAF2] border-[#A3E4BC]",
    badgeBg: "bg-[#2FB36D] text-white",
    accentColor: "text-[#1E874F]",
    photoUrl:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    photoPlaceholderLabel: "Photo Placeholder: Step 3 Pre-Unit Reading Circle",
    highlights: [
      "Reading & neat handwriting",
      "Fun addition & discovery",
      "Ready for Primary School!",
    ],
  },
];

const CAMPUS_GALLERY = [
  {
    title: "Bright Montessori Classrooms",
    tag: "Indoor Learning",
    placeholderNote: "Replace with Aberdeen Classroom Photo",
    image:
      "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80",
    rotation: "-rotate-1",
    frameColor: "bg-[#FFF8E1] border-[#FFD54F]",
  },
  {
    title: "Safe Shaded Play Courtyard",
    tag: "Outdoor Fun",
    placeholderNote: "Replace with Aberdeen Playground Photo",
    image:
      "https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?auto=format&fit=crop&w=800&q=80",
    rotation: "rotate-1",
    frameColor: "bg-[#E6F6FF] border-[#81D4FA]",
  },
  {
    title: "Creative Arts & Story Corner",
    tag: "Imagination",
    placeholderNote: "Replace with Kids Art & Reading Photo",
    image:
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
    rotation: "-rotate-1",
    frameColor: "bg-[#FFF3E0] border-[#FFCC80]",
  },
  {
    title: "Nutritious Meals & Cozy Naps",
    tag: "Healthy Care",
    placeholderNote: "Replace with Dining / Nap Room Photo",
    image:
      "https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=800&q=80",
    rotation: "rotate-1",
    frameColor: "bg-[#E8F8F0] border-[#A5D6A7]",
  },
];

const FRIENDLY_TEAM = [
  {
    name: "Dr. Neema Mwakasege",
    role: "Founder & School Director",
    badge: "Mama Aberdeen",
    loveNote: "Loves children's storybooks & morning songs",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    bg: "bg-[#FFF9E6] border-[#FFE082]",
  },
  {
    name: "Mwl. Grace Komba",
    role: "Step 1 (Daycare) Lead Teacher",
    badge: "Step 1 Care",
    loveNote: "Montessori toddler specialist & gentle routines",
    photo:
      "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80",
    bg: "bg-[#E8F7FF] border-[#9AD9F5]",
  },
  {
    name: "Mwl. David Massawe",
    role: "Step 2 (Nursery) Lead Teacher",
    badge: "Step 2 Phonics",
    loveNote: "Jolly Phonics, counting games & big smiles",
    photo:
      "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=600&q=80",
    bg: "bg-[#EDFAF2] border-[#A3E4BC]",
  },
  {
    name: "Mwl. Amina Said",
    role: "Step 3 (Pre-Unit) Lead Teacher",
    badge: "Step 3 Prep",
    loveNote: "Gets little scholars confident for Standard 1",
    photo:
      "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80",
    bg: "bg-[#FFF3E0] border-[#FFCC80]",
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
        "Please enter a valid Tanzania phone number starting with +255 (e.g. +255754123456)."
      );
      return;
    }
    setPhoneError("");
    setInquirySubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4FBFF] text-[#144D63] selection:bg-[#FFB703] selection:text-[#144D63]">
      {/* Cheerful Top Sunshine Ribbon */}
      <div className="bg-[#FFE58F] text-[#144D63] text-xs sm:text-sm py-2.5 px-4 border-b-2 border-[#FFD24C]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 font-bold">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFB703] text-[#144D63] text-[11px] uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5" /> 2026 / 2027 Admissions Open!
            </span>
            <span>
              Welcoming Ages 18 Months – 6 Years (Step 1, Step 2 &amp; Step 3)
            </span>
          </div>
          <div className="hidden md:flex items-center gap-5 text-xs font-extrabold text-[#1F6E8C]">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#E08E00]" /> +255 754 100 100
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E08E00]" /> Tanzania
            </span>
          </div>
        </div>
      </div>

      {/* Playful Floating Header */}
      <header className="sticky top-0 z-40 bg-[#F4FBFF]/90 backdrop-blur-md border-b-2 border-[#D4EEFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-[#FFB703] border-2 border-[#144D63] flex items-center justify-center text-[#144D63] shadow-[0_4px_0_#144D63] group-hover:scale-105 transition-transform">
              <Sun className="w-7 h-7 fill-[#FFF6D6]" />
            </div>
            <div>
              <span
                style={{ fontFamily: "var(--font-display)" }}
                className="block text-xl sm:text-2xl font-bold tracking-tight text-[#144D63] leading-none"
              >
                Aberdeen
              </span>
              <span className="block text-xs font-extrabold text-[#3888A8] tracking-wide mt-0.5">
                Daycare &amp; Nursery School
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-extrabold text-[#1F6E8C]">
            <a
              href="#classes"
              className="hover:text-[#E08E00] transition-colors"
            >
              Our 3 Classes
            </a>
            <a
              href="#gallery"
              className="hover:text-[#E08E00] transition-colors"
            >
              School Life Photos
            </a>
            <a
              href="#teachers"
              className="hover:text-[#E08E00] transition-colors"
            >
              Meet Our Teachers
            </a>
            <a
              href="#visit"
              className="hover:text-[#E08E00] transition-colors"
            >
              Join Us
            </a>
          </nav>

          {/* Clean Staff & Parent Portal Login Button */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#2B7A9B] hover:bg-[#1F627E] text-white text-xs sm:text-sm font-extrabold border-2 border-[#144D63] shadow-[0_3px_0_#144D63] active:translate-y-0.5 transition-all"
            >
              <Lock className="w-4 h-4 text-[#FFD15C]" />
              <span>Staff &amp; Parent Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Joyful Sky-Blue & Sunshine Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#D8F1FF] via-[#EAF8FF] to-[#F4FBFF] pt-10 pb-20 sm:pt-14 sm:pb-24">
        {/* Decorative Playful Clouds & Stars */}
        <div className="pointer-events-none select-none absolute top-8 left-8 hidden lg:block animate-float-slow">
          <div className="w-16 h-16 rounded-full bg-[#FFE082]/70 blur-xs" />
        </div>
        <div className="pointer-events-none select-none absolute bottom-12 right-10 hidden lg:block animate-float-delayed">
          <div className="w-24 h-24 rounded-full bg-[#9AD9F5]/50 blur-sm" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Playful Story & CTAs */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-[#8AD1F0] text-[#1F6E8C] text-xs sm:text-sm font-extrabold shadow-xs">
                <Heart className="w-4 h-4 text-[#FFB703] fill-[#FFB703]" />
                <span>A Happy, Safe &amp; Loving Start for Your Little One!</span>
              </div>

              <h1
                style={{ fontFamily: "var(--font-display)" }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#144D63] tracking-tight leading-[1.12]"
              >
                Where Little Smiles Grow Into{" "}
                <span className="inline-block px-3 py-0.5 rounded-2xl bg-[#FFB703] text-[#144D63] -rotate-1 shadow-[0_4px_0_#144D63]">
                  Big Dreams!
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#28667E] font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Welcome to <strong>Aberdeen Daycare &amp; Nursery School</strong>!
                We turn every day into a joyful adventure of play, songs,
                phonics, and discovery for children aged{" "}
                <strong>18 months to 6 years</strong>.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#visit"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-[#FFB703] hover:bg-[#FFA500] text-[#144D63] font-extrabold text-base border-2 border-[#144D63] shadow-[0_5px_0_#144D63] active:translate-y-0.5 transition-all"
                >
                  <span>Book a School Tour</span>
                  <ChevronRight className="w-5 h-5" />
                </a>
                <a
                  href="#classes"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-[#FFF9E6] text-[#144D63] border-2 border-[#8AD1F0] font-extrabold text-base shadow-sm transition-all"
                >
                  <Sparkles className="w-5 h-5 text-[#FFB703]" />
                  <span>See Our 3 Classes</span>
                </a>
              </div>

              {/* Cute Mini Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 max-w-lg mx-auto lg:mx-0">
                <div className="p-3 rounded-2xl bg-white/90 border-2 border-[#BCE5F9] text-center">
                  <p
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-xl sm:text-2xl font-bold text-[#144D63]"
                  >
                    18m – 6y
                  </p>
                  <p className="text-[11px] font-bold text-[#3888A8]">
                    Step 1, 2 &amp; 3
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-[#FFF9E6] border-2 border-[#FFE082] text-center">
                  <p
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-xl sm:text-2xl font-bold text-[#D98A00]"
                  >
                    100% Safe
                  </p>
                  <p className="text-[11px] font-bold text-[#8C6200]">
                    Caring Courtyard
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-white/90 border-2 border-[#BCE5F9] text-center">
                  <p
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-xl sm:text-2xl font-bold text-[#144D63]"
                  >
                    Daily App
                  </p>
                  <p className="text-[11px] font-bold text-[#3888A8]">
                    Parent Diary Updates
                  </p>
                </div>
              </div>
            </div>

            {/* Right Playful Photo Collage Frame (With Placeholders for School & Kids) */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-lg">
                {/* Decorative Yellow Brush Blob Behind Photo */}
                <div className="absolute -inset-3 rounded-[2.5rem] bg-[#FFB703] rotate-2 border-2 border-[#144D63] shadow-[0_8px_0_#144D63]" />

                {/* Main Hero Photo Card */}
                <div className="relative rounded-[2.2rem] bg-white border-4 border-[#144D63] p-3 sm:p-4 space-y-3">
                  <div className="relative h-64 sm:h-80 w-full rounded-[1.6rem] overflow-hidden bg-[#D8F1FF]">
                    <img
                      src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=80"
                      alt="Happy Aberdeen Nursery Children"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-[#144D63] text-[11px] font-extrabold text-[#144D63] shadow-xs">
                      <Camera className="w-3.5 h-3.5 text-[#FFB703]" />
                      <span>Photo Placeholder: Happy Aberdeen Kids</span>
                    </div>
                  </div>

                  {/* Two Smaller Playful Environment Placeholders Below */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative h-32 rounded-2xl overflow-hidden border-2 border-[#9AD9F5] bg-[#E8F7FF]">
                      <img
                        src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80"
                        alt="Classroom Sensory Play"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-white/90 text-[10px] font-extrabold text-[#144D63] truncate">
                        📸 Montessori Play Corner
                      </span>
                    </div>
                    <div className="relative h-32 rounded-2xl overflow-hidden border-2 border-[#FFE082] bg-[#FFF9E6]">
                      <img
                        src="https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?auto=format&fit=crop&w=600&q=80"
                        alt="Outdoor School Playground"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-white/90 text-[10px] font-extrabold text-[#144D63] truncate">
                        📸 Shaded Play Garden
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Kids Love Aberdeen - 4 Fun Playful Pills */}
      <section className="py-12 bg-white border-y-2 border-[#D4EEFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-3xl bg-[#FFF9E6] border-2 border-[#FFE082] flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#FFB703] text-[#144D63] flex items-center justify-center shadow-xs">
                <Palette className="w-6 h-6" />
              </div>
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="font-bold text-lg text-[#144D63]"
              >
                Play &amp; Create
              </h3>
              <p className="text-xs sm:text-sm text-[#497B90] font-medium">
                Painting, blocks, music, and outdoor garden discovery every day.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#E8F7FF] border-2 border-[#9AD9F5] flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#38A3D0] text-white flex items-center justify-center shadow-xs">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="font-bold text-lg text-[#144D63]"
              >
                Jolly Phonics
              </h3>
              <p className="text-xs sm:text-sm text-[#497B90] font-medium">
                Fun storytelling, early reading, and counting through games.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#EDFAF2] border-2 border-[#A3E4BC] flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#2FB36D] text-white flex items-center justify-center shadow-xs">
                <Heart className="w-6 h-6" />
              </div>
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="font-bold text-lg text-[#144D63]"
              >
                Warm &amp; Safe
              </h3>
              <p className="text-xs sm:text-sm text-[#497B90] font-medium">
                Gated compound, freshly cooked yummy meals, and loving teachers.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFF3E0] border-2 border-[#FFCC80] flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#FF9800] text-white flex items-center justify-center shadow-xs">
                <Smile className="w-6 h-6" />
              </div>
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="font-bold text-lg text-[#144D63]"
              >
                Parent Portal
              </h3>
              <p className="text-xs sm:text-sm text-[#497B90] font-medium">
                Enrolled parents log in to view daily diaries &amp; SMS updates!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our 3 Fun Class Stages (With Photo Placeholders) */}
      <section id="classes" className="py-16 sm:py-20 bg-[#F4FBFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFE58F] text-[#144D63] text-xs font-extrabold uppercase tracking-wider">
              <Baby className="w-4 h-4" /> Growing Step by Step
            </span>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-3xl sm:text-4xl font-bold text-[#144D63]"
            >
              Our 3 Joyful Class Stages
            </h2>
            <p className="text-sm sm:text-base text-[#38758E] font-medium">
              Every child learns with friends their own age in a bright,
              caring classroom!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {PLAYFUL_STEPS.map((cls) => (
              <div
                key={cls.key}
                className={`rounded-[2rem] border-3 ${cls.cardBg} p-5 sm:p-6 shadow-[0_6px_0_rgba(20,77,99,0.12)] hover:-translate-y-1 transition-all flex flex-col justify-between space-y-5`}
              >
                <div className="space-y-4">
                  {/* Class Photo Placeholder */}
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden border-2 border-white shadow-xs bg-white">
                    <img
                      src={cls.photoUrl}
                      alt={cls.title}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-extrabold shadow-xs ${cls.badgeBg}`}
                    >
                      {cls.badge}
                    </span>
                    <span className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-lg bg-white/90 text-[10px] font-bold text-[#144D63] truncate">
                      📷 {cls.photoPlaceholderLabel}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h3
                        style={{ fontFamily: "var(--font-display)" }}
                        className="text-2xl font-bold text-[#144D63]"
                      >
                        {cls.title}
                      </h3>
                      <span
                        className={`text-xs font-extrabold px-2.5 py-1 rounded-xl bg-white border border-current ${cls.accentColor}`}
                      >
                        {cls.age}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#28667E] font-medium leading-relaxed">
                      {cls.tagline}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-2">
                    {cls.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#144D63] bg-white/80 px-3 py-2 rounded-xl"
                      >
                        <Star className="w-4 h-4 text-[#FFB703] fill-[#FFB703] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#visit"
                  onClick={() =>
                    setInquiryForm((f) => ({ ...f, step: cls.key }))
                  }
                  className="w-full py-3 rounded-xl bg-white hover:bg-[#FFB703] text-[#144D63] font-extrabold text-xs sm:text-sm border-2 border-[#144D63] flex items-center justify-center gap-1.5 shadow-[0_3px_0_#144D63] transition-colors"
                >
                  <span>Enroll in {cls.badge}</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Light & Cheerful Screenshot-Inspired Inspiration Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#BCE4FA]/60 border-y-2 border-[#9AD9F5]">
        <div className="max-w-5xl mx-auto rounded-[2.2rem] bg-[#E3F4FD] border-3 border-[#4BA3C7] p-6 sm:p-10 relative overflow-hidden shadow-sm">
          {/* Sunny Yellow Brush Accent from Screenshot */}
          <div className="hidden sm:block absolute -right-10 -bottom-10 w-52 h-52 rounded-full bg-[#FFB703]/40 pointer-events-none" />

          <div className="relative grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-[#FFB703] text-[#144D63] text-xs font-extrabold uppercase tracking-wider">
                #NurturingYoungMinds
              </span>
              <p
                style={{ fontFamily: "var(--font-display)" }}
                className="text-xl sm:text-2xl font-bold text-[#144D63] leading-snug"
              >
                &ldquo;Every child deserves a joyful, curiosity-filled start
                where kindness, play, and discovery go hand in hand.&rdquo;
              </p>
              <p className="text-xs font-extrabold text-[#2B7A9B] uppercase tracking-wider">
                — The Aberdeen Daycare &amp; Nursery Family
              </p>
            </div>
            <div className="md:col-span-4 flex justify-center md:justify-end">
              <a
                href="#visit"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2B7A9B] hover:bg-[#1F627E] text-white font-extrabold text-sm border-2 border-[#144D63] shadow-[0_4px_0_#144D63] transition-all"
              >
                <span>Come Visit Us!</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* School Environment & Happy Kids Photo Placeholders */}
      <section id="gallery" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8F7FF] border border-[#9AD9F5] text-[#1F6E8C] text-xs font-extrabold uppercase tracking-wider">
              <Camera className="w-4 h-4 text-[#FFB703]" /> Peek Inside Aberdeen
            </span>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-3xl sm:text-4xl font-bold text-[#144D63]"
            >
              Our Happy School Environment
            </h2>
            <p className="text-sm sm:text-base text-[#38758E] font-medium">
              Colorful classrooms, safe play areas, and spaces designed just for
              little hands and feet.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAMPUS_GALLERY.map((item) => (
              <div
                key={item.title}
                className={`rounded-3xl border-3 ${item.frameColor} ${item.rotation} hover:rotate-0 transition-transform p-3.5 space-y-3 shadow-sm`}
              >
                <div className="relative h-52 rounded-2xl overflow-hidden bg-white border border-white">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 text-[#144D63] text-[10px] font-extrabold shadow-xs">
                    {item.tag}
                  </span>
                </div>
                <div className="px-1">
                  <h3
                    style={{ fontFamily: "var(--font-display)" }}
                    className="font-bold text-base text-[#144D63]"
                  >
                    {item.title}
                  </h3>
                  <p className="text-[11px] font-bold text-[#3888A8] mt-0.5">
                    📷 {item.placeholderNote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Caring Teachers (Friendly & Short) */}
      <section
        id="teachers"
        className="py-16 sm:py-20 bg-[#F4FBFF] border-t-2 border-[#D4EEFC]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFE58F] text-[#144D63] text-xs font-extrabold uppercase tracking-wider">
              <Users className="w-4 h-4" /> Caring Hearts
            </span>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-3xl sm:text-4xl font-bold text-[#144D63]"
            >
              Meet Our Friendly Teachers
            </h2>
            <p className="text-sm sm:text-base text-[#38758E] font-medium">
              Warm, certified educators who know every child by name and smile.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FRIENDLY_TEAM.map((member) => (
              <div
                key={member.name}
                className={`rounded-3xl border-2 ${member.bg} p-5 text-center space-y-3 shadow-xs hover:-translate-y-1 transition-transform`}
              >
                <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="inline-block px-3 py-0.5 rounded-full bg-white text-[#1F6E8C] text-[11px] font-extrabold border border-[#BCE5F9]">
                  {member.badge}
                </span>
                <div>
                  <h3
                    style={{ fontFamily: "var(--font-display)" }}
                    className="font-bold text-lg text-[#144D63]"
                  >
                    {member.name}
                  </h3>
                  <p className="text-xs font-extrabold text-[#2B7A9B]">
                    {member.role}
                  </p>
                </div>
                <p className="text-xs text-[#38758E] font-medium">
                  {member.loveNote}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Joyful Book a Tour / Admission Inquiry Section */}
      <section
        id="visit"
        className="py-16 sm:py-20 bg-gradient-to-b from-[#D8F1FF] to-[#BCE4FA] border-t-2 border-[#9AD9F5]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFB703] text-[#144D63] text-xs font-extrabold uppercase tracking-wider shadow-xs">
                <Calendar className="w-4 h-4" /> Come Say Karibu!
              </span>
              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="text-3xl sm:text-4xl font-bold text-[#144D63] leading-tight"
              >
                Book a Fun Morning Tour With Your Child!
              </h2>
              <p className="text-sm sm:text-base text-[#1F5A73] font-medium leading-relaxed">
                Come see our colorful classrooms, meet our teachers, and let
                your child play in our courtyard! Once enrolled, our Secretary
                activates your private <strong>+255 Parent Login</strong>.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-white/90 border-2 border-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFB703] text-[#144D63] flex items-center justify-center font-bold">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#3888A8] uppercase">
                      Call Admissions
                    </p>
                    <p className="font-extrabold text-sm text-[#144D63]">
                      +255 754 100 100
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/90 border-2 border-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#38A3D0] text-white flex items-center justify-center font-bold">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#3888A8] uppercase">
                      Already Enrolled?
                    </p>
                    <Link
                      href="/login"
                      className="font-extrabold text-sm text-[#1F6E8C] underline"
                    >
                      Open Portal Login →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple, Friendly Inquiry Card */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-[2.2rem] border-3 border-[#144D63] p-6 sm:p-8 shadow-[0_8px_0_#144D63]">
                {inquirySubmitted ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#FFF9E6] border-2 border-[#FFB703] text-[#D98A00] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <h3
                      style={{ fontFamily: "var(--font-display)" }}
                      className="text-2xl font-bold text-[#144D63]"
                    >
                      Asante Sana, {inquiryForm.parentName}!
                    </h3>
                    <p className="text-sm text-[#38758E] font-medium max-w-md mx-auto">
                      We can&apos;t wait to meet{" "}
                      <strong>{inquiryForm.childName}</strong>! Our Admissions
                      Secretary will call or SMS you on{" "}
                      <strong>{inquiryForm.phone}</strong> shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setInquirySubmitted(false)}
                      className="px-6 py-2.5 rounded-xl bg-[#FFB703] text-[#144D63] font-extrabold text-xs border-2 border-[#144D63]"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <div>
                      <h3
                        style={{ fontFamily: "var(--font-display)" }}
                        className="text-2xl font-bold text-[#144D63]"
                      >
                        Quick Admission &amp; Visit Form
                      </h3>
                      <p className="text-xs font-bold text-[#3888A8] mt-0.5">
                        Leave your details below and we&apos;ll call you right
                        back!
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-[#144D63] mb-1">
                          Parent / Guardian Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mama Liam"
                          value={inquiryForm.parentName}
                          onChange={(e) =>
                            setInquiryForm({
                              ...inquiryForm,
                              parentName: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#BCE5F9] text-sm font-medium focus:outline-none focus:border-[#2B7A9B]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold text-[#144D63] mb-1">
                          Phone Number (+255) *
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
                          className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#BCE5F9] text-sm font-mono focus:outline-none focus:border-[#2B7A9B]"
                        />
                      </div>
                    </div>

                    {phoneError && (
                      <p className="text-xs text-red-600 font-bold">
                        {phoneError}
                      </p>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-[#144D63] mb-1">
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
                          className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#BCE5F9] text-sm font-medium focus:outline-none focus:border-[#2B7A9B]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold text-[#144D63] mb-1">
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
                          className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#BCE5F9] text-sm font-bold bg-white focus:outline-none focus:border-[#2B7A9B]"
                        >
                          <option value="step_1">
                            Step 1 • Daycare (18m – 3 yrs)
                          </option>
                          <option value="step_2">
                            Step 2 • Nursery (3 – 4.5 yrs)
                          </option>
                          <option value="step_3">
                            Step 3 • Pre-Unit (4.5 – 6 yrs)
                          </option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-2xl bg-[#FFB703] hover:bg-[#FFA500] text-[#144D63] font-extrabold text-sm border-2 border-[#144D63] shadow-[0_4px_0_#144D63] active:translate-y-0.5 transition-all"
                    >
                      Request School Tour &amp; Fee Info
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cheerful Footer */}
      <footer className="bg-[#144D63] text-[#D8F1FF] py-8 text-xs border-t-4 border-[#FFB703]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFB703] text-[#144D63] flex items-center justify-center font-extrabold">
              <Sun className="w-5 h-5" />
            </div>
            <span className="font-bold">
              © {new Date().getFullYear()} Aberdeen Daycare &amp; Nursery
              School. #NurturingYoungMinds
            </span>
          </div>
          <div className="flex items-center gap-6 font-extrabold">
            <a href="#classes" className="hover:text-[#FFB703] transition-colors">
              Our Classes
            </a>
            <a href="#gallery" className="hover:text-[#FFB703] transition-colors">
              Photos
            </a>
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-xl bg-[#FFB703] text-[#144D63] hover:bg-[#FFA500] transition-colors"
            >
              Staff &amp; Parent Portal Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}