#!/usr/bin/env python3
"""
test_image_ops.py

A ready-to-run test harness for your image transform functions.

What it does:
1) Runs doctests found in your module (default: image_ops.py).
2) Generates a synthetic test image if you don't provide input files.
3) Applies mirror, grey, invert, compress, and (if two inputs) merge.
4) Saves all outputs to ./out/

Usage examples:
  python test_image_ops.py
  python test_image_ops.py --module image_ops --inputs cat.jpg
  python test_image_ops.py --module image_ops --inputs cat.jpg dog.jpg

Requirements:
  - Pillow (PIL): pip install pillow
  - Your module file (default: image_ops.py) must be in the same folder or on PYTHONPATH.
"""

import argparse
import os
import sys
import importlib
import doctest
from pathlib import Path
from typing import List

# Try to import PIL here to catch missing dependency early
try:
    from PIL import Image, ImageDraw
except Exception as e:
    print("Error: Pillow (PIL) is required for this test script.")
    print("Install with: pip install pillow")
    raise


def ensure_out_dir(path: str = "out") -> Path:
    p = Path(path)
    p.mkdir(parents=True, exist_ok=True)
    return p


def make_synthetic_image(path: Path, size=(256, 256)) -> None:
    """
    Create a simple synthetic image (checkerboard + gradient) for testing.
    """
    w, h = size
    img = Image.new("RGB", (w, h))
    draw = ImageDraw.Draw(img)

    # checkerboard
    tile = 32
    for y in range(0, h, tile):
        for x in range(0, w, tile):
            c = 200 if ((x // tile + y // tile) % 2 == 0) else 55
            draw.rectangle([x, y, x + tile - 1, y + tile - 1], fill=(c, c, c))

    # gradient overlay
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
    ap.add_argument("--module", default="image_ops",
                    help="Python module name containing your functions (default: image_ops)")
    ap.add_argument("--inputs", nargs="*", default=[],
                    help="0, 1, or 2 input image files. If omitted, a synthetic image is generated.")
    ap.add_argument("--outdir", default="out", help="Directory to write outputs (default: out)")
    return ap.parse_args()


def run_doctests(module_name: str) -> None:
    print(f"== Running doctests in module '{module_name}' ==")
    mod = importlib.import_module(module_name)
    # Run doctests with verbose output
    doctest.testmod(mod, verbose=True)
    print("== Doctests completed ==\n")


def main() -> None:
    args = parse_args()
    outdir = ensure_out_dir(args.outdir)

    # Import user module
    try:
        mod = importlib.import_module(args.module)
    except ModuleNotFoundError as e:
        print(f"Could not import module '{args.module}'. "
              f"Ensure the file '{args.module}.py' is in this folder or on PYTHONPATH.")
        raise

    # Validate required functions exist
    required_funcs = ["get_raw_image", "image_from_raw", "mirror", "grey", "invert", "compress", "merge"]
    missing = [f for f in required_funcs if not hasattr(mod, f)]
    if missing:
        print("Your module is missing required functions:", ", ".join(missing))
        sys.exit(1)

    # 1) Run doctests
    run_doctests(args.module)

    # 2) Prepare input images
    input_paths: List[Path] = [Path(p) for p in args.inputs]

    if len(input_paths) == 0:
        # Make a synthetic test image
        synth = outdir / "synthetic_input.png"
        print(f"No inputs provided. Creating synthetic image at {synth} ...")
        make_synthetic_image(synth)
        input_paths = [synth]
    elif len(input_paths) > 2:
        print("Provide at most two input images; extra inputs will be ignored.")
        input_paths = input_paths[:2]

    # 3) Load and transform images
    #    We use the I/O helpers from the user's module.
    print("== Loading inputs ==")
    raws: List = []
    for idx, p in enumerate(input_paths):
        if not p.exists():
            print(f"Input file not found: {p}")
            sys.exit(1)
        raw = mod.get_raw_image(str(p))
        raws.append(raw)
        print(f"  Loaded {p.name}: {len(raw)}x{len(raw[0]) if raw else 0}")

    # Always test transforms on the first image
    import copy
    base = raws[0]
    raw_mirror = copy.deepcopy(base)
    raw_grey = copy.deepcopy(base)
    raw_invert = copy.deepcopy(base)
    raw_compress = copy.deepcopy(base)

    print("== Applying transforms on first image ==")
    mod.mirror(raw_mirror)
    mod.grey(raw_grey)
    mod.invert(raw_invert)
    comp = mod.compress(raw_compress)

    # 4) Save outputs
    in_name = Path(input_paths[0]).stem
    mod.image_from_raw(raw_mirror, str(outdir / f"{in_name}_mirror.png"))
    mod.image_from_raw(raw_grey,   str(outdir / f"{in_name}_grey.png"))
    mod.image_from_raw(raw_invert, str(outdir / f"{in_name}_invert.png"))
    mod.image_from_raw(comp,       str(outdir / f"{in_name}_compress.png"))
    print(f"Saved: {outdir / f'{in_name}_mirror.png'}")
    print(f"Saved: {outdir / f'{in_name}_grey.png'}")
    print(f"Saved: {outdir / f'{in_name}_invert.png'}")
    print(f"Saved: {outdir / f'{in_name}_compress.png'}")

    # 5) If we have two images, test merge
    if len(raws) == 2:
        print("== Merging two inputs (alternating rows) ==")
        merged = mod.merge(raws[0], raws[1])
        a_name = Path(input_paths[0]).stem
        b_name = Path(input_paths[1]).stem
        out_path = outdir / f"{a_name}_{b_name}_merged.png"
        mod.image_from_raw(merged, str(out_path))
        print(f"Saved: {out_path}")

    print("\nAll tests finished. Check the 'out' folder for results.")


if __name__ == "__main__":
    main()
