import { agentContext } from "@/lib/agent-context";
import { sectionForQuestion, type AgentSection } from "@/lib/agent-nav";
import {
  capabilities,
  education,
  experience,
  profile,
  projects,
  skills,
} from "@/lib/data";

export type AgentAnswer = {
  reply: string;
  navigate: AgentSection | null;
};

const SYSTEM = `You are the AI assistant on Muhammad Ali Asif's portfolio website. Visitors are recruiters, founders or engineers asking about him.

You have complete knowledge of Ali in PORTFOLIO DATA: profile, services, every job, every project, skills, education and contact.

How to answer:
- Answer only from PORTFOLIO DATA. Never invent employers, dates, clients, metrics or availability.
- When asked about projects, name all of them (Tasky, ReminderLink, AI Surveillance System) and what each does, including live links when present.
- When asked about experience, cover every role with company, title and dates.
- When asked about services, explain architecture, end-to-end web/mobile builds, and AI integration.
- Speak about Ali in the third person. Be warm and direct.
- Use 3-7 short sentences when listing work. Plain text only, no markdown headings, no emoji.
- If something is not in the data, say you don't have that detail and offer ${profile.email}.
- Off-topic requests get a friendly redirect back to his work.
- When someone wants to hire him, collect name, email and what they need, then point them to ${profile.email}.
- If the question is about his projects, mention they can see them in the Work section on this page.

PORTFOLIO DATA
${agentContext}`;

type Turn = { role: "user" | "assistant"; content: string };

const memory = new Map<string, Turn[]>();

function remember(sessionId: string, turn: Turn) {
  const prev = memory.get(sessionId) ?? [];
  prev.push(turn);
  memory.set(sessionId, prev.slice(-10));
}

function has(q: string, ...needles: string[]) {
  return needles.some((n) => q.includes(n));
}

function projectBlurb(p: (typeof projects)[number]) {
  const live = p.href ? ` Live at ${p.href}.` : "";
  const stats = p.stats
    ? ` ${p.stats.map((s) => `${s.label} ${s.value}`).join(", ")}.`
    : "";
  return `${p.name} is ${p.kind.toLowerCase()}: ${p.blurb}${live}${stats}`;
}

/** Full answers from portfolio data when the LLM is unavailable. */
export function localReply(message: string): AgentAnswer {
  const q = message.toLowerCase();
  const navigate = sectionForQuestion(message);
  const current = experience.find((role) => role.current) ?? experience[0];

  if (has(q, "available", "hire", "open to", "looking for work", "freelance")) {
    return {
      navigate,
      reply: `Yes — Ali is available for work. He is a ${profile.role} with ${profile.years} years of experience, currently a Software Engineer at ${current.company} in ${profile.location}. Email him at ${profile.email} with your name and what you need.`,
    };
  }

  if (
    has(
      q,
      "project",
      "projects",
      "built",
      "developed",
      "shipped",
      "portfolio",
      "tasky",
      "reminder",
      "surveillance"
    )
  ) {
    const named = projects.find((p) => q.includes(p.name.toLowerCase()));
    if (named) {
      return {
        navigate: "#work",
        reply: `${projectBlurb(named)} Stack: ${named.stack.join(", ")}. I am scrolling you to the Work section so you can see it.`,
      };
    }
    return {
      navigate: "#work",
      reply: `Ali has developed three products. ${projects.map(projectBlurb).join(" ")} I am taking you to the Work section now.`,
    };
  }

  if (
    has(
      q,
      "service",
      "services",
      "offer",
      "provide",
      "capability",
      "what does he do",
      "what do you do"
    )
  ) {
    return {
      navigate,
      reply: `Ali provides full-stack product engineering. ${capabilities
        .map((c) => c.title.replace(/\.$/, "") + ": " + c.body)
        .join(" ")} Typical work is Next.js, React Native, Node.js, FastAPI, payments, real-time features and AI agents.`,
    };
  }

  if (has(q, "ai", "openai", "llm", "agent", "gpt", "anthropic")) {
    return {
      navigate: "#work",
      reply: `Ali builds AI into production products: live video analytics, agent workflows and LLM integrations on OpenAI and Anthropic, with FastAPI and Node backends. His AI Surveillance System is a live dashboard for helmet compliance, line-crossing and inspection detection. I am scrolling you to his Work section.`,
    };
  }

  if (has(q, "stack", "tech", "skill", "skills", "next", "react", "node")) {
    const groups = skills
      .map((g) => `${g.group}: ${g.items.join(", ")}`)
      .join(". ");
    return {
      navigate,
      reply: `His core stack is Next.js, React Native, Node.js, FastAPI and TypeScript. ${groups}.`,
    };
  }

  if (
    has(
      q,
      "experience",
      "years",
      "career",
      "job",
      "wisdom",
      "jarvis",
      "cyber"
    )
  ) {
    const roles = experience
      .map(
        (r) =>
          `${r.title} at ${r.company} (${r.period})${r.current ? ", current" : ""}`
      )
      .join("; ");
    return {
      navigate,
      reply: `Ali has ${profile.years} years as a ${profile.role}. His roles: ${roles}. He ships web and mobile products with React, Next.js and React Native, including APIs, payments, push notifications and real-time features. I am taking you to the Experience section.`,
    };
  }

  if (has(q, "email", "contact", "reach", "phone", "linkedin")) {
    return {
      navigate,
      reply: `You can reach Ali at ${profile.email} or ${profile.phone}. LinkedIn is ${profile.linkedin}. GitHub is ${profile.github}. Tell him who you are and what you need.`,
    };
  }

  if (has(q, "where", "location", "lahore", "based", "educat", "university", "degree")) {
    return {
      navigate: null,
      reply: `Ali is based in ${profile.location}. He studied ${education.degree} at ${education.school} (${education.period}).`,
    };
  }

  return {
    navigate: null,
    reply: `Ali is a ${profile.role} in ${profile.location} with ${profile.years} years shipping web, mobile and AI products. He offers architecture, full-stack builds and AI integration, and has shipped Tasky, ReminderLink and an AI Surveillance System. Ask about projects, services or experience — or email ${profile.email}.`,
  };
}

const GROQ_MODELS = [
  process.env.GROQ_MODEL?.trim(),
  "openai/gpt-oss-20b",
  "openai/gpt-oss-120b",
].filter((m): m is string => Boolean(m));

export async function groqReply(
  message: string,
  sessionId: string
): Promise<AgentAnswer | null> {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) return null;

  const history = memory.get(sessionId) ?? [];
  const messages = [
    { role: "system", content: SYSTEM },
    ...history,
    { role: "user", content: message },
  ];

  for (const model of GROQ_MODELS) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        messages,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      console.error("[chat] Groq responded", res.status, "for", model);
      continue;
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) continue;

    remember(sessionId, { role: "user", content: message });
    remember(sessionId, { role: "assistant", content: reply });
    return { reply, navigate: sectionForQuestion(message) };
  }

  return null;
}
