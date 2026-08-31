import Reveal from "./Reveal";
import {
  Badge,
  Container,
  DisplayHeading,
  PointList,
  Section,
} from "./ui";
import { experience, type Role } from "@/lib/data";

function RoleRow({ role, index }: { role: Role; index: number }) {
  return (
    <Reveal
      as="article"
      delay={index * 0.06}
      className="group grid grid-cols-1 gap-5 border-t border-cream/10 py-8 transition-colors duration-500 hover:border-cream/25 md:grid-cols-12 md:gap-6 md:py-9 lg:gap-10 lg:py-12"
    >
      <div className="md:col-span-4 lg:col-span-2">
        <span className="eyebrow text-cream/35">{role.period}</span>
        {role.current && (
          <span className="eyebrow mt-3 flex items-center gap-2 text-cream/70">
            <span className="dot dot-live" />
            Current
          </span>
        )}
      </div>

      <div className="md:col-span-8 lg:col-span-4">
        <h3 className="display text-cream text-[clamp(1.6rem,4vw,2.25rem)] leading-none transition-transform duration-500 group-hover:translate-x-1">
          {role.company}
        </h3>
        <p className="cond mt-2 text-lg text-amber/90">{role.title}</p>
        <p className="micro mt-1 text-cream/35">{role.location}</p>
      </div>

      <PointList items={role.points} muted className="md:col-span-12 lg:col-span-6" />
    </Reveal>
  );
}

export default function Experience({
  roles = experience,
}: {
  roles?: Role[];
}) {
  return (
    <Section id="experience" tone="ink" padding="compact">
      <Container>
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Badge>Where I have been</Badge>
            <DisplayHeading size="section" className="mt-6">
              Four years.
              <br />
              Three teams.
            </DisplayHeading>
          </div>
          <p className="micro max-w-xs text-cream/55">
            Production web and mobile work, from feature delivery to architecture
            and release ownership.
          </p>
        </Reveal>

        <div className="mt-16 lg:mt-24">
          {roles.map((role, i) => (
            <RoleRow key={role.company} role={role} index={i} />
          ))}
          <div className="border-t border-cream/10" />
        </div>
      </Container>
    </Section>
  );
}
