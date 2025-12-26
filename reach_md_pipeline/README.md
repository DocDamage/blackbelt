# REACH → Markdown Pipeline (One substance per section)

This pack downloads and/or scrapes **public ECHA REACH/CLP list data** and converts it into **Markdown** with:
- **One substance per Markdown section**
- Deterministic ordering
- Source + timestamp headers
- Raw snapshots saved under `data_raw/`

## What it generates
- `output/md/reach_svhc_candidate_list.md`
- `output/md/reach_annex_xiv_authorisation.md`
- `output/md/reach_annex_xvii_restrictions.md`
- `output/md/reach_cl_inventory.md` *(best-effort: depends on what ECHA exposes for download)*

## Setup
```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
```

## Run everything
```bash
python run_all.py
```

## Run individually
```bash
python scrapers/svhc_candidate_list.py
python scrapers/annex_xiv_authorisation.py
python scrapers/annex_xvii_restrictions.py
python scrapers/cl_inventory.py
```

## Notes / Reality
- ECHA pages sometimes use dynamic rendering. The scrapers use multiple strategies:
  1) `pandas.read_html()` on the page content
  2) Link discovery for `.csv` / `.xlsx` download files
  3) Fallback heuristics
- If ECHA changes markup, you’ll update selectors in the corresponding scraper.
- This is designed for **on-prem** conversion and **does not** bundle any proprietary datasets.

## Output format (example)
Each substance becomes:
```md
## Substance: <Name>
- CAS: ...
- EC: ...
- ...
```



## Per-substance outputs (RAG-friendly)

In addition to the consolidated list Markdown files, the pipeline writes one Markdown file per substance under:

- `output/md/per_substance/<list_stem>/`

Each list folder contains `_INDEX.md` linking to every substance file.
