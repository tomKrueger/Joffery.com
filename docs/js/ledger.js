(function () {
  "use strict";

  /* Mobile nav */
  var menuToggle = document.querySelector(".menu-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Workspace tabs */
  var tabList = document.querySelector('[role="tablist"]');
  if (tabList) {
    var tabs = tabList.querySelectorAll('[role="tab"]');
    var panels = document.querySelectorAll('[role="tabpanel"]');

    function activateTab(tab) {
      tabs.forEach(function (t) {
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
        t.tabIndex = t === tab ? 0 : -1;
      });
      panels.forEach(function (p) {
        var active = p.id === tab.getAttribute("aria-controls");
        p.classList.toggle("is-active", active);
        if (active) {
          p.removeAttribute("hidden");
        } else {
          p.setAttribute("hidden", "");
        }
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activateTab(tab);
      });
      tab.addEventListener("keydown", function (e) {
        var idx = Array.prototype.indexOf.call(tabs, tab);
        var next = null;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          next = tabs[(idx + 1) % tabs.length];
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          next = tabs[(idx - 1 + tabs.length) % tabs.length];
        } else if (e.key === "Home") {
          next = tabs[0];
        } else if (e.key === "End") {
          next = tabs[tabs.length - 1];
        }
        if (next) {
          e.preventDefault();
          activateTab(next);
          next.focus();
        }
      });
    });
  }

  /* My Work — grouping chips */
  var groupChips = document.querySelectorAll("[data-group-chip]");
  var taskLists = document.querySelectorAll("[data-task-list]");
  groupChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var mode = chip.getAttribute("data-group-chip");
      groupChips.forEach(function (c) {
        c.classList.toggle("is-on", c === chip);
      });
      taskLists.forEach(function (list) {
        list.hidden = list.getAttribute("data-task-list") !== mode;
      });
    });
  });

  document.querySelectorAll(".task-row input[type='checkbox']").forEach(function (cb) {
    cb.addEventListener("change", function () {
      cb.closest(".task-row").classList.toggle("done", cb.checked);
    });
  });

  /* Tools & Spend — unused seats filter */
  var seatFilter = document.getElementById("seat-filter");
  var seatRows = document.querySelectorAll("[data-seat-row]");
  if (seatFilter) {
    seatFilter.addEventListener("change", function () {
      var onlyUnused = seatFilter.checked;
      seatRows.forEach(function (row) {
        var unused = row.getAttribute("data-unused") === "true";
        row.hidden = onlyUnused && !unused;
      });
    });
  }

  /* Onboarding — layer toggle */
  var layerBtns = document.querySelectorAll("[data-onboard-layer]");
  var layerPanels = document.querySelectorAll("[data-onboard-panel]");
  layerBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var layer = btn.getAttribute("data-onboard-layer");
      layerBtns.forEach(function (b) {
        b.classList.toggle("is-on", b === btn);
      });
      layerPanels.forEach(function (p) {
        p.hidden = p.getAttribute("data-onboard-panel") !== layer;
      });
    });
  });

  var hireSelect = document.getElementById("hire-select");
  var hireProgress = document.getElementById("hire-progress");
  var hireProgressLabel = document.getElementById("hire-progress-label");
  if (hireSelect && hireProgress) {
    var progressMap = { alex: 72, jordan: 41, sam: 18 };
    hireSelect.addEventListener("change", function () {
      var val = hireSelect.value;
      var pct = progressMap[val] || 0;
      hireProgress.style.width = pct + "%";
      if (hireProgressLabel) {
        hireProgressLabel.textContent = pct + "% complete";
      }
    });
  }

  /* Scorecard — week toggle */
  var weekBtns = document.querySelectorAll("[data-scorecard-week]");
  var weekPanels = document.querySelectorAll("[data-scorecard-panel]");
  weekBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var w = btn.getAttribute("data-scorecard-week");
      weekBtns.forEach(function (b) {
        b.classList.toggle("is-on", b === btn);
      });
      weekPanels.forEach(function (p) {
        p.hidden = p.getAttribute("data-scorecard-panel") !== w;
      });
    });
  });

  /* Risks — sync source toggle */
  var syncBtns = document.querySelectorAll("[data-sync-source]");
  var syncNote = document.getElementById("sync-note");
  syncBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var src = btn.getAttribute("data-sync-source");
      syncBtns.forEach(function (b) {
        b.classList.toggle("is-on", b === btn);
      });
      if (syncNote) {
        var messages = {
          vanta: "Reading vendor & risk tasks from Vanta. Joffery surfaces what your team needs to act on — Vanta stays your system of record.",
          drata: "Reading vendor & risk tasks from Drata. Joffery complements your compliance workflow; Drata remains authoritative.",
          local: "No Vanta or Drata connected yet. Joffery holds your risk register and vendor list until you are ready to connect.",
        };
        syncNote.textContent = messages[src] || messages.local;
      }
    });
  });

  /* Stack & Spend calculator */
  var teamSize = document.getElementById("team-size");
  var teamSizeOut = document.getElementById("team-size-out");
  var toolChecks = document.querySelectorAll("[data-tool-cost]");
  var sprawlTotal = document.getElementById("sprawl-total");
  var jofferyTotal = document.getElementById("joffery-total");
  var savingsTotal = document.getElementById("savings-total");
  var sprawlBar = document.getElementById("sprawl-bar");
  var jofferyBar = document.getElementById("joffery-bar");
  var enterpriseTotal = document.getElementById("enterprise-total");
  var enterpriseBar = document.getElementById("enterprise-bar");

  var JOFFERY_PER_USER = 19;

  function formatMoney(n) {
    return "$" + Math.round(n).toLocaleString("en-US");
  }

  function updateCalculator() {
    if (!teamSize) return;
    var size = parseInt(teamSize.value, 10);
    if (teamSizeOut) teamSizeOut.textContent = String(size);

    var sprawl = 0;
    toolChecks.forEach(function (cb) {
      if (cb.checked) {
        var perUser = parseFloat(cb.getAttribute("data-per-user")) || 0;
        var flat = parseFloat(cb.getAttribute("data-flat")) || 0;
        sprawl += perUser * size + flat;
      }
    });

    var joffery = JOFFERY_PER_USER * size;
    var enterprise = Math.max(15000, Math.min(50000, 800 * size)) / 12;
    var savings = Math.max(0, sprawl - joffery);
    var maxBar = Math.max(sprawl, joffery, enterprise, 1);

    if (sprawlTotal) sprawlTotal.textContent = formatMoney(sprawl) + "/mo";
    if (jofferyTotal) jofferyTotal.textContent = formatMoney(joffery) + "/mo (Growth founder rate)";
    if (enterpriseTotal) enterpriseTotal.textContent = formatMoney(enterprise) + "/mo equiv.";
    if (savingsTotal) savingsTotal.textContent = formatMoney(savings) + "/mo vs. point-tool sprawl";
    if (sprawlBar) sprawlBar.style.width = (sprawl / maxBar) * 100 + "%";
    if (jofferyBar) jofferyBar.style.width = (joffery / maxBar) * 100 + "%";
    if (enterpriseBar) enterpriseBar.style.width = (enterprise / maxBar) * 100 + "%";
  }

  /* Partner multi-client switcher */
  var partnerClient = document.getElementById("partner-client");
  var partnerViews = document.querySelectorAll("[data-partner-client]");
  if (partnerClient) {
    partnerClient.addEventListener("change", function () {
      var id = partnerClient.value;
      partnerViews.forEach(function (block) {
        block.hidden = block.getAttribute("data-partner-client") !== id;
      });
    });
  }

  if (teamSize) {
    teamSize.addEventListener("input", updateCalculator);
    toolChecks.forEach(function (cb) {
      cb.addEventListener("change", updateCalculator);
    });
    updateCalculator();
  }

  /* Early access — max 2 pain picks */
  var painInputs = document.querySelectorAll("[data-pain-pick]");
  var pickHint = document.getElementById("pick-hint");
  var eaForm = document.getElementById("ea-form");
  var eaSummary = document.getElementById("ea-summary");
  var eaSuccess = document.getElementById("ea-success");
  var copySummaryBtn = document.getElementById("copy-summary");
  var mailtoBtn = document.getElementById("mailto-submit");

  var STORAGE_KEY = "joffery_ea_draft_v1";

  function getSelectedPains() {
    var selected = [];
    painInputs.forEach(function (input) {
      if (input.checked) selected.push(input.value);
    });
    return selected;
  }

  function enforcePainLimit(changedInput) {
    var selected = getSelectedPains();
    if (selected.length > 2) {
      changedInput.checked = false;
      if (pickHint) {
        pickHint.classList.add("is-warn");
        pickHint.textContent = "Choose up to two — uncheck one to switch.";
      }
      return;
    }
    if (pickHint) {
      pickHint.classList.remove("is-warn");
      pickHint.textContent =
        selected.length === 0
          ? "Select the one or two pains that hurt most right now."
          : selected.length + " selected (max 2).";
    }
  }

  painInputs.forEach(function (input) {
    input.addEventListener("change", function () {
      enforcePainLimit(input);
      saveDraft();
      refreshSummary();
    });
  });

  function buildSummary() {
    var name = (document.getElementById("ea-name") || {}).value || "";
    var email = (document.getElementById("ea-email") || {}).value || "";
    var note = (document.getElementById("ea-note") || {}).value || "";
    var pains = getSelectedPains();
    var lines = [
      "Joffery Early Access Request",
      "-----------------------------",
      "Top pain points: " + (pains.length ? pains.join("; ") : "(none selected)"),
    ];
    if (name) lines.push("Name: " + name);
    if (email) lines.push("Email: " + email);
    if (note) lines.push("Notes: " + note);
    lines.push("", "Sent via joffery.com early-access form.");
    return lines.join("\n");
  }

  function refreshSummary() {
    if (eaSummary) eaSummary.textContent = buildSummary();
  }

  function saveDraft() {
    try {
      var draft = {
        pains: getSelectedPains(),
        name: (document.getElementById("ea-name") || {}).value || "",
        email: (document.getElementById("ea-email") || {}).value || "",
        note: (document.getElementById("ea-note") || {}).value || "",
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch (_e) {
      /* ignore quota errors */
    }
  }

  function loadDraft() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var draft = JSON.parse(raw);
      painInputs.forEach(function (input) {
        input.checked = draft.pains && draft.pains.indexOf(input.value) >= 0;
      });
      var nameEl = document.getElementById("ea-name");
      var emailEl = document.getElementById("ea-email");
      var noteEl = document.getElementById("ea-note");
      if (nameEl && draft.name) nameEl.value = draft.name;
      if (emailEl && draft.email) emailEl.value = draft.email;
      if (noteEl && draft.note) noteEl.value = draft.note;
      enforcePainLimit(painInputs[0] || { checked: false });
    } catch (_e) {
      /* ignore */
    }
    refreshSummary();
  }

  ["ea-name", "ea-email", "ea-note"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", function () {
        saveDraft();
        refreshSummary();
      });
    }
  });

  if (eaForm) {
    eaForm.addEventListener("submit", function (e) {
      e.preventDefault();
      refreshSummary();
      if (eaSuccess) eaSuccess.classList.add("is-visible");
      saveDraft();
    });
  }

  if (copySummaryBtn) {
    copySummaryBtn.addEventListener("click", function () {
      var text = buildSummary();
      navigator.clipboard.writeText(text).then(function () {
        copySummaryBtn.textContent = "Copied!";
        setTimeout(function () {
          copySummaryBtn.textContent = "Copy summary";
        }, 2000);
      });
    });
  }

  if (mailtoBtn) {
    mailtoBtn.addEventListener("click", function () {
      var body = encodeURIComponent(buildSummary());
      var subject = encodeURIComponent("Joffery Early Access");
      window.location.href = "mailto:hello@joffery.com?subject=" + subject + "&body=" + body;
    });
  }

  loadDraft();

  /* FAQ accordion */
  document.querySelectorAll(".faq-item button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
})();
