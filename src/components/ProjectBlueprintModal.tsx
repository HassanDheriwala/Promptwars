"use client";

import React, { useState } from "react";
import { ProjectBlueprint } from "@/lib/types";
import { generateMarkdownBlueprint } from "@/lib/export-markdown";
import { ProjectRealityCheck } from "@/components/ProjectRealityCheck";
import {
  X,
  Download,
  Copy,
  Check,
  Cpu,
  Layers,
  Calendar,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Users,
  Target,
  ExternalLink,
  SlidersHorizontal,
  BookmarkCheck,
  ShieldCheck,
} from "lucide-react";

interface ProjectBlueprintModalProps {
  blueprint: ProjectBlueprint | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRefine: (blueprint: ProjectBlueprint) => void;
}

type TabType =
  | "reality_check"
  | "overview"
  | "architecture"
  | "mvp_features"
  | "roadmap"
  | "risks_future";

export function ProjectBlueprintModal({
  blueprint,
  isOpen,
  onClose,
  onOpenRefine,
}: ProjectBlueprintModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("reality_check");
  const [copied, setCopied] = useState(false);
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});

  if (!isOpen || !blueprint) return null;

  const handleCopy = async () => {
    const md = generateMarkdownBlueprint(blueprint);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const md = generateMarkdownBlueprint(blueprint);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${blueprint.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-blueprint.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleMilestone = (key: string) => {
    setCompletedMilestones((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const difficultyColors = {
    Beginner: "bg-emerald-950/80 text-emerald-300 border-emerald-800/80",
    Intermediate: "bg-blue-950/80 text-blue-300 border-blue-800/80",
    Advanced: "bg-purple-950/80 text-purple-300 border-purple-800/80",
  }[blueprint.difficulty];

  const evalData = blueprint.evaluation;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-blueprint-title"
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${difficultyColors}`}
              >
                {blueprint.difficulty}
              </span>
              <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                {blueprint.estimatedScope.totalWeeks} Weeks Scope
              </span>
              <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                Team: {blueprint.estimatedScope.teamSizeRecommendation}
              </span>
              {evalData && (
                <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Feasibility: {evalData.feasibilityScore}/100
                </span>
              )}
              {blueprint.aiMlComponent.included && (
                <span className="text-xs text-cyan-300 bg-cyan-950/80 border border-cyan-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-cyan-400" /> AI-Integrated
                </span>
              )}
            </div>

            <h2
              id="modal-blueprint-title"
              className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight truncate"
            >
              {blueprint.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 line-clamp-1">
              {blueprint.concept}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => onOpenRefine(blueprint)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
              aria-label="Refine blueprint constraints"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Refine</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
              title="Copy IEEE-ready Capstone Markdown"
              aria-label="Copy markdown blueprint to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy Markdown</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-900/30 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
              title="Download Markdown Blueprint File"
              aria-label="Download markdown blueprint file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download .md</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-800 bg-slate-950/30 flex space-x-1 sm:space-x-3 overflow-x-auto scrollbar-none">
          {[
            { id: "reality_check", label: "Reality Check & Feasibility", icon: ShieldCheck },
            { id: "overview", label: "Overview & Problem", icon: Target },
            { id: "architecture", label: "Tech & AI Architecture", icon: Cpu },
            { id: "mvp_features", label: "Features & 3-Week MVP", icon: BookmarkCheck },
            { id: "roadmap", label: "Phased Roadmap", icon: Calendar },
            { id: "risks_future", label: "Risks & Future Scope", icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-3 px-3 text-xs font-medium border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-t-md ${
                  active
                    ? "border-indigo-500 text-indigo-300 font-semibold bg-indigo-950/20"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? "text-indigo-400" : "text-slate-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200">
          {/* TAB 0: REALITY CHECK */}
          {activeTab === "reality_check" && evalData && (
            <div className="animate-in fade-in duration-150">
              <ProjectRealityCheck
                evaluation={evalData}
                projectTitle={blueprint.title}
                isCompact={false}
              />
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* One-Line Concept Banner */}
              <div className="p-4 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/60 border border-indigo-900/60 rounded-xl">
                <span className="text-[11px] font-bold tracking-wider text-indigo-400 uppercase block mb-1">
                  Core Concept
                </span>
                <p className="text-base text-slate-100 font-medium leading-relaxed">
                  {blueprint.concept}
                </p>
              </div>

              {/* Compact Reality Check Preview */}
              {evalData && (
                <ProjectRealityCheck
                  evaluation={evalData}
                  projectTitle={blueprint.title}
                  isCompact={true}
                />
              )}

              {/* Problem Statement */}
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-red-400" /> Problem Statement
                </h3>
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl text-sm leading-relaxed text-slate-300">
                  {blueprint.problem}
                </div>
              </div>

              {/* Suitability Analysis */}
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Student Suitability Analysis
                </h3>
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl text-sm leading-relaxed text-slate-300">
                  {blueprint.suitability}
                </div>
              </div>

              {/* Target Users */}
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-cyan-400" /> Target Users & Stakeholders
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {blueprint.targetUsers.map((user, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                      <span>{user}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architecture Overview */}
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-400" /> High-Level Architecture Topology
                </h3>
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl text-sm leading-relaxed text-slate-300">
                  {blueprint.architectureOverview}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TECH & AI ARCHITECTURE */}
          {activeTab === "architecture" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Tech Stack Matrix */}
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-400" /> Full-Stack Technology Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-2">
                      Frontend & Client
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {blueprint.techStack.frontend.map((t, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg text-xs font-mono border border-slate-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-2">
                      Backend & APIs
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {blueprint.techStack.backend.map((t, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg text-xs font-mono border border-slate-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-2">
                      Database & Caching
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {blueprint.techStack.database.map((t, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg text-xs font-mono border border-slate-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-2">
                      Cloud, DevOps & Tooling
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {blueprint.techStack.cloudDevOps.map((t, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg text-xs font-mono border border-slate-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI/ML Component Detail */}
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" /> AI / Machine Learning Component Specification
                </h3>
                <div className="p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30 border border-cyan-900/60 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-semibold text-cyan-300">
                      Component Status: {blueprint.aiMlComponent.included ? "Integrated" : "Optional"}
                    </span>
                    <span className="text-xs font-mono bg-cyan-950 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-800">
                      {blueprint.aiMlComponent.modelOrApi}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Functional Purpose:</span>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {blueprint.aiMlComponent.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">
                        Data Requirements
                      </span>
                      <p className="text-xs text-slate-300">
                        {blueprint.aiMlComponent.dataRequirements}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">
                        Recommended Dataset / Benchmark
                      </span>
                      <p className="text-xs text-slate-300">
                        {blueprint.aiMlComponent.datasetRecommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FEATURES & 3-WEEK MVP */}
          {activeTab === "mvp_features" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* 3-Week MVP Spotlight Box */}
              <div className="p-5 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border border-emerald-800/80 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <BookmarkCheck className="w-4 h-4" /> 3-Week Proof of Concept (MVP Version)
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                    Timeline: {blueprint.mvpVersion.buildTimelineWeeks} Weeks
                  </span>
                </div>

                <p className="text-sm text-slate-200 mb-4 leading-relaxed font-medium">
                  {blueprint.mvpVersion.summary}
                </p>

                <div className="space-y-2 mb-3">
                  <span className="text-xs font-semibold text-slate-300 block">
                    Essential MVP Deliverables:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {blueprint.mvpVersion.keyFeatures.map((feat, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-950/80 border border-emerald-900/50 rounded-lg text-xs text-slate-300 flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-emerald-300 bg-emerald-950/80 p-2.5 rounded-lg border border-emerald-800/60 mt-2">
                  <strong>Expected MVP Outcome:</strong> {blueprint.mvpVersion.deliverable}
                </div>
              </div>

              {/* Core Features List */}
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">
                  Full Feature Set (Prioritized)
                </h3>
                <div className="space-y-3">
                  {blueprint.coreFeatures.map((feat, idx) => {
                    const priorityBadge = {
                      High: "bg-red-950/80 text-red-300 border-red-800",
                      Medium: "bg-amber-950/80 text-amber-300 border-amber-800",
                      Low: "bg-slate-800 text-slate-300 border-slate-700",
                    }[feat.priority];

                    return (
                      <div
                        key={idx}
                        className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-indigo-400 font-bold">
                              0{idx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-slate-100">{feat.title}</h4>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {feat.description}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${priorityBadge}`}
                        >
                          {feat.priority} Priority
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PHASED ROADMAP */}
          {activeTab === "roadmap" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    Step-by-Step Phased Development Plan
                  </h3>
                  <p className="text-xs text-slate-400">
                    Interactive milestone tracker for your {blueprint.estimatedScope.totalWeeks}-week timeline
                  </p>
                </div>
                <span className="text-xs text-indigo-400 font-mono">
                  {Object.values(completedMilestones).filter(Boolean).length} milestones checked
                </span>
              </div>

              <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-8">
                {blueprint.roadmap.map((phase) => (
                  <div key={phase.phaseNumber} className="relative">
                    {/* Circle marker */}
                    <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center text-[11px] font-bold text-indigo-400">
                      {phase.phaseNumber}
                    </div>

                    <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <h4 className="text-sm font-bold text-slate-100">{phase.title}</h4>
                        <span className="text-xs px-2.5 py-0.5 bg-indigo-950 text-indigo-300 rounded-full border border-indigo-800 font-mono">
                          {phase.durationWeeks} Weeks
                        </span>
                      </div>

                      {/* Milestones Checkbox List */}
                      <div className="space-y-2 mb-4">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                          Milestones
                        </span>
                        {phase.milestones.map((m, mIdx) => {
                          const key = `p${phase.phaseNumber}-m${mIdx}`;
                          const isDone = !!completedMilestones[key];
                          return (
                            <button
                              type="button"
                              key={mIdx}
                              onClick={() => toggleMilestone(key)}
                              className="w-full text-left flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-900/80 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                              aria-label={`Mark milestone ${m} as ${isDone ? "incomplete" : "complete"}`}
                            >
                              <div
                                className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center transition-colors ${
                                  isDone
                                    ? "bg-indigo-600 border-indigo-500 text-white"
                                    : "border-slate-600 group-hover:border-slate-400"
                                }`}
                              >
                                {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span
                                className={`text-xs ${
                                  isDone ? "line-through text-slate-500" : "text-slate-300"
                                }`}
                              >
                                {m}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Deliverables */}
                      <div className="pt-2 border-t border-slate-800/80">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          Phase Deliverable
                        </span>
                        {phase.deliverables.map((d, dIdx) => (
                          <div
                            key={dIdx}
                            className="text-xs text-indigo-300 font-medium flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RISKS, CHALLENGES & FUTURE SCOPE */}
          {activeTab === "risks_future" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Risks & Mitigations */}
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Risks, Technical Bottlenecks & Mitigations
                </h3>
                <div className="space-y-3">
                  {blueprint.risksAndChallenges.map((rc, idx) => {
                    const sevColor = {
                      High: "text-red-400 bg-red-950/80 border-red-800",
                      Medium: "text-amber-400 bg-amber-950/80 border-amber-800",
                      Low: "text-blue-400 bg-blue-950/80 border-blue-800",
                    }[rc.severity];

                    return (
                      <div
                        key={idx}
                        className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-100">
                            Risk #{idx + 1}: {rc.risk}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${sevColor}`}
                          >
                            {rc.severity} Risk
                          </span>
                        </div>
                        <div className="p-3 bg-slate-900/90 rounded-lg text-xs text-slate-300 border border-slate-800">
                          <strong className="text-emerald-400 block mb-0.5">
                            Mitigation Strategy:
                          </strong>
                          {rc.mitigation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Possible Improvements (v1.1+) */}
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-cyan-400" /> Post-MVP Enhancements (v1.1+)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {blueprint.possibleImprovements.map((imp, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0 mt-1.5" />
                      <span>{imp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Future Scope / Academic Angles */}
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4 text-purple-400" /> Long-Term Academic & Publication Scope
                </h3>
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                  {blueprint.futureScope.map((scope, idx) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-purple-400 font-mono font-bold">[{idx + 1}]</span>
                      <span>{scope}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <span>Ready to build this project? Export the blueprint or refine with custom constraints.</span>
          <button
            type="button"
            onClick={() => onOpenRefine(blueprint)}
            className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Customize or Refine Idea</span>
          </button>
        </div>
      </div>
    </div>
  );
}
