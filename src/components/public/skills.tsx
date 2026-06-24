"use client";

import { motion } from "motion/react";
import { SectionHeader } from "@/components/shared/section-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const skillCategories = [
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      { name: "Next.js / React", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 95 },
      { name: "HTML5 / CSS3 / ES6+", level: 98 },
      { name: "Redux / Zustand", level: 85 },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "Node.js / Express", level: 88 },
      { name: "Prisma ORM", level: 90 },
      { name: "PostgreSQL / MySQL", level: 85 },
      { name: "REST APIs / GraphQL", level: 92 },
      { name: "Docker / AWS Basics", level: 75 },
    ],
  },
  {
    id: "mobile",
    label: "Mobile",
    skills: [
      { name: "Flutter & Dart", level: 85 },
      { name: "React Native", level: 80 },
      { name: "iOS / Android Deployment", level: 75 },
    ],
  },
  {
    id: "uiux",
    label: "UI/UX",
    skills: [
      { name: "Figma", level: 92 },
      { name: "Adobe XD", level: 85 },
      { name: "Prototyping & Wireframing", level: 90 },
      { name: "Design Systems", level: 92 },
      { name: "User Research", level: 80 },
    ],
  },
  {
    id: "video",
    label: "Video Editing",
    skills: [
      { name: "Adobe Premiere Pro", level: 88 },
      { name: "Adobe After Effects", level: 80 },
      { name: "DaVinci Resolve", level: 82 },
      { name: "Motion Graphics", level: 78 },
    ],
  },
  {
    id: "embedded",
    label: "Embedded Systems",
    skills: [
      { name: "Arduino IDE", level: 90 },
      { name: "ESP32 / ESP8266", level: 88 },
      { name: "Raspberry Pi / Python", level: 85 },
      { name: "C / C++", level: 82 },
      { name: "IoT / Smart Home Systems", level: 92 },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function Skills() {
  return (
    <section id="skills" className="relative py-24 md:py-32">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-0 -z-10 h-72 w-72 rounded-full bg-violet-600/10 blur-[100px]" />
      <div className="absolute bottom-1/4 right-0 -z-10 h-72 w-72 rounded-full bg-cyan-600/10 blur-[100px]" />

      <div className="container mx-auto px-4">
        <SectionHeader
          overline="Skills & Technologies"
          title="My Expertise"
          subtitle="A comprehensive list of my technical skills, design capabilities, and technologies I work with daily."
        />

        <div className="mx-auto max-w-4xl">
          <Tabs defaultValue="frontend" className="w-full">
            <div className="flex justify-center mb-10 overflow-x-auto pb-2">
              <TabsList className="glass border-white/[0.06] bg-white/[0.02] p-1.5 rounded-full flex flex-wrap md:flex-nowrap justify-center gap-1">
                {skillCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="rounded-full px-5 py-2 text-xs md:text-sm font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/35"
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {skillCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-6 md:grid-cols-2 p-6 glass border-white/[0.06] rounded-2xl bg-white/[0.01]"
                >
                  {category.skills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      variants={itemVariants}
                      className="space-y-2.5"
                    >
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-foreground-light">{skill.name}</span>
                        <span className="font-medium text-primary-light">{skill.level}%</span>
                      </div>
                      <div className="relative w-full h-2.5 bg-white/[0.05] rounded-full overflow-hidden border border-white/[0.03]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
