"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Search, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteBlogPost, toggleBlogPublished } from "@/actions/blog";

interface BlogPost {
  id: string;
  title: string;
  category: string | null;
  published: boolean;
  publishedAt: Date | null;
}

interface BlogClientProps {
  initialPosts: BlogPost[];
}

export function BlogClient({ initialPosts }: BlogClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.category && post.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleTogglePublished = async (id: string) => {
    try {
      const res = await toggleBlogPublished(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        setPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, published: res.published! } : p))
        );
        toast.success(`Post ${res.published ? "published" : "moved to draft"}.`);
      }
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await deleteBlogPost(deleteId);
      if (res.error) {
        toast.error(res.error);
      } else {
        setPosts((prev) => prev.filter((p) => p.id !== deleteId));
        toast.success("Blog post deleted successfully.");
      }
    } catch {
      toast.error("Failed to delete blog post.");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Draft";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight">
            Blog Posts
          </h1>
          <p className="text-sm text-muted">
            Manage your articles, case studies, and updates here.
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button size="sm" className="gap-1.5 text-xs font-semibold bg-gradient-to-r from-primary to-secondary text-white">
            <Plus className="h-4 w-4" /> Add Post
          </Button>
        </Link>
      </div>

      {/* Filter and search */}
      <div className="flex items-center gap-3 max-w-sm glass border-white/[0.06] rounded-xl px-3 py-1 bg-white/[0.01]">
        <Search className="h-4 w-4 text-muted shrink-0" />
        <Input
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-9 p-0"
        />
      </div>

      {/* Blog Table */}
      <div className="glass border-white/[0.05] rounded-2xl bg-white/[0.01] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/[0.05] hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Title</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Category</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Published Date</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Status</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted">
                  No blog posts found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPosts.map((post) => (
                <TableRow key={post.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <TableCell className="font-semibold text-foreground-light">
                    {post.title}
                  </TableCell>
                  <TableCell className="text-muted">{post.category || "Uncategorized"}</TableCell>
                  <TableCell className="text-muted text-xs">{formatDate(post.publishedAt)}</TableCell>
                  <TableCell>
                    <Switch
                      checked={post.published}
                      onCheckedChange={() => handleTogglePublished(post.id)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted hover:text-white">
                          <MoreHorizontal className="h-4.5 w-4.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass border-white/[0.08] bg-popover/95 text-foreground">
                        <DropdownMenuItem asChild className="hover:bg-white/[0.05] cursor-pointer">
                          <Link href={`/admin/blog/${post.id}/edit`} className="flex items-center gap-2">
                            <Edit className="h-4 w-4 text-primary-light" /> Edit Post
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(post.id)}
                          className="hover:bg-destructive/10 text-destructive focus:text-destructive hover:text-destructive-foreground cursor-pointer flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" /> Delete Post
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="glass border-white/[0.08] bg-popover/95 text-foreground max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription className="text-muted text-xs">
              Are you sure you want to delete this blog post? This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={deleting}
              onClick={() => setDeleteId(null)}
              className="border-white/[0.06] bg-white/[0.01]"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
