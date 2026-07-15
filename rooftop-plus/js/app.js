/* ---------------------------------------------------------------
   app.js — Rooftop+ boot sequence.
   The production build layers live dealer CSV inventory feeds on
   top of the tracker here; the demo boots straight from the
   embedded seed data in js/data.js.
   --------------------------------------------------------------- */

function loadClassicScript(url) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${url}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = url;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Unable to load ${url}`));
    document.head.append(script);
  });
}

async function boot() {
  applyTheme(state.selectedTheme);

  // Embed mode — used by the case study to drop straight into a role +
  // view inside an iframe: ?embed=avery&view=team_board
  const bootParams = new URLSearchParams(window.location.search);
  const embedMember = bootParams.get("embed") ? rosterByInviteKey(bootParams.get("embed")) : null;
  if (embedMember) {
    state.session = {
      email:       embedMember.email,
      name:        embedMember.name,
      initials:    embedMember.initials,
      primaryRole: embedMember.primaryRole,
      isAdmin:     embedMember.isAdmin,
      defaultView: embedMember.defaultView,
    };
    const embedView = bootParams.get("view");
    if (["my_work", "team_board", "wins"].includes(embedView)) {
      state.workspaceView = embedView;
    } else {
      state.workspaceView = embedMember.defaultView;
    }
    document.body.dataset.embed = "true";
  }

  // Restore a returning demo session (mirrors the production Firebase
  // Auth check — demo-auth.js resolves from localStorage instead).
  const justSignedOut = sessionStorage.getItem("rooftop-signed-out") === "1";
  if (justSignedOut) sessionStorage.removeItem("rooftop-signed-out");

  if (!embedMember) try {
    const user = justSignedOut ? null : await fbWaitForAuth();
    if (user) {
      const member = rosterByGoogleEmail(user.email);
      if (member) {
        state.session = {
          email:       member.email,
          name:        member.name,
          initials:    member.initials,
          primaryRole: member.primaryRole,
          isAdmin:     member.isAdmin,
          defaultView: member.defaultView,
        };
        localStorage.setItem("rooftop-demo-session", JSON.stringify(state.session));
      } else {
        state.session = null;
        localStorage.removeItem("rooftop-demo-session");
      }
    } else {
      state.session = null;
      localStorage.removeItem("rooftop-demo-session");
    }
  } catch (err) {
    console.warn("[Rooftop+] Session restore failed", err);
  }

  await loadClassicScript("js/my-work-workbench.js?v=20260714");
  await loadClassicScript("js/rooftop-implementation.js?v=20260714");
  if (!embedMember) normalizeSession();
  bindEvents();
  renderAuth();

  state.sources = embeddedSources;
  state.rooftops = loadRooftops(embeddedSources);
  state.inventoryFeed = { connected: false, rows: [], message: "Demo seed data" };
  state.tasks = embeddedTracker.map((task) => {
    const pageStatus = normalizePageStatus(state.overrides[task.id] || task.pageStatus);
    return {
      ...task,
      pageStatus,
      aeoStatus: state.aeoOverrides[task.id] || normalizeAeoStatus(task.aeoStatus) || "not_started",
      details: { ...(task.details || {}), ...(state.details[task.id] || {}) },
      inventorySignal: state.signalOverrides[task.id] || task.inventorySignal || inferSignal(task),
      accent: brandAccentOverrides[task.make]?.accent || dealerAccents[task.dealer] || "#2563a9",
      accentStyle: accentStyleForTask(task),
      inventoryUrl: sourceFor(task.dealer)?.inventoryUrl || task.inventoryUrl || "",
    };
  });
  populateYearFilter();
  populateDealerFilter();
  populateOwnerFilter();
  render();
  document.body.dataset.loaded = "true";
  const _veil = document.getElementById("app-veil");
  if (_veil) { _veil.classList.add("is-hidden"); setTimeout(() => _veil.remove(), 260); }
}

function loadRooftops(sources) {
  if (Array.isArray(state.rooftops)) return state.rooftops;
  return sources.map((source) => ({
    id: normalizeCompare(source.dealer),
    name: source.dealer,
    brand: source.brands?.join(", ") || "Brand",
    feedUrl: source.inventoryUrl || "",
    active: true,
  }));
}

function normalizeSession() {
  if (!state.session) return;

  const member = rosterByEmail(state.session.email) || null;
  if (member) {
    state.session = {
      email: member.email,
      name: member.name,
      initials: member.initials,
      primaryRole: member.primaryRole,
      isAdmin: member.isAdmin,
      defaultView: member.defaultView,
    };
    localStorage.setItem("rooftop-demo-session", JSON.stringify(state.session));
    return;
  }

  if (state.session.primaryRole && typeof state.session.isAdmin === "boolean") return;
  localStorage.setItem("rooftop-demo-session", JSON.stringify(state.session));
}

function normalizeFeedKey(key) {
  return String(key || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function normalizeAeoStatus(status) {
  const normalized = normalizeFeedKey(status);
  if (["not_started", "in_progress", "done", "not_needed"].includes(normalized)) return normalized;
  if (normalized === "complete" || normalized === "completed" || normalized === "aeo_done" || normalized === "aeo_complete") return "done";
  if (normalized === "pending" || normalized === "notstarted" || normalized === "aeo_not_started") return "not_started";
  if (normalized === "inprogress" || normalized === "aeo_in_progress") return "in_progress";
  return null;
}

function normalizeCompare(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function sourceFor(dealer) {
  return state.sources.find((source) => normalizeCompare(source.dealer) === normalizeCompare(dealer));
}

function populateDealerFilter() {
  const dealers = [...new Set(state.tasks.map((task) => task.dealer))].sort();
  els.dealerFilter.innerHTML = [
    `<option value="all">All dealerships</option>`,
    ...dealers.map((dealer) => `<option value="${escapeAttr(dealer)}">${escapeHtml(dealer)}</option>`),
  ].join("");
}

function populateYearFilter() {
  const years = [...new Set(state.tasks.map((task) => task.year))].sort((a, b) => b - a);
  els.yearFilter.innerHTML = [
    `<option value="all">All years</option>`,
    ...years.map((year) => `<option value="${year}">${year}</option>`),
  ].join("");
  els.yearFilter.value = "all";
}

function populateOwnerFilter() {
  if (!els.ownerFilter) return;
  const activeTasks = state.tasks.filter((task) => !["live", "ignored", "snoozed"].includes(task.pageStatus));
  const owners = new Set(
    activeTasks.map((task) => (typeof pipelineOwnerForTask === "function" ? pipelineOwnerForTask(task) : (task.details?.buildOwner || task.details?.seoOwner || "Team")))
  );
  els.ownerFilter.innerHTML = [
    `<option value="all">All owners</option>`,
    ...[...owners].sort().map((owner) => `<option value="${escapeAttr(owner)}">${escapeHtml(owner)}</option>`),
  ].join("");
}

boot().catch((error) => {
  console.error(error);
  const _veil2 = document.getElementById("app-veil");
  if (_veil2) { _veil2.classList.add("is-hidden"); setTimeout(() => _veil2.remove(), 220); }
  try { showToast("Some demo data could not load yet"); } catch (e) { console.warn("showToast failed during boot recovery:", e); }
  try { renderAuth(); } catch (e) { console.error("renderAuth() failed during boot recovery:", e); document.body.dataset.auth = "signed_out"; }
  try { render(); } catch (e) {
    console.error("render() failed during boot recovery:", e);
    const _panels = document.querySelector(".main-panels") || document.getElementById("app");
    if (_panels) _panels.insertAdjacentHTML("afterbegin", '<p class="render-error" style="padding:1rem">Dashboard failed to load — refresh the page or press F12 for details.</p>');
  }
});
