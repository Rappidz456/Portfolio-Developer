import {
  capabilities,
  education,
  experience,
  profile,
  projects,
  skills,
} from "./data";

/**
 * Serializes the portfolio into the agent's knowledge base.
 * Derived from `data.ts` so it stays current when a project or role is added.
 */
function build(): string {
  const lines: string[] = [];

  lines.push("## Profile");
  lines.push(
    `${profile.name} — ${profile.role}, based in ${profile.location}. ${profile.years} years of experience. Open to work.`
  );
  lines.push(profile.summary);
  lines.push(
    `Contact: ${profile.email} · ${profile.phone} · LinkedIn ${profile.linkedin} · GitHub ${profile.github} · Résumé ${profile.resumeHref}`
  );

  lines.push("\n## Services he provides");
  lines.push(
    "Ali offers full-stack product engineering: system architecture, end-to-end web and mobile builds, and AI integration. Typical work includes scalable Next.js / React Native apps, REST APIs, auth, payments, push notifications, real-time features, CI/CD, and LLM / agent workflows."
  );
  for (const c of capabilities) {
    lines.push(`- ${c.title} ${c.body} Tags: ${c.tags.join(", ")}`);
  }

  lines.push("\n## Experience");
  for (const role of experience) {
    lines.push(
      `\n### ${role.title} — ${role.company}, ${role.location} (${role.period})${
        role.current ? " [current role]" : ""
      }`
    );
    for (const point of role.points) lines.push(`- ${point}`);
  }

  lines.push("\n## Projects he has developed");
  for (const p of projects) {
    lines.push(`\n### ${p.name} — ${p.kind} (${p.year})`);
    lines.push(p.blurb);
    for (const point of p.points) lines.push(`- ${point}`);
    lines.push(`Stack: ${p.stack.join(", ")}`);
    if (p.href) lines.push(`Live: ${p.href}`);
    if (p.stats) {
      lines.push(
        `Stats: ${p.stats.map((s) => `${s.label} ${s.value}`).join(" · ")}`
      );
    }
  }

  lines.push("\n## Skills");
  for (const group of skills) {
    lines.push(`- ${group.group}: ${group.items.join(", ")}`);
  }

  lines.push("\n## Education");
  lines.push(
    `${education.degree}, ${education.school}, ${education.location} (${education.period})`
  );

  lines.push("\n## Page sections");
  lines.push(
    "Work / projects: #work. Services / what he does: #about. Experience: #experience. Skills: #skills. Contact: #contact."
  );

  return lines.join("\n");
}

/** Built once per server process — the source data is static. */
export const agentContext = build();
