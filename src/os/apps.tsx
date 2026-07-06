import type { ReactNode } from "react";

import { AboutApp } from "@/apps/AboutApp";
import { ActivityApp } from "@/apps/ActivityApp";
import { ContactApp } from "@/apps/ContactApp";
import { DonateApp } from "@/apps/DonateApp";
import { ExperienceApp } from "@/apps/ExperienceApp";
import { MusicApp } from "@/apps/MusicApp";
import { OverviewApp } from "@/apps/OverviewApp";
import { ProjectsApp } from "@/apps/ProjectsApp";

import { TerminalApp } from "@/apps/TerminalApp";
import { SettingsApp } from "@/apps/SettingsApp";
import { ReadmeApp } from "@/apps/ReadmeApp";
import { OSAppIcon } from "@/components/os/icons/OSAppIcon";

export type AppId =
  | "overview"
  | "projects"
  | "activity"
  | "experience"
  | "music"
  | "about"
  | "contact"
  | "donate"
  | "terminal"
  | "settings"
  | "readme";

export type OSAppRenderContext = {
  kind: "desktop" | "mobile";
  onClose?: () => void;
};

export type OSApp = {
  id: AppId;
  name: string;
  subtitle?: string;
  accentClassName: string;
  icon: ReactNode;
  render: (ctx?: OSAppRenderContext) => ReactNode;
  mobilePresentation?: "card" | "fullscreen";
};

export const apps: OSApp[] = [
  {
    id: "overview",
    name: "Overview",
    subtitle: "Quick intro",
    accentClassName: "text-emerald-300",
    icon: (
      <OSAppIcon
        src="/os-icons/user.svg"
        alt="Overview"
        tintClassName="opacity-90"
      />
    ),
    render: () => <OverviewApp />,
  },
  {
    id: "projects",
    name: "Projects",
    subtitle: "GitHub-centric",
    accentClassName: "text-sky-300",
    icon: (
      <OSAppIcon
        src="/os-icons/brand-github.svg"
        alt="Projects"
        tintClassName="opacity-90"
      />
    ),
    render: () => <ProjectsApp />,
  },
  {
    id: "activity",
    name: "Activity",
    subtitle: "Recent ship log",
    accentClassName: "text-violet-300",
    icon: (
      <OSAppIcon
        src="/os-icons/activity.svg"
        alt="Activity"
        tintClassName="opacity-90"
      />
    ),
    render: () => <ActivityApp />,
  },
  {
    id: "experience",
    name: "Experience",
    subtitle: "Timeline",
    accentClassName: "text-fuchsia-300",
    icon: (
      <OSAppIcon
        src="/os-icons/briefcase.svg"
        alt="Experience"
        tintClassName="opacity-90"
      />
    ),
    render: () => <ExperienceApp />,
  },

  {
    id: "music",
    name: "Music",
    subtitle: "My playlist",
    accentClassName: "text-cyan-300",
    icon: (
      <OSAppIcon
        src="/os-icons/music.svg"
        alt="Music"
        tintClassName="opacity-90"
      />
    ),
    render: (ctx) => <MusicApp {...ctx} />,
    mobilePresentation: "fullscreen",
  },
  {
    id: "about",
    name: "About",
    subtitle: "Bio + snapshot",
    accentClassName: "text-amber-300",
    icon: (
      <OSAppIcon
        src="/os-icons/info-circle.svg"
        alt="About"
        tintClassName="opacity-90"
      />
    ),
    render: () => <AboutApp />,
  },
  {
    id: "contact",
    name: "Contact",
    subtitle: "Send a message",
    accentClassName: "text-rose-300",
    icon: (
      <OSAppIcon
        src="/os-icons/mail.svg"
        alt="Contact"
        tintClassName="opacity-90"
      />
    ),
    render: () => <ContactApp />,
  },
  {
    id: "donate",
    name: "Donate",
    subtitle: "Support my work",
    accentClassName: "text-emerald-300",
    icon: (
      <OSAppIcon
        src="/os-icons/heart.svg"
        alt="Donate"
        tintClassName="opacity-90"
      />
    ),
    render: () => <DonateApp />,
  },
  {
    id: "terminal",
    name: "Terminal",
    subtitle: "Command line",
    accentClassName: "text-zinc-200",
    icon: (
      <OSAppIcon
        src="/os-icons/terminal.svg"
        alt="Terminal"
        tintClassName="opacity-90"
      />
    ),
    render: () => <TerminalApp />,
  },
  {
    id: "settings",
    name: "Settings",
    subtitle: "System configuration",
    accentClassName: "text-zinc-400",
    icon: (
      <OSAppIcon>
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-full w-full"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </OSAppIcon>
    ),
    render: () => <SettingsApp />,
  },
  {
    id: "readme",
    name: "Readme Reader",
    subtitle: "Read notes",
    accentClassName: "text-emerald-400",
    icon: (
      <OSAppIcon>
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-full w-full"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </OSAppIcon>
    ),
    render: () => <ReadmeApp />,
  },
];

export const appsById = Object.fromEntries(
  apps.map((a) => [a.id, a]),
) as Record<AppId, OSApp>;

export const pinnedApps: AppId[] = [
  "overview",
  "projects",
  "activity",
  "experience",
  "music",
  "about",
  "contact",
  "donate",
  "terminal",
  "settings",
  "readme",
];
