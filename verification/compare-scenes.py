"""Compare matching screenshots; animation phase makes these diagnostics, not a fidelity score."""
import json
from pathlib import Path
from PIL import Image, ImageChops, ImageStat

root = Path(__file__).parent / "artifacts" / "fidelity"
results = []
for width, height, crop in [(1440, 900, (450, 110, 920, 820)), (1920, 1080, (650, 140, 1220, 980))]:
    for section in ["hero", "desktop"]:
        reference = root / f"reference-before-{section}-{width}.png"
        corrected = root / f"corrected-{width}x{height}-{section}.png"
        if not reference.exists() or not corrected.exists():
            continue
        a, b = Image.open(reference).convert("RGB"), Image.open(corrected).convert("RGB")
        if a.size != b.size:
            continue
        difference = ImageChops.difference(a, b)
        scene = difference.crop(crop)
        results.append({"viewport": [width, height], "section": section,
                        "full_frame_mean_absolute_channel_difference_0_255": sum(ImageStat.Stat(difference).mean) / 3,
                        "scene_crop": crop,
                        "scene_mean_absolute_channel_difference_0_255": sum(ImageStat.Stat(scene).mean) / 3})
        difference.save(root / f"difference-{section}-{width}.png")
(root / "pixel-comparison.json").write_text(json.dumps({
    "interpretation": "Diagnostic only. Text, identity, cursor, blink, pointer pose and random screen flicker differ; images are not synchronized animation frames.",
    "comparisons": results}, indent=2))
print(json.dumps(results, indent=2))
