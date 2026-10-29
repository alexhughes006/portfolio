import type { Metadata } from "next";
import Link from "next/link";
import { getProjects, type Project } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Personal and professional projects by Alex Hughes — CS student at UC San Diego.",
};

// Serve cached HTML; admin actions revalidate on change, and this catches drift
export const revalidate = 3600;

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col rounded-xl border border-line bg-card p-6 transition-colors hover:border-accent"
    >
      <h3 className="font-display text-xl font-medium group-hover:text-accent">
        {project.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-subtle">
        {project.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-full border border-line px-2.5 py-0.5 text-xs text-subtle"
          >
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}

function Section({ title, projects }: { title: string; projects: Project[] }) {
  if (projects.length === 0) return null;
  return (
    <section className="mt-12 first:mt-0">
      <h2 className="font-display text-2xl font-medium tracking-tight">
        {title}
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const personal = projects.filter((p) => p.section === "personal");
  const work = projects.filter((p) => p.section === "work");

  return (
    <div className="py-16 sm:py-20">
      <h1 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
        Projects
      </h1>
      {projects.length === 0 ? (
        <div className="mt-16 flex flex-col items-center rounded-xl border border-dashed border-line py-20 text-center">
          <p className="font-display text-xl italic text-subtle">
            Projects coming soon.
          </p>
          <p className="mt-2 max-w-sm text-sm text-subtle">
            I&apos;m currently writing these up — check back shortly.
          </p>
        </div>
      ) : (
        <>
          <Section title="Personal Projects" projects={personal} />
          <Section title="Work Projects" projects={work} />
        </>
      )}
    </div>
  );
}
