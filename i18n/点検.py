#!/usr/bin/env python3
"""訳表の点検（確かめ役）。原文と訳を突き合わせ、直したほうがよい行だけを書き出す。訳表は書き換えない。

  python3 i18n/点検.py --lang en      → i18n/点検_en.tsv（キー／場所／日本語／いまの訳／直し案／理由）
"""
import argparse, concurrent.futures as cf, re, subprocess
from pathlib import Path
import importlib.util

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('yaku', ROOT / 'i18n' / '訳す.py'); Y = importlib.util.module_from_spec(spec); spec.loader.exec_module(Y)
BATCH_CHARS = 5000
WORKERS = 2

SYSTEM = {
 'en': """You are the second reader (checker) for the English version of a web exhibition by Kamoshika Fermentation, a fermentation restaurant in Arashiyama, Kyoto. It is a first-person travel record of a trip around Taiwan: quiet, concrete, never hyped.
Compare each Japanese source with its English translation. Report ONLY lines that should change:
- mistranslation or missing/added meaning
- names, places or terms inconsistent with the booklet translation or the glossary, or inconsistent across lines
- clearly unnatural or awkward English (not mere taste)
- "⏎" count or <br> tags not matching
Do not rewrite lines that are fine. Keep the author's short rhythm.
Output one line per problem: [n] <corrected English> ||| <reason in Japanese, short>
If nothing needs fixing, output: NONE""",
 'zh-Hant': """你是發酵食堂カモシカ網頁展覽繁體中文版的第二位讀者（校對）。逐行比對日文原文與台灣繁體中文譯文，只列出需要修改的行：誤譯或漏譯、與小冊子譯文或用語表不一致、明顯不自然的中文或大陸用語、⏎ 或 <br> 數量不符。沒問題的行不要改。
每個問題一行：[n] <修改後的譯文> ||| <理由（用日文，簡短）>
都沒問題就輸出：NONE""",
}

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--lang', default='en'); a = ap.parse_args(); lang = a.lang
    Y.LANG = lang
    head, table = Y.load_table(); rows = Y.extract()
    items = [(k, w, ja, table[k][lang]) for k, w, ja in rows if table.get(k, {}).get(lang)]
    batches, cur, n = [], [], 0
    for it in items:
        if cur and n + len(it[2]) + len(it[3]) > BATCH_CHARS: batches.append(cur); cur, n = [], 0
        cur.append(it); n += len(it[2]) + len(it[3])
    if cur: batches.append(cur)
    c = Y.LANGS[lang]
    gloss = c['glossary'].read_text(encoding='utf-8'); book = c['booklet'].read_text(encoding='utf-8')

    def check(b):
        body = '\n'.join(f'[{i+1}] （{w}）\nJA: {Y.fold(ja)}\nTR: {tr}' for i, (_, w, ja, tr) in enumerate(b))
        prompt = f"{c['head']}\n{gloss}\n\n{c['book']}\n{book}\n\n## Lines\n{body}"
        r = subprocess.run(['claude', '-p', '--model', 'opus', '--tools', '', '--no-session-persistence',
                            '--strict-mcp-config', '--setting-sources', 'local', '--system-prompt', SYSTEM[lang]],
                           input=prompt, capture_output=True, text=True, timeout=1800)
        if r.returncode: raise RuntimeError(r.stderr[-300:] or r.stdout[-300:])
        out = []
        for m in re.finditer(r'^\[(\d+)\]\s*(.*?)\s*\|\|\|\s*(.*)$', r.stdout, re.M):
            i = int(m.group(1)) - 1
            if 0 <= i < len(b): out.append((*b[i], m.group(2), m.group(3)))
        return out

    found = []
    with cf.ThreadPoolExecutor(WORKERS) as ex:
        for f in cf.as_completed([ex.submit(check, b) for b in batches]):
            try: found += f.result(); print(f'束 済み（指摘 {len(found)}件まで）', flush=True)
            except Exception as e: print('❌', e, flush=True)
    out = ROOT / 'i18n' / f'点検_{lang}.tsv'
    out.write_text('キー\t場所\t日本語\tいまの訳\t直し案\t理由\n' + ''.join('\t'.join([k, w, Y.fold(ja), tr, fix, why]) + '\n' for k, w, ja, tr, fix, why in found), encoding='utf-8')
    print(f'おわり：{len(items)}件を見て、指摘 {len(found)}件 → {out.name}')

if __name__ == '__main__':
    main()
