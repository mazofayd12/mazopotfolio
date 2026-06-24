import { createBlogPost } from "@/actions/blog";
import { BlogForm } from "../blog-form";

export default function NewBlogPostPage() {
  return (
    <BlogForm
      title="Create New Blog Post"
      onSubmitAction={createBlogPost}
    />
  );
}
