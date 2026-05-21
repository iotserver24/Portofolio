"use client";

import { useState } from "react";

export function ReadmeApp() {
  const [activeFile, setActiveFile] = useState<"welcome" | "megavault" | "about">("welcome");

  const files = {
    welcome: {
      name: "README.txt",
      content: `=========================================
      WELCOME TO MEGAVAULT OS v24.110
=========================================

This is an interactive OS-style portfolio experience built with:
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Custom drag-and-drop window systems
  - Aero-Snap snap zone configurations
  - Interactive Desktop widgets

Get started by exploring the shortcuts:
  - Double-click icons on the desktop to launch apps.
  - Drag windows to the screen edges to snap.
  - Open the "System Settings" to adjust wallpapers, lock codes, and active widgets.
  - Use the Menu Bar dropdown options for system controls.

Feel free to browse around!
-- Anish Kumar (Founder)`,
    },
    megavault: {
      name: "MEGAVAULT_GOALS.txt",
      content: `[MEGAVAULT PROJECT VISION]

Megavault is designed to bridge the gap between secure cloud storage and real-time AI automation.

Core Features under development:
  1. Distributed Object Storage
     High-throughput storage buckets with built-in end-to-end encryption.
  
  2. Integrated AI Inference
     Trigger instant LLM text completion, image generation, or document summarization right inside your storage explorer.

  3. Edge Delivery Network
     Simultaneous multi-region caching to ensure fast assets distribution.

Status: Development / Active Prototypes`,
    },
    about: {
      name: "ABOUT_ME.txt",
      content: `[PROFILE & INSPIRATION]

Name: Anish Kumar
Role: Full-stack Developer & Creator
Origin: India
Studies: BTech in Advanced Communication Technology
School: NMAM Institute of Technology

Interests:
  - Agentic Workflows
  - Web3 / Decentralized Systems
  - User Experience Design
  - Cloud Infrastructure

Philosophy:
  "Build software that you love to use yourself.
   Performance, precision, and playfulness are key."`,
    },
  };

  return (
    <div className="flex h-full w-full flex-col font-mono text-[12px] text-zinc-100 overflow-hidden">
      {/* File browser header */}
      <div className="flex border-b border-zinc-800/80 bg-zinc-950/60 px-3 py-1.5 gap-2 items-center overflow-x-auto select-none">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mr-2">Files:</span>
        {Object.entries(files).map(([key, file]) => (
          <button
            key={key}
            onClick={() => setActiveFile(key as any)}
            className={`rounded px-2.5 py-0.5 border transition-all ${
              activeFile === key
                ? "bg-zinc-800 border-zinc-700 text-emerald-400 font-semibold"
                : "bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
            }`}
          >
            📄 {file.name}
          </button>
        ))}
      </div>

      {/* Editor body */}
      <div className="flex-1 p-4 bg-zinc-950/20 overflow-y-auto leading-relaxed select-text selection:bg-emerald-500/20 selection:text-emerald-300">
        <div className="text-[10px] text-zinc-600 mb-2 border-b border-zinc-900/60 pb-1 flex justify-between">
          <span>PATH: ~/desktop/{files[activeFile].name}</span>
          <span>LINES: {files[activeFile].content.split("\n").length}</span>
        </div>
        <pre className="whitespace-pre-wrap font-mono text-[12px] text-zinc-300 antialiased">
          {files[activeFile].content}
        </pre>
      </div>
    </div>
  );
}
