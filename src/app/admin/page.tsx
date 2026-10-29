import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import AdminProjectList from "@/components/admin/AdminProjectList";
import type { Project } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  slug: string;
  section: "personal" | "work";
  title: string;
  description: string;
  tech: string[];
  github_url: string | null;
  demo_url: string | null;
  screenshots: string[];
  learned: string;
  sort_order: number;
};

export default async function AdminPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return (
      <div className="py-16">
        <p className="text-accent">Failed to load projects: {error.message}</p>
        <p className="mt-2 text-sm text-subtle">
          Has the SQL schema been run in Supabase yet?
        </p>
      </div>
    );
  }

  const projects: Project[] = (data as Row[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    section: row.section,
    title: row.title,
    description: row.description,
    tech: row.tech,
    githubUrl: row.github_url,
    demoUrl: row.demo_url,
    screenshots: row.screenshots,
    learned: row.learned,
    sortOrder: row.sort_order,
  }));

  const personal = projects.filter((p) => p.section === "personal");
  const work = projects.filter((p) => p.section === "work");

  return (
    <div className="py-12 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-medium tracking-tight">
          Admin
        </h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/new"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            + New project
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-subtle transition-colors hover:text-foreground"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      <AdminProjectList title="Personal Projects" projects={personal} />
      <AdminProjectList title="Work Projects" projects={work} />

      {projects.length === 0 && (
        <p className="mt-16 text-center text-subtle">
          No projects yet — add your first one.
        </p>
      )}
    </div>
  );
}
