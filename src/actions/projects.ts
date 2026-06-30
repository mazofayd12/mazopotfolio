"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { projectSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getProjects(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}) {
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (params?.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params?.category) {
    where.category = params.category;
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.project.count({ where }),
  ]);

  return {
    projects,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function getProject(id: string) {
  return prisma.project.findUnique({ where: { id } });
}

export async function createProject(data: unknown) {
  await requireAuth();

  const validated = projectSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    const project = await prisma.project.create({
      data: {
        ...validated.data,
        completionDate: validated.data.completionDate
          ? new Date(validated.data.completionDate)
          : null,
      },
    });
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true, project };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create project";
    if (message.includes("Unique constraint")) {
      return { error: "A project with this slug already exists" };
    }
    return { error: message };
  }
}

export async function updateProject(id: string, data: unknown) {
  await requireAuth();

  const validated = projectSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...validated.data,
        completionDate: validated.data.completionDate
          ? new Date(validated.data.completionDate)
          : null,
      },
    });
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/");
    return { success: true, project };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update project";
    return { error: message };
  }
}

export async function deleteProject(id: string) {
  await requireAuth();

  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Failed to delete project" };
  }
}

export async function toggleProjectFeatured(id: string) {
  await requireAuth();

  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return { error: "Project not found" };

    await prisma.project.update({
      where: { id },
      data: { featured: !project.featured },
    });
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true, featured: !project.featured };
  } catch {
    return { error: "Failed to toggle featured status" };
  }
}

export async function toggleProjectPublished(id: string) {
  await requireAuth();

  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return { error: "Project not found" };

    await prisma.project.update({
      where: { id },
      data: { published: !project.published },
    });
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true, published: !project.published };
  } catch {
    return { error: "Failed to toggle published status" };
  }
}
