"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { Briefcase, Clock, Layers, Users } from "lucide-react";

function useCounter(target: number, duration: number = 2000, inView: boolean) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime: number | null = null;
    let rafId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [inView, target, duration]);

  return count;
}

const stats = [
  {
    icon: Briefcase,
    value: 70,
    suffix: "+",
    label: "Projects Completed",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Clock,
    value: 5,
    suffix: "+",
    label: "Years Experience",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Layers,
    value: 30,
    suffix: "+",
    label: "Technologies",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Users,
    value: 50,
    suffix: "+",
    label: "Happy Clients",
    color: "from-amber-500 to-orange-500",
  },
];

function StatCard({
  stat,
  index,
}: {
  stat: (typeof stats)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCounter(stat.value, 2000, isInView);
  const Icon = stat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center backdrop-blur-sm transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.04] sm:p-8"
    >
      {/* Background glow */}
      <div
        className={cn(
          "absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30",
          stat.color
        )}
      />

      <div className="relative z-10">
        <div
          className={cn(
            "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
            stat.color
          )}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>

        <div className="mb-1 font-heading text-4xl font-bold gradient-text sm:text-5xl">
          {count}
          {stat.suffix}
        </div>

        <div className="text-sm font-medium text-muted">{stat.label}</div>
      </div>
    </motion.div>
  );
}

export function Statistics() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
