function roleAccessDescription(member) {
  if (member.primaryRole === "AEO Writer") return "Your AEO workspace is ready — you'll see pages that need AEO content added.";
  if (member.primaryRole === "SEO Writer") return "Your SEO workspace is ready — you'll see pages that need copy written.";
  return "Your My Work queue shows pages ready to build and pages that need live verification.";
}

function roleAccessHelpToast(member) {
  if (member.primaryRole === "AEO Writer") return "AEO Writer access: My Work (AEO tasks)" + (member.isAdmin ? " + Team Pipeline + Admin" : "") + ".";
  if (member.primaryRole === "SEO Writer") return "SEO Writer access: My Work (SEO tasks).";
  return "Builder access: My Work + Team Pipeline" + (member.isAdmin ? " + Admin" : "") + ".";
}

function configureInviteOnboarding() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("demo") === "reset") {
    localStorage.removeItem("rooftop-demo-session");
    localStorage.removeItem("pipeline-workspace-view");
    fbClearAll();
    localStorage.setItem("rooftop-theme", "system");
    state.session = null;
    state.overrides = {};
    state.aeoOverrides = {};
    state.details = {};
    state.signalOverrides = {};
    state.workspaceView = "my_work";
    state.onboardingStep = "login";
    state.selectedTheme = "system";
    history.replaceState({}, "", window.location.pathname);
  }

  if (!els.authScreen) return;
  const shell = els.authScreen.querySelector(".auth-shell");
  if (!shell) return;

  // Live date string
  const _days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const _months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const _now = new Date();
  const dateStr = `${_days[_now.getDay()].toUpperCase()} · ${_months[_now.getMonth()].toUpperCase()} ${_now.getDate()}, ${_now.getFullYear()}`;

  const profileRows = TEAM_ROSTER.map((member, index) => {
    const roleLabel = member.isAdmin ? `${member.primaryRole} + Admin` : member.primaryRole;
    return `
      <button class="auth-profile-row auth-profile-select" type="button" data-signin-member="${member.inviteKey}">
        <span class="auth-row-index">0${index + 1}</span>
        <span class="auth-avatar" aria-hidden="true">${member.initials}</span>
        <div class="auth-profile-info">
          <strong>${member.name}</strong>
          <small>${roleLabel}</small>
        </div>
        <span class="auth-verified-badge">ENTER →</span>
      </button>
      <div class="auth-panel-rule"></div>`;
  }).join("");

  shell.innerHTML = `
    <div class="auth-split">
      <!-- Left: cream editorial -->
      <div class="auth-editorial">
        <header class="auth-editorial-header">
          <strong class="auth-logo">Rooftop<span class="sidebar-logo-plus">+</span></strong>
          <span class="auth-date">${dateStr}</span>
        </header>
        <div class="auth-editorial-body">
          <p class="auth-eyebrow-new"><span class="auth-eyebrow-dot"></span>PORTFOLIO DEMO</p>
          <h2 class="auth-headline">One pipeline.<br>Every rooftop<br>on the same page.</h2>
          <p class="auth-copy">Rooftop+ tracks new model pages for an eight-store dealer group — from SEO copy to page build to live check. Pick a role to explore the workspace. All data is fictional.</p>
        </div>
        <footer class="auth-editorial-footer">
          <div class="auth-hash-texture"></div>
          <div class="auth-footer-labels">
            <span>REDWOOD MOTORS GROUP</span>
            <span>SEO PIPELINE · 2027 MODELS</span>
          </div>
        </footer>
      </div>
      <!-- Right: dark action panel -->
      <div class="auth-action-panel">
        <div class="auth-panel-watermark">+</div>
        <div class="auth-panel-content">
          <p class="auth-signed-label">CHOOSE A WORKSPACE</p>
          <div class="auth-panel-rule"></div>
          ${profileRows}
          <button class="auth-help-link" type="button" data-auth-help>What does each role see?</button>
        </div>
      </div>
    </div>
  `;

  els.authCards = document.querySelectorAll("[data-auth-step]");
  els.flowDots = document.querySelectorAll("[data-flow-dot]");
}

function on(element, eventName, handler) {
  if (!element) return;
  element.addEventListener(eventName, handler);
}

function bindEvents() {
  configureInviteOnboarding();

  // Role picker — sign in as a fictional team member
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-signin-member]");
    if (!btn) return;
    const member = rosterByInviteKey(btn.dataset.signinMember);
    if (member) completeOnboarding(member);
  });

  on(els.restartDemoButton, "click", () => {
    localStorage.removeItem("rooftop-demo-session");
    state.session = null;
    state.onboardingStep = "login";
    setWorkspaceView("my_work", { silent: true });
    renderAuth();
    applyTheme("system");
    showToast("Demo restarted");
  });

  const signOutButton = document.getElementById("signOutButton");
  on(signOutButton, "click", () => {
    state.session = null;
    localStorage.removeItem("rooftop-demo-session");
    localStorage.removeItem("pipeline-workspace-view");
    sessionStorage.setItem("rooftop-signed-out", "1");
    state.onboardingStep = "login";
    renderAuth();
    showToast("Signed out — pick another role to keep exploring");
  });

  [els.yearFilter, els.dealerFilter, els.statusFilter, els.ownerFilter, els.searchInput].forEach((el) => {
    on(el, "input", render);
    on(el, "change", render);
  });

  on(els.clearFiltersButton, "click", () => {
    els.yearFilter.value = "all";
    els.dealerFilter.value = "all";
    els.statusFilter.value = "all";
    if (els.ownerFilter) els.ownerFilter.value = "all";
    els.searchInput.value = "";
    showToast("Filters cleared");
    render();
  });

  on(els.mobileMenuButton, "click", openNavigation);
  on(els.navCloseButton, "click", closeNavigation);
  on(els.navBackdrop, "click", closeNavigation);

  document.addEventListener("click", (event) => {
    // Pipeline group collapse toggle
    const groupToggle = event.target.closest("[data-pipeline-group-toggle]");
    if (groupToggle) {
      const tierKey = groupToggle.dataset.pipelineGroupToggle;
      if (!tierKey) return;
      const group = groupToggle.closest(".pipeline-group");
      const wasCollapsed = group ? group.classList.contains("is-collapsed") : false;
      try {
        const stored = JSON.parse(localStorage.getItem("rooftop-pipeline-group-collapsed") || "{}");
        stored[tierKey] = !wasCollapsed;
        localStorage.setItem("rooftop-pipeline-group-collapsed", JSON.stringify(stored));
      } catch {}
      render();
      return;
    }

    // "Show all X / Show less" toggle button
    const showAllBtn = event.target.closest("[data-pipeline-show-all]");
    if (showAllBtn) {
      event.stopPropagation();
      const group = showAllBtn.closest(".pipeline-group");
      if (!group) return;
      const hiddenRows = group.querySelector(".pipeline-hidden-rows");
      if (!hiddenRows) return;
      const isExpanded = !hiddenRows.hidden;
      const arrow = showAllBtn.querySelector(".pipeline-show-all-arrow");
      if (isExpanded) {
        hiddenRows.hidden = true;
        const total = showAllBtn.dataset.pipelineTotal || "";
        showAllBtn.firstChild.textContent = "Show all " + total + " ";
        if (arrow) arrow.textContent = "→";
      } else {
        hiddenRows.hidden = false;
        showAllBtn.firstChild.textContent = "Show less ";
        if (arrow) arrow.textContent = "←";
      }
      return;
    }

    // Nudge owner button
    const nudgeBtn = event.target.closest("[data-nudge-owner]");
    if (nudgeBtn) {
      event.stopPropagation();
      const ownerName = nudgeBtn.dataset.nudgeOwner || "the owner";
      showToast(`Reminder sent to ${ownerName.split(" ")[0]}`);
      return;
    }

    if (event.target.closest("[data-auth-help]")) {
      showToast("Builder: build queue + Team Pipeline + Admin. SEO Writer: copy queue. AEO Writer: AEO queue.", 5000);
      return;
    }

    const button = event.target.closest("[data-status]");
    if (button) {
      updateStatus(button.dataset.taskId, button.dataset.status);
      return;
    }

    const aeoButton = event.target.closest("[data-aeo-status]");
    if (aeoButton) {
      updateAeoStatus(aeoButton.dataset.taskId, aeoButton.dataset.aeoStatus);
      return;
    }

    const detailsButton = event.target.closest("[data-details]");
    if (detailsButton) {
      openTaskDetails(detailsButton.dataset.taskId || detailsButton.dataset.details);
      return;
    }

    const signalButton = event.target.closest("[data-signal]");
    if (!signalButton) return;
    updateSignal(signalButton.dataset.taskId, signalButton.dataset.signal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.dataset.navOpen === "true") {
      closeNavigation();
    }
  });

  on(els.digestButton, "click", () => {
    els.digestText.textContent = buildDigest();
    els.digestDialog.showModal();
  });

  on(els.scanButton, "click", runScan);

  els.workspaceButtons.forEach((button) => {
    on(button, "click", () => setWorkspaceView(button.dataset.workspaceView));
  });

  on(els.saveTaskDetailsButton, "click", saveTaskDetails);
}

function updateStatus(taskId, status) {
  const task = state.tasks.find((candidate) => candidate.id === taskId);
  if (!task) return;

  task.pageStatus = status;
  state.overrides[taskId] = status;
  fbSetPageStatus(state.overrides);

  // Auto-assign current user as owner when they claim a task
  if (state.session?.name) {
    const isBuilderStatus = ["needs_build", "page_built", "live"].includes(status);
    const isSeoStatus     = ["seo_in_progress", "seo_done"].includes(status);
    const details = { ...(task.details || {}) };
    if (isBuilderStatus && !details.buildOwner) details.buildOwner = state.session.name;
    if (isSeoStatus     && !details.seoOwner)   details.seoOwner   = state.session.name;
    task.details = details;
    state.details[taskId] = details;
    fbSetDetails(state.details);
  }

  showToast(`${displayModel(task)} moved to ${statusLabels[status] || status}`);
  render();
}

function updateAeoStatus(taskId, status) {
  const task = state.tasks.find((candidate) => candidate.id === taskId);
  if (!task) return;

  task.aeoStatus = status;
  state.aeoOverrides[taskId] = status;
  fbSetAeoStatus(state.aeoOverrides);

  // Auto-assign AEO owner when they claim a task
  if (state.session?.name && ["in_progress", "done"].includes(status)) {
    const details = { ...(task.details || {}) };
    if (!details.aeoOwner) details.aeoOwner = state.session.name;
    task.details = details;
    state.details[taskId] = details;
    fbSetDetails(state.details);
  }

  showToast(`${displayModel(task)} ${aeoLabels[status] || status}`);
  render();
}

function updateSignal(taskId, signal) {
  const task = state.tasks.find((candidate) => candidate.id === taskId);
  if (!task) return;

  task.inventorySignal = signal;
  state.signalOverrides[taskId] = signal;
  fbSetSignal(state.signalOverrides);
  showToast(`${displayModel(task)} tagged ${signalLabels[signal] || signal}`);
  render();
}

function openTaskDetails(taskId) {
  const task = state.tasks.find((candidate) => candidate.id === taskId);
  if (!task) return;

  state.activeTaskId = taskId;
  const details = task.details || {};
  els.taskDialogTitle.textContent = taskTitle(task);
  els.detailSignalSelect.value = task.inventorySignal;
  els.detailAeoSelect.value = task.aeoStatus;
  els.seoOwnerInput.value = details.seoOwner || "";
  els.aeoOwnerInput.value = details.aeoOwner || "";
  els.buildOwnerInput.value = details.buildOwner || "";
  els.taskNotesInput.value = details.notes || "";
  document.getElementById("aeoNotesInput").value = details.aeoNotes || "";
  els.taskDialog.showModal();
}

function saveTaskDetails() {
  const task = state.tasks.find((candidate) => candidate.id === state.activeTaskId);
  if (!task) return;

  task.inventorySignal = els.detailSignalSelect.value;
  task.aeoStatus = els.detailAeoSelect.value;
  state.signalOverrides[task.id] = task.inventorySignal;
  state.aeoOverrides[task.id] = task.aeoStatus;
  fbSetSignal(state.signalOverrides);
  fbSetAeoStatus(state.aeoOverrides);

  task.details = {
    seoOwner: els.seoOwnerInput.value.trim(),
    aeoOwner: els.aeoOwnerInput.value.trim(),
    buildOwner: els.buildOwnerInput.value.trim(),
    notes: els.taskNotesInput.value.trim(),
    aeoNotes: document.getElementById("aeoNotesInput").value.trim(),
    updatedAt: new Date().toISOString(),
  };
  state.details[task.id] = task.details;
  fbSetDetails(state.details);
  els.taskDialog.close();
  showToast(`${displayModel(task)} details saved`);
  render();
}

async function runScan() {
  els.scanButton.disabled = true;
  els.scanButton.textContent = "Scanning";
  try {
    mergeScanResults(seedDetectedFromTracker());
    showDigest(
      "Live inventory scanning is not part of the demo build — the dashboard is using the embedded 2027 tracker as its source.\n\nIn production, the scanner checks each rooftop's inventory feed and creates one task per year + make + model.",
    );
  } finally {
    els.scanButton.disabled = false;
    els.scanButton.textContent = "Run Scan";
    render();
  }
}

function mergeScanResults(detected) {
  const existing = new Set(state.tasks.map((task) => task.id));
  detected.forEach((item) => {
    const id = `${item.dealer}|${item.year}|${item.model}`.toLowerCase().replace(/\s+/g, "-");
    if (existing.has(id)) return;
    existing.add(id);
    state.tasks.push({
      id,
      dealer: item.dealer,
      year: Number(item.year),
      make: item.make || "",
      model: item.model,
      pageStatus: "needs_seo",
      aeoStatus: "not_started",
      details: {},
      accent: brandAccentOverrides[item.make]?.accent || dealerAccents[item.dealer] || "#2563a9",
      accentStyle: accentStyleForTask(item),
      inventorySignal: "on_lot",
      inventoryUrl: sourceFor(item.dealer)?.inventoryUrl || "",
      source: "inventory-scan",
    });
  });
}

function seedDetectedFromTracker() {
  return state.tasks
    .filter((task) => task.year >= 2027 && task.pageStatus !== "live")
    .map((task) => ({
      dealer: task.dealer,
      year: task.year,
      make: task.make,
      model: task.model,
    }));
}

function inferSignal(task) {
  if (task.pageStatus === "live") return "on_lot";
  if (["seo_done", "needs_build", "page_built"].includes(task.pageStatus)) return "shipped";
  return "upcoming";
}

function inferAeoStatus(pageStatus) {
  if (pageStatus === "aeo_in_progress") return "in_progress";
  if (pageStatus === "aeo_done") return "done";
  return "not_started";
}

function normalizePageStatus(pageStatus) {
  if (pageStatus === "needs_aeo" || pageStatus === "aeo_in_progress") return "seo_done";
  if (pageStatus === "aeo_done") return "needs_build";
  return pageStatus;
}
