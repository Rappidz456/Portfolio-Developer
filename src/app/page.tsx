import Nav from "@/components/Nav";
import Backdrop from "@/components/Backdrop";
import Hero from "@/components/Hero";
import Capabilities from "@/components/Capabilities";
import Marquee from "@/components/Marquee";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Backdrop />
      <Nav />
      <main>
        <Hero />
        <Capabilities />
        <Marquee />
        <Projects />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
