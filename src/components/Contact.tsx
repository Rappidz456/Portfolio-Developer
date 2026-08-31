import Reveal from "./Reveal";
import Atmosphere from "./Atmosphere";
import {
  Badge,
  ButtonLink,
  Container,
  DisplayHeading,
  Section,
  TextLink,
} from "./ui";
import { outbound, profile } from "@/lib/data";

export default function Contact() {
  return (
    <Section id="contact" padding="contact">
      <Atmosphere intensity={0.75} />

      <Container className="text-center">
        <Reveal>
          <Badge live>Available for work</Badge>
        </Reveal>

        <Reveal delay={0.05}>
          <DisplayHeading size="contact" className="glow-text mt-8">
            Let&apos;s build
            <br />
            something.
          </DisplayHeading>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href={`mailto:${profile.email}`}
            className="cond link-underline mt-8 inline-block max-w-full px-1 text-[clamp(0.95rem,2vw+0.55rem,2.25rem)] break-all text-cream/85 transition-colors hover:text-cream sm:mt-10 sm:break-normal"
          >
            {profile.email}
          </a>
        </Reveal>

        <Reveal
          delay={0.15}
          className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center"
        >
          <ButtonLink href={`mailto:${profile.email}`} glow className="w-full sm:w-auto">
            Send an email
          </ButtonLink>
          <ButtonLink href={profile.phoneHref} variant="ghost" className="w-full sm:w-auto">
            {profile.phone}
          </ButtonLink>
        </Reveal>

        <Reveal
          delay={0.2}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {outbound.map((link) => (
            <TextLink key={link.label} href={link.href} external>
              {link.label} ↗
            </TextLink>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
