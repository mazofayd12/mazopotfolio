"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Edit, Star } from "lucide-react";
import { toast } from "sonner";
import { createTestimonial, updateTestimonial, deleteTestimonial } from "@/actions/testimonials";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  avatar: string | null;
  rating: number;
  published: boolean;
  order: number;
}

interface TestimonialsClientProps {
  initialTestimonials: Testimonial[];
}

export function TestimonialsClient({ initialTestimonials }: TestimonialsClientProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    avatar: "",
    rating: 5,
    published: true,
    order: 0,
  });

  const resetForm = () => {
    setForm({
      name: "",
      role: "",
      company: "",
      content: "",
      avatar: "",
      rating: 5,
      published: true,
      order: 0,
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createTestimonial({
        ...form,
        rating: Number(form.rating),
        order: Number(form.order),
      });
      if (res.error) {
        toast.error(res.error);
      } else {
        setTestimonials((prev) => [...prev, res.testimonial!].sort((a, b) => a.order - b.order));
        toast.success("Testimonial added successfully!");
        setIsCreateOpen(false);
        resetForm();
      }
    } catch {
      toast.error("Failed to add testimonial.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    setLoading(true);
    try {
      const res = await updateTestimonial(editingTestimonial.id, {
        ...form,
        rating: Number(form.rating),
        order: Number(form.order),
      });
      if (res.error) {
        toast.error(res.error);
      } else {
        setTestimonials((prev) =>
          prev
            .map((t) => (t.id === editingTestimonial.id ? res.testimonial! : t))
            .sort((a, b) => a.order - b.order)
        );
        toast.success("Testimonial updated successfully!");
        setIsEditOpen(false);
        setEditingTestimonial(null);
        resetForm();
      }
    } catch {
      toast.error("Failed to update testimonial.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!targetId) return;
    setLoading(true);
    try {
      const res = await deleteTestimonial(targetId);
      if (res.error) {
        toast.error(res.error);
      } else {
        setTestimonials((prev) => prev.filter((t) => t.id !== targetId));
        toast.success("Testimonial deleted successfully.");
        setIsDeleteOpen(false);
        setTargetId(null);
      }
    } catch {
      toast.error("Failed to delete testimonial.");
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setForm({
      name: testimonial.name,
      role: testimonial.role || "",
      company: testimonial.company || "",
      content: testimonial.content,
      avatar: testimonial.avatar || "",
      rating: testimonial.rating,
      published: testimonial.published,
      order: testimonial.order,
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight">
            Testimonials
          </h1>
          <p className="text-sm text-muted">
            Manage your client reviews and feedback.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsCreateOpen(true);
          }}
          size="sm"
          className="gap-1.5 text-xs font-semibold bg-gradient-to-r from-primary to-secondary text-white"
        >
          <Plus className="h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      {/* Testimonials List */}
      <div className="glass border-white/[0.05] rounded-2xl bg-white/[0.01] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/[0.05] hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Name</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Role & Company</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Content</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted text-center">Rating</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Status</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted">
                  No testimonials added yet.
                </TableCell>
              </TableRow>
            ) : (
              testimonials.map((testimonial) => (
                <TableRow key={testimonial.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <TableCell className="font-semibold text-foreground-light">
                    {testimonial.name}
                  </TableCell>
                  <TableCell className="text-muted text-xs">
                    {testimonial.role || "Client"} {testimonial.company ? `at ${testimonial.company}` : ""}
                  </TableCell>
                  <TableCell className="text-muted text-xs max-w-xs truncate">
                    {testimonial.content}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < testimonial.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-white/10"
                          }`}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={testimonial.published ? "default" : "secondary"} className="text-[10px]">
                      {testimonial.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        onClick={() => openEditDialog(testimonial)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setTargetId(testimonial.id);
                          setIsDeleteOpen(true);
                        }}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="glass border-white/[0.08] bg-popover/95 text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle>Add Testimonial</DialogTitle>
            <DialogDescription className="text-muted text-xs">Register a new client review.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Avatar Initials</Label>
                <Input
                  id="avatar"
                  value={form.avatar}
                  onChange={(e) => setForm((prev) => ({ ...prev, avatar: e.target.value }))}
                  placeholder="E.g. JD"
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Role</Label>
                <Input
                  id="role"
                  value={form.role}
                  onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                  placeholder="CTO"
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Company</Label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
                  placeholder="Stripe"
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rating" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min={1}
                  max={5}
                  value={form.rating}
                  onChange={(e) => setForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                  required
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm((prev) => ({ ...prev, order: Number(e.target.value) }))}
                  required
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Review Content</Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                required
                rows={4}
                className="bg-white/[0.01] border-white/[0.06] rounded-xl resize-none"
              />
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <Switch
                id="published"
                checked={form.published}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, published: checked }))}
                className="data-[state=checked]:bg-primary"
              />
              <Label htmlFor="published" className="text-xs uppercase tracking-wider font-bold cursor-pointer">Published</Label>
            </div>
            <DialogFooter className="gap-2 sm:gap-0 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="border-white/[0.06] bg-white/[0.01]"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-gradient-to-r from-primary to-secondary text-white font-bold">
                {loading ? "Adding..." : "Add Review"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="glass border-white/[0.08] bg-popover/95 text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
            <DialogDescription className="text-muted text-xs">Modify the selected review details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4 mt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Name</Label>
                <Input
                  id="edit-name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-avatar" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Avatar Initials</Label>
                <Input
                  id="edit-avatar"
                  value={form.avatar}
                  onChange={(e) => setForm((prev) => ({ ...prev, avatar: e.target.value }))}
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-role" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Role</Label>
                <Input
                  id="edit-role"
                  value={form.role}
                  onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-company" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Company</Label>
                <Input
                  id="edit-company"
                  value={form.company}
                  onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-rating" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Rating (1-5)</Label>
                <Input
                  id="edit-rating"
                  type="number"
                  min={1}
                  max={5}
                  value={form.rating}
                  onChange={(e) => setForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                  required
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-order" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Display Order</Label>
                <Input
                  id="edit-order"
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm((prev) => ({ ...prev, order: Number(e.target.value) }))}
                  required
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Review Content</Label>
              <Textarea
                id="edit-content"
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                required
                rows={4}
                className="bg-white/[0.01] border-white/[0.06] rounded-xl resize-none"
              />
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <Switch
                id="edit-published"
                checked={form.published}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, published: checked }))}
                className="data-[state=checked]:bg-primary"
              />
              <Label htmlFor="edit-published" className="text-xs uppercase tracking-wider font-bold cursor-pointer">Published</Label>
            </div>
            <DialogFooter className="gap-2 sm:gap-0 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingTestimonial(null);
                }}
                className="border-white/[0.06] bg-white/[0.01]"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-gradient-to-r from-primary to-secondary text-white font-bold">
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="glass border-white/[0.08] bg-popover/95 text-foreground max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Testimonial</DialogTitle>
            <DialogDescription className="text-muted text-xs">
              Are you sure you want to delete this testimonial? This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => {
                setIsDeleteOpen(false);
                setTargetId(null);
              }}
              className="border-white/[0.06] bg-white/[0.01]"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={loading}
              onClick={handleDelete}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
