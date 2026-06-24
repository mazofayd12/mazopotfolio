import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { GithubIcon } from "@/components/shared/brand-icons";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProjectDetailsProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailsProps) {
  const { slug } = await params;

  const sampleProjects = [
    {
      id: "ecommerce-luxury",
      title: "E-Commerce Luxury Platform",
      slug: "ecommerce-luxury",
      category: "Websites",
      description: "Premium clothing line storefront with interactive animations, payment gateway integrations, and client administration dashboard.",
      content: "<p>This is a complete luxury e-commerce platform built from the ground up to offer users a premium, visual-heavy shopping experience. Featuring fluid framer-motion animations, stripe custom checkouts, and a secure backend CMS for managing the inventory, discounts, and customer shipments.</p><h3>Key Features</h3><ul><li>Custom shopping cart with local-storage sync.</li><li>Interactive product showcases with 3D-like hover effects.</li><li>Full administrator dashboard with product CRUD, sales chart logs, and inventory controls.</li></ul>",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "Stripe"],
      projectUrl: "https://stripe.com",
      githubUrl: "https://github.com",
      clientName: "Aura Apparel",
      completionDate: "October 2025",
      coverImage: "",
    },
    {
      id: "smart-home-hub",
      title: "Smart Home Automation Hub",
      slug: "smart-home-hub",
      category: "IoT",
      description: "Centralized IoT platform designed for controlling smart lights, thermostats, and security locks via a custom ESP32 network.",
      content: "<p>A smart home solution designed to integrate multiple custom micro-controllers (ESP32) into a unified local network. Utilizing MQTT protocol for ultra-low latency commands, the system allows the homeowner to schedule automations, audit security logs, and control home temperature from a responsive dashboard.</p><h3>Key features</h3><ul><li>ESP32 based micro-controller firmware.</li><li>WebSockets & MQTT communication channel for real-time status.</li><li>High efficiency local dashboard optimized for tablet display.</li></ul>",
      technologies: ["React", "Node.js", "ESP32", "MQTT", "C++"],
      projectUrl: "https://arduino.cc",
      githubUrl: "https://github.com",
      clientName: "SmartLife Systems",
      completionDate: "December 2025",
      coverImage: "",
    },
  ];

  let dbProject: any = null;
  try {
    dbProject = await prisma.project.findFirst({
      where: { slug, published: true },
    });
  } catch (error) {
    console.error("Database query failed in ProjectDetailPage:", error);
  }

  const project = dbProject || sampleProjects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-24 min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Breadcrumb / Back Link */}
          <Link
            href="/projects"
            className="inline-flex items-center text-xs font-semibold text-primary-light hover:text-white transition-colors gap-1.5 mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
          </Link>

          <div className="grid gap-10 lg:grid-cols-12">
            {/* Main Content Area (Col 8) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Category Badge */}
              <Badge className="bg-primary/20 text-primary-light border-primary/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {project.category}
              </Badge>

              {/* Title */}
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                {project.title}
              </h1>

              {/* Description */}
              <p className="text-lg text-muted leading-relaxed">
                {project.description}
              </p>

              {/* Cover Placeholder Grid */}
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-indigo-950/40 to-background flex items-center justify-center p-8">
                <span className="font-heading text-xl font-semibold tracking-wider text-white/20">
                  Visual Showcase
                </span>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01),transparent)] pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
              </div>

              {/* Long Description Content */}
              {project.content && (
                <div
                  className="prose prose-invert max-w-none text-muted space-y-4 pt-4 border-t border-white/[0.05]"
                  dangerouslySetInnerHTML={{ __html: project.content }}
                />
              )}
            </div>

            {/* Sidebar Details Area (Col 4) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 glass border-white/[0.05] bg-white/[0.01] rounded-2xl space-y-6 sticky top-24">
                <h3 className="font-heading text-lg font-bold text-foreground pb-3 border-b border-white/[0.05]">
                  Project Specifications
                </h3>

                <div className="space-y-4 text-sm">
                  {project.clientName && (
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-muted flex items-center gap-1.5 shrink-0">
                        <User className="h-4 w-4 text-primary" /> Client:
                      </span>
                      <span className="font-semibold text-foreground-light text-right">
                        {project.clientName}
                      </span>
                    </div>
                  )}

                  {project.completionDate && (
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-muted flex items-center gap-1.5 shrink-0">
                        <Calendar className="h-4 w-4 text-primary" /> Date:
                      </span>
                      <span className="font-semibold text-foreground-light text-right">
                        {project.completionDate instanceof Date
                          ? project.completionDate.toLocaleDateString("en-US", { year: "numeric", month: "long" })
                          : String(project.completionDate)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-start gap-4">
                    <span className="text-muted flex items-center gap-1.5 shrink-0">
                      <Tag className="h-4 w-4 text-primary" /> Type:
                    </span>
                    <span className="font-semibold text-foreground-light text-right">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="space-y-3 pt-4 border-t border-white/[0.04]">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(project.technologies) ? project.technologies : []).map((tech: string) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-white/[0.03] text-muted border-white/[0.04]"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Project Links */}
                <div className="pt-6 border-t border-white/[0.04] space-y-3">
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full h-11 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl gap-2 shadow-lg shadow-primary/10">
                        Visit Live Website
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block"
                    >
                      <Button
                        variant="outline"
                        className="w-full h-11 border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.04] text-foreground rounded-xl gap-2"
                      >
                        Source Code
                        <GithubIcon className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
