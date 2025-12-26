from __future__ import annotations
import pandas as pd
from scrapers._common import (
    http_session, load_config, DATA_RAW, OUT_MD, save_text, sha256_bytes,
    write_markdown_list, write_markdown_per_substance, normalize_cas, normalize_ec
)

def main() -> None:
    cfg = load_config()
    url = cfg["sources"]["annex_xvii_restrictions"]
    s = http_session()
    r = s.get(url, timeout=60)
    r.raise_for_status()

    raw_html = r.text
    snap_name = f"annex_xvii_{sha256_bytes(r.content)[:10]}.html"
    save_text(DATA_RAW / "html" / snap_name, raw_html)

    tables = pd.read_html(raw_html)
    if not tables:
        raise RuntimeError("No tables found on Annex XVII page.")
    df = max(tables, key=lambda t: t.shape[0]).copy()
    df.columns = [str(c).strip() for c in df.columns]

    def pick(cols, needles):
        for n in needles:
            for c in cols:
                if n in c.lower():
                    return c
        return None

    cols = list(df.columns)
    col_name = pick(cols, ["substance", "name"])
    col_cas = pick(cols, ["cas"])
    col_ec  = pick(cols, ["ec"])
    col_entry = pick(cols, ["entry", "item", "number"])
    col_restr = pick(cols, ["restriction", "conditions", "limit", "scope", "details"])
    col_link = pick(cols, ["details", "more", "link"])

    sections = []
    for _, row in df.iterrows():
        name = str(row.get(col_name, "")).strip() if col_name else ""
        if not name or name.lower() in ("nan","none"):
            continue
        fields = {}
        if col_entry: fields["Annex XVII entry"] = row.get(col_entry)
        if col_cas: fields["CAS"] = normalize_cas(row.get(col_cas))
        if col_ec: fields["EC"] = normalize_ec(row.get(col_ec))
        if col_restr: fields["Restriction summary"] = row.get(col_restr)
        if col_link: fields["Details"] = row.get(col_link)
        sections.append((name, fields))

    sections.sort(key=lambda it: (str(it[1].get("Annex XVII entry","")).zfill(4), it[0].lower()))

    title_var = "REACH Annex XVII Restrictions List (ECHA)"

    out = OUT_MD / "reach_annex_xvii_restrictions.md"
    write_markdown_list(
        out_path=out,
        title=title_var,
        source_url=url,
        sections=sections,
        extra_notes="Annex XVII restriction language can be long; this file stores a per-substance section with best-effort extracted fields.",
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
