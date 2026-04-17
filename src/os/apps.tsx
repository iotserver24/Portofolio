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
  | "terminal";

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
];

export const appsById = Object.fromEntries(apps.map((a) => [a.id, a])) as Record<
  AppId,
  OSApp
>;

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
];

