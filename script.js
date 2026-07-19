(() => {
  // =========================
  // Footer year
  // =========================
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // =========================
  // Theme toggle
  // =========================
  const toggle = document.querySelector("[data-theme-toggle]");
  const root = document.documentElement;
  const saved = localStorage.getItem("jnuru_theme");
  if (saved === "dark") root.classList.add("dark");

  // Hidden: 5 fast clicks on the toggle glitches the page and sends you to
  // /play/?broke=1 — see play/index.html for the break-screen/vault sequence.
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let toggleClicks = [];

  toggle?.addEventListener("click", () => {
    root.classList.toggle("dark");
    localStorage.setItem(
      "jnuru_theme",
      root.classList.contains("dark") ? "dark" : "light"
    );

    const now = Date.now();
    toggleClicks = toggleClicks.filter((t) => now - t < 3000);
    toggleClicks.push(now);
    const n = toggleClicks.length;

    toggle.classList.toggle("warm", n >= 3);
    if (n === 4 && !reducedMotion) {
      toggle.classList.remove("shaking");
      void toggle.offsetWidth;
      toggle.classList.add("shaking");
    }
    if (n >= 5) {
      document.body.classList.add("glitching");
      setTimeout(() => {
        window.location.href = "/play/?broke=1";
      }, reducedMotion ? 100 : 900);
    }
  });
})();
