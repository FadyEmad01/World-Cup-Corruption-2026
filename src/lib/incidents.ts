import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Incident, IncidentIndexEntry } from "./types";

export function getAllIncidents(): IncidentIndexEntry[] {
  try {
    const filePath = join(
      process.cwd(),
      "src",
      "data",
      "incidents",
      "index.json",
    );
    const data = readFileSync(filePath, "utf-8");
    return JSON.parse(data) as IncidentIndexEntry[];
  } catch {
    return [];
  }
}

export function getIncidentById(id: string): Incident | null {
  try {
    const filePath = join(
      process.cwd(),
      "src",
      "data",
      "incidents",
      `${id}.json`,
    );
    const data = readFileSync(filePath, "utf-8");
    return JSON.parse(data) as Incident;
  } catch {
    return null;
  }
}
