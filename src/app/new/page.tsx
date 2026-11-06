"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./style.css";

type Mode = "collab" | "blueprint" | "follow";
type Agent = { x: number; y: number; color: string; name: string; seed: number };
const colors = ["#f87171", "#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#fb7185", "#22d3ee"];
const names = ["pixel", "nova", "orbit", "atlas", "echo", "byte", "muse", "flux", "neo", "zero", "iris", "node", "sage", "wave"];
const themes = [
  { id: "crimson", accent: "#ef4444" },
  { id: "electric", accent: "#70aaff" },
  { id: "terminal", accent: "#63dca0" },
  { id: "violet", accent: "#bf9bff" },
  { id: "amber", accent: "#f4b860" },
  { id: "arctic", accent: "#5ed9e7" },
  { id: "rose", accent: "#f794ac" },
  { id: "mono", accent: "#e8e6df" },
  { id: "cobalt", accent: "#8da5ff" },
  { id: "citrus", accent: "#c3de72" },
] as const;
const projects = [
  { title: "Xibe AI", category: "AI / DEVELOPER TOOLS", desc: "A platform for building websites and apps with AI models, GitHub integration, and deployment tools.", tags: ["Node.js", "AI", "Web"], link: "https://xibe.app", image: "/xibe-logo.png" },
  { title: "Sub.MegaVault", category: "CLOUD / STORAGE", desc: "S3-compatible storage built for a more flexible cloud, with support for Cloudflare R2 and AWS S3.", tags: ["Next.js", "TypeScript", "S3"], link: "https://sub.megavault.pw", image: "/projects/sub-megavault.png" },
  { title: "PR Review Bot", category: "AUTOMATION / OPEN SOURCE", desc: "An AI GitHub bot that reviews pull requests and delivers code quality feedback automatically.", tags: ["Node.js", "OpenAI", "Docker"], link: "https://github.com/iotserver24/PR-REVIEW-XIBE", image: "/pr-logo.png" },
  { title: "Pollin-Coder", category: "AI / EXPERIMENTS", desc: "Turn app ideas into full projects with live previews, modular output, and a gallery of creations.", tags: ["React", "TypeScript", "OpenAI"], link: "https://github.com/iotserver24/pollin-coder", image: "/projects/pollin-coder.png" },
];
const superchargeProjects = [
  { name: "Supercharge", kind: "RUST / AGENT RUNTIME", description: "A Rust-first, self-hostable agent workspace for coding and general-purpose tasks, with a focus on tools, execution, memory and extensibility. An active engineering build.", url: "https://github.com/supercharge-cli/supercharge" },
  { name: "Supercharge Studio", kind: "DESKTOP / ACP CLIENT", description: "An open-source desktop studio for Supercharge, with streaming agent conversations, tool activity, permissions and a built-in browser.", url: "https://github.com/supercharge-cli/supercharge-studio" },
  { name: "Supercharge Site", kind: "DOCUMENTATION / WEB", description: "The home for Supercharge documentation, installation, the plugin directory and its management platform.", url: "https://github.com/supercharge-cli/supercharge-site" },
  { name: "Supercharge Releases", kind: "CLI / DISTRIBUTION", description: "The public download channel for Supercharge AI, with release binaries and install scripts for desktop platforms.", url: "https://github.com/supercharge-cli/supercharge-releases" },
  { name: "Supercharge App", kind: "APP / REPOSITORY", description: "A repository reserved for the Supercharge app. The public repository is currently empty.", url: "https://github.com/supercharge-cli/supercharge-app" },
  { name: "Supercharge Plugin", kind: "PLUGINS / REPOSITORY", description: "A repository reserved for Supercharge plugins. The public repository is currently empty.", url: "https://github.com/supercharge-cli/supercharge-plugin" },
  { name: "Cloud Infra", kind: "INFRASTRUCTURE / REPOSITORY", description: "A repository reserved for cloud infrastructure. The public repository is currently empty.", url: "https://github.com/supercharge-cli/cloud-infra" },
];
const skills = [ ["01", "Languages", "JavaScript · TypeScript · Python · C++"], ["02", "Frontend", "React · Next.js · Tailwind CSS"], ["03", "Backend", "Node.js · Express · APIs"], ["04", "Cloud", "Cloudflare · AWS S3 · Railway"], ["05", "AI & automation", "OpenAI API · GitHub API · CLI tools"], ["06", "Mobile & data", "React Native · Flutter · Redis · SQLite"] ];

function Canvas({ count, mode, run, onFps, snap }: { count: number; mode: Mode; run: number; onFps: (fps: number) => void; snap: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const timeline = useRef({ run: -1, start: 0 });
  const agentsRef = useRef<Agent[]>([]);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let width = 0, height = 0, frame = 0, last = performance.now(), frames = 0, fpsAt = last, snapped = false;
    if (timeline.current.run !== run) { timeline.current = { run, start: performance.now() }; agentsRef.current = []; }
    const start = timeline.current.start;
    const agents = agentsRef.current;
    while (agents.length < count) { const i = agents.length; agents.push({ x: innerWidth / 2, y: innerHeight / 2, color: colors[i % colors.length], name: `${names[i % names.length]}_${String(i + 1).padStart(2, "0")}`, seed: i * 2.399 }); }
    const resize = () => { width = innerWidth; height = innerHeight; const dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = width * dpr; canvas.height = height * dpr; canvas.style.width = `${width}px`; canvas.style.height = `${height}px`; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const move = (e: PointerEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    resize(); window.addEventListener("resize", resize); window.addEventListener("pointermove", move);
    const draw = (now: number) => {
      const t = (now - start) / 1000; const introDuration = .35; const dt = Math.min((now - last) / 16.67, 3); last = now; ctx.clearRect(0, 0, width, height);
      const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-build]"));
      const activeElements = Array.from(document.querySelectorAll<HTMLElement>("[data-building=active], [data-building=typing]"));
      const progressFor = (el: HTMLElement) => el.dataset.building === "typing" ? (el.dataset.order === "type-first" ? 0 : 1) : Math.max(0, Math.min(1, (now - Number(el.dataset.started || now) - 50) / 350));
      const buildDone = document.querySelector("[data-build-complete=true]");
      const visible = targets.map(el => ({ el, rect: el.getBoundingClientRect() })).filter(({ rect }) => rect.bottom > 0 && rect.top < height);
      if (t > 3.6 && !snapped) { snapped = true; snap(); }
      if ((t > introDuration && activeElements.length > 0) || mode === "blueprint") {
        visible.forEach(({ el, rect }, i) => {
          if (mode !== "blueprint" && el.dataset.building !== "active" && el.dataset.building !== "typing") return;
          const progress = mode === "blueprint" ? 1 : progressFor(el);
          if (!progress) return;
          const w = rect.width * progress, h = rect.height * progress;
          ctx.save(); ctx.globalAlpha = .85; ctx.strokeStyle = colors[i % colors.length]; ctx.fillStyle = "rgba(59,130,246,.06)"; ctx.setLineDash([4, 4]); ctx.strokeRect(rect.left, rect.top, w, h); ctx.fillRect(rect.left, rect.top, w, h); ctx.setLineDash([]);
          [[rect.left,rect.top],[rect.left+w,rect.top],[rect.left,rect.top+h],[rect.left+w,rect.top+h]].forEach(([x,y]) => { ctx.fillStyle = "#fff"; ctx.fillRect(x-3,y-3,6,6); ctx.strokeRect(x-3,y-3,6,6); });
          ctx.font = "10px monospace"; const label = `${el.dataset.build} ${Math.round(w)}×${Math.round(h)}`; ctx.fillStyle = colors[i % colors.length]; ctx.fillRect(rect.left, rect.top - 17, ctx.measureText(label).width + 10, 16); ctx.fillStyle = "#09090b"; ctx.fillText(label, rect.left + 5, rect.top - 5); ctx.strokeStyle = colors[i % colors.length]; ctx.globalAlpha = .5; ctx.beginPath(); ctx.moveTo(rect.left + w / 2 - 6, rect.top + h / 2); ctx.lineTo(rect.left + w / 2 + 6, rect.top + h / 2); ctx.moveTo(rect.left + w / 2, rect.top + h / 2 - 6); ctx.lineTo(rect.left + w / 2, rect.top + h / 2 + 6); ctx.stroke(); ctx.restore();
        });
      }
      agents.slice(0, count).forEach((a, i) => {
        const victimIndex = count - 1 - i;
        const collisionAt = 2.35 + victimIndex * .25;
        const isVictim = count > 20 && victimIndex >= 0 && victimIndex < 4;
        if (isVictim && t >= collisionAt + .18) return;
        let tx: number, ty: number;
        if (t < introDuration) { const angle = a.seed + t * 2; const radius = 18 + (i % 7) * 7 + Math.sin(t * 4 + i) * 4; tx = width / 2 + Math.cos(angle) * radius; ty = height / 2 + Math.sin(angle) * radius; }
        else if (mode === "follow" && mouse.current.x > 0) { const angle = a.seed + now / 1800; const radius = 20 + (i % 10) * 9; tx = mouse.current.x + Math.cos(angle) * radius; ty = mouse.current.y + Math.sin(angle) * radius; }
        else if (buildDone && mode === "collab") { tx = width - 65 + Math.cos(a.seed) * (i % 7) * 5; ty = height - 90 + Math.sin(a.seed) * (i % 7) * 5; }
        else { const job = targets[i % Math.max(targets.length, 1)]; const jobRect = job?.getBoundingClientRect(); const jobVisible = jobRect && jobRect.bottom > 0 && jobRect.top < height; const target = jobVisible ? jobRect : visible[i % Math.max(visible.length, 1)]?.rect; const cycle = Math.floor(t / 5 + i / 8); const rx = ((Math.sin(i * 91.7 + cycle * 17) + 1) / 2); const ry = ((Math.cos(i * 43.3 + cycle * 11) + 1) / 2); tx = target ? target.left + target.width * rx : width * rx; ty = target ? target.top + target.height * ry : height * ry; tx += Math.sin(t * .8 + i) * 12; ty += Math.cos(t * .7 + i) * 10; }
        const activeElement = activeElements.find(el => Number(el.dataset.worker) % count === i || (Number(el.dataset.worker) + 1) % count === i);
        const activeBuild = activeElement?.getBoundingClientRect();
        const assignedWorker = Number(activeElement?.dataset.worker ?? 0) % count;
        const workAge = activeElement ? now - Number(activeElement.dataset.started || now) : 0;
        const isWorker = !!activeBuild;
        if (activeBuild && activeElement) {
          if (i === assignedWorker) {
            const progress = progressFor(activeElement);
            tx = activeBuild.left + activeBuild.width * progress;
            ty = activeBuild.top + activeBuild.height * progress;
            if (activeElement.dataset.building === "typing") { tx = activeBuild.left + Math.min(activeBuild.width - 12, 18 + (workAge / 800) * Math.min(activeBuild.width - 30, 200)); ty = activeBuild.top + Math.min(activeBuild.height - 8, 22); }
          } else { tx = activeBuild.left; ty = activeBuild.top; }
        }
        if (isVictim && t > collisionAt - .35) {
          const attacker = agents[i - 4];
          if (attacker) { tx = attacker.x + 4; ty = attacker.y + 4; }
        }
        if (isVictim && t >= collisionAt && t < collisionAt + .18) {
          ctx.save(); ctx.strokeStyle = a.color; ctx.globalAlpha = 1 - (t - collisionAt) / .18; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(a.x, a.y, 5 + (t - collisionAt) * 90, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        }
        const ease = isWorker ? (workAge > 150 ? .8 : .18) : 1 - Math.pow(t < introDuration ? .82 : .965, dt); a.x += (tx - a.x) * ease; a.y += (ty - a.y) * ease;
        ctx.save(); ctx.translate(a.x, a.y); ctx.shadowColor = "#0009"; ctx.shadowBlur = 5; ctx.fillStyle = a.color; ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 16); ctx.lineTo(4.5, 12); ctx.lineTo(8, 19); ctx.lineTo(11, 17); ctx.lineTo(7, 10); ctx.lineTo(14, 10); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
        if (width > 600 || i % 3 === 0) { ctx.font = "bold 10px monospace"; const agentLabel = isWorker && i === assignedWorker ? `${a.name} · ${activeElement?.dataset.building === "typing" ? "typing" : "resizing"}` : a.name; const labelWidth = ctx.measureText(agentLabel).width + 10; ctx.fillStyle = a.color; ctx.beginPath(); ctx.roundRect(11, 12, labelWidth, 17, 3); ctx.fill(); ctx.fillStyle = "#09090b"; ctx.fillText(isWorker && i === assignedWorker ? `${a.name} · ${activeElement?.dataset.building === "typing" ? "typing" : "resizing"}` : a.name, 16, 24); }
        if (t > 3.6 && t < 4.3 && i % 8 === 0) { ctx.strokeStyle = a.color; ctx.globalAlpha = 1 - (t - 3.6) / .7; ctx.beginPath(); ctx.arc(0, 0, (t - 3.6) * 35, 0, Math.PI * 2); ctx.stroke(); } ctx.restore();
      });
      frames++; if (now - fpsAt > 1000) { onFps(Math.round(frames * 1000 / (now - fpsAt))); frames = 0; fpsAt = now; } frame = requestAnimationFrame(draw);
    }; frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move); };
  }, [count, mode, run, onFps, snap]);
  return <canvas ref={ref} className="swarm-canvas" aria-hidden="true" />;
}

export default function NewPortfolio() {
  const [theme, setTheme] = useState<(typeof themes)[number]>(themes[0]);
  const [typed, setTyped] = useState(0); const [run, setRun] = useState(0); const [count, setCount] = useState(20); const [mode, setMode] = useState<Mode>("collab"); const [fps, setFps] = useState(60); const [phase, setPhase] = useState(0); const [audio, setAudio] = useState(false); const [drawer, setDrawer] = useState(false); const [copied, setCopied] = useState(false);
  const [name, setName] = useState("Anish Kumar"); const [role, setRole] = useState("Developer, founder & curious human."); const [bio, setBio] = useState("I’m a full-stack developer, engineering student and founder of Megavault. I build Supercharge, cloud platforms and AI-powered coding tools that make ambitious ideas useful."); const [accent, setAccent] = useState("#ef4444");
  useEffect(() => {
    let previous = "";
    try { previous = sessionStorage.getItem("portfolio-theme") ?? ""; } catch { /* Storage is optional. */ }
    const options = themes.filter(item => item.id !== previous);
    const selected = options[Math.floor(Math.random() * options.length)];
    setTheme(selected);
    setAccent(selected.accent);
    try { sessionStorage.setItem("portfolio-theme", selected.id); } catch { /* Storage is optional. */ }
  }, []);
  const audioCtx = useRef<AudioContext | null>(null); const audioEnabled = useRef(false);
  const snap = useCallback(() => { if (!audioEnabled.current || !audioCtx.current) return; const ctx = audioCtx.current; const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.frequency.setValueAtTime(750, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + .06); gain.gain.setValueAtTime(.04, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .06); osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + .06); }, []);
  useEffect(() => {
    setTyped(0);
    setCount(20);
    const root = document.querySelector<HTMLElement>(".portfolio-content");
    if (!root) return;
    const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-build]"));
    elements.forEach(el => { el.dataset.building = "waiting"; });
    delete root.dataset.buildComplete;
    const hero = new Set(["NAV_BAR", "TITLE", "DISPLAY_TITLE", "HERO_FRAME", "AVATAR_CONTAINER", "TELEMETRY", "METRICS"]);
    const timers: ReturnType<typeof setTimeout>[] = [];
    let typing: ReturnType<typeof setInterval> | undefined;
    const schedule = (fn: () => void, delay: number) => { timers.push(setTimeout(fn, delay)); };
    const beginElement = (el: HTMLElement, index: number, duration: number) => {
      el.dataset.order = index % 2 === 0 ? "type-first" : "resize-first";
      el.dataset.building = el.dataset.order === "type-first" ? "typing" : "active";
      el.dataset.worker = String((index * 2) % (hero.has(el.dataset.build ?? "") ? 20 : 42));
      el.dataset.started = String(performance.now());
      if (el.dataset.build === "HERO_FRAME") typing = setInterval(() => setTyped(v => Math.min(v + 5, 240)), 18);
      schedule(() => {
        el.dataset.building = el.dataset.order === "type-first" ? "active" : "typing";
        el.dataset.started = String(performance.now());
      }, duration / 2);
      schedule(() => { el.dataset.building = "placed"; }, duration);
    };
    schedule(() => {
      setPhase(2);
      elements.filter(el => hero.has(el.dataset.build ?? "")).forEach((el, index) => {
        schedule(() => beginElement(el, index, 1250), (index % 3) * 180);
      });
    }, 350);
    const sections = Array.from(root.querySelectorAll<HTMLElement>("section.section[data-build]"));
    schedule(() => setCount(46), 1900);
    sections.forEach((section, sectionIndex) => {
      const start = 1900 + sectionIndex * 330;
      schedule(() => {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        beginElement(section, 10 + sectionIndex, 320);
        section.querySelectorAll<HTMLElement>("[data-build]").forEach((el, childIndex) => {
          schedule(() => beginElement(el, 15 + sectionIndex * 8 + childIndex, 300), 60 + (childIndex % 4) * 35);
        });
      }, start);
    });
    schedule(() => {
      elements.forEach(el => { el.dataset.building = "placed"; });
      root.dataset.buildComplete = "true";
      setTyped(240);
      setPhase(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
      snap();
    }, 3800);
    return () => { timers.forEach(clearTimeout); if (typing) clearInterval(typing); };
  }, [run, snap]);
  useEffect(() => { const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("in-view"); }), { threshold: .08 }); document.querySelectorAll(".reveal").forEach(el => observer.observe(el)); return () => observer.disconnect(); }, []);
  const replay = () => { window.scrollTo({ top: 0, behavior: "instant" }); setPhase(0); setRun(v => v + 1); };
  const toggleAudio = () => { if (!audioCtx.current) audioCtx.current = new AudioContext(); void audioCtx.current.resume(); audioEnabled.current = !audioEnabled.current; setAudio(audioEnabled.current); if (audioEnabled.current) snap(); };
  return <main className={`new-portfolio theme-${theme.id} phase-${phase} ${mode === "blueprint" ? "blueprint" : ""}`} style={{ "--accent": accent } as React.CSSProperties}>
    <Canvas count={count} mode={mode} run={run} onFps={setFps} snap={snap} />
    {phase === 0 && <div className="initializing"><span className="pulse-dot" /> INITIALIZING {count} COLLABORATIVE AGENTS <span className="init-muted">{"// CONNECTING TO CANVAS"}</span></div>}
    <div className="portfolio-content" key={run}>
      <header className="new-nav build-nav" data-build="NAV_BAR"><a className="brand" href="#top"><span className="brand-mark">A<span>K</span></span><span>ANISH KUMAR<small>INDEPENDENT BUILDER</small></span></a><nav><a href="#about">About</a><a href="#work">Work</a><a href="#stack">Stack</a><a href="#contact">Contact <span>↗</span></a></nav><span className="nav-status"><i /> AVAILABLE FOR IDEAS</span></header>
      <section className="hero" id="top"><div className="hero-top build-title" data-build="TITLE"><span>THE PORTFOLIO OF ANISH KUMAR</span><span>EST. 2023 &nbsp; / &nbsp; INDIA</span></div><h1 className="build-title" data-build="DISPLAY_TITLE"><span className="typed-title">PORTFOLIO</span></h1><div className="hero-grid"><div className="hero-copy build-copy" data-build="HERO_FRAME"><div className="hero-intro">Hello, I’m</div><h2><em>{name.toUpperCase()}.</em></h2><div className="live-label"><span /> {role.toUpperCase()}</div><p className="typed-bio">{bio.slice(0, typed)}<span className="typing-caret">▍</span></p><div className="hero-actions"><a className="primary-link" href="#work">Explore selected work <span>↗</span></a><a className="text-link" href="#contact">Get in touch ↗</a></div><div className="hero-foot"><span>SCROLL TO EXPLORE</span><span>↓</span></div></div><div className="portrait build-avatar" data-build="AVATAR_CONTAINER"><div className="portrait-grid" /><img src="/Photo.png" alt="Anish Kumar" /><div className="portrait-top"><span>FIG. 001 / THE OPERATOR</span><span>✳</span></div><div className="portrait-bottom"><span><i /> OPERATOR ACTIVE</span><span>AK / IN</span></div></div><div className="hero-monitor build-avatar" data-build="TELEMETRY"><div className="monitor-header"><span>01. / SYSTEM STATUS</span><span>● ONLINE</span></div><h3>Building useful things.</h3><p>Cloud storage, AI services, and developer tools — built with curiosity and a focus on real problems.</p><div className="monitor-line"><span>FOCUS</span><b>FULL-STACK DEVELOPMENT</b></div><div className="monitor-line"><span>BASE</span><b>INDIA / WORLDWIDE</b></div><div className="monitor-line"><span>CURRENTLY</span><b>MEGAVAULT + XIBE</b></div><span className="monitor-tag">SYSTEM OPERATIONAL ↗</span></div></div><div className="metrics build-metrics" data-build="METRICS"><div><strong>2023<span>↗</span></strong><small>BUILDING SINCE</small></div><div><strong>20<span>+</span></strong><small>PROJECTS IN PORTFOLIO</small></div><div><strong>3</strong><small>CORE FOCUSES: CLOUD, AI, TOOLS</small></div><div className="metric-note">A work in progress.<br /><span>Always shipping, always learning.</span></div></div></section>
      <section className="section supercharge-section reveal" id="supercharge" data-build="SUPERCHARGE"><div className="section-head"><span>FEATURED / THE SUPERCHARGE ECOSYSTEM</span><span>CODING TOOLS BY ANISH</span></div><div className="supercharge-intro" data-build="SUPERCHARGE_INTRO"><div><span className="supercharge-kicker">THE MAIN PROJECT</span><h2>Make more<br /><em>with agents.</em></h2></div><div><p className="large-copy">Supercharge is my collection of tools for building and working with AI agents — from the core agent to a desktop studio, documentation, and releases.</p><a className="supercharge-org" href="https://github.com/supercharge-cli" target="_blank" rel="noreferrer">EXPLORE THE ORGANIZATION ↗</a></div></div><div className="supercharge-list">{superchargeProjects.map((project, i) => <a className="supercharge-project" data-build={`SUPERCHARGE_${i + 1}`} href={project.url} target="_blank" rel="noreferrer" key={project.name}><span className="supercharge-number">{String(i + 1).padStart(2, "0")}</span><div><small>{project.kind}</small><h3>{project.name}</h3><p>{project.description}</p></div><span className="supercharge-arrow">↗</span></a>)}</div></section>
      <section className="section about reveal" id="about" data-build="ABOUT"><div className="section-head"><span>01 / THE PERSON BEHIND THE PIXELS</span><span>ABOUT.MD</span></div><div className="about-grid"><h2 data-build="ABOUT_HEADING">Curiosity is<br />the <em>starting point.</em></h2><div><p data-build="ABOUT_BIO" className="large-copy">I’m an engineering student and founder who likes to turn complex problems into useful, human-friendly products.</p><p data-build="ABOUT_STUDIES">I’m based in India and studying for a BTech in Advanced Communication Technology at NMAM Institute of Technology, where I’m building a foundation in communication systems, networking, and software engineering.</p><p data-build="ABOUT_FOUNDER">Outside the classroom, I founded Megavault to explore the intersection of secure cloud storage and AI automation. I enjoy working across the whole stack, from infrastructure and APIs to the small interface details that make a product feel good to use.</p><p data-build="ABOUT_INTERESTS">Alongside Supercharge and its desktop studio, my projects span AI chat, code generation, GitHub automation and S3-compatible storage. I’m especially interested in agentic workflows, cloud infrastructure, user experience and decentralized systems. My approach is simple: build software I’d love to use myself, keep learning, and ship things that solve real problems.</p><div className="about-facts" data-build="PROFILE_DETAILS"><div><span>BASED IN</span><strong>India</strong></div><div><span>STUDYING</span><strong>Advanced Communication Technology</strong></div><div><span>BUILDING</span><strong>Supercharge, Megavault &amp; Xibe</strong></div></div><div className="terminal" data-build="TERMINAL"><div><span>● ● ●</span> &nbsp; anish@workspace:~</div><code><span>$</span> cat philosophy.txt<br />Build things that solve real problems.<br />Keep learning. Ship often. Make it useful.<b>_</b></code></div></div></div></section>
      <section className="section work reveal" id="work" data-build="PROJECTS"><div className="section-head"><span>02 / A FEW THINGS I’VE MADE</span><span>SELECTED WORK [04]</span></div><div className="section-title" data-build="PROJECT_HEADING"><h2>Ideas, <em>deployed.</em></h2><p>From a first line of code to something out in the world. Here are a few of the things I’ve been building.</p></div><div className="project-grid">{projects.map((project, i) => <a className="project" data-build={`PROJECT_${i+1}`} href={project.link} target="_blank" rel="noreferrer" key={project.title}><div className={`project-image project-visual-${i + 1}`}><div className="project-visual-top"><span><i /> {project.title.toUpperCase()} / WORKSPACE</span><span>● ● ●</span></div><div className="project-visual-body"><div className="project-visual-sidebar"><span /><span /><span /><span /></div><div className="project-visual-content"><span className="project-visual-label">{project.category}</span><strong>{project.title}<span>_</span></strong><div className="project-visual-lines"><i /><i /><i /></div><div className="project-visual-chips">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><div className="project-visual-orbit"><span>0{i+1}</span></div></div><span className="project-index">PROJECT / 0{i+1}</span><span className="project-arrow">↗</span></div><div className="project-info"><div className="project-info-top"><small>{project.category}</small><span>0{i+1} / 04</span></div><h3>{project.title}</h3><p>{project.desc}</p><div className="project-info-bottom"><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><span className="project-visit">VIEW PROJECT ↗</span></div></div></a>)}</div><a className="all-work" href="https://github.com/iotserver24" target="_blank" rel="noreferrer">MORE ON GITHUB <span>↗</span></a></section>
      <section className="section stack reveal" id="stack" data-build="STACK"><div className="section-head"><span>03 / THE TOOLKIT</span><span>SYSTEMS MATRIX</span></div><div className="section-title" data-build="SKILLS_HEADING"><h2>Tools of the <em>trade.</em></h2><p>A growing collection of technologies I reach for to bring ideas to life.</p></div><div className="skill-grid">{skills.map(([num, title, tags]) => <div className="skill" data-build={title.toUpperCase()} key={title}><span>{num} /</span><h3>{title}</h3><p>{tags}</p></div>)}</div></section>
      <section className="section contact reveal" id="contact" data-build="CONTACT"><div className="section-head"><span>04 / NEXT TRANSMISSION</span><span>END OF FILE, START OF SOMETHING</span></div><div className="contact-inner" data-build="CONTACT_MESSAGE"><div><div className="live-label"><span /> OPEN TO COLLABORATION</div><h2>Have an idea?<br /><em>Let’s make it real.</em></h2><p>Whether it’s a project, a question, or just a hello, my inbox is open.</p><a href="mailto:iotserver24@gmail.com" className="primary-link">Start a conversation <span>↗</span></a><button className="copy-email" onClick={() => { void navigator.clipboard.writeText("iotserver24@gmail.com").then(() => setCopied(true)).catch(() => setCopied(false)); }}>{copied ? "EMAIL COPIED ✓" : "COPY EMAIL ADDRESS ↗"}</button></div><div className="contact-aside"><span>FIND ME ELSEWHERE</span><a href="https://github.com/iotserver24" target="_blank" rel="noreferrer">GitHub <b>↗</b></a><a href="https://www.linkedin.com/in/anish-kumar-1a5bb133a/" target="_blank" rel="noreferrer">LinkedIn <b>↗</b></a><a href="mailto:iotserver24@gmail.com">Email <b>↗</b></a></div></div><footer><span>© {new Date().getFullYear()} ANISH KUMAR</span><span>DESIGNED TO BE BUILT TOGETHER.</span><a href="#top">BACK TO TOP ↑</a></footer></section>
    </div>
    <div className="dock" aria-label="Canvas controls"><span className="dock-live"><i /> LIVE CANVAS</span><button onClick={replay} title="Replay build" aria-label="Replay build">↻</button><div className="dock-divider"/><div className="count-controls" aria-label="Agent count">{[20,56,100].map(n => <button className={count === n ? "active" : ""} onClick={() => setCount(n)} key={n}>{n}</button>)}</div><div className="dock-divider"/><div className="mode-controls">{([ ["collab", "Collab"], ["blueprint", "Blueprint"], ["follow", "Follow"] ] as const).map(([value,label]) => <button className={mode === value ? "active" : ""} onClick={() => setMode(value)} key={value}>{label}</button>)}</div><div className="dock-divider"/><button onClick={toggleAudio} aria-label={audio ? "Mute sound effects" : "Enable sound effects"} title={audio ? "Mute sound effects" : "Enable sound effects"}>{audio ? "♪" : "♩"}</button><button className={drawer ? "active" : ""} onClick={() => setDrawer(!drawer)} aria-label="Customize portfolio" title="Customize portfolio">⚙</button><div className="telemetry"><span><i /> {count} AGENTS</span><span>{fps} FPS</span></div></div>
    {drawer && <aside className="drawer"><div className="drawer-head"><div><small>CANVAS SETTINGS</small><h2>Make it yours.</h2></div><button onClick={() => setDrawer(false)} aria-label="Close settings">×</button></div><p>Preview a few details in this canvas. Changes stay in this browser session.</p><label>Name<input value={name} onChange={e => setName(e.target.value)} /></label><label>Role<input value={role} onChange={e => setRole(e.target.value)} /></label><label>Bio<textarea value={bio} onChange={e => setBio(e.target.value)} rows={5} /></label><label>Accent color<input className="color-input" type="color" value={accent} onChange={e => setAccent(e.target.value)} /></label><div className="drawer-note">INSPECT MODE <span>Enable Blueprint to see live element dimensions.</span></div></aside>}
  </main>;
}
