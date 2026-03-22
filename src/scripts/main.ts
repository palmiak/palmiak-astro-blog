import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import php from 'highlight.js/lib/languages/php';
import typescript from 'highlight.js/lib/languages/typescript';
import quicklink from 'quicklink/dist/quicklink.js';
import confetti from 'canvas-confetti';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('php', php);
hljs.registerLanguage('typescript', typescript);
hljs.highlightAll();

window.addEventListener('load', () => {
  quicklink.listen();
});

document.addEventListener('DOMContentLoaded', () => {
  const target = document.getElementById('discussion');

  if (target) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            confetti({
              particleCount: 50,
              spread: 70,
              origin: { y: 0.6 },
            });
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(target);
  }
});
