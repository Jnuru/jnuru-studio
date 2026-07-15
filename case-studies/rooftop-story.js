/* rooftop-story.js — interactive beats for the Rooftop+ case study.
   Beat 1: the 17-tab chore. Beat 4: the Run Scan reveal.
   Vanilla JS, no dependencies, safe to no-op if elements are missing. */
(() => {
  "use strict";

  /* ── Beat 1: the 17-tab hunt ─────────────────────────────── */
  const ROOFTOPS = [
    "Redwood Toyota", "Redwood Ford", "Redwood Chevrolet", "Redwood Kia",
    "Redwood Kia North", "Redwood Kia East", "Redwood Kia West",
    "Redwood Mazda", "Redwood Mazda North", "Redwood Subaru",
    "Redwood Subaru West", "Redwood Nissan", "Redwood Nissan South",
    "Redwood CDJR", "Redwood CDJR East", "Redwood Buick GMC", "Redwood Honda",
  ];

  const STOCK = {
    default: ["2026 sedans — in stock", "2026 SUVs — in stock", "2026 trucks — in stock", "Certified pre-owned — 40+"],
  };

  const DUD_LINES = [
    (name) => `Nothing new at ${shortName(name)}. 16 to go.`,
    () => "Nothing here either. 15 to go.",
    () => "Still nothing. I did this every Monday.",
  ];

  const tabsEl = document.getElementById("storyTabs");
  const paneEl = document.getElementById("storyPane");
  const statusEl = document.getElementById("storyStatus");
  const emailEl = document.getElementById("storyEmail");
  const sendBtn = document.getElementById("storySend");
  const sheetEl = document.getElementById("storySheet");

  function shortName(name) {
    return name.replace("Redwood ", "");
  }

  if (tabsEl && paneEl && statusEl) {
    const clicked = new Set();
    let found = false;

    ROOFTOPS.forEach((name) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "story-tab";
      tab.textContent = shortName(name);
      tab.setAttribute("role", "tab");
      tab.dataset.rooftop = name;
      tabsEl.appendChild(tab);
    });

    tabsEl.addEventListener("click", (e) => {
      const tab = e.target.closest(".story-tab");
      if (!tab || found) return;

      tabsEl.querySelectorAll(".story-tab").forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");

      const name = tab.dataset.rooftop;
      const isNewClick = !clicked.has(name);
      if (isNewClick) clicked.add(name);

      /* The new model appears on the 4th unique rooftop the visitor opens —
         long enough to feel the chore, short enough to stay fun. */
      if (clicked.size >= 4) {
        found = true;
        tab.classList.add("is-found");
        paneEl.innerHTML = [
          `<p class="story-pane__site">${name} — New Inventory</p>`,
          `<ul class="story-stock">`,
          `<li>2026 Sportage — in stock</li>`,
          `<li class="story-stock__new"><span>NEW</span> 2027 Telluride — just hit the lot</li>`,
          `<li>2026 Sorento — in stock</li>`,
          `<li>Certified pre-owned — 40+</li>`,
          `</ul>`,
        ].join("");
        statusEl.textContent = "There it is. No page, no SEO copy, nobody assigned.";
        if (emailEl) {
          emailEl.hidden = false;
          emailEl.classList.add("is-revealed");
        }
      } else {
        paneEl.innerHTML = [
          `<p class="story-pane__site">${name} — New Inventory</p>`,
          `<ul class="story-stock">`,
          STOCK.default.map((row) => `<li>${row}</li>`).join(""),
          `</ul>`,
        ].join("");
        statusEl.textContent = DUD_LINES[Math.min(clicked.size - 1, DUD_LINES.length - 1)](name);
      }
    });
  }

  if (sendBtn && sheetEl) {
    sendBtn.addEventListener("click", () => {
      sendBtn.disabled = true;
      sendBtn.textContent = "Sent ✓";
      window.setTimeout(() => {
        sheetEl.hidden = false;
        sheetEl.classList.add("is-revealed");
        if (typeof sheetEl.scrollIntoView === "function") {
          sheetEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 350);
    });
  }

  /* ── Beat 4: the Run Scan reveal ─────────────────────────── */
  const scanGate = document.getElementById("storyScanGate");
  const scanBtn = document.getElementById("storyScanButton");
  const scanResult = document.getElementById("storyScanResult");
  let scanned = false;

  function activateEmbed(figure) {
    const frame = figure?.querySelector("iframe[data-embed-src]");
    if (frame && !frame.src) frame.src = frame.dataset.embedSrc;
  }

  function runScan() {
    if (scanned) return;
    scanned = true;
    if (scanBtn) {
      scanBtn.disabled = true;
      scanBtn.textContent = "Scanning 17 rooftops…";
    }
    window.setTimeout(() => {
      if (scanGate) scanGate.hidden = true;
      if (scanResult) {
        activateEmbed(scanResult);
        scanResult.hidden = false;
        scanResult.classList.add("is-revealed");
      }
    }, 900);
  }

  if (scanBtn) scanBtn.addEventListener("click", runScan);

  /* Skimmers who jump straight to the product shouldn't face a locked gate:
     if the scan section stays on screen, run it for them. */
  if (scanResult && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        window.setTimeout(() => {
          const rect = entry.target.getBoundingClientRect();
          const stillVisible = rect.top < window.innerHeight && rect.bottom > 0;
          if (stillVisible && !scanned) runScan();
        }, 2500);
        observer.disconnect();
      });
    }, { threshold: 0.4 });
    const scanSection = document.getElementById("storyScan");
    if (scanSection) observer.observe(scanSection);
  }

  /* Lazy-load the remaining embeds as they approach the viewport. */
  const lazyEmbeds = document.querySelectorAll(".case-embed iframe[data-embed-src]");
  if ("IntersectionObserver" in window) {
    const embedObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const frame = entry.target;
        if (!frame.src) frame.src = frame.dataset.embedSrc;
        embedObserver.unobserve(frame);
      });
    }, { rootMargin: "400px 0px" });
    lazyEmbeds.forEach((frame) => {
      if (!frame.closest("#storyScanResult")) embedObserver.observe(frame);
    });
  } else {
    lazyEmbeds.forEach((frame) => {
      if (!frame.closest("#storyScanResult")) frame.src = frame.dataset.embedSrc;
    });
  }
})();
