import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, FileText, Mail, Briefcase, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [
    projectCount,
    postCount,
    unreadMessages,
    serviceCount,
    recentProjects,
    recentMessages,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.blogPost.count(),
    prisma.contactSubmission.count({ where: { read: false } }),
    prisma.service.count(),
    prisma.project.findMany({
      take: 5,
      orderBy: { order: "asc" },
    }),
    prisma.contactSubmission.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted">
            Welcome back! Here is an overview of your portfolio content and messages.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/" target="_blank">
            <Button variant="outline" size="sm" className="gap-1 text-xs border-white/[0.06] bg-white/[0.01]">
              View Site
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Projects",
            value: projectCount,
            icon: FolderKanban,
            description: "Published showcase works",
            color: "text-primary",
          },
          {
            title: "Blog Posts",
            value: postCount,
            icon: FileText,
            description: "Articles and case studies",
            color: "text-secondary",
          },
          {
            title: "Unread Messages",
            value: unreadMessages,
            icon: Mail,
            description: "New client submissions",
            color: unreadMessages > 0 ? "text-amber-500 animate-pulse" : "text-muted",
          },
          {
            title: "Active Services",
            value: serviceCount,
            icon: Briefcase,
            description: "Offered freelancer capabilities",
            color: "text-emerald-500",
          },
        ].map((stat, idx) => (
          <Card key={idx} className="glass border-white/[0.05] bg-white/[0.01]">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading">{stat.value}</div>
              <p className="text-[10px] text-muted">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Panel */}
      <Card className="glass border-white/[0.05] bg-white/[0.01]">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-wider">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/admin/projects/new">
            <Button size="sm" className="gap-1 text-xs font-semibold bg-gradient-to-r from-primary to-secondary text-white">
              <Plus className="h-3.5 w-3.5" /> New Project
            </Button>
          </Link>
          <Link href="/admin/blog/new">
            <Button size="sm" className="gap-1 text-xs font-semibold bg-gradient-to-r from-primary to-secondary text-white">
              <Plus className="h-3.5 w-3.5" /> New Blog Post
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Recent Projects Table (Col 7) */}
        <Card className="lg:col-span-7 glass border-white/[0.05] bg-white/[0.01]">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Recent Projects</CardTitle>
            <CardDescription className="text-xs">Quick status view of recently modified works.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <p className="text-xs text-muted py-4 text-center">No projects created yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left admin-table">
                  <thead>
                    <tr className="border-b border-white/[0.05]">
                      <th className="py-2.5 px-3">Title</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-3 font-semibold">{project.title}</td>
                        <td className="py-3 px-3 text-muted">{project.category}</td>
                        <td className="py-3 px-3">
                          <Badge variant={project.published ? "default" : "secondary"} className="text-[10px] py-0.5 px-2">
                            {project.published ? "Published" : "Draft"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4 text-right">
              <Link href="/admin/projects" className="text-xs text-primary-light hover:underline font-semibold">
                Manage all projects →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages list (Col 5) */}
        <Card className="lg:col-span-5 glass border-white/[0.05] bg-white/[0.01]">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Recent Messages</CardTitle>
            <CardDescription className="text-xs">Incoming client messages from your website contact form.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <p className="text-xs text-muted py-4 text-center">No messages received yet.</p>
            ) : (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="flex flex-col gap-1 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-foreground-light">{message.name}</span>
                      <span className="text-[10px] text-muted">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-[10px] text-secondary-light font-semibold">{message.subject || "No Subject"}</span>
                    <p className="text-xs text-muted line-clamp-2 mt-1">{message.message}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 text-right">
              <Link href="/admin/messages" className="text-xs text-primary-light hover:underline font-semibold">
                View all messages →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
