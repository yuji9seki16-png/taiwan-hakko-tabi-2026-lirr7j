// 言語の判定と切り替え。各ページで章データの直後・script.js の前に読む。
// 決め方：?lang= → 前に選んだ言語 → ブラウザが台湾・香港の中国語なら繁體中文／日本語なら日本語／それ以外は English
(() => {
  const LANGS = { ja: '日本語', 'zh-Hant': '繁體中文', en: 'English' };
  const SHORT = { ja: 'JA', 'zh-Hant': '繁', en: 'EN' }; // スマホの幅では短く
  const KEY = 'taiwan-tabi-lang';
  const load = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const save = (v) => { try { localStorage.setItem(KEY, v); } catch (e) {} };
  const q = new URLSearchParams(location.search).get('lang');
  if (q && LANGS[q]) save(q);
  let lang = (q && LANGS[q] ? q : null) || load();
  if (!LANGS[lang]) {
    const n = navigator.language || '';
    lang = /^zh-(tw|hk|mo|hant)/i.test(n) ? 'zh-Hant' : /^ja\b/i.test(n) || !n ? 'ja' : 'en';
  }
  window.TABI_LANG = lang;

  // 日本語以外なら、辞書と置き換えの仕組みをこの場で読む（script.js より先に動く）
  if (lang !== 'ja') document.write(`<script src="i18n/${lang}.js"><\/script><script src="i18n/apply.js"><\/script>`);

  const style = document.createElement('style');
  style.textContent = '.lang-switch{display:flex;gap:6px;align-items:center;white-space:nowrap;font:11px "Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif;letter-spacing:.06em}'
    + '.lang-switch a{color:inherit;text-decoration:none;opacity:.55;cursor:pointer}.lang-switch a[aria-current]{opacity:1;font-weight:bold;border-bottom:1px solid currentColor}'
    + 'html[lang="en"] .trip-layout .card p{font-size:max(11px,1.08cqw);line-height:1.3}html[lang="en"] .trip-layout .card small{font-size:max(9px,.85cqw);line-height:1.3}'
    + '.lang-switch .s{display:none}@media(max-width:600px){.lang-switch{gap:4px;letter-spacing:0}.lang-switch .l{display:none}.lang-switch .s{display:inline}}'
    + '.lang-switch.floating{position:fixed;top:14px;right:16px;z-index:30;padding:6px 10px;background:rgba(247,241,231,.92);color:#243028;border-radius:2px}';
  document.head.appendChild(style);

  const place = () => {
    const box = document.createElement('div');
    box.className = 'lang-switch';
    box.innerHTML = Object.entries(LANGS).map(([k, v]) => `<a data-lang="${k}" lang="${k}"${k === lang ? ' aria-current="true"' : ''} title="${v}"><span class="l">${v}</span><span class="s">${SHORT[k]}</span></a>`).join('<span aria-hidden="true">｜</span>');
    box.addEventListener('click', (e) => {
      const k = e.target.closest('a[data-lang]')?.dataset.lang;
      if (!k || k === lang) return;
      save(k);
      const u = new URL(location.href); u.searchParams.set('lang', k); location.href = u.toString();
    });
    const header = document.querySelector('.header');
    const present = header && header.querySelector('#present');
    if (present) header.insertBefore(box, present);
    else if (header) header.appendChild(box);
    else { box.classList.add('floating'); document.body.appendChild(box); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', place); else place();
})();
