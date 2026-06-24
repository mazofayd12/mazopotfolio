"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { blogPostSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getBlogPosts(params?: {
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
      { excerpt: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params?.category) {
    where.category = params.category;
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    posts,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function getBlogPost(id: string) {
  return prisma.blogPost.findUnique({ where: { id } });
}

export async function createBlogPost(data: unknown) {
  await requireAuth();

  const validated = blogPostSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    const post = await prisma.blogPost.create({
      data: {
        ...validated.data,
        publishedAt: validated.data.published ? new Date() : null,
      },
    });
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true, post };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create blog post";
    if (message.includes("Unique constraint")) {
      return { error: "A blog post with this slug already exists" };
    }
    return { error: message };
  }
}

export async function updateBlogPost(id: string, data: unknown) {
  await requireAuth();

  const validated = blogPostSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...validated.data,
        publishedAt:
          validated.data.published && !existing?.publishedAt
            ? new Date()
            : existing?.publishedAt,
      },
    });
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    return { success: true, post };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update blog post";
    return { error: message };
  }
}

export async function deleteBlogPost(id: string) {
  await requireAuth();

  try {
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true };
  } catch {
    return { error: "Failed to delete blog post" };
  }
}

export async function toggleBlogPublished(id: string) {
  await requireAuth();

  try {
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) return { error: "Blog post not found" };

    await prisma.blogPost.update({
      where: { id },
      data: {
        published: !post.published,
        publishedAt: !post.published ? new Date() : post.publishedAt,
      },
    });
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true, published: !post.published };
  } catch {
    return { error: "Failed to toggle published status" };
  }
}
