"use client";

import React from "react";
import { Info, Sparkles } from "lucide-react";

interface StatusBannerProps {
  isDemoMode: boolean;
  message?: string;
}

export function StatusBanner({ isDemoMode, message }: StatusBannerProps) {
  if (!isDemoMode && !message) return null;

  return (
    <div
      className={`rounded-2xl p-4 text-xs sm:text-sm border transition-all ${
        isDemoMode
          ? "bg-amber-950/20 border-amber-800/40 text-amber-200/90"
          : "bg-indigo-950/20 border-indigo-800/40 text-indigo-200/90"
      }`}
    >
      <div className="flex items-start gap-3">
        {isDemoMode ? (
          <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        ) : (
          <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
        )}
        <div className="space-y-1">
          <p className="font-semibold text-slate-200">
            {isDemoMode
              ? "⚡ Demo Mode Active: High-Fidelity Verified Curated Blueprints"
              : "Live Gemini AI Generation Active"}
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            {message ||
              (isDemoMode
                ? "The system is currently serving pre-architected, verified capstone blueprints with complete technical roadmaps. To enable live Gemini AI generation, provide a valid GEMINI_API_KEY in your .env.local file."
                : "Project blueprints generated in real time using Google Gemini with structured output validation.")}
          </p>
        </div>
      </div>
    </div>
  );
}
