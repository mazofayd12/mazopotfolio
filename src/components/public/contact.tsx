"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { SectionHeader } from "@/components/shared/section-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitContact } from "@/actions/contact";
import { Mail, Phone, MapPin, Send, MessageSquare, Sparkles } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/shared/brand-icons";

interface ContactProps {
  settings?: Record<string, string>;
}

export function Contact({ settings = {} }: ContactProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; error?: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    if (form.message.length < 10) {
      setStatus({ error: "Message must be at least 10 characters long." });
      setLoading(false);
      return;
    }

    try {
      const response = await submitContact(form);
      if (response.error) {
        setStatus({ error: response.error });
      } else {
        setStatus({ success: true });
        setForm({ name: "", email: "", subject: "", message: "" });
      }
    } catch {
      setStatus({ error: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32">
      {/* Background Orbs */}
      <div className="absolute right-0 top-1/4 -z-10 h-96 w-96 rounded-full bg-cyan-600/5 blur-[120px]" />
      <div className="absolute left-0 bottom-1/4 -z-10 h-96 w-96 rounded-full bg-violet-600/5 blur-[120px]" />

      <div className="container mx-auto px-4">
        <SectionHeader
          overline="Contact"
          title="Get In Touch"
          subtitle="Have a project in mind, want to collaborate, or just say hello? Drop a message below and let's build something premium."
        />

        <div className="grid gap-10 lg:grid-cols-12 max-w-5xl mx-auto items-stretch">
          {/* Contact Details Card (Right / Col 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 glass border-white/[0.05] bg-white/[0.01] rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

            <div className="space-y-8">
              <div>
                <h3 className="font-heading text-2xl font-bold text-foreground">
                  Contact Information
                </h3>
                <p className="text-sm text-muted mt-2">
                  Feel free to contact me directly via email or social platforms.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="h-12 w-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-primary group-hover:text-white group-hover:bg-primary/20 transition-all duration-300">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Me</h4>
                    <a href={`mailto:${settings.contactEmail || "moaz.mohamed@example.com"}`} className="text-sm font-semibold hover:text-primary-light transition-colors">
                      {settings.contactEmail || "moaz.mohamed@example.com"}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="h-12 w-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-secondary group-hover:text-white group-hover:bg-secondary/20 transition-all duration-300">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Call / WhatsApp</h4>
                    <a 
                      href={`https://wa.me/${(settings.socialWhatsapp || settings.contactPhone || "201234567890").replace(/[^0-9]/g, "")}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm font-semibold hover:text-secondary-light transition-colors"
                    >
                      {settings.contactPhone || "+20 123 456 7890"}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="h-12 w-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-amber-500 group-hover:text-white group-hover:bg-amber-500/20 transition-all duration-300">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Location</h4>
                    <p className="text-sm font-semibold">
                      {settings.contactLocation || "Cairo, Egypt / Remote"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Grid */}
            <div className="mt-12 pt-8 border-t border-white/[0.04] space-y-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Connect Globally</h4>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: GithubIcon, href: settings.socialGithub || "#", color: "hover:text-white hover:bg-neutral-800" },
                  { icon: LinkedinIcon, href: settings.socialLinkedin || "#", color: "hover:text-white hover:bg-blue-600" },
                  { icon: TwitterIcon, href: settings.socialTwitter || "#", color: "hover:text-white hover:bg-sky-500" },
                  { icon: MessageSquare, href: `https://wa.me/${(settings.socialWhatsapp || settings.contactPhone || "201234567890").replace(/[^0-9]/g, "")}`, color: "hover:text-white hover:bg-emerald-600" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    className={`h-11 w-11 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-muted transition-all duration-300 hover:scale-105 ${social.color}`}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form Card (Left / Col 7) */}
          <div className="lg:col-span-7 p-8 glass border-white/[0.05] bg-white/[0.01] rounded-2xl relative">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-semibold tracking-wide text-foreground-light uppercase">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="h-11 bg-white/[0.01] border-white/[0.06] focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-semibold tracking-wide text-foreground-light uppercase">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="h-11 bg-white/[0.01] border-white/[0.06] focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs font-semibold tracking-wide text-foreground-light uppercase">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  required
                  className="h-11 bg-white/[0.01] border-white/[0.06] focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-semibold tracking-wide text-foreground-light uppercase">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or inquiry... (at least 10 characters)"
                  required
                  rows={5}
                  className="bg-white/[0.01] border-white/[0.06] focus:border-primary/50 focus:ring-primary/20 rounded-xl resize-none"
                />
              </div>

              {status && (
                <div
                  className={`p-4 rounded-xl text-sm font-medium border ${
                    status.success
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-destructive/10 border-destructive/20 text-destructive-foreground"
                  }`}
                >
                  {status.success ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" /> Message sent successfully! I will get back to you shortly.
                    </span>
                  ) : (
                    status.error
                  )}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all gap-2"
              >
                {loading ? "Sending..." : "Send Message"}
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
