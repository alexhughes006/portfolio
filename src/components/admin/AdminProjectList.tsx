"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteProject, moveProject } from "@/app/admin/actions";
import type { Project } from "@/lib/projects";

export default function AdminProjectList({
  title,
  projects,
}: {
  title: string;
  projects: Project[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  if (projects.length === 0) return null;

  async function handleMove(id: string, direction: "up" | "down") {
    setBusy(id);
    await moveProject(id, direction);
    router.refresh();
    setBusy(null);
  }

  async function handleDelete(id: string, projectTitle: string) {
    if (!confirm(`Delete "${projectTitle}"? This cannot be undone.`)) return;
    setBusy(id);
    const result = await deleteProject(id);
    if (result.error) alert(result.error);
    router.refresh();
    setBusy(null);
  }

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-medium tracking-tight">
        {title}
      </h2>
      <ul className="mt-4 divide-y divide-line rounded-xl border border-line bg-card">
        {projects.map((p, i) => (
          <li
            key={p.id}
            className="flex flex-wrap items-center gap-3 p-4 sm:flex-nowrap"
          >
            <div className="flex flex-col gap-1">
              <button
                type="button"
                disabled={i === 0 || busy === p.id}
                onClick={() => handleMove(p.id, "up")}
                aria-label={`Move ${p.title} up`}
                className="text-subtle transition-colors hover:text-foreground disabled:opacity-30"
              >
                ▲
              </button>
              <button
                type="button"
                disabled={i === projects.length - 1 || busy === p.id}
                onClick={() => handleMove(p.id, "down")}
                aria-label={`Move ${p.title} down`}
                className="text-subtle transition-colors hover:text-foreground disabled:opacity-30"
              >
                ▼
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{p.title}</p>
              <p className="truncate text-sm text-subtle">{p.description}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/projects/${p.slug}`}
                target="_blank"
                className="rounded-full border border-line px-3.5 py-1.5 text-xs text-subtle transition-colors hover:text-foreground"
              >
                View
              </Link>
              <Link
                href={`/admin/edit/${p.id}`}
                className="rounded-full border border-line px-3.5 py-1.5 text-xs transition-colors hover:border-accent hover:text-accent"
              >
                Edit
              </Link>
              <button
                type="button"
                disabled={busy === p.id}
                onClick={() => handleDelete(p.id, p.title)}
                className="rounded-full border border-line px-3.5 py-1.5 text-xs text-subtle transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
