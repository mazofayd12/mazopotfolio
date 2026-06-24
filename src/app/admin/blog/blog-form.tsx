"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import slugify from "slugify";
import { UploadButton } from "@/lib/uploadthing";

interface BlogFormProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    coverImage: string | null;
    videoUrl: string | null;
    category: string | null;
    tags: string[];
    published: boolean;
    seoTitle: string | null;
    seoDescription: string | null;
  };
  onSubmitAction: (data: any) => Promise<{ success?: boolean; error?: string }>;
  title: string;
}

export function BlogForm({ post, onSubmitAction, title }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    coverImage: post?.coverImage || "",
    videoUrl: post?.videoUrl || "",
    category: post?.category || "",
    tags: post?.tags?.join(", ") || "",
    published: post?.published || false,
    seoTitle: post?.seoTitle || "",
    seoDescription: post?.seoDescription || "",
  });

  const [content, setContent] = useState(post?.content || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-generate slug from title
      if (name === "title" && !post) {
        updated.slug = slugify(value, { lower: true, strict: true });
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const submitData = {
      ...form,
      content,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    };

    try {
      const res = await onSubmitAction(submitData);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(post ? "Blog post updated successfully!" : "Blog post created successfully!");
        router.push("/admin/blog");
        router.refresh();
      }
    } catch {
      toast.error("An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center gap-3">
        <Link href="/admin/blog" className="text-muted hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight">
          {title}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="glass border-white/[0.05] bg-white/[0.01] p-6 rounded-2xl">
          <CardContent className="p-0 space-y-6">
            {/* Title & Slug */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="E.g. Building Next.js 15 apps"
                  required
                  className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl focus:border-primary/50 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="e.g. building-nextjs-15-apps"
                  required
                  className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Category & Tags */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="E.g. Development, UI/UX"
                  className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl focus:border-primary/50 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="Nextjs, React, Design"
                  className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Media Upload Section */}
            <div className="space-y-4 pt-4 border-t border-white/[0.05]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground-light">Media & Assets</h3>
              
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Cover Image Upload & Input */}
                <div className="space-y-3 p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Cover Image</Label>
                  
                  {form.coverImage ? (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/[0.08] bg-black/40 flex items-center justify-center group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.coverImage} alt="Cover image preview" className="object-cover w-full h-full" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm"
                          onClick={() => setForm((prev) => ({ ...prev, coverImage: "" }))}
                        >
                          Remove Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/[0.08] rounded-lg bg-black/20 gap-2">
                      <p className="text-xs text-muted">Upload an image file (max 4MB)</p>
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          if (res?.[0]) {
                            setForm((prev) => ({ ...prev, coverImage: res[0].url }));
                            toast.success("Cover image uploaded successfully!");
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Upload failed: ${error.message}`);
                        }}
                        appearance={{
                          button: "h-9 px-4 rounded-xl text-xs bg-white/[0.05] border border-white/[0.08] text-white hover:bg-white/[0.1] transition-all",
                          allowedContent: "hidden",
                        }}
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <Label htmlFor="coverImage" className="text-[10px] font-semibold text-muted/60">Or paste image URL:</Label>
                    <Input
                      id="coverImage"
                      name="coverImage"
                      value={form.coverImage}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className="h-9 bg-white/[0.01] border-white/[0.06] rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Video Upload & Input */}
                <div className="space-y-3 p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Blog Video (Optional)</Label>
                  
                  {form.videoUrl ? (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/[0.08] bg-black/40 flex items-center justify-center group">
                      <video src={form.videoUrl} controls className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setForm((prev) => ({ ...prev, videoUrl: "" }))}
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/[0.08] rounded-lg bg-black/20 gap-2">
                      <p className="text-xs text-muted">Upload a video file (max 64MB)</p>
                      <UploadButton
                        endpoint="mediaUploader"
                        onClientUploadComplete={(res) => {
                          if (res?.[0]) {
                            setForm((prev) => ({ ...prev, videoUrl: res[0].url }));
                            toast.success("Video uploaded successfully!");
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Upload failed: ${error.message}`);
                        }}
                        appearance={{
                          button: "h-9 px-4 rounded-xl text-xs bg-white/[0.05] border border-white/[0.08] text-white hover:bg-white/[0.1] transition-all",
                          allowedContent: "hidden",
                        }}
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <Label htmlFor="videoUrl" className="text-[10px] font-semibold text-muted/60">Or paste video URL:</Label>
                    <Input
                      id="videoUrl"
                      name="videoUrl"
                      value={form.videoUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/video.mp4"
                      className="h-9 bg-white/[0.01] border-white/[0.06] rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Brief summary of the article..."
                rows={3}
                className="bg-white/[0.01] border-white/[0.06] rounded-xl focus:border-primary/50 focus:ring-primary/20 resize-none"
              />
            </div>

            {/* Rich Text Editor */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Detailed Article Content</Label>
              <RichTextEditor
                content={content}
                onChange={setContent}
              />
            </div>

            {/* SEO Settings Panel */}
            <div className="pt-6 border-t border-white/[0.05] space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground-light">SEO Settings</h3>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">SEO Meta Title</Label>
                  <Input
                    id="seoTitle"
                    name="seoTitle"
                    value={form.seoTitle}
                    onChange={handleChange}
                    placeholder="E.g. Optimized Next.js 15 Guide"
                    className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl focus:border-primary/50 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoDescription" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">SEO Meta Description</Label>
                  <Input
                    id="seoDescription"
                    name="seoDescription"
                    value={form.seoDescription}
                    onChange={handleChange}
                    placeholder="Short description for Google Search index..."
                    className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl focus:border-primary/50 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Switches */}
            <div className="flex flex-wrap gap-10 pt-4 border-t border-white/[0.04]">
              <div className="flex items-center gap-2.5">
                <Switch
                  id="published"
                  checked={form.published}
                  onCheckedChange={(checked) => setForm((prev) => ({ ...prev, published: checked }))}
                  className="data-[state=checked]:bg-primary"
                />
                <Label htmlFor="published" className="text-xs font-bold uppercase tracking-wider cursor-pointer">Publish immediately</Label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/25 gap-2 transition-transform hover:scale-[1.01]"
              >
                <Save className="h-4 w-4" />
                {loading ? "Saving Article..." : "Save Blog Post"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
