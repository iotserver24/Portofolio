import type { ReactNode } from "react";

import { AboutApp } from "@/apps/AboutApp";
import { ActivityApp } from "@/apps/ActivityApp";
import { ContactApp } from "@/apps/ContactApp";
import { ExperienceApp } from "@/apps/ExperienceApp";
import { OverviewApp } from "@/apps/OverviewApp";
import { ProjectsApp } from "@/apps/ProjectsApp";

export type AppId =
  | "overview"
  | "projects"
  | "activity"
  | "experience"
  | "about"
  | "contact";

export type OSApp = {
  id: AppId;
  name: string;
  subtitle?: string;
  accentClassName: string;
  icon: ReactNode;
  render: () => ReactNode;
};

function AppIcon({
  label,
  bgClassName,
}: {
  label: string;
  bgClassName: string;
}) {
  return (
    <div
      className={[
        "grid h-11 w-11 place-items-center rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.55)]",
        "ring-1 ring-white/10",
        bgClassName,
      ].join(" ")}
      aria-hidden
    >
      <span className="text-sm font-semibold tracking-tight text-white/95">
        {label}
      </span>
    </div>
  );
}

export const apps: OSApp[] = [
  {
    id: "overview",
    name: "Overview",
    subtitle: "Quick intro",
    accentClassName: "text-emerald-300",
    icon: <AppIcon label="AK" bgClassName="bg-emerald-500/35" />,
    render: () => <OverviewApp />,
  },
  {
    id: "projects",
    name: "Projects",
    subtitle: "GitHub-centric",
    accentClassName: "text-sky-300",
    icon: <AppIcon label="GH" bgClassName="bg-sky-500/35" />,
    render: () => <ProjectsApp />,
  },
  {
    id: "activity",
    name: "Activity",
    subtitle: "Recent ship log",
    accentClassName: "text-violet-300",
    icon: <AppIcon label="∿" bgClassName="bg-violet-500/35" />,
    render: () => <ActivityApp />,
  },
  {
    id: "experience",
    name: "Experience",
    subtitle: "Timeline",
    accentClassName: "text-fuchsia-300",
    icon: <AppIcon label="XP" bgClassName="bg-fuchsia-500/35" />,
    render: () => <ExperienceApp />,
  },
  {
    id: "about",
    name: "About",
    subtitle: "Bio + snapshot",
    accentClassName: "text-amber-300",
    icon: <AppIcon label="ME" bgClassName="bg-amber-500/35" />,
    render: () => <AboutApp />,
  },
  {
    id: "contact",
    name: "Contact",
    subtitle: "Send a message",
    accentClassName: "text-rose-300",
    icon: <AppIcon label="@" bgClassName="bg-rose-500/35" />,
    render: () => <ContactApp />,
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
  "about",
  "contact",
];

