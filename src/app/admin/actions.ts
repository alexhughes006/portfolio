"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// All actions verify auth via the cookie-bound client; RLS enforces it again
// at the database layer.

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function revalidatePublicPages(slug?: string) {
  revalidatePath("/projects");
  if (slug) revalidatePath(`/projects/${slug}`);
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseTech(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export type ActionResult = { error?: string };

export async function createProject(formData: FormData): Promise<ActionResult> {
  const supabase = await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };
  const section = String(formData.get("section"));
  if (section !== "personal" && section !== "work")
    return { error: "Invalid section." };

  const slug = slugify(title);

  // Place at the end of its section
  const { data: last } = await supabase
    .from("projects")
    .select("sort_order")
    .eq("section", section)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("projects").insert({
    slug,
    section,
    title,
    description: String(formData.get("description") ?? "").trim(),
    tech: parseTech(String(formData.get("tech") ?? "")),
    github_url: String(formData.get("github_url") ?? "").trim() || null,
    demo_url: String(formData.get("demo_url") ?? "").trim() || null,
    screenshots: JSON.parse(String(formData.get("screenshots") ?? "[]")),
    learned: String(formData.get("learned") ?? "").trim(),
    sort_order: (last?.sort_order ?? -1) + 1,
  });

  if (error) {
    if (error.code === "23505")
      return { error: "A project with this title/slug already exists." };
    return { error: error.message };
  }

  revalidatePublicPages(slug);
  redirect("/admin");
}

export async function updateProject(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };
  const section = String(formData.get("section"));
  if (section !== "personal" && section !== "work")
    return { error: "Invalid section." };

  // Fetch existing slug so we can revalidate the old detail page on rename
  const { data: existing } = await supabase
    .from("projects")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const slug = slugify(title);

  const { error } = await supabase
    .from("projects")
    .update({
      slug,
      section,
      title,
      description: String(formData.get("description") ?? "").trim(),
      tech: parseTech(String(formData.get("tech") ?? "")),
      github_url: String(formData.get("github_url") ?? "").trim() || null,
      demo_url: String(formData.get("demo_url") ?? "").trim() || null,
      screenshots: JSON.parse(String(formData.get("screenshots") ?? "[]")),
      learned: String(formData.get("learned") ?? "").trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505")
      return { error: "A project with this title/slug already exists." };
    return { error: error.message };
  }

  if (existing && existing.slug !== slug) revalidatePublicPages(existing.slug);
  revalidatePublicPages(slug);
  redirect("/admin");
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const supabase = await requireUser();

  const { data: existing } = await supabase
    .from("projects")
    .select("slug, screenshots")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { error: error.message };

  // Best-effort cleanup of screenshot files in storage
  if (existing?.screenshots?.length) {
    const paths = (existing.screenshots as string[])
      .map((url) => url.split("/screenshots/")[1])
      .filter(Boolean);
    if (paths.length) await supabase.storage.from("screenshots").remove(paths);
  }

  revalidatePublicPages(existing?.slug);
  return {};
}

export async function moveProject(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  const supabase = await requireUser();

  const { data: current } = await supabase
    .from("projects")
    .select("id, section, sort_order")
    .eq("id", id)
    .maybeSingle();
  if (!current) return { error: "Project not found." };

  const { data: neighbor } = await supabase
    .from("projects")
    .select("id, sort_order")
    .eq("section", current.section)
    .filter("sort_order", direction === "up" ? "lt" : "gt", current.sort_order)
    .order("sort_order", { ascending: direction === "down" })
    .limit(1)
    .maybeSingle();
  if (!neighbor) return {}; // already at the edge

  // Swap sort orders
  const { error: e1 } = await supabase
    .from("projects")
    .update({ sort_order: neighbor.sort_order })
    .eq("id", current.id);
  const { error: e2 } = await supabase
    .from("projects")
    .update({ sort_order: current.sort_order })
    .eq("id", neighbor.id);
  if (e1 || e2) return { error: (e1 ?? e2)!.message };

  revalidatePublicPages();
  return {};
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
