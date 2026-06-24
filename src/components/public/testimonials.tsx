"use client";

import { motion } from "motion/react";
import { SectionHeader } from "@/components/shared/section-header";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonialsRow1 = [
  {
    name: "Alexander Wright",
    role: "CTO",
    company: "Stripe Flow Solutions",
    content: "Moaz redesigned our entire product catalog and built a high-performance web dashboard. His engineering skills are top-notch, and the UI is incredibly premium.",
    rating: 5,
    avatar: "AW",
  },
  {
    name: "Sarah Jenkins",
    role: "Founder",
    company: "Aura Creative Agency",
    content: "Working with Moaz was a game-changer. He has a rare combination of world-class design taste and deep technical skills. The portfolioCMS he built exceeded expectations.",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "Devon Lane",
    role: "Product Lead",
    company: "Linear Inc",
    content: "Moaz's attention to detail, micro-animations, and glassmorphic designs make our project feel premium. He's fast, communicative, and exceptionally talented.",
    rating: 5,
    avatar: "DL",
  },
  {
    name: "Elena Rostova",
    role: "VP of Engineering",
    company: "Vercel Labs Partner",
    content: "The custom hardware firmware and smart hub integration Moaz designed works flawlessly. A complete full-stack genius with design sensibilities.",
    rating: 5,
    avatar: "ER",
  },
];

const testimonialsRow2 = [
  {
    name: "Marcus Aurelius",
    role: "Product Designer",
    company: "Apple Design Guild",
    content: "Exceptional visual aesthetics. Moaz really understands the premium minimalist look and implements it cleanly in React and Next.js.",
    rating: 5,
    avatar: "MA",
  },
  {
    name: "Kristin Watson",
    role: "Director of Marketing",
    company: "Spark Digital",
    content: "Our website traffic doubled after launching the redesign. The speed improvements alone are incredible. 10/10 developer and designer.",
    rating: 5,
    avatar: "KW",
  },
  {
    name: "Amir Al-Husseini",
    role: "Director of IoT",
    company: "SmartLife Tech",
    content: "Outstanding job with our ESP32-based controller app. The interface is intuitive and response time is incredibly fast. Highly recommended.",
    rating: 5,
    avatar: "AA",
  },
  {
    name: "Sofia Rodriguez",
    role: "Co-Founder",
    company: "EcoSphere",
    content: "Moaz designed our brand identity and built our web platform. He is extremely reliable, professional, and is a true expert in Next.js.",
    rating: 5,
    avatar: "SR",
  },
];

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonialsRow1)[0] }) {
  return (
    <Card className="w-[380px] shrink-0 p-6 glass border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 rounded-2xl flex flex-col justify-between mx-3 select-none">
      <div className="space-y-4">
        {/* Rating */}
        <div className="flex gap-1">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Content */}
        <p className="text-sm text-muted leading-relaxed italic">
          "{testimonial.content}"
        </p>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3.5 mt-6 pt-4 border-t border-white/[0.04]">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center border border-white/[0.08] text-sm font-bold text-white shrink-0">
          {testimonial.avatar}
        </div>
        <div className="overflow-hidden">
          <h4 className="text-sm font-bold text-foreground truncate">
            {testimonial.name}
          </h4>
          <p className="text-xs text-muted-foreground truncate">
            {testimonial.role} at <span className="text-secondary-light">{testimonial.company}</span>
          </p>
        </div>
      </div>
    </Card>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 md:py-32 overflow-hidden">
      {/* Self-contained CSS Marquee animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: marquee-left 45s linear infinite;
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: marquee-right 45s linear infinite;
        }
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="container mx-auto px-4 mb-16">
        <SectionHeader
          overline="Testimonials"
          title="What Clients Say"
          subtitle="Feedback from clients, CTOs, and founders who have collaborated with me on various digital products."
        />
      </div>

      <div className="space-y-6 relative">
        {/* Row 1: Scrolling Left */}
        <div className="flex overflow-x-hidden py-2 relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          <div className="animate-marquee-left">
            {/* Double data for seamless infinite loop */}
            {[...testimonialsRow1, ...testimonialsRow1].map((testimonial, idx) => (
              <TestimonialCard key={`row1-${idx}`} testimonial={testimonial} />
            ))}
          </div>
        </div>

        {/* Row 2: Scrolling Right */}
        <div className="flex overflow-x-hidden py-2 relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-right">
            {[...testimonialsRow2, ...testimonialsRow2].map((testimonial, idx) => (
              <TestimonialCard key={`row2-${idx}`} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
