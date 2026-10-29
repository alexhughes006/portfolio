import type { Metadata } from "next";
import { createProject } from "../actions";
import ProjectForm from "@/components/admin/ProjectForm";

export const metadata: Metadata = {
  title: "New project",
  robots: { index: false, follow: false },
};

export default function NewProjectPage() {
  return (
    <div className="py-12 sm:py-16">
      <h1 className="font-display text-3xl font-medium tracking-tight">
        New project
      </h1>
      <ProjectForm action={createProject} />
    </div>
  );
}
