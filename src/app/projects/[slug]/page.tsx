import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/projects";
import AdminEditButton from "@/components/AdminEditButton";

type Props = PageProps<"/projects/[slug]">;

// Serve cached HTML; admin actions revalidate on change, and this catches drift
export const revalidate = 3600;

export function generateStaticParams() {
  // Slugs come from the database at request time; pages are cached after
  // first render (ISR) rather than enumerated at build time.
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project not found" };
  return { title: project.title, description: project.description };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <article className="py-16 sm:py-20">
      <Link
        href="/projects"
        className="text-sm text-subtle transition-colors hover:text-accent"
      >
        ← All projects
      </Link>
      <h1 className="font-display mt-6 text-3xl font-medium tracking-tight sm:text-4xl">
        {project.title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-subtle">
        {project.description}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-full border border-line px-3 py-1 text-xs text-subtle"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-line px-5 py-2.5 text-sm font-medium transition-colors hover:border-subtle"
          >
            View on GitHub
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Live demo
          </a>
        )}
        <AdminEditButton projectId={project.id} />
      </div>

      {project.screenshots.length > 0 && (
        <div className="mt-12 grid gap-6">
          {project.screenshots.map((src) => (
            <Image
              key={src}
              src={src}
              alt={`${project.title} screenshot`}
              width={1200}
              height={675}
              className="rounded-xl border border-line"
            />
          ))}
        </div>
      )}

      {project.learned && (
        <section className="mt-12 border-t border-line pt-10">
          <h2 className="font-display text-2xl font-medium tracking-tight">
            What I learned
          </h2>
          <p className="mt-4 max-w-2xl whitespace-pre-line leading-8">
            {project.learned}
          </p>
        </section>
      )}
    </article>
  );
}
