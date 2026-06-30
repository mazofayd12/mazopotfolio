"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/shared/brand-icons";
import Link from "next/link";

const categories = [
  "All",
  "UI/UX",
  "Websites",
  "WordPress",
  "Flutter",
  "Branding",
  "Video Editing",
  "IoT",
  "Embedded Systems",
];

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
    coverColor: "from-purple-900 to-indigo-950",
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
    coverColor: "from-blue-900 to-cyan-950",
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
    coverColor: "from-emerald-900 to-teal-950",
    coverImage: "",
  },
  {
    id: "4",
    title: "Cross-Platform Delivery App",
    slug: "delivery-app",
    category: "Flutter",
    description: "On-demand hyper-local delivery mobile application with real-time tracking, customer chat, and Google Maps integration.",
    technologies: ["Flutter", "Dart", "Firebase", "Google Maps API"],
    projectUrl: "#",
    githubUrl: "#",
    coverColor: "from-rose-900 to-pink-950",
    coverImage: "",
  },
  {
    id: "5",
    title: "Corporate Brand Identity",
    slug: "brand-identity",
    category: "Branding",
    description: "Complete visual rebranding including logo system, color systems, typography guidelines, and corporate business stationary.",
    technologies: ["Adobe Illustrator", "Brand Guide", "Typography", "Vector"],
    projectUrl: "#",
    githubUrl: "#",
    coverColor: "from-amber-900 to-orange-950",
    coverImage: "",
  },
  {
    id: "6",
    title: "Cinematic Product Promo",
    slug: "product-promo",
    category: "Video Editing",
    description: "Highly engaging video advertisement showcasing modern consumer electronics with dynamic 3D transitions and color grading.",
    technologies: ["Premiere Pro", "After Effects", "Color Grading", "DaVinci"],
    projectUrl: "#",
    githubUrl: "#",
    coverColor: "from-red-900 to-rose-950",
    coverImage: "",
  },
];

export function Portfolio({ projects = sampleProjects }: { projects?: any[] }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter(project => project.category === activeCategory);

  return (
    <section id="portfolio" className="relative py-24 md:py-32">
      <div className="container mx-auto px-4">
        <SectionHeader
          overline="My Portfolio"
          title="Featured Work"
          subtitle="Explore some of my latest digital designs, software developments, branding projects, and hardware inventions."
        />

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full px-5 py-2.5 transition-all duration-300 border-white/[0.06] text-xs font-semibold",
                activeCategory === category
                  ? "bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-lg shadow-primary/25"
                  : "bg-white/[0.02] text-muted hover:text-foreground hover:bg-white/[0.06]"
              )}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={project.id}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.01] transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full"
              >
                {/* Visual Cover */}
                <div className={cn(
                  "relative aspect-video w-full overflow-hidden flex items-center justify-center bg-gradient-to-br",
                  project.coverImage ? "" : (project.coverColor || "from-purple-900 to-indigo-950")
                )}>
                  {project.coverImage ? (
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <>
                      {/* Glassmorphic Project Logo/Initial */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent)] pointer-events-none" />
                      <span className="font-heading text-xl md:text-2xl font-bold tracking-wider text-white/40 group-hover:scale-110 transition-transform duration-500 p-6 text-center">
                        {project.title.split(" ").slice(0, 2).join(" ")}
                      </span>
                      
                      {/* Subtle Grid Pattern Overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                    </>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-secondary-light">
                        {project.category}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary-light transition-colors duration-300">
                      {project.title}
                    </h3>

                    <p className="text-sm text-muted line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-6 space-y-4">
                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {(project.technologies || []).map((tech: string) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="bg-white/[0.03] text-muted-foreground border-white/[0.04] text-[10px] py-0.5 px-2 font-medium"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center text-xs font-semibold text-primary-light hover:text-white transition-colors gap-1 group/btn"
                      >
                        Details
                        <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
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
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-16 text-center">
          <Link href="/projects">
            <Button
              variant="outline"
              className="rounded-full px-8 py-6 border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.04] transition-all gap-2 font-semibold text-sm group/all"
            >
              View All Projects
              <ArrowRight className="h-4 w-4 group-hover/all:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
