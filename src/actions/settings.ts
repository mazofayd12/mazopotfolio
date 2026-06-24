"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getSettings() {
  const settings = await prisma.siteSettings.findMany();
  return settings.reduce(
    (acc, s) => {
      acc[s.key] = s.value;
      return acc;
    },
    {} as Record<string, string>
  );
}

export async function getSetting(key: string) {
  const setting = await prisma.siteSettings.findUnique({ where: { key } });
  return setting?.value || null;
}

export async function updateSettings(
  settings: { key: string; value: string }[]
) {
  await requireAuth();

  try {
    await prisma.$transaction(
      settings.map((s) =>
        prisma.siteSettings.upsert({
          where: { key: s.key },
          update: { value: s.value },
          create: { key: s.key, value: s.value },
        })
      )
    );
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update settings";
    return { error: message };
  }
}

export async function updateSetting(key: string, value: string) {
  await requireAuth();

  try {
    await prisma.siteSettings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update setting";
    return { error: message };
  }
}
