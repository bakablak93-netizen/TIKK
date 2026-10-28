import './styles.css';
import ru from './locales/ru.js';
import kk from './locales/kk.js';
import en from './locales/en.js';
import { home } from './pages/home.js';
import { content } from './pages/content.js';
import { header, footer } from './layout.js';

const locales = { ru, kk, en };
const app = document.querySelector('#app');
let previousPage;
function savedLanguage() {
  try { return localStorage.getItem('college-language'); } catch { return null; }
}
function render() {
  if (location.hash === '#main') { document.querySelector('#main')?.focus(); return; }
  const [, requestedLang, requestedPage] = location.hash.split('/');
  const saved = savedLanguage();
  const lang = Object.hasOwn(locales, requestedLang) ? requestedLang : Object.hasOwn(locales, saved) ? saved : 'ru';
  const page = /^[a-z-]+$/.test(requestedPage || '') ? requestedPage : 'home';
  const t = locales[lang];
  const link = id => `#/${lang}/${id}`;
  // Normalize the URL so language selection and direct links remain shareable.
  history.replaceState(null, '', link(page));
  try { localStorage.setItem('college-language', lang); } catch { /* Storage may be unavailable in private contexts. */ }
  document.documentElement.lang = lang;
  document.title = `${page === 'home' ? t.home : t.titles[page] || t.titles.notFound} — ${t.brand}`;
  document.querySelector('meta[name="description"]').content = t.descriptions[page] || t.hero.description;
  const scroll = window.scrollY;
  app.innerHTML = `${header(t,link,page,lang)}<main id="main" tabindex="-1">${page==='home'?home(t,link):content(page,t,link)}</main>${footer(t,link)}`;
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  const closeMenu = () => { toggle.setAttribute('aria-expanded','false'); nav.classList.remove('open'); };
  toggle.addEventListener('click',()=>{
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded',String(open)); nav.classList.toggle('open',open);
  });
  app.onkeydown = event => { if (event.key==='Escape' && toggle.getAttribute('aria-expanded')==='true') {closeMenu();toggle.focus();} };
  document.querySelector('.skip').addEventListener('click',event=>{event.preventDefault();document.querySelector('#main').focus();});
  if (previousPage !== undefined) {
    if (previousPage !== page) { document.querySelector('#main').focus({preventScroll:true}); window.scrollTo(0,0); }
    else window.scrollTo(0,scroll);
  }
  previousPage = page;
}
window.addEventListener('hashchange',render);
render();
