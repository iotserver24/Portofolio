import type { ReactNode } from "react";

import { AboutApp } from "@/apps/AboutApp";
import { ActivityApp } from "@/apps/ActivityApp";
import { ContactApp } from "@/apps/ContactApp";
import { ExperienceApp } from "@/apps/ExperienceApp";
import { OverviewApp } from "@/apps/OverviewApp";
import { ProjectsApp } from "@/apps/ProjectsApp";
import { OSAppIcon } from "@/components/os/icons/OSAppIcon";

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
        src="/os-icons/heart.svg"
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
        src="/os-icons/info-circle.svg"
        alt="Experience"
        tintClassName="opacity-90"
      />
    ),
    render: () => <ExperienceApp />,
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

