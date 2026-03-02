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
    localStorage.setItem("jnuru_theme", root.classList.contains("dark") ? "dark" : "light");
  });

  // =========================
  // ABOUT — Press & hold reveal (single source of truth)
  // =========================
  const items = document.querySelectorAll("[data-truth]");
  if (!items.length) return;

  const HOLD_MS = 220;

  items.forEach((btn) => {
    let timer = null;
    let revealed = false;

    const reveal = () => {
      revealed = true;
      btn.classList.add("is-revealed");
    };

    const hide = () => {
      revealed = false;
      btn.classList.remove("is-revealed");
    };

    const start = (e) => {
      // Prevent iOS text selection / long-press weirdness
      e.preventDefault();
      timer = setTimeout(reveal, HOLD_MS);
    };

    const end = () => {
      clearTimeout(timer);
      timer = null;
      if (revealed) hide();
    };

    // Pointer events = best cross-platform
    btn.addEventListener("pointerdown", start);
    btn.addEventListener("pointerup", end);
    btn.addEventListener("pointercancel", end);
    btn.addEventListener("pointerleave", end);

    // Tap fallback = toggle
    btn.addEventListener("click", () => {
      btn.classList.toggle("is-revealed");
    });
  });
})();
