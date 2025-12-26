from __future__ import annotations
import subprocess, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent

SCRIPTS = [
    "scrapers/svhc_candidate_list.py",
    "scrapers/annex_xiv_authorisation.py",
    "scrapers/annex_xvii_restrictions.py",
    "scrapers/cl_inventory.py",
]

def run(script: str) -> None:
    print(f"\n=== Running {script} ===")
    p = subprocess.run([sys.executable, str(ROOT / script)], check=False)
    if p.returncode != 0:
        print(f"!! Script failed: {script} (exit {p.returncode})")

def main() -> None:
    for s in SCRIPTS:
        run(s)
    print("\nDone. Outputs are in output/md/")

if __name__ == "__main__":
    main()
