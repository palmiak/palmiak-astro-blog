// Post outline: builds a list from the article's h2s and slides a marker to the one being read.
const toc = document.querySelector<HTMLElement>('[data-toc]');
const prose = document.querySelector<HTMLElement>('.prose-post');
const list = toc?.querySelector<HTMLOListElement>('.toc-list');
const marker = toc?.querySelector<HTMLElement>('.toc-marker');

const headings = prose ? [...prose.querySelectorAll<HTMLHeadingElement>('h2[id]')] : [];

if (toc && list && marker && headings.length >= 2) {
  const links = headings.map((h) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${h.id}`;
    a.textContent = h.textContent ?? '';
    li.append(a);
    list.append(li);
    return a;
  });
  toc.hidden = false;

  let active = -1;
  const place = (i: number) => {
    const a = links[i];
    marker.style.transform = `translateY(${a.offsetTop}px)`;
    marker.style.height = `${a.offsetHeight}px`;
    marker.style.opacity = '1';
    // keep the active entry in view inside a long outline
    const box = list.parentElement as HTMLElement;
    if (a.offsetTop < box.scrollTop || a.offsetTop + a.offsetHeight > box.scrollTop + box.clientHeight) {
      box.scrollTo({ top: a.offsetTop - box.clientHeight / 2, behavior: 'smooth' });
    }
  };

  const update = () => {
    const line = innerHeight * 0.28;
    let next = -1;
    headings.forEach((h, i) => {
      if (h.getBoundingClientRect().top <= line) next = i;
    });
    if (next === active) return;
    active = next;
    links.forEach((a, i) => a.toggleAttribute('aria-current', i === active));
    if (active >= 0) place(active);
    else marker.style.opacity = '0';
  };

  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); });
  }, { passive: true });
  addEventListener('resize', () => { if (active >= 0) place(active); });
  update();
}
