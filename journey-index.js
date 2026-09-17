(() => {
  const themes = window.TRIP_THEMES;
  const chapters = document.querySelector('#chapters');
  const mapNav = document.querySelector('#map-nav');
  const body = document.body;
  let presentationIndex = 0;

  const esc = (value) => value.replace(/[&<>"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
  function gallery(theme, themeIndex) {
    const first = theme.photos[0];
    const thumbs = theme.photos.map((photo, photoIndex) => `<button class="thumb ${photoIndex === 0 ? 'is-selected' : ''}" type="button" data-theme="${themeIndex}" data-photo="${photoIndex}" aria-label="${esc(photo.caption)}"><img src="${photo.src}" alt=""><span>${String(photoIndex + 1).padStart(2,'0')}</span></button>`).join('');
    return `<div class="gallery"><figure class="main-photo"><img src="${first.src}" alt="${esc(first.alt)}"><figcaption>${esc(first.caption)}</figcaption></figure><div class="thumbs" aria-label="${esc(theme.title)}の写真を選ぶ">${thumbs}</div></div>`;
  }
  function render() {
    chapters.innerHTML = themes.map((theme, index) => `<article class="chapter ${index % 2 ? 'is-reversed' : ''}" id="${theme.id}" data-index="${index}"><div class="chapter-copy"><p class="chapter-meta">${theme.date}　／　${theme.place}</p><h2>${theme.title}</h2><p class="catch">${theme.catch}</p><p>${theme.text}</p><p class="photo-count">${theme.photos.length} PHOTOS　—　サムネイルを選択</p><button class="chapter-present" type="button" data-index="${index}">この章を発表モードで見る　↗</button></div>${gallery(theme,index)}</article>`).join('');
    mapNav.innerHTML = themes.map((theme, index) => `<button type="button" data-index="${index}" style="--x:${theme.map.x}px;--y:${theme.map.y}px"><span>${theme.date}</span>${theme.title}</button>`).join('');
  }
  function selectPhoto(themeIndex, photoIndex) {
    const theme = themes[themeIndex]; const photo = theme.photos[photoIndex];
    const chapter = document.querySelector(`.chapter[data-index="${themeIndex}"]`);
    const main = chapter.querySelector('.main-photo img'); const caption = chapter.querySelector('figcaption');
    main.src = photo.src; main.alt = photo.alt; caption.textContent = photo.caption;
    chapter.querySelectorAll('.thumb').forEach((thumb) => thumb.classList.toggle('is-selected', Number(thumb.dataset.photo) === photoIndex));
  }
  function present(index) {
    presentationIndex = (index + themes.length) % themes.length;
    body.classList.add('presentation-mode');
    document.querySelectorAll('.chapter').forEach((chapter) => chapter.classList.toggle('is-presented', Number(chapter.dataset.index) === presentationIndex));
    document.querySelector('#presentation-count').textContent = `${presentationIndex + 1} / ${themes.length}　${themes[presentationIndex].title}`;
    window.scrollTo({top:0, behavior:'instant'});
  }
  document.addEventListener('click', (event) => {
    const thumb = event.target.closest('.thumb');
    if (thumb) selectPhoto(Number(thumb.dataset.theme), Number(thumb.dataset.photo));
    const mapButton = event.target.closest('#map-nav button');
    if (mapButton) window.location.href = themes[Number(mapButton.dataset.index)].href;
    const chapterButton = event.target.closest('.chapter-present');
    if (chapterButton) present(Number(chapterButton.dataset.index));
  });
  document.querySelector('#present-button').addEventListener('click', () => present(0));
  document.querySelector('#exit-presentation').addEventListener('click', () => body.classList.remove('presentation-mode'));
  document.querySelector('#previous-chapter').addEventListener('click', () => present(presentationIndex - 1));
  document.querySelector('#next-chapter').addEventListener('click', () => present(presentationIndex + 1));
  document.addEventListener('keydown', (event) => { if (!body.classList.contains('presentation-mode')) return; if (event.key === 'ArrowLeft') present(presentationIndex - 1); if (event.key === 'ArrowRight') present(presentationIndex + 1); if (event.key === 'Escape') body.classList.remove('presentation-mode'); });
  render();
})();
