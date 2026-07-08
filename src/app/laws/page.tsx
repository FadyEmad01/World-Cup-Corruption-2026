import Link from "next/link";
import { getAllLaws } from "@/lib/laws";

const lawDomains: Record<string, string> = {
  "1": "Field dimensions, markings, goals, and surface requirements",
  "2": "Ball specifications, quality standards, and replacement rules",
  "3": "Player count, substitutions, and equipment violations",
  "4": "Mandatory and permitted equipment, safety requirements",
  "5": "Referee authority, duties, powers, and equipment",
  "6": "Assistant referees, fourth official, and additional officials",
  "7": "Match periods, half-time interval, and time allowances",
  "8": "Kick-off procedure, dropped ball, and ceremonial restarts",
  "9": "When the ball is in or out of play during a match",
  "10": "Goal scoring, winning team, and penalty shoot-out procedure",
  "11": "Offside position, offence criteria, and exceptions",
  "12": "Direct/indirect free kick offences, disciplinary action, and handball",
  "13": "Direct and indirect free kick procedure and wall distance",
  "14": "Penalty kick procedure, encroachment, and goalkeeper violations",
  "15": "Throw-in technique, procedure, and location requirements",
  "16": "Goal kick procedure, ball placement, and time limits",
  "17": "Corner kick procedure, positioning, and scoring directly",
  VAR: "Reviewable decisions, on-field review process, and VAR room procedures",
};

export default function LawsIndexPage() {
  const laws = getAllLaws();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          The International Football Association Board
        </p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight">
          Laws of the Game 2026/27
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          All 17 Laws plus the Video Assistant Referee (VAR) protocol extracted
          from the official IFAB Laws of the Game 2026/27 PDF. Each entry links
          the exact law text, section, and page reference.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {laws.map((law) => {
          const id = String(law.law_number).toLowerCase();
          const domain =
            lawDomains[id] ?? "Official IFAB law text and interpretation";

          return (
            <Link
              key={id}
              href={`/laws/${id}`}
              className="group rounded-xl border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-foreground/5 text-sm font-bold text-foreground/80">
                  {id === "var" ? "VAR" : id.padStart(2, "0")}
                </span>
                <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
                  {law.rule_count} rule{law.rule_count !== 1 ? "s" : ""}
                </span>
              </div>

              <h2 className="mb-1 text-sm font-semibold leading-snug group-hover:underline">
                {id === "var"
                  ? "Video Assistant Referee (VAR) Protocol"
                  : law.law_title}
              </h2>

              <p className="text-xs leading-relaxed text-muted-foreground">
                {domain}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
