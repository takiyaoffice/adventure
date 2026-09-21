#!/usr/bin/env python3
"""アプリのアイコンを生成する。

    pip install pillow
    python3 scripts/generate-icons.py

元になる紋章は scripts/icon-crest.png（背景を切り抜いた PNG）。
黒地の正方形に、余白なしで（上下いっぱいに）配置する。
"""
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CREST = os.path.join(ROOT, 'scripts', 'icon-crest.png')
PUBLIC = os.path.join(ROOT, 'public')

BG = (0, 0, 0)


def build(size: int, fill: float = 1.0) -> Image.Image:
    """黒の正方形に紋章を置く。fill は高さに対する紋章の割合。"""
    crest = Image.open(CREST).convert('RGBA')
    h = round(size * fill)
    w = round(crest.width * h / crest.height)
    if w > size:  # 横がはみ出すときは幅に合わせる
        w = size
        h = round(crest.height * w / crest.width)
    crest = crest.resize((w, h), Image.LANCZOS)
    out = Image.new('RGB', (size, size), BG)
    out.paste(crest, ((size - w) // 2, (size - h) // 2), crest)
    # 写真的な画像なので PNG だと重い。アイコンの大きさなら 256 色で見分けがつかない
    return out.quantize(colors=256, method=Image.MEDIANCUT, dither=Image.FLOYDSTEINBERG)


def main() -> int:
    os.makedirs(os.path.join(PUBLIC, 'icons'), exist_ok=True)
    targets = [
        ('icons/icon-192.png', 192, 1.0),
        ('icons/icon-512.png', 512, 1.0),
        # maskable は端が切り取られるので、安全領域（中央80%）に収める
        ('icons/icon-maskable-512.png', 512, 0.78),
        ('apple-touch-icon.png', 192, 1.0),
        ('favicon.png', 64, 1.0),
    ]
    for name, size, fill in targets:
        path = os.path.join(PUBLIC, name)
        build(size, fill).save(path, optimize=True)
        print(f'  {name}  {size}x{size}  {os.path.getsize(path) / 1024:.1f} KB')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
