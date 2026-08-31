import Reveal from "./Reveal";
import {
  Badge,
  Container,
  DisplayHeading,
  Section,
  TagList,
} from "./ui";
import {
  education as defaultEducation,
  skills as defaultSkills,
  type Education,
  type SkillGroup,
} from "@/lib/data";
import { padIndex } from "@/lib/utils";

function SkillGroupCard({
  group,
  index,
}: {
  group: SkillGroup;
  index: number;
}) {
  return (
    <Reveal
      delay={index * 0.05}
      className="group bg-white/[0.025] p-6 backdrop-blur-md transition-colors duration-500 hover:bg-white/[0.06] lg:p-8"
    >
      <div className="flex items-baseline gap-3">
        <span className="eyebrow text-amber/70">{padIndex(index + 1)}</span>
        <h3 className="cond text-lg text-cream">{group.group}</h3>
      </div>

      <TagList
        as="ul"
        items={group.items}
        className="mt-5"
        tagClassName="bg-white/3 px-2.5 py-1.5 text-[11px] tracking-normal transition-colors duration-300 group-hover:border-cream/20 group-hover:text-cream/75"
      />
    </Reveal>
  );
}

export default function Skills({
  groups = defaultSkills,
  edu = defaultEducation,
}: {
  groups?: SkillGroup[];
  edu?: Education;
}) {
  return (
    <Section id="skills" tone="ink" padding="compact">
      <Container>
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Badge>The toolkit</Badge>
            <DisplayHeading size="compact" className="mt-6">
              What I build with.
            </DisplayHeading>
          </div>

          <div className="glass w-full rounded-xl p-5 md:max-w-xs">
            <span className="eyebrow text-cream/45">Education</span>
            <p className="cond mt-2 text-xl text-cream">{edu.school}</p>
            <p className="micro mt-1 text-cream/45">{edu.degree}</p>
            <p className="micro mt-2 text-amber/70">
              {edu.period} — {edu.location}
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-cream/10 bg-cream/10 sm:grid-cols-2 lg:mt-20 xl:grid-cols-3">
          {groups.map((group, i) => (
            <SkillGroupCard key={group.group} group={group} index={i} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
