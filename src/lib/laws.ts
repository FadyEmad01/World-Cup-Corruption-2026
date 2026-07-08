import { readFileSync } from "node:fs";
import { join } from "node:path";
import combined from "@/data/fifa_laws.json";
import type { Law, LawIndexEntry } from "./types";

export function getAllLaws(): LawIndexEntry[] {
  return combined as LawIndexEntry[];
}

export function getLawByNumber(id: string): Law | null {
  const fileName =
    id === "var" ? "var-protocol.json" : `law-${id.padStart(2, "0")}.json`;
  try {
    const filePath = join(process.cwd(), "src", "data", "laws", fileName);
    const data = readFileSync(filePath, "utf-8");
    return JSON.parse(data) as Law;
  } catch {
    return null;
  }
}
