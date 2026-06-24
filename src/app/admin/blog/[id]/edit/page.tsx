import { prisma } from "@/lib/prisma";
import { updateBlogPost } from "@/actions/blog";
import { BlogForm } from "../../blog-form";
import { notFound } from "next/navigation";

interface EditBlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  // Bind the action to the specific blog post ID
  const updateBlogPostAction = async (data: any) => {
    "use server";
    return updateBlogPost(id, data);
  };

  return (
    <BlogForm
      title="Edit Blog Post"
      post={post}
      onSubmitAction={updateBlogPostAction}
    />
  );
}
