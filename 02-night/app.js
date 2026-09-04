/* Night. Vanilla, no build step. */
(function () {
  "use strict";

  var C = window.CONTENT || CONTENT;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FALLBACK = "https://picsum.photos/seed/night-birthday-02/900/1125";

  function set(sel, v) {
    document.querySelectorAll(sel).forEach(function (el) { el.textContent = v || ""; });
  }

  /* ---------------- text ---------------- */
  set("[data-headline]", C.headline);
  set("[data-subline]", C.subline);
  set("[data-wishprompt]", C.wishPrompt);
  set("[data-signoff]", C.signoff);
  set("[data-from]", C.from);
  document.getElementById("wishBtn").textContent = C.wishButton || "Make a wish";
  document.title = "Happy birthday, " + (C.name || "you");

  var linesEl = document.getElementById("lines");
  (C.lines || []).forEach(function (text) {
    var wrap = document.createElement("div");
    wrap.className = "line";
    var p = document.createElement("p");
    p.className = "reveal";
    p.textContent = text;
    wrap.appendChild(p);
    linesEl.appendChild(wrap);
  });

  if (C.photo) {
    var frame = document.getElementById("frame");
    var img = document.getElementById("photoImg");
    frame.hidden = false;
    img.alt = C.photoCaption || "A photo";
    img.addEventListener("error", function () {
      if (img.src !== FALLBACK) img.src = FALLBACK;
    });
    img.src = C.photo;
    set("[data-photocaption]", C.photoCaption);
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

  revealOnScroll(document.querySelectorAll(".reveal"));

  /* ---------------- starfield ---------------- */
  var canvas = document.getElementById("sky");
  var ctx = canvas.getContext("2d");
  var stars = [];
  var shooting = [];
  var w = 0, h = 0, dpr = 1, raf = null;

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var density = Math.min(190, Math.round((w * h) / 7000));
    stars = [];
    for (var i = 0; i < density; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.25 + 0.25,
        a: Math.random() * 0.6 + 0.2,
        sp: Math.random() * 0.012 + 0.003,
        ph: Math.random() * Math.PI * 2,
        warm: Math.random() > 0.86
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var tw = reduce ? s.a : s.a + Math.sin(t * s.sp + s.ph) * 0.28;
      if (tw < 0.04) tw = 0.04;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.warm
        ? "rgba(255,196,132," + tw + ")"
        : "rgba(226,228,255," + tw + ")";
      ctx.fill();
    }

    for (var j = shooting.length - 1; j >= 0; j--) {
      var m = shooting[j];
      m.x += m.vx;
      m.y += m.vy;
      m.life -= 1;
      var g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 14, m.y - m.vy * 14);
      var alpha = Math.max(0, Math.min(1, m.life / 60));
      g.addColorStop(0, "rgba(255,205,150," + alpha + ")");
      g.addColorStop(1, "rgba(255,205,150,0)");
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.8;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * 14, m.y - m.vy * 14);
      ctx.stroke();
      if (m.life <= 0 || m.x > w + 80 || m.y > h + 80) shooting.splice(j, 1);
    }
  }

  function loop(t) {
    draw(t);
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (raf === null) raf = requestAnimationFrame(loop);
  }
  function stop() {
    if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
  }

  build();
  if (reduce) {
    draw(0);
  } else {
    start();
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });
  }

  var rt = null;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () { build(); if (reduce) draw(0); }, 180);
  });

  /* ---------------- the wish ---------------- */
  var btn = document.getElementById("wishBtn");
  var reply = document.getElementById("wishReply");

  btn.addEventListener("click", function () {
    btn.disabled = true;
    btn.textContent = "Wished";

    if (!reduce) {
      var startX = w * (0.1 + Math.random() * 0.4);
      shooting.push({
        x: startX,
        y: -20,
        vx: 5.4 + Math.random() * 2.4,
        vy: 3.2 + Math.random() * 1.6,
        life: 150
      });
    }

    setTimeout(function () {
      reply.textContent = C.wishReply || "";
      reply.classList.add("is-in");
    }, reduce ? 0 : 700);
  });
})();
