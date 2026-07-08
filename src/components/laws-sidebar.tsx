"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LawIndexEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

export function LawsSidebar({ laws }: { laws: LawIndexEntry[] }) {
  const pathname = usePathname();
  const currentId = pathname.split("/").pop();

  return (
    <>
      <nav className="hide-scrollbar flex gap-1 overflow-x-auto border-b px-4 py-2 md:hidden">
        {laws.map((law) => {
          const id = String(law.law_number).toLowerCase();
          const active = id === currentId;
          return (
            <Link
              key={id}
              href={`/laws/${id}`}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                active
                  ? "bg-foreground text-background"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/70",
              )}
            >
              <span className="tabular-nums">{law.law_number}</span>
            </Link>
          );
        })}
      </nav>

      <aside className="hidden w-56 shrink-0 border-r md:block">
        <nav className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto p-3">
          <span className="mb-2 block px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Laws
          </span>
          <div className="flex flex-col gap-0.5">
            {laws.map((law) => {
              const id = String(law.law_number).toLowerCase();
              const active = id === currentId;
              const isVar = id === "var";
              const label = isVar
                ? "VAR Protocol"
                : `Law ${law.law_number}: ${law.law_title}`;
              return (
                <Link
                  key={id}
                  href={`/laws/${id}`}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs leading-snug transition-colors",
                    active
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}
