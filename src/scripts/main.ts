// quicklink — load after full page load, not critical
window.addEventListener('load', async () => {
  const { default: quicklink } = await import('quicklink/dist/quicklink.js');
  quicklink.listen();
});

// confetti — load only when #discussion scrolls into view
const target = document.getElementById('discussion');
if (target) {
  const observer = new IntersectionObserver(
    async (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const { default: confetti } = await import('canvas-confetti');
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
          obs.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1 }
  );
  observer.observe(target);
}
