"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { testimonialSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getTestimonials() {
  return prisma.testimonial.findMany({
    orderBy: { order: "asc" },
  });
}

export async function getTestimonial(id: string) {
  return prisma.testimonial.findUnique({ where: { id } });
}

export async function createTestimonial(data: unknown) {
  await requireAuth();

  const validated = testimonialSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    const testimonial = await prisma.testimonial.create({
      data: validated.data,
    });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true, testimonial };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create testimonial";
    return { error: message };
  }
}

export async function updateTestimonial(id: string, data: unknown) {
  await requireAuth();

  const validated = testimonialSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: validated.data,
    });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true, testimonial };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update testimonial";
    return { error: message };
  }
}

export async function deleteTestimonial(id: string) {
  await requireAuth();

  try {
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Failed to delete testimonial" };
  }
}
