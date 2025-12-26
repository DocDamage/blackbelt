from __future__ import annotations
import pathlib
import pandas as pd
from scrapers._common import (
    http_session, load_config, DATA_RAW, OUT_MD, save_bytes, save_text,
    sha256_bytes, write_markdown_list, write_markdown_per_substance, normalize_cas, normalize_ec
)

def main() -> None:
    cfg = load_config()
    url = cfg["sources"]["svhc_candidate_list"]
    s = http_session()
    r = s.get(url, timeout=60)
    r.raise_for_status()

    raw_html = r.text
    b = r.content
    snap_name = f"svhc_candidate_list_{sha256_bytes(b)[:10]}.html"
    save_text(DATA_RAW / "html" / snap_name, raw_html)

    # Strategy 1: read_html and pick the biggest table
    tables = pd.read_html(raw_html)
    if not tables:
        raise RuntimeError("No tables found on Candidate List page.")

    df = max(tables, key=lambda t: t.shape[0]).copy()
    df.columns = [str(c).strip() for c in df.columns]

    # Heuristics for column names (ECHA can change labels)
    def pick(cols, needles):
        for n in needles:
            for c in cols:
                if n in c.lower():
                    return c
        return None

    cols = list(df.columns)
    col_name = pick(cols, ["substance", "entry", "name"])
    col_cas = pick(cols, ["cas"])
    col_ec  = pick(cols, ["ec", "einecs", "elincs"])
    col_reason = pick(cols, ["reason", "identif", "article 57", "hazard"])
    col_date = pick(cols, ["date", "included", "added", "inclusion"])

    sections = []
    for _, row in df.iterrows():
        name = str(row.get(col_name, "")).strip() if col_name else ""
        if not name or name.lower() in ("nan", "none"):
            continue
        fields = {}
        if col_cas: fields["CAS"] = normalize_cas(row.get(col_cas))
        if col_ec:  fields["EC"]  = normalize_ec(row.get(col_ec))
        if col_reason: fields["Reason / Article 57"] = row.get(col_reason)
        if col_date: fields["Date added"] = row.get(col_date)
        sections.append((name, fields))

    # Sort by CAS then name for determinism
    def sort_key(item):
        name, f = item
        cas = f.get("CAS","")
        return (cas, name.lower())

    sections.sort(key=sort_key)

    title_var = "REACH SVHC Candidate List (ECHA)"

    out = OUT_MD / "reach_svhc_candidate_list.md"
    write_markdown_list(
        out_path=out,
        title=title_var,
        source_url=url,
        sections=sections,
        extra_notes="One substance per section. Values are best-effort extracted from ECHA public tables.",
    )
    # Per-substance Markdown files (RAG-friendly)
    out_dir = OUT_MD / "per_substance" / out.stem
    idx = write_markdown_per_substance(
        out_dir=out_dir,
        list_title=title_var,
        source_url=url,
        sections=sections,
        extra_notes="One substance per file. Generated from public sources; best-effort extraction.",
    )
    print(f"Wrote per-substance index: {idx}")
    print(f"Wrote: {out}")

if __name__ == "__main__":
    main()
