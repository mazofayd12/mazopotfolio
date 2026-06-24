"use client";

import { motion } from "motion/react";
import { SectionHeader } from "@/components/shared/section-header";
import { Briefcase, Calendar, MapPin } from "lucide-react";

const experiences = [
  {
    year: "2023 - Present",
    title: "Lead Full-Stack Developer",
    company: "AiMazo Apps",
    location: "Remote / Dubai",
    dateRange: "Jan 2023 - Present",
    description: "Architecting and building production-ready Next.js web applications, design systems, and cross-platform mobile products. Integrated custom IoT hardware networks utilizing ESP32 controllers. Managed clients and led product direction.",
  },
  {
    year: "2021 - 2023",
    title: "Senior Product Designer & Web Engineer",
    company: "Digital Studio Freelance",
    location: "Remote",
    dateRange: "Mar 2021 - Dec 2022",
    description: "Designed premium digital branding identity, visual design guides, and Figma prototypes for 40+ international clients. Developed highly responsive custom WordPress themes, e-commerce storefronts, and customized JavaScript applications.",
  },
  {
    year: "2019 - 2021",
    title: "Software Engineer",
    company: "Nexus Technologies",
    location: "Cairo, Egypt",
    dateRange: "Jul 2019 - Feb 2021",
    description: "Designed and engineered mobile applications utilizing Flutter and Dart. Designed scalable REST APIs and managed PostgreSQL databases. Created motion graphics and product commercial animations using Premiere Pro.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Experience() {
  return (
    <section id="experience" className="relative py-24 md:py-32">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-violet-900/5 blur-[120px]" />

      <div className="container mx-auto px-4">
        <SectionHeader
          overline="My Journey"
          title="Work Experience"
          subtitle="A timeline of my professional career, roles, and accomplishments as a designer and software developer."
        />

        <div className="relative mx-auto max-w-4xl">
          {/* Vertical Timeline Center Line */}
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary via-secondary to-transparent md:left-1/2 md:-translate-x-1/2" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-12"
          >
            {experiences.map((exp, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="relative flex flex-col md:flex-row md:justify-between items-start"
                >
                  {/* Year Bubble (for Desktop, aligns opposite to card) */}
                  <div className={`hidden md:block w-[45%] text-right pr-8 pt-4 font-heading text-xl font-bold tracking-wider ${isEven ? "md:order-1 text-primary-light" : "md:order-3 md:text-left pl-8 text-secondary-light"}`}>
                    {exp.year}
                  </div>

                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/[0.08] bg-[#0c081e] text-white shadow-xl transition-all duration-300 group-hover:border-primary/50">
                    <div className="h-3.5 w-3.5 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse" />
                  </div>

                  {/* Experience Card */}
                  <div className={`w-full pl-12 md:pl-0 md:w-[45%] ${isEven ? "md:order-3" : "md:order-1"}`}>
                    <div className="p-6 glass border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 rounded-2xl relative group hover:border-primary/20">
                      {/* Mobile Year Badge */}
                      <div className="inline-block md:hidden mb-2 text-xs font-bold uppercase tracking-wider text-primary-light">
                        {exp.year}
                      </div>

                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-heading text-lg font-bold text-foreground">
                            {exp.title}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
                          <span className="flex items-center gap-1 font-semibold text-foreground-light">
                            <Briefcase className="h-3.5 w-3.5 text-primary" />
                            {exp.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {exp.dateRange}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {exp.location}
                          </span>
                        </div>

                        <p className="text-sm text-muted leading-relaxed pt-2">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
