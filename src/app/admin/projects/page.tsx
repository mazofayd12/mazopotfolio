import { prisma } from "@/lib/prisma";
import { ProjectsClient } from "./projects-client";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      category: true,
      published: true,
      featured: true,
      completionDate: true,
    },
  });

  return <ProjectsClient initialProjects={projects} />;
}
