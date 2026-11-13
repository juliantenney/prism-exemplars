(function () {
  "use strict";

  var CATALOGUE_URL = "catalogue.json";

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function joinUrl(base, relative) {
    var left = String(base || "").replace(/\/?$/, "/");
    var right = String(relative || "").replace(/^\.\//, "");
    return left + right;
  }

  function formatDuration(minutes) {
    if (minutes == null || minutes === "" || !isFinite(Number(minutes))) {
      return "Not specified";
    }
    var n = Number(minutes);
    if (n < 60) return n + " minutes";
    var hours = Math.floor(n / 60);
    var rem = n % 60;
    if (rem === 0) return hours + (hours === 1 ? " hour" : " hours");
    return hours + (hours === 1 ? " hour " : " hours ") + rem + " min";
  }

  function statusLabel(status) {
    var s = String(status || "").trim().toLowerCase();
    if (s === "validated") return "Validated";
    if (s === "candidate") return "Candidate";
    return status ? String(status) : "Unknown";
  }

  function statusClass(status) {
    var s = String(status || "").trim().toLowerCase();
    if (s === "validated") return "exemplar-card__status--validated";
    return "exemplar-card__status--candidate";
  }

  /**
   * Minimal Markdown → HTML for briefs and prompts (headings, lists, hr, paragraphs, code).
   */
  function markdownToHtml(src) {
    var text = String(src || "").replace(/\r\n/g, "\n");
    var lines = text.split("\n");
    var html = [];
    var inList = false;
    var inCode = false;
    var codeBuf = [];

    function closeList() {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
    }

    function flushCode() {
      if (!inCode) return;
      html.push("<pre><code>" + escapeHtml(codeBuf.join("\n")) + "</code></pre>");
      codeBuf = [];
      inCode = false;
    }

    function inlineFormat(line) {
      var escaped = escapeHtml(line);
      escaped = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
      escaped = escaped.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      escaped = escaped.replace(/\*([^*]+)\*/g, "<em>$1</em>");
      return escaped;
    }

    for (var i = 0; i < lines.length; i += 1) {
      var line = lines[i];
      if (/^```/.test(line)) {
        if (inCode) {
          flushCode();
        } else {
          closeList();
          inCode = true;
          codeBuf = [];
        }
        continue;
      }
      if (inCode) {
        codeBuf.push(line);
        continue;
      }
      if (/^\s*$/.test(line)) {
        closeList();
        continue;
      }
      if (/^---+\s*$/.test(line)) {
        closeList();
        html.push("<hr />");
        continue;
      }
      var heading = line.match(/^(#{1,3})\s+(.*)$/);
      if (heading) {
        closeList();
        var level = heading[1].length;
        html.push("<h" + level + ">" + inlineFormat(heading[2]) + "</h" + level + ">");
        continue;
      }
      var bullet = line.match(/^\s*[-*]\s+(.*)$/);
      if (bullet) {
        if (!inList) {
          html.push("<ul>");
          inList = true;
        }
        html.push("<li>" + inlineFormat(bullet[1]) + "</li>");
        continue;
      }
      closeList();
      html.push("<p>" + inlineFormat(line) + "</p>");
    }
    flushCode();
    closeList();
    return html.join("\n");
  }

  function listItems(items) {
    if (!Array.isArray(items) || !items.length) {
      return "<dd><span>None listed</span></dd>";
    }
    return (
      "<dd><ul class=\"pattern-list\">" +
      items
        .map(function (item) {
          return "<li>" + escapeHtml(item) + "</li>";
        })
        .join("") +
      "</ul></dd>"
    );
  }

  function renderEmpty() {
    return (
      '<div class="catalogue__status" role="status">' +
      "<p><strong>No exemplars yet.</strong></p>" +
      "<p>When a completed Learning Journey is added under <code>journeys/</code> and " +
      "<code>catalogue.json</code> is regenerated, it will appear here.</p>" +
      "<p>See <code>docs/adding-an-exemplar.md</code> for the add procedure.</p>" +
      "</div>"
    );
  }

  /** Stable fragment target for an exemplar card (matches catalogue id). */
  function exemplarAnchorId(exemplarId) {
    var raw = String(exemplarId || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return "exemplar-" + (raw || "item");
  }

  function renderBrowse(exemplars) {
    var section = $("browse-exemplars");
    var root = $("browse-root");
    if (!root) return;

    if (!Array.isArray(exemplars) || !exemplars.length) {
      root.innerHTML = "";
      if (section) section.hidden = true;
      return;
    }

    root.innerHTML =
      '<ol class="browse-list">' +
      exemplars
        .map(function (exemplar, index) {
          var id = String(exemplar.id || "exemplar-" + index);
          var anchor = exemplarAnchorId(id);
          var title = exemplar.title || id;
          var pattern = exemplar.primary_pattern || "";
          return (
            "<li>" +
            '<a class="browse-list__link" href="#' +
            escapeHtml(anchor) +
            '">' +
            '<span class="browse-list__title">' +
            escapeHtml(title) +
            "</span>" +
            (pattern
              ? '<span class="browse-list__pattern">' +
                escapeHtml(pattern) +
                "</span>"
              : "") +
            "</a>" +
            "</li>"
          );
        })
        .join("") +
      "</ol>";

    if (section) section.hidden = false;
  }

  function focusCatalogueTarget() {
    var hash = String(window.location.hash || "").replace(/^#/, "");
    if (!hash || hash.indexOf("exemplar-") !== 0) return;
    var el = document.getElementById(hash);
    if (!el) return;
    if (typeof el.focus === "function") {
      try {
        el.focus({ preventScroll: true });
      } catch (_err) {
        el.focus();
      }
    }
    if (typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ block: "start" });
    }
  }

  function renderCard(exemplar, index) {
    var id = String(exemplar.id || "exemplar-" + index);
    var anchorId = exemplarAnchorId(id);
    var path = String(exemplar.path || "").replace(/\/?$/, "/");
    var launchRel = String(exemplar.launch || "published/index.html");
    var launchHref = joinUrl(path, launchRel);
    var briefPath = exemplar.original_brief
      ? joinUrl(path, exemplar.original_brief)
      : null;
    var promptPath = exemplar.adaptation_prompt
      ? joinUrl(path, exemplar.adaptation_prompt)
      : null;
    var patterns = Array.isArray(exemplar.supporting_patterns)
      ? exemplar.supporting_patterns
      : [];
    var sequence = Array.isArray(exemplar.learning_sequence)
      ? exemplar.learning_sequence
      : [];
    var briefId = "brief-" + id;
    var briefFeedbackId = "brief-feedback-" + id;
    var promptId = "prompt-" + id;
    var promptBodyId = "prompt-body-" + id;
    var promptFeedbackId = "prompt-feedback-" + id;

    var briefBlock = briefPath
      ? '<details class="disclosure" data-md-src="' +
        escapeHtml(briefPath) +
        '" data-md-target="' +
        escapeHtml(briefId) +
        '">' +
        '<summary class="disclosure__summary">View original brief</summary>' +
        '<div class="disclosure__body">' +
        '<div class="prompt-toolbar">' +
        '<button type="button" class="btn btn--secondary" data-copy-from="' +
        escapeHtml(briefId) +
        '" data-copy-feedback="' +
        escapeHtml(briefFeedbackId) +
        '">Copy brief</button>' +
        '<p class="prompt-feedback" id="' +
        escapeHtml(briefFeedbackId) +
        '" role="status" aria-live="polite"></p>' +
        "</div>" +
        '<div class="markdown-body" id="' +
        escapeHtml(briefId) +
        '" data-raw="" aria-busy="false"></div>' +
        "</div>" +
        "</details>"
      : '<details class="disclosure">' +
        '<summary class="disclosure__summary">View original brief</summary>' +
        '<div class="disclosure__body"><p>No original commissioning brief is available for this exemplar. ' +
        "A reconstructed brief is never presented as original.</p></div>" +
        "</details>";

    var promptBlock = promptPath
      ? '<details class="disclosure" data-md-src="' +
        escapeHtml(promptPath) +
        '" data-md-target="' +
        escapeHtml(promptBodyId) +
        '">' +
        '<summary class="disclosure__summary">AI consultation prompt</summary>' +
        '<div class="disclosure__body">' +
        '<div class="prompt-toolbar">' +
        '<button type="button" class="btn btn--secondary" data-copy-from="' +
        escapeHtml(promptBodyId) +
        '" data-copy-feedback="' +
        escapeHtml(promptFeedbackId) +
        '">Copy prompt</button>' +
        '<p class="prompt-feedback" id="' +
        escapeHtml(promptFeedbackId) +
        '" role="status" aria-live="polite"></p>' +
        "</div>" +
        '<div class="markdown-body" id="' +
        escapeHtml(promptBodyId) +
        '" data-raw="" aria-busy="false"></div>' +
        "</div>" +
        "</details>"
      : "";

    return (
      '<article class="exemplar-card" id="' +
      escapeHtml(anchorId) +
      '" tabindex="-1" data-exemplar-id="' +
      escapeHtml(id) +
      '">' +
      '<div class="exemplar-card__top">' +
      '<h3 class="exemplar-card__title">' +
      escapeHtml(exemplar.title || id) +
      "</h3>" +
      '<span class="exemplar-card__status ' +
      statusClass(exemplar.status) +
      '">' +
      escapeHtml(statusLabel(exemplar.status)) +
      "</span>" +
      "</div>" +
      (exemplar.summary
        ? '<p class="exemplar-card__summary">' + escapeHtml(exemplar.summary) + "</p>"
        : "") +
      '<dl class="exemplar-card__grid">' +
      '<div class="field"><dt>Teaching need</dt><dd>' +
      escapeHtml(exemplar.teaching_need || "—") +
      "</dd></div>" +
      '<div class="field"><dt>Intended learner capability</dt><dd>' +
      escapeHtml(exemplar.intended_capability || "—") +
      "</dd></div>" +
      '<div class="field"><dt>Primary pattern</dt><dd>' +
      escapeHtml(exemplar.primary_pattern || "—") +
      "</dd></div>" +
      '<div class="field"><dt>Supporting patterns</dt>' +
      listItems(patterns) +
      "</div>" +
      '<div class="field field--span"><dt>Transferable principle</dt><dd>' +
      escapeHtml(exemplar.transferable_principle || "—") +
      "</dd></div>" +
      (sequence.length
        ? '<div class="field field--span"><dt>Learning sequence</dt>' +
          listItems(sequence) +
          "</div>"
        : "") +
      "</dl>" +
      '<div class="meta-row">' +
      "<span><strong>" +
      escapeHtml(String(exemplar.product_count != null ? exemplar.product_count : "—")) +
      "</strong> constituent products</span>" +
      "<span>Duration: <strong>" +
      escapeHtml(formatDuration(exemplar.duration_minutes)) +
      "</strong></span>" +
      "</div>" +
      '<div class="exemplar-card__actions">' +
      '<a class="btn btn--primary" href="' +
      escapeHtml(launchHref) +
      '">Launch Learning Journey</a>' +
      "</div>" +
      briefBlock +
      promptBlock +
      "</article>"
    );
  }

  function setStatus(message, isError) {
    var status = $("catalogue-status");
    if (!status) return;
    status.hidden = false;
    status.className = "catalogue__status" + (isError ? " catalogue__status--error" : "");
    status.textContent = message;
  }

  function loadMarkdownInto(detailsEl) {
    var src = detailsEl.getAttribute("data-md-src");
    var targetId = detailsEl.getAttribute("data-md-target");
    if (!src || !targetId) return;
    var target = document.getElementById(targetId);
    if (!target) return;
    if (target.getAttribute("data-loaded") === "true") return;

    target.setAttribute("aria-busy", "true");
    target.textContent = "Loading…";

    fetch(src)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
      })
      .then(function (text) {
        target.setAttribute("data-raw", text);
        target.innerHTML = markdownToHtml(text);
        target.setAttribute("data-loaded", "true");
        target.setAttribute("aria-busy", "false");
      })
      .catch(function () {
        target.textContent = "Unable to load this file (" + src + ").";
        target.setAttribute("aria-busy", "false");
      });
  }

  function copyText(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (ok) resolve();
        else reject(new Error("copy failed"));
      } catch (err) {
        document.body.removeChild(ta);
        reject(err);
      }
    });
  }

  function bindInteractions(root) {
    // <details> "toggle" does not bubble; listen in the capture phase so
    // delegated handlers still load Markdown when a disclosure opens.
    root.addEventListener(
      "toggle",
      function (event) {
        var details = event.target;
        if (!(details instanceof HTMLDetailsElement) || !details.open) return;
        if (details.hasAttribute("data-md-src")) {
          loadMarkdownInto(details);
        }
      },
      true
    );

    root.addEventListener("click", function (event) {
      var summary = event.target.closest("summary.disclosure__summary");
      if (summary) {
        var parentDetails = summary.closest("details.disclosure");
        // After the click toggles open, ensure Markdown load is scheduled.
        if (parentDetails && parentDetails.hasAttribute("data-md-src")) {
          window.setTimeout(function () {
            if (parentDetails.open) loadMarkdownInto(parentDetails);
          }, 0);
        }
      }

      var btn = event.target.closest("[data-copy-from]");
      if (!btn) return;
      var bodyId = btn.getAttribute("data-copy-from");
      var feedbackId = btn.getAttribute("data-copy-feedback");
      var body = document.getElementById(bodyId);
      var feedback = feedbackId ? document.getElementById(feedbackId) : null;
      if (!body) return;

      var ensureLoaded = Promise.resolve();
      var details = btn.closest("details");
      if (details && details.hasAttribute("data-md-src") && body.getAttribute("data-loaded") !== "true") {
        details.open = true;
        loadMarkdownInto(details);
        ensureLoaded = new Promise(function (resolve) {
          var tries = 0;
          var timer = setInterval(function () {
            tries += 1;
            if (body.getAttribute("data-loaded") === "true" || tries > 40) {
              clearInterval(timer);
              resolve();
            }
          }, 50);
        });
      }

      ensureLoaded.then(function () {
        var raw = body.getAttribute("data-raw") || body.textContent || "";
        return copyText(raw).then(
          function () {
            if (feedback) feedback.textContent = "Copied to clipboard.";
          },
          function () {
            if (feedback) feedback.textContent = "Copy failed — select the text manually.";
          }
        );
      });
    });
  }

  function renderCatalogue(data) {
    var root = $("catalogue-root");
    var status = $("catalogue-status");
    var countEl = $("catalogue-count");
    var exemplars = data && Array.isArray(data.exemplars) ? data.exemplars : [];

    if (status) status.hidden = true;
    if (!root) return;

    root.hidden = false;
    if (!exemplars.length) {
      renderBrowse([]);
      root.innerHTML = renderEmpty();
      if (countEl) {
        countEl.hidden = false;
        countEl.textContent = "0 exemplars";
      }
      return;
    }

    renderBrowse(exemplars);
    root.innerHTML = exemplars.map(renderCard).join("");
    if (countEl) {
      countEl.hidden = false;
      countEl.textContent =
        exemplars.length === 1 ? "1 exemplar" : exemplars.length + " exemplars";
    }
    bindInteractions(root);
    focusCatalogueTarget();
  }

  function init() {
    window.addEventListener("hashchange", focusCatalogueTarget);

    fetch(CATALOGUE_URL + "?_=" + String(Date.now()), { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(renderCatalogue)
      .catch(function () {
        renderBrowse([]);
        setStatus(
          "Could not load catalogue.json. Open this site over HTTP (for example https://juliantenney.github.io/prism-exemplars/ or http://localhost/prism-exemplars/) rather than as a local file.",
          true
        );
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
