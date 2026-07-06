import { useEffect, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "";

const ROLES = [
  "Java · Spring Boot · React · REST APIs",
  "Full stack web apps, shipped end to end",
  "LMS, e-commerce & AI-powered platforms",
];

const CORE_STACK = [
  { name: "Core Java", note: "OOP, collections, concurrency" },
  { name: "Spring Boot", note: "REST services, dependency injection" },
  { name: "Hibernate", note: "ORM, entity relationships" },
  { name: "RESTful APIs", note: "Design, docs, integration" },
  { name: "MySQL", note: "Schema design, query tuning" },
  { name: "React / Angular", note: "Component-driven UI" },
];

const SECONDARY_STACK = [
  "JavaScript", "PostgreSQL", "JDBC", "Apache Kafka", "Redis",
  "OpenAI API", "Microservices", "Git & GitHub", "Postman", "VS Code / STS",
];

const PROJECTS = [
  {
    name: "LMS — Learning Management System",
    github: "https://github.com/surve123",
    demo: null,
    desc: "Enterprise LMS built on Spring Boot with a microservices architecture — course management, enrollment, and finance modules with event-driven communication.",
    schema: "Course, enrollment & finance schema — fee plans, transactions, invoices",
    architecture: "Microservices · Kafka events · Redis caching",
    tags: ["Spring Boot", "Microservices", "Kafka", "Redis", "MySQL", "React JS"],
  },
  {
    name: "AI-Powered Business Review Analyzer",
    github: "https://github.com/surve123",
    demo: null,
    desc: "AI-driven review analysis platform using the OpenAI Chat Completions API to extract sentiment and generate business growth insights.",
    schema: "Review ingestion tables + response cache",
    architecture: "Monolith MVC · OpenAI API integration",
    tags: ["OpenAI API", "Spring Boot", "MySQL", "React JS"],
  },
  {
    name: "EliteStore",
    github: "https://github.com/surve123/shopping-cart-spring-boot-main",
    demo: null,
    desc: "Full-stack e-commerce platform with 15+ REST endpoints, supporting 100+ products and 50+ concurrent transactions.",
    schema: "10+ relational tables — users, products, orders",
    architecture: "MVC · Spring Boot + Hibernate ORM",
    tags: ["Spring Boot", "Hibernate", "MySQL", "React JS"],
  },
  {
    name: "ClassTracker",
    github: "https://github.com/surve123",
    demo: null,
    desc: "Role-based academic management system supporting 200+ student records across admin, teacher, student, and tutor roles.",
    schema: "Student, role & performance tracking schema",
    architecture: "MVC · Spring Boot REST APIs",
    tags: ["Spring Boot", "MySQL", "REST APIs"],
  },
];

const EXPERIENCE = [
  {
    role: "Full Stack Java Developer",
    company: "Nebula Technology · Pune, India",
    period: "Feb 2026 – Present",
    bullets: [
      "Contributing to an enterprise LMS built on Spring Boot with microservices architecture.",
      "Working with Apache Kafka for event-driven communication between services.",
      "Exploring Redis caching strategies for low-latency API responses.",
      "Developing Spring Boot REST APIs for course management and enrollment modules.",
    ],
  },
  {
    role: "IT Data Consultant — Software & Data Systems",
    company: "Wynisco Solutions Pvt. Ltd. · Remote",
    period: "May 2025 – Feb 2026",
    bullets: [
      "Engineered a Java-based web scraping system across 5+ job platforms, aggregating 1,000+ records/day.",
      "Built data transformation and validation logic to clean and normalize records into MySQL.",
      "Optimized SQL batch inserts and connection pooling, improving write performance by 35%.",
    ],
  },
];

const EDUCATION = [
  { degree: "B.Sc. Computer Science", school: "Sinhgad College of Science, Pune", year: "2023 – 2025" },
  { degree: "Diploma in Computer Technology", school: "Eklavya Polytechnic, Pune", year: "2020 – 2023" },
];

const CERTIFICATIONS = [
  { name: "Full Stack Java Development", issuer: "Java by Kiran" },
  { name: "Generative AI Mastermind", issuer: "Outskill" },
];

const NAV_ITEMS = [
  { id: "stack", label: "Tech Stack" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
];

function useFadeInOnScroll(containerRef) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const els = root.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [containerRef]);
}

function useTypingEffect(roles) {
  const [text, setText] = useState("");
  useEffect(() => {
    let ri = 0, ci = 0, deleting = false, timeoutId;
    const tick = () => {
      const current = roles[ri];
      if (!deleting) {
        ci++;
        setText(current.slice(0, ci));
        if (ci === current.length) { deleting = true; timeoutId = setTimeout(tick, 1400); return; }
      } else {
        ci--;
        setText(current.slice(0, ci));
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
      }
      timeoutId = setTimeout(tick, deleting ? 35 : 55);
    };
    timeoutId = setTimeout(tick, 300);
    return () => clearTimeout(timeoutId);
  }, [roles]);
  return text;
}

function DbIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5" /><path d="M3 12a9 3 0 0 0 18 0" />
    </svg>
  );
}
function BoxIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21 8-9-6-9 6v8l9 6 9-6V8Z" /><path d="m3 8 9 6 9-6" /><path d="M12 22V14" />
    </svg>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", text: "" }); // idle | loading | success | error

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ state: "error", text: "Please fill in your name, email, and message." });
      return;
    }
    setStatus({ state: "loading", text: "" });
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus({ state: "success", text: "Message sent — I'll get back to you soon." });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({
        state: "error",
        text: err.message || "Couldn't send the message. Please email me directly instead.",
      });
    }
  };

  return (
    <form className="contact-form fade-in" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="field">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" required />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@company.com" required />
        </div>
      </div>
      <div className="field">
        <label>Subject</label>
        <input name="subject" value={form.subject} onChange={handleChange} placeholder="Full Stack Developer opportunity" />
      </div>
      <div className="field">
        <label>Message</label>
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Hi Shreyas, we'd love to talk to you about..." required />
      </div>
      <button type="submit" className="btn btn-solid submit-btn" disabled={status.state === "loading"}>
        {status.state === "loading" ? "Sending…" : "Send Message"}
      </button>
      {status.state === "success" && <div className="form-status success">{status.text}</div>}
      {status.state === "error" && <div className="form-status error">{status.text}</div>}
    </form>
  );
}

export default function App() {
  const containerRef = useRef(null);
  const [navOpen, setNavOpen] = useState(false);
  const typedRole = useTypingEffect(ROLES);
  useFadeInOnScroll(containerRef);

  const closeNav = () => setNavOpen(false);

  return (
    <div ref={containerRef}>
      <header>
        <nav>
          <a href="#top" className="logo">shreyas<span className="accent">.dev</span></a>
          <div className="navlinks">
            {NAV_ITEMS.map((item) => (
              <a key={item.id} href={`#${item.id}`}>{item.label}</a>
            ))}
            <a href="#contact" className="nav-cta">Contact</a>
          </div>
          <button className="burger" onClick={() => setNavOpen((v) => !v)} aria-label="Toggle menu">
            {navOpen ? "✕" : "☰"}
          </button>
        </nav>
        <div className={`mobile-nav ${navOpen ? "open" : ""}`}>
          {NAV_ITEMS.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={closeNav}>{item.label}</a>
          ))}
          <a href="#contact" onClick={closeNav} style={{ color: "var(--accent)" }}>Contact</a>
        </div>
      </header>

      <main className="wrap">
        {/* HERO */}
        <section id="top" className="hero" style={{ borderTop: "none" }}>
          <div className="tag"><span className="dot" />available for full stack roles</div>

          <h1>Shreyas Surve<br /><span className="accent">Full Stack Java Developer.</span></h1>
          <div className="role">
            {typedRole}
            <span className="cursor">&nbsp;</span>
          </div>
          <p className="intro">
            Building scalable web applications with Java, Spring Boot, and React across LMS,
            e-commerce, and AI-powered platforms — from database schema to deployed UI.
          </p>

          <div className="terminal fade-in">
            <div className="term-bar">
              <div className="term-dot red" /><div className="term-dot yellow" /><div className="term-dot green" />
              <div className="term-title">shreyas@fullstack: ~</div>
            </div>
            <div className="term-body">
              <div className="line"><span className="prompt">$</span> whoami</div>
              <div className="line"><span className="key">name</span>      <span>Shreyas Surve</span></div>
              <div className="line"><span className="key">role</span>      <span>Full Stack Java Developer</span></div>
              <div className="line"><span className="key">focus</span>     <span>End-to-end web apps — React front, Spring Boot back</span></div>
              <div className="line"><span className="key">location</span> <span>Pune, India</span></div>
              <div className="line"><span className="key">stack</span>     <span>Java · Spring Boot · React JS · MySQL · Kafka · Redis</span></div>
              <div className="line"><span className="prompt">$</span> <span className="cursor">&nbsp;</span></div>
            </div>
          </div>

          <div className="hero-cta">
            <a href="#projects" className="btn btn-solid">View Projects</a>
            <a href="#contact" className="btn btn-outline">Get In Touch</a>
          </div>

          <div className="socials">
            <a href="https://github.com/surve123" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <a href="https://www.linkedin.com/in/shreyas-surve-818017195" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            <a href="mailto:shreyassurve02@gmail.com">Email ↗</a>
          </div>
        </section>

        {/* TECH STACK */}
        <section id="stack">
          <div className="sec-label">// tech stack</div>
          <h2 className="sec-title fade-in">Core technologies.</h2>
          <p className="sec-sub fade-in">The primary tools I use to build backend services and full stack applications.</p>

          <div className="core-grid">
            {CORE_STACK.map((s) => (
              <div key={s.name} className="core-card fade-in visible">
                <h3>{s.name}</h3>
                <p>{s.note}</p>
              </div>
            ))}
          </div>

          <div className="pill-row fade-in">
            {SECONDARY_STACK.map((s) => <span key={s} className="pill">{s}</span>)}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects">
          <div className="sec-label">// projects</div>
          <h2 className="sec-title fade-in">Things I've built end to end.</h2>
          <div className="proj-grid">
            {PROJECTS.map((p) => (
              <div key={p.name} className="proj-card fade-in visible">
                <div className="proj-name">{p.name}</div>
                <div className="proj-desc">{p.desc}</div>
                <div className="meta-row"><span className="meta-icon"><DbIcon /></span><span><b>Schema:</b> {p.schema}</span></div>
                <div className="meta-row"><span className="meta-icon"><BoxIcon /></span><span><b>Architecture:</b> {p.architecture}</span></div>
                <div className="proj-tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
                <div className="proj-links">
                  <a className="code-link" href={p.github} target="_blank" rel="noopener noreferrer">Code</a>
                  {p.demo ? (
                    <a className="demo-link" href={p.demo} target="_blank" rel="noopener noreferrer">Live Demo</a>
                  ) : (
                    <span className="demo-disabled">Demo soon</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience">
          <div className="sec-label">// experience</div>
          <h2 className="sec-title fade-in">Where I've worked.</h2>
          <div className="timeline fade-in">
            {EXPERIENCE.map((exp) => (
              <div key={exp.role} className="tl-item">
                <div className="tl-role">{exp.role}</div>
                <div className="tl-meta">{exp.company} · {exp.period}</div>
                <ul className="tl-desc">{exp.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>

        {/* EDUCATION */}
        <section id="education">
          <div className="sec-label">// education</div>
          <h2 className="sec-title fade-in">Background.</h2>
          <div className="fade-in">
            {EDUCATION.map((edu, i) => (
              <div key={edu.degree} className="edu-item">
                <div>
                  <div className="edu-degree">{edu.degree}</div>
                  <div className="edu-school">{edu.school}</div>
                </div>
                <div className="edu-year">{edu.year}</div>
              </div>
            ))}
          </div>
          <div className="cert-row fade-in">
            {CERTIFICATIONS.map((c) => (
              <span key={c.name}>{c.name} <b>— {c.issuer}</b></span>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact">
          <div className="sec-label">// contact</div>
          <h2 className="sec-title fade-in">Let's build something.</h2>
          <p className="sec-sub fade-in">
            Hiring or have a role in mind? Send a message below — it goes straight to my inbox — or
            download my resume.
          </p>

          <div className="contact-grid">
            <div className="contact-info fade-in">
              <h3>Get in touch</h3>
              <p>Open to full stack and backend engineering roles. I usually reply within a day.</p>

              <a className="contact-link" href="mailto:shreyassurve02@gmail.com">✉ shreyassurve02@gmail.com</a>
              <a className="contact-link" href="https://github.com/surve123" target="_blank" rel="noopener noreferrer">⌥ github.com/surve123</a>
              <a className="contact-link" href="https://www.linkedin.com/in/shreyas-surve-818017195" target="_blank" rel="noopener noreferrer">in linkedin.com/in/shreyas-surve</a>

              <a
                className="btn btn-outline resume-btn"
                href="/Shreyas_Surve_Resume.pdf"
                download="Shreyas_Surve_Resume.pdf"
              >
                ⬇ Download Resume
              </a>
            </div>

            <ContactForm />
          </div>
        </section>

        <footer>
          <div>© {new Date().getFullYear()} Shreyas Surve</div>
          <div>Built with React &amp; Express.</div>
        </footer>
      </main>
    </div>
  );
}
