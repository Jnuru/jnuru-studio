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
  // ABOUT — TheaterJS (type lines once)
  // Requires: <script src="...theater.min.js"></script> on About page
  // Target: <p id="aboutType"></p>
  // =========================
  const aboutTypeEl = document.getElementById("aboutType");
  const isAboutPage = document.body.classList.contains("page--about");

  if (isAboutPage && aboutTypeEl) {
    // If TheaterJS didn't load, fail silently (don’t break the site)
    if (typeof TheaterJS === "undefined") return;

    // If user prefers reduced motion, just render static text
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      aboutTypeEl.textContent =
        "I design systems, not pages. I simplify before I stylize. I ship only what holds up in production.";
      return;
    }

    // Clean slate (avoid double-init if cached navigation)
    aboutTypeEl.textContent = "";

    const theater = new TheaterJS();

    theater
      .addActor("about", { speed: 0.9, accuracy: 0.92 }, "#aboutType")
      .addScene(
        "about:I design systems, not pages.",
        700,
        "about: I simplify before I stylize.",
        700,
        "about: I ship only what holds up in production."
      );

    // Optional: add a subtle caret via CSS, not JS (cleaner)
  }
})();
