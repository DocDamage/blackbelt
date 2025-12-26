from __future__ import annotations
import os, re, json, time, hashlib, pathlib, datetime
from dataclasses import dataclass
from typing import Optional, Dict, Any, List, Tuple

import requests
from bs4 import BeautifulSoup
import pandas as pd

ROOT = pathlib.Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "config.json"
DATA_RAW = ROOT / "data_raw"
OUT_MD = ROOT / "output" / "md"
LOGS = ROOT / "logs"

def load_config() -> dict:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def http_session() -> requests.Session:
    cfg = load_config()
    s = requests.Session()
    ua = cfg.get("http", {}).get("user_agent")
    if ua:
        s.headers.update({"User-Agent": ua})
    # Gentle defaults
    s.headers.update({
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.8",
    })
    return s

def now_iso() -> str:
    return datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

def sha256_bytes(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()

def save_bytes(path: pathlib.Path, b: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(b)

def save_text(path: pathlib.Path, t: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(t, encoding="utf-8")

def slugify(s: str) -> str:
    s = s.strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-{2,}", "-", s).strip("-")
    return s or "item"

def find_download_links(html: str) -> List[str]:
    # Pull obvious CSV/XLSX links from the page
    soup = BeautifulSoup(html, "lxml")
    links = []
    for a in soup.select("a[href]"):
        href = a.get("href", "")
        if not href:
            continue
        if any(href.lower().endswith(ext) for ext in [".csv", ".xlsx", ".xls"]):
            links.append(href)
    # de-dupe preserve order
    seen = set()
    out = []
    for l in links:
        if l not in seen:
            out.append(l)
            seen.add(l)
    return out

def absolutize(base_url: str, href: str) -> str:
    if href.startswith("http://") or href.startswith("https://"):
        return href
    if href.startswith("//"):
        return "https:" + href
    # relative
    if href.startswith("/"):
        m = re.match(r"^(https?://[^/]+)", base_url)
        return (m.group(1) if m else base_url.rstrip("/")) + href
    return base_url.rstrip("/") + "/" + href.lstrip("/")

def write_markdown_list(
    out_path: pathlib.Path,
    title: str,
    source_url: str,
    sections: List[Tuple[str, Dict[str, Any]]],
    extra_notes: Optional[str] = None,
) -> None:
    lines = []
    lines.append(f"# {title}")
    lines.append("")
    lines.append(f"- Source: {source_url}")
    lines.append(f"- Generated (UTC): {now_iso()}")
    lines.append("")
    if extra_notes:
        lines.append("> " + extra_notes.strip().replace("\n", "\n> "))
        lines.append("")
    for name, fields in sections:
        lines.append(f"## Substance: {name}")
        for k, v in fields.items():
            if v is None or (isinstance(v, float) and pd.isna(v)):
                continue
            vv = str(v).strip()
            if not vv or vv.lower() in ("nan", "none"):
                continue
            lines.append(f"- {k}: {vv}")
        lines.append("")
    save_text(out_path, "\n".join(lines).rstrip() + "\n")


def slugify(value: str, max_len: int = 80) -> str:
    s = (value or "").strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-{2,}", "-", s).strip("-")
    if not s:
        s = "substance"
    return s[:max_len].rstrip("-")

def unique_filename(base: str, ext: str = ".md") -> str:
    # base should already be safe-ish; ensure no collisions by appending short hash if needed
    h = hashlib.sha256(base.encode("utf-8")).hexdigest()[:8]
    return f"{base}-{h}{ext}"

def write_markdown_per_substance(
    out_dir: pathlib.Path,
    list_title: str,
    source_url: str,
    sections: List[Tuple[str, Dict[str, Any]]],
    extra_notes: Optional[str] = None,
) -> pathlib.Path:
    """Write one Markdown file per substance. Returns path to a generated index file."""
    out_dir.mkdir(parents=True, exist_ok=True)

    index_lines: List[str] = []
    index_lines.append(f"# {list_title} — Per-Substance Files")
    index_lines.append("")
    index_lines.append(f"- Source: {source_url}")
    index_lines.append(f"- Generated (UTC): {now_iso()}")
    index_lines.append("")
    if extra_notes:
        index_lines.append("> " + extra_notes.strip().replace("\n", "\n> "))
        index_lines.append("")

    for name, fields in sections:
        cas = str(fields.get("CAS", "") or "").strip()
        ec = str(fields.get("EC", "") or "").strip()
        base_key = cas or ec or name
        base = slugify(base_key)
        filename = unique_filename(base)
        fp = out_dir / filename

        lines: List[str] = []
        lines.append(f"# {name}")
        lines.append("")
        lines.append(f"- List: {list_title}")
        lines.append(f"- Source: {source_url}")
        lines.append(f"- Generated (UTC): {now_iso()}")
        lines.append("")
        if extra_notes:
            lines.append("> " + extra_notes.strip().replace("\n", "\n> "))
            lines.append("")
        for k, v in fields.items():
            if v is None or (isinstance(v, float) and pd.isna(v)):
                continue
            vv = str(v).strip()
            if not vv or vv.lower() in ("nan", "none"):
                continue
            lines.append(f"- {k}: {vv}")
        lines.append("")
        save_text(fp, "\n".join(lines).rstrip() + "\n")

        # Add to index (relative link)
        rel = fp.name
        link_label = f"{name}"
        if cas:
            link_label += f" (CAS {cas})"
        elif ec:
            link_label += f" (EC {ec})"
        index_lines.append(f"- [{link_label}]({rel})")

    index_path = out_dir / "_INDEX.md"
    save_text(index_path, "\n".join(index_lines).rstrip() + "\n")
    return index_path

def normalize_cas(value: Any) -> str:
    if value is None:
        return ""
    s = str(value).strip()
    # Keep typical CAS pattern 2-7 digits - 2 digits - 1 digit
    m = re.search(r"\b(\d{2,7}-\d{2}-\d)\b", s)
    return m.group(1) if m else s

def normalize_ec(value: Any) -> str:
    if value is None:
        return ""
    s = str(value).strip()
    # EC number pattern: 3 digits-3 digits-? (one digit)
    m = re.search(r"\b(\d{3}-\d{3}-\d)\b", s)
    return m.group(1) if m else s
