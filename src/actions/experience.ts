"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { experienceSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getExperiences() {
  return prisma.experience.findMany({
    orderBy: [{ order: "asc" }, { startDate: "desc" }],
  });
}

export async function getExperience(id: string) {
  return prisma.experience.findUnique({ where: { id } });
}

export async function createExperience(data: unknown) {
  await requireAuth();

  const validated = experienceSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    const experience = await prisma.experience.create({
      data: {
        ...validated.data,
        startDate: new Date(validated.data.startDate),
        endDate: validated.data.endDate
          ? new Date(validated.data.endDate)
          : null,
      },
    });
    revalidatePath("/admin/experience");
    revalidatePath("/");
    return { success: true, experience };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create experience";
    return { error: message };
  }
}

export async function updateExperience(id: string, data: unknown) {
  await requireAuth();

  const validated = experienceSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    const experience = await prisma.experience.update({
      where: { id },
      data: {
        ...validated.data,
        startDate: new Date(validated.data.startDate),
        endDate: validated.data.endDate
          ? new Date(validated.data.endDate)
          : null,
      },
    });
    revalidatePath("/admin/experience");
    revalidatePath("/");
    return { success: true, experience };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update experience";
    return { error: message };
  }
}

export async function deleteExperience(id: string) {
  await requireAuth();

  try {
    await prisma.experience.delete({ where: { id } });
    revalidatePath("/admin/experience");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Failed to delete experience" };
  }
}
