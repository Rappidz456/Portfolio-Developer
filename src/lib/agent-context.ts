import {
  capabilities,
  education,
  experience,
  profile,
  projects,
  skills,
} from "./data";

/**
 * Serializes the portfolio content into a compact knowledge base that is sent
 * to the n8n agent with every message. Keeping it derived from `data.ts` means
 * the agent never goes stale when a project or role is added — there is no
 * second copy of the profile to maintain inside n8n.
 */
function build(): string {
  const lines: string[] = [];

  lines.push("## Profile");
  lines.push(
    `${profile.name} — ${profile.role}, based in ${profile.location}. ${profile.years} years of experience.`
  );
  lines.push(profile.summary);
  lines.push(
    `Contact: ${profile.email} · ${profile.phone} · LinkedIn ${profile.linkedin} · GitHub ${profile.github} · Résumé ${profile.resumeHref}`
  );

  lines.push("\n## What he does");
  for (const c of capabilities) {
    lines.push(`- ${c.title} ${c.body} (${c.tags.join(", ")})`);
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

  lines.push("\n## Projects");
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

  return lines.join("\n");
}

/** Built once per server process — the source data is static. */
export const agentContext = build();
