"use client";

import React, { useState } from "react";
import { ProjectBlueprint } from "@/lib/types";
import {
  X,
  SlidersHorizontal,
  AlertCircle,
  Wand2,
} from "lucide-react";

interface RefineModalProps {
  blueprint: ProjectBlueprint | null;
  isOpen: boolean;
  onClose: () => void;
  onRefineSuccess: (refinedBlueprint: ProjectBlueprint) => void;
}

const QUICK_PRESETS = [
  {
    label: "Solo Dev (4-Week Sprint)",
    prompt: "Streamline architecture for a solo student developer to build a rock-solid MVP in 4 weeks.",
  },
  {
    label: "IEEE Research Angle",
    prompt: "Elevate the AI/ML component and experimental evaluation methodology for publication in an IEEE student conference.",
  },
  {
    label: "Enterprise Security & HIPAA/SOC2",
    prompt: "Incorporate strict end-to-end encryption, audit trails, and privacy compliance.",
  },
  {
    label: "Mobile-First & Offline Sync",
    prompt: "Adapt the frontend to cross-platform mobile (Flutter / React Native) with local SQLite offline caching.",
  },
  {
    label: "Zero-Cost Free Tier",
    prompt: "Constrain all cloud infrastructure and models to completely free-tier services (Vercel, Supabase, HuggingFace free models).",
  },
];

export function RefineModal({
  blueprint,
  isOpen,
  onClose,
  onRefineSuccess,
}: RefineModalProps) {
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !blueprint) return null;

  const handleApplyPreset = (preset: { label: string; prompt: string }) => {
    setSelectedPreset(preset.label);
    setCustomPrompt(preset.prompt);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) {
      setError("Please select a preset or type your refinement guidance.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/refine-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blueprint,
          refinementPrompt: customPrompt.trim(),
          quickPreset: selectedPreset || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to refine idea");
      }

      onRefineSuccess(data.data);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred during refinement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-950 text-indigo-400 rounded-xl border border-indigo-800/60">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Refine & Tailor Project</h3>
              <p className="text-xs text-slate-400">
                Adjust constraints, technology choices, or project scope
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Project Context */}
        <div className="mb-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs">
          <span className="font-semibold text-slate-300 block mb-0.5">Original Project:</span>
          <p className="font-medium text-indigo-300">{blueprint.title}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-800/70 rounded-xl flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick presets */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Quick Refinement Presets
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PRESETS.map((p) => {
                const isSelected = selectedPreset === p.label;
                return (
                  <button
                    type="button"
                    key={p.label}
                    onClick={() => handleApplyPreset(p)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Guidance */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Custom Refinement Instructions
            </label>
            <textarea
              rows={3}
              value={customPrompt}
              maxLength={400}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Focus specifically on cardiovascular anomalies, or switch the backend to Go..."
              className="w-full bg-slate-950/90 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>Be specific about features, deadlines, or tech stack constraints</span>
              <span>{customPrompt.length}/400</span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
                isSubmitting
                  ? "bg-indigo-700/50 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Refining Blueprint...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Apply Refinement</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
