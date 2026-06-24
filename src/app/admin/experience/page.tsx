import { prisma } from "@/lib/prisma";
import { ExperienceClient } from "./experience-client";

export default async function AdminExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: { order: "asc" },
  });

  return <ExperienceClient initialExperiences={experiences} />;
}
