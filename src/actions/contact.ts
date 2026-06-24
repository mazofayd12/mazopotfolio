"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { contactSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

// Public action - no auth required
export async function submitContact(data: unknown) {
  const validated = contactSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    await prisma.contactSubmission.create({
      data: validated.data,
    });
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit message";
    return { error: message };
  }
}

export async function getContactSubmissions(params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}) {
  await requireAuth();

  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (params?.unreadOnly) {
    where.read = false;
  }

  const [submissions, total, unreadCount] = await Promise.all([
    prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.contactSubmission.count({ where }),
    prisma.contactSubmission.count({ where: { read: false } }),
  ]);

  return {
    submissions,
    total,
    unreadCount,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function markAsRead(id: string) {
  await requireAuth();

  try {
    const submission = await prisma.contactSubmission.findUnique({
      where: { id },
    });
    if (!submission) return { error: "Submission not found" };

    await prisma.contactSubmission.update({
      where: { id },
      data: { read: !submission.read },
    });
    revalidatePath("/admin/messages");
    return { success: true, read: !submission.read };
  } catch {
    return { error: "Failed to update read status" };
  }
}

export async function deleteSubmission(id: string) {
  await requireAuth();

  try {
    await prisma.contactSubmission.delete({ where: { id } });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch {
    return { error: "Failed to delete submission" };
  }
}
