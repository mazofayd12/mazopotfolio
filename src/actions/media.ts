"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getMedia(params?: {
  page?: number;
  limit?: number;
  type?: string;
}) {
  await requireAuth();

  const page = params?.page || 1;
  const limit = params?.limit || 30;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (params?.type) {
    where.type = params.type;
  }

  const [media, total] = await Promise.all([
    prisma.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.media.count({ where }),
  ]);

  return {
    media,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function createMedia(data: {
  url: string;
  filename: string;
  type?: string;
  size?: number;
  alt?: string;
}) {
  await requireAuth();

  try {
    const media = await prisma.media.create({
      data: {
        url: data.url,
        filename: data.filename,
        type: data.type || "image",
        size: data.size || 0,
        alt: data.alt || "",
      },
    });
    revalidatePath("/admin/media");
    return { success: true, media };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create media record";
    return { error: message };
  }
}

export async function deleteMedia(id: string) {
  await requireAuth();

  try {
    await prisma.media.delete({ where: { id } });
    revalidatePath("/admin/media");
    return { success: true };
  } catch {
    return { error: "Failed to delete media" };
  }
}
