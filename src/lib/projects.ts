import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Public reads use a cookie-less anon client so pages stay statically
// cacheable (ISR); RLS only allows selects for anon. Admin writes use the
// cookie-bound server client instead (see admin actions).
function publicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export type ProjectSection = "personal" | "work";

export type Project = {
  id: string;
  slug: string;
  section: ProjectSection;
  title: string;
  description: string;
  tech: string[];
  githubUrl: string | null;
  demoUrl: string | null;
  screenshots: string[];
  learned: string;
  sortOrder: number;
};

type ProjectRow = {
  id: string;
  slug: string;
  section: ProjectSection;
  title: string;
  description: string;
  tech: string[];
  github_url: string | null;
  demo_url: string | null;
  screenshots: string[];
  learned: string;
  sort_order: number;
};

function fromRow(row: ProjectRow): Project {
  return {
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
  };
}

export async function getProjects(): Promise<Project[]> {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Failed to load projects: ${error.message}`);
  return (data as ProjectRow[]).map(fromRow);
}

export async function getProject(slug: string): Promise<Project | null> {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Failed to load project: ${error.message}`);
  return data ? fromRow(data as ProjectRow) : null;
}
