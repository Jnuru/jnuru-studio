(() => {
  // =========================
  // Footer year
  // =========================
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // =========================
  // Theme toggle (stores preference)
  // =========================
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
  // ABOUT — Native typewriter (no libraries)
  // =========================
  const isAboutPage = document.body.classList.contains("page--about");
  const el = document.getElementById("aboutType");

  if (isAboutPage && el) {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lines = [
      "I design systems, not pages.",
      "I simplify before I stylize.",
      "I ship only what holds up in production."
    ];

    // Reduced motion = instant text
    if (prefersReduced) {
      el.textContent = lines.join(" ");
      return;
    }

    // Prevent double-run (Safari bfcache etc.)
    if (el.dataset.typed === "1") return;
    el.dataset.typed = "1";

    const type = (text, speed = 22) =>
      new Promise((resolve) => {
        let i = 0;
        const tick = () => {
          el.textContent += text.charAt(i);
          i++;
          if (i < text.length) {
            setTimeout(tick, speed);
          } else {
            resolve();
          }
        };
        tick();
      });

    const pause = (ms) => new Promise((r) => setTimeout(r, ms));

    const startTyping = async () => {
      el.textContent = "";

      for (let i = 0; i < lines.length; i++) {
        if (i > 0) {
          el.textContent += " ";
          await pause(160);
        }

        await type(lines[i], 22);
        await pause(420);
      }
    };

    // Start typing when visible (feels intentional)
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          startTyping();
        }
      },
      { threshold: 0.35 }
    );

    io.observe(el);
  }
})();
