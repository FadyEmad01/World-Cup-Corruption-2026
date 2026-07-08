import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
  const pdfPath = join(
    process.cwd(),
    "docs",
    "Laws of the Game 2026_27_single pages.pdf",
  );
  const pdf = readFileSync(pdfPath);

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="laws-of-the-game-2026-27.pdf"',
      "Content-Length": String(pdf.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
