import Image from "next/image";
import Reveal from "./Reveal";
import ProjectVisual from "./ProjectVisual";
import {
  Badge,
  ButtonLink,
  Container,
  DisplayHeading,
  Glow,
  PointList,
  Section,
  TagList,
} from "./ui";
import { projects, type Project } from "@/lib/data";
import { cn, padIndex } from "@/lib/utils";

function ProjectLogo({ project }: { project: Project }) {
  if (!project.logo) return null;
  const { logo, name } = project;

  return (
    <span
      className={cn(
        "glass flex items-center justify-center",
        logo.rounded ? "rounded-2xl p-2" : "rounded-xl px-3.5 py-3"
      )}
    >
      <Image
        src={logo.src}
        alt={`${name} logo`}
        width={logo.width}
        height={logo.height}
        className={
          logo.rounded
            ? "h-12 w-12 rounded-xl object-cover"
            : "h-6 w-auto object-contain"
        }
      />
    </span>
  );
}

function ProjectCopy({ project, index }: { project: Project; index: number }) {
  const flipped = index % 2 === 1;

  return (
    <div className={cn("xl:col-span-5", flipped && "xl:order-1")}>
      <div className="flex flex-wrap items-center gap-4">
        <ProjectLogo project={project} />
        {project.href && (
          <Badge live variant="outline">
            Live
          </Badge>
        )}
      </div>

      <span className="eyebrow mt-6 block text-amber/80">
        {padIndex(index + 1)} — {project.year}
      </span>

      <h3 className="display mt-3 max-w-full text-[clamp(2.15rem,6vw+0.6rem,3.4rem)] leading-none text-cream">
        {project.name}
      </h3>
      <p className="cond mt-2 text-base text-cream/70 sm:text-lg md:text-xl">{project.kind}</p>

      <p className="mt-5 text-sm leading-relaxed text-cream/55">{project.blurb}</p>

      {project.stats && (
        <dl className="mt-7 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-cream/10 bg-cream/10">
          {project.stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/[0.03] px-2 py-3 backdrop-blur-md sm:px-3 sm:py-3.5"
            >
              <dt className="eyebrow truncate text-cream/40">{stat.label}</dt>
              <dd className="cond mt-1 text-base text-cream sm:text-lg">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <PointList items={project.points} className="mt-7" />
      <TagList items={project.stack} className="mt-7" />

      {project.href && (
        <ButtonLink
          href={project.href}
          external
          size="compact"
          className="mt-8"
        >
          Visit {project.hrefLabel} ↗
        </ButtonLink>
      )}
    </div>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const flipped = index % 2 === 1;

  return (
    <Reveal
      as="article"
      className="grid grid-cols-1 items-center gap-8 sm:gap-10 xl:grid-cols-12 xl:gap-14"
    >
      <div className={cn("xl:col-span-7", flipped && "xl:order-2")}>
        <ProjectVisual project={project} />
      </div>
      <ProjectCopy project={project} index={index} />
    </Reveal>
  );
}

export default function Projects({
  items = projects,
}: {
  items?: Project[];
}) {
  return (
    <Section id="work">
      <Glow
        className="left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2"
        color="rgba(217,155,60,0.16)"
        falloff="66%"
        blur={60}
      />

      <Container>
        <Reveal className="text-center">
          <Badge>Selected work</Badge>
          <DisplayHeading size="work" className="mt-6">
            Things I built
            <br />
            and shipped.
          </DisplayHeading>
        </Reveal>

        <div className="mt-20 space-y-24 md:mt-24 lg:mt-28 lg:space-y-32">
          {items.map((project, i) => (
            <ProjectRow key={project.id} project={project} index={i} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
