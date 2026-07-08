import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllLaws, getLawByNumber } from "@/lib/laws";

export async function generateStaticParams() {
  const laws = getAllLaws();
  return laws.map((law) => ({ id: String(law.law_number).toLowerCase() }));
}

export default async function LawDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const law = getLawByNumber(id);

  if (!law) {
    notFound();
  }

  const isVar = id === "var";
  const label = isVar ? "VAR" : `LAW ${law.law_number}`;
  const title = isVar
    ? "Video Assistant Referee (VAR) Protocol"
    : law.law_title;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/laws"
        className="mb-6 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        &larr; All Laws
      </Link>

      <div className="mb-8">
        <span className="inline-flex items-center rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold tracking-wide text-foreground/70">
          {label}
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {law.rules.length} section{law.rules.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-6">
        {law.rules.map((rule, i) => (
          <section
            // biome-ignore lint/suspicious/noArrayIndexKey: static JSON data, never reordered
            key={i}
            className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-sm"
          >
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <h2 className="text-sm font-semibold leading-snug">
                {rule.specific_rule}
              </h2>
              <span className="inline-flex shrink-0 items-center rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
                p. {rule.page_number}
              </span>
            </div>

            <blockquote className="border-l-2 border-foreground/20 pl-4 text-sm leading-relaxed text-muted-foreground">
              &ldquo;{rule.exact_quote}&rdquo;
            </blockquote>
          </section>
        ))}
      </div>
    </div>
  );
}
