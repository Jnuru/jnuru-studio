/* ---------------------------------------------------------------
   Rooftop+ demo data — Redwood Motors Group (fictional)
   All dealerships, people, and pipeline data in this file are
   fictional and generated for portfolio demonstration purposes.
   --------------------------------------------------------------- */
const TEAM_ROSTER = [
  {
    name: "Avery Coleman",
    email: "avery.coleman@redwoodmotors.example",
    googleEmail: "avery.coleman@redwoodmotors.example",
    initials: "AC",
    primaryRole: "Builder",
    isAdmin: true,
    defaultView: "my_work",
    inviteKey: "avery",
  },
  {
    name: "Maya Torres",
    email: "maya.torres@redwoodmotors.example",
    googleEmail: "maya.torres@redwoodmotors.example",
    initials: "MT",
    primaryRole: "SEO Writer",
    isAdmin: false,
    defaultView: "my_work",
    inviteKey: "maya",
  },
  {
    name: "Devon Price",
    email: "devon.price@redwoodmotors.example",
    googleEmail: "devon.price@redwoodmotors.example",
    initials: "DP",
    primaryRole: "AEO Writer",
    isAdmin: false,
    defaultView: "my_work",
    inviteKey: "devon",
  },
];

function rosterByEmail(email) {
  return TEAM_ROSTER.find((m) => m.email.toLowerCase() === (email || "").toLowerCase()) || null;
}

function rosterByInviteKey(key) {
  const k = (key || "").toLowerCase();
  return TEAM_ROSTER.find((m) => m.inviteKey === k || m.primaryRole.toLowerCase().replace(/\s+/g, "-") === k) || null;
}

function rosterByGoogleEmail(email) {
  const e = (email || "").toLowerCase();
  return TEAM_ROSTER.find((m) => {
    const ge = m.googleEmail;
    const googleEmails = Array.isArray(ge) ? ge : [ge || ""];
    return googleEmails.some((g) => g.toLowerCase() === e) || m.email.toLowerCase() === e;
  }) || null;
}

const statusLabels = {
  needs_seo: "Needs SEO",
  seo_in_progress: "SEO in progress",
  seo_done: "SEO ready",
  needs_build: "Ready to build",
  page_built: "Built — verify",
  live: "Live",
  ignored: "Ignored",
  snoozed: "Snoozed",
  needs_review: "Returned",
};

const aeoLabels = {
  not_started: "AEO pending",
  in_progress: "AEO in progress",
  done: "AEO done",
  not_needed: "AEO not needed",
};

const signalLabels = {
  upcoming: "Upcoming",
  shipped: "Shipped",
  on_lot: "On lot",
};

const dealerAccents = {
  "Redwood Toyota": "#eb0a1e",
  "Redwood Ford": "#003478",
  "Redwood Chevrolet": "#c8a95a",
  "Redwood Kia": "#05141F",
  "Redwood Mazda": "#808080",
  "Redwood Subaru": "#013c74",
  "Redwood Nissan": "#c3002f",
  "Redwood CDJR": "#8f98a3"
};

const brandAccentOverrides = {
  Kia:       { accent: "#05141F", visible: "#05141F", ink: "#d7e6f2" },
  Mazda:     { accent: "#808080", visible: "#808080", ink: "#eeeeee" },
  Chrysler:  { accent: "#203B68", visible: "#203B68", ink: "#c9dcff" },
  Dodge:     { accent: "#DA0000", visible: "#DA0000", ink: "#ffd1d1" },
  Jeep:      { accent: "#424D07", visible: "#424D07", ink: "#e3ef9a" },
  Ram:       { accent: "#767676", visible: "#767676", ink: "#eeeeee" },
  Toyota:    { accent: "#eb0a1e", visible: "#eb0a1e", ink: "#ffe0e0" },
  Chevrolet: { accent: "#c8a95a", visible: "#a07a20", ink: "#fff4d8" },
  Ford:      { accent: "#003478", visible: "#003478", ink: "#c9d8ff" },
  Nissan:    { accent: "#c3002f", visible: "#c3002f", ink: "#ffe0e8" },
  Subaru:    { accent: "#013c74", visible: "#013c74", ink: "#c9deff" },
  RAM:       { accent: "#767676", visible: "#767676", ink: "#eeeeee" },
};

const transitions = {
  needs_seo: [["seo_in_progress", "Start SEO"], ["seo_done", "Mark SEO done"], ["ignored", "Ignore"], ["snoozed", "Snooze"]],
  seo_in_progress: [["seo_done", "Mark SEO done"], ["needs_seo", "Unclaim"]],
  seo_done: [["needs_build", "Send To Build"], ["live", "Mark Already Live"]],
  needs_build: [["page_built", "Mark Page Built"], ["seo_done", "Return To SEO Done"]],
  page_built: [["live", "Mark Page Live"], ["needs_build", "Reopen"]],
  live: [["needs_review", "Review Page"]],
  ignored: [["needs_seo", "Restore"]],
  snoozed: [["needs_seo", "Unsnooze"]],
  needs_review: [["needs_seo", "Send Back To SEO"], ["live", "Keep Live"]],
};

// SEO doc links — in the production build this maps "dealer|year" to a
// shared Google Doc per dealership. The demo ships without external docs.
const SEO_DOC_LINKS = {};

function seoDocUrl(task) {
  if (!task) return null;
  return SEO_DOC_LINKS[`${task.dealer}|${task.year}|${task.make}`]
      || SEO_DOC_LINKS[`${task.dealer}|${task.year}`]
      || null;
}

const embeddedTracker = [
  {"id":"redwood-toyota|2026|toyota-rav4","dealer":"Redwood Toyota","year":2026,"make":"Toyota","model":"RAV4","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-12-20T16:00:00.000Z"}},
  {"id":"redwood-toyota|2026|toyota-camry","dealer":"Redwood Toyota","year":2026,"make":"Toyota","model":"Camry","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-10-28T16:00:00.000Z"}},
  {"id":"redwood-toyota|2026|toyota-corolla","dealer":"Redwood Toyota","year":2026,"make":"Toyota","model":"Corolla","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-12-13T16:00:00.000Z"}},
  {"id":"redwood-toyota|2026|toyota-highlander","dealer":"Redwood Toyota","year":2026,"make":"Toyota","model":"Highlander","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-12-07T16:00:00.000Z"}},
  {"id":"redwood-toyota|2026|toyota-tacoma","dealer":"Redwood Toyota","year":2026,"make":"Toyota","model":"Tacoma","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-10-29T16:00:00.000Z"}},
  {"id":"redwood-toyota|2026|toyota-tundra","dealer":"Redwood Toyota","year":2026,"make":"Toyota","model":"Tundra","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-11-13T16:00:00.000Z"}},
  {"id":"redwood-ford|2026|ford-f-150","dealer":"Redwood Ford","year":2026,"make":"Ford","model":"F-150","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-12-20T16:00:00.000Z"}},
  {"id":"redwood-ford|2026|ford-escape","dealer":"Redwood Ford","year":2026,"make":"Ford","model":"Escape","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-11-02T16:00:00.000Z"}},
  {"id":"redwood-ford|2026|ford-explorer","dealer":"Redwood Ford","year":2026,"make":"Ford","model":"Explorer","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-02-16T16:00:00.000Z"}},
  {"id":"redwood-ford|2026|ford-bronco","dealer":"Redwood Ford","year":2026,"make":"Ford","model":"Bronco","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-01-03T16:00:00.000Z"}},
  {"id":"redwood-ford|2026|ford-bronco-sport","dealer":"Redwood Ford","year":2026,"make":"Ford","model":"Bronco Sport","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-11-04T16:00:00.000Z"}},
  {"id":"redwood-ford|2026|ford-maverick","dealer":"Redwood Ford","year":2026,"make":"Ford","model":"Maverick","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-12-31T16:00:00.000Z"}},
  {"id":"redwood-chevrolet|2026|chevrolet-silverado-1500","dealer":"Redwood Chevrolet","year":2026,"make":"Chevrolet","model":"Silverado 1500","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-11-06T16:00:00.000Z"}},
  {"id":"redwood-chevrolet|2026|chevrolet-equinox","dealer":"Redwood Chevrolet","year":2026,"make":"Chevrolet","model":"Equinox","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-02-08T16:00:00.000Z"}},
  {"id":"redwood-chevrolet|2026|chevrolet-traverse","dealer":"Redwood Chevrolet","year":2026,"make":"Chevrolet","model":"Traverse","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-12-23T16:00:00.000Z"}},
  {"id":"redwood-chevrolet|2026|chevrolet-tahoe","dealer":"Redwood Chevrolet","year":2026,"make":"Chevrolet","model":"Tahoe","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-12-08T16:00:00.000Z"}},
  {"id":"redwood-chevrolet|2026|chevrolet-trax","dealer":"Redwood Chevrolet","year":2026,"make":"Chevrolet","model":"Trax","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-01-09T16:00:00.000Z"}},
  {"id":"redwood-chevrolet|2026|chevrolet-trailblazer","dealer":"Redwood Chevrolet","year":2026,"make":"Chevrolet","model":"Trailblazer","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-12-03T16:00:00.000Z"}},
  {"id":"redwood-kia|2026|kia-telluride","dealer":"Redwood Kia","year":2026,"make":"Kia","model":"Telluride","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-11-27T16:00:00.000Z"}},
  {"id":"redwood-kia|2026|kia-sportage","dealer":"Redwood Kia","year":2026,"make":"Kia","model":"Sportage","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-01-07T16:00:00.000Z"}},
  {"id":"redwood-kia|2026|kia-sorento","dealer":"Redwood Kia","year":2026,"make":"Kia","model":"Sorento","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-11-01T16:00:00.000Z"}},
  {"id":"redwood-kia|2026|kia-seltos","dealer":"Redwood Kia","year":2026,"make":"Kia","model":"Seltos","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-01-20T16:00:00.000Z"}},
  {"id":"redwood-kia|2026|kia-carnival","dealer":"Redwood Kia","year":2026,"make":"Kia","model":"Carnival","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-01-08T16:00:00.000Z"}},
  {"id":"redwood-kia|2026|kia-ev9","dealer":"Redwood Kia","year":2026,"make":"Kia","model":"EV9","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-03-03T16:00:00.000Z"}},
  {"id":"redwood-mazda|2026|mazda-cx-5","dealer":"Redwood Mazda","year":2026,"make":"Mazda","model":"CX-5","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-01-01T16:00:00.000Z"}},
  {"id":"redwood-mazda|2026|mazda-cx-50","dealer":"Redwood Mazda","year":2026,"make":"Mazda","model":"CX-50","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-01-03T16:00:00.000Z"}},
  {"id":"redwood-mazda|2026|mazda-cx-70","dealer":"Redwood Mazda","year":2026,"make":"Mazda","model":"CX-70","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-11-02T16:00:00.000Z"}},
  {"id":"redwood-mazda|2026|mazda-cx-90","dealer":"Redwood Mazda","year":2026,"make":"Mazda","model":"CX-90","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-01-19T16:00:00.000Z"}},
  {"id":"redwood-mazda|2026|mazda-cx-30","dealer":"Redwood Mazda","year":2026,"make":"Mazda","model":"CX-30","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-03-06T16:00:00.000Z"}},
  {"id":"redwood-mazda|2026|mazda-mazda3-sedan","dealer":"Redwood Mazda","year":2026,"make":"Mazda","model":"Mazda3 Sedan","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-02-28T16:00:00.000Z"}},
  {"id":"redwood-subaru|2026|subaru-outback","dealer":"Redwood Subaru","year":2026,"make":"Subaru","model":"Outback","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-02-02T16:00:00.000Z"}},
  {"id":"redwood-subaru|2026|subaru-forester","dealer":"Redwood Subaru","year":2026,"make":"Subaru","model":"Forester","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-11-05T16:00:00.000Z"}},
  {"id":"redwood-subaru|2026|subaru-crosstrek","dealer":"Redwood Subaru","year":2026,"make":"Subaru","model":"Crosstrek","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-12-13T16:00:00.000Z"}},
  {"id":"redwood-subaru|2026|subaru-ascent","dealer":"Redwood Subaru","year":2026,"make":"Subaru","model":"Ascent","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-01-28T16:00:00.000Z"}},
  {"id":"redwood-subaru|2026|subaru-impreza","dealer":"Redwood Subaru","year":2026,"make":"Subaru","model":"Impreza","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-02-05T16:00:00.000Z"}},
  {"id":"redwood-subaru|2026|subaru-solterra","dealer":"Redwood Subaru","year":2026,"make":"Subaru","model":"Solterra","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-03-11T16:00:00.000Z"}},
  {"id":"redwood-nissan|2026|nissan-rogue","dealer":"Redwood Nissan","year":2026,"make":"Nissan","model":"Rogue","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-03-01T16:00:00.000Z"}},
  {"id":"redwood-nissan|2026|nissan-altima","dealer":"Redwood Nissan","year":2026,"make":"Nissan","model":"Altima","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-11-15T16:00:00.000Z"}},
  {"id":"redwood-nissan|2026|nissan-pathfinder","dealer":"Redwood Nissan","year":2026,"make":"Nissan","model":"Pathfinder","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-01-23T16:00:00.000Z"}},
  {"id":"redwood-nissan|2026|nissan-frontier","dealer":"Redwood Nissan","year":2026,"make":"Nissan","model":"Frontier","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-12-16T16:00:00.000Z"}},
  {"id":"redwood-nissan|2026|nissan-sentra","dealer":"Redwood Nissan","year":2026,"make":"Nissan","model":"Sentra","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-01-03T16:00:00.000Z"}},
  {"id":"redwood-nissan|2026|nissan-murano","dealer":"Redwood Nissan","year":2026,"make":"Nissan","model":"Murano","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-02-27T16:00:00.000Z"}},
  {"id":"redwood-cdjr|2026|chrysler-pacifica","dealer":"Redwood CDJR","year":2026,"make":"Chrysler","model":"Pacifica","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-01-18T16:00:00.000Z"}},
  {"id":"redwood-cdjr|2026|dodge-durango","dealer":"Redwood CDJR","year":2026,"make":"Dodge","model":"Durango","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-11-09T16:00:00.000Z"}},
  {"id":"redwood-cdjr|2026|dodge-hornet","dealer":"Redwood CDJR","year":2026,"make":"Dodge","model":"Hornet","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-02-09T16:00:00.000Z"}},
  {"id":"redwood-cdjr|2026|jeep-grand-cherokee","dealer":"Redwood CDJR","year":2026,"make":"Jeep","model":"Grand Cherokee","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-01-08T16:00:00.000Z"}},
  {"id":"redwood-cdjr|2026|jeep-wrangler","dealer":"Redwood CDJR","year":2026,"make":"Jeep","model":"Wrangler","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-02-05T16:00:00.000Z"}},
  {"id":"redwood-cdjr|2026|jeep-compass","dealer":"Redwood CDJR","year":2026,"make":"Jeep","model":"Compass","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-12-03T16:00:00.000Z"}},
  {"id":"redwood-cdjr|2026|jeep-gladiator","dealer":"Redwood CDJR","year":2026,"make":"Jeep","model":"Gladiator","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-11-12T16:00:00.000Z"}},
  {"id":"redwood-cdjr|2026|ram-1500","dealer":"Redwood CDJR","year":2026,"make":"Ram","model":"1500","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2025-12-17T16:00:00.000Z"}},
  {"id":"redwood-cdjr|2026|ram-2500","dealer":"Redwood CDJR","year":2026,"make":"Ram","model":"2500","pageStatus":"live","aeoStatus":"not_needed","inventorySignal":"on_lot","details":{"buildOwner":"Avery Coleman","seoOwner":"Maya Torres","updatedAt":"2026-01-15T16:00:00.000Z"}},
  {"id":"redwood-toyota|2027|toyota-4runner","dealer":"Redwood Toyota","year":2027,"make":"Toyota","model":"4Runner","pageStatus":"live","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","updatedAt":"2026-05-30T16:00:00.000Z"},"aeoStatus":"not_needed","inventorySignal":"on_lot"},
  {"id":"redwood-kia|2027|kia-telluride","dealer":"Redwood Kia","year":2027,"make":"Kia","model":"Telluride","pageStatus":"live","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","aeoOwner":"Devon Price","updatedAt":"2026-06-19T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"on_lot"},
  {"id":"redwood-kia|2027|kia-seltos","dealer":"Redwood Kia","year":2027,"make":"Kia","model":"Seltos","pageStatus":"live","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","aeoOwner":"Devon Price","updatedAt":"2026-07-05T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"on_lot"},
  {"id":"redwood-chevrolet|2027|chevrolet-trailblazer","dealer":"Redwood Chevrolet","year":2027,"make":"Chevrolet","model":"Trailblazer","pageStatus":"live","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","updatedAt":"2026-06-03T16:00:00.000Z"},"aeoStatus":"not_needed","inventorySignal":"on_lot"},
  {"id":"redwood-chevrolet|2027|chevrolet-equinox","dealer":"Redwood Chevrolet","year":2027,"make":"Chevrolet","model":"Equinox","pageStatus":"live","details":{"seoOwner":"Maya Torres","aeoOwner":"Devon Price","updatedAt":"2026-07-07T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"on_lot"},
  {"id":"redwood-ford|2027|ford-bronco","dealer":"Redwood Ford","year":2027,"make":"Ford","model":"Bronco","pageStatus":"live","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","updatedAt":"2026-06-16T16:00:00.000Z"},"aeoStatus":"not_needed","inventorySignal":"on_lot"},
  {"id":"redwood-mazda|2027|mazda-cx-30","dealer":"Redwood Mazda","year":2027,"make":"Mazda","model":"CX-30","pageStatus":"live","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","updatedAt":"2026-07-04T16:00:00.000Z"},"aeoStatus":"not_needed","inventorySignal":"on_lot"},
  {"id":"redwood-mazda|2027|mazda-cx-50","dealer":"Redwood Mazda","year":2027,"make":"Mazda","model":"CX-50","pageStatus":"live","details":{"seoOwner":"Maya Torres","aeoOwner":"Devon Price","updatedAt":"2026-07-07T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"on_lot"},
  {"id":"redwood-mazda|2027|mazda-cx-70","dealer":"Redwood Mazda","year":2027,"make":"Mazda","model":"CX-70","pageStatus":"live","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","updatedAt":"2026-06-09T16:00:00.000Z"},"aeoStatus":"not_needed","inventorySignal":"on_lot"},
  {"id":"redwood-mazda|2027|mazda-cx-90","dealer":"Redwood Mazda","year":2027,"make":"Mazda","model":"CX-90","pageStatus":"live","details":{"seoOwner":"Maya Torres","aeoOwner":"Devon Price","updatedAt":"2026-06-12T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"on_lot"},
  {"id":"redwood-mazda|2027|mazda-mx-5-miata","dealer":"Redwood Mazda","year":2027,"make":"Mazda","model":"MX-5 Miata","pageStatus":"live","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","updatedAt":"2026-06-11T16:00:00.000Z"},"aeoStatus":"not_needed","inventorySignal":"on_lot"},
  {"id":"redwood-ford|2027|ford-escape","dealer":"Redwood Ford","year":2027,"make":"Ford","model":"Escape","pageStatus":"live","details":{"seoOwner":"Maya Torres","aeoOwner":"Devon Price","updatedAt":"2026-06-02T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"on_lot"},
  {"id":"redwood-chevrolet|2027|chevrolet-colorado","dealer":"Redwood Chevrolet","year":2027,"make":"Chevrolet","model":"Colorado","pageStatus":"live","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","aeoOwner":"Devon Price","updatedAt":"2026-06-04T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"on_lot"},
  {"id":"redwood-ford|2027|ford-f-150","dealer":"Redwood Ford","year":2027,"make":"Ford","model":"F-150","pageStatus":"live","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","aeoOwner":"Devon Price","updatedAt":"2026-06-10T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"on_lot"},
  {"id":"redwood-subaru|2027|subaru-solterra","dealer":"Redwood Subaru","year":2027,"make":"Subaru","model":"Solterra","pageStatus":"live","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","aeoOwner":"Devon Price","updatedAt":"2026-06-23T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"on_lot"},
  {"id":"redwood-ford|2027|ford-ranger","dealer":"Redwood Ford","year":2027,"make":"Ford","model":"Ranger","pageStatus":"live","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","aeoOwner":"Devon Price","updatedAt":"2026-06-04T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"on_lot"},
  {"id":"redwood-chevrolet|2027|chevrolet-trax","dealer":"Redwood Chevrolet","year":2027,"make":"Chevrolet","model":"Trax","pageStatus":"live","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","aeoOwner":"Devon Price","updatedAt":"2026-07-04T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"on_lot"},
  {"id":"redwood-mazda|2027|mazda-cx-5","dealer":"Redwood Mazda","year":2027,"make":"Mazda","model":"CX-5","pageStatus":"live","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","updatedAt":"2026-06-21T16:00:00.000Z"},"aeoStatus":"not_needed","inventorySignal":"on_lot"},
  {"id":"redwood-kia|2027|kia-niro","dealer":"Redwood Kia","year":2027,"make":"Kia","model":"Niro","pageStatus":"live","details":{"seoOwner":"Maya Torres","aeoOwner":"Devon Price","updatedAt":"2026-06-12T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"on_lot"},
  {"id":"redwood-subaru|2027|subaru-outback","dealer":"Redwood Subaru","year":2027,"make":"Subaru","model":"Outback","pageStatus":"live","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","aeoOwner":"Devon Price","updatedAt":"2026-06-10T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"on_lot"},
  {"id":"redwood-cdjr|2027|chrysler-pacifica","dealer":"Redwood CDJR","year":2027,"make":"Chrysler","model":"Pacifica","pageStatus":"live","details":{"seoOwner":"Maya Torres","aeoOwner":"Devon Price","updatedAt":"2026-06-17T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"on_lot"},
  {"id":"redwood-toyota|2027|toyota-corolla","dealer":"Redwood Toyota","year":2027,"make":"Toyota","model":"Corolla","pageStatus":"live","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","updatedAt":"2026-06-06T16:00:00.000Z"},"aeoStatus":"not_needed","inventorySignal":"on_lot"},
  {"id":"redwood-kia|2027|kia-sorento","dealer":"Redwood Kia","year":2027,"make":"Kia","model":"Sorento","pageStatus":"live","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","aeoOwner":"Devon Price","updatedAt":"2026-06-24T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"on_lot"},
  {"id":"redwood-chevrolet|2027|chevrolet-silverado-1500","dealer":"Redwood Chevrolet","year":2027,"make":"Chevrolet","model":"Silverado 1500","pageStatus":"live","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","aeoOwner":"Devon Price","updatedAt":"2026-05-31T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"on_lot"},
  {"id":"redwood-mazda|2027|mazda-mazda3-hatchback","dealer":"Redwood Mazda","year":2027,"make":"Mazda","model":"Mazda3 Hatchback","pageStatus":"live","details":{"seoOwner":"Maya Torres","aeoOwner":"Devon Price","updatedAt":"2026-06-07T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"on_lot"},
  {"id":"redwood-toyota|2027|toyota-camry","dealer":"Redwood Toyota","year":2027,"make":"Toyota","model":"Camry","pageStatus":"live","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","aeoOwner":"Devon Price","updatedAt":"2026-06-30T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"on_lot"},
  {"id":"redwood-toyota|2027|toyota-prius","dealer":"Redwood Toyota","year":2027,"make":"Toyota","model":"Prius","pageStatus":"page_built","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","aeoOwner":"Devon Price","updatedAt":"2026-06-16T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"shipped"},
  {"id":"redwood-ford|2027|ford-explorer","dealer":"Redwood Ford","year":2027,"make":"Ford","model":"Explorer","pageStatus":"page_built","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","aeoOwner":"Devon Price","updatedAt":"2026-07-10T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"on_lot"},
  {"id":"redwood-kia|2027|kia-k5","dealer":"Redwood Kia","year":2027,"make":"Kia","model":"K5","pageStatus":"page_built","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","aeoOwner":"Devon Price","updatedAt":"2026-06-19T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"shipped"},
  {"id":"redwood-kia|2027|kia-sportage","dealer":"Redwood Kia","year":2027,"make":"Kia","model":"Sportage","pageStatus":"page_built","details":{"seoOwner":"Maya Torres","aeoOwner":"Devon Price","updatedAt":"2026-07-12T16:00:00.000Z"},"aeoStatus":"in_progress","inventorySignal":"shipped"},
  {"id":"redwood-cdjr|2027|ram-1500","dealer":"Redwood CDJR","year":2027,"make":"Ram","model":"1500","pageStatus":"page_built","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","aeoOwner":"Devon Price","updatedAt":"2026-06-11T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"shipped"},
  {"id":"redwood-cdjr|2027|ram-2500","dealer":"Redwood CDJR","year":2027,"make":"Ram","model":"2500","pageStatus":"page_built","details":{"seoOwner":"Maya Torres","aeoOwner":"Devon Price","updatedAt":"2026-06-22T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"shipped"},
  {"id":"redwood-cdjr|2027|jeep-compass","dealer":"Redwood CDJR","year":2027,"make":"Jeep","model":"Compass","pageStatus":"page_built","details":{"seoOwner":"Maya Torres","aeoOwner":"Devon Price","updatedAt":"2026-06-22T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"shipped"},
  {"id":"redwood-cdjr|2027|dodge-hornet","dealer":"Redwood CDJR","year":2027,"make":"Dodge","model":"Hornet","pageStatus":"page_built","details":{"seoOwner":"Maya Torres","aeoOwner":"Devon Price","updatedAt":"2026-06-27T16:00:00.000Z"},"aeoStatus":"in_progress","inventorySignal":"shipped"},
  {"id":"redwood-mazda|2027|mazda-mazda3-sedan","dealer":"Redwood Mazda","year":2027,"make":"Mazda","model":"Mazda3 Sedan","pageStatus":"needs_build","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","updatedAt":"2026-05-29T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"shipped"},
  {"id":"redwood-nissan|2027|nissan-kicks","dealer":"Redwood Nissan","year":2027,"make":"Nissan","model":"Kicks","pageStatus":"needs_build","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","updatedAt":"2026-06-14T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"shipped"},
  {"id":"redwood-nissan|2027|nissan-rogue","dealer":"Redwood Nissan","year":2027,"make":"Nissan","model":"Rogue","pageStatus":"needs_build","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","updatedAt":"2026-06-29T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"on_lot"},
  {"id":"redwood-toyota|2027|toyota-highlander","dealer":"Redwood Toyota","year":2027,"make":"Toyota","model":"Highlander","pageStatus":"needs_build","details":{"seoOwner":"Maya Torres","updatedAt":"2026-06-02T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"shipped"},
  {"id":"redwood-ford|2027|ford-bronco-sport","dealer":"Redwood Ford","year":2027,"make":"Ford","model":"Bronco Sport","pageStatus":"needs_build","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","updatedAt":"2026-06-13T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"on_lot"},
  {"id":"redwood-subaru|2027|subaru-ascent","dealer":"Redwood Subaru","year":2027,"make":"Subaru","model":"Ascent","pageStatus":"needs_build","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","updatedAt":"2026-06-01T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"on_lot"},
  {"id":"redwood-kia|2027|kia-ev6","dealer":"Redwood Kia","year":2027,"make":"Kia","model":"EV6","pageStatus":"needs_build","details":{"seoOwner":"Maya Torres","buildOwner":"Avery Coleman","aeoOwner":"Devon Price","updatedAt":"2026-06-03T16:00:00.000Z"},"aeoStatus":"done","inventorySignal":"on_lot"},
  {"id":"redwood-kia|2027|kia-ev9","dealer":"Redwood Kia","year":2027,"make":"Kia","model":"EV9","pageStatus":"seo_done","details":{"seoOwner":"Maya Torres","updatedAt":"2026-06-21T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"shipped"},
  {"id":"redwood-cdjr|2027|jeep-grand-cherokee","dealer":"Redwood CDJR","year":2027,"make":"Jeep","model":"Grand Cherokee","pageStatus":"seo_done","details":{"seoOwner":"Maya Torres","updatedAt":"2026-07-01T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"shipped"},
  {"id":"redwood-cdjr|2027|jeep-wrangler","dealer":"Redwood CDJR","year":2027,"make":"Jeep","model":"Wrangler","pageStatus":"seo_done","details":{"seoOwner":"Maya Torres","updatedAt":"2026-07-09T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"shipped"},
  {"id":"redwood-chevrolet|2027|chevrolet-traverse","dealer":"Redwood Chevrolet","year":2027,"make":"Chevrolet","model":"Traverse","pageStatus":"seo_done","details":{"seoOwner":"Maya Torres","aeoOwner":"Devon Price","updatedAt":"2026-07-04T16:00:00.000Z"},"aeoStatus":"in_progress","inventorySignal":"on_lot"},
  {"id":"redwood-chevrolet|2027|chevrolet-blazer","dealer":"Redwood Chevrolet","year":2027,"make":"Chevrolet","model":"Blazer","pageStatus":"seo_done","details":{"seoOwner":"Maya Torres","aeoOwner":"Devon Price","updatedAt":"2026-07-10T16:00:00.000Z"},"aeoStatus":"in_progress","inventorySignal":"shipped"},
  {"id":"redwood-cdjr|2027|dodge-durango","dealer":"Redwood CDJR","year":2027,"make":"Dodge","model":"Durango","pageStatus":"seo_done","details":{"seoOwner":"Maya Torres","updatedAt":"2026-06-09T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"shipped"},
  {"id":"redwood-nissan|2027|nissan-frontier","dealer":"Redwood Nissan","year":2027,"make":"Nissan","model":"Frontier","pageStatus":"seo_done","details":{"seoOwner":"Maya Torres","updatedAt":"2026-06-14T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"shipped"},
  {"id":"redwood-cdjr|2027|jeep-gladiator","dealer":"Redwood CDJR","year":2027,"make":"Jeep","model":"Gladiator","pageStatus":"seo_done","details":{"seoOwner":"Maya Torres","aeoOwner":"Devon Price","updatedAt":"2026-06-14T16:00:00.000Z"},"aeoStatus":"in_progress","inventorySignal":"shipped"},
  {"id":"redwood-nissan|2027|nissan-altima","dealer":"Redwood Nissan","year":2027,"make":"Nissan","model":"Altima","pageStatus":"seo_in_progress","details":{"seoOwner":"Maya Torres","updatedAt":"2026-06-04T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"upcoming"},
  {"id":"redwood-nissan|2027|nissan-armada","dealer":"Redwood Nissan","year":2027,"make":"Nissan","model":"Armada","pageStatus":"seo_in_progress","details":{"seoOwner":"Maya Torres","updatedAt":"2026-06-11T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"upcoming"},
  {"id":"redwood-nissan|2027|nissan-pathfinder","dealer":"Redwood Nissan","year":2027,"make":"Nissan","model":"Pathfinder","pageStatus":"seo_in_progress","details":{"seoOwner":"Maya Torres","updatedAt":"2026-06-15T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"shipped"},
  {"id":"redwood-toyota|2027|toyota-grand-highlander","dealer":"Redwood Toyota","year":2027,"make":"Toyota","model":"Grand Highlander","pageStatus":"seo_in_progress","details":{"seoOwner":"Maya Torres","updatedAt":"2026-06-21T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"shipped"},
  {"id":"redwood-ford|2027|ford-mustang","dealer":"Redwood Ford","year":2027,"make":"Ford","model":"Mustang","pageStatus":"seo_in_progress","details":{"seoOwner":"Maya Torres","updatedAt":"2026-07-03T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"shipped"},
  {"id":"redwood-ford|2027|ford-expedition","dealer":"Redwood Ford","year":2027,"make":"Ford","model":"Expedition","pageStatus":"seo_in_progress","details":{"seoOwner":"Maya Torres","updatedAt":"2026-06-05T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"upcoming"},
  {"id":"redwood-nissan|2027|nissan-murano","dealer":"Redwood Nissan","year":2027,"make":"Nissan","model":"Murano","pageStatus":"needs_review","details":{"seoOwner":"Maya Torres","updatedAt":"2026-05-30T16:00:00.000Z","notes":"Hero image is the 2026 model — needs the 2027 refresh photo."},"aeoStatus":"not_started","inventorySignal":"upcoming"},
  {"id":"redwood-kia|2027|kia-carnival","dealer":"Redwood Kia","year":2027,"make":"Kia","model":"Carnival","pageStatus":"needs_review","details":{"seoOwner":"Maya Torres","updatedAt":"2026-06-28T16:00:00.000Z","notes":"No local dealership mention in the intro paragraph."},"aeoStatus":"not_started","inventorySignal":"upcoming"},
  {"id":"redwood-subaru|2027|subaru-brz","dealer":"Redwood Subaru","year":2027,"make":"Subaru","model":"BRZ","pageStatus":"needs_review","details":{"seoOwner":"Maya Torres","updatedAt":"2026-06-12T16:00:00.000Z","notes":"Missing trim-level comparison section — send back to copy."},"aeoStatus":"not_started","inventorySignal":"shipped"},
  {"id":"redwood-subaru|2027|subaru-wrx","dealer":"Redwood Subaru","year":2027,"make":"Subaru","model":"WRX","pageStatus":"snoozed","details":{"updatedAt":"2026-07-04T16:00:00.000Z","notes":"OEM hasn't announced 2027 details yet — revisit in the fall."},"aeoStatus":"not_started","inventorySignal":"upcoming"},
  {"id":"redwood-nissan|2027|nissan-sentra","dealer":"Redwood Nissan","year":2027,"make":"Nissan","model":"Sentra","pageStatus":"ignored","details":{"updatedAt":"2026-06-01T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"upcoming"},
  {"id":"redwood-chevrolet|2027|chevrolet-suburban","dealer":"Redwood Chevrolet","year":2027,"make":"Chevrolet","model":"Suburban","pageStatus":"needs_seo","details":{"updatedAt":"2026-06-05T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"upcoming"},
  {"id":"redwood-subaru|2027|subaru-crosstrek","dealer":"Redwood Subaru","year":2027,"make":"Subaru","model":"Crosstrek","pageStatus":"needs_seo","details":{"updatedAt":"2026-06-29T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"upcoming"},
  {"id":"redwood-ford|2027|ford-maverick","dealer":"Redwood Ford","year":2027,"make":"Ford","model":"Maverick","pageStatus":"needs_seo","details":{"updatedAt":"2026-06-24T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"on_lot"},
  {"id":"redwood-toyota|2027|toyota-rav4","dealer":"Redwood Toyota","year":2027,"make":"Toyota","model":"RAV4","pageStatus":"needs_seo","details":{"updatedAt":"2026-06-03T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"shipped"},
  {"id":"redwood-chevrolet|2027|chevrolet-tahoe","dealer":"Redwood Chevrolet","year":2027,"make":"Chevrolet","model":"Tahoe","pageStatus":"needs_seo","details":{"updatedAt":"2026-06-01T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"upcoming"},
  {"id":"redwood-toyota|2027|toyota-sienna","dealer":"Redwood Toyota","year":2027,"make":"Toyota","model":"Sienna","pageStatus":"needs_seo","details":{"updatedAt":"2026-06-07T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"upcoming"},
  {"id":"redwood-toyota|2027|toyota-tacoma","dealer":"Redwood Toyota","year":2027,"make":"Toyota","model":"Tacoma","pageStatus":"needs_seo","details":{"updatedAt":"2026-06-06T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"on_lot"},
  {"id":"redwood-toyota|2027|toyota-tundra","dealer":"Redwood Toyota","year":2027,"make":"Toyota","model":"Tundra","pageStatus":"needs_seo","details":{"updatedAt":"2026-07-11T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"upcoming"},
  {"id":"redwood-subaru|2027|subaru-forester","dealer":"Redwood Subaru","year":2027,"make":"Subaru","model":"Forester","pageStatus":"needs_seo","details":{"updatedAt":"2026-07-09T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"shipped"},
  {"id":"redwood-subaru|2027|subaru-impreza","dealer":"Redwood Subaru","year":2027,"make":"Subaru","model":"Impreza","pageStatus":"needs_seo","details":{"updatedAt":"2026-06-27T16:00:00.000Z"},"aeoStatus":"not_started","inventorySignal":"shipped"},
];

const embeddedSources = [
  {
    "dealer": "Redwood Toyota",
    "shortName": "Toyota",
    "brands": [
      "Toyota"
    ],
    "inventoryUrl": "https://www.redwoodtoyota.example.com/new-vehicles/"
  },
  {
    "dealer": "Redwood Ford",
    "shortName": "Ford",
    "brands": [
      "Ford"
    ],
    "inventoryUrl": "https://www.redwoodford.example.com/new-vehicles/"
  },
  {
    "dealer": "Redwood Chevrolet",
    "shortName": "Chevrolet",
    "brands": [
      "Chevrolet"
    ],
    "inventoryUrl": "https://www.redwoodchevrolet.example.com/new-vehicles/"
  },
  {
    "dealer": "Redwood Kia",
    "shortName": "Kia",
    "brands": [
      "Kia"
    ],
    "inventoryUrl": "https://www.redwoodkia.example.com/new-vehicles/"
  },
  {
    "dealer": "Redwood Mazda",
    "shortName": "Mazda",
    "brands": [
      "Mazda"
    ],
    "inventoryUrl": "https://www.redwoodmazda.example.com/new-vehicles/"
  },
  {
    "dealer": "Redwood Subaru",
    "shortName": "Subaru",
    "brands": [
      "Subaru"
    ],
    "inventoryUrl": "https://www.redwoodsubaru.example.com/new-vehicles/"
  },
  {
    "dealer": "Redwood Nissan",
    "shortName": "Nissan",
    "brands": [
      "Nissan"
    ],
    "inventoryUrl": "https://www.redwoodnissan.example.com/new-vehicles/"
  },
  {
    "dealer": "Redwood CDJR",
    "shortName": "CDJR",
    "brands": [
      "Chrysler",
      "Dodge",
      "Jeep",
      "Ram"
    ],
    "inventoryUrl": "https://www.redwoodcdjr.example.com/new-vehicles/"
  }
];
