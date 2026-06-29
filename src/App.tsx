/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Download, 
  Code2, 
  Smartphone,
  ChevronRight,
  TrendingUp,
  Globe,
  Award,
  Menu,
  X,
  Apple,
  MessageCircle,
  ChevronDown,
  Star,
  ArrowUp,
  Monitor
} from "lucide-react";
import React, { useEffect, useState, useRef, ReactNode } from "react";

// --- Components ---

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />;
};

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") || 
        target.closest("a") ||
        target.closest(".tilt-card-trigger")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return <div ref={cursorRef} className={`custom-cursor hidden md:block ${isHovered ? "expanded" : ""}`} style={{ transform: "translate(-50%, -50%)" }} />;
};

const FiveStars = () => (
  <div className="flex gap-0.5" aria-label="5 out of 5 stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
    ))}
  </div>
);

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const StarRating = ({ rating, count }: { rating: number; count?: string }) => (
  <div className="flex items-center gap-2">
    <div className="star-rating">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-slate-600"}
        />
      ))}
    </div>
    <span className="text-sm font-semibold text-primary">{rating}</span>
    {count && <span className="text-xs text-secondary">({count})</span>}
  </div>
);

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
  key?: string | number;
}

const Reveal = ({ children, className = "", staggerDelay = 100 }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          // Apply staggered delays to children with .stagger-item
          const items = entry.target.querySelectorAll(".stagger-item");
          items.forEach((item, index) => {
            (item as HTMLElement).style.animationDelay = `${index * staggerDelay}ms`;
          });
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [staggerDelay]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
};

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSegment, setActiveSegment] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSegment(entry.target.id);
        }
      });
    }, { threshold: 0.35 });

    const sections = ["hero", "about", "skills", "experience", "projects", "testimonials", "contact"];
    sections.forEach(section => {
      const el = document.getElementById(section);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const navItems = ["About", "Skills", "Experience", "Projects", "Testimonials", "Contact"];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[90] nav-bg glass border-b border-white/10 ${isScrolled ? "scrolled" : ""}`}>
      <div className={`max-w-7xl mx-auto px-6 flex justify-between items-center transition-all duration-300 ${isScrolled ? "h-16" : "h-20"}`}>
        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-accent flex items-center justify-center rounded-xl shadow-lg shadow-accent/25 group-hover:shadow-accent/40 transition-shadow">
            <span className="text-navy font-display font-bold text-xl">H</span>
          </div>
          <span className="font-display font-bold text-gradient tracking-tight text-lg md:text-xl">Hassan Zafar</span>
        </a>
        
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                activeSegment === item.toLowerCase()
                  ? "text-accent bg-accent/10"
                  : "text-secondary hover:text-primary hover:bg-white/5"
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/Hassan_Zafar_Senior_Flutter_Developer%20.docx"
            download="Hassan_Zafar_Senior_Flutter_Developer.docx"
            className="hidden md:inline-flex btn-primary text-sm"
          >
            <Download size={16} />
            Resume
          </a>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-primary hover:bg-white/5 transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden glass-strong border-b border-white/10 px-6 py-6 space-y-1"
        >
          {navItems.map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                activeSegment === item.toLowerCase()
                  ? "text-accent bg-accent/10"
                  : "text-primary hover:text-accent hover:bg-white/5"
              }`}
            >
              {item}
            </a>
          ))}
          <a
            href="/Hassan_Zafar_Senior_Flutter_Developer%20.docx"
            download="Hassan_Zafar_Senior_Flutter_Developer.docx"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-center gap-2 mt-4 btn-primary w-full"
          >
            <Download size={16} />
            Download Resume
          </a>
        </motion.div>
      )}
    </nav>
  );
};

const ParticleBackground = () => {
  const particles = Array.from({ length: 20 });
  return (
    <div className="particle-container">
      {particles.map((_, i) => {
        const size = Math.random() * 3 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 10;
        return (
          <div 
            key={i} 
            className="dot" 
            style={{ 
              width: `${size}px`, 
              height: `${size}px`, 
              left: `${left}%`, 
              bottom: "-20px",
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`
            }} 
          />
        );
      })}
    </div>
  );
};

const ScrollIndicator = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 cursor-pointer hidden md:block"
      onClick={() => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Scroll</span>
        <ChevronDown className="text-accent animate-bounce-subtle" size={24} />
      </div>
    </motion.div>
  );
};

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050510] px-4 sm:px-6 pt-24 pb-16">
      <ParticleBackground />
      <ScrollIndicator />

      <div className="orb w-[700px] h-[700px] bg-blue-600/25 -top-1/4 -left-1/4 opacity-[0.06]" style={{ animation: "float 25s infinite ease-in-out" }} />
      <div className="orb w-[600px] h-[600px] bg-purple-600/25 -bottom-1/4 -right-1/4 opacity-[0.07]" style={{ animation: "float 30s infinite ease-in-out reverse 5s" }} />
      <div className="orb w-[500px] h-[500px] bg-cyan-600/20 top-1/3 right-1/4 opacity-[0.05]" style={{ animation: "float 22s infinite ease-in-out 2s" }} />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="hero-card p-6 sm:p-10 lg:p-14"
        >
          <div className="hero-blob w-64 h-64 bg-emerald-500/20 -bottom-20 -left-20" />
          <div className="hero-blob w-48 h-48 bg-amber-500/15 top-10 right-1/4" />
          <div className="hero-blob w-56 h-56 bg-blue-500/20 -top-10 right-0" />

          <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                  <div className="relative flex h-2 w-2">
                    <div className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <div className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </div>
                  <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Available for Remote</span>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-3 leading-[1.1] text-white">
                Hassan Zafar
              </h1>

              <p className="text-lg md:text-xl text-accent font-medium mb-4">
                Senior Mobile Architect & Flutter Expert
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                <StarRating rating={5} count="5+ yrs experience" />
              </div>

              <p className="text-base md:text-lg text-secondary mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Crafting high-performance digital experiences for the next generation — from architecture design and state management to CI/CD pipelines and deployment.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
                {[
                  { icon: <TrendingUp size={14} />, label: "5+ Years" },
                  { icon: <Smartphone size={14} />, label: "10+ Apps" },
                  { icon: <Globe size={14} />, label: "70+ Countries" },
                ].map((chip, i) => (
                  <span key={i} className="credential-chip">
                    <span className="text-accent">{chip.icon}</span>
                    {chip.label}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                {[
                  { icon: <Linkedin size={18} />, label: "LinkedIn", href: "https://linkedin.com/in/hassanzafar15" },
                  { icon: <Github size={18} />, label: "GitHub", href: "https://github.com/HassanZafar15" },
                  { icon: <MessageCircle size={18} />, label: "WhatsApp", href: "https://wa.me/923326928633" },
                ].map((btn, i) => (
                  <a
                    key={i}
                    href={btn.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-4 py-2.5 rounded-full glass text-sm font-medium text-secondary hover:text-accent hover:border-accent/30 transition-all hover:-translate-y-0.5"
                    aria-label={btn.label}
                  >
                    <span className="text-accent group-hover:scale-110 transition-transform">{btn.icon}</span>
                    <span className="hidden sm:inline">{btn.label}</span>
                  </a>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <a
                  href="/Hassan_Zafar_Senior_Flutter_Developer%20.docx"
                  download="Hassan_Zafar_Senior_Flutter_Developer.docx"
                  className="btn-primary px-7 py-3.5 text-base group"
                >
                  <Download size={18} className="group-hover:bounce" />
                  Download CV
                </a>
                <a href="mailto:dev.hassanzafar@gmail.com" className="btn-outline px-7 py-3.5 text-base">
                  <Mail size={18} />
                  Email Me
                </a>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center items-center order-1 lg:order-2"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 via-purple-500/10 to-transparent rounded-[2rem] blur-2xl" />
                <div className="profile-frame w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72">
                  <img
                    src="https://lh3.googleusercontent.com/d/1v1UWFlG713TnVv-J5owqUUft6XCOT66z"
                    alt="Hassan Zafar — Senior Flutter Developer"
                    referrerPolicy="no-referrer"
                    loading="eager"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://picsum.photos/seed/hassan/800/800";
                      e.currentTarget.onerror = null;
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const SectionHeading = ({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) => {
  return (
    <Reveal className="mb-16 text-center md:text-left">
      <span className="badge-pill badge-featured mb-5">{eyebrow}</span>
      <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-5 text-primary leading-tight">{title}</h3>
      {desc && <p className="text-secondary max-w-2xl text-base md:text-lg leading-relaxed mx-auto md:mx-0">{desc}</p>}
      <div className="section-divider mt-8 hidden md:block" />
    </Reveal>
  );
};

const Counter = ({ target, duration = 2000 }: { target: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        let start = 0;
        const end = target;
        if (start === end) return;

        let totalMiliseconds = duration;
        let incrementTime = (totalMiliseconds / end) > 10 ? (totalMiliseconds / end) : 10;
        let timer = setInterval(() => {
          start += Math.ceil(end / (duration / (incrementTime * 1.5)));
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(start);
          }
        }, incrementTime);
      }
    }, { threshold: 0.1 });

    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return <span ref={countRef}>{count.toLocaleString()}</span>;
};

const About = () => {
  const stats = [
    { value: 5, label: "Years Experience", suffix: "+", icon: <TrendingUp className="text-blue-400" /> },
    { value: 10, label: "Apps Shipped", suffix: "+", icon: <Smartphone className="text-purple-400" /> },
    { value: 70, label: "Countries Served", suffix: "+", icon: <Globe className="text-emerald-400" /> },
    { value: 10000, label: "Active Users", suffix: "+", icon: <Award className="text-amber-400" /> },
  ];

  return (
    <section id="about" className="py-28 sm:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-24">
          <Reveal>
            <SectionHeading eyebrow="Discovery" title="Professional Journey" />
            <div className="space-y-6 text-secondary text-lg leading-relaxed">
              <p>
                Senior Flutter Developer with 5+ years of experience building and shipping production-grade iOS, Android, and Web applications across fintech, healthtech, travel, workforce management, and consumer domains.
              </p>
              <p>
                Proven track record of owning the full mobile development lifecycle — from architecture design and state management (BLoC/Riverpod) to CI/CD pipelines, automated testing, and deployment.
              </p>
            </div>
          </Reveal>
          
          <div className="relative group">
             <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full group-hover:bg-accent/30 transition-colors" />
             <div className="relative glass p-12 rounded-[64px] border-accent/20">
                <Code2 size={60} className="text-accent mb-8" />
                <h4 className="text-3xl font-display font-bold text-white mb-6">Mobile Architect</h4>
                <p className="text-secondary text-lg">Focusing on high-impact enterprise products and performance optimization.</p>
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Reveal key={i} className="stagger-item">
              <div className="glass p-8 rounded-[32px] border-white/5 flex flex-col items-center text-center group hover:scale-[1.05] transition-transform hover:border-accent/40 shadow-lg shadow-black/20 overflow-hidden">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-navy transition-all duration-300">
                  {stat.icon}
                </div>
                <h4 className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">
                  <Counter target={stat.value} />{stat.suffix}
                </h4>
                <p className="text-secondary font-medium tracking-wide uppercase text-[10px]">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Skills = () => {
  const skillGroups = [
    {
      title: "Flutter & Mobile",
      skills: ["Flutter", "Dart", "Platform Channels", "BLoC", "Riverpod", "Provider", "GetX", "Clean Architecture", "MVVM", "MVC", "SOLID Principles"],
      color: "border-blue-500/30",
      accent: "text-blue-400"
    },
    {
      title: "Backend & Data",
      skills: ["Firebase", "REST", "GraphQL", "WebSockets", "Socket.IO", "Supabase", "SQLite", "Hive"],
      color: "border-purple-500/30",
      accent: "text-purple-400"
    },
    {
      title: "Payments & Quality",
      skills: ["PayPal SDK", "IAP", "APNs", "FCM", "WCAG", "TDD", "Unit/Integration Testing", "Performance Monitoring"],
      color: "border-emerald-500/30",
      accent: "text-emerald-400"
    },
    {
      title: "DevOps & Tooling",
      skills: ["GitHub Actions", "Codemagic", "App Store Connect", "Play Console", "Docker", "Agile/Scrum"],
      color: "border-amber-500/30",
      accent: "text-amber-400"
    }
  ];

  return (
    <section id="skills" className="py-28 sm:py-32 px-4 sm:px-6 bg-grid relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-transparent to-[#050510] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading eyebrow="Expertise" title="Core Proficiency" desc="A comprehensive stack focused on scalability, performance, and clean engineering." />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillGroups.map((group, i) => (
            <Reveal key={i} className="stagger-item h-full">
              <div className={`glass p-8 rounded-[40px] h-full border ${group.color} hover:shadow-[0_0_30px_rgba(56,189,248,0.05)] transition-all group`}>
                <h4 className={`font-display font-bold ${group.accent} mb-8 flex items-center gap-3 drop-shadow-[0_0_10px_currentColor]`}>
                   <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                   {group.title}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map(skill => (
                    <motion.span 
                      key={skill} 
                      whileHover={{ scale: 1.1, y: -2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="px-3 py-1.5 glass bg-white/5 border-white/5 rounded-xl text-xs font-medium text-slate-300 hover:text-accent hover:border-accent/40 hover:shadow-[0_0_10px_rgba(56,189,248,0.2)] transition-all cursor-default inline-block"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Experience = () => {
  const experiences = [
    {
      company: "Dopasi Foundation",
      role: "Mobile Application Developer",
      period: "Feb 2025 – Present",
      location: "Islamabad, Pakistan",
      active: true,
      bullets: [
        "Built the foundation's mobile platform from the ground up, across iOS and Android.",
        "Established the entire mobile engineering workflow from scratch, cutting release cycle time by 35%.",
        "Partnered with leadership to translate organizational goals into a product roadmap.",
        "Maintained stable release by implementing structured device-matrix testing."
      ]
    },
    {
      company: "Abacus Consulting",
      role: "Senior Flutter Developer",
      period: "Jul 2022 – Feb 2025",
      location: "Islamabad",
      bullets: [
        "Led mobile development across multiple engagements, cutting time-to-market by 20%.",
        "Improved client satisfaction by 25% through performance optimization and responsive UIs.",
        "Reduced production bug rates by 30% introducing TDD across all layers.",
        "Increased session retention by 18% building offline-first storage with SQLite/Hive.",
        "Mentored junior developers through pair programming and code reviews."
      ]
    },
    {
      company: "Ropstam Solutions Inc.",
      role: "Flutter Developer",
      period: "Mar 2021 – Jul 2022",
      bullets: [
        "Designed and shipped four cross-platform apps from concept to production.",
        "Reduced post-release defect rates by 22% via structured unit testing.",
        "Shortened client sign-off cycles by 30% by leading plain-language tech briefings.",
        "Configured full-stack Firebase services supporting real-time data sync."
      ]
    },
    {
      company: "NexConcept",
      role: "Junior Flutter Developer",
      period: "Mar 2020 – Mar 2021",
      bullets: [
        "Delivered pixel-accurate UI components resolving over 40 reported defects.",
        "Hit on-time delivery on 90% of commitments over 12 consecutive months.",
        "Saved 3-4 hours of QA escalation time per sprint via early profiling."
      ]
    }
  ];

  return (
    <section id="experience" className="py-28 sm:py-32 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeading eyebrow="Timeline" title="Career Progress" />

        <div className="relative space-y-12 before:absolute before:left-8 md:before:left-1/2 before:top-4 before:bottom-4 before:w-px before:bg-gradient-to-b before:from-accent before:to-transparent">
          {experiences.map((exp, i) => (
            <Reveal key={i} className="stagger-item">
              <div className={`relative flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                <div className={`absolute left-8 md:left-1/2 top-8 w-4 h-4 -ml-2 rounded-full z-10 border-4 border-navy ${exp.active ? "bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-pulse" : "bg-accent"}`} />
                
                <div className={`w-full md:w-1/2 ${i % 2 === 0 ? "md:pl-16" : "md:pr-16 md:text-right"}`}>
                  <div className="glass p-10 rounded-[40px] border-white/5 hover:border-accent/40 transition-all group">
                    <span className="text-accent font-bold text-xs uppercase tracking-widest mb-4 block italic">{exp.period}</span>
                    <h4 className="text-2xl font-display font-bold text-primary mb-2 group-hover:text-accent transition-colors">{exp.role}</h4>
                    <p className="text-white/60 font-semibold text-sm mb-6">{exp.company}</p>
                    <ul className={`space-y-3 ${i % 2 === 0 ? "text-left" : "md:text-right"}`}>
                      {exp.bullets.map((bullet, j) => (
                        <li key={j} className={`text-sm text-secondary leading-relaxed flex gap-3 ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
                          <ChevronRight className="shrink-0 text-accent mt-1" size={14} />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="hidden md:block w-1/2" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  const projects = [
    {
      name: "MovingCRM",
      category: "CRM & SaaS",
      tags: ["Flutter Web", "Dart", "REST APIs", "SaaS"],
      desc: "AI-powered CRM platform for moving companies — integrating lead management, dispatch, payroll, and customer operations. Contributed as a freelance Flutter developer during early product development, building the Flutter Web application and establishing core functionality and UX.",
      accent: "indigo",
      color: "from-indigo-500 to-violet-500",
      badge: "new" as const,
      role: "Freelance Flutter Developer",
      links: [
        { type: "web", url: "https://www.movingcrm.ai/", label: "Visit" }
      ]
    },
    {
      name: "Tjwalnet — Travel eSIM",
      category: "Travel & Telecom",
      tags: ["Flutter", "PayPal", "Maps", "Firebase"],
      desc: "Region-aware eSIM system covering 70+ countries with in-app wallet and points-based payments.",
      accent: "cyan",
      color: "from-cyan-500 to-blue-500",
      badge: "featured" as const,
      links: [
        { type: "apple", url: "https://apps.apple.com/pk/app/tjwalnet/id1597279710" },
        { type: "play", url: "https://play.google.com/store/apps/details?id=com.tjwalnet.app" }
      ]
    },
    {
      name: "My MYO — Therapy",
      category: "Health & Wellness",
      tags: ["Video Tech", "Scheduling", "Health"],
      desc: "Clinical therapy platform with specialized video exercise player and smart appointment management.",
      accent: "purple",
      color: "from-purple-500 to-indigo-500",
      badge: "featured" as const,
      links: [
        { type: "apple", url: "https://apps.apple.com/pk/app/my-myo/id1627314322" },
        { type: "play", url: "https://play.google.com/store/apps/details?id=com.therapy.app" }
      ]
    },
    {
      name: "GuardTrack & Staff",
      category: "Security",
      tags: ["GPS Tracking", "Security", "Real-time"],
      desc: "Mission-critical security platform supporting 500+ officers with precise geofencing and monitoring.",
      accent: "green",
      color: "from-emerald-500 to-teal-500",
      badge: "featured" as const,
      links: [
        { type: "apple", url: "https://apps.apple.com/pk/app/guardtrack-staff/id1541680131" }
      ]
    },
    {
      name: "Surrey Security Staff",
      category: "Workforce",
      tags: ["Workforce", "Operations", "Live Data"],
      desc: "Enterprise-grade staff coordination system for large-scale security operations and compliance.",
      accent: "orange",
      color: "from-orange-500 to-red-500",
      badge: null,
      links: [
        { type: "apple", url: "https://apps.apple.com/pk/app/surrey-security-staff/id1317515997" },
        { type: "play", url: "https://play.google.com/store/apps/details?id=com.thesurreysecurity.surreysecuritystaff" }
      ]
    },
    {
      name: "09 Building Co",
      category: "Construction",
      tags: ["Construction", "Maps", "Field Op"],
      desc: "Construction management tool streamlining site coordination and civil engineering projects.",
      accent: "red",
      color: "from-red-600 to-rose-400",
      badge: "new" as const,
      links: [
        { type: "apple", url: "https://apps.apple.com/pk/app/09buildingco/id1660547287" }
      ]
    },
    {
      name: "Quoteable App",
      category: "Consumer",
      tags: ["Consumer App", "In-App Ads", "Push"],
      desc: "Premium consumer experience featuring daily wisdom with monetization and retention optimizations.",
      accent: "yellow",
      color: "from-amber-400 to-yellow-600",
      badge: null,
      links: [
        { type: "apple", url: "https://apps.apple.com/pk/app/quoteable/id6670215365" },
        { type: "play", url: "https://play.google.com/store/apps/details?id=com.jokerdiary.joker_diary" }
      ]
    }
  ];

  const glowStyles: Record<string, string> = {
    indigo: "hover:border-indigo-500/40 hover:shadow-indigo-500/10",
    cyan: "hover:border-cyan-500/40 hover:shadow-cyan-500/10",
    purple: "hover:border-purple-500/40 hover:shadow-purple-500/10",
    green: "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
    orange: "hover:border-orange-500/40 hover:shadow-orange-500/10",
    red: "hover:border-red-500/40 hover:shadow-red-500/10",
    yellow: "hover:border-amber-500/40 hover:shadow-amber-500/10"
  };

  return (
    <section id="projects" className="py-28 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.02] to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading eyebrow="Portfolio" title="Featured Work" desc="High-performance applications deployed to millions of users worldwide." />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project, i) => (
            <Reveal key={i} className="stagger-item h-full">
              <div className={`project-card glass h-full rounded-3xl overflow-hidden flex flex-col border-white/5 shadow-lg shadow-black/20 ${glowStyles[project.accent]}`}>
                <div className={`h-1.5 bg-gradient-to-r ${project.color}`} />

                <div className="p-6 sm:p-8 flex flex-col flex-grow">
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center shadow-lg`}>
                      {"role" in project && project.role ? (
                        <Monitor size={22} className="text-white" />
                      ) : (
                        <Smartphone size={22} className="text-white" />
                      )}
                    </div>
                    {project.badge && (
                      <span className={`badge-pill ${project.badge === "featured" ? "badge-featured" : "badge-new"}`}>
                        {project.badge === "featured" ? "Featured" : "New"}
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">{project.category}</p>
                  <h4 className="text-xl font-display font-bold text-primary mb-2 leading-snug">{project.name}</h4>
                  <p className="text-secondary mb-4 leading-relaxed text-sm flex-grow">{project.desc}</p>

                  {"role" in project && project.role && (
                    <div className="mb-5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
                        {project.role}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[9px] px-2.5 py-1 rounded-full text-slate-400 uppercase tracking-wider font-semibold bg-white/5 border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className={`flex gap-3 pt-5 border-t border-white/5 ${project.links.length === 1 ? "justify-center" : ""}`}>
                    {project.links.map((link, linkIdx) => (
                      <a
                        key={linkIdx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs tracking-wide transition-all bg-accent/10 text-accent border border-accent/20 hover:bg-accent hover:text-navy hover:shadow-[0_4px_20px_rgba(56,189,248,0.3)] hover:-translate-y-0.5"
                      >
                        {link.type === "apple" ? (
                          <Apple size={14} />
                        ) : link.type === "web" ? (
                          <Globe size={14} />
                        ) : (
                          <Smartphone size={14} />
                        )}
                        {"label" in link && link.label ? link.label : "GET"}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Jaquan Wells",
      date: "Sep 2025",
      review: "Hassan is a Flutter expert. I highly recommend him.",
      project: "Simple Weather App (iOS & Android)",
      badges: ["Committed to Quality"],
    },
    {
      name: "Ummati Softwares",
      date: "Oct 2023 – May 2024",
      review: null,
      project: "Flutter Developer — Part-Time (Tjwal Net)",
      badges: ["Reliable"],
    },
    {
      name: "Alihaider Alihaider",
      date: "Sep 2023",
      review:
        "It was a pleasure to work with Hassan on this project. The project was completed efficiently and within the expected timeframe. He was responsive and available to provide clarification and answers. Highly recommended!",
      project: "Small Flutter App",
      badges: ["Collaborative", "Clear Communicator", "Reliable"],
    },
    {
      name: "Yogesh Gajera",
      date: "Aug 2023",
      review: "Hassan Zafar is an amazing person. Done the job successfully before time.",
      project: "Android App Development",
      badges: ["Reliable"],
    },
  ];

  return (
    <section id="testimonials" className="py-28 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.02] to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <Reveal className="mb-16 text-center md:text-left">
          <span className="badge-pill badge-featured mb-5">Testimonials</span>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 text-primary leading-tight">
            What clients say
          </h3>
          <p className="text-secondary text-base md:text-lg">
            4 completed jobs · 5.0 average rating on Upwork
          </p>
          <div className="section-divider mt-8 hidden md:block" />
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((item, i) => (
            <Reveal key={i} className="stagger-item h-full">
              <div className="testimonial-card glass h-full rounded-3xl p-6 sm:p-8 border border-white/5 flex flex-col transition-all hover:border-accent/20 hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-11 h-11 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0">
                    <span className="font-display font-bold text-accent text-sm">
                      {getInitials(item.name)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-primary truncate">{item.name}</p>
                    <p className="text-xs text-secondary">{item.date}</p>
                  </div>
                </div>

                <FiveStars />

                {item.review ? (
                  <blockquote className="text-secondary text-sm leading-relaxed my-5 flex-grow">
                    &ldquo;{item.review}&rdquo;
                  </blockquote>
                ) : (
                  <p className="text-secondary text-sm leading-relaxed my-5 flex-grow italic">
                    Long-term Flutter development contract for the Tjwal Net app.
                  </p>
                )}

                <div className="border-t border-white/5 pt-5 mt-auto">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                    {item.project}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.badges.map((badge) => (
                      <span
                        key={badge}
                        className="text-[10px] font-semibold px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="text-center text-xs text-slate-600 mt-12">
          All reviews are from Upwork
        </p>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-28 sm:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="hero-card p-8 sm:p-12 md:p-16 lg:p-20 relative overflow-hidden group">
             <div className="hero-blob w-72 h-72 bg-accent/15 -top-20 -right-20" />
             <div className="hero-blob w-56 h-56 bg-purple-500/10 -bottom-16 -left-16" />
             
             <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="text-center lg:text-left">
                   <span className="badge-pill badge-featured mb-6">Communication</span>
                   <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-primary mb-6 leading-tight">
                     Ready to start your next project?
                   </h3>
                   <p className="text-secondary text-base md:text-lg mb-10 max-w-md mx-auto lg:mx-0">
                     Let&apos;s build something exceptional together. Reach out for collaborations, consulting, or full-time opportunities.
                   </p>
                   <div className="space-y-5">
                      {[
                        { icon: Mail, label: "Direct Email", value: "dev.hassanzafar@gmail.com", href: "mailto:dev.hassanzafar@gmail.com" },
                        { icon: Phone, label: "Mobile Contact", value: "+92-332-6928633", href: "tel:+923326928633" },
                        { icon: MapPin, label: "Location", value: "Islamabad, Pakistan", href: "#" }
                      ].map((item, i) => (
                        <a key={i} href={item.href} className="flex items-center gap-5 group/link p-3 rounded-2xl hover:bg-white/5 transition-colors text-left">
                          <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center shrink-0 group-hover/link:bg-accent group-hover/link:text-navy group-hover/link:scale-105 transition-all">
                            <item.icon size={24} />
                          </div>
                          <div>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">{item.label}</p>
                            <p className="text-lg font-semibold text-primary group-hover/link:text-accent transition-colors">{item.value}</p>
                          </div>
                        </a>
                      ))}
                   </div>
                </div>
                <div className="glass p-8 sm:p-10 rounded-3xl text-center border border-white/5 relative overflow-hidden">
                   <div className="w-16 h-16 bg-accent text-navy rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent/25">
                      <Code2 size={32} />
                   </div>
                   <h4 className="text-2xl font-display font-bold mb-3 text-white">Let&apos;s Connect</h4>
                   <p className="text-slate-400 mb-8 text-base leading-relaxed">Follow my professional updates and open-source contributions.</p>
                   <div className="flex gap-4 justify-center">
                      <a href="https://github.com/HassanZafar15" target="_blank" rel="noopener noreferrer" className="p-4 glass rounded-2xl text-slate-400 hover:text-white hover:scale-105 hover:border-accent/30 transition-all" aria-label="GitHub">
                        <Github size={24} />
                      </a>
                      <a href="https://linkedin.com/in/hassanzafar15" target="_blank" rel="noopener noreferrer" className="p-4 glass rounded-2xl text-blue-400/60 hover:text-blue-400 hover:scale-105 hover:border-blue-400/30 transition-all" aria-label="LinkedIn">
                        <Linkedin size={24} />
                      </a>
                      <a href="https://wa.me/923326928633" target="_blank" rel="noopener noreferrer" className="p-4 glass rounded-2xl text-emerald-400/60 hover:text-emerald-400 hover:scale-105 hover:border-emerald-400/30 transition-all" aria-label="WhatsApp">
                        <MessageCircle size={24} />
                      </a>
                   </div>
                   <a href="mailto:dev.hassanzafar@gmail.com" className="btn-primary mt-8 w-full sm:w-auto">
                     <Mail size={16} />
                     Get in Touch
                   </a>
                </div>
             </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/5 bg-[#050510]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} Hassan Zafar / All Rights Reserved / Engineered for Performance
        </p>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#050510] text-[#f8fafc] page-enter">
      <ScrollProgress />
      <CustomCursor />
      <Navigation />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
    </div>
  );
}
