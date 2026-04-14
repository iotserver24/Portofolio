type Project = {
  title: string;
  tag?: string;
  description: string;
  link?: string;
  github?: string;
  techStack: string[];
};

type Group = {
  id: "flagship" | "tools" | "labs";
  label: string;
  projects: Project[];
};

const flagship: Project[] = [
  {
    title: "Xibe AI",
    tag: "Currently Working",
    description:
      "Node.js-based platform for building websites and apps with 20+ AI models, GitHub integration, and deployment tools.",
    link: "https://xibe.app",
    github: "Private",
    techStack: ["Node.js", "AI", "Web", "Tools"],
  },
  {
    title: "Xibe Chat",
    tag: "Open Source",
    description:
      "Cross-platform AI chat app with multiple models, code execution previews, and image generation.",
    link: "https://chat.xibe.app",
    github: "https://github.com/iotserver24/Xibe-chat-app",
    techStack: ["Flutter", "Dart", "E2B Sandbox", "SQLite"],
  },
  {
    title: "Xibe Chat CLI",
    tag: "Open Source",
    description:
      "Python CLI for AI chat, image generation, and intelligent terminal automation with a rich TUI.",
    link: "https://pypi.org/project/xibe-chat-cli",
    github: "https://github.com/iotserver24/xibe-chat-cli",
    techStack: ["Python", "Rich", "Prompt Toolkit", "CLI"],
  },
  {
    title: "PR Review Bot",
    tag: "Open Source",
    description:
      "AI GitHub bot that reviews pull requests, analyzes code quality per file, and posts feedback automatically.",
    link: "https://pr.xibe.app",
    github: "https://github.com/iotserver24/PR-REVIEW-XIBE",
    techStack: ["Node.js", "OpenAI API", "GitHub API", "Docker"],
  },
  {
    title: "MegaVault (Legacy)",
    description:
      "Cloud storage platform with encrypted storage, premium plans, sharing, and developer APIs.",
    link: "https://megavault.pw",
    github: "Private",
    techStack: [
      "Node.js",
      "Express",
      "Railway",
      "Pyrogram",
      "Razorpay",
      "Brevo",
      "Cloudflare Workers",
    ],
  },
  {
    title: "Sub.MegaVault",
    tag: "Open Source",
    description:
      "S3-compatible storage platform built with Next.js, supporting Cloudflare R2, AWS S3, and more.",
    link: "https://sub.megavault.pw",
    github: "https://github.com/iotserver24/S3-MegaVault",
    techStack: ["Next.js", "TypeScript", "Redis", "S3", "Tailwind CSS"],
  },
  {
    title: "Video-Gen",
    tag: "Open Source",
    description:
      "Text match-cut video generator that turns scripts into stylized videos with custom duration, FPS, resolution, and styles.",
    link: "https://video-gen.megavault.in",
    github: "https://github.com/iotserver24/match-cut-ai",
    techStack: ["JavaScript", "TailwindCSS", "FFmpeg", "Railway", "CDN", "AI"],
  },
  {
    title: "Pollin-Coder",
    tag: "Open Source",
    description:
      "AI-powered code generator that turns app ideas into full projects with live preview, modular file output, and a gallery of generated apps.",
    link: "https://pollin-coder.megavault.in",
    github: "https://github.com/iotserver24/pollin-coder",
    techStack: ["Next.js", "TypeScript", "React", "Tailwind CSS", "OpenAI"],
  },
  {
    title: "AniSurge",
    tag: "Open Source",
    description:
      "Anime streaming app with HD playback, lists, offline downloads, and AI-powered public chat powered by Pollinations.",
    link: "https://anisurge.me",
    github: "https://github.com/iotserver24/anipro-app",
    techStack: ["Android", "JavaScript", "Pollinations AI"],
  },
];

const tools: Project[] = [
  {
    title: "Free-Mail",
    tag: "Currently Working",
    description:
      "Free platform for creating custom domain email addresses using Cloudflare Workers, Email Routing, Brevo SMTP, and MongoDB.",
    github: "https://github.com/iotserver24/free-mail",
    techStack: [
      "Cloudflare Workers",
      "Cloudflare Email Routing",
      "Brevo SMTP",
      "MongoDB",
      "JavaScript",
    ],
  },
  {
    title: "Lazy Certificate",
    tag: "Open Source",
    description:
      "Web-based bulk certificate generator with template upload, draggable text areas, rich typography, and CSV import.",
    link: "https://certi.anishkumar.tech",
    github: "https://github.com/iotserver24/lazy-certificate",
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Radix UI",
      "HTML5 Canvas",
    ],
  },
  {
    title: "Term AI",
    tag: "Tool",
    description:
      "Terminal-centric AI assistant that lets you interact with models directly from the command line.",
    github: "https://github.com/iotserver24/term-ai",
    techStack: ["TypeScript", "Node.js"],
  },
  {
    title: "z.ai Proxy",
    tag: "Automation / Workflow",
    description:
      "Backend proxy that wraps chat.z.ai into an API-style interface for programmatic access and integrations.",
    github: "https://github.com/iotserver24/z.ai-proxy",
    techStack: ["Python", "FastAPI"],
  },
  {
    title: "XibeGuard",
    tag: "Tool",
    description:
      "Security and reliability helper for the Xibe ecosystem, adding safeguards and tooling around AI-powered workflows.",
    github: "https://github.com/iotserver24/xibeguard",
    techStack: ["TypeScript", "Next.js", "React"],
  },
  {
    title: "Video Tools Hub",
    tag: "Tool",
    description:
      "Collection of browser-based utilities for working with video files and streams through a simple web interface.",
    github: "https://github.com/iotserver24/video-tools-hub",
    techStack: ["HTML", "JavaScript", "CSS"],
  },
  {
    title: "R3aper Tools",
    tag: "Tool",
    description:
      "Web-based toolbox of small developer and productivity utilities bundled into a single landing site.",
    github: "https://github.com/iotserver24/r3aper-tools",
    techStack: ["HTML", "JavaScript", "CSS"],
  },
  {
    title: "ACSA Site",
    tag: "Product",
    description:
      "Modern marketing and informational site for ACSA with a responsive, component-based frontend.",
    github: "https://github.com/iotserver24/acsa-site",
    techStack: ["TypeScript", "Next.js", "React", "Tailwind CSS"],
  },
  {
    title: "text2voice.bot",
    tag: "Tool",
    description:
      "Bot service that converts text into natural-sounding speech, designed for chat platforms and automation flows.",
    github: "https://github.com/iotserver24/text2voice.bot",
    techStack: ["Python"],
  },
];

const labs: Project[] = [
  {
    title: "SwasthSetu",
    tag: "Product",
    description:
      "Healthcare web application that helps patients and providers manage appointments and health information in one place.",
    github: "https://github.com/iotserver24/SwasthSetu",
    techStack: ["JavaScript", "React", "Node.js", "CSS"],
  },
  {
    title: "Plasma AI (Akrithi)",
    tag: "Tool",
    description:
      "Open-source AI coding assistant experience with a custom UI and workflow, inspired by tools like jules/codex.",
    github: "https://github.com/iotserver24/plasma-ai-akrithi",
    techStack: ["TypeScript", "Next.js", "React", "Tailwind CSS"],
  },
  {
    title: "Pay-me",
    tag: "Product",
    description:
      "Payment gateway implementation with Razorpay that handles payment verification, webhooks, and a Node.js + MongoDB backend.",
    github: "https://github.com/iotserver24/Pay-me",
    techStack: ["Node.js", "Express", "MongoDB", "JavaScript", "Razorpay"],
  },
  {
    title: "Coderfy",
    tag: "Halted Project",
    description:
      "Experimental platform for generating complete Next.js codebases with AI. Currently paused but explores powerful dev workflows.",
    link: "https://coderfy.megavault.in",
    techStack: ["Next.js", "AI", "Web"],
  },
  {
    title: "Xibecode",
    tag: "Product",
    description:
      "Agent-native code editor and workspace that integrates AI coding assistance, skills, and workflows into a full development environment.",
    link: "https://xibecode.vercel.app",
    github: "https://github.com/iotserver24/Xibecode",
    techStack: ["TypeScript", "Electron", "React", "Bun", "Playwright"],
  },
  {
    title: "Skill Marketplace",
    tag: "Product",
    description:
      "Web app for discovering, browsing, and managing AI agent skills as reusable, composable building blocks.",
    github: "https://github.com/iotserver24/Skill-marketplace",
    techStack: ["TypeScript", "Next.js", "React", "Tailwind CSS"],
  },
];

const groups: Group[] = [
  { id: "flagship", label: "# flagship-products", projects: flagship },
  { id: "tools", label: "# tools-and-automation", projects: tools },
  { id: "labs", label: "# experiments-and-labs", projects: labs },
];

export function ProjectsApp() {
  return (
    <div className="font-mono text-[13px] text-white">
      <p className="text-xs text-zinc-300/70">$ ls ~/repos</p>
      <p className="mt-2 text-xs text-zinc-100/60">
        Selected projects from github.com/iotserver24
      </p>
      <div className="mt-5 space-y-8">
        {groups.map((group) => (
          <section key={group.id} className="space-y-3">
            <h2 className="text-xs text-emerald-300">{group.label}</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {group.projects.map((project) => (
                <article
                  key={project.title}
                  className="os-surface relative flex flex-col rounded-2xl p-4 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_22px_88px_rgba(0,0,0,0.62)]"
                >
                  <p className="text-[11px] text-zinc-100/60">
                    ~/repos/<span className="text-zinc-100/90">{project.title}</span>
                  </p>
                  {project.tag ? (
                    <span className="mt-1 inline-block rounded bg-white/5 px-2 py-0.5 text-[10px] text-zinc-100/70 ring-1 ring-white/10">
                      {project.tag}
                    </span>
                  ) : null}
                  <p className="mt-3 text-[11px] leading-relaxed text-zinc-100/85">
                    {project.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-zinc-100/70 ring-1 ring-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-[11px]">
                    {project.github ? (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-300 hover:text-sky-200"
                      >
                        [ github ]
                      </a>
                    ) : null}
                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-300 hover:text-emerald-200"
                      >
                        [ live ]
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

