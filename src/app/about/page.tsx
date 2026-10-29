import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Alex Hughes — computer science student at UC San Diego seeking software engineering opportunities.",
};

const skills: { category: string; items: string[] }[] = [
  {
    category: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "Java", "C", "SQL"],
  },
  {
    category: "Frameworks",
    items: ["React", "Next.js", "Node.js", "Tailwind CSS"],
  },
  {
    category: "Tools",
    items: ["Git", "Linux", "Docker", "PostgreSQL", "Vercel"],
  },
];

const coursework = [
  "Data Structures & Algorithms",
  "Software Engineering",
  "Computer Architecture",
  "Systems Programming",
];

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-20">
      <h1 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
        About
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8">
        I&apos;m a computer science student at UC San Diego seeking software
        engineering opportunities. I enjoy taking projects from idea to
        deployed product, and I&apos;m happiest when I&apos;m learning
        something new along the way.
      </p>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium tracking-tight">
          Skills
        </h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-3">
          {skills.map((group) => (
            <div key={group.category}>
              <h3 className="text-sm font-medium uppercase tracking-wide text-accent">
                {group.category}
              </h3>
              <ul className="mt-3 space-y-1.5 text-subtle">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 border-t border-line pt-10">
        <h2 className="font-display text-2xl font-medium tracking-tight">
          Coursework highlights
        </h2>
        <ul className="mt-6 flex max-w-2xl flex-wrap gap-3">
          {coursework.map((course) => (
            <li
              key={course}
              className="rounded-full border border-line px-4 py-1.5 text-sm text-subtle"
            >
              {course}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
