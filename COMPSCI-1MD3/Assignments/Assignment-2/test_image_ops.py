#!/usr/bin/env python3
"""
test_image_ops.py

A ready-to-run test harness for assignment2.py.

Usage examples:
  python test_image_ops.py
  python test_image_ops.py --inputs cat.jpg
  python test_image_ops.py --inputs cat.jpg dog.jpg
"""

import argparse
import os
import sys
import importlib
import doctest
from pathlib import Path
from typing import List

try:
    from PIL import Image, ImageDraw
except Exception:
    print("Install Pillow first: pip install pillow")
    raise


def ensure_out_dir(path: str = "out") -> Path:
    p = Path(path)
    p.mkdir(parents=True, exist_ok=True)
    return p


def make_synthetic_image(path: Path, size=(256, 256)) -> None:
    w, h = size
    img = Image.new("RGB", (w, h))
    draw = ImageDraw.Draw(img)
    tile = 32
    for y in range(0, h, tile):
        for x in range(0, w, tile):
            c = 200 if ((x // tile + y // tile) % 2 == 0) else 55
            draw.rectangle([x, y, x + tile - 1, y + tile - 1], fill=(c, c, c))
    for y in range(h):
        for x in range(w):
            r = (x * 255) // (w - 1)
            g = (y * 255) // (h - 1)
            b = ((x + y) * 255) // (w + h - 2)
            base = img.getpixel((x, y))
            img.putpixel((x, y), tuple(min(255, (base[i] + (r, g, b)[i]) // 2) for i in range(3)))
    img.save(path)


def parse_args() -> argparse.Namespace:
    ap = argparse.ArgumentParser()
    ap.add_argument("--module", default="assignment2",
                    help="Python module name (default: assignment2)")
    ap.add_argument("--inputs", nargs="*", default=[],
                    help="0, 1, or 2 image files to test.")
    ap.add_argument("--outdir", default="out", help="Directory for output images.")
    return ap.parse_args()


def run_doctests(module_name: str) -> None:
    print(f"== Running doctests in module '{module_name}' ==")
    mod = importlib.import_module(module_name)
    doctest.testmod(mod, verbose=True)
    print("== Doctests completed ==\n")


def main() -> None:
    args = parse_args()
    outdir = ensure_out_dir(args.outdir)

    mod = importlib.import_module(args.module)
    run_doctests(args.module)

    input_paths = [Path(p) for p in args.inputs]
    if not input_paths:
        synth = outdir / "synthetic_input.png"
        print(f"No inputs provided. Creating synthetic image at {synth} ...")
        make_synthetic_image(synth)
        input_paths = [synth]

    raws: List = []
    for p in input_paths:
        raw = mod.get_raw_image(str(p))
        raws.append(raw)
        print(f"Loaded {p.name}: {len(raw)}x{len(raw[0]) if raw else 0}")

    import copy
    base = raws[0]
    raw_mirror = copy.deepcopy(base)
    raw_grey = copy.deepcopy(base)
    raw_invert = copy.deepcopy(base)
    raw_compress = copy.deepcopy(base)

    mod.mirror(raw_mirror)
    mod.grey(raw_grey)
    mod.invert(raw_invert)
    comp = mod.compress(raw_compress)

    name = Path(input_paths[0]).stem
    mod.image_from_raw(raw_mirror, str(outdir / f"{name}_mirror.png"))
    mod.image_from_raw(raw_grey, str(outdir / f"{name}_grey.png"))
    mod.image_from_raw(raw_invert, str(outdir / f"{name}_invert.png"))
    mod.image_from_raw(comp, str(outdir / f"{name}_compress.png"))

    if len(raws) == 2:
        merged = mod.merge(raws[0], raws[1])
        out_path = outdir / f"{Path(input_paths[0]).stem}_{Path(input_paths[1]).stem}_merged.png"
        mod.image_from_raw(merged, str(out_path))
        print(f"Saved: {out_path}")

    print("\nAll tests finished. Check the 'out' folder for results.")


if __name__ == "__main__":
    main()
