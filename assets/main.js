const WORKS = [
  { name: 'Jordan',             slug: '01-jordan',             size: null },
  { name: 'Muhammed Ali',       slug: '02-muhammed-ali',       size: null },
  { name: 'LeBron James',       slug: '03-lebron-james',       size: null },
  { name: 'Joker',              slug: '04-joker',              size: null },
  { name: 'Tupac',              slug: '05-tupac',              size: null },
  { name: 'Batman',             slug: '06-batman',             size: null },
  { name: 'Chester Bennington', slug: '07-chester-bennington', size: null },
];

const INSTAGRAM = 'studiorca';
const DM_URL = `https://ig.me/m/${INSTAGRAM}`;
const PERSON_CM = 175;

const I18N = {
  tr: {
    'nav.collection': 'Koleksiyon', 'nav.series': 'Seri', 'nav.works': 'Eserler',
    'nav.studio': 'Stüdyo', 'nav.contact': 'İletişim',
    'menu.open': 'Menüyü aç', 'menu.close': 'Menüyü kapat',
    'hero.sub': 'Koleksiyon portfolyosu', 'hero.cta': 'Seriyi keşfet',
    'statement.title': 'YEDİ PORTRE.<br>TEK GÖRSEL DİL.',
    'statement.body': '7 ATS, farklı kültürel alanlardan yedi portreyi ortak bir kompozisyon diliyle bir araya getirir. Altın dokulu zemin ve neon yeşil kırık çizgiler, eserler arasında görsel bir bağ kurar. Yönler, bakışlar ve tekrarlar serinin ritmini belirler.',
    'seq.swipe': 'Kaydır',
    'about.body': 'Studio Orca; portre, karakter, nesne ve mekân tasarımı arasında gelişen özgün bir görsel dünya kurmayı hedefler. 7 ATS, bu dünyanın portre odaklı koleksiyonlarından biridir.',
    'contact.sub': 'Koleksiyon ve eser talepleri için',
    'contact.btn': "Instagram'dan yaz",
    'work.open': 'tam ekran aç', 'work.inquire': 'Bu eser için talep gönder',
    'work.scale': 'Ölçek', 'work.person': 'İnsan boyu 175 cm',
    'lb.hint': 'Kaydırarak geç · Aşağı çekerek kapat', 'lb.inquire': 'Talep gönder',
    'lb.close': 'Kapat', 'lb.prev': 'Önceki eser', 'lb.next': 'Sonraki eser',
    'top': 'Başa dön',
    'toast.copied': 'Mesajın kopyalandı — Instagram’da yapıştırıp gönder.',
    'toast.open': 'Instagram açılıyor…',
    'msg.work': (w, n) => `Merhaba, 7 ATS koleksiyonundaki "${w}" (${n}) eseri hakkında bilgi almak istiyorum.`,
    'msg.general': 'Merhaba, 7 ATS koleksiyonu hakkında bilgi almak istiyorum.',
  },
  en: {
    'nav.collection': 'Collection', 'nav.series': 'Series', 'nav.works': 'Works',
    'nav.studio': 'Studio', 'nav.contact': 'Contact',
    'menu.open': 'Open menu', 'menu.close': 'Close menu',
    'hero.sub': 'Collection portfolio', 'hero.cta': 'Explore the series',
    'statement.title': 'SEVEN PORTRAITS.<br>ONE VISUAL LANGUAGE.',
    'statement.body': 'Seven portraits share a single visual language. Textured gold backgrounds and interrupted neon-green lines create a recurring structure across the collection. Direction, gaze and repetition establish its visual rhythm.',
    'seq.swipe': 'Swipe',
    'about.body': 'Studio Orca explores a visual world across portraiture, character, object and spatial design. 7 ATS is one of its portrait-led collections.',
    'contact.sub': 'For collection and artwork inquiries',
    'contact.btn': 'Message on Instagram',
    'work.open': 'open full screen', 'work.inquire': 'Inquire about this work',
    'work.scale': 'Scale', 'work.person': 'Person 175 cm',
    'lb.hint': 'Swipe to browse · Pull down to close', 'lb.inquire': 'Inquire',
    'lb.close': 'Close', 'lb.prev': 'Previous work', 'lb.next': 'Next work',
    'top': 'Back to top',
    'toast.copied': 'Message copied — paste it in Instagram and send.',
    'toast.open': 'Opening Instagram…',
    'msg.work': (w, n) => `Hello, I would like to know more about "${w}" (${n}) from the 7 ATS collection.`,
    'msg.general': 'Hello, I would like to know more about the 7 ATS collection.',
  },
};

const pad = n => String(n).padStart(2, '0');
const total = pad(WORKS.length);
const sm = w => `assets/works/sm/${w.slug}.webp`;
const hd = w => `assets/works/${w.slug}.jpg`;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

let lang = (() => {
  try { const s = localStorage.getItem('lang'); if (s === 'tr' || s === 'en') return s; } catch {}
  return (navigator.language || 'tr').toLowerCase().startsWith('tr') ? 'tr' : 'en';
})();
const t = (k, ...a) => { const v = I18N[lang][k]; return typeof v === 'function' ? v(...a) : v; };

const hdCache = new Set();
function loadHD(img) {
  const url = img.dataset.hd;
  if (!url || img.dataset.state === 'hd') return;
  const done = () => { img.src = url; img.dataset.state = 'hd'; hdCache.add(url); };
  if (hdCache.has(url)) return done();
  const pre = new Image();
  pre.onload = () => (pre.decode ? pre.decode().catch(() => {}) : Promise.resolve()).then(done);
  pre.src = url;
}
const hdObserver = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { loadHD(e.target); hdObserver.unobserve(e.target); }
}), { rootMargin: '300px 0px' });
const progImg = (w, alt = '', cls = '') =>
  `<img class="prog ${cls}" src="${sm(w)}" data-hd="${hd(w)}" alt="${alt}" decoding="async">`;

function scaleSVG(w) {
  if (!w.size) return '';
  const [cw, ch] = w.size;
  const H = 120, k = H / Math.max(ch, PERSON_CM);
  const pw = 18, ph = PERSON_CM * k, aw = cw * k, ah = ch * k;
  const W = pw + 16 + aw;
  return `
    <figure class="scale">
      <figcaption>${t('work.scale')} · <strong>${cw} × ${ch} cm</strong></figcaption>
      <svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${cw} × ${ch} cm — ${t('work.person')}">
        <g fill="currentColor" transform="translate(0 ${H - ph}) scale(${pw / 18} ${ph / 70})">
          <circle cx="9" cy="5" r="4.2"/>
          <path d="M4 11h10l2 23h-4l-1-14v48H9.5V42h-1v26H6V20L5 34H1z"/>
        </g>
        <rect x="${pw + 16}" y="${H - ah}" width="${aw}" height="${ah}" fill="none" stroke="var(--green)" stroke-width="2"/>
        <line x1="0" x2="${W}" y1="${H - .5}" y2="${H - .5}" stroke="currentColor" stroke-opacity=".3"/>
      </svg>
      <small>${t('work.person')}</small>
    </figure>`;
}

const strip = document.getElementById('strip');
const worksEl = document.getElementById('works');
const dots = document.getElementById('dots');
dots.innerHTML = WORKS.map(() => '<span></span>').join('');
const dotEls = [...dots.children];

function renderWorks() {
  strip.innerHTML = WORKS.map((w, i) => `
    <li>
      <button data-i="${i}" aria-label="${w.name} — ${t('work.open')}">
        <span class="thumb">${progImg(w)}</span>
        <span class="num">${pad(i + 1)}</span>
        <span class="name">${w.name.toUpperCase()}</span>
      </button>
    </li>`).join('');

  worksEl.innerHTML = WORKS.map((w, i) => `
    <article class="work reveal in" id="work-${pad(i + 1)}">
      <div class="bar"><span>STUDIO ORCA</span><span>7 ATS / SELECTED WORK</span></div>
      <div class="work-grid">
        <button class="work-media" data-i="${i}" aria-label="${w.name} — ${t('work.open')}">
          ${progImg(w, `${w.name} — 7 ATS`)}
          <span class="zoom" aria-hidden="true">⤢</span>
        </button>
        <div class="work-info">
          <p class="accent">${pad(i + 1)} / ${total}</p>
          <h3>${w.name.toUpperCase()}</h3>
          <span class="rule"></span>
          <dl class="meta" lang="en">
            <div><dt>Collection</dt><dd>7 ATS</dd></div>
            <div><dt>Studio</dt><dd>Studio Orca</dd></div>
            <div><dt>Selected work</dt><dd>Artwork / ${pad(i + 1)}</dd></div>
          </dl>
          ${scaleSVG(w)}
          <button class="inquire" data-inquire="${i}">${t('work.inquire')} <span aria-hidden="true">→</span></button>
        </div>
      </div>
    </article>`).join('');

  document.querySelectorAll('img.prog').forEach(img => hdObserver.observe(img));
  updateDots();
}

function updateDots() {
  const items = [...strip.children];
  const mid = strip.scrollLeft + strip.clientWidth / 2;
  let best = 0, bestD = Infinity;
  items.forEach((li, i) => {
    const d = Math.abs(li.offsetLeft + li.offsetWidth / 2 - mid);
    if (d < bestD) { bestD = d; best = i; }
  });
  dotEls.forEach((d, i) => d.classList.toggle('on', i === best));
}
strip.addEventListener('scroll', updateDots, { passive: true });

function applyLang(next) {
  lang = next;
  try { localStorage.setItem('lang', lang); } catch {}
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  document.querySelectorAll('.lang button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
  burger.setAttribute('aria-label', t(menu.hidden ? 'menu.open' : 'menu.close'));
  renderWorks();
  document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
}
document.addEventListener('click', e => {
  const b = e.target.closest('.lang button');
  if (b && b.dataset.lang !== lang) applyLang(b.dataset.lang);
});

const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
}
async function inquire(message) {
  const win = window.open(DM_URL, '_blank', 'noopener');
  let copied = false;
  try { await navigator.clipboard.writeText(message); copied = true; } catch {}
  showToast(copied ? t('toast.copied') : t('toast.open'));
  if (!win) location.href = DM_URL;
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-inquire]');
  if (!b) return;
  const v = b.dataset.inquire;
  if (v === 'general') return inquire(t('msg.general'));
  const i = +v;
  inquire(t('msg.work', WORKS[i].name, `${pad(i + 1)}/${total}`));
});

let heroI = 0;
const heroImg = document.getElementById('heroImg');
const heroIdx = document.getElementById('heroIdx');
heroImg.src = sm(WORKS[0]);
heroImg.dataset.hd = hd(WORKS[0]);
loadHD(heroImg);
if (!reduceMotion) {
  setInterval(() => {
    if (document.hidden || scrollY > innerHeight) return;
    heroI = (heroI + 1) % WORKS.length;
    const w = WORKS[heroI];
    const next = new Image();
    next.onload = () => {
      heroImg.classList.add('fade');
      setTimeout(() => {
        heroImg.src = hd(w);
        heroImg.dataset.hd = hd(w);
        heroImg.dataset.state = 'hd';
        heroImg.alt = `${w.name} — 7 ATS`;
        heroIdx.textContent = pad(heroI + 1);
        heroImg.classList.remove('fade');
      }, 400);
    };
    next.src = hd(w);
  }, 4500);
}

const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
const setMenu = open => {
  menu.hidden = !open;
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', t(open ? 'menu.close' : 'menu.open'));
  document.body.classList.toggle('menu-open', open);
};
burger.addEventListener('click', () => setMenu(menu.hidden));
menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
addEventListener('resize', () => { if (innerWidth > 760 && !menu.hidden) setMenu(false); });

const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const stage = document.getElementById('lbStage');
let cur = 0, lastFocus = null;

function show(i, dir = 0) {
  cur = (i + WORKS.length) % WORKS.length;
  const w = WORKS[cur];
  lbImg.style.transition = 'none';
  lbImg.style.transform = dir ? `translateX(${dir * 40}px)` : '';
  lbImg.style.opacity = dir ? '0' : '1';
  lbImg.dataset.state = '';
  lbImg.dataset.hd = hd(w);
  lbImg.src = hdCache.has(hd(w)) ? hd(w) : sm(w);
  lbImg.alt = w.name;
  loadHD(lbImg);
  requestAnimationFrame(() => {
    lbImg.style.transition = '';
    lbImg.style.transform = '';
    lbImg.style.opacity = '1';
  });
  document.getElementById('lbIdx').textContent = `${pad(cur + 1)} / ${total}`;
  document.getElementById('lbName').textContent = w.name.toUpperCase();
  document.getElementById('lbInquire').dataset.inquire = cur;
  [cur - 1, cur + 1].forEach(n => {
    const url = hd(WORKS[(n + WORKS.length) % WORKS.length]);
    const im = new Image(); im.onload = () => hdCache.add(url); im.src = url;
  });
}
function openLb(i) {
  lastFocus = document.activeElement;
  show(i);
  lb.hidden = false;
  document.body.classList.add('locked');
  lb.querySelector('.lb-close').focus();
}
function closeLb() {
  lb.hidden = true;
  document.body.classList.remove('locked');
  lastFocus?.focus();
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-i]');
  if (t) openLb(+t.dataset.i);
});
lb.querySelector('.lb-close').onclick = closeLb;
lb.querySelector('.lb-prev').onclick = () => show(cur - 1, -1);
lb.querySelector('.lb-next').onclick = () => show(cur + 1, 1);
stage.addEventListener('click', e => { if (e.target === stage) closeLb(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !menu.hidden) setMenu(false);
  if (lb.hidden) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') show(cur - 1, -1);
  if (e.key === 'ArrowRight') show(cur + 1, 1);
});

let sx = 0, sy = 0, dx = 0, dy = 0, axis = null, touching = false;
stage.addEventListener('touchstart', e => {
  if (e.touches.length !== 1) return;
  touching = true; axis = null; dx = dy = 0;
  sx = e.touches[0].clientX; sy = e.touches[0].clientY;
  lbImg.style.transition = 'none';
}, { passive: true });
stage.addEventListener('touchmove', e => {
  if (!touching) return;
  dx = e.touches[0].clientX - sx;
  dy = e.touches[0].clientY - sy;
  if (!axis && Math.hypot(dx, dy) > 8) axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
  if (axis === 'x') lbImg.style.transform = `translateX(${dx}px)`;
  if (axis === 'y' && dy > 0) {
    lbImg.style.transform = `translateY(${dy}px) scale(${1 - Math.min(dy / 1500, .15)})`;
    lb.style.backgroundColor = `rgba(10,11,10,${.97 - Math.min(dy / 600, .6)})`;
  }
}, { passive: true });
stage.addEventListener('touchend', () => {
  if (!touching) return;
  touching = false;
  lbImg.style.transition = '';
  lb.style.backgroundColor = '';
  if (axis === 'x' && Math.abs(dx) > 60) return show(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  if (axis === 'y' && dy > 110) { lbImg.style.transform = ''; return closeLb(); }
  lbImg.style.transform = '';
});

const nav = document.getElementById('nav');
const progress = document.getElementById('progress');
const toTop = document.getElementById('toTop');
const sections = [...document.querySelectorAll('section')];
let ticking = false;
const onScroll = () => {
  ticking = false;
  const y = nav.offsetHeight / 2;
  const sec = sections.find(s => {
    const r = s.getBoundingClientRect();
    return r.top <= y && r.bottom > y;
  });
  nav.classList.toggle('on-light', !!sec && sec.classList.contains('light'));
  nav.classList.toggle('scrolled', scrollY > 40);
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  toTop.classList.toggle('show', scrollY > innerHeight * 1.5);
};
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

applyLang(lang);
document.querySelectorAll('.work').forEach(el => el.classList.remove('in'));
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
onScroll();
