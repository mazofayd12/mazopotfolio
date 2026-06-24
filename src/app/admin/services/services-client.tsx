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
import { Plus, Trash2, Edit, Save, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { createService, updateService, deleteService } from "@/actions/services";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  published: boolean;
}

interface ServicesClientProps {
  initialServices: Service[];
}

export function ServicesClient({ initialServices }: ServicesClientProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    icon: "code",
    order: 0,
    published: true,
  });

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      icon: "code",
      order: 0,
      published: true,
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createService({ ...form, order: Number(form.order) });
      if (res.error) {
        toast.error(res.error);
      } else {
        setServices((prev) => [...prev, res.service!].sort((a, b) => a.order - b.order));
        toast.success("Service created successfully!");
        setIsCreateOpen(false);
        resetForm();
      }
    } catch {
      toast.error("Failed to create service.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setLoading(true);
    try {
      const res = await updateService(editingService.id, {
        ...form,
        order: Number(form.order),
      });
      if (res.error) {
        toast.error(res.error);
      } else {
        setServices((prev) =>
          prev
            .map((s) => (s.id === editingService.id ? res.service! : s))
            .sort((a, b) => a.order - b.order)
        );
        toast.success("Service updated successfully!");
        setIsEditOpen(false);
        setEditingService(null);
        resetForm();
      }
    } catch {
      toast.error("Failed to update service.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!targetId) return;
    setLoading(true);
    try {
      const res = await deleteService(targetId);
      if (res.error) {
        toast.error(res.error);
      } else {
        setServices((prev) => prev.filter((s) => s.id !== targetId));
        toast.success("Service deleted successfully.");
        setIsDeleteOpen(false);
        setTargetId(null);
      }
    } catch {
      toast.error("Failed to delete service.");
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setForm({
      title: service.title,
      description: service.description,
      icon: service.icon,
      order: service.order,
      published: service.published,
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight">
            Services
          </h1>
          <p className="text-sm text-muted">
            Manage the service offerings displayed on your public homepage.
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
          <Plus className="h-4 w-4" /> Add Service
        </Button>
      </div>

      {/* Services Table */}
      <div className="glass border-white/[0.05] rounded-2xl bg-white/[0.01] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/[0.05] hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Icon</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Title</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Description</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Order</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Status</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted">
                  No services created yet.
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <TableCell className="font-semibold text-primary-light text-xs font-mono">
                    {service.icon}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground-light">
                    {service.title}
                  </TableCell>
                  <TableCell className="text-muted text-xs max-w-xs truncate">
                    {service.description}
                  </TableCell>
                  <TableCell className="text-muted text-xs">{service.order}</TableCell>
                  <TableCell>
                    <Badge variant={service.published ? "default" : "secondary"} className="text-[10px]">
                      {service.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        onClick={() => openEditDialog(service)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setTargetId(service.id);
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
            <DialogTitle>Add Service</DialogTitle>
            <DialogDescription className="text-muted text-xs">Create a new service card.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-2">
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
              <Label htmlFor="icon" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Lucide Icon Name</Label>
              <Input
                id="icon"
                value={form.icon}
                onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
                required
                className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Order</Label>
              <Input
                id="order"
                type="number"
                value={form.order}
                onChange={(e) => setForm((prev) => ({ ...prev, order: Number(e.target.value) }))}
                required
                className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
              />
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
                {loading ? "Adding..." : "Add Service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="glass border-white/[0.08] bg-popover/95 text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription className="text-muted text-xs">Modify the selected service details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4 mt-2">
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
              <Label htmlFor="edit-icon" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Lucide Icon Name</Label>
              <Input
                id="edit-icon"
                value={form.icon}
                onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
                required
                className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-order" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Order</Label>
              <Input
                id="edit-order"
                type="number"
                value={form.order}
                onChange={(e) => setForm((prev) => ({ ...prev, order: Number(e.target.value) }))}
                required
                className="h-10 bg-white/[0.01] border-white/[0.06] rounded-xl"
              />
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
                  setEditingService(null);
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
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription className="text-muted text-xs">
              Are you sure you want to delete this service? This action is permanent and cannot be undone.
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
