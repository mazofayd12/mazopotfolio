import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function BlogPage() {
  let dbPosts: any[] = [];
  try {
    dbPosts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch (error) {
    console.error("Database query failed in BlogPage:", error);
  }

  const samplePosts = [
    {
      id: "1",
      title: "Building High Performance Applications with Next.js 15",
      slug: "nextjs-15-performance",
      excerpt: "Learn how to optimize your Next.js 15 application utilizing the new caching behaviors, React Server Components, and static assembly.",
      publishedAt: new Date("2026-02-15"),
      category: "Development",
      tags: ["Next.js", "React", "Performance"],
      coverImage: "",
    },
    {
      id: "2",
      title: "Design Systems: The Bridge Between UX and Engineering",
      slug: "design-systems-bridge",
      excerpt: "Explore the core methodologies of creating cohesive design systems that streamline development and foster consistent brand identity.",
      publishedAt: new Date("2026-03-01"),
      category: "UI/UX Design",
      tags: ["Figma", "Design System", "UX"],
      coverImage: "",
    },
    {
      id: "3",
      title: "Connecting ESP32 Microcontrollers to Web Applications",
      slug: "esp32-web-connections",
      excerpt: "A complete developer's guide to using MQTT and WebSockets for real-time bi-directional messaging between micro-controllers and React.",
      publishedAt: new Date("2026-03-12"),
      category: "IoT",
      tags: ["ESP32", "IoT", "WebSockets"],
      coverImage: "",
    },
  ];

  const displayPosts = dbPosts.length > 0 ? dbPosts : samplePosts;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-24 min-h-screen">
        {/* Blog Hero Banner */}
        <div className="relative py-20 overflow-hidden border-b border-white/[0.06] bg-gradient-to-b from-primary/5 to-transparent">
          <div className="absolute inset-0 mesh-gradient opacity-30 pointer-events-none" />
          <div className="container mx-auto px-4 text-center space-y-4">
            <Link
              href="/#home"
              className="inline-flex items-center text-xs font-semibold text-primary-light hover:text-white transition-colors gap-1.5 mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              My <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-muted max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Writing about modern front-end engineering, full-stack architectures, interactive UI designs, and embedded hardware development.
            </p>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="container mx-auto px-4 py-16">
          {displayPosts.length === 0 ? (
            <div className="text-center py-20 glass border-white/[0.05] rounded-2xl max-w-lg mx-auto">
              <p className="text-muted font-medium">No blog posts published yet.</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {displayPosts.map((post) => (
                <article
                  key={post.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.01] transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full"
                >
                  {/* Image/Gradient Cover */}
                  <div className="relative aspect-video w-full overflow-hidden flex items-center justify-center p-6 bg-gradient-to-br from-purple-950 to-background border-b border-white/[0.04]">
                    <span className="font-heading text-base md:text-lg font-bold tracking-wider text-white/30 group-hover:scale-105 transition-transform duration-500 text-center px-4">
                      {post.title}
                    </span>
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                  </div>

                  {/* Body details */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(post.publishedAt || new Date())}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          5 min read
                        </span>
                      </div>

                      <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary-light transition-colors duration-300">
                        {post.title}
                      </h3>

                      <p className="text-sm text-muted line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-6 space-y-4">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {(post.tags || []).map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-white/[0.02] text-muted border-white/[0.04] text-[10px]"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                        <span className="text-xs font-bold text-secondary-light">
                          {post.category || "Uncategorized"}
                        </span>
                        
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center text-xs font-semibold text-primary-light hover:text-white transition-colors gap-1 group/btn"
                        >
                          Read Article
                          <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
