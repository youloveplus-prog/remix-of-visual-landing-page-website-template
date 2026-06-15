"""
Compare visual screenshots against committed baselines.

Usage:
    python tests/visual/diff.py            # compare, fail if diffs exceed threshold
    python tests/visual/diff.py --update   # overwrite baselines from latest screenshots

Threshold: a pixel counts as "changed" if any channel differs by more than
PIXEL_TOLERANCE. The image fails if the share of changed pixels exceeds
DIFF_RATIO_THRESHOLD.
"""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path
from PIL import Image, ImageChops

ROOT = Path(__file__).parent
SHOTS = ROOT / "__screenshots__"
BASELINES = ROOT / "__baselines__"
DIFFS = ROOT / "__diffs__"

PIXEL_TOLERANCE = 8           # per-channel 0–255
DIFF_RATIO_THRESHOLD = 0.005  # 0.5% of pixels may differ


def iter_screenshots():
    if not SHOTS.exists():
        return
    for path in sorted(SHOTS.rglob("*.png")):
        yield path, path.relative_to(SHOTS)


def update_baselines() -> int:
    count = 0
    for src, rel in iter_screenshots():
        dst = BASELINES / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        count += 1
    print(f"Updated {count} baseline(s) in {BASELINES.relative_to(Path.cwd())}")
    return 0


def compare_pair(current: Path, baseline: Path, diff_out: Path) -> tuple[float, tuple[int, int]]:
    a = Image.open(current).convert("RGB")
    b = Image.open(baseline).convert("RGB")
    if a.size != b.size:
        # Normalize by cropping/padding to the smaller bounding box; report size mismatch.
        w = min(a.size[0], b.size[0])
        h = min(a.size[1], b.size[1])
        a = a.crop((0, 0, w, h))
        b = b.crop((0, 0, w, h))

    diff = ImageChops.difference(a, b)
    bbox = diff.getbbox()
    if bbox is None:
        return 0.0, a.size

    # Count pixels exceeding tolerance.
    changed = 0
    total = a.size[0] * a.size[1]
    px_a = a.load()
    px_b = b.load()
    for y in range(a.size[1]):
        for x in range(a.size[0]):
            ra, ga, ba = px_a[x, y]
            rb, gb, bb = px_b[x, y]
            if (abs(ra - rb) > PIXEL_TOLERANCE
                    or abs(ga - gb) > PIXEL_TOLERANCE
                    or abs(ba - bb) > PIXEL_TOLERANCE):
                changed += 1
    ratio = changed / total

    if ratio > 0:
        # Highlight diff: red overlay on baseline.
        diff_out.parent.mkdir(parents=True, exist_ok=True)
        highlight = b.copy()
        hp = highlight.load()
        for y in range(a.size[1]):
            for x in range(a.size[0]):
                ra, ga, ba = px_a[x, y]
                rb, gb, bb = px_b[x, y]
                if (abs(ra - rb) > PIXEL_TOLERANCE
                        or abs(ga - gb) > PIXEL_TOLERANCE
                        or abs(ba - bb) > PIXEL_TOLERANCE):
                    hp[x, y] = (255, 0, 80)
        highlight.save(diff_out)
    return ratio, a.size


def compare() -> int:
    if not BASELINES.exists():
        print(
            f"No baselines yet at {BASELINES.relative_to(Path.cwd())}. "
            "Run `python tests/visual/diff.py --update` and commit them.",
        )
        return 1

    if DIFFS.exists():
        shutil.rmtree(DIFFS)

    failures = []
    seen = 0
    missing_baseline = []

    for current, rel in iter_screenshots():
        baseline = BASELINES / rel
        if not baseline.exists():
            missing_baseline.append(str(rel))
            continue
        seen += 1
        diff_out = DIFFS / rel
        ratio, size = compare_pair(current, baseline, diff_out)
        status = "OK " if ratio <= DIFF_RATIO_THRESHOLD else "FAIL"
        print(f"  {status}  {rel}  diff={ratio*100:.3f}%  size={size[0]}x{size[1]}")
        if ratio > DIFF_RATIO_THRESHOLD:
            failures.append((str(rel), ratio))

    if missing_baseline:
        print("\nMissing baselines (commit these or run --update):")
        for m in missing_baseline:
            print("  -", m)

    if failures:
        print("\nFAIL — visual diffs exceed threshold:")
        for name, ratio in failures:
            print(f"  - {name}: {ratio*100:.3f}% changed (>{DIFF_RATIO_THRESHOLD*100:.3f}%)")
        print(f"\nDiff overlays written to {DIFFS.relative_to(Path.cwd())}/")
        return 1

    if seen == 0 and not missing_baseline:
        print("No screenshots found to compare.")
        return 1
    print(f"\nPASS — {seen} screenshot(s) within tolerance.")
    return 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--update", action="store_true", help="Overwrite baselines from current screenshots.")
    args = ap.parse_args()
    sys.exit(update_baselines() if args.update else compare())


if __name__ == "__main__":
    main()
