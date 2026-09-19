#!/usr/bin/env python3
"""アプリで実際に使う文字だけを残したフォントを public/fonts/ に書き出す。

オフラインでも表示できるようにフォントを自前ホストするが、
日本語フォントは全字収録すると 1.9MB あるためサブセット化する。

    pip install fonttools brotli
    python3 scripts/subset-fonts.py
"""
import os
import re
import subprocess
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, 'node_modules', '.cache', 'fonts')
OUT = os.path.join(ROOT, 'public', 'fonts')

SOURCES = {
    'dotgothic16': 'https://fonts.gstatic.com/s/dotgothic16/v21/v6-QGYjBJFKgyw5nSoDAGE7L.ttf',
    'press-start-2p': 'https://fonts.gstatic.com/s/pressstart2p/v16/e3t4euO8T-267oIAQAu6jDQyK0nS.ttf',
}

# 文字を拾うファイル
SCAN_DIRS = [os.path.join(ROOT, 'src')]
SCAN_FILES = [os.path.join(ROOT, 'index.html'), os.path.join(ROOT, 'vite.config.ts')]
SCAN_EXT = ('.ts', '.tsx', '.css', '.html')

# 取りこぼし防止のため、かな・記号は範囲でまとめて残す
ALWAYS = set()
for lo, hi in [
    (0x20, 0x7E),      # ASCII
    (0x3000, 0x303F),  # 句読点・括弧
    (0x3040, 0x309F),  # ひらがな
    (0x30A0, 0x30FF),  # カタカナ
    (0xFF01, 0xFF5E),  # 全角英数記号
    (0xFF61, 0xFF9F),  # 半角カナ
]:
    ALWAYS.update(chr(c) for c in range(lo, hi + 1))
ALWAYS.update('—–…※・〜○●◯△□■◆☆★♪←→↑↓✓№㎡°′″¥')


def collect_chars() -> set:
    chars = set(ALWAYS)
    files = list(SCAN_FILES)
    for d in SCAN_DIRS:
        for base, _dirs, names in os.walk(d):
            for n in names:
                if n.endswith(SCAN_EXT):
                    files.append(os.path.join(base, n))
    for f in files:
        if not os.path.exists(f):
            continue
        with open(f, encoding='utf-8') as fh:
            chars.update(fh.read())
    # 制御文字は不要
    return {c for c in chars if ord(c) >= 0x20}


def fetch(name: str, url: str) -> str:
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, f'{name}.ttf')
    if not os.path.exists(path):
        print(f'  downloading {name} ...')
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as res, open(path, 'wb') as out:
            out.write(res.read())
    return path


def main() -> int:
    chars = collect_chars()
    print(f'収録する文字数: {len(chars)}')
    os.makedirs(OUT, exist_ok=True)
    text = ''.join(sorted(chars))
    for name, url in SOURCES.items():
        src = fetch(name, url)
        dst = os.path.join(OUT, f'{name}.woff2')
        cmd = [
            sys.executable, '-m', 'fontTools.subset', src,
            f'--text={text}',
            '--flavor=woff2',
            '--layout-features=*',
            '--no-hinting',
            '--desubroutinize',
            f'--output-file={dst}',
        ]
        subprocess.run(cmd, check=True)
        print(f'  {name}.woff2  {os.path.getsize(dst) / 1024:.1f} KB')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
