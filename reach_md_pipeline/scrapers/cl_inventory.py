from __future__ import annotations

import pathlib
import re
import pandas as pd

from scrapers._common import (
    http_session,
    load_config,
    DATA_RAW,
    OUT_MD,
    save_text,
    save_bytes,
    sha256_bytes,
    find_download_links,
    absolutize,
    write_markdown_list,
    write_markdown_per_substance,
    normalize_cas,
    normalize_ec,
)

def _pick_column(cols: list[str], needles: list[str]) -> str | None:
    cols_l = [c.lower() for c in cols]
    for n in needles:
        n = n.lower()
        for i, c in enumerate(cols_l):
            if n in c:
                return cols[i]
    return None

def _clean_text(x) -> str:
    if x is None:
        return ""
    s = str(x).strip()
    s = re.sub(r"\s+", " ", s)
    return s

def _load_machine_readable(landing_url: str, html: str) -> tuple[pd.DataFrame, str] | tuple[None, None]:
    """Find a CSV/XLSX linked from the landing page and load it into a DataFrame."""
    links = find_download_links(html)
    if not links:
        return None, None

    # Prefer CSV then XLSX
    def rank(href: str) -> int:
        h = href.lower()
        if h.endswith('.csv'):
            return 0
        if h.endswith('.xlsx') or h.endswith('.xls'):
            return 1
        return 9

    links = sorted(links, key=rank)
    s = http_session()
    for href in links:
        file_url = absolutize(landing_url, href)
        r = s.get(file_url, timeout=120)
        if r.status_code != 200 or not r.content:
            continue

        b = r.content
        ext = '.csv' if file_url.lower().endswith('.csv') else ('.xlsx' if file_url.lower().endswith('.xlsx') else '.xls')
        snap_name = f"cl_inventory_{sha256_bytes(b)[:10]}{ext}"
        raw_path = (DATA_RAW / ("csv" if ext == '.csv' else "xlsx") / snap_name)
        if ext == '.csv':
            save_bytes(raw_path, b)
            try:
                df = pd.read_csv(raw_path, dtype=str, encoding_errors='ignore')
                return df, file_url
            except Exception:
                continue
        else:
            save_bytes(raw_path, b)
            try:
                df = pd.read_excel(raw_path, dtype=str)
                return df, file_url
            except Exception:
                continue

    return None, None

def _load_html_tables(html: str) -> pd.DataFrame | None:
    try:
        tables = pd.read_html(html)
    except Exception:
        return None
    if not tables:
        return None
    # pick the widest / largest
    tables = sorted(tables, key=lambda d: (d.shape[0]*d.shape[1], d.shape[1], d.shape[0]), reverse=True)
    df = tables[0]
    # stringify
    df = df.astype(str)
    return df

def main() -> None:
    cfg = load_config()
    landing_url = cfg["sources"]["cl_inventory"]
    s = http_session()
    r = s.get(landing_url, timeout=120)
    r.raise_for_status()
    html = r.text
    b = r.content

    snap_name = f"cl_inventory_landing_{sha256_bytes(b)[:10]}.html"
    save_text(DATA_RAW / "html" / snap_name, html)

    df, file_url = _load_machine_readable(landing_url, html)
    source_url = file_url or landing_url

    if df is None:
        df = _load_html_tables(html)

    if df is None or df.empty:
        out = OUT_MD / "reach_cl_inventory.md"
        title_var = "REACH C&L Inventory (ECHA) — best effort"
        write_markdown_list(
            out_path=out,
            title=title_var,
            source_url=landing_url,
            sections=[],
            extra_notes="Could not extract a machine-readable dataset from the landing page during this run. ECHA page structure may have changed.",
        )
        print(f"Wrote stub: {out}")
        return

    df.columns = [str(c).strip() for c in df.columns]

    name_col = _pick_column(df.columns.tolist(), ["substance", "substance name", "name"])
    cas_col = _pick_column(df.columns.tolist(), ["cas"])
    ec_col = _pick_column(df.columns.tolist(), ["ec", "einecs", "elincs"])
    class_col = _pick_column(df.columns.tolist(), ["classification", "hazard class", "clp"])
    h_col = _pick_column(df.columns.tolist(), ["h-statement", "h statement", "hazard statement", "h statements"])
    signal_col = _pick_column(df.columns.tolist(), ["signal word"])
    notes_col = _pick_column(df.columns.tolist(), ["remark", "note", "additional", "info"])

    # Fallback: if no explicit name column, use first column
    if name_col is None:
        name_col = df.columns.tolist()[0]

    sections = []
    for _, row in df.iterrows():
        name = _clean_text(row.get(name_col, ""))
        if not name or name.lower() in ("nan", "none"):
            continue

        cas = normalize_cas(row.get(cas_col)) if cas_col else ""
        ec = normalize_ec(row.get(ec_col)) if ec_col else ""

        fields = {}
        if cas:
            fields["CAS"] = cas
        if ec:
            fields["EC"] = ec
        if class_col:
            v = _clean_text(row.get(class_col, ""))
            if v:
                fields["Classification"] = v
        if h_col:
            v = _clean_text(row.get(h_col, ""))
            if v:
                fields["H-statements"] = v
        if signal_col:
            v = _clean_text(row.get(signal_col, ""))
            if v:
                fields["Signal word"] = v
        if notes_col:
            v = _clean_text(row.get(notes_col, ""))
            if v:
                fields["Notes"] = v

        # Keep any other columns as Extra (small)
        extras = {}
        for c in df.columns:
            if c in (name_col, cas_col, ec_col, class_col, h_col, signal_col, notes_col):
                continue
            val = _clean_text(row.get(c, ""))
            if val and val.lower() not in ("nan", "none"):
                # limit very wide columns
                if len(val) > 500:
                    val = val[:500] + "…"
                extras[c] = val
        if extras:
            # Compact extras into one field
            fields["Extra"] = "; ".join([f"{k}: {v}" for k, v in list(extras.items())[:8]])

        sections.append((name, fields))

    # Deterministic sorting
    def sort_key(item):
        nm, f = item
        cas = f.get("CAS", "")
        ec = f.get("EC", "")
        return (cas or "9999999-99-9", ec, nm.lower())

    sections.sort(key=sort_key)

    title_var = "REACH C&L Inventory (ECHA) — best effort"
    out = OUT_MD / "reach_cl_inventory.md"
    write_markdown_list(
        out_path=out,
        title=title_var,
        source_url=source_url,
        sections=sections,
        extra_notes="One substance per section. Dataset varies by ECHA export; this is best-effort extraction.",
    )

    # Per-substance Markdown files
    out_dir = OUT_MD / "per_substance" / out.stem
    idx = write_markdown_per_substance(
        out_dir=out_dir,
        list_title=title_var,
        source_url=source_url,
        sections=sections,
        extra_notes="One substance per file. Generated from public sources; best-effort extraction.",
    )
    print(f"Wrote per-substance index: {idx}")
    print(f"Wrote: {out}")

if __name__ == "__main__":
    main()
