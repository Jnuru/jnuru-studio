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
})();




// existing code here...

// ===============================
// About page — Truth Layer
// ===============================
(() => {
  const items = document.querySelectorAll("[data-truth]");
  if (!items.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  items.forEach((btn) => {
    let timer = null;

    const holdStart = () => {
      if (prefersReduced) {
        btn.classList.toggle("is-held");
        return;
      }
      timer = setTimeout(() => btn.classList.add("is-held"), 140);
    };

    const holdEnd = () => {
      clearTimeout(timer);
      btn.classList.remove("is-held");
    };

    btn.addEventListener("mousedown", holdStart);
    btn.addEventListener("mouseup", holdEnd);
    btn.addEventListener("mouseleave", holdEnd);

    btn.addEventListener("touchstart", holdStart, { passive: true });
    btn.addEventListener("touchend", holdEnd);
    btn.addEventListener("touchcancel", holdEnd);

    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") holdStart();
    });
    btn.addEventListener("keyup", (e) => {
      if (e.key === "Enter" || e.key === " ") holdEnd();
    });
  });
})();



// =========================
// ABOUT — Press & hold reveal
// =========================
(() => {
  const items = document.querySelectorAll('[data-truth]');
  if (!items.length) return;

  const HOLD_MS = 220; // short + snappy (iPhone friendly)

  items.forEach((btn) => {
    let timer = null;
    let holding = false;

    const reveal = () => {
      holding = true;
      btn.classList.add('is-revealed');
    };

    const hide = () => {
      holding = false;
      btn.classList.remove('is-revealed');
    };

    const start = (e) => {
      // prevent iOS long-press text selection / weirdness
      e.preventDefault();
      timer = setTimeout(reveal, HOLD_MS);
    };

    const end = () => {
      clearTimeout(timer);
      timer = null;

      // If they actually held, release hides it (true "press and hold")
      if (holding) hide();
    };

    // Touch + Pointer (best cross-platform)
    btn.addEventListener('pointerdown', start);
    btn.addEventListener('pointerup', end);
    btn.addEventListener('pointercancel', end);
    btn.addEventListener('pointerleave', end);

    // Fallback: keyboard / click toggles
    btn.addEventListener('click', () => {
      btn.classList.toggle('is-revealed');
    });
  });
})();
