/* ---------------------------------------------------------------
   demo-auth.js — local demo auth + persistence for Rooftop+
   Drop-in replacement for the production firebase.js module.
   Exposes the same fb* API surface, backed entirely by
   localStorage so the demo runs anywhere (GitHub Pages included)
   with zero backend setup.
   --------------------------------------------------------------- */

let _fbAuthReady = true;

/* Resolves with a {email} "user" if a demo session is stored,
   mirroring the production onAuthStateChanged flow. */
function fbWaitForAuth() {
  try {
    const session = JSON.parse(localStorage.getItem("rooftop-demo-session") || "null");
    return Promise.resolve(session?.email ? { email: session.email } : null);
  } catch {
    return Promise.resolve(null);
  }
}

/* Google popup sign-in does not exist in the demo — the role picker
   calls completeOnboarding() directly. Kept for API compatibility. */
function fbSignInWithGoogle() {
  return Promise.reject(new Error("Demo build — use the role picker"));
}

function fbGetRedirectResult() {
  return Promise.resolve(null);
}

function fbSignOut() {
  return Promise.resolve();
}

function fbGetCurrentUser() {
  return null;
}

/* ---------------------------------------------------------------
   Write helpers — localStorage only.
   Production swaps these for Firebase Realtime Database writes.
   --------------------------------------------------------------- */
function fbSetPageStatus(overrides) {
  localStorage.setItem("pipeline-status-overrides", JSON.stringify(overrides));
}

function fbSetAeoStatus(aeoOverrides) {
  localStorage.setItem("pipeline-aeo-overrides", JSON.stringify(aeoOverrides));
}

function fbSetSignal(signalOverrides) {
  localStorage.setItem("pipeline-signal-overrides", JSON.stringify(signalOverrides));
}

function fbSetDetails(details) {
  localStorage.setItem("pipeline-task-details", JSON.stringify(details));
}

function fbClearAll() {
  ["pipeline-status-overrides", "pipeline-aeo-overrides", "pipeline-signal-overrides", "pipeline-task-details"]
    .forEach((k) => localStorage.removeItem(k));
}
