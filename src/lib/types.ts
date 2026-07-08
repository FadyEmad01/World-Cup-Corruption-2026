export interface Law {
  law_number: number | string;
  law_title: string;
  rules: LawRule[];
}

export interface LawRule {
  law_number: string;
  law_title: string;
  specific_rule: string;
  exact_quote: string;
  page_number: number;
}

export interface LawIndexEntry {
  law_number: number | string;
  law_title: string;
  rule_count: number;
}

export interface IncidentVideo {
  url: string;
  title: string;
}

export interface IncidentImage {
  url: string;
  caption: string;
  aspectRatio?: number;
}

export interface IncidentRuleRef {
  lawNumber: number | string;
  lawTitle: string;
  explanation: string;
}

export interface Incident {
  id: string;
  title: string;
  summary: string;
  match: string;
  teams: {
    home: string;
    away: string;
  };
  tournament: string;
  competitionStage: string;
  date: string;
  referee: string;
  minute: number | string;
  description: string;
  videos: IncidentVideo[];
  images: IncidentImage[];
  rules: IncidentRuleRef[];
  severity: "minor" | "major" | "critical";
  wasVARUsed: boolean;
  varOutcome?: string;
}

export interface IncidentIndexEntry {
  id: string;
  title: string;
  summary: string;
  date: string;
  severity: "minor" | "major" | "critical";
  image?: string;
  teams: {
    home: string;
    away: string;
  };
}
