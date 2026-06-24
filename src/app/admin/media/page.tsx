import { prisma } from "@/lib/prisma";
import { MediaClient } from "./media-client";

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <MediaClient initialMedia={media} />;
}
