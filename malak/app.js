/* A letter for Malak. Vanilla, no build step. */
(function () {
  "use strict";

  var C = window.CONTENT || CONTENT;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Arabic ----------------
     Any string containing Arabic letters gets flipped to right to left and
     set in an Arabic face, so the letter can be written in either language
     or in both at once. */
  var ARABIC = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;

  function isArabic(text) {
    return typeof text === "string" && ARABIC.test(text);
  }

  function put(el, text) {
    if (!el) return;
    el.textContent = text || "";
    if (isArabic(text)) {
      el.dir = "rtl";
      el.classList.add("ar");
    }
  }

  function putAll(sel, text) {
    document.querySelectorAll(sel).forEach(function (el) { put(el, text); });
  }

  /* the whole page follows the direction of the letter itself */
  if (isArabic((C.body && C.body[0]) || C.opening)) {
    document.documentElement.lang = "ar";
    document.body.classList.add("rtl");
  }

  /* ---------------- text ---------------- */
  putAll("[data-name]", C.name);
  putAll("[data-dateline]", C.dateline);
  putAll("[data-birthdate]", C.birthdate);
  putAll("[data-age]", C.age);
  putAll("[data-from]", C.from);
  putAll("[data-wishprompt]", C.wishPrompt);
  put(document.getElementById("wishBtn"), C.wishButton || "Make a wish");
  document.title = "For " + (C.name || "you");

  /* the opening line, with one word set in italic rose */
  var opening = document.getElementById("opening");
  var line = C.opening || "";
  var mark = C.highlight;
  if (isArabic(line)) { opening.dir = "rtl"; opening.classList.add("ar"); }
  if (line.length > 40) opening.classList.add("is-long");
  if (mark && line.indexOf(mark) !== -1) {
    var at = line.indexOf(mark);
    opening.appendChild(document.createTextNode(line.slice(0, at)));
    var em = document.createElement("em");
    em.textContent = mark;
    opening.appendChild(em);
    opening.appendChild(document.createTextNode(line.slice(at + mark.length)));
  } else {
    opening.textContent = line;
  }

  var bodyEl = document.getElementById("body");
  (C.body || []).forEach(function (para) {
    var p = document.createElement("p");
    put(p, para);
    p.classList.add("reveal");
    bodyEl.appendChild(p);
  });

  if (C.pullquote) {
    var pull = document.getElementById("pull");
    pull.hidden = false;
    pull.classList.add("reveal");
    put(pull.querySelector("p"), C.pullquote);
  }

  /* ---------------- pictures ---------------- */
  function mountImage(figId, imgId, src, caption, capSel) {
    if (!src) return;
    var fig = document.getElementById(figId);
    var img = document.getElementById(imgId);
    fig.hidden = false;
    fig.classList.add("reveal");
    img.src = src;
    if (caption) put(fig.querySelector(capSel), caption);
  }

  mountImage("roses", "roseImg", C.rosePhoto, C.roseCaption, "[data-rosecaption]");
  mountImage("photo", "photoImg", C.photo, C.photoCaption, "[data-photocaption]");
  if (C.photo) document.getElementById("photoImg").alt = C.photoCaption || "A photo";

  document.getElementById("milestone").classList.add("reveal");
  document.querySelector(".wish").classList.add("reveal");
  document.querySelector(".signoff").classList.add("reveal");
  document.querySelector(".dateline").classList.add("reveal");
  opening.classList.add("reveal");

  /* ---------------- scroll reveal ----------------
     Position checked directly, throttled to one frame, and it unhooks itself
     once everything has appeared. An IntersectionObserver was tried first and
     was dropped: it silently failed to deliver after a programmatic scroll,
     which left parts of the letter invisible. Nothing may hide the words. */
  function revealOnScroll(nodes) {
    var pending = Array.prototype.slice.call(nodes);
    if (reduce) {
      pending.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var queued = false;
    function pass() {
      queued = false;
      var vh = window.innerHeight || 800;
      for (var i = pending.length - 1; i >= 0; i--) {
        var r = pending[i].getBoundingClientRect();
        if (r.top < vh * 0.9 && r.bottom > 0) {
          pending[i].classList.add("is-in");
          pending.splice(i, 1);
        }
      }
      if (!pending.length) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    }
    function onScroll() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(pass);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    pass();
    window.addEventListener("load", pass);
  }

  /* ---------------- petals ----------------
     Released once, when she makes the wish. Nothing loops on its own. */
  var canvas = document.getElementById("petals");
  var ctx = canvas.getContext("2d");
  var petals = [];
  var raf = null;
  var cw = 0, ch = 0;
  var SHADES = ["#a8102a", "#c22540", "#7d0a1e", "#d0455c", "#8e0d22"];

  function sizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cw = window.innerWidth;
    ch = window.innerHeight;
    canvas.width = Math.floor(cw * dpr);
    canvas.height = Math.floor(ch * dpr);
    canvas.style.width = cw + "px";
    canvas.style.height = ch + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawPetal(p) {
    var r = p.size;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(1, Math.max(0.25, Math.cos(p.flip)));
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.bezierCurveTo(r * 0.95, -r * 0.8, r * 0.85, r * 0.65, 0, r);
    ctx.bezierCurveTo(-r * 0.85, r * 0.65, -r * 0.95, -r * 0.8, 0, -r);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, cw, ch);
    for (var i = petals.length - 1; i >= 0; i--) {
      var p = petals[i];
      p.life += 1;
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.life * p.sway) * 0.9;
      p.rot += p.spin;
      p.flip += p.flipSpeed;
      if (p.life > p.fadeAt) p.alpha -= 0.012;
      if (p.alpha <= 0 || p.y > ch + 40) { petals.splice(i, 1); continue; }
      drawPetal(p);
    }
    if (petals.length) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
      canvas.classList.remove("is-live");
      ctx.clearRect(0, 0, cw, ch);
    }
  }

  function addPetals(count) {
    for (var i = 0; i < count; i++) {
      petals.push({
        x: Math.random() * cw,
        y: -40 - Math.random() * 190,
        vy: 1.7 + Math.random() * 2.6,
        vx: (Math.random() - 0.5) * 0.8,
        size: 6 + Math.random() * 8,
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.05,
        flip: Math.random() * Math.PI,
        flipSpeed: 0.02 + Math.random() * 0.035,
        sway: 0.02 + Math.random() * 0.03,
        alpha: 0.72 + Math.random() * 0.28,
        life: 0,
        fadeAt: 210 + Math.random() * 150,
        color: SHADES[(Math.random() * SHADES.length) | 0]
      });
    }
    if (raf === null) raf = requestAnimationFrame(tick);
  }

  /* released in waves so it falls for a few seconds instead of
     arriving as one clump and disappearing */
  function releasePetals() {
    sizeCanvas();
    canvas.classList.add("is-live");
    addPetals(22);
    setTimeout(function () { addPetals(20); }, 420);
    setTimeout(function () { addPetals(18); }, 900);
    setTimeout(function () { addPetals(14); }, 1450);
  }

  window.addEventListener("resize", function () {
    if (petals.length) sizeCanvas();
  });

  /* ---------------- the wish ---------------- */
  var btn = document.getElementById("wishBtn");
  var reply = document.getElementById("wishReply");

  btn.addEventListener("click", function () {
    btn.disabled = true;
    put(btn, isArabic(C.wishButton) ? "اتمنيتي" : "Wished");

    if (!reduce) releasePetals();

    setTimeout(function () {
      put(reply, C.wishReply);
      reply.classList.add("is-in");
    }, reduce ? 0 : 620);
  });

  /* ---------------- the envelope ---------------- */
  var gate = document.getElementById("gate");
  var envelope = document.getElementById("envelope");
  var letter = document.getElementById("letter");
  var opened = false;

  function open() {
    if (opened) return;
    opened = true;
    gate.classList.add("is-opening");
    setTimeout(function () {
      letter.hidden = false;
      gate.classList.add("is-open");
      document.body.classList.add("is-open");
      revealOnScroll(document.querySelectorAll(".reveal"));
      setTimeout(function () { gate.remove(); }, 900);
    }, reduce ? 0 : 680);
  }

  envelope.addEventListener("click", open);
  document.addEventListener("keydown", function (e) {
    if (!opened && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(); }
  });
})();
