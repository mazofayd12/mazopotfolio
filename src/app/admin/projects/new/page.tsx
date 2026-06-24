import { createProject } from "@/actions/projects";
import { ProjectForm } from "../project-form";

export default function NewProjectPage() {
  return (
    <ProjectForm
      title="Create New Project"
      onSubmitAction={createProject}
    />
  );
}
