"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Copy, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { createMedia, deleteMedia } from "@/actions/media";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  type: string;
  size: number;
  alt: string | null;
}

interface MediaClientProps {
  initialMedia: MediaItem[];
}

export function MediaClient({ initialMedia }: MediaClientProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    url: "",
    filename: "",
    type: "image/jpeg",
    size: 1024 * 500, // 500kb
    alt: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createMedia(form);
      if (res.error) {
        toast.error(res.error);
      } else {
        setMediaList((prev) => [res.media!, ...prev]);
        toast.success("Media record added successfully!");
        setForm({
          url: "",
          filename: "",
          type: "image/jpeg",
          size: 1024 * 500,
          alt: "",
        });
      }
    } catch {
      toast.error("Failed to add media.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media item?")) return;
    try {
      const res = await deleteMedia(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        setMediaList((prev) => prev.filter((item) => item.id !== id));
        toast.success("Media deleted successfully.");
      }
    } catch {
      toast.error("Failed to delete media.");
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Media URL copied to clipboard!");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight">
          Media Library
        </h1>
        <p className="text-sm text-muted">
          Manage your uploaded images and assets.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Add Media Form (Col 4) */}
        <Card className="lg:col-span-4 glass border-white/[0.05] bg-white/[0.01] p-6 rounded-2xl">
          <CardContent className="p-0 space-y-4">
            <h3 className="font-heading text-lg font-bold text-foreground">Add New Media Asset</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="filename" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Filename</Label>
                <Input
                  id="filename"
                  value={form.filename}
                  onChange={(e) => setForm((prev) => ({ ...prev, filename: e.target.value }))}
                  placeholder="E.g. hero-bg.jpg"
                  required
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Asset URL</Label>
                <Input
                  id="url"
                  value={form.url}
                  onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
                  placeholder="https://uploadthing.com/f/..."
                  required
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alt" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Alt Text (Accessibility)</Label>
                <Input
                  id="alt"
                  value={form.alt}
                  onChange={(e) => setForm((prev) => ({ ...prev, alt: e.target.value }))}
                  placeholder="E.g. Moaz Mohamed Portrait"
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl gap-2 mt-2">
                <Plus className="h-4 w-4" /> Add Asset
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Media Grid Showcase (Col 8) */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="font-heading text-lg font-bold text-foreground">Library Assets</h3>
          
          {mediaList.length === 0 ? (
            <div className="text-center py-16 glass border-white/[0.05] bg-white/[0.01] rounded-2xl">
              <ImageIcon className="h-12 w-12 text-muted mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted font-medium">No media uploaded yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {mediaList.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.01] transition-all duration-300 hover:border-primary/30 flex flex-col h-full justify-between"
                >
                  {/* Thumbnail / Image container */}
                  <div className="relative aspect-video w-full bg-neutral-900 border-b border-white/[0.04] overflow-hidden flex items-center justify-center p-2">
                    {item.type.startsWith("image/") ? (
                      <img
                        src={item.url}
                        alt={item.alt || item.filename}
                        className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-muted" />
                    )}
                  </div>

                  {/* Info details */}
                  <div className="p-3 space-y-2">
                    <span className="text-[10px] text-muted truncate block font-mono" title={item.filename}>
                      {item.filename}
                    </span>
                    <div className="flex gap-1.5 pt-1 border-t border-white/[0.03]">
                      <Button
                        onClick={() => copyToClipboard(item.url)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted hover:text-white"
                        title="Copy Asset URL"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted hover:text-destructive ml-auto"
                        title="Delete Asset"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
