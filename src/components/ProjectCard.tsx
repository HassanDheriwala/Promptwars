"use client";

import React from "react";
import { ProjectBlueprint } from "@/lib/types";
import {
  FileText,
  Clock,
  Cpu,
  ArrowRight,
  SlidersHorizontal,
  CheckCircle2,
  ShieldCheck,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

interface ProjectCardProps {
  blueprint: ProjectBlueprint;
  onSelect: (blueprint: ProjectBlueprint) => void;
  onRefine: (blueprint: ProjectBlueprint) => void;
}

export function ProjectCard({ blueprint, onSelect, onRefine }: ProjectCardProps) {
  const difficultyColors = {
    Beginner: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60",
    Intermediate: "bg-blue-950/60 text-blue-300 border-blue-800/60",
    Advanced: "bg-purple-950/60 text-purple-300 border-purple-800/60",
  }[blueprint.difficulty] || "bg-slate-800 text-slate-300 border-slate-700";

  const evalData = blueprint.evaluation;

  return (
    <div className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-indigo-950/40 group">
      <div>
        {/* Header metadata badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${difficultyColors}`}
            >
              {blueprint.difficulty}
            </span>
            <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700/60 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {blueprint.estimatedScope.totalWeeks}w Scope
            </span>
          </div>

          {blueprint.aiMlComponent.included && (
            <span className="text-[11px] font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" /> AI-Powered
            </span>
          )}
        </div>

        {/* Title & Concept */}
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors leading-snug mb-2">
          {blueprint.title}
        </h3>
        <p className="text-sm text-slate-300 mb-4 line-clamp-2 leading-relaxed">
          {blueprint.concept}
        </p>

        {/* Reality Check Snapshot */}
        {evalData && (
          <div className="mb-4 p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Reality Check
              </span>
              <span className="text-[11px] font-bold text-emerald-300 font-mono">
                Feasibility: {evalData.feasibilityScore}/100
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
              <div className="p-1.5 bg-slate-900/90 rounded-md border border-slate-800/70">
                <span className="text-slate-400 block truncate">Skill Fit</span>
                <span className="font-bold text-indigo-300">{evalData.skillFitScore}/100</span>
              </div>
              <div className="p-1.5 bg-slate-900/90 rounded-md border border-slate-800/70">
                <span className="text-slate-400 block truncate flex items-center justify-center gap-0.5">
                  <Lightbulb className="w-2.5 h-2.5 text-amber-400" /> Innov.
                </span>
                <span className="font-bold text-amber-300">{evalData.innovationScore}/100</span>
              </div>
              <div className="p-1.5 bg-slate-900/90 rounded-md border border-slate-800/70">
                <span className="text-slate-400 block truncate flex items-center justify-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5 text-purple-400" /> Impact
                </span>
                <span className="font-bold text-purple-300">{evalData.impactScore}/100</span>
              </div>
            </div>
          </div>
        )}

        {/* Suitability Callout */}
        <div className="mb-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 text-xs text-slate-300">
          <span className="font-semibold text-indigo-300 block mb-1">Why this fits your profile:</span>
          <p className="line-clamp-2 text-slate-400">{blueprint.suitability}</p>
        </div>

        {/* Tech Stack Summary */}
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Key Technologies
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              ...blueprint.techStack.frontend.slice(0, 2),
              ...blueprint.techStack.backend.slice(0, 2),
              ...blueprint.techStack.aiMl.slice(0, 1),
            ].map((tech, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md font-mono border border-slate-700/60"
              >
                {tech}
              </span>
            ))}
            {blueprint.techStack.database.length > 0 && (
              <span className="text-[11px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md font-mono border border-slate-700/60">
                {blueprint.techStack.database[0]}
              </span>
            )}
          </div>
        </div>

        {/* 3-Week MVP Highlight */}
        <div className="mb-5 text-xs text-slate-400 flex items-start gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-2">
            <strong className="text-slate-200">3-Week MVP:</strong> {blueprint.mvpVersion.summary}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onSelect(blueprint)}
          className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label={`View full blueprint for ${blueprint.title}`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Full Blueprint</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onRefine(blueprint)}
          className="py-2.5 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          title="Tweak constraints or customize idea"
          aria-label={`Refine constraints for ${blueprint.title}`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
          <span>Refine</span>
        </button>
      </div>
    </div>
  );
}
