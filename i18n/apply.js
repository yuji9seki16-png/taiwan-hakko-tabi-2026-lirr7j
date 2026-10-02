// 日本語以外で開いたときだけ読まれる。辞書は window.I18N（i18n/<言語>.js）。
// ①章データを描く前に訳へ置き換える ②ページの文言・属性を置き換え、あとから描かれた分も追いかける
(() => {
  const I = window.I18N;
  if (!I) return;
  const dict = I.dict, frag = I.frag || [];
  const norm = (s) => s.replace(/<br\s*\/?>/g, '<br>').trim();
  const look = (s) => dict[s] ?? dict[norm(s)];
  const YOMI = /（[ァ-ヶー・]+）/g; // 地名のカタカナ読みは、日本語の読者のためのもの

  document.documentElement.lang = I.lang;
  document.title = look(document.title) || document.title;

  // ① 章データ
  const deep = (o) => {
    if (typeof o === 'string') return look(o) ?? o;
    if (Array.isArray(o)) return o.map(deep);
    if (o && typeof o === 'object') { for (const k of Object.keys(o)) o[k] = deep(o[k]); }
    return o;
  };
  if (window.CHAPTER) deep(window.CHAPTER);

  // ② 文字の置き換え。<br> をはさんだ文はひとかたまりで引く
  const swapText = (t) => {
    const hit = look(t);
    if (hit != null) { const [, a, , b] = t.match(/^(\s*)([\s\S]*?)(\s*)$/); return a + hit + b; } // 前後の空白は残す（章ナビの区切りなど）
    let s = t;
    for (const [ja, tr] of frag) if (s.includes(ja)) s = s.split(ja).join(tr);
    return s.replace(YOMI, '');
  };
  const putRun = (run, html) => {
    const parent = run[0].parentNode, before = run[run.length - 1].nextSibling;
    const lead = (run[0].nodeType === 3 && run[0].data.match(/^\s*/)[0]) || '';
    run.forEach((n) => n.remove());
    html.split('<br>').forEach((part, i) => {
      if (i) parent.insertBefore(document.createElement('br'), before);
      parent.insertBefore(document.createTextNode((i ? '' : lead) + part), before);
    });
  };
  const walk = (el) => {
    if (!el || el.nodeType !== 1 || /^(SCRIPT|STYLE)$/.test(el.tagName) || el.closest('.lang-switch')) return;
    for (const a of ['alt', 'aria-label', 'title']) {
      const v = el.getAttribute(a); if (v && look(v) != null) el.setAttribute(a, look(v));
    }
    let run = [];
    const flush = () => {
      if (!run.some((n) => n.nodeType === 3 && n.data.trim())) { run = []; return; }
      const key = run.map((n) => (n.nodeType === 3 ? n.data : '<br>')).join('');
      const hit = run.length > 1 ? look(key) : null;
      if (hit != null) putRun(run, hit);
      else run.forEach((n) => { if (n.nodeType === 3) { const s = swapText(n.data); if (s !== n.data) n.data = s; } });
      run = [];
    };
    for (const n of [...el.childNodes]) {
      if (n.nodeType === 3 || (n.nodeType === 1 && n.tagName === 'BR')) run.push(n);
      else { flush(); walk(n); }
    }
    flush();
  };

  let busy = false;
  const go = (el) => { busy = true; walk(el); busy = false; };
  go(document.body);
  new MutationObserver((list) => {
    if (busy) return;
    const targets = new Set(list.map((m) => (m.type === 'characterData' ? m.target.parentElement : m.target)).filter(Boolean));
    targets.forEach(go);
  }).observe(document.body, { childList: true, subtree: true, characterData: true });

  // タブの題名は script.js があとから書き換えることがある
  const fixTitle = () => { const t = look(document.title); if (t != null && t !== document.title) document.title = t; };
  const titleEl = document.querySelector('title');
  if (titleEl) new MutationObserver(fixTitle).observe(titleEl, { childList: true, characterData: true, subtree: true });
  document.addEventListener('DOMContentLoaded', fixTitle);

  // 字体（中国語のときだけ）：日本語の書体名の前に、台湾で自然に見える書体を足す
  const TC = { mincho: '"Songti TC","Noto Serif TC","PMingLiU",', gothic: '"PingFang TC","Noto Sans TC","Microsoft JhengHei",' };
  const fix = (rules) => { for (const r of rules) {
    if (r.cssRules) fix(r.cssRules);
    const f = r.style && r.style.fontFamily;
    if (!f || /TC"|JhengHei/.test(f)) continue;
    if (/Mincho/.test(f)) r.style.fontFamily = TC.mincho + f;
    else if (/Gothic/.test(f)) r.style.fontFamily = TC.gothic + f;
  } };
  const fixAll = () => { for (const s of document.styleSheets) { try { fix(s.cssRules); } catch (e) {} } };
  if (I.lang.startsWith('zh')) { fixAll(); window.addEventListener('load', fixAll); }
})();
