"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { serviceSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getServices() {
  return prisma.service.findMany({
    orderBy: { order: "asc" },
  });
}

export async function getService(id: string) {
  return prisma.service.findUnique({ where: { id } });
}

export async function createService(data: unknown) {
  await requireAuth();

  const validated = serviceSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    const service = await prisma.service.create({
      data: validated.data,
    });
    revalidatePath("/admin/services");
    revalidatePath("/");
    return { success: true, service };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create service";
    return { error: message };
  }
}

export async function updateService(id: string, data: unknown) {
  await requireAuth();

  const validated = serviceSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    const service = await prisma.service.update({
      where: { id },
      data: validated.data,
    });
    revalidatePath("/admin/services");
    revalidatePath("/");
    return { success: true, service };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update service";
    return { error: message };
  }
}

export async function deleteService(id: string) {
  await requireAuth();

  try {
    await prisma.service.delete({ where: { id } });
    revalidatePath("/admin/services");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Failed to delete service" };
  }
}
