import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogDetailsProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostDetailPage({ params }: BlogDetailsProps) {
  const { slug } = await params;

  const samplePosts = [
    {
      id: "nextjs-15-performance",
      title: "Building High Performance Applications with Next.js 15",
      slug: "nextjs-15-performance",
      excerpt: "Learn how to optimize your Next.js 15 application utilizing the new caching behaviors, React Server Components, and static assembly.",
      content: "<p>Next.js 15 introduces key performance improvements, changing some of the default caching assumptions and upgrading dependencies to React 19. In this post, we discuss the major shifts in caching and optimization strategies that every front-end developer should implement to secure maximum page speeds.</p><h2>1. Understand the new Caching defaults</h2><p>By default, fetch requests and route handlers are no longer cached. Previously, in Next.js 13 and 14, requests were cached unless specified otherwise. This is a massive shift! Now, to cache API calls, you must explicitly supply cache directives or static route definitions.</p><h2>2. Dynamic IO</h2><p>Next.js 15 introduces a experimental feature called <code>dynamicIO</code>. When enabled, this flag forces asynchronous functions to automatically track dynamic dependencies (like cookies, headers, search parameters) and generate static files for other requests safely.</p><h2>3. React Server Components optimization</h2><p>RSCs are excellent for data fetching. Ensure that you fetch data at the page level and propagate it down, keeping components lightweight. Avoid blocking render cycles with slow database calls; utilize <code>Suspense</code> boundaries to stream UI features in asynchronously.</p>",
      publishedAt: new Date("2026-02-15"),
      category: "Development",
      tags: ["Next.js", "React", "Performance"],
    },
  ];

  let dbPost: any = null;
  try {
    dbPost = await prisma.blogPost.findFirst({
      where: { slug, published: true },
    });
  } catch (error) {
    console.error("Database query failed in BlogPostDetailPage:", error);
  }

  const post = dbPost || samplePosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

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
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Breadcrumb / Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-xs font-semibold text-primary-light hover:text-white transition-colors gap-1.5 mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
          </Link>

          <article className="space-y-8">
            {/* Header info */}
            <div className="space-y-4">
              <Badge className="bg-primary/20 text-primary-light border-primary/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {post.category || "Development"}
              </Badge>

              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 pb-6 border-b border-white/[0.05]">
                <div className="flex items-center gap-4 text-sm text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.publishedAt || new Date())}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    5 min read
                  </span>
                </div>

                <button className="flex items-center gap-1.5 text-xs text-muted hover:text-white transition-colors font-semibold">
                  <Share2 className="h-4 w-4" /> Share Article
                </button>
              </div>
            </div>

            {/* Excerpt */}
            <p className="text-xl text-muted-foreground font-medium leading-relaxed italic border-l-2 border-primary/50 pl-4 py-1">
              {post.excerpt}
            </p>

            {/* Cover Image Placeholder */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-purple-950/20 to-background flex items-center justify-center p-8">
              <span className="font-heading text-xl font-bold tracking-wider text-white/10 text-center">
                {post.title}
              </span>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01),transparent)] pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            </div>

            {/* Content Body */}
            {post.content && (
              <div
                className="prose prose-invert max-w-none text-muted space-y-6 pt-6 text-base md:text-lg leading-relaxed
                  prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:mb-6
                  prose-a:text-primary-light prose-a:underline hover:prose-a:text-white
                  prose-code:text-secondary-light prose-code:bg-white/[0.04] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
                  prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
                  prose-li:mb-2
                "
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}

            {/* Tags footer */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-8 border-t border-white/[0.05] flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-white/[0.03] text-muted border-white/[0.05]"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
