"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { skillSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getSkills() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  // Group by category
  const grouped = skills.reduce(
    (acc, skill) => {
      const cat = skill.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    },
    {} as Record<string, typeof skills>
  );

  return { skills, grouped };
}

export async function getSkill(id: string) {
  return prisma.skill.findUnique({ where: { id } });
}

export async function createSkill(data: unknown) {
  await requireAuth();

  const validated = skillSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    const skill = await prisma.skill.create({
      data: validated.data,
    });
    revalidatePath("/admin/skills");
    revalidatePath("/");
    return { success: true, skill };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create skill";
    return { error: message };
  }
}

export async function updateSkill(id: string, data: unknown) {
  await requireAuth();

  const validated = skillSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    const skill = await prisma.skill.update({
      where: { id },
      data: validated.data,
    });
    revalidatePath("/admin/skills");
    revalidatePath("/");
    return { success: true, skill };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update skill";
    return { error: message };
  }
}

export async function deleteSkill(id: string) {
  await requireAuth();

  try {
    await prisma.skill.delete({ where: { id } });
    revalidatePath("/admin/skills");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Failed to delete skill" };
  }
}
