#!/usr/bin/env python3
"""画面で使う文字が、サブセット済みフォントに全部入っているか確かめる。

    python3 scripts/check-fonts.py

足りない字があると、その字だけ別のフォントで表示されて見た目が崩れる。
文言を変えたあとは scripts/subset-fonts.py を実行し直すこと。
"""
import os
import sys

from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCAN_EXT = ('.ts', '.tsx', '.css', '.html')


def used_chars() -> set:
    chars = set()
    for base, _dirs, names in os.walk(os.path.join(ROOT, 'src')):
        for n in names:
            if n.endswith(SCAN_EXT):
                with open(os.path.join(base, n), encoding='utf-8') as f:
                    chars.update(f.read())
    for extra in ('index.html', 'vite.config.ts'):
        path = os.path.join(ROOT, extra)
        if os.path.exists(path):
            with open(path, encoding='utf-8') as f:
                chars.update(f.read())
    return {c for c in chars if ord(c) >= 0x20}


def main() -> int:
    ok = True
    for name in ('dotgothic16', 'press-start-2p'):
        path = os.path.join(ROOT, 'public', 'fonts', f'{name}.woff2')
        cmap = TTFont(path).getBestCmap()
        missing = sorted(c for c in used_chars() if ord(c) not in cmap)
        if name == 'press-start-2p':
            # 英字フォントは ASCII だけ入っていれば良い
            missing = [c for c in missing if ord(c) < 0x80]
        if missing:
            ok = False
            print(f'{name}: 足りない字 {len(missing)}文字 → {"".join(missing)}')
        else:
            print(f'{name}: 不足なし')
    if not ok:
        print('\npython3 scripts/subset-fonts.py を実行してフォントを作り直してください。')
    return 0 if ok else 1


if __name__ == '__main__':
    sys.exit(main())
