export type AgentSection =
  | "#work"
  | "#experience"
  | "#skills"
  | "#about"
  | "#contact";

function has(q: string, ...needles: string[]) {
  return needles.some((n) => q.includes(n));
}

/** Map a visitor question to the page section they should see. */
export function sectionForQuestion(message: string): AgentSection | null {
  const q = message.toLowerCase();

  if (
    has(
      q,
      "project",
      "projects",
      "built",
      "build",
      "developed",
      "shipped",
      "portfolio",
      "case stud",
      "tasky",
      "reminder",
      "surveillance",
      "marketplace",
      "app store"
    )
  ) {
    return "#work";
  }

  if (
    has(
      q,
      "experience",
      "experiences",
      "career",
      "job",
      "jobs",
      "role",
      "roles",
      "company",
      "companies",
      "wisdom",
      "jarvis",
      "cyber advance",
      "worked"
    )
  ) {
    return "#experience";
  }

  if (
    has(
      q,
      "service",
      "services",
      "offer",
      "provide",
      "capability",
      "capabilities",
      "what do you do",
      "what does he do",
      "what can he"
    )
  ) {
    return "#about";
  }

  if (has(q, "skill", "skills", "stack", "tech", "technolog", "tools")) {
    return "#skills";
  }

  if (
    has(
      q,
      "contact",
      "email",
      "reach",
      "hire",
      "available",
      "open to",
      "phone",
      "linkedin"
    )
  ) {
    return "#contact";
  }

  return null;
}

export function scrollToSection(hash: AgentSection) {
  const el = document.querySelector(hash);
  if (!(el instanceof HTMLElement)) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}
