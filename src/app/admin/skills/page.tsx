import { prisma } from "@/lib/prisma";
import { SkillsClient } from "./skills-client";

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  return <SkillsClient initialSkills={skills} />;
}
