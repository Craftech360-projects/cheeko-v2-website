/* CHEEKO · Playbold interactions */
(function () {
  "use strict";

  /* Scroll reveal */
  var rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add("in"); });
  }

  /* Mobile nav */
  var burger = document.querySelector(".nav-burger");
  var links = document.querySelector(".nav-links");
  if (burger && links) {
    burger.addEventListener("click", function () {
      links.classList.toggle("open");
      burger.setAttribute("aria-expanded", links.classList.contains("open") ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") links.classList.remove("open");
    });
  }

  /* Film: click-to-play (no preload — India mobile first) */
  document.querySelectorAll("[data-film]").forEach(function (frame) {
    var video = frame.querySelector("video");
    var badge = frame.querySelector(".play-badge");
    if (!video || !badge) return;
    badge.addEventListener("click", function () {
      badge.classList.add("hidden");
      video.setAttribute("controls", "controls");
      video.play();
    });
    video.addEventListener("ended", function () {
      badge.classList.remove("hidden");
      video.removeAttribute("controls");
    });
  });

  /* Audio samples: honest coming-soon until real recordings land */
  document.querySelectorAll("[data-sample]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var tag = btn.closest(".sample").querySelector(".serial");
      if (tag && !tag.dataset.flipped) {
        tag.dataset.flipped = "1";
        var prev = tag.textContent;
        tag.textContent = "REAL SAMPLE LANDS BEFORE LAUNCH";
        setTimeout(function () { tag.textContent = prev; delete tag.dataset.flipped; }, 2200);
      }
    });
  });

  /* Confetti on preorder clicks (tasteful, one burst) */
  var confettiOk = typeof window.confetti === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".buy-link").forEach(function (a) {
    a.addEventListener("click", function () {
      if (confettiOk) {
        window.confetti({ particleCount: 70, spread: 65, origin: { y: 0.7 },
          colors: ["#FFC81A", "#FF5C00", "#6C3DFF", "#17130E"] });
      }
    });
  });

  /* Card deck tabs */
  document.querySelectorAll("[data-deck]").forEach(function (deck) {
    var btns = deck.querySelectorAll("[data-card]");
    var panels = deck.querySelectorAll("[data-panel]");
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        btns.forEach(function (x) { x.classList.toggle("on", x === b); });
        panels.forEach(function (p) { p.classList.toggle("on", p.getAttribute("data-panel") === b.getAttribute("data-card")); });
      });
    });
  });

  /* Card flip on tap */
  document.querySelectorAll(".fcardw").forEach(function (w) {
    w.addEventListener("click", function () { w.classList.toggle("flipped"); });
  });

  /* Auto-advance swipe rows on mobile (honest screens, card deck) */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    var autoRows = [
      { sel: ".screenrow", every: 2600 },
      { sel: ".deckrail", every: 2300 }
    ];
    autoRows.forEach(function (cfg) {
      document.querySelectorAll(cfg.sel).forEach(function (row) {
        var held = false, holdT = null, hover = false;
        function hold() {
          held = true;
          clearTimeout(holdT);
          holdT = setTimeout(function () { held = false; }, 6000);
        }
        ["pointerdown", "touchstart", "wheel"].forEach(function (e) {
          row.addEventListener(e, hold, { passive: true });
        });
        row.addEventListener("mouseenter", function () { hover = true; });
        row.addEventListener("mouseleave", function () { hover = false; });
        setInterval(function () {
          if (held || hover || document.hidden) return;
          if (row.scrollWidth <= row.clientWidth + 8) return;
          var r = row.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) return;
          var first = row.firstElementChild;
          var gap = parseFloat(getComputedStyle(row).columnGap) || 14;
          var step = first ? first.getBoundingClientRect().width + gap : row.clientWidth * 0.7;
          var max = row.scrollWidth - row.clientWidth;
          if (row.scrollLeft >= max - 8) row.scrollTo({ left: 0, behavior: "smooth" });
          else row.scrollBy({ left: step, behavior: "smooth" });
        }, cfg.every);
      });
    });
  }

  /* Footer year */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();
