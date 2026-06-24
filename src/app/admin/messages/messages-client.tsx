"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, MailOpen, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { markAsRead, deleteSubmission } from "@/actions/contact";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: Date;
}

interface MessagesClientProps {
  initialMessages: ContactSubmission[];
}

export function MessagesClient({ initialMessages }: MessagesClientProps) {
  const [messages, setMessages] = useState<ContactSubmission[]>(initialMessages);
  const [activeMessage, setActiveMessage] = useState<ContactSubmission | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleToggleRead = async (id: string) => {
    try {
      const res = await markAsRead(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, read: res.read! } : msg))
        );
        toast.success(`Message marked as ${res.read ? "read" : "unread"}.`);
      }
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleViewMessage = async (msg: ContactSubmission) => {
    setActiveMessage(msg);
    if (!msg.read) {
      // Auto mark as read on view
      const res = await markAsRead(msg.id);
      if (!res.error && res.read) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
        );
      }
    }
  };

  const handleDelete = async () => {
    if (!targetId) return;
    setLoading(true);
    try {
      const res = await deleteSubmission(targetId);
      if (res.error) {
        toast.error(res.error);
      } else {
        setMessages((prev) => prev.filter((msg) => msg.id !== targetId));
        toast.success("Submission deleted successfully.");
        setIsDeleteOpen(false);
        setTargetId(null);
      }
    } catch {
      toast.error("Failed to delete submission.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight">
          Client Messages
        </h1>
        <p className="text-sm text-muted">
          Manage contact inquiries submitted through your website contact forms.
        </p>
      </div>

      {/* Messages Table */}
      <div className="glass border-white/[0.05] rounded-2xl bg-white/[0.01] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/[0.05] hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Status</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Sender</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Subject</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted">Date & Time</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted">
                  No messages received yet.
                </TableCell>
              </TableRow>
            ) : (
              messages.map((msg) => (
                <TableRow key={msg.id} className={`border-b border-white/[0.04] hover:bg-white/[0.02] ${!msg.read ? "bg-white/[0.01]" : ""}`}>
                  <TableCell>
                    <button onClick={() => handleToggleRead(msg.id)} className="focus:outline-none">
                      {msg.read ? (
                        <MailOpen className="h-4 w-4 text-muted hover:text-white" />
                      ) : (
                        <Mail className="h-4 w-4 text-amber-500 animate-pulse" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className={`text-sm ${!msg.read ? "font-bold text-foreground" : "text-muted"}`}>{msg.name}</span>
                      <span className="text-[10px] text-muted-foreground">{msg.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className={`text-xs ${!msg.read ? "font-bold text-foreground" : "text-muted"}`}>
                    {msg.subject || "No Subject"}
                  </TableCell>
                  <TableCell className="text-muted text-xs">{formatDate(msg.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        onClick={() => handleViewMessage(msg)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted hover:text-white"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setTargetId(msg.id);
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

      {/* View Message Detail Dialog */}
      <Dialog open={activeMessage !== null} onOpenChange={() => setActiveMessage(null)}>
        <DialogContent className="glass border-white/[0.08] bg-popover/95 text-foreground max-w-lg">
          {activeMessage && (
            <>
              <DialogHeader className="border-b border-white/[0.05] pb-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <DialogTitle className="text-base font-bold">{activeMessage.name}</DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground mt-0.5">{activeMessage.email}</DialogDescription>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    {formatDate(activeMessage.createdAt)}
                  </span>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-secondary-light">Subject</h4>
                  <p className="text-sm font-semibold text-foreground-light mt-1">
                    {activeMessage.subject || "No Subject"}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-primary-light">Message Context</h4>
                  <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap mt-1.5 p-4 rounded-xl bg-white/[0.01] border border-white/[0.04]">
                    {activeMessage.message}
                  </p>
                </div>
              </div>

              <DialogFooter className="border-t border-white/[0.05] pt-4">
                <Button
                  onClick={() => handleToggleRead(activeMessage.id)}
                  variant="outline"
                  className="mr-auto text-xs border-white/[0.06] bg-white/[0.01]"
                >
                  Mark as {activeMessage.read ? "Unread" : "Read"}
                </Button>
                <Button onClick={() => setActiveMessage(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="glass border-white/[0.08] bg-popover/95 text-foreground max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription className="text-muted text-xs">
              Are you sure you want to delete this message? This action is permanent and cannot be undone.
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
