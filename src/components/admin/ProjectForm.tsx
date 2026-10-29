"use client";

import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ActionResult } from "@/app/admin/actions";
import type { Project } from "@/lib/projects";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-line bg-background px-3 py-2.5 text-base outline-none focus:border-accent";

export default function ProjectForm({
  project,
  action,
}: {
  project?: Project;
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  const [screenshots, setScreenshots] = useState<string[]>(
    project?.screenshots ?? [],
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("screenshots")
        .upload(path, file, { contentType: file.type });
      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`);
        setUploading(false);
        return;
      }
      const { data } = supabase.storage.from("screenshots").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    setScreenshots((prev) => [...prev, ...uploaded]);
    setUploading(false);
    e.target.value = "";
  }

  function removeScreenshot(url: string) {
    setScreenshots((prev) => prev.filter((s) => s !== url));
  }

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    formData.set("screenshots", JSON.stringify(screenshots));
    const result = await action(formData);
    // On success the action redirects; reaching here means an error
    if (result?.error) {
      setError(result.error);
      setSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="mt-8 max-w-2xl">
      <label className="block text-sm font-medium">
        Section
        <select
          name="section"
          defaultValue={project?.section ?? "personal"}
          className={inputClass}
        >
          <option value="personal">Personal Project</option>
          <option value="work">Work Project</option>
        </select>
      </label>

      <label className="mt-5 block text-sm font-medium">
        Title
        <input
          type="text"
          name="title"
          defaultValue={project?.title ?? ""}
          required
          className={inputClass}
        />
      </label>

      <label className="mt-5 block text-sm font-medium">
        Short description
        <textarea
          name="description"
          defaultValue={project?.description ?? ""}
          required
          rows={2}
          placeholder="One or two sentences — shown on the project card"
          className={inputClass}
        />
      </label>

      <label className="mt-5 block text-sm font-medium">
        Tech stack
        <input
          type="text"
          name="tech"
          defaultValue={project?.tech.join(", ") ?? ""}
          placeholder="Comma-separated, e.g. Python, React, PostgreSQL"
          className={inputClass}
        />
      </label>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          GitHub URL <span className="text-subtle">(optional)</span>
          <input
            type="url"
            name="github_url"
            defaultValue={project?.githubUrl ?? ""}
            placeholder="https://github.com/…"
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium">
          Live demo URL <span className="text-subtle">(optional)</span>
          <input
            type="url"
            name="demo_url"
            defaultValue={project?.demoUrl ?? ""}
            placeholder="https://…"
            className={inputClass}
          />
        </label>
      </div>

      <label className="mt-5 block text-sm font-medium">
        What I learned / hardest problem
        <textarea
          name="learned"
          defaultValue={project?.learned ?? ""}
          rows={5}
          placeholder="The story interviewers ask about — what was hard, and how you solved it"
          className={inputClass}
        />
      </label>

      <div className="mt-5">
        <span className="block text-sm font-medium">Screenshots</span>
        {screenshots.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {screenshots.map((url) => (
              <div key={url} className="relative">
                <Image
                  src={url}
                  alt="Screenshot"
                  width={300}
                  height={169}
                  className="rounded-lg border border-line object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeScreenshot(url)}
                  aria-label="Remove screenshot"
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="mt-3 inline-block cursor-pointer rounded-full border border-line px-5 py-2.5 text-sm font-medium text-subtle transition-colors hover:text-foreground">
          {uploading ? "Uploading…" : "+ Add screenshots"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="mt-5 text-sm text-accent">{error}</p>}

      <div className="mt-8 flex gap-3">
        <button
          type="submit"
          disabled={submitting || uploading}
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Saving…" : project ? "Save changes" : "Create project"}
        </button>
        <a
          href="/admin"
          className="rounded-full border border-line px-6 py-3 text-sm font-medium text-subtle transition-colors hover:text-foreground"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
