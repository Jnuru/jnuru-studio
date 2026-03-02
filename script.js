// =========================
// ABOUT — Press & hold reveal (clean)
// =========================
(() => {
  const items = document.querySelectorAll("[data-truth]");
  if (!items.length) return;

  const HOLD_MS = 180;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  items.forEach((btn) => {
    let t = null;
    let held = false;

    const show = () => {
      held = true;
      btn.classList.add("is-revealed");
      btn.setAttribute("aria-expanded", "true");
    };

    const hide = () => {
      held = false;
      btn.classList.remove("is-revealed");
      btn.setAttribute("aria-expanded", "false");
    };

    const start = (e) => {
      // Don’t block mouse clicks; only avoid touch long-press weirdness
      if (e.pointerType === "touch") e.preventDefault();

      if (prefersReduced) {
        btn.classList.toggle("is-revealed");
        return;
      }

      btn.classList.add("is-pressing");
      t = setTimeout(show, HOLD_MS);
    };

    const end = () => {
      btn.classList.remove("is-pressing");
      clearTimeout(t);
      t = null;
      if (held) hide();
    };

    btn.addEventListener("pointerdown", start);
    btn.addEventListener("pointerup", end);
    btn.addEventListener("pointercancel", end);
    btn.addEventListener("pointerleave", end);

    // Keyboard: hold space/enter
    btn.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") start({ pointerType: "keyboard", preventDefault(){} });
    });
    btn.addEventListener("keyup", (e) => {
      if (e.key === " " || e.key === "Enter") end();
    });

    // Optional: click toggles on desktop
    btn.addEventListener("click", () => {
      btn.classList.toggle("is-revealed");
      btn.setAttribute("aria-expanded", btn.classList.contains("is-revealed") ? "true" : "false");
    });
  });
})();
