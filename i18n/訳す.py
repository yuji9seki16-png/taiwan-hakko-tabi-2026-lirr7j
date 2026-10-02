#!/usr/bin/env python3
"""Web展示の訳表づくり（訳す担当＝クロ）。

  python3 i18n/訳す.py --dry-run    訳がまだない文の数だけ見る
  python3 i18n/訳す.py              足りない訳をつくって 訳表.tsv に足す（--lang en で英語。既定は zh-Hant）

訳表.tsv の列：キー／場所／日本語／zh-Hant（列は言語を足すたびに右へ増やす）
- キー＝日本語原文の sha1 先頭12桁。日本語を直すとキーが変わり、その文だけ訳し直しになる
- 改行は ⏎ で1行に畳む
- 拾うのは *-data.js（章データ）＋画面の文言（HTML・JS。タグと ${…} で切った断片）
"""
import argparse, concurrent.futures as cf, glob, hashlib, json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TABLE = ROOT / 'i18n' / '訳表.tsv'
JA = re.compile(r'[぀-ヿ一-鿿]')
SKIP = {'src', 'source', 'visibility', 'boundarySource', 'id', 'number'}
BATCH_CHARS = 2500
WORKERS = 2

def key(t): return hashlib.sha1(t.encode()).hexdigest()[:12]
def fold(t): return t.replace('\n', '⏎')

def extract():
    rows, seen = [], set()
    def walk(o, path, f):
        if isinstance(o, dict):
            for k, v in o.items():
                if k not in SKIP: walk(v, path + [k], f)
        elif isinstance(o, list):
            for i, v in enumerate(o): walk(v, path + [str(i)], f)
        elif isinstance(o, str) and JA.search(o):
            k = key(o)
            if k not in seen:
                seen.add(k); rows.append((k, f + ':' + '.'.join(path), o))
    for f in sorted(glob.glob(str(ROOT / '*-data.js'))):
        s = Path(f).read_text(encoding='utf-8')
        m = re.search(r'=\s*(\{.*\})\s*;?\s*$', s, re.S)
        walk(json.loads(m.group(1)), [], Path(f).name)
    # 画面の文言：HTMLの文字・属性、JSの文字列（タグと ${…} で切った断片）
    def add(t, where):
        t = re.sub(r'^(\s*<br\s*/?>)+|(<br\s*/?>\s*)+$', '', t.replace('\\n', '\n')).strip()
        t = re.sub(r'<br\s*/?>', '<br>', t)
        if t and JA.search(t) and not re.fullmatch(r'[ァ-ヶー・]+', t):
            k = key(t)
            if k not in seen: seen.add(k); rows.append((k, where, t))
    def pieces(t): return re.split(r'<(?!br\b)[^>]*>|\$\{[^}]*\}', t)  # <br> は文の一部として残す
    for f in sorted(glob.glob(str(ROOT / '*.html'))):
        s = Path(f).read_text(encoding='utf-8'); name = Path(f).name
        s = re.sub(r'<(script|style)\b.*?</\1>', ' ', s, flags=re.S)
        for a in re.findall(r'(?:alt|aria-label|title)="([^"]*)"', s): add(a, '画面:' + name + ':属性')
        for t in pieces(s): add(t, '画面:' + name)
    for f in sorted(glob.glob(str(ROOT / '*.js'))):
        name = Path(f).name
        if name.endswith('-data.js'): continue
        s = Path(f).read_text(encoding='utf-8')
        for lit in re.findall(r"'((?:[^'\\\n]|\\.)*)'|\"((?:[^\"\\\n]|\\.)*)\"|`([^`]*)`", s):
            for t in pieces(''.join(lit)):
                add(t, '断片:' + name)  # 引用符を含んだまま画面に出る文もある（出典の論文名など）
                for part in re.split(r'[\'"]', t): add(part, '断片:' + name)
    return rows

def load_table():
    if not TABLE.exists(): return ['キー', '場所', '日本語', LANG], {}
    lines = TABLE.read_text(encoding='utf-8').splitlines()
    head = lines[0].split('\t'); out = {}
    for l in lines[1:]:
        p = l.split('\t'); out[p[0]] = dict(zip(head, p))
    return head, out

def save_table(head, rows, table):
    lines = ['\t'.join(head)]
    for k, where, ja in rows:
        r = table.get(k, {})
        lines.append('\t'.join([k, where, fold(ja)] + [r.get(h, '') for h in head[3:]]))
    TABLE.write_text('\n'.join(lines) + '\n', encoding='utf-8')

SYSTEM_ZH = """你是發酵食堂カモシカ（Kamoshika Fermentation）的譯者，把網頁展覽「台灣一周・發酵之旅 2026」從日文翻成台灣繁體中文。
作者是關雄介（日本京都嵐山的發酵食堂共同經營者），文字是他旅行台灣時的第一人稱紀錄，語氣安靜、具體、有身體感，不誇張、不說教。
- 用台灣讀者自然的繁體中文與台灣用語（不要大陸用語）。
- 保留作者的節奏：短句就譯成短句，不要加解釋、不要美化。
- 固有名詞、人名、地名要與下面「既有小冊子譯文」一致（例：劉還月、Megan、Eagle）。台灣地名用台灣正式寫法（例：花蓮縣富里鄉）。
- 用語表的寫法優先。
- 「⏎」是換行，原文有幾個就保留幾個，位置對應。
- 並列的中點用台灣的間隔號「‧」，不要用日文的「・」。
- 原文裡的 HTML 標籤（<br> 等）照原樣保留在對應位置。
- 文獻名、論文標題、學名、URL 照原文，不要翻譯。中文文獻本來就是中文。
- 「第2章」這類章名譯成「第2章」，「終章」譯成「終章」。
- 日期、數字照原文。帶「（ ）」的日文讀音說明，若對台灣讀者無意義可省略。
- 只輸出 [n] 譯文，一行一筆，不要其他文字。"""

SYSTEM_EN = """You translate the web exhibition "Around Taiwan: A Fermentation Journey 2026" for Kamoshika Fermentation, from Japanese into English.
The author is Yusuke Seki, co-owner of a fermentation restaurant in Arashiyama, Kyoto. The text is his first-person record of travelling around Taiwan: quiet, concrete, bodily, never hyped, never preachy.
- Write natural, plain English. Keep the author's rhythm: short lines stay short. Do not add explanations or embellish.
- Proper nouns, people and place names must match the existing booklet translation below (e.g. Liu Huan-yue, Megan, Eagle). Taiwanese places use the usual Taiwanese romanization in the booklet.
- The glossary spelling (en column) wins.
- "⏎" is a line break. Keep exactly as many, in matching positions.
- Keep HTML tags such as <br> in the matching positions.
- Titles of books/papers, scientific names and URLs stay as they are.
- "第2章" → "Chapter 2", "終章" → "Epilogue".
- Keep dates and numbers. Japanese reading aids in （ ） can be dropped when meaningless to English readers.
- The brand name is "Kamoshika Fermentation" (no period). "発酵食堂カモシカ" → "Kamoshika Fermentation" unless the restaurant itself is meant ("our restaurant in Arashiyama").
- Output only "[n] translation", one per line, nothing else."""

BOOKS = ROOT.parent / '最終編集_Claude'
LANGS = {
    'zh-Hant': dict(system=SYSTEM_ZH, booklet=BOOKS / '繁体字' / '組版' / 'translation.tsv',
                    glossary=Path.home() / 'kamoshika' / 'content' / 'i18n' / 'glossary_zh-Hant.tsv',
                    head='## 用語表', book='## 既有小冊子譯文（同一趟旅程，台灣讀者評價很高。作為文體與專有名詞的範本）',
                    items='## 要翻譯的文字（括號內是位置，僅供參考，不要翻譯）', out='輸出 {n} 行：[1] … [{n}]'),
    'en': dict(system=SYSTEM_EN, booklet=BOOKS / '英語' / '組版' / 'translation.tsv',
               glossary=Path.home() / 'kamoshika' / 'content' / 'captions_global' / 'glossary_global.tsv',
               head='## Glossary', book='## Existing booklet translation (same journey; model for tone and proper nouns)',
               items='## Text to translate (location in parentheses is context only, do not translate it)', out='Output {n} lines: [1] … [{n}]'),
}
LANG = 'zh-Hant'


def build_prompt(batch):
    c = LANGS[LANG]
    gloss = c['glossary'].read_text(encoding='utf-8')
    booklet = c['booklet'].read_text(encoding='utf-8')
    items = '\n'.join(f'[{i+1}] （{where}）{fold(ja)}' for i, (_, where, ja) in enumerate(batch))
    return (f"{c['head']}\n{gloss}\n\n{c['book']}\n{booklet}\n\n{c['items']}\n{items}\n\n" + c['out'].format(n=len(batch)))

def call(prompt):
    r = subprocess.run(['claude', '-p', '--model', 'opus', '--tools', '', '--no-session-persistence',
                        '--strict-mcp-config', '--setting-sources', 'local', '--system-prompt', LANGS[LANG]['system']],
                       input=prompt, capture_output=True, text=True, timeout=1800)
    if r.returncode: raise RuntimeError(r.stderr[-500:] or r.stdout[-500:])
    return r.stdout

def translate(batch):
    for attempt in range(2):
        out = dict((int(n), t.strip()) for n, t in re.findall(r'^\[(\d+)\]\s*(.*)$', call(build_prompt(batch)), re.M))
        if all(i + 1 in out and out[i + 1] for i in range(len(batch))):
            bad = [i + 1 for i, (_, _, ja) in enumerate(batch) if fold(ja).count('⏎') != out[i + 1].count('⏎') or ja.count('<br>') != out[i + 1].count('<br>')]
            if not bad: return [out[i + 1] for i in range(len(batch))]
            print(f'  改行の数が合わない {bad}、やり直し', flush=True)
        else:
            print(f'  行がそろわない（{len(out)}/{len(batch)}）、やり直し', flush=True)
    raise RuntimeError('2回とも形がそろわなかった')

def main():
    global LANG
    ap = argparse.ArgumentParser(); ap.add_argument('--dry-run', action='store_true'); ap.add_argument('--lang', default='zh-Hant', choices=LANGS)
    a = ap.parse_args(); LANG = a.lang
    rows = extract(); head, table = load_table()
    if LANG not in head: head.append(LANG)
    todo = [r for r in rows if not table.get(r[0], {}).get(LANG)]
    print(f'文 {len(rows)}件／訳がまだない {len(todo)}件（{sum(len(r[2]) for r in todo)}字）', flush=True)
    if a.dry_run or not todo: save_table(head, rows, table); return
    batches, cur, n = [], [], 0
    for r in todo:
        if cur and n + len(r[2]) > BATCH_CHARS: batches.append(cur); cur, n = [], 0
        cur.append(r); n += len(r[2])
    if cur: batches.append(cur)
    with cf.ThreadPoolExecutor(WORKERS) as ex:
        futs = {ex.submit(translate, b): b for b in batches}
        for f in cf.as_completed(futs):
            b = futs[f]
            try:
                for (k, _, _), zh in zip(b, f.result()): table.setdefault(k, {})[LANG] = zh
                save_table(head, rows, table)
                print(f'束 {b[0][1]} …（{len(b)}件）済み', flush=True)
            except Exception as e:
                print(f'❌ 束 {b[0][1]}: {e}', flush=True)
    left = sum(1 for r in rows if not table.get(r[0], {}).get(LANG))
    print(f'おわり：残り {left}件', flush=True)

if __name__ == '__main__':
    main()
