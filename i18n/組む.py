#!/usr/bin/env python3
"""訳表.tsv から、ブラウザが読む辞書（i18n/<言語>.js）を書き出す。

  python3 i18n/組む.py

- 訳表の「日本語」より右の列が、そのまま言語になる（zh-Hant、あとで en …）
- 未訳の文は辞書に入らない → 画面では日本語のまま出る。件数をここで表示する
- 「断片:script.js」の行は、組み立て途中の文（例「今日の発酵食品　／　…」）の中でも置き換える
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TABLE = ROOT / 'i18n' / '訳表.tsv'

def main():
    lines = TABLE.read_text(encoding='utf-8').splitlines()
    head = lines[0].split('\t')
    rows = [dict(zip(head, l.split('\t'))) for l in lines[1:]]
    for lang in head[3:]:
        dic, frag, miss = {}, [], []
        for r in rows:
            ja = r['日本語'].replace('⏎', '\n'); tr = r.get(lang, '').replace('⏎', '\n')
            if not tr: miss.append(r['場所']); continue
            dic[ja] = tr
            # 改行で段落に分けて描かれる文もあるので、行の数がそろうときは一行ずつも引けるようにする
            jl, tl = ja.split('\n'), tr.split('\n')
            if len(jl) > 1 and len(jl) == len(tl):
                for a, b in zip(jl, tl):
                    if a.strip() and b.strip(): dic.setdefault(a.strip(), b.strip())
            if r['場所'].startswith('断片:script.js') and '<br>' not in ja: frag.append([ja, tr])
        frag.sort(key=lambda p: -len(p[0]))
        out = ROOT / 'i18n' / f'{lang}.js'
        out.write_text('// 自動生成（i18n/組む.py）。直すときは 訳表.tsv を直して組み直す\n'
                       f'window.I18N = {json.dumps({"lang": lang, "dict": dic, "frag": frag}, ensure_ascii=False)};\n',
                       encoding='utf-8')
        print(f'{lang}: 辞書 {len(dic)}件・断片 {len(frag)}件・未訳 {len(miss)}件 → {out.name}')
        for m in miss[:10]: print('  未訳', m)

if __name__ == '__main__':
    main()
