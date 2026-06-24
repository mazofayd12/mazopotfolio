import { prisma } from "@/lib/prisma";
import { updateProject } from "@/actions/projects";
import { ProjectForm } from "../../project-form";
import { notFound } from "next/navigation";

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  // Bind the action to the specific project ID
  const updateProjectAction = async (data: any) => {
    "use server";
    return updateProject(id, data);
  };

  return (
    <ProjectForm
      title="Edit Project"
      project={project}
      onSubmitAction={updateProjectAction}
    />
  );
}
