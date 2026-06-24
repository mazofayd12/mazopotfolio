"use client";

import { motion } from "motion/react";
import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle } from "lucide-react";

const highlights = [
  "5+ years of hands-on experience",
  "70+ projects delivered worldwide",
  "Full-stack design & development",
  "IoT & embedded systems expertise",
];

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      {/* Background accent */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary/5 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          overline="About Me"
          title="Crafting Digital Experiences That Matter"
          subtitle="A passionate designer and developer who transforms ideas into premium digital products."
          align="center"
        />

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image / Visual */}
          <ScrollReveal direction="left">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Gradient border frame */}
              <div className="gradient-border relative aspect-[4/5] overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-2xl shadow-primary/30">
                      <span className="font-heading text-3xl font-bold text-white">
                        MM
                      </span>
                    </div>
                    <p className="text-sm text-muted">Photo Coming Soon</p>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
                <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-secondary/20 blur-2xl" />
              </div>

              {/* Experience badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -bottom-6 -right-6 rounded-2xl border border-white/[0.06] bg-background/80 p-4 backdrop-blur-xl sm:p-5"
              >
                <div className="text-3xl font-bold gradient-text">5+</div>
                <div className="text-sm text-muted">Years Experience</div>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Text Content */}
          <ScrollReveal direction="right">
            <div className="space-y-6">
              <h3 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                I&apos;m Moaz Mohamed, a multidisciplinary{" "}
                <span className="gradient-text">designer & developer</span>
              </h3>

              <div className="space-y-4 text-base leading-relaxed text-muted">
                <p>
                  With over 5 years of professional experience, I specialize in
                  creating stunning digital products that blend beautiful design
                  with powerful functionality. From sleek websites and mobile
                  apps to complete brand identities and IoT solutions — I bring
                  ideas to life.
                </p>
                <p>
                  I believe great design is invisible. It should feel natural,
                  intuitive, and delightful. Every pixel I place and every line
                  of code I write is driven by this philosophy, ensuring that
                  each project I deliver exceeds expectations.
                </p>
              </div>

              {/* Highlight points */}
              <ul className="grid gap-3 sm:grid-cols-2">
                {highlights.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <CheckCircle className="h-4 w-4 shrink-0 text-primary-light" />
                    {item}
                  </motion.li>
                ))}
              </ul>

              <Button variant="gradient" size="lg" className="mt-4 rounded-xl">
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
