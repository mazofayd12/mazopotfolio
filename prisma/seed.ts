import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // ─── Admin User ─────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || "admin@moazmohamed.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "changeme123";
  const adminName = process.env.ADMIN_NAME || "Moaz Mohamed";

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // ─── Services ───────────────────────────────────────
  const services = [
    { title: "UI/UX Design", description: "Creating intuitive, visually stunning interfaces that prioritize user experience. From wireframes to high-fidelity prototypes using Figma and modern design principles.", icon: "palette", order: 1 },
    { title: "Web Development", description: "Building performant, SEO-optimized websites and web applications using React, Next.js, TypeScript, and modern web technologies.", icon: "code", order: 2 },
    { title: "WordPress Development", description: "Custom WordPress themes and plugins, WooCommerce stores, and content management solutions tailored to your business needs.", icon: "globe", order: 3 },
    { title: "Video Editing", description: "Professional video editing and motion graphics for promotional content, social media, and brand storytelling using Adobe Premiere and After Effects.", icon: "video", order: 4 },
    { title: "Brand Identity", description: "Comprehensive brand identity design including logos, color systems, typography, brand guidelines, and visual identity packages.", icon: "sparkles", order: 5 },
    { title: "Embedded Systems", description: "Hardware and firmware development for IoT devices, microcontrollers (Arduino, ESP32), and custom embedded solutions.", icon: "cpu", order: 6 },
    { title: "Smart Home Solutions", description: "Design and implementation of smart home automation systems, IoT integration, and connected device ecosystems.", icon: "home", order: 7 },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.title.toLowerCase().replace(/\s+/g, "-") },
      update: service,
      create: { ...service, id: service.title.toLowerCase().replace(/\s+/g, "-") },
    });
  }
  console.log(`✅ ${services.length} services created`);

  // ─── Skills ─────────────────────────────────────────
  const skills = [
    // Frontend
    { name: "React", category: "Frontend", proficiency: 95, order: 1 },
    { name: "Next.js", category: "Frontend", proficiency: 92, order: 2 },
    { name: "TypeScript", category: "Frontend", proficiency: 90, order: 3 },
    { name: "Tailwind CSS", category: "Frontend", proficiency: 95, order: 4 },
    { name: "HTML/CSS", category: "Frontend", proficiency: 98, order: 5 },
    { name: "JavaScript", category: "Frontend", proficiency: 93, order: 6 },
    // Backend
    { name: "Node.js", category: "Backend", proficiency: 88, order: 1 },
    { name: "Python", category: "Backend", proficiency: 80, order: 2 },
    { name: "PostgreSQL", category: "Backend", proficiency: 85, order: 3 },
    { name: "Prisma", category: "Backend", proficiency: 88, order: 4 },
    { name: "REST APIs", category: "Backend", proficiency: 90, order: 5 },
    { name: "GraphQL", category: "Backend", proficiency: 75, order: 6 },
    // Mobile
    { name: "Flutter", category: "Mobile", proficiency: 82, order: 1 },
    { name: "React Native", category: "Mobile", proficiency: 78, order: 2 },
    { name: "Dart", category: "Mobile", proficiency: 80, order: 3 },
    // UI/UX
    { name: "Figma", category: "UI/UX", proficiency: 93, order: 1 },
    { name: "Adobe XD", category: "UI/UX", proficiency: 85, order: 2 },
    { name: "Photoshop", category: "UI/UX", proficiency: 88, order: 3 },
    { name: "Illustrator", category: "UI/UX", proficiency: 82, order: 4 },
    // Video
    { name: "Premiere Pro", category: "Video Editing", proficiency: 88, order: 1 },
    { name: "After Effects", category: "Video Editing", proficiency: 80, order: 2 },
    { name: "DaVinci Resolve", category: "Video Editing", proficiency: 75, order: 3 },
    // Embedded
    { name: "Arduino", category: "Embedded Systems", proficiency: 85, order: 1 },
    { name: "ESP32", category: "Embedded Systems", proficiency: 82, order: 2 },
    { name: "Raspberry Pi", category: "Embedded Systems", proficiency: 78, order: 3 },
    { name: "C/C++", category: "Embedded Systems", proficiency: 80, order: 4 },
  ];

  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }
  console.log(`✅ ${skills.length} skills created`);

  // ─── Experiences ────────────────────────────────────
  const experiences = [
    {
      title: "Senior Software Engineer",
      company: "Freelance",
      description: "Leading full-stack development projects, building web and mobile applications, and designing brand identities for clients worldwide.",
      location: "Remote",
      startDate: new Date("2023-01-01"),
      current: true,
      order: 1,
    },
    {
      title: "Full-Stack Developer",
      company: "Tech Startup",
      description: "Developed and maintained multiple web applications using React, Node.js, and PostgreSQL. Led the frontend architecture and UI/UX design.",
      location: "Cairo, Egypt",
      startDate: new Date("2021-06-01"),
      endDate: new Date("2022-12-31"),
      current: false,
      order: 2,
    },
    {
      title: "Junior Developer & Designer",
      company: "Digital Agency",
      description: "Started as a junior developer building WordPress sites, gradually expanding into custom web development and UI/UX design.",
      location: "Cairo, Egypt",
      startDate: new Date("2020-01-01"),
      endDate: new Date("2021-05-31"),
      current: false,
      order: 3,
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log(`✅ ${experiences.length} experiences created`);

  // ─── Testimonials ───────────────────────────────────
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO",
      company: "TechVenture Inc.",
      content: "Moaz delivered an exceptional website that exceeded all our expectations. His attention to detail and understanding of modern design trends is unmatched. The project was delivered on time and within budget.",
      rating: 5,
      order: 1,
    },
    {
      name: "Ahmed Hassan",
      role: "Product Manager",
      company: "InnovateTech",
      content: "Working with Moaz was a fantastic experience. He transformed our outdated platform into a sleek, modern application. His technical skills and creative vision are truly impressive.",
      rating: 5,
      order: 2,
    },
    {
      name: "Maria Garcia",
      role: "Marketing Director",
      company: "BrandCraft Studio",
      content: "Moaz created a stunning brand identity for our company. From the logo to the complete visual system, everything was thoughtfully designed and professionally executed.",
      rating: 5,
      order: 3,
    },
    {
      name: "James Chen",
      role: "CTO",
      company: "SmartHome Solutions",
      content: "The IoT system Moaz built for us was remarkable. He seamlessly integrated hardware and software, creating an intuitive smart home solution that our customers love.",
      rating: 5,
      order: 4,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial });
  }
  console.log(`✅ ${testimonials.length} testimonials created`);

  // ─── Site Settings ──────────────────────────────────
  const settings = [
    { key: "hero_name", value: "Moaz Mohamed" },
    { key: "hero_headline", value: "Digital Product Designer & Software Engineer" },
    { key: "hero_subheadline", value: "I design, develop and launch modern websites, mobile applications, brands and smart IoT systems." },
    { key: "about_text", value: "I'm Moaz Mohamed, a passionate Digital Product Designer and Software Engineer with 5+ years of experience crafting exceptional digital experiences. I specialize in building modern, performant web applications, mobile apps, and IoT systems that solve real problems and delight users.\n\nMy approach combines technical excellence with creative design thinking. I believe in clean code, intuitive interfaces, and seamless user experiences. From concept to deployment, I handle every aspect of the development process.\n\nWhen I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or mentoring aspiring developers." },
    { key: "email", value: "contact@moazmohamed.com" },
    { key: "phone", value: "+201234567890" },
    { key: "location", value: "Cairo, Egypt" },
    { key: "social_linkedin", value: "https://linkedin.com/in/moazmohamed" },
    { key: "social_github", value: "https://github.com/moazmohamed" },
    { key: "social_behance", value: "https://behance.net/moazmohamed" },
    { key: "social_whatsapp", value: "https://wa.me/201234567890" },
    { key: "social_twitter", value: "https://twitter.com/moazmohamed" },
    { key: "stats_projects", value: "70" },
    { key: "stats_experience", value: "5" },
    { key: "stats_technologies", value: "30" },
    { key: "stats_clients", value: "50" },
  ];

  for (const setting of settings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log(`✅ ${settings.length} site settings created`);

  // ─── Sample Projects ────────────────────────────────
  const projects = [
    {
      title: "E-Commerce Platform",
      slug: "ecommerce-platform",
      description: "A modern, full-featured e-commerce platform with real-time inventory management, payment processing, and an intuitive admin dashboard.",
      category: "Websites",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Stripe"],
      featured: true,
      published: true,
      order: 1,
    },
    {
      title: "HealthTrack Mobile App",
      slug: "healthtrack-app",
      description: "A health and fitness tracking mobile application with workout plans, nutrition logging, and progress analytics.",
      category: "Flutter",
      technologies: ["Flutter", "Dart", "Firebase", "REST API"],
      featured: true,
      published: true,
      order: 2,
    },
    {
      title: "TechBrand Identity",
      slug: "techbrand-identity",
      description: "Complete brand identity design for a technology startup including logo, color system, typography, and comprehensive brand guidelines.",
      category: "Branding",
      technologies: ["Figma", "Illustrator", "Photoshop"],
      featured: true,
      published: true,
      order: 3,
    },
    {
      title: "Smart Home Dashboard",
      slug: "smart-home-dashboard",
      description: "An IoT dashboard for monitoring and controlling smart home devices with real-time data visualization and automation rules.",
      category: "IoT",
      technologies: ["React", "Node.js", "MQTT", "ESP32", "MongoDB"],
      featured: false,
      published: true,
      order: 4,
    },
    {
      title: "Corporate Website Redesign",
      slug: "corporate-website-redesign",
      description: "Complete redesign of a corporate website with modern aesthetics, improved UX, and optimized performance scoring 98+ on Lighthouse.",
      category: "WordPress",
      technologies: ["WordPress", "PHP", "JavaScript", "GSAP"],
      featured: false,
      published: true,
      order: 5,
    },
    {
      title: "Product Promo Video",
      slug: "product-promo-video",
      description: "Cinematic product promotional video with motion graphics, 3D elements, and professional color grading.",
      category: "Video Editing",
      technologies: ["Premiere Pro", "After Effects", "Cinema 4D"],
      featured: false,
      published: true,
      order: 6,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }
  console.log(`✅ ${projects.length} sample projects created`);

  // ─── SEO Settings ───────────────────────────────────
  const seoSettings = [
    {
      page: "home",
      title: "Moaz Mohamed | Digital Product Designer & Software Engineer",
      description: "Portfolio of Moaz Mohamed - A passionate designer and developer specializing in web development, mobile apps, UI/UX design, brand identity, and IoT solutions.",
      keywords: "web developer, UI/UX designer, software engineer, portfolio, freelancer",
    },
    {
      page: "blog",
      title: "Blog | Moaz Mohamed",
      description: "Insights, tutorials, and thoughts on web development, design, and technology by Moaz Mohamed.",
      keywords: "blog, web development, design, tutorials, technology",
    },
    {
      page: "projects",
      title: "Projects | Moaz Mohamed",
      description: "Explore the portfolio of projects by Moaz Mohamed including web applications, mobile apps, brand identities, and IoT solutions.",
      keywords: "projects, portfolio, web development, mobile apps, design",
    },
  ];

  for (const seo of seoSettings) {
    await prisma.seoSettings.upsert({
      where: { page: seo.page },
      update: seo,
      create: seo,
    });
  }
  console.log(`✅ ${seoSettings.length} SEO settings created`);

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
