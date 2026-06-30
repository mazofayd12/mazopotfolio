"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import slugify from "slugify";
import { UploadButton } from "@/lib/uploadthing";

interface ProjectFormProps {
  project?: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    content: string | null;
    coverImage: string | null;
    videoUrl: string | null;
    category: string;
    technologies: string[];
    projectUrl: string | null;
    githubUrl: string | null;
    figmaUrl?: string | null;
    images?: any;
    clientName: string | null;
    completionDate: Date | null;
    featured: boolean;
    published: boolean;
    order: number;
  };
  onSubmitAction: (data: any) => Promise<{ success?: boolean; error?: string }>;
  title: string;
}

const categories = [
  "UI/UX",
  "Websites",
  "WordPress",
  "Flutter",
  "Branding",
  "Video Editing",
  "IoT",
  "Embedded Systems",
];

export function ProjectForm({ project, onSubmitAction, title }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [galleryImages, setGalleryImages] = useState<string[]>(() => {
    if (project?.images) {
      try {
        if (typeof project.images === "string") {
          return JSON.parse(project.images);
        }
        if (Array.isArray(project.images)) {
          return project.images as string[];
        }
      } catch (e) {
        console.error("Failed to parse gallery images:", e);
      }
    }
    return [];
  });

  // Helper to format Date to YYYY-MM-DD
  const formatDateString = (date: Date | null | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const [form, setForm] = useState({
    title: project?.title || "",
    slug: project?.slug || "",
    description: project?.description || "",
    content: project?.content || "",
    coverImage: project?.coverImage || "",
    videoUrl: project?.videoUrl || "",
    category: project?.category || "Websites",
    technologies: project?.technologies?.join(", ") || "",
    projectUrl: project?.projectUrl || "",
    githubUrl: project?.githubUrl || "",
    figmaUrl: project?.figmaUrl || "",
    clientName: project?.clientName || "",
    completionDate: formatDateString(project?.completionDate),
    featured: project?.featured || false,
    published: project?.published || false,
    order: project?.order || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-generate slug from title
      if (name === "title" && !project) {
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
      images: galleryImages,
      technologies: form.technologies
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
      order: Number(form.order),
    };

    try {
      const res = await onSubmitAction(submitData);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(project ? "Project updated successfully!" : "Project created successfully!");
        router.push("/admin/projects");
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
        <Link href="/admin/projects" className="text-muted hover:text-white transition-colors">
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
                  placeholder="E.g. E-Commerce Storefront"
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
                  placeholder="e.g. ecommerce-storefront"
                  required
                  className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Category & Order */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(val) => setForm((prev) => ({ ...prev, category: val }))}
                >
                  <SelectTrigger className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl text-left">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/[0.08] bg-popover/95 text-foreground">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="hover:bg-white/[0.05]">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Display Order</Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  value={form.order}
                  onChange={handleChange}
                  required
                  className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-2">
              <Label htmlFor="technologies" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Technologies (comma separated)</Label>
              <Input
                id="technologies"
                name="technologies"
                value={form.technologies}
                onChange={handleChange}
                placeholder="React, Next.js, Tailwind"
                className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl focus:border-primary/50 focus:ring-primary/20"
              />
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
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Project Showcase Video (Optional)</Label>
                  
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

            {/* Gallery Images (Multiple Images) */}
            <div className="space-y-3 p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Project Gallery Images (Upload up to 10 images)
              </Label>
              
              {/* Upload Button */}
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/[0.08] rounded-lg bg-black/20 gap-2">
                <p className="text-xs text-muted">Upload one or more image files (max 8MB each, up to 10)</p>
                <UploadButton
                  endpoint="projectImageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      const urls = res.map((file) => file.url);
                      setGalleryImages((prev) => [...prev, ...urls]);
                      toast.success("Gallery images uploaded successfully!");
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

              {/* Gallery Preview Grid */}
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  {galleryImages.map((url, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-white/[0.08] bg-black/40 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Gallery image ${index + 1}`} className="object-cover w-full h-full" />
                      <button
                        type="button"
                        onClick={() => setGalleryImages((prev) => prev.filter((_, i) => i !== index))}
                        className="absolute top-1.5 right-1.5 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Project URL, Github URL & Figma URL */}
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="projectUrl" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live Site URL</Label>
                <Input
                  id="projectUrl"
                  name="projectUrl"
                  type="url"
                  value={form.projectUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl focus:border-primary/50 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUrl" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Github Repository URL</Label>
                <Input
                  id="githubUrl"
                  name="githubUrl"
                  type="url"
                  value={form.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/user/repo"
                  className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl focus:border-primary/50 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="figmaUrl" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Figma Design URL</Label>
                <Input
                  id="figmaUrl"
                  name="figmaUrl"
                  type="url"
                  value={form.figmaUrl}
                  onChange={handleChange}
                  placeholder="https://www.figma.com/file/..."
                  className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Client Name & Completion Date */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client Name</Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                  className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl focus:border-primary/50 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="completionDate" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Completion Date</Label>
                <Input
                  id="completionDate"
                  name="completionDate"
                  type="date"
                  value={form.completionDate}
                  onChange={handleChange}
                  className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Short Description</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Brief summary of the project case study..."
                rows={3}
                className="bg-white/[0.01] border-white/[0.06] rounded-xl focus:border-primary/50 focus:ring-primary/20 resize-none"
              />
            </div>

            {/* Long Content (Rich HTML text) */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Detailed HTML Content</Label>
              <Textarea
                id="content"
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="<p>Write dynamic case study content here using HTML tags like p, h3, ul...</p>"
                rows={8}
                className="bg-white/[0.01] border-white/[0.06] rounded-xl focus:border-primary/50 focus:ring-primary/20"
              />
            </div>

            {/* Switches */}
            <div className="flex flex-wrap gap-10 pt-4 border-t border-white/[0.04]">
              <div className="flex items-center gap-2.5">
                <Switch
                  id="featured"
                  checked={form.featured}
                  onCheckedChange={(checked) => setForm((prev) => ({ ...prev, featured: checked }))}
                  className="data-[state=checked]:bg-primary"
                />
                <Label htmlFor="featured" className="text-xs font-bold uppercase tracking-wider cursor-pointer">Feature on Homepage</Label>
              </div>

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
                {loading ? "Saving Project..." : "Save Project"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
