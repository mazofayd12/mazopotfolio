"use client";

import { motion } from "motion/react";
import { SectionHeader } from "@/components/shared/section-header";
import {
  Palette,
  Code,
  Globe,
  Video,
  Sparkles,
  Cpu,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Creating intuitive, beautiful interfaces with research-driven design thinking that puts users first and drives engagement.",
    color: "from-violet-500 to-purple-500",
    glowColor: "group-hover:shadow-violet-500/20",
  },
  {
    icon: Code,
    title: "Web Development",
    description:
      "Building fast, scalable web applications with Next.js, React, and modern technologies that deliver exceptional performance.",
    color: "from-blue-500 to-cyan-500",
    glowColor: "group-hover:shadow-blue-500/20",
  },
  {
    icon: Globe,
    title: "WordPress Development",
    description:
      "Custom WordPress themes and plugins with optimized performance, SEO-ready architecture, and stunning visual design.",
    color: "from-emerald-500 to-teal-500",
    glowColor: "group-hover:shadow-emerald-500/20",
  },
  {
    icon: Video,
    title: "Video Editing",
    description:
      "Professional motion graphics, video production and editing using Adobe Premiere Pro, After Effects, and DaVinci Resolve.",
    color: "from-rose-500 to-pink-500",
    glowColor: "group-hover:shadow-rose-500/20",
  },
  {
    icon: Sparkles,
    title: "Brand Identity",
    description:
      "Complete branding packages including logos, color systems, typography, and brand guidelines that tell your unique story.",
    color: "from-amber-500 to-orange-500",
    glowColor: "group-hover:shadow-amber-500/20",
  },
  {
    icon: Cpu,
    title: "Embedded Systems",
    description:
      "Designing firmware and hardware solutions with Arduino, ESP32, Raspberry Pi, and custom PCBs for specialized applications.",
    color: "from-cyan-500 to-blue-500",
    glowColor: "group-hover:shadow-cyan-500/20",
  },
  {
    icon: Home,
    title: "Smart Home Solutions",
    description:
      "IoT ecosystems and home automation systems integrating sensors, actuators, and cloud platforms for connected living.",
    color: "from-indigo-500 to-violet-500",
    glowColor: "group-hover:shadow-indigo-500/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-secondary/5 blur-[200px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          overline="Services"
          title="What I Do"
          subtitle="From design to development to deployment — I offer end-to-end digital solutions that help businesses grow and succeed."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-500",
                  "hover:border-white/[0.12] hover:bg-white/[0.04] hover:scale-[1.02]",
                  `hover:shadow-2xl ${service.glowColor}`
                )}
              >
                {/* Gradient hover glow */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div
                    className={cn(
                      "absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-20 blur-3xl",
                      service.color
                    )}
                  />
                </div>

                <div className="relative z-10">
                  <div
                    className={cn(
                      "mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-transform duration-500 group-hover:scale-110",
                      service.color
                    )}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                    {service.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
