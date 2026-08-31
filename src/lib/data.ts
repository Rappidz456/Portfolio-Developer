export const profile = {
  name: "Muhammad Ali Asif",
  first: "ALI",
  last: "ASIF",
  wordmark: "ALIASIF",
  role: "Full Stack Software Engineer",
  location: "Lahore, Pakistan",
  phone: "+92 331 4835133",
  phoneHref: "tel:+923314835133",
  email: "mohammadali6918773@gmail.com",
  linkedin: "https://www.linkedin.com/in/ali-asif-968b6b233/",
  github: "https://github.com/Rappidz456",
  years: "4+",
  resumeHref: "/Muhammad_Ali_Asif_Resume.pdf",
  summary:
    "Full Stack Software Engineer with 4+ years of experience designing and delivering scalable web and cross-platform applications for production environments. I lead work from architecture and implementation through deployment and continuous improvement, with deep focus on scalable system design, API development, real-time applications and AI integration.",
};

export type HudCardData = {
  live?: boolean;
  label: string;
  chip?: string;
  value?: string;
  note?: string;
  list?: string[];
};

export const heroCards = {
  left: [
    {
      live: true,
      label: "Online",
      chip: "Open to work",
      value: `${profile.years} Years`,
      note: "Shipping production software",
    },
    {
      label: "Current stack",
      chip: "2026",
      list: ["Next.js 16", "React Native", "Node.js", "FastAPI"],
    },
  ] satisfies HudCardData[],
  right: [
    {
      label: "Platforms",
      value: "Web + Mobile",
      note: "React · Next.js · React Native",
    },
    {
      label: "Latest builds",
      list: ["Tasky · Live", "ReminderLink · iOS"],
    },
  ] satisfies HudCardData[],
};

export const outbound = [
  { label: "LinkedIn", href: profile.linkedin },
  { label: "GitHub", href: profile.github },
  { label: "Résumé", href: profile.resumeHref },
] as const;

export type CardArtKind = "radar" | "grid" | "nodes";

export type Capability = {
  index: string;
  title: string;
  body: string;
  tags: string[];
  art: CardArtKind;
};

export const capabilities: Capability[] = [
  {
    index: "01",
    title: "Architect the system.",
    body: "Scalable architecture, reusable component systems and CI/CD workflows that keep releases reliable and consistent as the product grows.",
    tags: ["System Design", "CI/CD", "Code Review"],
    art: "radar",
  },
  {
    index: "02",
    title: "Build it end to end.",
    body: "Responsive interfaces and REST APIs wired together — authentication flows, payment gateways, push notifications and real-time features, on web and mobile.",
    tags: ["Next.js", "React Native", "Node.js"],
    art: "grid",
  },
  {
    index: "03",
    title: "Make it intelligent.",
    body: "AI woven into real products: live video analytics, agent workflows and LLM integrations built on OpenAI and Anthropic tooling, backed by FastAPI and Node services.",
    tags: ["OpenAI API", "Agents SDK", "FastAPI"],
    art: "nodes",
  },
];

export type Role = {
  title: string;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  points: string[];
};

export const experience: Role[] = [
  {
    title: "Software Engineer",
    company: "Wisdom IT Solutions",
    location: "Lahore, Pakistan",
    period: "Jul 2025 — Aug 2026",
    current: true,
    points: [
      "Design and develop scalable web and cross-platform applications using React.js, React Native, Next.js, TypeScript and JavaScript.",
      "Integrate RESTful API endpoints, authentication flows, payment gateways, push notifications and real-time features for production-grade experiences.",
      "Improve application performance through efficient state management, code optimization and debugging.",
      "Collaborate with product managers, designers and backend engineers in Agile Scrum ceremonies to plan sprints, review code and ship releases.",
      "Maintain scalable architecture, reusable components and CI/CD workflows for reliable deployments.",
    ],
  },
  {
    title: "Software Engineer",
    company: "Jarvis Technologies",
    location: "Lahore, Pakistan",
    period: "Aug 2024 — Jun 2025",
    points: [
      "Maintained a production React Native mobile application and a React.js / Next.js web application with scalable, maintainable architecture.",
      "Developed responsive UI screens and integrated REST endpoints using React Native, React.js, Next.js, Node.js, Redux and Firebase.",
      "Optimized mobile and web performance through debugging, efficient state management and refactoring.",
      "Delivered production releases with Agile Scrum while upholding code quality, accessibility standards and consistent UX across platforms.",
    ],
  },
  {
    title: "Mobile Application Developer",
    company: "Cyber Advance Solutions",
    location: "Lahore, Pakistan",
    period: "Jan 2022 — Jul 2024",
    points: [
      "Developed and shipped mobile features aligned with user needs and business goals.",
      "Worked with product managers, UI/UX designers and backend developers to translate user stories into working features and resolve state management issues with Redux.",
      "Optimized API calls with Axios and improved app navigation using React Navigation.",
      "Integrated third-party libraries and APIs including payment gateways, push notifications, social logins and analytics.",
    ],
  },
];

export type MediaShot = { src: string; width: number; height: number };

export type Project = {
  id: string;
  name: string;
  kind: string;
  year: string;
  blurb: string;
  points: string[];
  stack: string[];
  /** Live URL, if the project is publicly reachable. */
  href?: string;
  hrefLabel?: string;
  /** Wordmark or app icon shown on the card. */
  logo?: MediaShot & { rounded?: boolean };
  /** Wide browser screenshot. */
  shot?: MediaShot;
  /** Portrait app screenshots, rendered in phone frames. */
  phones?: MediaShot[];
  /** Fallback illustration when there is nothing public to screenshot. */
  art?: "surveillance";
  accent: string;
  stats?: { label: string; value: string }[];
};

export const projects: Project[] = [
  {
    id: "tasky",
    name: "Tasky",
    kind: "Service Marketplace — UAE",
    year: "WEB + MOBILE",
    href: "https://www.tasky.ae/",
    hrefLabel: "tasky.ae",
    accent: "#22a35a",
    blurb:
      "A live services marketplace for the UAE: customers post a task or book direct, verified taskers quote, and the whole exchange — payments, chat, rewards — runs on one product surface across web and mobile.",
    points: [
      "Built across web and mobile with Next.js, React Native and Node.js — authentication, dynamic routing and real-time updates.",
      "Designed REST APIs and a company onboarding flow supporting organizational collaboration and workflow tracking.",
      "Shipped booking, quoting and wallet flows with secure payments and a coin-based referral rewards system.",
    ],
    stack: ["Next.js", "React Native", "Node.js", "REST APIs", "Real-time"],
    logo: { src: "/projects/tasky-logo.png", width: 251, height: 80 },
    shot: { src: "/projects/tasky-site.png", width: 1400, height: 1050 },
    stats: [
      { label: "Customers", value: "50,000+" },
      { label: "Providers", value: "5,000+" },
      { label: "Rating", value: "4.8+" },
    ],
  },
  {
    id: "reminderlink",
    name: "ReminderLink",
    kind: "Instant 2-Way Care Reminders",
    year: "iOS — APP STORE",
    href: "https://apps.apple.com/us/app/reminderlink/id6479702306",
    hrefLabel: "App Store",
    accent: "#4f8ef7",
    blurb:
      "An iOS app for family caregivers: schedule a loved one's medication, appointments and hydration remotely, and both sides get the alert in real time — no tech skills required on their end.",
    points: [
      "Real-time two-way reminder delivery so the caregiver is notified the moment a task is confirmed or missed.",
      "Remote scheduling for medication, doctor visits, hydration and tasks, managed entirely from the caregiver's device.",
      "Built-in chat and support access, with push notifications and subscription handling wired into the app.",
    ],
    stack: ["React Native", "iOS", "Push Notifications", "Real-time", "REST APIs"],
    logo: {
      src: "/projects/reminderlink-icon.jpg",
      width: 400,
      height: 400,
      rounded: true,
    },
    phones: [
      { src: "/projects/reminderlink-1.jpg", width: 600, height: 1300 },
      { src: "/projects/reminderlink-2.jpg", width: 600, height: 1300 },
      { src: "/projects/reminderlink-3.jpg", width: 600, height: 1300 },
    ],
    stats: [
      { label: "Rating", value: "5.0" },
      { label: "Category", value: "Medical" },
      { label: "Platform", value: "iOS 14+" },
    ],
  },
  {
    id: "surveillance",
    name: "AI Surveillance System",
    kind: "Real-Time Computer Vision Platform",
    year: "AI + BACKEND",
    accent: "#38bdf8",
    blurb:
      "A live safety and compliance monitoring dashboard driven by real-time video analytics.",
    points: [
      "Built an AI surveillance dashboard with Next.js and FastAPI covering helmet non-compliance, line-crossing and bottle inspection detection.",
      "Designed a scalable Node.js and Python backend for live video analytics and real-time violation tracking.",
    ],
    stack: ["Next.js", "FastAPI", "Python", "Node.js", "Computer Vision"],
    art: "surveillance",
    stats: [
      { label: "Streams", value: "Live" },
      { label: "Detections", value: "3 classes" },
      { label: "Backend", value: "FastAPI" },
    ],
  },
];

export type SkillGroup = { group: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    group: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "SQL"],
  },
  {
    group: "Frameworks & Libraries",
    items: [
      "React Native",
      "Next.js",
      "React.js",
      "Node.js",
      "Express.js",
      "FastAPI",
      "Redux",
      "Zustand",
      "Context API",
      "Vue",
    ],
  },
  {
    group: "Data & Backend",
    items: ["PostgreSQL", "Firebase", "REST APIs", "Axios"],
  },
  {
    group: "Engineering & Delivery",
    items: [
      "Git",
      "JIRA",
      "Agile",
      "Docker",
      "CI/CD Pipelines",
      "System Monitoring",
      "Debugging",
    ],
  },
  {
    group: "Testing & Quality",
    items: ["Unit Testing", "Performance Tuning", "Accessibility"],
  },
  {
    group: "GenAI & Agents",
    items: [
      "OpenAI API",
      "GPT-4o",
      "Responses API",
      "OpenAI Agents SDK",
      "Anthropic",
      "Claude Code",
    ],
  },
];

export const marquee = [
  "NEXT.JS",
  "REACT NATIVE",
  "TYPESCRIPT",
  "NODE.JS",
  "FASTAPI",
  "POSTGRESQL",
  "OPENAI",
  "DOCKER",
  "REDUX",
  "CI/CD",
];

export type Education = {
  school: string;
  location: string;
  degree: string;
  period: string;
};

export const education: Education = {
  school: "Minhaj University",
  location: "Lahore, Pakistan",
  degree: "Bachelor of Science in Information Technology",
  period: "2020 — 2024",
};

export type NavItem = { label: string; href: string };

export const nav: NavItem[] = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];
