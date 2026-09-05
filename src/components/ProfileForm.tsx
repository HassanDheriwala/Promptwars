"use client";

import React, { useState } from "react";
import { StudentProfile, ExperienceLevel } from "@/lib/types";
import {
  Code,
  Layers,
  Clock,
  Users,
  Compass,
  Plus,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Wand2,
} from "lucide-react";

interface ProfileFormProps {
  initialProfile: StudentProfile;
  onSubmit: (profile: StudentProfile) => void;
  isLoading: boolean;
}

const COMMON_SKILLS = [
  "Python",
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "FastAPI",
  "PostgreSQL",
  "MongoDB",
  "Docker",
  "PyTorch",
  "TensorFlow",
  "Tailwind CSS",
  "Go",
  "Flutter",
  "OpenCV",
];

const COMMON_INTERESTS = [
  "Healthcare & MedTech",
  "FinTech & Payments",
  "Cybersecurity & Privacy",
  "AI & Large Language Models",
  "Climate & GreenTech",
  "EdTech & Interactive Learning",
  "Smart Cities & IoT",
  "Developer Tooling & DevOps",
  "Computer Vision & Robotics",
];

const DOMAINS = [
  "Healthcare & Medicine",
  "Finance & FinTech",
  "Cybersecurity & Privacy",
  "Education & EdTech",
  "Climate & Sustainability",
  "Smart Cities & IoT",
  "E-Commerce & Retail",
  "Developer Tools & Productivity",
  "Social Good & Accessibility",
];

const PROJECT_TYPES = [
  "Full-Stack Web App",
  "AI / Machine Learning Platform",
  "Mobile Application (Cross-Platform)",
  "Cloud / DevOps Infrastructure",
  "IoT & Embedded System",
  "API Service / Developer CLI",
  "Data Engineering & Analytics",
];

export function ProfileForm({ initialProfile, onSubmit, isLoading }: ProfileFormProps) {
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [customInterestInput, setCustomInterestInput] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);



  const toggleSkill = (skill: string) => {
    setProfile((prev) => {
      const exists = prev.skills.includes(skill);
      if (exists) {
        return { ...prev, skills: prev.skills.filter((s) => s !== skill) };
      }
      if (prev.skills.length >= 15) return prev;
      return { ...prev, skills: [...prev.skills, skill] };
    });
  };

  const addCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (trimmed && !profile.skills.includes(trimmed) && profile.skills.length < 15) {
      setProfile((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setCustomSkillInput("");
    }
  };

  const toggleInterest = (interest: string) => {
    setProfile((prev) => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        return { ...prev, interests: prev.interests.filter((i) => i !== interest) };
      }
      if (prev.interests.length >= 10) return prev;
      return { ...prev, interests: [...prev.interests, interest] };
    });
  };

  const addCustomInterest = () => {
    const trimmed = customInterestInput.trim();
    if (trimmed && !profile.interests.includes(trimmed) && profile.interests.length < 10) {
      setProfile((prev) => ({ ...prev, interests: [...prev.interests, trimmed] }));
      setCustomInterestInput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.skills.length === 0) {
      setFormError("Please select or add at least one technical skill.");
      return;
    }
    if (profile.interests.length === 0) {
      setFormError("Please select or add at least one area of interest.");
      return;
    }
    setFormError(null);
    onSubmit(profile);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            Define Your Project Parameters
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Input your technical skills and interests to generate realistic, production-caliber capstone blueprints.
          </p>
        </div>
      </div>

      {formError && (
        <div className="mb-6 p-3.5 bg-red-950/40 border border-red-800/60 rounded-xl flex items-center gap-2 text-sm text-red-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span>{formError}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Domain & Project Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Preferred Domain
            </label>
            <div className="relative">
              <select
                value={profile.domain}
                onChange={(e) => setProfile({ ...profile, domain: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Project Category / Architecture
            </label>
            <select
              value={profile.projectType}
              onChange={(e) => setProfile({ ...profile, projectType: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              {PROJECT_TYPES.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Technical Skills */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-indigo-400" />
              Technical Skills ({profile.skills.length} selected)
            </label>
            <span className="text-[11px] text-slate-400">Click to toggle or add custom below</span>
          </div>

          {/* Quick select pills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {COMMON_SKILLS.map((skill) => {
              const selected = profile.skills.includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selected
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30 ring-1 ring-indigo-400"
                      : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/50"
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>

          {/* Custom skill adder */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add another skill (e.g. Rust, Kafka, Supabase)..."
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomSkill();
                }
              }}
              className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={addCustomSkill}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-medium flex items-center gap-1 border border-slate-700"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

        {/* Areas of Interest */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              Focus Areas & Interests ({profile.interests.length} selected)
            </label>
            <span className="text-[11px] text-slate-400">Select topics you care about</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {COMMON_INTERESTS.map((interest) => {
              const selected = profile.interests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selected
                      ? "bg-cyan-600 text-white shadow-sm shadow-cyan-500/30 ring-1 ring-cyan-400"
                      : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/50"
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>

          {/* Custom interest adder */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add another interest (e.g. Autonomous Drones, Microgrid Energy)..."
              value={customInterestInput}
              onChange={(e) => setCustomInterestInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomInterest();
                }
              }}
              className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={addCustomInterest}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-medium flex items-center gap-1 border border-slate-700"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

        {/* Experience Level, Timeframe, Team Size */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Experience level */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Experience Level
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              {(["Beginner", "Intermediate", "Advanced"] as ExperienceLevel[]).map((level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setProfile({ ...profile, experienceLevel: level })}
                  className={`text-xs py-2 rounded-lg font-medium transition-all ${
                    profile.experienceLevel === level
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Target Duration
            </label>
            <div className="grid grid-cols-4 gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              {[4, 8, 12, 16].map((weeks) => (
                <button
                  type="button"
                  key={weeks}
                  onClick={() => setProfile({ ...profile, timeframeWeeks: weeks })}
                  className={`text-xs py-2 rounded-lg font-medium transition-all ${
                    profile.timeframeWeeks === weeks
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {weeks}w
                </button>
              ))}
            </div>
          </div>

          {/* Team size */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Team Composition
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              {[
                { size: 1, label: "Solo" },
                { size: 3, label: "2-3 Members" },
                { size: 5, label: "4-5 Members" },
              ].map((item) => (
                <button
                  type="button"
                  key={item.size}
                  onClick={() => setProfile({ ...profile, teamSize: item.size })}
                  className={`text-xs py-2 rounded-lg font-medium transition-all ${
                    profile.teamSize === item.size
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Optional Constraints Accordion */}
        <div className="border-t border-slate-800/80 pt-3">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium py-1"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>Optional Hardware, Technology & Project Constraints</span>
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-2">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Preferred Technologies / Frameworks
                </label>
                <input
                  type="text"
                  placeholder="e.g. Supabase, Tailwind, PyTorch, LangChain..."
                  value={profile.preferredTech || ""}
                  onChange={(e) => setProfile({ ...profile, preferredTech: e.target.value })}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Constraints / Restrictions
                </label>
                <input
                  type="text"
                  placeholder="e.g. No GPU available, must run offline, strictly free-tier..."
                  value={profile.constraints || ""}
                  onChange={(e) => setProfile({ ...profile, constraints: e.target.value })}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit action */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
              isLoading
                ? "bg-indigo-700/50 text-indigo-200 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-500 hover:via-blue-500 hover:to-indigo-500 text-white shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.008] active:scale-[0.99]"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Architecting Capstone Blueprints...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generate Capstone Blueprints</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
