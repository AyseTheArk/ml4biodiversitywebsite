import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const read = async name => JSON.parse(await readFile(join(root, 'content', `${name}.json`), 'utf8'));
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const href = value => {
  const url = String(value || '').trim();
  if (!url.startsWith('/') && !/^https:\/\//i.test(url) && !/^mailto:/i.test(url)) throw Error(`Unsafe link: ${url}`);
  return esc(url);
};
const link = item => `<a href="${href(item.url)}">${esc(item.label)}</a>`;
const projects = (await read('projects')).map(p => `<article class="project" tabindex="0"><span class="project-number">${esc(p.category)}</span><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>${p.links?.length ? `<div class="project-links">${p.links.map(link).join('')}</div>` : `<span class="project-status">${esc(p.status)}</span>`}</article>`).join('');
const events = (await read('events')).map(e => `<a href="${href(e.url)}"><span class="item-type">${esc(e.label)}</span><strong>${esc(e.title)}</strong><span aria-hidden="true">↗</span></a>`).join('');
const publications = (await read('publications')).map(p => `<article><span>${esc(p.label)}</span><h3>${esc(p.title)}</h3><p>${esc(p.authors)}</p>${p.links?.length ? `<div class="publication-links">${p.links.map(link).join('')}</div>` : ''}</article>`).join('');
const team = (await read('team')).map(p => `<article><img src="${href(p.image)}" alt="Portrait of ${esc(p.name)}" loading="lazy"><div><h2>${esc(p.name)}</h2><p>${esc(p.role)}</p></div></article>`).join('');

await rm(join(root, 'dist'), {recursive:true, force:true});
await cp(join(root, 'site'), join(root, 'dist'), {recursive:true});
for (const [filename, replacements] of [
  ['index.html', {PROJECTS:projects, EVENTS:events, PUBLICATIONS:publications}],
  ['about/index.html', {TEAM:team}],
]) {
  let html = await readFile(join(root,'dist',filename),'utf8');
  for (const [key, content] of Object.entries(replacements)) {
    const marker = `<!-- ${key}:START -->\n<!-- ${key}:END -->`;
    if (!html.includes(marker)) throw Error(`Missing ${key} placeholder in ${filename}`);
    html = html.replace(marker, content);
  }
  await writeFile(join(root,'dist',filename),html);
}
console.log('Built site in dist/');
