"use client";

import React from "react";
import { ProjectEvaluation } from "@/lib/types";
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  ShieldCheck,
  Zap,
  Award,
  Target,
} from "lucide-react";

interface ProjectRealityCheckProps {
  evaluation: ProjectEvaluation;
  projectTitle?: string;
  isCompact?: boolean;
}

interface MetricItem {
  label: string;
  score: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  barColorClass: string;
}

export function ProjectRealityCheck({
  evaluation,
  projectTitle,
  isCompact = false,
}: ProjectRealityCheckProps) {
  const getScoreBand = (score: number) => {
    if (score >= 90) return { label: "Exceptional Fit", color: "text-emerald-400 bg-emerald-950/80 border-emerald-800" };
    if (score >= 80) return { label: "High Viability", color: "text-blue-400 bg-blue-950/80 border-blue-800" };
    if (score >= 70) return { label: "Feasible with Guidance", color: "text-amber-400 bg-amber-950/80 border-amber-800" };
    return { label: "Requires Scope Adjustment", color: "text-rose-400 bg-rose-950/80 border-rose-800" };
  };

  const metrics: MetricItem[] = [
    {
      label: "Feasibility",
      score: evaluation.feasibilityScore,
      description: "Overall technical and delivery probability",
      icon: ShieldCheck,
      colorClass: "text-emerald-400",
      barColorClass: "bg-emerald-500",
    },
    {
      label: "Skill Fit",
      score: evaluation.skillFitScore,
      description: "Alignment with your current languages and frameworks",
      icon: Target,
      colorClass: "text-indigo-400",
      barColorClass: "bg-indigo-500",
    },
    {
      label: "Time Fit",
      score: evaluation.timeFeasibilityScore,
      description: "Achievable within your designated weekly timeline",
      icon: Zap,
      colorClass: "text-cyan-400",
      barColorClass: "bg-cyan-500",
    },
    {
      label: "Resource Fit",
      score: evaluation.resourceFeasibilityScore,
      description: "Matches recommended solo/team workload",
      icon: Award,
      colorClass: "text-blue-400",
      barColorClass: "bg-blue-500",
    },
    {
      label: "Innovation",
      score: evaluation.innovationScore,
      description: "Novelty, competitive edge, and differentiation",
      icon: Lightbulb,
      colorClass: "text-amber-400",
      barColorClass: "bg-amber-500",
    },
    {
      label: "Impact",
      score: evaluation.impactScore,
      description: "Real-world utility and portfolio distinction",
      icon: TrendingUp,
      colorClass: "text-purple-400",
      barColorClass: "bg-purple-500",
    },
  ];

  const overallBand = getScoreBand(evaluation.feasibilityScore);

  if (isCompact) {
    return (
      <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Reality Check
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${overallBand.color}`}>
            {overallBand.label} ({evaluation.feasibilityScore}/100)
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="p-2 bg-slate-900/90 rounded-lg text-center border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Feasibility</span>
            <span className="text-xs font-bold text-emerald-300">{evaluation.feasibilityScore}/100</span>
          </div>
          <div className="p-2 bg-slate-900/90 rounded-lg text-center border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Innovation</span>
            <span className="text-xs font-bold text-amber-300">{evaluation.innovationScore}/100</span>
          </div>
          <div className="p-2 bg-slate-900/90 rounded-lg text-center border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Impact</span>
            <span className="text-xs font-bold text-purple-300">{evaluation.impactScore}/100</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reality Check Header Hero */}
      <div className="p-5 bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/70 border border-indigo-900/70 rounded-2xl shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Project Reality Check
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${overallBand.color}`}
              >
                {overallBand.label}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 mt-1">
              {projectTitle ? `Feasibility & Innovation Analysis: ${projectTitle}` : "Comprehensive Feasibility & Innovation Analysis"}
            </h3>
          </div>

          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-extrabold text-white flex items-baseline gap-1">
              <span>{evaluation.feasibilityScore}</span>
              <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Overall Feasibility</span>
          </div>
        </div>

        {/* 6-Metric Evaluation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="p-3.5 bg-slate-950/80 border border-slate-800/90 rounded-xl space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${metric.colorClass}`} />
                    <span className="text-xs font-bold text-slate-200">{metric.label}</span>
                  </div>
                  <span className="text-xs font-extrabold text-white font-mono">
                    {metric.score}/100
                  </span>
                </div>

                {/* Progress bar with accessibility attributes */}
                <div
                  className="w-full bg-slate-800 rounded-full h-2 overflow-hidden"
                  role="progressbar"
                  aria-valuenow={metric.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${metric.label} score: ${metric.score} out of 100`}
                >
                  <div
                    className={`h-full ${metric.barColorClass} rounded-full transition-all duration-500`}
                    style={{ width: `${metric.score}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 leading-tight">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 1. Why this works */}
      <div>
        <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Why This Works
        </h4>
        <div className="p-4 bg-slate-950/80 border border-emerald-900/40 rounded-xl text-sm leading-relaxed text-slate-200">
          {evaluation.whyThisWorks}
        </div>
      </div>

      {/* 2. Key risks and mitigations */}
      <div>
        <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" /> Key Risks & Concrete Mitigations
        </h4>
        <div className="space-y-3">
          {evaluation.keyRisks.map((risk, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2"
            >
              <div className="flex items-start gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                  [Risk {idx + 1}]
                </span>
                <span className="text-xs font-semibold text-slate-100 leading-relaxed">
                  {risk}
                </span>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-lg text-xs text-slate-300 border border-slate-800 flex items-start gap-2">
                <strong className="text-emerald-400 flex-shrink-0 font-medium">Mitigation:</strong>
                <span>{evaluation.riskMitigations[idx] || "Apply standard system isolation and modular design patterns."}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. How to differentiate it */}
      <div>
        <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-cyan-400" /> How to Make It More Unique & Differentiated
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {evaluation.differentiationSuggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-950/80 border border-cyan-900/40 rounded-xl text-xs text-slate-200 flex items-start gap-2.5"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0 mt-1.5" />
              <span className="leading-relaxed font-medium">{suggestion}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
