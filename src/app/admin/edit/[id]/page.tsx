import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProject } from "../../actions";
import ProjectForm from "@/components/admin/ProjectForm";
import type { Project } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Edit project",
  robots: { index: false, follow: false },
};

export default async function EditProjectPage({
  params,
}: PageProps<"/admin/edit/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const project: Project = {
    id: data.id,
    slug: data.slug,
    section: data.section,
    title: data.title,
    description: data.description,
    tech: data.tech,
    githubUrl: data.github_url,
    demoUrl: data.demo_url,
    screenshots: data.screenshots,
    learned: data.learned,
    sortOrder: data.sort_order,
  };

  const updateWithId = updateProject.bind(null, id);

  return (
    <div className="py-12 sm:py-16">
      <h1 className="font-display text-3xl font-medium tracking-tight">
        Edit project
      </h1>
      <ProjectForm project={project} action={updateWithId} />
    </div>
  );
}
