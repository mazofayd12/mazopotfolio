import { z } from "zod";

// ─── Project Validations ────────────────────────────────

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  description: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  videoUrl: z.string().optional(),
  images: z.any().optional(),
  category: z.string().default("Websites"),
  technologies: z.array(z.string()).default([]),
  projectUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  clientName: z.string().optional(),
  completionDate: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  order: z.number().int().default(0),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

// ─── Blog Post Validations ──────────────────────────────

export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  slug: z.string().min(1, "Slug is required").max(300),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  videoUrl: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;

// ─── Service Validations ────────────────────────────────

export const serviceSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required"),
  icon: z.string().default("code"),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

// ─── Testimonial Validations ────────────────────────────

export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  role: z.string().optional(),
  company: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  avatar: z.string().optional(),
  rating: z.number().int().min(1).max(5).default(5),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;

// ─── Skill Validations ──────────────────────────────────

export const skillSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.string().default("Frontend"),
  proficiency: z.number().int().min(0).max(100).default(80),
  icon: z.string().optional(),
  order: z.number().int().default(0),
});

export type SkillFormValues = z.infer<typeof skillSchema>;

// ─── Experience Validations ─────────────────────────────

export const experienceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  company: z.string().min(1, "Company is required").max(200),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  order: z.number().int().default(0),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;

// ─── Contact Validations ────────────────────────────────

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

// ─── Site Settings Validations ──────────────────────────

export const siteSettingsSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

// ─── SEO Settings Validations ───────────────────────────

export const seoSettingsSchema = z.object({
  page: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  ogImage: z.string().optional(),
  keywords: z.string().optional(),
});

export type SeoSettingsFormValues = z.infer<typeof seoSettingsSchema>;

// ─── Login Validations ──────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
