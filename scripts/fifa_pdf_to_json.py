import re
import json
import sys
import os
import argparse
from collections import OrderedDict


FOOTER_PATTERNS = [
    re.compile(r"^\d+\s*$"),
    re.compile(r"^Laws of the Game 2026/27$"),
    re.compile(r"^Laws of the Game 2026/27\s+\|\s+Law\s+\d+"),
    re.compile(r"^Laws of the Game 2026/27\s+\|\s+[A-Z]"),
    re.compile(r"^Contents\s*$"),
    re.compile(r"^Page\s+\d+", re.IGNORECASE),
]

RUNNING_HEADER = re.compile(
    r"^Laws of the Game 2026/27\s+\|\s+Law\s+\d+\s+\|\s+.+$"
)

SECTION_HEADER = re.compile(
    r"^(?P<num>\d+)\.\s*(?P<title>[A-Z][A-Za-z0-9\s/\-–—&',()\d]+)$"
)

LAW_DIVIDER = re.compile(r"^Law(?P<num>\d+)$")

LAW_RUNNING = re.compile(
    r"^Laws of the Game 2026/27\s+\|\s+Law\s+(?P<num>\d+)\s+\|\s+(?P<title>.+)$"
)

KNOWN_STUBS = {
    1: "The Field of Play",
    2: "The Ball",
    3: "The Players",
    4: "The Players' Equipment",
    5: "The Referee",
    6: "The Other Match Officials",
    7: "The Duration of the Match",
    8: "The Start and Restart of Play",
    9: "The Ball In and Out of Play",
    10: "Determining the Outcome of a Match",
    11: "Offside",
    12: "Fouls and Misconduct",
    13: "Free Kicks",
    14: "The Penalty Kick",
    15: "The Throw-in",
    16: "The Goal Kick",
    17: "The Corner Kick",
}


def is_footer(line: str) -> bool:
    stripped = line.strip()
    if not stripped:
        return False
    for pat in FOOTER_PATTERNS:
        if pat.match(stripped):
            return True
    return False


def clean_text(text: str) -> str:
    text = re.sub(r"[\u0000-\u0008\u000b\u000c\u000e-\u001f]", "", text)
    text = re.sub(r"\u2002|\u2003|\u2009|\u00a0", " ", text)
    text = re.sub(r"[ \t]+", " ", text)
    return text


def extract_pages(pdf_path: str) -> list[dict]:
    import fitz

    doc = fitz.open(pdf_path)
    pages = []

    after_laws = False

    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        lines = text.split("\n")

        content_lines = [
            l for l in lines if not is_footer(l)
        ]

        raw = "\n".join(content_lines)
        raw = clean_text(raw)
        page_label = page.number + 1

        if raw.strip():
            pages.append({"page": page_label, "text": raw.strip()})

    doc.close()
    return pages


def merge_small_chunks(lines: list[str]) -> list[str]:
    merged = []
    buffer = ""
    for line in lines:
        stripped = line.strip()
        if not stripped:
            if buffer:
                merged.append(buffer.strip())
                buffer = ""
            merged.append("")
            continue
        if (
            buffer
            and not stripped[0].isupper()
            and not stripped.startswith("•")
            and not SECTION_HEADER.match(stripped)
            and not LAW_HEADER.match(stripped)
        ):
            buffer += " " + stripped
        else:
            if buffer:
                merged.append(buffer.strip())
            buffer = stripped
    if buffer:
        merged.append(buffer.strip())
    return merged


VAR_DIVIDER_LINE = re.compile(
    r"video\s*assistant\s*referee\s*\(VAR\)\s*protocol",
    re.IGNORECASE,
)


def detect_laws(pages: list[dict]) -> list[dict]:
    raw_laws = OrderedDict()
    current_law = None
    current_section = "Preamble"
    current_quotes: list[str] = []
    current_page = 0
    done = False

    law_titles: dict[int, str] = {}

    for entry in pages:
        if done:
            break

        page_num = entry["page"]
        text = entry["text"]

        for line in text.split("\n"):
            if done:
                break

            stripped = line.strip()
            if not stripped:
                continue

            if current_law is not None and VAR_DIVIDER_LINE.match(stripped):
                if current_quotes:
                    raw_laws.setdefault(current_law, []).append(
                        {
                            "section": current_section,
                            "text": " ".join(current_quotes),
                            "page": current_page,
                        }
                    )
                done = True
                break

            running_match = LAW_RUNNING.match(stripped)
            if running_match:
                num = int(running_match.group("num"))
                title = running_match.group("title").strip()
                law_titles[num] = title
                if current_law and num != current_law and current_quotes:
                    raw_laws.setdefault(current_law, []).append(
                        {
                            "section": current_section,
                            "text": " ".join(current_quotes),
                            "page": current_page,
                        }
                    )
                    current_law = num
                    current_section = "Preamble"
                    current_quotes = []
                    current_page = page_num
                elif current_law is None:
                    current_law = num
                    current_section = "Preamble"
                    current_quotes = []
                    current_page = page_num
                continue

            div_match = LAW_DIVIDER.match(stripped)
            if div_match:
                num = int(div_match.group("num"))
                if current_law is not None and current_quotes:
                    raw_laws.setdefault(current_law, []).append(
                        {
                            "section": current_section,
                            "text": " ".join(current_quotes),
                            "page": current_page,
                        }
                    )
                current_law = num
                current_section = "Preamble"
                current_quotes = []
                current_page = page_num
                continue

            if current_law is None:
                continue

            section_match = SECTION_HEADER.match(stripped)
            if section_match:
                if current_quotes:
                    raw_laws.setdefault(current_law, []).append(
                        {
                            "section": current_section,
                            "text": " ".join(current_quotes),
                            "page": current_page,
                        }
                    )
                current_section = stripped
                current_quotes = []
                current_page = page_num
                continue

            current_quotes.append(stripped)
            current_page = page_num

    if current_law is not None and current_quotes and not done:
        raw_laws.setdefault(current_law, []).append(
            {
                "section": current_section,
                "text": " ".join(current_quotes),
                "page": current_page,
            }
        )

    laws = []
    for law_num in sorted(raw_laws.keys()):
        title = law_titles.get(law_num, KNOWN_STUBS.get(law_num, f"Law {law_num}"))
        sections = raw_laws[law_num]
        rules = []
        for sec in sections:
            text = sec["text"]
            text = re.sub(r"\s+", " ", text).strip()
            if len(text) < 20:
                continue
            rules.append(
                {
                    "law_number": str(law_num),
                    "law_title": title,
                    "specific_rule": sec["section"],
                    "exact_quote": text,
                    "page_number": sec["page"],
                }
            )
        if rules:
            laws.append({"law_number": law_num, "law_title": title, "rules": rules})

    return laws


VAR_CONTENT_HEADER = re.compile(
    r"^The VAR protocol, as far as possible",
    re.IGNORECASE,
)


def detect_var(pages: list[dict]) -> dict | None:
    var_sections = []
    current_section = "Protocol \u2013 principles, practicalities and procedures"
    current_quotes: list[str] = []
    current_page = 0
    in_var = False

    for entry in pages:
        page_num = entry["page"]
        for line in entry["text"].split("\n"):
            stripped = line.strip()
            if not stripped:
                continue

            if not in_var:
                if VAR_CONTENT_HEADER.match(stripped):
                    in_var = True
                    current_section = "Protocol \u2013 principles, practicalities and procedures"
                    current_quotes = []
                    current_page = page_num
                continue

            if LAW_DIVIDER.match(stripped):
                in_var = False
                if current_quotes:
                    var_sections.append(
                        {
                            "section": current_section,
                            "text": " ".join(current_quotes),
                            "page": current_page,
                        }
                    )
                break

            section_match = SECTION_HEADER.match(stripped)
            if section_match:
                if current_quotes:
                    var_sections.append(
                        {
                            "section": current_section,
                            "text": " ".join(current_quotes),
                            "page": current_page,
                        }
                    )
                current_section = stripped
                current_quotes = []
                current_page = page_num
                continue

            current_quotes.append(stripped)
            current_page = page_num

    if in_var and current_quotes:
        var_sections.append(
            {
                "section": current_section,
                "text": " ".join(current_quotes),
                "page": current_page,
            }
        )

    if not var_sections:
        return None

    rules = []
    for sec in var_sections:
        text = re.sub(r"\s+", " ", sec["text"]).strip()
        if len(text) < 20:
            continue
        rules.append(
            {
                "law_number": "VAR",
                "law_title": "Video assistant referee (VAR) protocol",
                "specific_rule": sec["section"],
                "exact_quote": text,
                "page_number": sec["page"],
            }
        )

    return {
        "law_number": "VAR",
        "law_title": "Video assistant referee (VAR) protocol",
        "rules": rules,
    }


def build_combined_index(laws: list[dict], var_data: dict | None) -> list[dict]:
    combined = []
    for law in laws:
        combined.append(
            {
                "law_number": law["law_number"],
                "law_title": law["law_title"],
                "rule_count": len(law["rules"]),
            }
        )
    if var_data and var_data["rules"]:
        combined.append(
            {
                "law_number": "VAR",
                "law_title": var_data["law_title"],
                "rule_count": len(var_data["rules"]),
            }
        )
    return combined


def save_json(data, filepath: str):
    os.makedirs(os.path.dirname(filepath) or ".", exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"  -> {filepath} ({len(json.dumps(data, ensure_ascii=False))} bytes)")


def main():
    parser = argparse.ArgumentParser(
        description="Extract IFAB Laws of the Game from PDF to structured JSON"
    )
    parser.add_argument("pdf", help="Path to the PDF file")
    parser.add_argument(
        "--output-dir",
        default="src/data/laws",
        help="Output directory for per-law JSON files (default: src/data/laws)",
    )
    parser.add_argument(
        "--combined",
        default="src/data/fifa_laws.json",
        help="Output path for combined index (default: src/data/fifa_laws.json)",
    )
    args = parser.parse_args()

    pdf_path = args.pdf
    if not os.path.exists(pdf_path):
        print(f"Error: PDF not found at {pdf_path}", file=sys.stderr)
        sys.exit(1)

    print(f"Extracting text from {pdf_path} ...")
    pages = extract_pages(pdf_path)
    print(f"  Extracted {len(pages)} pages of content")

    print("\nDetecting laws...")
    laws = detect_laws(pages)
    print(f"  Found {len(laws)} laws")

    print("\nDetecting VAR protocol...")
    var_data = detect_var(pages)
    if var_data:
        print(f"  Found VAR protocol ({len(var_data['rules'])} rules)")
    else:
        print("  VAR protocol not found in PDF")

    os.makedirs(args.output_dir, exist_ok=True)

    print("\nWriting law files...")
    for law in laws:
        num = str(law["law_number"]).zfill(2)
        filepath = os.path.join(args.output_dir, f"law-{num}.json")
        save_json(law, filepath)

    if var_data:
        filepath = os.path.join(args.output_dir, "var-protocol.json")
        save_json(var_data, filepath)

    print("\nWriting combined index...")
    combined = build_combined_index(laws, var_data)
    save_json(combined, args.combined)

    print("\nDone!")


if __name__ == "__main__":
    main()
