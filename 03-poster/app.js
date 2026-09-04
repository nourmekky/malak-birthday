/* Poster. Vanilla, no build step. */
(function () {
  "use strict";

  var C = window.CONTENT || CONTENT;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function set(sel, v) {
    document.querySelectorAll(sel).forEach(function (el) { el.textContent = v || ""; });
  }

  /* ---------------- hero ---------------- */
  var title = document.getElementById("heroWords");
  (C.heroWords || []).forEach(function (word) {
    var s = document.createElement("span");
    s.textContent = word;
    title.appendChild(s);
  });
  /* Fit each headline line to the width of its column, then shrink the whole
     block if it would push the hero past the bottom of the screen. Whatever
     words you write, they fill the line, never overflow sideways, and the
     hero always fits in one screen. */
  var MIN_PX = 24, MAX_PX = 300;
  var posterEl = document.querySelector(".poster");
  var gridEl = document.querySelector(".poster__grid");

  function fitTitle() {
    var box = title.clientWidth;
    var spans = title.querySelectorAll("span");
    if (!box || !spans.length) return;

    /* width each line takes per 1px of font size */
    var ratio = [];
    for (var i = 0; i < spans.length; i++) {
      spans[i].style.fontSize = "100px";
      spans[i].style.display = "inline-block";
      var natural = spans[i].getBoundingClientRect().width;
      spans[i].style.display = "";
      ratio.push(natural > 0 ? natural / 100 : 1);
    }

    function apply(width) {
      for (var j = 0; j < spans.length; j++) {
        var size = width / ratio[j];
        spans[j].style.fontSize = Math.max(MIN_PX, Math.min(MAX_PX, size)) + "px";
      }
    }

    var w = box;
    apply(w);

    var cs = window.getComputedStyle(posterEl);
    var budget = window.innerHeight
      - parseFloat(cs.paddingTop || 0)
      - parseFloat(cs.paddingBottom || 0);

    /* two corrective passes are enough to converge */
    for (var pass = 0; pass < 2; pass++) {
      var used = gridEl.offsetHeight;
      if (used <= budget || used === 0) break;
      w = w * (budget / used);
      apply(w);
    }
  }

  fitTitle();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitTitle);
  }
  var fitTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(fitTimer);
    fitTimer = setTimeout(fitTitle, 140);
  });

  set("[data-herosub]", C.heroSub);
  set("[data-signoff]", C.signoff);
  set("[data-from]", C.from);
  document.title = "Happy birthday, " + (C.name || "you");

  /* ---------------- marquee: her name, looped twice so the slide is seamless ---------------- */
  var track = document.getElementById("marqueeTrack");
  var word = (C.name || "Happy birthday");
  for (var pass = 0; pass < 2; pass++) {
    for (var k = 0; k < 6; k++) {
      var s = document.createElement("span");
      s.textContent = word;
      track.appendChild(s);
    }
  }

  /* ---------------- photo strip ---------------- */
  var photos = (C.photos || []).filter(function (p) { return p && p.src; });
  if (photos.length) {
    var strip = document.getElementById("strip");
    var rail = document.getElementById("rail");
    strip.hidden = false;
    strip.classList.add("reveal");

    photos.forEach(function (photo, idx) {
      var fig = document.createElement("figure");
      fig.className = "strip__card";
      var img = document.createElement("img");
      img.loading = "lazy";
      img.decoding = "async";
      img.draggable = false;
      img.alt = photo.caption || "A photo";
      var fallback = "https://picsum.photos/seed/poster-birthday-" + (idx + 1) + "/800/1000";
      img.addEventListener("error", function () {
        if (img.src !== fallback) img.src = fallback;
      });
      img.src = photo.src;
      var cap = document.createElement("figcaption");
      cap.textContent = photo.caption || "";
      fig.appendChild(img);
      fig.appendChild(cap);
      rail.appendChild(fig);
    });

    /* drag to pan, so it works with a mouse as well as a thumb */
    var down = false, startX = 0, startLeft = 0, moved = 0;
    rail.addEventListener("pointerdown", function (e) {
      down = true; moved = 0;
      startX = e.clientX;
      startLeft = rail.scrollLeft;
      rail.classList.add("is-dragging");
      rail.setPointerCapture(e.pointerId);
    });
    rail.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      moved = Math.abs(dx);
      rail.scrollLeft = startLeft - dx;
    });
    function release(e) {
      if (!down) return;
      down = false;
      rail.classList.remove("is-dragging");
      try { rail.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    rail.addEventListener("pointerup", release);
    rail.addEventListener("pointercancel", release);
  }

  /* ---------------- message ---------------- */
  var note = document.getElementById("note");
  (C.message || []).forEach(function (para) {
    var p = document.createElement("p");
    p.className = "reveal";
    p.textContent = para;
    note.appendChild(p);
  });

  /* ---------------- reasons bento ----------------
     Rows always add up to exactly 6 columns, so the grid never
     ends with an empty cell no matter how many reasons you write. */
  var reasons = (C.reasons || []).filter(Boolean);
  if (reasons.length) {
    var section = document.getElementById("reasons");
    var grid = document.getElementById("reasonsGrid");
    section.hidden = false;

    var spans = [];
    var left = reasons.length;
    var pairs = [[4, 2], [2, 4], [3, 3]];
    var turn = 0;
    while (left > 0) {
      if (left === 1) { spans.push(6); left -= 1; }
      else if (left === 3) { spans.push(2, 2, 2); left -= 3; }
      else {
        var pair = pairs[turn % pairs.length];
        spans.push(pair[0], pair[1]);
        left -= 2;
        turn += 1;
      }
    }

    var spanClass = { 6: "reason--full", 4: "reason--wide", 3: "reason--half", 2: "" };
    reasons.forEach(function (text, i) {
      var d = document.createElement("div");
      d.className = "reason reveal " + (spanClass[spans[i]] || "");
      if (i % 4 === 1) d.classList.add("reason--blue");
      if (i % 4 === 3) d.classList.add("reason--fill");
      d.textContent = text;
      grid.appendChild(d);
    });
    document.querySelector(".reasons__head").classList.add("reveal");
  }

  /* ---- scroll reveal ----
     One mechanism, rAF throttled, and it unhooks itself the moment every
     element has been shown. An IntersectionObserver was tried first and was
     dropped: it silently failed to deliver after a programmatic scroll, which
     left parts of the message invisible. Nothing here is allowed to hide the
     words, so this checks positions directly. */
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

  var revealItems = document.querySelectorAll(".reveal");
  revealItems.forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 60 + "ms";
  });
  revealOnScroll(revealItems);
})();
