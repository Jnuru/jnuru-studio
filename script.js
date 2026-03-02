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
  // Requires: theater.min.js included BEFORE this script (your HTML does this)
  // Target: <p id="aboutType"></p>
  // =========================
  const isAboutPage = document.body.classList.contains("page--about");
  const aboutTypeEl = document.getElementById("aboutType");
  if (!isAboutPage || !aboutTypeEl) return;

  const fallbackText =
    "I design systems, not pages. I simplify before I stylize. I ship only what holds up in production.";

  // Reduced motion => static
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    aboutTypeEl.textContent = fallbackText;
    return;
  }

  // TheaterJS missing => static (never break the page)
  if (typeof TheaterJS === "undefined") {
    aboutTypeEl.textContent = fallbackText;
    return;
  }

  // Make sure the target is clean (prevents “double init” weirdness)
  aboutTypeEl.textContent = "";

  try {
    const theater = new TheaterJS();

    // Create actor
    theater.addActor("about", { speed: 0.9, accuracy: 0.92 });

    // Force actor output into #aboutType (reliable)
    // TheaterJS writes into elements matching ".about" by default in some setups,
    // so we explicitly map output here.
    theater.getCurrentActor = () => aboutTypeEl;

    // Monkey-patch the actor's typing target safely:
    // We set a custom "typing" method by swapping the element Theater uses.
    // Most TheaterJS builds type into `actor.$element`. We ensure it exists.
    const actor = theater.getActor("about");
    if (actor) actor.$element = aboutTypeEl;

    theater.addScene(
      "about:I design systems, not pages.",
      700,
      "about: I simplify before I stylize.",
      700,
      "about: I ship only what holds up in production."
    );
  } catch (e) {
    // If TheaterJS API differs, still show something.
    aboutTypeEl.textContent = fallbackText;
  }
})();
