import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { GithubIcon } from "@/components/shared/brand-icons";
import Link from "next/link";

// Server component to list all published projects
export default async function ProjectsPage() {
  let dbProjects: any[] = [];
  try {
    dbProjects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Database query failed in ProjectsPage:", error);
  }

  // Fallback to sample data if db is empty
  const sampleProjects = [
    {
      id: "1",
      title: "E-Commerce Luxury Platform",
      slug: "ecommerce-luxury",
      category: "Websites",
      description: "Premium clothing line storefront with interactive animations, payment gateway integrations, and client administration dashboard.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "Stripe"],
      projectUrl: "#",
      githubUrl: "#",
      coverImage: "",
    },
    {
      id: "2",
      title: "Smart Home Automation Hub",
      slug: "smart-home-hub",
      category: "IoT",
      description: "Centralized IoT platform designed for controlling smart lights, thermostats, and security locks via a custom ESP32 network.",
      technologies: ["React", "Node.js", "ESP32", "MQTT", "C++"],
      projectUrl: "#",
      githubUrl: "#",
      coverImage: "",
    },
    {
      id: "3",
      title: "Modern Banking App UI",
      slug: "modern-banking-ui",
      category: "UI/UX",
      description: "High-fidelity UX design & prototype for a neobank application featuring sleek dark mode, micro-interactions, and visual data logs.",
      technologies: ["Figma", "Design System", "Prototyping", "User Testing"],
      projectUrl: "#",
      githubUrl: "#",
      coverImage: "",
    },
  ];

  const displayProjects = dbProjects.length > 0 ? dbProjects : sampleProjects;

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-24 min-h-screen">
        {/* Hero Section */}
        <div className="relative py-20 overflow-hidden border-b border-white/[0.06] bg-gradient-to-b from-primary/5 to-transparent">
          <div className="absolute inset-0 mesh-gradient opacity-30 pointer-events-none" />
          <div className="container mx-auto px-4 text-center space-y-4">
            <Link
              href="/#portfolio"
              className="inline-flex items-center text-xs font-semibold text-primary-light hover:text-white transition-colors gap-1.5 mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              All <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-muted max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Explore the complete collection of my software engineering applications, visual UI/UX designs, custom brand packages, and IoT hardware installations.
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="container mx-auto px-4 py-16">
          {displayProjects.length === 0 ? (
            <div className="text-center py-20 glass border-white/[0.05] rounded-2xl max-w-lg mx-auto">
              <p className="text-muted font-medium">No projects published yet.</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {displayProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.01] transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full"
                >
                  {/* Image/Gradient Cover */}
                  <div className="relative aspect-video w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-950 to-background border-b border-white/[0.04]">
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <>
                        <span className="font-heading text-lg md:text-xl font-bold tracking-wider text-white/30 group-hover:scale-110 transition-transform duration-500 p-6 text-center">
                          {project.title.split(" ").slice(0, 2).join(" ")}
                        </span>
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                      </>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div className="space-y-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-secondary-light">
                        {project.category}
                      </span>
                      <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary-light transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="mt-6 space-y-4">
                      {/* Tech Badges */}
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(project.technologies) ? project.technologies : []).map((tech: string) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="bg-white/[0.02] text-muted border-white/[0.04] text-[10px]"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="text-xs font-semibold text-primary-light hover:text-white transition-colors"
                        >
                          View Case Study →
                        </Link>
                        <div className="flex items-center gap-3">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted hover:text-white transition-colors"
                            >
                              <GithubIcon className="h-4.5 w-4.5" />
                            </a>
                          )}
                          {project.projectUrl && (
                            <a
                              href={project.projectUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted hover:text-white transition-colors"
                            >
                              <ExternalLink className="h-4.5 w-4.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
