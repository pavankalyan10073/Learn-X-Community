(function () {
  "use strict";

  /* SCROLL REVEAL (safe: content is visible by default; only fades in when JS runs) */
  var rvEls = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("vis");
          revObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });
    rvEls.forEach(function (el) { revObs.observe(el); });
  } else {
    rvEls.forEach(function (el) { el.classList.add("vis"); });
  }

  /* ENHANCED COUNTERS */
  var counters = document.querySelectorAll("[data-count]");
  function runCounter(el) {
    var target = +el.getAttribute("data-count");
    var dur = 1500, start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      var val = Math.round(e * target);
      el.textContent = val + (target > 100 || target === 5 ? "+" : "");
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + (target > 100 || target === 5 ? "+" : "");
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCounter(en.target); cObs.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cObs.observe(c); });
  }
})();
