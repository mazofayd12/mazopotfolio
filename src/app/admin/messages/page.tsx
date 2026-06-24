import { prisma } from "@/lib/prisma";
import { MessagesClient } from "./messages-client";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <MessagesClient initialMessages={messages} />;
}
