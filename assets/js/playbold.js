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

  /* Footer year */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();
