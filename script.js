(() => {
  const videoStillStyle = document.createElement('style');
  videoStillStyle.textContent = '.moment figure>img[src*="20260815_"],.thumb img[src*="20260815_"]{width:min(100%,404px);height:auto;min-height:0;object-fit:contain}';
  document.head.append(videoStillStyle);
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

  function present() {
    const moment = data.moments[index];
    const photo = moment.photos[0];
    render();
    $("#presentation").hidden = false;
    $("#presentation-meta").textContent = `${page.label}　${moment.date}　／　${withYomi(moment.place)}`;
    $("#presentation-title").textContent = moment.headline;
    $("#presentation-text").textContent = moment.text.split(/\n+/).map((line) => line.trim()).filter(Boolean)[0] || "";
    $("#presentation-photo").innerHTML = figure(photo);
    document.body.classList.add("presenting");
  }

  const order = Object.keys(fixed);
  const pageAt = order.indexOf(data.number);

  function across(direction) {
    const next = index + direction;
    if (next >= 0 && next < data.moments.length) {
      selectMoment(next);
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
    if (event.target.closest("#present, #moment-present")) present();
    if (event.target.closest("#close-presentation")) {
      $("#presentation").hidden = true;
      document.body.classList.remove("presenting");
    }
    if (event.target.closest("#previous")) across(-1);
    if (event.target.closest("#next")) across(1);
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
    if (event.key === "Escape") {
      $("#presentation").hidden = true;
      document.body.classList.remove("presenting");
    }
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
  if (params.get("present") === "1") present();
})();
