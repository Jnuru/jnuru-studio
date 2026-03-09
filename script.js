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

  toggle?.addEventListener("click", () => {
    root.classList.toggle("dark");
    localStorage.setItem(
      "jnuru_theme",
      root.classList.contains("dark") ? "dark" : "light"
    );
  });

  // =========================
  // About page typing
  // =========================
  const isAboutPage = document.body.classList.contains("page--about");
  if (!isAboutPage) return;

  const heroEl = document.getElementById("heroType");
  const aboutEl = document.getElementById("aboutType");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const heroText = "system-focused freelance designer.";
  const aboutLines = [
    "I design systems, not pages.",
    "I simplify before I stylize.",
    "I ship only what holds up in production."
  ];

  if (prefersReduced) {
    if (heroEl) heroEl.textContent = heroText;
    if (aboutEl) aboutEl.textContent = aboutLines.join(" ");
    return;
  }

  const typeText = (el, text, speed = 28) =>
    new Promise((resolve) => {
      if (!el) return resolve();
      let i = 0;
      el.textContent = "";

      const tick = () => {
        el.textContent += text.charAt(i);
        i++;
        if (i < text.length) {
          setTimeout(tick, speed);
        } else {
          resolve();
        }
      };

      if (!text.length) return resolve();
      tick();
    });

  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const runHero = async () => {
    if (!heroEl || heroEl.dataset.typed === "1") return;
    heroEl.dataset.typed = "1";
    await typeText(heroEl, heroText, 26);
  };

  const runAbout = async () => {
    if (!aboutEl || aboutEl.dataset.typed === "1") return;
    aboutEl.dataset.typed = "1";
    aboutEl.textContent = "";

    for (let i = 0; i < aboutLines.length; i++) {
      if (i > 0) {
        aboutEl.textContent += " ";
        await pause(140);
      }
      await typeText(
        { 
          get textContent() { return aboutEl.textContent; },
          set textContent(value) { aboutEl.textContent = value; }
        },
        aboutLines[i],
        22
      );
      await pause(260);
    }
  };

  // hero starts immediately
  runHero();

  // about starts when visible
  if (aboutEl) {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          io.disconnect();
          runAbout();
        }
      },
      { threshold: 0.35 }
    );

    io.observe(aboutEl);
  }
})();
