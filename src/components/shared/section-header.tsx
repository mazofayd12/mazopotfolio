"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  overline?: string;
  title: string;
  subtitle?: string;
  gradient?: boolean;
  align?: "left" | "center";
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function SectionHeader({
  overline,
  title,
  subtitle,
  gradient = true,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={cn(
        "mb-16 max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {overline && (
        <motion.span
          variants={itemVariants}
          className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-light"
        >
          {overline}
        </motion.span>
      )}
      <motion.h2
        variants={itemVariants}
        className={cn(
          "font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl",
          gradient ? "gradient-text" : "text-foreground"
        )}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={itemVariants}
          className="mt-4 text-base leading-relaxed text-muted sm:text-lg"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
