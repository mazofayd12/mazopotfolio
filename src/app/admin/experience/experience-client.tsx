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
import { Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { createExperience, updateExperience, deleteExperience } from "@/actions/experience";

interface Experience {
  id: string;
  title: string;
  company: string;
  description: string | null;
  location: string | null;
  startDate: Date | string;
  endDate: Date | string | null;
  current: boolean;
  order: number;
}interface ExperienceClientProps {
  initialExperiences: Experience[];
}

const formatDate = (date: Date | string | null): string => {
  if (!date) return "";
  if (date instanceof Date) {
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  }
  const parsed = new Date(date);
  if (!isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  }
  return String(date);
};

const formDateString = (date: Date | string | null | undefined): string => {
  if (!date) return "";
  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  }
  const parsed = new Date(date);
  if (!isNaN(parsed.getTime())) {
    try {
      return parsed.toISOString().split("T")[0];
    } catch {
      return String(date);
    }
  }
  return String(date);
};
export function ExperienceClient({ initialExperiences }: ExperienceClientProps) {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    order: 0,
  });

  const resetForm = () => {
    setForm({
      title: "",
      company: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      order: 0,
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createExperience({
        ...form,
        order: Number(form.order),
      });
      if (res.error) {
        toast.error(res.error);
      } else {
        setExperiences((prev) => [...prev, res.experience!].sort((a, b) => a.order - b.order));
        toast.success("Experience added successfully!");
        setIsCreateOpen(false);
        resetForm();
      }
    } catch {
      toast.error("Failed to add experience.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExperience) return;
    setLoading(true);
    try {
      const res = await updateExperience(editingExperience.id, {
        ...form,
        order: Number(form.order),
      });
      if (res.error) {
        toast.error(res.error);
      } else {
        setExperiences((prev) =>
          prev
            .map((exp) => (exp.id === editingExperience.id ? res.experience! : exp))
            .sort((a, b) => a.order - b.order)
        );
        toast.success("Experience updated successfully!");
        setIsEditOpen(false);
        setEditingExperience(null);
        resetForm();
      }
    } catch {
      toast.error("Failed to update experience.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!targetId) return;
    setLoading(true);
    try {
      const res = await deleteExperience(targetId);
      if (res.error) {
        toast.error(res.error);
      } else {
        setExperiences((prev) => prev.filter((exp) => exp.id !== targetId));
        toast.success("Experience deleted successfully.");
        setIsDeleteOpen(false);
        setTargetId(null);
      }
    } catch {
      toast.error("Failed to delete experience.");
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (exp: Experience) => {
    setEditingExperience(exp);
    setForm({
      title: exp.title,
      company: exp.company,
      description: exp.description || "",
      location: exp.location || "",
      startDate: formDateString(exp.startDate),
      endDate: formDateString(exp.endDate),
      current: exp.current,
      order: exp.order,
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight">
            Work Experience
          </h1>
          <p className="text-sm text-muted">
            Manage your career trajectory timeline here.
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
          <Plus className="h-4 w-4" /> Add Experience
        </Button>
      </div>

      {/* Experience Table */}
      <div className="glass border-white/[0.05] rounded-2xl bg-white/[0.01] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/[0.05] hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Role Title</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Company</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Location</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Duration</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Order</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted">
                  No experience timeline created yet.
                </TableCell>
              </TableRow>
            ) : (
              experiences.map((exp) => (
                <TableRow key={exp.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <TableCell className="font-semibold text-foreground-light">
                    {exp.title}
                  </TableCell>
                  <TableCell className="text-muted text-xs font-bold">{exp.company}</TableCell>
                  <TableCell className="text-muted text-xs">{exp.location || "Remote"}</TableCell>
                  <TableCell className="text-muted text-xs">
                    {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                  </TableCell>
                  <TableCell className="text-muted text-xs">{exp.order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        onClick={() => openEditDialog(exp)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setTargetId(exp.id);
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
            <DialogTitle>Add Experience</DialogTitle>
            <DialogDescription className="text-muted text-xs">Register a new role in your career.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  required
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Company</Label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
                  required
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Location</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Start Date</Label>
                <Input
                  id="startDate"
                  placeholder="E.g. Jan 2023"
                  value={form.startDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                  required
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">End Date</Label>
                <Input
                  id="endDate"
                  placeholder="E.g. Present"
                  value={form.endDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                  disabled={form.current}
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <Switch
                id="current"
                checked={form.current}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, current: checked, endDate: checked ? "Present" : "" }))}
                className="data-[state=checked]:bg-primary"
              />
              <Label htmlFor="current" className="text-xs uppercase tracking-wider font-bold cursor-pointer">I currently work here</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                required
                rows={3}
                className="bg-white/[0.01] border-white/[0.06] rounded-xl resize-none"
              />
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
                {loading ? "Adding..." : "Add Experience"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="glass border-white/[0.08] bg-popover/95 text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Experience</DialogTitle>
            <DialogDescription className="text-muted text-xs">Modify the selected role details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4 mt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Title</Label>
                <Input
                  id="edit-title"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  required
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-company" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Company</Label>
                <Input
                  id="edit-company"
                  value={form.company}
                  onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
                  required
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-location" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Location</Label>
                <Input
                  id="edit-location"
                  value={form.location}
                  onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Start Date</Label>
                <Input
                  id="edit-startDate"
                  value={form.startDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                  required
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endDate" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">End Date</Label>
                <Input
                  id="edit-endDate"
                  value={form.endDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                  disabled={form.current}
                  className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
                />
              </div>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <Switch
                id="edit-current"
                checked={form.current}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, current: checked, endDate: checked ? "Present" : "" }))}
                className="data-[state=checked]:bg-primary"
              />
              <Label htmlFor="edit-current" className="text-xs uppercase tracking-wider font-bold cursor-pointer">I currently work here</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Description</Label>
              <Textarea
                id="edit-description"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                required
                rows={3}
                className="bg-white/[0.01] border-white/[0.06] rounded-xl resize-none"
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingExperience(null);
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
            <DialogTitle>Delete Experience</DialogTitle>
            <DialogDescription className="text-muted text-xs">
              Are you sure you want to delete this experience record? This action is permanent and cannot be undone.
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
