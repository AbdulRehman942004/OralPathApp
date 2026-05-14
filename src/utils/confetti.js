// Tiny confetti burst — no dependencies, no canvas. Pure DOM.

const COLORS = ["#19d3c5", "#9b7bff", "#ff9d6b", "#ffd06b", "#ff7ac9", "#2ad29c"];

export const burstConfetti = (count = 90) => {
  const wrap = document.createElement("div");
  wrap.className = "confetti";
  document.body.appendChild(wrap);

  for (let i = 0; i < count; i++) {
    const el = document.createElement("i");
    const left = Math.random() * 100;
    const delay = Math.random() * 0.5;
    const dur = 1.8 + Math.random() * 1.6;
    const sway = (Math.random() - 0.5) * 240;
    el.style.left = `${left}vw`;
    el.style.background = COLORS[i % COLORS.length];
    el.style.animationDuration = `${dur}s`;
    el.style.animationDelay = `${delay}s`;
    el.style.transform = `translateX(${sway}px)`;
    el.style.width = `${6 + Math.random() * 6}px`;
    el.style.height = `${10 + Math.random() * 8}px`;
    wrap.appendChild(el);
  }
  setTimeout(() => wrap.remove(), 4200);
};
