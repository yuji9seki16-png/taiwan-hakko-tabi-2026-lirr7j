(() => {
  const videoStillStyle = document.createElement('style');
  videoStillStyle.textContent = '.moment figure>img[src*="20260815_"],.thumb img[src*="20260815_"]{width:min(100%,404px);height:auto;min-height:0;object-fit:contain}';
  document.head.append(videoStillStyle);
  // v0.12 発表モード：写真を大きく、場面の写真を切り替えずに送る（2026-09-28）
  const presentStyle = document.createElement('style');
  presentStyle.textContent = `
#presentation-strip{display:flex;gap:6px;justify-content:center;align-items:center;flex-wrap:wrap}
#presentation-strip button{padding:0;border:0;background:none;cursor:pointer;opacity:.4;outline:2px solid transparent;outline-offset:2px}
#presentation-strip button.active{opacity:1;outline-color:#fff8eb}
#presentation-strip img{display:block;width:64px;height:46px;object-fit:cover}
#presentation-strip span{margin-left:10px;color:#fff8eb;opacity:.6;font:12px "Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif}
.presentation .keys{margin-top:2em;opacity:.45;font:12px/1.9 "Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif!important}
@media (max-width:899px){.presentation .keys{display:none}}
@media (min-width:900px){
.presentation{display:grid;grid-template-columns:40px minmax(0,1fr) clamp(260px,24vw,380px) 40px;grid-template-rows:minmax(0,1fr) auto;gap:14px 2vw;align-items:center;padding:52px 2vw 16px;overflow:hidden}
.presentation>#previous{grid-column:1;grid-row:1/3}
.presentation>#next{grid-column:4;grid-row:1/3}
#presentation-photo{grid-column:2;grid-row:1;height:calc(100svh - 150px);min-height:0!important;display:flex;flex-direction:column;background:transparent}
#presentation-strip{grid-column:2;grid-row:2}
.presentation>div{grid-column:3;grid-row:1/3}
.presentation h2{font-size:clamp(24px,2vw,36px)}
.presentation p{font-size:clamp(16px,1.15vw,21px)}
}
#presentation-photo>img{flex:1;min-height:0!important;height:auto;width:100%;object-fit:contain}
#presentation-where{padding:0!important;margin-bottom:6px}
.mini-map{position:relative;display:block;width:84px;height:148px}
.mini-map img{position:absolute;inset:0;width:100%;height:100%;opacity:.9}
.mini-map svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.mini-map path{fill:none;stroke:#a54d36;stroke-width:5;stroke-dasharray:10 9;opacity:.7}
.mini-map .here{fill:#e0673f;stroke:#fff8eb;stroke-width:4}
.mini-map .here-ring{fill:none;stroke:#e0673f;stroke-width:4;opacity:.6;animation:here 1.8s ease-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes here{from{transform:scale(.5);opacity:.8}to{transform:scale(1.6);opacity:0}}
.mini-map .away{position:absolute;left:94px;top:6px;white-space:nowrap;padding:2px 8px;border:1px solid #e0673f;color:#fff8eb;font:11px "Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif}
#presentation-note{padding:0!important}
#presentation-note h3{margin:1.1em 0 .2em;color:#e9a07f;font:600 13px "Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif;letter-spacing:.06em}
.presentation #presentation-note p{margin:0;font-size:clamp(14px,1vw,17px);line-height:1.8}
.presentation #presentation-note .note-source{margin-top:1.4em;opacity:.55;font-size:11px;line-height:1.6}
.presentation.is-note #presentation-meta{color:#e9a07f}
@media (min-width:900px){.presentation.is-note{grid-template-columns:40px minmax(0,1.1fr) minmax(0,.9fr) 40px}}
#presentation-photo figcaption{position:static;align-self:center;margin-top:8px;background:none;color:#fff8eb;font:14px "Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif;opacity:.85}`;
  document.head.append(presentStyle);
  const observationScript = document.createElement('script');
  observationScript.src = 'observation-v08.js';
  document.head.append(observationScript);
  const data = window.CHAPTER;
  const fixed = {
    '01': { label: '第1章', file: 'index.html', footer: '第1章「南へ南へ運ばれていった」 / 第1—7章＋終章プロトタイプ v0.11.2' },
    '02': { label: '第2章', file: 'chapter-02.html', footer: '第2章「土地にあるもので」 / 第1—7章＋終章プロトタイプ v0.11.2' },
    '03': { label: '第3章', file: 'chapter-03.html', footer: '第3章「値段のないスーパー」 / 第1—7章＋終章プロトタイプ v0.11.2' },
    '04': { label: '第4章', file: 'chapter-04.html', footer: '第4章「まだ気に入っていません」 / 第1—7章＋終章プロトタイプ v0.11.2' },
    '05': { label: '第5章', file: 'chapter-05.html', footer: '第5章「紐は宝物」 / 第1—7章＋終章プロトタイプ v0.11.2' },
    '06': { label: '第6章', file: 'chapter-06.html', title: '第6章 獲らない季節｜台湾一周・発酵の旅', eyebrow: 'CHAPTER 06　/　08.15', heading: '獲らない季節', intro: 'TAIPEI / DIHUA STREET', caption: 'この章の場所　台北・迪化街', footer: '第6章「獲らない季節」 / 第1—7章＋終章プロトタイプ v0.11.2' },
    '07': { label: '第7章', file: 'chapter-07.html', title: '第7章 ぬか床を渡す｜台湾一周・発酵の旅', eyebrow: 'CHAPTER 07　/　08.16', heading: 'ぬか床を渡す', intro: 'TAIPEI / DADAOCHENG', caption: 'この章の場所　台北・大稻埕', footer: '第7章「ぬか床を渡す」 / 第1—7章＋終章プロトタイプ v0.11.2' },
    '08': { label: '終章', file: 'epilogue.html', title: '終章 異文化と繋がるほど、嵐山が深くなる｜台湾一周・発酵の旅', eyebrow: 'EPILOGUE', heading: '異文化と繋がるほど、<br>嵐山が深くなる', footer: '終章「異文化と繋がるほど、嵐山が深くなる」 / 第1—7章＋終章プロトタイプ v0.11.2' }
  };
  const page = fixed[data.number];
  if (page) {
    if (page.title) document.title = page.title;
    if (page.eyebrow) document.querySelector('.opening .eyebrow').textContent = page.eyebrow;
    if (page.heading) document.querySelector('.opening h1').innerHTML = page.heading;
    if (page.intro) document.querySelector('.chapter-intro .eyebrow').textContent = page.intro;
    if (page.caption) document.querySelector('.route-caption').textContent = page.caption;
    document.querySelector('footer').textContent = page.footer;
    document.querySelector('.header > a').href = 'journey-index.html';
    document.querySelector('.header span').innerHTML = Object.entries(fixed).map(([number, item]) => number === data.number ? item.label : `<a href="${item.file}">${item.label}</a>`).join('　/　');
    document.querySelector('.header').insertAdjacentHTML('afterbegin', '<a class="back-map" href="journey-index.html">← 全体地図</a>');
    document.querySelector('#presentation').insertAdjacentHTML('afterbegin', '<a class="back-map" href="journey-index.html">← 全体地図</a>');
  }
  const galleryExtras = window.GALLERY_EXTRAS || {};
  const contentExtras = window.CONTENT_EXTRAS || {};
  data.moments.forEach((moment) => {
    Object.assign(moment, contentExtras[moment.id] || {});
    const extras = galleryExtras[moment.id] || [];
    const featured = extras.filter((photo) => photo.featured);
    moment.photos = featured.concat(moment.photos, extras.filter((photo) => !photo.featured));
  });
  const mapWidth = 300;
  const mapHeight = 530;
  const mapPadding = 16;
  let index = 0;

  const $ = (selector) => document.querySelector(selector);
  const nav = $("#moment-nav");
  const points = $("#route-points");
  const routeLine = $("#route-line");
  const yomi = { "六十石山": "リョウシーダンシャン", "皇珵醬油": "ホァンチェンジャンヨウ", "樹屋廣場": "シューウーグアンチャン", "大稻埕": "ダーダオチェン", "迪化街": "ディーホアジエ", "富里郷": "フーリー", "羅山村": "ルオシャン", "發酵迷": "ファージャオミー", "花蓮": "ホアリェン", "玉里": "ユーリー", "台東": "タイドン", "屏東": "ピンドン", "台南": "タイナン", "新竹": "シンジュー", "北埔": "ベイプー", "内湖": "ネイフー" };
  const yomiRe = new RegExp(Object.keys(yomi).join("|"), "g");
  const withYomi = (place) => String(place).replace(yomiRe, (word) => `${word}（${yomi[word]}）`);
  const esc = (text) => String(text).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[character]));

  function figure(photo) {
    return `<img src="${photo.src}" alt="${esc(photo.alt)}"><figcaption>${esc(photo.caption)}</figcaption>`;
  }

  function project(geo) {
    const { minLon, maxLon, minLat, maxLat } = data.map.bounds;
    return {
      x: mapPadding + ((geo.lon - minLon) / (maxLon - minLon)) * (mapWidth - mapPadding * 2),
      y: mapPadding + ((maxLat - geo.lat) / (maxLat - minLat)) * (mapHeight - mapPadding * 2)
    };
  }

  const mappedMoments = data.moments.filter((moment) => moment.geo && moment.geo.onTaiwanMap !== false);

  function drawRoute() {
    if (!routeLine || !points) return;
    const plotted = mappedMoments.map((moment) => {
      const origin = project(moment.geo);
      const chapterTwoOffsets = { clouds: { x: -24, y: -18 }, tofu: { x: 26, y: 19 } };
      const offset = moment.geo.mapOffset || (data.number === "02" ? chapterTwoOffsets[moment.id] : null) || {};
      return { moment, originX: origin.x, originY: origin.y, x: origin.x + (offset.x || 0), y: origin.y + (offset.y || 0) };
    });
    routeLine.setAttribute("d", plotted.map((point, pointIndex) => `${pointIndex ? "L" : "M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" "));
    points.innerHTML = plotted.map(({ moment, originX, originY, x, y }) => {
      const momentIndex = data.moments.indexOf(moment);
      const labelSide = x > 180 ? "end" : "start";
      const labelX = x > 180 ? x - 12 : x + 12;
      const leader = (originX !== x || originY !== y) ? `<path class="route-line" d="M${originX.toFixed(1)} ${originY.toFixed(1)} L${x.toFixed(1)} ${y.toFixed(1)}"></path><circle cx="${originX.toFixed(1)}" cy="${originY.toFixed(1)}" r="2"></circle>` : "";
      return `<g data-index="${momentIndex}" tabindex="0" role="button" aria-label="${esc(moment.date)} ${esc(moment.geo.label)}">${leader}
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7"></circle>
        <text x="${labelX.toFixed(1)}" y="${(y - 13).toFixed(1)}" text-anchor="${labelSide}">${esc(moment.date)}　${esc(moment.geo.label)}</text>
      </g>`;
    }).join("");
  }

  function render() {
    const moment = data.moments[index];
    const photo = moment.photos[0];
    const research = $("#research-link");
    $("#meta").textContent = `${moment.date}　／　${withYomi(moment.place)}`;
    $("#title").textContent = moment.headline;
    $("#lead").textContent = moment.lead;
    $("#text").textContent = moment.text;
    const readerNote = moment.readerNote || "";
    $("#caption-note").textContent = readerNote;
    $("#caption-note").hidden = !readerNote;
    research.hidden = !moment.researchNoteId;
    research.href = moment.researchNoteId ? `#${moment.researchNoteId}` : "#";
    $("#hero-photo").innerHTML = figure(photo);
    nav.querySelectorAll("button").forEach((button) => button.classList.toggle("active", Number(button.dataset.index) === index));
    if (points) points.querySelectorAll("g").forEach((group) => group.classList.toggle("active", Number(group.dataset.index) === index));
    $("#thumbnails").innerHTML = moment.photos.map((item, photoIndex) => `<button class="thumb ${photoIndex === 0 ? "active" : ""}" aria-label="${esc(item.caption)}" data-photo="${photoIndex}">${figure(item)}</button>`).join("");
  }

  function selectMoment(nextIndex, updateHash = true) {
    index = nextIndex;
    if (updateHash) history.replaceState(null, "", `#${data.moments[index].id}`);
    render();
  }

  // 発表モード：場面ごとに1枚。観察ノートのある場面のあとに「今日の発酵食品」を1枚はさむ（v0.12）
  const slides = data.moments.flatMap((moment, momentIndex) => moment.researchNoteId ? [{ at: momentIndex }, { at: momentIndex, note: true }] : [{ at: momentIndex }]);
  let slide = 0;
  let shot = 0;
  let shots = [];

  // 今日の発酵食品に出す写真（章ごと。場面の写真から、発酵食品そのものが写っているものを先に）
  const noteShots = { '01': ['IMG_4771', 'IMG_4770'], '02': ['IMG_5040', 'IMG_5018', 'IMG_4992'], '03': ['IMG_5197'], '04': ['IMG_5414', 'IMG_5362', 'IMG_5385', 'IMG_5417'], '05': ['IMG_5603', 'IMG_5628', 'IMG_5596', 'IMG_5626'], '06': ['IMG_5919'], '07': ['IMG_5991', 'IMG_5999'], '08': ['IMG_6104'] };
  const allPhotos = data.moments.flatMap((moment) => moment.photos);
  const photosFor = (names) => (names || []).map((name) => allPhotos.find((photo) => photo.src.includes(name))).filter(Boolean);

  // 小さな地図：いまどこにいるか。台湾全体の縮尺は第1章の地図と同じ
  const whole = { minLon: 120.074086, maxLon: 122.037048, minLat: 21.892593, maxLat: 25.299 };
  const spot = (lat, lon) => ({ x: 16 + ((lon - whole.minLon) / (whole.maxLon - whole.minLon)) * 268, y: 16 + ((whole.maxLat - lat) / (whole.maxLat - whole.minLat)) * 498 });
  const trip = [[25.07358, 121.60349], [23.33479, 121.31697], [23.18446, 121.28846], [22.75362, 121.14592], [22.49947, 120.43657], [24.7137, 121.0588], [25.06282, 121.50886]].map(([lat, lon]) => spot(lat, lon));
  const tripPath = trip.map((point, pointIndex) => `${pointIndex ? 'L' : 'M'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');

  function whereAt(momentIndex) {
    for (let step = 0; step < data.moments.length; step++) {
      for (const candidate of [momentIndex - step, momentIndex + step]) {
        const geo = data.moments[candidate] && data.moments[candidate].geo;
        if (geo && geo.lat) return geo.lat > 26 ? { away: geo.label } : spot(geo.lat, geo.lon);
      }
    }
    return { away: '京都・嵐山' };
  }

  function miniMap(momentIndex) {
    const here = whereAt(momentIndex);
    const mark = here.away ? '' : `<circle class="here-ring" cx="${here.x.toFixed(1)}" cy="${here.y.toFixed(1)}" r="28"></circle><circle class="here" cx="${here.x.toFixed(1)}" cy="${here.y.toFixed(1)}" r="15"></circle>`;
    return `<a class="mini-map" href="journey-index.html" title="全体地図へ"><img src="images/taiwan-white-map.svg" alt=""><svg viewBox="0 0 300 530" aria-hidden="true"><path d="${tripPath}"></path>${mark}</svg>${here.away ? `<span class="away">${esc(here.away)}</span>` : ''}</a>`;
  }

  function noteContent() {
    const section = document.querySelector('#civet-coffee-note') || document.querySelector('.note-section');
    if (!section || !section.querySelector('h2')) return null;
    const parts = [...section.querySelectorAll('details')].filter((item) => !/出典/.test(item.querySelector('summary').textContent))
      .map((item) => `<h3>${item.querySelector('summary').innerHTML}</h3><p>${item.querySelector('p').innerHTML}</p>`).join('');
    const source = section.querySelector('.note-source');
    return { name: section.querySelector('h2').innerHTML, body: parts + (source ? `<p class="note-source">${source.innerHTML}</p>` : '') };
  }

  function showShot(nextShot) {
    shot = nextShot;
    $("#presentation-photo").innerHTML = figure(shots[shot]);
    $("#presentation-strip").querySelectorAll("button").forEach((button) => button.classList.toggle("active", Number(button.dataset.shot) === shot));
    $("#presentation-count").textContent = `${shot + 1} / ${shots.length}`;
  }

  function present() {
    const current = slides[slide];
    const moment = data.moments[current.at];
    const note = current.note ? noteContent() : null;
    if (current.at !== index) selectMoment(current.at);
    else render();
    $("#presentation").hidden = false;
    if (!$("#presentation-strip")) {
      $("#presentation-photo").insertAdjacentHTML("afterend", '<div id="presentation-strip"></div>');
      $("#presentation-meta").insertAdjacentHTML("beforebegin", '<div id="presentation-where"></div>');
      $("#presentation-text").insertAdjacentHTML("afterend", '<div id="presentation-note"></div><p class="keys">スペース　次の写真<br>← →　前後の場面<br>M　地図へもどる</p>');
    }
    $("#presentation-where").innerHTML = miniMap(current.at);
    $("#presentation").classList.toggle("is-note", Boolean(note));
    if (note) {
      $("#presentation-meta").textContent = `今日の発酵食品　／　${page.label}　${moment.date}`;
      $("#presentation-title").innerHTML = note.name;
      $("#presentation-text").textContent = "";
      $("#presentation-note").innerHTML = note.body;
      shots = photosFor(noteShots[data.number]);
      if (!shots.length) shots = moment.photos;
    } else {
      $("#presentation-meta").textContent = `${page.label}　${moment.date}　／　${withYomi(moment.place)}`;
      $("#presentation-title").textContent = moment.headline;
      $("#presentation-text").textContent = moment.text.split(/\n+/).map((line) => line.trim()).filter(Boolean)[0] || "";
      $("#presentation-note").innerHTML = "";
      shots = moment.photos;
    }
    $("#presentation-strip").innerHTML = shots.map((item, photoIndex) => `<button type="button" data-shot="${photoIndex}" aria-label="${esc(item.caption)}"><img src="${item.src}" alt=""></button>`).join("") + '<span id="presentation-count"></span>';
    $("#presentation").querySelector("div:not(#presentation-strip)").scrollTop = 0;
    showShot(0);
    document.body.classList.add("presenting");
  }

  // スペース：同じ場面の次の写真。最後の写真の次は、次の場面へ
  function step(direction) {
    const next = shot + direction;
    if (next >= 0 && next < shots.length) showShot(next);
    else if (direction > 0) across(1);
  }

  const order = Object.keys(fixed);
  const pageAt = order.indexOf(data.number);

  function across(direction) {
    const next = slide + direction;
    if (next >= 0 && next < slides.length) {
      slide = next;
      present();
      return;
    }
    const target = pageAt + direction;
    if (target < 0 || target >= order.length) {
      location.href = "journey-index.html";
      return;
    }
    const file = fixed[order[target]].file;
    location.href = direction < 0 ? `${file}?present=1&last=1` : `${file}?present=1`;
  }

  nav.innerHTML = data.moments.map((moment, momentIndex) => `<button data-index="${momentIndex}" type="button"><span>${moment.date}</span>${moment.place}</button>`).join("");
  drawRoute();

  document.addEventListener("click", (event) => {
    const selectable = event.target.closest("[data-index]");
    if (selectable) selectMoment(Number(selectable.dataset.index));
    if (event.target.closest("#present, #moment-present")) { slide = slides.findIndex((item) => item.at === index); present(); }
    if (event.target.closest("#close-presentation")) {
      $("#presentation").hidden = true;
      document.body.classList.remove("presenting");
    }
    if (event.target.closest("#previous")) across(-1);
    if (event.target.closest("#next")) across(1);
    const shotButton = event.target.closest("#presentation-strip button");
    if (shotButton) showShot(Number(shotButton.dataset.shot));
    if (document.body.classList.contains("presenting") && document.activeElement) document.activeElement.blur();
    const thumbnail = event.target.closest(".thumb");
    if (thumbnail) {
      const photo = data.moments[index].photos[Number(thumbnail.dataset.photo)];
      $("#hero-photo").innerHTML = figure(photo);
      document.querySelectorAll(".thumb").forEach((item) => item.classList.toggle("active", item === thumbnail));
    }
  });

  document.addEventListener("keydown", (event) => {
    const keyedPoint = event.target.closest && event.target.closest("#route-points g[data-index]");
    if (keyedPoint && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      selectMoment(Number(keyedPoint.dataset.index));
    }
    if (!document.body.classList.contains("presenting")) return;
    if (event.key === "ArrowLeft") across(-1);
    if (event.key === "ArrowRight") across(1);
    if (event.key === " " || event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      step(event.key === "ArrowUp" ? -1 : 1);
    }
    if (event.key === "m" || event.key === "M") location.href = "journey-index.html";
  });

  const initial = data.moments.findIndex((moment) => `#${moment.id}` === location.hash);
  if (initial >= 0) index = initial;
  const params = new URLSearchParams(location.search);
  if (initial < 0 && params.get("last") === "1") index = data.moments.length - 1;
  window.addEventListener("hashchange", () => {
    const matched = data.moments.findIndex((moment) => `#${moment.id}` === location.hash);
    if (matched >= 0) selectMoment(matched, false);
  });
  render();
  slide = params.get("last") === "1" && initial < 0 ? slides.length - 1 : slides.findIndex((item) => item.at === index);
  if (params.get("present") === "1") present();
})();
