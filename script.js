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
  const items = document.querySelectorAll("[data-truth]");
  if (!items.length) return;

  const HOLD_MS = 250;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  items.forEach((btn) => {
    let timer = null;
    let isHolding = false;

    const reveal = () => {
      isHolding = true;
      btn.classList.add("is-revealed");
      btn.setAttribute("aria-pressed", "true");
    };

    const hide = () => {
      isHolding = false;
      btn.classList.remove("is-revealed");
      btn.setAttribute("aria-pressed", "false");
    };

    const start = () => {
      clearTimeout(timer);

      if (prefersReduced) {
        // For reduced motion, behave like a toggle
        btn.classList.toggle("is-revealed");
        btn.setAttribute(
          "aria-pressed",
          btn.classList.contains("is-revealed") ? "true" : "false"
        );
        return;
      }

      timer = setTimeout(reveal, HOLD_MS);
    };

    const end = () => {
      clearTimeout(timer);
      timer = null;
      if (isHolding) hide(); // true press-and-hold behavior
    };

    // Best cross-platform: pointer events
    btn.addEventListener("pointerdown", start);
    btn.addEventListener("pointerup", end);
    btn.addEventListener("pointercancel", end);
    btn.addEventListener("pointerleave", end);

    // Keyboard accessibility: toggle
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.classList.toggle("is-revealed");
        btn.setAttribute(
          "aria-pressed",
          btn.classList.contains("is-revealed") ? "true" : "false"
        );
      }
    });
  });
})();
