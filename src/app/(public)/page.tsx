import { LoadingScreen } from "@/components/public/loading-screen";
import { Navbar } from "@/components/public/navbar";
import { Hero } from "@/components/public/hero";
import { About } from "@/components/public/about";
import { Services } from "@/components/public/services";
import { Statistics } from "@/components/public/statistics";
import { Skills } from "@/components/public/skills";
import { Portfolio } from "@/components/public/portfolio";
import { Testimonials } from "@/components/public/testimonials";
import { Experience } from "@/components/public/experience";
import { Contact } from "@/components/public/contact";
import { Footer } from "@/components/public/footer";

export default function HomePage() {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main className="flex-grow">
        <section id="home">
          <Hero />
        </section>
        <About />
        <Services />
        <Statistics />
        <Skills />
        <Portfolio />
        <Testimonials />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
