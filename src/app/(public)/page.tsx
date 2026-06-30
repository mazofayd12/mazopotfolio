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
  let settingsMap: Record<string, string> = {};
  
  try {
    dbProjects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Database query failed in HomePage projects fetch:", error);
  }

  try {
    const settings = await prisma.siteSettings.findMany();
    settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error("Database query failed in HomePage settings fetch:", error);
  }

  const projects = dbProjects.length > 0 ? dbProjects : undefined;

  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main className="flex-grow">
        <section id="home">
          <Hero settings={settingsMap} />
        </section>
        <About settings={settingsMap} />
        <Services />
        <Statistics />
        <Skills />
        <Portfolio projects={projects} />
        <Testimonials />
        <Experience />
        <Contact settings={settingsMap} />
      </main>
      <Footer settings={settingsMap} />
    </>
  );
}
