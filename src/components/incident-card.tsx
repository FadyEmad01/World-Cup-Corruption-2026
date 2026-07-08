import Link from "next/link";
import type { IncidentIndexEntry } from "@/lib/types";

const severityStyles: Record<string, string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  major:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  minor:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export function IncidentCard({ incident }: { incident: IncidentIndexEntry }) {
  return (
    <Link
      href={`/incidents/${incident.id}`}
      className="group block overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      {incident.image && (
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          {/* biome-ignore lint/performance/noImgElement: external CDN images */}
          <img
            src={incident.image}
            alt={incident.title}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      <div className="space-y-2 p-4">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${severityStyles[incident.severity] ?? severityStyles.minor}`}
          >
            {incident.severity}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {incident.teams.home} vs {incident.teams.away}
          </span>
        </div>

        <h3 className="line-clamp-1 text-sm font-semibold leading-snug group-hover:underline">
          {incident.title}
        </h3>

        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {incident.summary}
        </p>

        <p className="text-[11px] text-muted-foreground">{incident.date}</p>
      </div>
    </Link>
  );
}
