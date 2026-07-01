/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import {
  Download,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Apple,
  Smartphone,
  Monitor,
  Mail,
  Linkedin,
  Github,
  Star,
  MapPin,
  MessageCircle,
} from "lucide-react";
import React, { useEffect, useState, useRef, ReactNode, useCallback } from "react";
import { HeroBackground } from "./HeroBackground";

// --- Shared utilities ---

const NAV_OFFSET = 96;

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
};

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
};

const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string, onNavigate?: () => void) => {
  e.preventDefault();
  scrollToSection(id);
  onNavigate?.();
};

// --- Global UI ---

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />;
};

const CustomCursor = ({ disabled }: { disabled?: boolean }) => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const ringPos = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (disabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovered(
        !!(
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.closest("button") ||
          target.closest("a") ||
          target.closest(".proj-card") ||
          target.closest(".sk") ||
          target.closest(".contact-item")
        )
      );
    };

    let raf: number;
    const animateRing = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.13;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.13;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }
      raf = requestAnimationFrame(animateRing);
    };
    raf = requestAnimationFrame(animateRing);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(raf);
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div ref={ringRef} className={`cursor-ring hidden md:block ${isHovered ? "expanded" : ""}`} />
    </>
  );
};

const NoiseOverlay = () => <div className="noise-overlay" aria-hidden="true" />;

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      className={`back-to-top ${visible ? "visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUp size={20} />
    </button>
  );
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  variant?: "up" | "left" | "right";
  key?: string | number;
}

const Reveal = ({ children, className = "", staggerDelay = 100, variant = "up" }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          const items = entry.target.querySelectorAll(".stagger-item");
          items.forEach((item, index) => {
            (item as HTMLElement).style.animationDelay = `${index * staggerDelay}ms`;
          });
        }
      },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [staggerDelay]);

  const variantClass =
    variant === "left" ? "reveal-l" : variant === "right" ? "reveal-r" : "reveal";

  return (
    <div ref={ref} className={`${variantClass} ${className}`}>
      {children}
    </div>
  );
};

const ScrambleText = ({
  text,
  active,
  delay = 0,
  reducedMotion = false,
}: {
  text: string;
  active: boolean;
  delay?: number;
  reducedMotion?: boolean;
}) => {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text);
      return;
    }
    if (!active) return;
    let frame = 0;
    const total = 70;
    let timer: ReturnType<typeof setInterval> | undefined;

    const start = setTimeout(() => {
      timer = setInterval(() => {
        setDisplay(
          text
            .split("")
            .map((ch, i) => {
              if (ch === " ") return " ";
              return frame / total > i / text.length ? ch : chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );
        frame++;
        if (frame > total) {
          if (timer) clearInterval(timer);
          setDisplay(text);
        }
      }, 16);
    }, delay);

    return () => {
      clearTimeout(start);
      if (timer) clearInterval(timer);
    };
  }, [active, text, delay, reducedMotion]);

  return <>{display}</>;
};

const HeroStatCounter = ({
  target,
  start,
  reducedMotion = false,
}: {
  target: number;
  start: boolean;
  reducedMotion?: boolean;
}) => {
  const [count, setCount] = useState(reducedMotion ? target : 0);

  useEffect(() => {
    if (reducedMotion) {
      setCount(target);
      return;
    }
    if (!start) return;
    let cur = 0;
    const timer = setInterval(() => {
      cur++;
      setCount(cur);
      if (cur >= target) clearInterval(timer);
    }, 120);
    return () => clearInterval(timer);
  }, [start, target, reducedMotion]);

  return <>{count}</>;
};

const Preloader = ({ onComplete, reducedMotion = false }: { onComplete: () => void; reducedMotion?: boolean }) => {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }

    const ticker = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + Math.floor(Math.random() * 6) + 2);
        if (next >= 100) clearInterval(ticker);
        return next;
      });
    }, 35);

    const forceComplete = setTimeout(() => setProgress(100), 5000);
    const safetyDismiss = setTimeout(() => onComplete(), 6500);

    return () => {
      clearInterval(ticker);
      clearTimeout(forceComplete);
      clearTimeout(safetyDismiss);
    };
  }, [reducedMotion, onComplete]);

  useEffect(() => {
    if (reducedMotion || progress < 100) return;
    const timer = setTimeout(() => setExiting(true), 400);
    return () => clearTimeout(timer);
  }, [progress, reducedMotion]);

  return (
    <motion.div
      className="preloader"
      initial={false}
      animate={exiting ? { clipPath: "inset(0 0 100% 0)" } : { clipPath: "inset(0 0 0 0)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => {
        if (exiting) onComplete();
      }}
    >
      <span className="pl-bg-line pl-bg-line-h" style={{ top: "33%" }} aria-hidden="true" />
      <span className="pl-bg-line pl-bg-line-h" style={{ top: "66%" }} aria-hidden="true" />
      <span className="pl-bg-line pl-bg-line-v" style={{ left: "33%" }} aria-hidden="true" />
      <span className="pl-bg-line pl-bg-line-v" style={{ left: "66%" }} aria-hidden="true" />
      <span className="pl-corner pl-corner-tl">HZ — 2026</span>
      <span className="pl-corner pl-corner-tr">Flutter Dev</span>
      <span className="pl-corner pl-corner-bl">Islamabad, PK</span>
      <span className="pl-corner pl-corner-br">Portfolio</span>

      <motion.div
        className="pl-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.span
          className="pl-title-inner"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          Hassan
        </motion.span>
      </motion.div>
      <motion.div
        className="pl-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.32 }}
      >
        <motion.span
          className="pl-title-inner pl-title-accent"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
        >
          Zafar
        </motion.span>
      </motion.div>

      <motion.p
        className="pl-sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        Senior Flutter Developer
      </motion.p>

      <div className="pl-bar-wrap">
        <div className="pl-bar" style={{ left: `${progress - 100}%` }} />
      </div>
      <p className="pl-pct">{String(progress).padStart(3, "0")}</p>
    </motion.div>
  );
};

// --- Navigation ---

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSegment, setActiveSegment] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSegment(entry.target.id);
        });
      },
      { threshold: 0.35 }
    );

    const sections = ["hero", "about", "skills", "experience", "projects", "testimonials", "contact"];
    sections.forEach((section) => {
      const el = document.getElementById(section);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const navItems = [
    { label: "About", id: "about", n: "01" },
    { label: "Skills", id: "skills", n: "02" },
    { label: "Experience", id: "experience", n: "03" },
    { label: "Work", id: "projects", n: "04" },
    { label: "Reviews", id: "testimonials", n: "05" },
    { label: "Contact", id: "contact", n: "06" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] nav-bg ${isScrolled ? "scrolled" : ""}`} aria-label="Main navigation">
      <div
        className={`max-w-[1320px] mx-auto flex justify-between items-center transition-all duration-500 ${
          isScrolled ? "py-4 px-6 md:px-12" : "py-7 px-6 md:px-12"
        }`}
      >
        <a
          href="#hero"
          className="nav-logo"
          onClick={(e) => handleAnchorClick(e, "hero", () => setIsMenuOpen(false))}
        >
          H<span className="text-accent">.</span>Zafar
        </a>

        <div className="hidden lg:flex items-center gap-8 xl:gap-10">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-n={item.n}
              className={`nav-link ${activeSegment === item.id ? "active" : ""}`}
              onClick={(e) => handleAnchorClick(e, item.id)}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/projects/Senior_Flutter_Developer_Hassan_Zafar.pdf"
            download="Senior_Flutter_Developer_Hassan_Zafar.pdf"
            className="hidden md:inline-flex nav-cta"
          >
            <span>
              <Download size={14} className="inline mr-1 -mt-0.5" aria-hidden="true" />
              Resume
            </span>
          </a>
          <a
            href="#contact"
            className="hidden sm:inline-flex nav-cta"
            onClick={(e) => handleAnchorClick(e, "contact")}
          >
            <span>Let&apos;s talk →</span>
          </a>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden nav-menu-btn text-primary"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-strong border-t border-[var(--border)] px-6 py-6 space-y-1"
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleAnchorClick(e, item.id, () => setIsMenuOpen(false))}
                className={`block px-4 py-3 font-mono text-xs uppercase tracking-widest transition-colors ${
                  activeSegment === item.id ? "text-accent" : "text-muted hover:text-primary"
                }`}
              >
                {item.n} — {item.label}
              </a>
            ))}
            <a
              href="/projects/Senior_Flutter_Developer_Hassan_Zafar.pdf"
              download="Senior_Flutter_Developer_Hassan_Zafar.pdf"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 mt-4 btn-primary w-full"
            >
              <Download size={16} />
              Download Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Hero ---

const HERO_LINES = [
  { id: "l1", content: <>I build</> },
  { id: "l2", content: <span className="italic text-accent">Flutter</span> },
  { id: "l3", content: <span className="stroke">apps</span> },
  {
    id: "l4",
    content: (
      <>
        that <span className="italic text-accent">ship.</span>
      </>
    ),
  },
];

const Hero = ({ ready, reducedMotion = false }: { ready: boolean; reducedMotion?: boolean }) => (
  <section id="hero" className="relative min-h-[92vh] flex items-center overflow-hidden">
    <HeroBackground />
    <div className="relative z-10 w-full max-w-[1320px] mx-auto px-6 md:px-12 pt-32 pb-20 sm:pt-36 md:pt-40 md:pb-24">
      <motion.div
        className="hero-eyebrow"
        initial={{ opacity: 0, y: 20 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      >
        <span className="hero-eyebrow-dash" />
        <span>
          <ScrambleText text="Senior Flutter Developer" active={ready} delay={800} reducedMotion={reducedMotion} />
        </span>
      </motion.div>

      <div className="hero-layout">
        <div className="hero-heading">
          <h1 className="hero-h1 mb-0">
            {HERO_LINES.map((line, i) => (
              <span key={line.id} className="hero-line block">
                <motion.span
                  className="hero-line-inner block"
                  initial={{ y: "105%" }}
                  animate={ready ? { y: 0 } : { y: "105%" }}
                  transition={{
                    duration: 1.1,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.1 + i * 0.1,
                  }}
                >
                  {line.content}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>

        <motion.div
          className="hero-portrait-slot"
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-portrait-wrap">
            <div className="hero-portrait-glow" aria-hidden="true" />
            <div className="hero-portrait-frame">
              <img
                src="https://lh3.googleusercontent.com/d/1v1UWFlG713TnVv-J5owqUUft6XCOT66z"
                alt="Hassan Zafar — Senior Flutter Developer"
                referrerPolicy="no-referrer"
                loading="eager"
                className="hero-portrait-img"
                onError={(e) => {
                  e.currentTarget.src = "https://picsum.photos/seed/hassan/800/800";
                  e.currentTarget.onerror = null;
                }}
              />
            </div>
          </div>
        </motion.div>

        <motion.p
          className="hero-desc text-base text-secondary leading-[1.8] max-w-[520px]"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Senior Mobile Architect crafting high-performance cross-platform apps — from{" "}
          <strong className="text-primary font-medium">architecture design</strong> and BLoC/Riverpod state management to CI/CD pipelines, Firebase backends, and App Store deployment across iOS, Android &amp; Web.
        </motion.p>

        <motion.aside
          className="hero-aside"
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-stats-row">
            <div className="stat text-center lg:text-right">
              <div className="stat-n">
                <HeroStatCounter target={5} start={ready} reducedMotion={reducedMotion} />+
              </div>
              <div className="stat-l">Years</div>
            </div>
            <div className="stat-sep" />
            <div className="stat text-center lg:text-right">
              <div className="stat-n">
                <HeroStatCounter target={10} start={ready} reducedMotion={reducedMotion} />+
              </div>
              <div className="stat-l">Apps</div>
            </div>
            <div className="stat-sep" />
            <div className="stat text-center lg:text-right">
              <div className="stat-n">
                5<span className="text-accent">★</span>
              </div>
              <div className="stat-l">Upwork</div>
            </div>
          </div>

          <div className="hero-ctas">
            <a href="#projects" className="btn-primary" onClick={(e) => handleAnchorClick(e, "projects")}>
              View work <span aria-hidden="true">→</span>
            </a>
            <a href="#contact" className="btn-ghost" onClick={(e) => handleAnchorClick(e, "contact")}>
              Let&apos;s talk
            </a>
          </div>

          <div className="hero-avail">
            <div className="avail-dot" />
            Available for new projects
          </div>
        </motion.aside>
      </div>
    </div>

    <motion.div
      className="scroll-cue hidden md:flex"
      initial={{ opacity: 0 }}
      animate={ready ? { opacity: 1 } : {}}
      transition={{ delay: 2.2, duration: 0.8 }}
    >
      <span className="font-mono text-[9px] text-muted tracking-[0.2em] uppercase">Scroll</span>
      <div className="scroll-cue-line" />
    </motion.div>
  </section>
);

// --- Marquee ---

const Marquee = () => {
  const row1 = [
    "Flutter", "Dart", "Firebase", "BLoC / Provider", "iOS & Android",
    "REST APIs", "Supabase", "CI/CD", "Mobile Architecture",
  ];
  const row2 = [
    "Senior Developer", "5.0★ Upwork", "5+ Years", "10+ Apps Shipped",
    "70+ Countries", "On-time Delivery", "Clean Architecture", "Cross-platform", "Available Now",
  ];

  const renderTrack = (items: string[], sep: string) => (
    <>
      {[...items, ...items].map((item, i) => (
        <div key={i} className="mq-item">
          {item}
          <span className="mq-sep">{sep}</span>
        </div>
      ))}
    </>
  );

  return (
    <div className="marquee-outer">
      <div className="overflow-hidden">
        <div className="marquee-track">{renderTrack(row1, "✦")}</div>
      </div>
      <div className="overflow-hidden border-t border-[var(--border)] marquee-row">
        <div className="marquee-track marquee-track--reverse">{renderTrack(row2, "◆")}</div>
      </div>
    </div>
  );
};

// --- About ---

const aboutSkills = [
  { name: "Flutter & Dart", yrs: "5 yrs" },
  { name: "Firebase & Supabase", yrs: "3 yrs" },
  { name: "BLoC / Provider", yrs: "3 yrs" },
  { name: "REST APIs & GraphQL", yrs: "4 yrs" },
  { name: "iOS & Android Deployment", yrs: "3 yrs" },
  { name: "CI/CD & DevOps", yrs: "2 yrs" },
  { name: "React Native", yrs: "1 yr" },
];

const About = () => (
  <section id="about" className="py-20 md:py-28 px-6 md:px-12 bg-surface">
    <div className="max-w-[1200px] mx-auto">
      <Reveal>
        <div className="s-eye">About</div>
        <h2 className="s-title">
          Mobile architect.
          <br />
          Clean code. <em>On time.</em>
        </h2>
      </Reveal>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mt-12 lg:mt-16 items-start">
        <Reveal variant="left" className="space-y-5 text-[17px] text-secondary leading-[1.85]">
          <p>
            Senior Flutter Developer with{" "}
            <strong className="text-primary font-medium highlight">5+ years</strong> building and shipping production-grade iOS, Android, and Web applications across fintech, healthtech, travel, workforce management, and consumer domains — for clients in the US, Middle East, and South Asia.
          </p>
          <p>
            My approach is <strong className="text-primary font-medium highlight">architecture-first</strong>: I own the full mobile lifecycle — from state management (BLoC/Riverpod) and REST/Firebase backends to CI/CD pipelines, automated testing, and App Store deployment. The result is apps that are fast, scalable, and maintainable.
          </p>
          <p>
            Every Upwork contract I&apos;ve completed is rated{" "}
            <strong className="text-primary font-medium highlight">5.0 stars</strong>. I treat deadlines as commitments, not suggestions — and I focus on high-impact enterprise products where performance and reliability matter.
          </p>
        </Reveal>

        <Reveal variant="right" staggerDelay={80}>
          <div className="flex flex-col gap-[3px]">
            {aboutSkills.map((skill) => (
              <div key={skill.name} className="sk stagger-item">
                <span className="sk-name">{skill.name}</span>
                <span className="sk-yrs">{skill.yrs}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

// --- Skills (live-only section, restyled) ---

const Skills = () => {
  const skillGroups = [
    {
      title: "Flutter & Mobile",
      skills: ["Flutter", "Dart", "Platform Channels", "BLoC", "Riverpod", "Provider", "GetX", "Clean Architecture", "MVVM", "MVC", "SOLID Principles"],
    },
    {
      title: "Backend & Data",
      skills: ["Firebase", "REST", "GraphQL", "WebSockets", "Socket.IO", "Supabase", "SQLite", "Hive"],
    },
    {
      title: "Payments & Quality",
      skills: ["PayPal SDK", "IAP", "APNs", "FCM", "WCAG", "TDD", "Unit/Integration Testing", "Performance Monitoring"],
    },
    {
      title: "DevOps & Tooling",
      skills: ["GitHub Actions", "Codemagic", "App Store Connect", "Play Console", "Docker", "Agile/Scrum"],
    },
  ];

  return (
    <section id="skills" className="py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div className="s-eye">Skills</div>
          <h2 className="s-title">
            Core <em>proficiency</em>
          </h2>
          <p className="s-sub">A comprehensive stack focused on scalability, performance, and clean engineering.</p>
        </Reveal>

        <Reveal staggerDelay={100}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 lg:mt-16">
            {skillGroups.map((group) => (
              <div key={group.title} className="skill-group-card stagger-item h-full">
                <h4 className="font-mono text-[11px] text-accent uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {group.title}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// --- Experience ---

const Experience = () => {
  const experiences = [
    {
      date: "Feb 2025 — Present\nFull-time",
      role: "Mobile Application Developer",
      company: "Dopasi Foundation · Islamabad",
      desc: "Built the foundation's mobile platform from the ground up across iOS and Android. Established the entire mobile engineering workflow from scratch, cutting release cycle time by 35%. Partnered with leadership to translate organizational goals into a product roadmap.",
    },
    {
      date: "Jul 2022 — Feb 2025\nFull-time",
      role: "Senior Flutter Developer",
      company: "Abacus Consulting · Islamabad",
      desc: "Led mobile development across multiple engagements, cutting time-to-market by 20%. Reduced production bug rates by 30% after introducing TDD, increased session retention by 18% with offline-first SQLite/Hive storage, and mentored junior developers through pair programming and code reviews.",
    },
    {
      date: "Oct 2023 — May 2024\nFreelance · Upwork",
      role: "Flutter Developer — Tjwal Net App",
      company: "Ummati Softwares",
      desc: "7-month contract delivering a full cross-platform travel eSIM app with real-time Firebase data, custom BLoC architecture, PayPal payments, and seamless iOS/Android deployment. Client rated 5.0 stars across all deliverables.",
    },
    {
      date: "Mar 2021 — Jul 2022\nFull-time",
      role: "Flutter Developer",
      company: "Ropstam Solutions Inc.",
      desc: "Designed and shipped four cross-platform apps from concept to production. Reduced post-release defect rates by 22% via structured unit testing and configured full-stack Firebase services supporting real-time data sync.",
    },
    {
      date: "Mar 2020 — Mar 2021\nFull-time",
      role: "Junior Flutter Developer",
      company: "NexConcept",
      desc: "Delivered pixel-accurate UI components resolving 40+ reported defects. Hit on-time delivery on 90% of commitments over 12 consecutive months and shipped first production app to both App Store and Google Play.",
    },
  ];

  return (
    <section id="experience" className="py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div className="s-eye">Experience</div>
          <h2 className="s-title">
            Career <em>progress</em>
          </h2>
          <p className="s-sub">From junior to senior — a track record of growth, shipped products, and real responsibility.</p>
        </Reveal>

        <Reveal className="timeline mt-12 lg:mt-16" staggerDelay={120}>
          {experiences.map((exp, i) => (
            <div key={i} className="tl-item stagger-item">
              <div className="tl-date whitespace-pre-line">{exp.date}</div>
              <div className="tl-dot-col">
                <div className="tl-dot" />
              </div>
              <div className="tl-content">
                <div className="tl-role">{exp.role}</div>
                <div className="tl-co">{exp.company}</div>
                <div className="tl-desc">{exp.desc}</div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
};

// --- Projects ---

interface ProjectLink {
  type: "apple" | "play" | "web";
  url: string;
  label?: string;
}

interface Project {
  num: string;
  title: string;
  outcome: string;
  desc: string;
  tags: string[];
  image?: string;
  accent?: "sky" | "mint" | "slate" | "ember" | "charcoal" | "rose" | "gold";
  links?: ProjectLink[];
  webUrl?: string;
  webBadge?: string;
  featuredLabel?: string;
  statusBadge?: string;
  imagePosition?: string;
  imageFit?: "cover" | "contain";
}

const FEATURED_WEB_PROJECTS: Project[] = [
  {
    num: "01",
    title: "EPADS",
    outcome: "e-Pak Acquisition & Disposal System · PPRA, Government of Pakistan · World Bank-funded",
    desc: "A career milestone — I worked on EPADS as a mobile developer on the companion Flutter app (pre-release, not yet live) and contributed to the live web platform at eprocure.gov.pk. National-scale system digitising Pakistan's entire public procurement lifecycle — planning, tendering, contract management, and disposal — for thousands of government institutions.",
    tags: ["Flutter", "REST APIs", "Firebase", "Clean Architecture", "Government Compliance"],
    image: "/projects/epads-screenshot.png",
    imageFit: "contain",
    imagePosition: "center center",
    links: [{ type: "web", url: "https://eprocure.gov.pk", label: "Visit eprocure.gov.pk" }],
    webUrl: "eprocure.gov.pk",
    webBadge: "Live Platform",
    featuredLabel: "Government · Web & Mobile",
    statusBadge: "Flutter mobile · Pre-release",
  },
  {
    num: "02",
    title: "MovingCRM",
    outcome: "Flutter Web · AI-powered CRM platform",
    desc: "Full-scale CRM for moving companies — lead pipelines, dispatch, payroll, contracts, and customer portals. I built the Flutter Web application, core dashboards, and product UX during early-stage development of this SaaS platform.",
    tags: ["Flutter Web", "CRM", "SaaS", "REST APIs", "Dashboards"],
    image: "/projects/movingcrm-thumbnail.png",
    imageFit: "cover",
    imagePosition: "top center",
    links: [{ type: "web", url: "https://www.movingcrm.ai/", label: "Visit movingcrm.ai" }],
    webUrl: "movingcrm.ai",
    webBadge: "Flutter Web",
    featuredLabel: "Web Platform",
  },
];

const MOBILE_PROJECTS: Project[] = [
  {
    num: "03",
    title: "Tjwalnet — Travel eSIM",
    outcome: "7-month contract · 70+ countries",
    desc: "Region-aware eSIM with in-app wallet, PayPal payments, and real-time Firebase backend. Full BLoC architecture and dual-store deployment.",
    tags: ["Flutter", "Firebase", "PayPal", "BLoC"],
    image: "/projects/tjwalnet-icon.png",
    accent: "sky",
    links: [
      { type: "apple", url: "https://apps.apple.com/pk/app/tjwalnet/id1597279710", label: "App Store" },
      { type: "play", url: "https://play.google.com/store/apps/details?id=com.tjwalnet.app", label: "Google Play" },
    ],
  },
  {
    num: "04",
    title: "Quotes & Motivation",
    outcome: "Lifestyle · 4.7★ · 10K+ downloads",
    desc: "Daily quotes and motivation — curated collections, shareable inspiration, downloadable favorites, and reminder-driven retention with in-app ads.",
    tags: ["Flutter", "Lifestyle", "Ads", "Notifications"],
    image: "/projects/quotes-motivation-icon.png",
    accent: "rose",
    links: [
      { type: "play", url: "https://play.google.com/store/apps/details?id=com.jokerdiary.joker_diary", label: "Google Play" },
    ],
  },
  {
    num: "05",
    title: "GuardTrack Staff",
    outcome: "Security · 1K+ downloads",
    desc: "Staff app for GuardTrack — book on/off duty, check calls, and field workflows for security teams with real-time GPS and geofencing.",
    tags: ["GPS", "Security", "Real-time"],
    image: "/projects/guardtrack-staff-icon.png",
    accent: "slate",
    links: [
      { type: "apple", url: "https://apps.apple.com/pk/app/guardtrack-staff/id1541680131", label: "App Store" },
      { type: "play", url: "https://play.google.com/store/apps/details?id=uk.co.guardtrack.gtstaff", label: "Google Play" },
    ],
  },
  {
    num: "06",
    title: "My MYO — Therapy",
    outcome: "Health & Wellness · Production",
    desc: "Clinical therapy platform with video exercise player and smart appointment scheduling on iOS and Android.",
    tags: ["Flutter", "Video", "Health"],
    image: "/projects/my-myo-icon.png",
    accent: "mint",
    links: [
      { type: "apple", url: "https://apps.apple.com/pk/app/my-myo/id1627314322", label: "App Store" },
      { type: "play", url: "https://play.google.com/store/apps/details?id=com.therapy.app", label: "Google Play" },
    ],
  },
  {
    num: "07",
    title: "Surrey Security Staff",
    outcome: "Enterprise workforce",
    desc: "Enterprise staff coordination for large-scale security ops with live compliance and field data sync.",
    tags: ["Workforce", "Operations", "Flutter"],
    image: "/projects/surrey-security-icon.png",
    accent: "ember",
    links: [
      { type: "apple", url: "https://apps.apple.com/pk/app/surrey-security-staff/id1317515997", label: "App Store" },
      { type: "play", url: "https://play.google.com/store/apps/details?id=com.thesurreysecurity.surreysecuritystaff", label: "Google Play" },
    ],
  },
  {
    num: "08",
    title: "09 Building Co",
    outcome: "Business · Field ops",
    desc: "Operations app for construction teams — job assignment, project tracking, employee workflows, PDF handoffs, and completion photos.",
    tags: ["Construction", "Business", "Flutter"],
    image: "/projects/09-building-co-icon.png",
    accent: "charcoal",
    links: [
      { type: "apple", url: "https://apps.apple.com/pk/app/09buildingco/id1660547287", label: "App Store" },
      { type: "play", url: "https://play.google.com/store/apps/details?id=com.buildingco.app", label: "Google Play" },
    ],
  },
  {
    num: "09",
    title: "Simple Weather App",
    outcome: "Upwork MVP · Delivered in 1 day · 5.0★",
    desc: "Basic weather MVP for an Upwork client — live REST data, smooth animations, and a clean native-feeling UI shipped in under 24 hours.",
    tags: ["Flutter", "REST API", "MVP"],
    image: "/projects/simple-weather-app-icon.png",
    accent: "gold",
  },
];

const ProjectImage = ({ src, alt, className = "", style }: { src?: string; alt: string; className?: string; style?: React.CSSProperties }) => {
  const [error, setError] = useState(false);
  if (!src || error) return null;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setError(true)}
    />
  );
};

const ProjectShowcaseVisual = ({ project }: { project: Project }) => (
  <div className={`proj-showcase-visual proj-showcase-visual--${project.accent ?? "sky"}`}>
    <div className="proj-showcase-mesh" aria-hidden="true" />
    <div className="proj-showcase-grid" aria-hidden="true" />
    <span className="proj-showcase-num">{project.num}</span>
    <div className="proj-showcase-icon-ring">
      <ProjectImage src={project.image} alt={project.title} className="proj-showcase-icon" />
    </div>
  </div>
);

const LinkIcon = ({ type }: { type: ProjectLink["type"] }) => {
  if (type === "apple") return <Apple size={14} />;
  if (type === "web") return <Monitor size={14} />;
  return <Smartphone size={14} />;
};

const ProjectLinks = ({ links }: { links?: ProjectLink[] }) => {
  if (!links?.length) {
    return (
      <div className="proj-store-links">
        <span className="proj-store-btn proj-store-btn--upwork">
          <Star size={14} />
          Upwork · 5.0★
        </span>
      </div>
    );
  }
  return (
    <div className="proj-store-links">
      {links.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`proj-store-btn ${link.type === "web" ? "proj-store-btn--web" : ""}`}
        >
          <LinkIcon type={link.type} />
          {link.label ?? "View"}
        </a>
      ))}
    </div>
  );
};

const useCarouselScroller = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  const getScrollStep = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return 360;
    const item = el.querySelector<HTMLElement>(".proj-scroller-item");
    if (!item) return 360;
    const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || "20");
    return item.offsetWidth + gap;
  }, []);

  const scrollBy = useCallback((dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * getScrollStep(), behavior: "smooth" });
  }, [getScrollStep]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollerRef.current) return;
    isDragging.current = true;
    scrollerRef.current.classList.add("grabbing");
    startX.current = e.pageX;
    scrollLeftPos.current = scrollerRef.current.scrollLeft;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    scrollerRef.current?.classList.remove("grabbing");
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !scrollerRef.current) return;
    e.preventDefault();
    scrollerRef.current.scrollLeft = scrollLeftPos.current - (e.pageX - startX.current) * 1.2;
  }, []);

  return { scrollerRef, scrollBy, handleMouseDown, handleMouseUp, handleMouseMove };
};

const WebProjectCard = ({ project }: { project: Project }) => (
  <article className="proj-web-card">
    <div className="proj-web-visual">
      <span className="proj-showcase-num">{project.num}</span>
      <div className="proj-web-frame">
        <div className="proj-browser-chrome">
          <span className="proj-browser-dot" />
          <span className="proj-browser-dot" />
          <span className="proj-browser-dot" />
          <span className="proj-browser-url">{project.webUrl ?? "web"}</span>
          <span className="proj-browser-badge">{project.webBadge ?? "Web"}</span>
        </div>
        <div className={`proj-web-screen ${project.imageFit === "cover" ? "proj-web-screen--cover" : ""}`}>
          <ProjectImage
            src={project.image}
            alt={project.title}
            className={project.imageFit === "contain" ? "proj-web-shot--contain" : "proj-web-shot--cover"}
            style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
          />
        </div>
      </div>
    </div>
    <div className="proj-web-body">
      <span className="proj-web-label">{project.featuredLabel ?? "Web Platform"}</span>
      <h3 className="proj-card-title">{project.title}</h3>
      <p className="proj-card-outcome proj-card-outcome--coral">{project.outcome}</p>
      <p className="proj-card-desc">{project.desc}</p>
      <div className="proj-card-tags">
        {project.tags.map((tag) => (
          <span key={tag} className="ptag ptag--featured">
            {tag}
          </span>
        ))}
      </div>
      <div className="proj-card-footer">
        <div className="proj-featured-links">
          <ProjectLinks links={project.links} />
          {project.statusBadge && (
            <span className="proj-store-badge">{project.statusBadge}</span>
          )}
        </div>
      </div>
    </div>
  </article>
);

const MobileProjectCard = ({ project }: { project: Project }) => (
  <article className={`proj-card proj-card--${project.accent ?? "sky"}`}>
    <ProjectShowcaseVisual project={project} />
    <div className="proj-card-body">
      <h3 className="proj-card-title">{project.title}</h3>
      <p className="proj-card-outcome">{project.outcome}</p>
      <p className="proj-card-desc">{project.desc}</p>
      <div className="proj-card-tags">
        {project.tags.map((tag) => (
          <span key={tag} className="ptag">
            {tag}
          </span>
        ))}
      </div>
      <div className="proj-card-footer">
        <ProjectLinks links={project.links} />
      </div>
    </div>
  </article>
);

const Projects = () => {
  const webCarousel = useCarouselScroller();
  const mobileCarousel = useCarouselScroller();

  return (
    <section id="projects" className="projects-showcase">
      <div className="projects-showcase-bg" aria-hidden="true" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
        <Reveal>
          <div className="projects-showcase-header">
            <div>
              <div className="s-eye">Featured work</div>
              <h2 className="s-title mb-4">
                Shipped <em>projects</em>
              </h2>
              <p className="s-sub max-w-lg">
                National government platforms, Flutter Web SaaS, and production mobile apps — shipped for enterprise, startup, and public-sector clients.
              </p>
            </div>
            <div className="projects-stats">
              <div className="projects-stat">
                <span className="projects-stat-n">9+</span>
                <span className="projects-stat-l">Shipped</span>
              </div>
              <div className="projects-stat">
                <span className="projects-stat-n">70+</span>
                <span className="projects-stat-l">Countries</span>
              </div>
              <div className="projects-stat">
                <span className="projects-stat-n">5.0★</span>
                <span className="projects-stat-l">Rating</span>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="projects-mobile-header">
          <div className="projects-mobile-divider">
            <span className="font-mono text-[10px] text-muted tracking-[0.2em] uppercase">
              Web platforms · {FEATURED_WEB_PROJECTS.length} shipped
            </span>
          </div>
          <div className="projects-scroll-controls">
            <button type="button" className="projects-scroll-btn" onClick={() => webCarousel.scrollBy(-1)} aria-label="Scroll web projects left">
              <ChevronLeft size={18} />
            </button>
            <button type="button" className="projects-scroll-btn" onClick={() => webCarousel.scrollBy(1)} aria-label="Scroll web projects right">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="projects-carousel-wrap projects-carousel-wrap--web">
        <div className="projects-carousel-fade projects-carousel-fade--left" aria-hidden="true" />
        <div
          ref={webCarousel.scrollerRef}
          className="proj-scroller proj-scroller--web"
          onMouseDown={webCarousel.handleMouseDown}
          onMouseUp={webCarousel.handleMouseUp}
          onMouseLeave={webCarousel.handleMouseUp}
          onMouseMove={webCarousel.handleMouseMove}
        >
          {FEATURED_WEB_PROJECTS.map((project) => (
            <div key={project.num} className="proj-scroller-item proj-scroller-item--web">
              <WebProjectCard project={project} />
            </div>
          ))}
        </div>
        <div className="projects-carousel-fade projects-carousel-fade--right" aria-hidden="true" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
        <div className="projects-mobile-header projects-mobile-header--spaced">
          <div className="projects-mobile-divider">
            <span className="font-mono text-[10px] text-muted tracking-[0.2em] uppercase">
              Mobile apps · {MOBILE_PROJECTS.length} shipped
            </span>
          </div>
          <div className="projects-scroll-controls">
            <button type="button" className="projects-scroll-btn" onClick={() => mobileCarousel.scrollBy(-1)} aria-label="Scroll mobile projects left">
              <ChevronLeft size={18} />
            </button>
            <button type="button" className="projects-scroll-btn" onClick={() => mobileCarousel.scrollBy(1)} aria-label="Scroll mobile projects right">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="projects-carousel-wrap">
        <div className="projects-carousel-fade projects-carousel-fade--left" aria-hidden="true" />
        <div
          ref={mobileCarousel.scrollerRef}
          className="proj-scroller"
          onMouseDown={mobileCarousel.handleMouseDown}
          onMouseUp={mobileCarousel.handleMouseUp}
          onMouseLeave={mobileCarousel.handleMouseUp}
          onMouseMove={mobileCarousel.handleMouseMove}
        >
          {MOBILE_PROJECTS.map((project) => (
            <div key={project.num} className="proj-scroller-item">
              <MobileProjectCard project={project} />
            </div>
          ))}
        </div>
        <div className="projects-carousel-fade projects-carousel-fade--right" aria-hidden="true" />
      </div>

      <div className="projects-carousel-hint">
        <span className="projects-carousel-hint-line" aria-hidden="true" />
        <span>Drag or scroll to explore the full portfolio</span>
        <span className="drag-arrow">→</span>
      </div>
    </section>
  );
};

// --- Testimonials ---

const Testimonials = () => {
  const testimonials = [
    {
      name: "Jaquan Wells",
      project: "Simple Weather App · Sep 2025",
      quote: "Hassan is a Flutter expert. I highly recommend him.",
      initials: "JW",
    },
    {
      name: "Alihaider Alihaider",
      project: "Small Flutter App · Sep 2023",
      quote:
        "It was a pleasure to work with Hassan on this project. Completed efficiently and within the expected timeframe. He was responsive and available to provide clarification and answers. Highly recommended!",
      initials: "AA",
    },
    {
      name: "Yogesh Gajera",
      project: "Android App Development · Aug 2023",
      quote: "Hassan Zafar is an amazing person. Done the job successfully before time.",
      initials: "YG",
    },
    {
      name: "Ummati Softwares",
      project: "Flutter Developer, Tjwal Net · Oct 2023–May 2024",
      quote:
        "Long-term collaboration building the Tjwal Net app — consistent quality, clean code, and excellent communication throughout a 7-month engagement.",
      initials: "US",
    },
  ];

  return (
    <section id="testimonials" className="py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div className="s-eye">Reviews</div>
          <h2 className="s-title">
            What <em>clients</em> say
          </h2>
          <p className="s-sub">4 completed contracts · 5.0 average rating</p>
        </Reveal>

        <Reveal className="rev-grid" staggerDelay={100}>
          {testimonials.map((item, index) => (
            <div key={`${item.name}-${index}`} className="rev-card stagger-item h-full flex flex-col">
              <div className="rev-stars">★★★★★</div>
              <blockquote className="rev-quote flex-grow">&ldquo;{item.quote}&rdquo;</blockquote>
              <div className="h-px bg-[var(--border)] mb-6" />
              <div className="flex items-center gap-4">
                <div className="rev-av">{item.initials}</div>
                <div>
                  <div className="text-[15px] font-medium text-primary">{item.name}</div>
                  <div className="font-mono text-[11px] text-muted mt-0.5 tracking-wide">{item.project}</div>
                </div>
              </div>
            </div>
          ))}
        </Reveal>

        <p className="text-center font-mono text-[11px] text-muted tracking-[0.14em] uppercase mt-10">
          All reviews verified on Upwork
        </p>
      </div>
    </section>
  );
};

// --- Contact ---

const Contact = () => {
  const contactItems = [
    {
      icon: <Mail size={16} aria-hidden="true" />,
      label: "Email",
      value: "dev.hassanzafar@gmail.com",
      href: "mailto:dev.hassanzafar@gmail.com",
      external: false,
    },
    {
      icon: <MessageCircle size={16} aria-hidden="true" />,
      label: "WhatsApp",
      value: "+92 332 6928633",
      href: "https://wa.me/923326928633",
      external: true,
    },
    {
      icon: <Linkedin size={16} aria-hidden="true" />,
      label: "LinkedIn",
      value: "Hassan Zafar",
      href: "https://www.linkedin.com/in/hassanzafar15",
      external: true,
    },
    {
      icon: <Github size={16} aria-hidden="true" />,
      label: "GitHub",
      value: "HassanZafar15",
      href: "https://github.com/HassanZafar15",
      external: true,
    },
    {
      icon: <MapPin size={16} aria-hidden="true" />,
      label: "Location",
      value: "Islamabad, Pakistan",
      href: "https://maps.google.com/?q=Islamabad,Pakistan",
      external: true,
    },
    {
      icon: <Star size={16} aria-hidden="true" />,
      label: "Upwork · 5.0★",
      value: "View verified profile",
      href: "https://www.upwork.com/freelancers/hassanzafar",
      external: true,
    },
  ];

  return (
    <section id="contact" className="py-20 md:py-28 px-6 md:px-12 bg-surface overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Reveal variant="left">
            <div className="contact-hero-text">
              Let&apos;s
              <br />
              <em>build</em>
              <span className="outline">together.</span>
            </div>
            <div className="flex items-center gap-2.5 mt-8 font-mono text-[11px] text-secondary tracking-wide">
              <div className="avail-dot" />
              Available now · Replies within 24 hours
            </div>
          </Reveal>

          <Reveal variant="right">
            <div className="flex flex-col gap-[3px]">
              {contactItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="contact-item"
                  aria-label={`${item.label}: ${item.value}`}
                >
                  <div className="ci-icon">{item.icon}</div>
                  <div>
                    <div className="ci-label">{item.label}</div>
                    <div className="ci-val">{item.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

// --- Footer ---

const Footer = () => (
  <footer className="py-7 px-6 md:px-12 border-t border-[var(--border)]">
    <div className="max-w-[1200px] mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="font-display text-[15px] font-bold text-muted">Hassan Zafar</div>
      <div className="font-mono text-[10px] text-muted tracking-widest text-center">
        © {new Date().getFullYear()} · Senior Flutter Developer · Islamabad, PK
      </div>
      <div className="flex gap-7">
        <a className="foot-link" href="https://www.linkedin.com/in/hassanzafar15" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a className="foot-link" href="https://github.com/HassanZafar15" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a className="foot-link" href="https://www.upwork.com/freelancers/hassanzafar" target="_blank" rel="noopener noreferrer">
          Upwork
        </a>
      </div>
    </div>
  </footer>
);

// --- App root ---

export default function App() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [showPreloader, setShowPreloader] = useState(true);
  const [siteReady, setSiteReady] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setShowPreloader(false);
      setSiteReady(true);
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    document.body.style.overflow = showPreloader ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showPreloader]);

  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
    setSiteReady(true);
  }, []);

  return (
    <>
      {showPreloader && (
        <Preloader onComplete={handlePreloaderComplete} reducedMotion={prefersReducedMotion} />
      )}
      <div
        className={`relative min-h-screen bg-[var(--bg)] text-[var(--text)] ${siteReady ? "site-visible" : "site-hidden"}`}
      >
        <ScrollProgress />
        <CustomCursor disabled={prefersReducedMotion} />
        <NoiseOverlay />
        <Navigation />
        <main className="relative z-10">
          <Hero ready={siteReady} reducedMotion={prefersReducedMotion} />
          <Marquee />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </>
  );
}
