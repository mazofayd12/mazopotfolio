import { prisma } from "@/lib/prisma";
import { BlogClient } from "./blog-client";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      category: true,
      published: true,
      publishedAt: true,
    },
  });

  return <BlogClient initialPosts={posts} />;
}
