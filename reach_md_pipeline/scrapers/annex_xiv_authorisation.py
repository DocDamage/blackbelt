from __future__ import annotations
import pandas as pd
from scrapers._common import (
    http_session, load_config, DATA_RAW, OUT_MD, save_text,
    sha256_bytes, write_markdown_list, write_markdown_per_substance, normalize_cas, normalize_ec
)

def main() -> None:
    cfg = load_config()
    url = cfg["sources"]["annex_xiv_authorisation"]
    s = http_session()
    r = s.get(url, timeout=60)
    r.raise_for_status()

    raw_html = r.text
    snap_name = f"annex_xiv_{sha256_bytes(r.content)[:10]}.html"
    save_text(DATA_RAW / "html" / snap_name, raw_html)

    tables = pd.read_html(raw_html)
    if not tables:
        raise RuntimeError("No tables found on Annex XIV page.")
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
    col_lad = pick(cols, ["latest application", "application date"])
    col_sunset = pick(cols, ["sunset"])

    sections = []
    for _, row in df.iterrows():
        name = str(row.get(col_name, "")).strip() if col_name else ""
        if not name or name.lower() in ("nan","none"):
            continue
        fields = {}
        if col_cas: fields["CAS"] = normalize_cas(row.get(col_cas))
        if col_ec: fields["EC"] = normalize_ec(row.get(col_ec))
        if col_lad: fields["Latest application date"] = row.get(col_lad)
        if col_sunset: fields["Sunset date"] = row.get(col_sunset)
        sections.append((name, fields))

    sections.sort(key=lambda it: (it[1].get("CAS",""), it[0].lower()))

    title_var = "REACH Annex XIV Authorisation List (ECHA)"

    out = OUT_MD / "reach_annex_xiv_authorisation.md"
    write_markdown_list(
        out_path=out,
        title=title_var,
        source_url=url,
        sections=sections,
        extra_notes="Annex XIV substances subject to authorisation. Dates are critical for compliance planning.",
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
