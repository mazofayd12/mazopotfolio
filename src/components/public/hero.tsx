"use client";

import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function FloatingOrb({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.2, 1],
        y: [0, -30, 0],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    />
  );
}

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{
            background: [
              "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(124,58,237,0.15) 0%, transparent 70%)",
              "radial-gradient(ellipse 60% 60% at 40% 40%, rgba(124,58,237,0.2) 0%, transparent 70%)",
              "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(124,58,237,0.15) 0%, transparent 70%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
        />
        <motion.div
          animate={{
            background: [
              "radial-gradient(ellipse 50% 80% at 80% 60%, rgba(6,182,212,0.1) 0%, transparent 70%)",
              "radial-gradient(ellipse 60% 70% at 70% 70%, rgba(6,182,212,0.15) 0%, transparent 70%)",
              "radial-gradient(ellipse 50% 80% at 80% 60%, rgba(6,182,212,0.1) 0%, transparent 70%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute inset-0"
        />
        <motion.div
          animate={{
            background: [
              "radial-gradient(ellipse 60% 40% at 20% 80%, rgba(168,85,247,0.08) 0%, transparent 60%)",
              "radial-gradient(ellipse 50% 50% at 30% 70%, rgba(168,85,247,0.12) 0%, transparent 60%)",
              "radial-gradient(ellipse 60% 40% at 20% 80%, rgba(168,85,247,0.08) 0%, transparent 60%)",
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute inset-0"
        />
      </div>

      {/* Floating Orbs */}
      <FloatingOrb
        className="absolute top-1/4 left-[15%] h-72 w-72 rounded-full bg-primary/10 blur-[100px]"
        delay={0}
      />
      <FloatingOrb
        className="absolute bottom-1/4 right-[10%] h-96 w-96 rounded-full bg-secondary/10 blur-[120px]"
        delay={2}
      />
      <FloatingOrb
        className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-light/5 blur-[80px]"
        delay={4}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Status Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-sm text-muted backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Available for freelance work
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className="font-heading text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          >
            <span className="text-foreground">Moaz</span>{" "}
            <span className="gradient-text">Mohamed</span>
          </motion.h1>

          {/* Headline */}
          <motion.p
            variants={itemVariants}
            className="mt-4 font-heading text-xl font-medium text-muted sm:text-2xl md:text-3xl"
          >
            Digital Product Designer{" "}
            <span className="gradient-text">&</span>{" "}
            Software Engineer
          </motion.p>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          >
            I design, develop and launch modern websites, mobile applications,
            brands and smart IoT systems — crafting premium digital experiences
            that leave a lasting impression.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              asChild
              variant="gradient"
              size="lg"
              className="min-w-[180px] rounded-xl text-base"
            >
              <Link href="#portfolio">View My Work</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[180px] rounded-xl text-base"
            >
              <Link href="#contact">Hire Me</Link>
            </Button>
          </motion.div>

          {/* Tech Stack Pills */}
          <motion.div
            variants={itemVariants}
            className="mt-16 flex flex-wrap items-center justify-center gap-3"
          >
            {["React", "Next.js", "Flutter", "Figma", "Node.js", "IoT"].map(
              (tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs text-muted backdrop-blur-sm"
                >
                  {tech}
                </span>
              )
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <Link
          href="#about"
          className="flex flex-col items-center gap-2 text-muted transition-colors hover:text-foreground"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
}
