"use client";

import { ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/shared/brand-icons";
import Link from "next/link";

interface FooterProps {
  settings?: Record<string, string>;
}

export function Footer({ settings = {} }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-24 border-t border-white/[0.06] bg-[#02000c] py-12">
      {/* Gradient border line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-8 border-b border-white/[0.04]">
          {/* Logo & Info */}
          <div className="text-center md:text-left space-y-2">
            <Link href="/" className="font-heading text-xl font-bold tracking-wider gradient-text inline-block">
              MM
            </Link>
            <p className="text-xs text-muted max-w-xs">
              Designing and developing digital solutions that combine premium aesthetics with robust performance.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-muted">
            <a href="/#about" className="hover:text-primary-light transition-colors">About</a>
            <a href="/#services" className="hover:text-primary-light transition-colors">Services</a>
            <a href="/#portfolio" className="hover:text-primary-light transition-colors">Work</a>
            <a href="/blog" className="hover:text-primary-light transition-colors">Blog</a>
            <a href="/#contact" className="hover:text-primary-light transition-colors">Contact</a>
          </div>

          {/* Social Icons & Back to Top */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <a href={settings.socialGithub || "#"} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-muted hover:text-white hover:bg-white/[0.05] transition-all">
                <GithubIcon className="h-4 w-4" />
              </a>
              <a href={settings.socialLinkedin || "#"} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-muted hover:text-white hover:bg-white/[0.05] transition-all">
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a href={settings.socialTwitter || "#"} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-muted hover:text-white hover:bg-white/[0.05] transition-all">
                <TwitterIcon className="h-4 w-4" />
              </a>
            </div>

            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="h-9 w-9 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-muted hover:text-white hover:bg-primary/20 hover:border-primary/30 transition-all cursor-pointer group"
            >
              <ArrowUp className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Moaz Mohamed. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/admin/login" className="hover:underline text-primary/70 hover:text-primary">Admin Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
