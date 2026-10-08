// MJ Lab language switching and publication display
(function () {
  const toggle = document.getElementById('language');
  let language;
  try { language = localStorage.getItem('lab_lang') === 'en' ? 'en' : 'ko'; }
  catch (_) { language = 'ko'; }
  function renderLang() {
    const korean = language === 'ko';
    document.querySelectorAll('.ko').forEach(el => { el.hidden = !korean; });
    document.querySelectorAll('.en').forEach(el => { el.hidden = korean; });
    document.documentElement.lang = language;
    if (toggle) {
      toggle.textContent = korean ? 'EN' : 'KO';
      toggle.setAttribute('aria-label', korean ? 'Switch to English' : '한국어로 전환');
    }
  }
  if (toggle) toggle.addEventListener('click', () => {
    language = language === 'ko' ? 'en' : 'ko';
    try { localStorage.setItem('lab_lang', language); } catch (_) {}
    renderLang();
  });
  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, c =>
      ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  const pubs = document.getElementById('pubs');
  if (pubs && Array.isArray(window.LAB_PUBLICATIONS)) {
    const all = window.LAB_PUBLICATIONS;
    const limit = Number(pubs.dataset.limit) || all.length;
    const items = all.slice(0, limit);
    if (pubs.dataset.limit) {
      pubs.innerHTML = items.map(x =>
        `<article class="pub"><span class="year">${x[0]}</span><h3>${escapeHTML(x[1])}</h3><p>${escapeHTML(x[3])} · <em>${escapeHTML(x[2])}</em></p></article>`
      ).join('');
    } else {
      const groups = new Map();
      items.forEach(x => { if (!groups.has(x[0])) groups.set(x[0], []); groups.get(x[0]).push(x); });
      pubs.innerHTML = [...groups].map(([year, papers]) =>
        `<section class="pub-year-group"><div class="pub-year-heading"><h2>${year}</h2><span>${papers.length} papers</span></div>`+
        papers.map(x => {
          const url = 'https://scholar.google.com/scholar?q='+encodeURIComponent(x[1]);
          return `<article class="pub pub-full"><h3>${escapeHTML(x[1])}</h3><p class="pub-authors">${escapeHTML(x[3])}</p>`+
          `<p class="pub-journal">${escapeHTML(x[2])}</p>`+
          `<a class="pub-search" href="${url}" target="_blank" rel="noopener noreferrer">Google Scholar ↗</a></article>`;
        }).join('')+'</section>'
      ).join('');
    }
  }
  renderLang();
})();
