import { prisma } from "@/lib/prisma";
import { ServicesClient } from "./services-client";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  });

  return <ServicesClient initialServices={services} />;
}
