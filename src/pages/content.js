const empty = ([title, text]) => `<div class="empty-state"><h2>${title}</h2><p>${text}</p></div>`;
export function content(page, t, link) {
  const title = t.titles[page] || t.titles.notFound;
  let body = '';
  if (t.sections[page]) body = t.sections[page].map(([heading,text])=>`<section class="info-block"><h2>${heading}</h2><p>${text}</p></section>`).join('');
  if (page === 'admissions') body += `<section><h2>${t.faqTitle}</h2>${t.faq.map(([question,answer])=>`<details><summary>${question}</summary><p>${answer}</p></details>`).join('')}</section>`;
  if (page === 'news') body = empty(t.emptyNews);
  if (page === 'documents') body = empty(t.emptyDocs);
  if (page === 'contacts') body = `<div class="contact-grid">${t.contactCards.map(([title,text])=>`<section class="contact-card"><h2>${title}</h2><p>${text}</p></section>`).join('')}</div><p class="placeholder">${t.contactNote}</p>`;
  if (!t.titles[page]) body = `<p>${t.notFound}</p><a class="underlined" href="${link('home')}">${t.home} →</a>`;
  return `<section class="page-heading"><div class="wrap"><div class="breadcrumbs"><a href="${link('home')}">${t.home}</a><span aria-hidden="true">/</span>${title}</div><h1>${title}</h1>${t.descriptions[page] ? `<p>${t.descriptions[page]}</p>` : ''}</div></section><div class="wrap section page-layout"><nav class="side-nav" aria-label="${t.footer.resources}">${['about','education','admissions','students','news','administration','documents','contacts'].map(id=>`<a href="${link(id)}" ${page===id?'aria-current="page"':''}>${t.titles[id]}</a>`).join('')}</nav><div>${body}</div></div>`;
}
