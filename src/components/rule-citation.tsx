import { getLawByNumber } from "@/lib/laws";
import type { IncidentRuleRef } from "@/lib/types";

export function RuleCitation({ ruleRef }: { ruleRef: IncidentRuleRef }) {
  const law = getLawByNumber(String(ruleRef.lawNumber).toLowerCase());
  const matchingRule = law?.rules.find(
    (r) =>
      r.specific_rule.toLowerCase().includes("handball") ||
      r.specific_rule.toLowerCase().includes("offside") ||
      r.specific_rule.toLowerCase().includes("referee") ||
      r.specific_rule.toLowerCase().includes("fouls") ||
      r.specific_rule.toLowerCase().includes("determining"),
  );

  return (
    <section className="rounded-xl border bg-card p-5">
      <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Law {ruleRef.lawNumber}
      </div>
      <h3 className="mb-3 text-sm font-semibold">{ruleRef.lawTitle}</h3>

      {matchingRule && (
        <blockquote className="mb-4 border-l-2 border-foreground/20 pl-4 text-xs leading-relaxed text-muted-foreground">
          &ldquo;{matchingRule.exact_quote.slice(0, 400)}&hellip;&rdquo;
          <br />
          <span className="mt-1 block text-[10px] text-muted-foreground/60">
            &mdash; {matchingRule.specific_rule}, p. {matchingRule.page_number}
          </span>
        </blockquote>
      )}

      <div className="text-xs leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">Why it applies: </span>
        {ruleRef.explanation}
      </div>
    </section>
  );
}
