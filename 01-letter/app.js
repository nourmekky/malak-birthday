/* Letter. Vanilla, no build step. */
(function () {
  "use strict";

  var C = window.CONTENT || CONTENT;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Fallback photo so the page never shows a broken image before real ones are added. */
  var FALLBACK = "https://picsum.photos/seed/letter-birthday-01/900/1125";

  function set(sel, value) {
    document.querySelectorAll(sel).forEach(function (el) { el.textContent = value || ""; });
  }

  /* ---- fill in the text ---- */
  set("[data-name]", C.name);
  set("[data-dateline]", C.dateline);
  set("[data-opening]", C.opening);
  set("[data-signoff]", C.signoff);
  set("[data-from]", C.from);
  document.title = "For " + (C.name || "you");

  var bodyEl = document.getElementById("body");
  (C.body || []).forEach(function (para) {
    var p = document.createElement("p");
    p.textContent = para;
    p.classList.add("reveal");
    bodyEl.appendChild(p);
  });

  if (C.pullquote) {
    var pull = document.getElementById("pull");
    pull.hidden = false;
    pull.classList.add("reveal");
    pull.querySelector("[data-pullquote]").textContent = C.pullquote;
  }

  if (C.photo) {
    var fig = document.getElementById("photo");
    var img = document.getElementById("photoImg");
    fig.hidden = false;
    fig.classList.add("reveal");
    img.alt = C.photoCaption || "A photo of us";
    img.addEventListener("error", function () {
      if (img.src !== FALLBACK) img.src = FALLBACK;
    });
    img.src = C.photo;
    fig.querySelector("figcaption").textContent = C.photoCaption || "";
  }

  document.querySelector(".signoff").classList.add("reveal");
  document.querySelector(".dateline").classList.add("reveal");
  document.querySelector(".opening").classList.add("reveal");

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

  function watch() {
    revealOnScroll(document.querySelectorAll(".reveal"));
  }

  /* ---- envelope ---- */
  var gate = document.getElementById("gate");
  var envelope = document.getElementById("envelope");
  var letter = document.getElementById("letter");
  var opened = false;

  function open() {
    if (opened) return;
    opened = true;
    gate.classList.add("is-opening");
    var wait = reduce ? 0 : 620;
    setTimeout(function () {
      letter.hidden = false;
      gate.classList.add("is-open");
      watch();
      /* the top of the letter is above the fold, bring it in on a short stagger */
      [".dateline", ".opening"].forEach(function (sel, i) {
        var el = document.querySelector(sel);
        setTimeout(function () { el.classList.add("is-in"); }, reduce ? 0 : 90 + i * 130);
      });
      setTimeout(function () { gate.remove(); }, 800);
    }, wait);
  }

  envelope.addEventListener("click", open);
  document.addEventListener("keydown", function (e) {
    if (!opened && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(); }
  });
})();
