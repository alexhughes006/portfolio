import Link from "next/link";

const links = [
  { href: "https://github.com/alexhughes", label: "GitHub", external: true },
  {
    href: "https://www.linkedin.com/in/alexhughes",
    label: "LinkedIn",
    external: true,
  },
  { href: "mailto:alex@alexhughes.dev", label: "Email", external: false },
];

export default function Home() {
  return (
    <section className="flex flex-col justify-center py-24 sm:py-36">
      <h1 className="font-display max-w-2xl text-4xl font-medium leading-tight tracking-tight sm:text-5xl sm:leading-tight">
        Hi, my name is <span className="italic text-accent">Alex Hughes</span>{" "}
        and I&apos;m studying CS at{" "}
        <span className="italic text-accent">UC San Diego</span>.
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-subtle">
        I&apos;m seeking software engineering opportunities and I like building
        things that solve real problems. Have a look at what I&apos;ve been
        working on.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link
          href="/projects"
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          View my projects
        </Link>
        <a
          href="/resume.pdf"
          download
          className="rounded-full border border-line px-6 py-3 text-sm font-medium transition-colors hover:border-subtle"
        >
          Resume ↓
        </a>
      </div>
      <div className="mt-12 flex gap-6 text-sm text-subtle">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            {...(l.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            {l.label}
          </a>
        ))}
      </div>
    </section>
  );
}
