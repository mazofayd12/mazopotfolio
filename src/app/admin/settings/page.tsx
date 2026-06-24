import { prisma } from "@/lib/prisma";
import { SettingsClient } from "./settings-client";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findMany({});

  return <SettingsClient initialSettings={settings} />;
}
