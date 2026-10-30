import Lenis from './vendor/lenis.mjs';

// Inertia scrolling on wheel and trackpad. Touch keeps native momentum; reduced motion keeps native scroll.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: { offset: -96 } });
  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

// Pink hover dots: trail the pointer (lerp .18), fade out when it leaves.
// Touch devices keep the static grid.
const root = document.documentElement;

if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let tx = 0;
  let ty = 0;
  let x = 0;
  let y = 0;
  let raf = 0;
  let seen = false;

  const frame = () => parseFloat(getComputedStyle(root).getPropertyValue('--frame')) || 16;

  const tick = () => {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    const f = frame();
    root.style.setProperty('--hush-x', `${x - f}px`);
    root.style.setProperty('--hush-y', `${y - f}px`);
    raf = Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1 ? requestAnimationFrame(tick) : 0;
  };

  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    tx = e.clientX;
    ty = e.clientY;
    if (!seen) {
      x = tx;
      y = ty;
      seen = true;
    }
    root.classList.add('hush-hover');
    if (!raf) raf = requestAnimationFrame(tick);
  });

  root.addEventListener('pointerleave', () => root.classList.remove('hush-hover'));
  addEventListener('blur', () => root.classList.remove('hush-hover'));
}

// Text roll: wrap the label of nav links and buttons so hover can slide a copy in.
document.querySelectorAll<HTMLElement>('.btn, .nav-link, .foot-links a').forEach((el) => {
  if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return;
  el.childNodes.forEach((node) => {
    const text = node.textContent?.trim();
    if (node.nodeType !== Node.TEXT_NODE || !text) return;
    const roll = document.createElement('span');
    roll.className = 'roll';
    const a = document.createElement('span');
    a.className = 'roll-a';
    a.textContent = text;
    const b = document.createElement('span');
    b.className = 'roll-b';
    b.setAttribute('aria-hidden', 'true');
    b.textContent = text;
    roll.append(a, b);
    node.replaceWith(roll);
  });
});
