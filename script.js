(() => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme toggle (stores preference)
  const toggle = document.querySelector("[data-theme-toggle]");
  const root = document.documentElement;

  const saved = localStorage.getItem("jnuru_theme");
  if (saved === "dark") root.classList.add("dark");

  toggle?.addEventListener("click", () => {
    root.classList.toggle("dark");
    localStorage.setItem(
      "jnuru_theme",
      root.classList.contains("dark") ? "dark" : "light"
    );
  });

 // =========================
// ABOUT — Press & hold reveal (single source of truth)
// =========================
(() => {
  const items = document.querySelectorAll("[data-truth]");
  if (!items.length) return;

  const HOLD_MS = 220;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  items.forEach((btn) => {
    let timer = null;

    const show = () => btn.classList.add("is-revealed");
    const hide = () => btn.classList.remove("is-revealed");

    const start = () => {
      if (prefersReduced) return btn.classList.toggle("is-revealed");
      timer = window.setTimeout(show, HOLD_MS);
    };

    const end = () => {
      window.clearTimeout(timer);
      timer = null;
      hide();
    };

    // Best cross-platform: pointer events
    btn.addEventListener("pointerdown", start);
    btn.addEventListener("pointerup", end);
    btn.addEventListener("pointercancel", end);
    btn.addEventListener("pointerleave", end);

    // Keyboard accessibility
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") start();
    });
    btn.addEventListener("keyup", (e) => {
      if (e.key === "Enter" || e.key === " ") end();
    });

    // Click fallback (desktop)
    btn.addEventListener("click", () => {
      btn.classList.toggle("is-revealed");
    });
  });
})();
