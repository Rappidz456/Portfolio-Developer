import Reveal from "./Reveal";
import HighlightText from "./HighlightText";
import CardArt from "./CardArt";
import { Badge, Container, DisplayHeading, Glow, Section, TagList } from "./ui";
import { capabilities, type Capability } from "@/lib/data";
import { cn } from "@/lib/utils";

const OFFSETS = ["xl:mt-0", "xl:mt-16", "xl:mt-32"];

function CapabilityCard({
  item,
  index,
}: {
  item: Capability;
  index: number;
}) {
  return (
    <Reveal
      as="article"
      delay={index * 0.08}
      className={cn(
        "glass group rounded-2xl p-3 transition-transform duration-500 hover:-translate-y-1.5",
        OFFSETS[index]
      )}
    >
      <CardArt kind={item.art} />

      <div className="px-2 pb-2 pt-5">
        <div className="flex items-baseline gap-3">
          <span className="eyebrow text-amber/80">{item.index}</span>
          <h3 className="cond text-lg text-cream sm:text-xl">{item.title}</h3>
        </div>

        <p className="micro mt-3 text-cream/60">{item.body}</p>

        <TagList items={item.tags} className="mt-5" />
      </div>
    </Reveal>
  );
}

export default function Capabilities({
  items = capabilities,
}: {
  items?: Capability[];
}) {
  return (
    <Section id="about" tone="ink">
      <Glow
        className="inset-x-0 -top-40 h-80"
        shape="60% 100% at 50% 0%"
        color="rgba(217,155,60,0.16)"
      />

      <Container>
        <Reveal className="text-center">
          <Badge>What I actually do</Badge>
        </Reveal>

        <Reveal delay={0.05}>
          <DisplayHeading size="about" className="mt-7 text-center">
            From idea.
            <br />
            To production.
          </DisplayHeading>
        </Reveal>

        <HighlightText
          className="cond mx-auto mt-9 max-w-4xl px-1 text-center text-[clamp(1.15rem,0.7rem+1.8vw,2.6rem)] leading-snug text-cream lg:mt-12 lg:leading-[1.16]"
          text="I design and deliver scalable web and cross-platform applications for production environments — leading the work from architecture and implementation through deployment and continuous improvement, so teams ship faster without trading away reliability."
        />

        <div className="mt-16 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:mt-20 lg:mt-24 xl:grid-cols-3 xl:gap-8 xl:pb-32">
          {items.map((item, i) => (
            <CapabilityCard key={item.index} item={item} index={i} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
