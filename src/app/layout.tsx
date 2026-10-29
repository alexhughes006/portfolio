import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const workSans = Work_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alexhughes.dev"),
  title: {
    default: "Alex Hughes — CS @ UC San Diego",
    template: "%s — Alex Hughes",
  },
  description:
    "Portfolio of Alex Hughes, a computer science student at UC San Diego seeking software engineering opportunities.",
  openGraph: {
    title: "Alex Hughes — CS @ UC San Diego",
    description:
      "Portfolio of Alex Hughes, a computer science student at UC San Diego seeking software engineering opportunities.",
    type: "website",
  },
};

const themeInit = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark")document.documentElement.classList.add("dark");}catch(e){}})();`;

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${workSans.variable} h-full antialiased`}
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInit}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-line">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-5">
            <Link
              href="/"
              className="font-display text-lg font-semibold tracking-tight"
            >
              Alex Hughes
            </Link>
            <div className="flex items-center gap-6">
              <nav className="flex items-center gap-5 text-sm text-subtle">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 px-6">{children}</main>
        <footer className="border-t border-line">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-6 text-sm text-subtle">
            <span>© {new Date().getFullYear()} Alex Hughes</span>
            <span>San Diego, CA</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
