"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { createSkill, updateSkill, deleteSkill } from "@/actions/skills";

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon: string | null;
  order: number;
}

interface SkillsClientProps {
  initialSkills: Skill[];
}

const categories = [
  "Frontend",
  "Backend",
  "Mobile",
  "UI/UX",
  "Video Editing",
  "Embedded Systems",
];

export function SkillsClient({ initialSkills }: SkillsClientProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "Frontend",
    proficiency: 80,
    icon: "",
    order: 0,
  });

  const resetForm = () => {
    setForm({
      name: "",
      category: "Frontend",
      proficiency: 80,
      icon: "",
      order: 0,
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createSkill({
        ...form,
        proficiency: Number(form.proficiency),
        order: Number(form.order),
      });
      if (res.error) {
        toast.error(res.error);
      } else {
        setSkills((prev) => [...prev, res.skill!].sort((a, b) => a.order - b.order));
        toast.success("Skill created successfully!");
        setIsCreateOpen(false);
        resetForm();
      }
    } catch {
      toast.error("Failed to create skill.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    setLoading(true);
    try {
      const res = await updateSkill(editingSkill.id, {
        ...form,
        proficiency: Number(form.proficiency),
        order: Number(form.order),
      });
      if (res.error) {
        toast.error(res.error);
      } else {
        setSkills((prev) =>
          prev
            .map((s) => (s.id === editingSkill.id ? res.skill! : s))
            .sort((a, b) => a.order - b.order)
        );
        toast.success("Skill updated successfully!");
        setIsEditOpen(false);
        setEditingSkill(null);
        resetForm();
      }
    } catch {
      toast.error("Failed to update skill.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!targetId) return;
    setLoading(true);
    try {
      const res = await deleteSkill(targetId);
      if (res.error) {
        toast.error(res.error);
      } else {
        setSkills((prev) => prev.filter((s) => s.id !== targetId));
        toast.success("Skill deleted successfully.");
        setIsDeleteOpen(false);
        setTargetId(null);
      }
    } catch {
      toast.error("Failed to delete skill.");
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (skill: Skill) => {
    setEditingSkill(skill);
    setForm({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      icon: skill.icon || "",
      order: skill.order,
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight">
            Skills
          </h1>
          <p className="text-sm text-muted">
            Manage your technical skills and capabilities catalog.
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
          <Plus className="h-4 w-4" /> Add Skill
        </Button>
      </div>

      {/* Skills Table */}
      <div className="glass border-white/[0.05] rounded-2xl bg-white/[0.01] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/[0.05] hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Name</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Category</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Proficiency</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Order</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted">
                  No skills added yet.
                </TableCell>
              </TableRow>
            ) : (
              skills.map((skill) => (
                <TableRow key={skill.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <TableCell className="font-semibold text-foreground-light">
                    {skill.name}
                  </TableCell>
                  <TableCell className="text-muted text-xs">{skill.category}</TableCell>
                  <TableCell className="text-muted text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: `${skill.proficiency}%` }} />
                      </div>
                      <span>{skill.proficiency}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted text-xs">{skill.order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        onClick={() => openEditDialog(skill)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setTargetId(skill.id);
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
            <DialogTitle>Add Skill</DialogTitle>
            <DialogDescription className="text-muted text-xs">Register a new skill item.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Skill Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
                className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Category</Label>
              <Select
                value={form.category}
                onValueChange={(val) => setForm((prev) => ({ ...prev, category: val }))}
              >
                <SelectTrigger className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl">
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
              <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex justify-between">
                <span>Proficiency</span>
                <span className="text-primary-light font-bold">{form.proficiency}%</span>
              </Label>
              <Slider
                value={[form.proficiency]}
                onValueChange={(vals) => setForm((prev) => ({ ...prev, proficiency: vals[0] }))}
                max={100}
                step={5}
                className="py-2"
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
                {loading ? "Adding..." : "Add Skill"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="glass border-white/[0.08] bg-popover/95 text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
            <DialogDescription className="text-muted text-xs">Modify the selected skill details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Skill Name</Label>
              <Input
                id="edit-name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
                className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Category</Label>
              <Select
                value={form.category}
                onValueChange={(val) => setForm((prev) => ({ ...prev, category: val }))}
              >
                <SelectTrigger className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl">
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
              <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex justify-between">
                <span>Proficiency</span>
                <span className="text-primary-light font-bold">{form.proficiency}%</span>
              </Label>
              <Slider
                value={[form.proficiency]}
                onValueChange={(vals) => setForm((prev) => ({ ...prev, proficiency: vals[0] }))}
                max={100}
                step={5}
                className="py-2"
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
            <DialogFooter className="gap-2 sm:gap-0 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingSkill(null);
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
            <DialogTitle>Delete Skill</DialogTitle>
            <DialogDescription className="text-muted text-xs">
              Are you sure you want to delete this skill? This action is permanent and cannot be undone.
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
