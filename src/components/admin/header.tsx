"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/projects": "Projects",
  "/admin/projects/new": "New Project",
  "/admin/blog": "Blog Posts",
  "/admin/blog/new": "New Blog Post",
  "/admin/services": "Services",
  "/admin/testimonials": "Testimonials",
  "/admin/skills": "Skills",
  "/admin/experience": "Experience",
  "/admin/media": "Media Library",
  "/admin/messages": "Messages",
  "/admin/settings": "Settings",
};

function getPageTitle(pathname: string): string {
  // Check exact match first
  if (pageTitles[pathname]) return pageTitles[pathname];

  // Check for edit pages
  if (pathname.includes("/projects/") && pathname.endsWith("/edit"))
    return "Edit Project";
  if (pathname.includes("/blog/") && pathname.endsWith("/edit"))
    return "Edit Blog Post";

  // Fallback to the last segment
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] || "Dashboard";
  return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
}

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 glass border-b border-white/5">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg sm:text-xl font-semibold font-heading text-foreground">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted hover:text-primary transition-colors hidden sm:block"
          >
            View Site →
          </a>
        </div>
      </div>
    </header>
  );
}
