import Link from "next/link";
import { getAllLaws } from "@/lib/laws";

export function Footer() {
  const laws = getAllLaws();

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:flex-row">
        <div className="flex-1">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Refereeing Accountability
          </Link>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            Documenting refereeing mistakes from FIFA tournaments and
            cross-referencing them against the official IFAB Laws of the Game.
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sections
          </span>
          <div className="flex flex-col gap-1">
            <Link
              href="/incidents"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Incidents
            </Link>
            <Link
              href="/laws"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Laws of the Game
            </Link>
            <Link
              href="/book"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              The Book (PDF)
            </Link>
          </div>
        </nav>

        <nav className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Laws
          </span>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {laws.slice(0, 9).map((law) => (
              <Link
                key={law.law_number}
                href={`/laws/${law.law_number}`}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {law.law_number}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {laws.slice(9).map((law) => (
              <Link
                key={law.law_number}
                href={`/laws/${law.law_number}`}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {law.law_number}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <div className="border-t py-4 text-center text-[11px] text-muted-foreground">
        Source: IFAB Laws of the Game 2026/27 &middot;
        <a
          href="https://www.theifab.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 underline underline-offset-2 hover:text-foreground"
        >
          Official IFAB Website
        </a>
      </div>
    </footer>
  );
}
