import { profile } from "@/lib/data";
import { Container, Glow, TextLink } from "./ui";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <Container className="page-x">
        <div className="hairline flex flex-col gap-4 py-8 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <span className="micro text-cream/35">
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span className="micro text-cream/35">
            {profile.location} — {profile.role}
          </span>
          <TextLink href="#top" className="self-center md:self-auto">
            Back to top ↑
          </TextLink>
        </div>
      </Container>

      <div className="relative z-10 -mb-[2vw] select-none overflow-hidden">
        <Glow
          className="inset-x-0 bottom-0 h-[70%]"
          shape="70% 100% at 50% 100%"
          color="rgba(217,155,60,0.22)"
          blur={30}
        />
        <h2
          aria-label={profile.name}
          className="display wordmark-fade relative whitespace-nowrap text-center text-[clamp(3.25rem,22vw,23vw)] leading-[0.78] tracking-[-0.02em]"
        >
          {profile.wordmark}
        </h2>
      </div>
    </footer>
  );
}
