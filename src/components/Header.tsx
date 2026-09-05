"use client";

import React from "react";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  isDemoMode: boolean;
  onApplyPreset?: (presetName: string) => void;
}

export function Header({ isDemoMode, onApplyPreset }: HeaderProps) {
  return (
    <header className="border-b border-slate-800/80 bg-background/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between bg-background text-foreground">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-100 tracking-tight">
                Capstone<span className="text-indigo-400">AI</span>
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                MVP Architect
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Final-Year Engineering Project Blueprint Engine
            </p>
          </div>
        </div>

        {/* Status indicator & presets */}
        <div className="flex items-center space-x-3">
          {/* Quick preset selector for judges */}
          {onApplyPreset && (
            <div className="hidden md:flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-900/90 border border-slate-800 rounded-lg p-1">
              <span className="px-2 py-1 font-medium text-slate-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Presets:
              </span>
              <button
                type="button"
                onClick={() => onApplyPreset("Healthcare")}
                className="px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                Healthcare
              </button>
              <button
                type="button"
                onClick={() => onApplyPreset("FinTech")}
                className="px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                FinTech
              </button>
              <button
                type="button"
                onClick={() => onApplyPreset("Cybersecurity")}
                className="px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                Security
              </button>
              <button
                type="button"
                onClick={() => onApplyPreset("EdTech")}
                className="px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                EdTech
              </button>
            </div>
          )}

          {/* Service Status Badge */}
          <div
            className={`flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full font-medium border ${
              isDemoMode
                ? "bg-amber-950/40 text-amber-300 border-amber-800/60"
                : "bg-emerald-950/40 text-emerald-300 border-emerald-800/60"
            }`}
            title={
              isDemoMode
                ? "Running with curated high-fidelity fallback blueprints (Set GEMINI_API_KEY for live AI)"
                : "Live Gemini AI active"
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isDemoMode ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
              }`}
            />
            <span>{isDemoMode ? "Curated Mode" : "Gemini AI Live"}</span>
          </div>
          <ThemeToggle />

          {/* Production Safe Badge */}
          <div className="hidden sm:flex items-center space-x-1 text-xs text-slate-400 bg-slate-900/60 border border-slate-800/80 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Secure MVP</span>
          </div>
        </div>
      </div>
    </header>
  );
}
