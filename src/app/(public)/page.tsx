import { prisma } from "@/lib/prisma";
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

export default async function HomePage() {
  let dbProjects: any[] = [];
  try {
    dbProjects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 6,
    });
  } catch (error) {
    console.error("Database query failed in HomePage:", error);
  }

  const projects = dbProjects.length > 0 ? dbProjects : undefined;

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
        <Portfolio projects={projects} />
        <Testimonials />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
