// Post outline: the list is rendered at build time; this slides a marker to the heading being read.
const toc = document.querySelector<HTMLElement>('[data-toc]');
const list = toc?.querySelector<HTMLOListElement>('.toc-list');
const marker = toc?.querySelector<HTMLElement>('.toc-marker');

const links = list ? [...list.querySelectorAll<HTMLAnchorElement>('a')] : [];
const headings = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))));

if (toc && list && marker && links.length >= 2 && headings.every(Boolean)) {
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
      if (h!.getBoundingClientRect().top <= line) next = i;
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
