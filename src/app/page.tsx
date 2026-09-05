"use client";

import React, { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { ProfileForm } from "@/components/ProfileForm";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectBlueprintModal } from "@/components/ProjectBlueprintModal";
import { RefineModal } from "@/components/RefineModal";
import { StatusBanner } from "@/components/StatusBanner";
import { StudentProfile, ProjectBlueprint } from "@/lib/types";
import {
  Sparkles,
  Compass,
  CheckCircle2,
  RefreshCw,
  Code2,
  Cpu,
  GraduationCap,
} from "lucide-react";

// Curated presets for instant 1-click loading for judges
const PRESETS: Record<string, StudentProfile> = {
  Healthcare: {
    interests: ["Healthcare & MedTech", "AI & Large Language Models"],
    skills: ["Python", "FastAPI", "React", "Docker", "PyTorch"],
    domain: "Healthcare & Medicine",
    projectType: "AI / Machine Learning Platform",
    experienceLevel: "Intermediate",
    timeframeWeeks: 12,
    teamSize: 3,
    preferredTech: "FastAPI, BioBERT, Next.js",
    constraints: "Must provide deterministic reference to clinical guidelines",
  },
  FinTech: {
    interests: ["FinTech & Payments", "AI & Large Language Models"],
    skills: ["Python", "TypeScript", "Next.js", "PostgreSQL"],
    domain: "Finance & FinTech",
    projectType: "Full-Stack Web App",
    experienceLevel: "Intermediate",
    timeframeWeeks: 10,
    teamSize: 1,
    preferredTech: "Scikit-Learn, LightGBM, Recharts",
    constraints: "Models must be fully explainable (SHAP/LIME)",
  },
  Cybersecurity: {
    interests: ["Cybersecurity & Privacy", "Developer Tooling & DevOps"],
    skills: ["Go", "Node.js", "Docker", "TypeScript"],
    domain: "Cybersecurity & Privacy",
    projectType: "Cloud / DevOps Infrastructure",
    experienceLevel: "Advanced",
    timeframeWeeks: 12,
    teamSize: 3,
    preferredTech: "Docker, Envoy/Proxy, Next.js",
    constraints: "Low latency reverse-proxy interception",
  },
  EdTech: {
    interests: ["EdTech & Interactive Learning", "AI & Large Language Models"],
    skills: ["Next.js", "React", "TypeScript", "PostgreSQL"],
    domain: "Education & EdTech",
    projectType: "Full-Stack Web App",
    experienceLevel: "Intermediate",
    timeframeWeeks: 10,
    teamSize: 2,
    preferredTech: "React Flow, Tailwind CSS, Gemini API",
    constraints: "Socratic hints without giving away code answers",
  },
};

const DEFAULT_PROFILE: StudentProfile = {
  interests: ["AI & Large Language Models", "Developer Tooling & DevOps"],
  skills: ["Python", "Next.js", "TypeScript", "PostgreSQL"],
  domain: "Developer Tools & Productivity",
  projectType: "Full-Stack Web App",
  experienceLevel: "Intermediate",
  timeframeWeeks: 12,
  teamSize: 2,
  preferredTech: "Next.js, FastAPI, Docker",
  constraints: "Free tier deployment",
};

export default function HomePage() {
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [blueprints, setBlueprints] = useState<ProjectBlueprint[]>([]);
  const [selectedBlueprint, setSelectedBlueprint] = useState<ProjectBlueprint | null>(null);
  const [refiningBlueprint, setRefiningBlueprint] = useState<ProjectBlueprint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | undefined>(undefined);
  const [formKey, setFormKey] = useState(0);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const handleApplyPreset = (presetKey: string) => {
    const selected = PRESETS[presetKey];
    if (selected) {
      setProfile(selected);
      setFormKey((k) => k + 1);
    }
  };

  const handleGenerate = async (currentProfile: StudentProfile) => {
    setIsLoading(true);
    setStatusMessage(undefined);

    try {
      const response = await fetch("/api/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentProfile),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate project blueprints");
      }

      setBlueprints(data.data || []);
      setIsDemoMode(!!data.isDemoMode);
      setStatusMessage(data.message);

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (err: unknown) {
      console.error("[Generation Error]:", err);
      setStatusMessage(
        err instanceof Error ? err.message : "Error generating ideas. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineSuccess = (updated: ProjectBlueprint) => {
    setBlueprints((prev) =>
      prev.map((bp) => (bp.id === refiningBlueprint?.id ? updated : bp))
    );
    setSelectedBlueprint(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Header isDemoMode={isDemoMode} onApplyPreset={handleApplyPreset} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Project Feasibility & Innovation Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Turn your skills and interests into a{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              feasible, high-impact project.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Stop guessing your final-year project viability. Generate production-caliber capstone blueprints
            backed by AI Reality Checks, numerical feasibility scores, concrete 3-week MVP milestones, and phased roadmaps.
          </p>

          {/* Quick Preset Selector */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Quick Demo Profiles:</span>
            {Object.keys(PRESETS).map((key) => (
              <button
                type="button"
                key={key}
                onClick={() => handleApplyPreset(key)}
                className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                  profile.domain.toLowerCase().includes(key.toLowerCase())
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </section>

        {/* Status / Demo Banner */}
        <StatusBanner isDemoMode={isDemoMode} message={statusMessage} />

        {/* Profile Input Form */}
        <section>
          <ProfileForm
            key={formKey}
            initialProfile={profile}
            onSubmit={handleGenerate}
            isLoading={isLoading}
          />
        </section>

        {/* Blueprints Results Section */}
        <section ref={resultsRef} className="space-y-6 pt-4">
          {blueprints.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  Recommended Capstone Blueprints
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Tailored to {profile.skills.slice(0, 3).join(", ")} | {profile.domain} | {profile.timeframeWeeks} Weeks
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleGenerate(profile)}
                  disabled={isLoading}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-800 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                  <span>Regenerate Recommendations</span>
                </button>
              </div>
            </div>
          )}

          {/* Cards Grid */}
          {blueprints.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blueprints.map((blueprint) => (
                <ProjectCard
                  key={blueprint.id}
                  blueprint={blueprint}
                  onSelect={(bp) => setSelectedBlueprint(bp)}
                  onRefine={(bp) => setRefiningBlueprint(bp)}
                />
              ))}
            </div>
          ) : (
            !isLoading && (
              <div className="text-center py-12 px-4 border border-dashed border-slate-800/80 rounded-2xl bg-slate-950/40">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-slate-400 mb-3">
                  <Compass className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-base font-bold text-slate-200">No project blueprints yet</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-1">
                  Select your skills and interests above, or click one of the quick demo presets, then click &quot;Generate Capstone Blueprints&quot;.
                </p>
              </div>
            )
          )}
        </section>

        {/* Feature Highlights Footer */}
        <section className="pt-12 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-slate-400 text-xs">
          <div className="p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl space-y-1.5">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Realistic & Feasible
            </h4>
            <p className="leading-relaxed">
              Every blueprint specifies a scoped 3-week proof of concept deliverable to avoid over-engineering.
            </p>
          </div>

          <div className="p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl space-y-1.5">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5 text-sm">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Concrete AI & Tech Stacks
            </h4>
            <p className="leading-relaxed">
              No generic &quot;use an AI chatbot&quot; advice. Receive specific APIs, HuggingFace models, and datasets.
            </p>
          </div>

          <div className="p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl space-y-1.5">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5 text-sm">
              <Code2 className="w-4 h-4 text-indigo-400" />
              IEEE & Capstone Ready
            </h4>
            <p className="leading-relaxed">
              Export comprehensive IEEE-formatted Markdown blueprints directly to your clipboard or local files.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-600">
        <p>
          CapstoneAI MVP &copy; {new Date().getFullYear()} — Built for Autonomous Engineering & University Innovation.
        </p>
      </footer>

      {/* Interactive Blueprint Modal */}
      <ProjectBlueprintModal
        blueprint={selectedBlueprint}
        isOpen={!!selectedBlueprint}
        onClose={() => setSelectedBlueprint(null)}
        onOpenRefine={(bp) => {
          setSelectedBlueprint(null);
          setRefiningBlueprint(bp);
        }}
      />

      {/* Refine / Customize Modal */}
      <RefineModal
        blueprint={refiningBlueprint}
        isOpen={!!refiningBlueprint}
        onClose={() => setRefiningBlueprint(null)}
        onRefineSuccess={handleRefineSuccess}
      />
    </div>
  );
}
