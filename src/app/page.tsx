import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { IncidentCard } from "@/components/incident-card";
import { MasonryGrid } from "@/components/masonry-grid";
import { getAllIncidents } from "@/lib/incidents";
import { getAllLaws } from "@/lib/laws";

export default function HomePage() {
  const incidents = getAllIncidents();
  const laws = getAllLaws();
  const totalRules = laws.reduce((a, l) => a + l.rule_count, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <section className="mb-16">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          FIFA Refereeing Accountability Project
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          When the Laws Are Broken <br className="sm:hidden" />
          by Those Who Enforce Them
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          A crowdsourced, evidence-based archive of refereeing mistakes and
          controversial decisions from FIFA tournaments. Every incident is
          cross-referenced against the official IFAB Laws of the Game to
          demonstrate exactly where and how the Laws were misapplied. Our goal
          is to compile a compelling body of evidence showing that certain
          matches should have been replayed due to serious officiating errors.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/incidents"
            className="inline-flex h-9 items-center rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/80"
          >
            Browse Incidents
          </Link>
          <Link
            href="/laws"
            className="inline-flex h-9 items-center rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-accent"
          >
            Laws of the Game <ChevronRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="mb-16 grid gap-4 sm:grid-cols-3">
        <StatCard
          value={String(incidents.length)}
          label="Incidents Documented"
        />
        <StatCard value={String(laws.length)} label="IFAB Laws Referenced" />
        <StatCard value={String(totalRules)} label="Rules on Record" />
      </section>

      {incidents.length > 0 && (
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recent Incidents</h2>
              <p className="text-xs text-muted-foreground">
                Documented refereeing errors across FIFA tournaments
              </p>
            </div>
            <Link
              href="/incidents"
              className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline flex items-center gap-1 transition-colors"
            >
              View all <ChevronRight className="size-4" />
            </Link>
          </div>

          <MasonryGrid>
            {incidents.slice(0, 6).map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </MasonryGrid>
        </section>
      )}

      <section className="mt-16 rounded-xl border bg-card p-6 sm:p-8">
        <h2 className="mb-3 text-lg font-semibold">How to Contribute</h2>
        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          This project is built for developers and contributors. Adding a new
          incident is as simple as creating a single JSON file. No database, no
          admin dashboard, no login required. Fork the repo, add your incident,
          and open a pull request.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/incidents"
            className="inline-flex h-9 items-center rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/80"
          >
            View Incidents
          </Link>
          <a
            href="https://github.com/FadyEmad01/World-Cup-Corruption-2026"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-accent"
          >
            GitHub Repository
          </a>
        </div>
      </section>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border bg-card p-5 text-center">
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
