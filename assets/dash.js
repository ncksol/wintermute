(function () {
  // The sample dashboard in #dashboard: its clocks tick, and card footers fold to fit as the plugin's do (ui/footer.mjs).
  var root = document.querySelector(".wd");
  if (!root) return;

  function pad(n) { return String(n).padStart(2, "0"); }
  // The plugin's dur() in ui/format.mjs.
  function dur(total, format) {
    var d = Math.floor(total / 86400), h = Math.floor((total % 86400) / 3600), m = Math.floor((total % 3600) / 60), s = total % 60;
    if (format === "clock") return d ? d + "d " + pad(h) + "h " + pad(m) + "m " + pad(s) + "s" : h ? h + "h " + pad(m) + "m " + pad(s) + "s" : m + "m " + pad(s) + "s";
    if (format === "age") return total < 45 ? "just now" : d ? d + "d " + h + "h ago" : h ? h + "h ago" : Math.max(1, m) + "m ago";
    return d ? d + "d " + h + "h" : h ? h + "h " + pad(m) + "m" : m ? m + "m" : s + "s";
  }

  var unit = 1 / 64;
  function textCut(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var st = getComputedStyle(el);
    var inset = parseFloat(st.paddingLeft) + parseFloat(st.paddingRight) + parseFloat(st.borderLeftWidth) + parseFloat(st.borderRightWidth);
    return range.getBoundingClientRect().width > el.getBoundingClientRect().width - inset + unit;
  }
  function spills(left) {
    var right = left.getBoundingClientRect().right;
    for (var i = 0; i < left.children.length; i++) {
      var c = left.children[i];
      if (!c.hidden && c.getBoundingClientRect().right > right + unit) return true;
    }
    var chips = left.querySelectorAll(".chip:not([hidden]) > .chip-t");
    for (var j = 0; j < chips.length; j++) if (textCut(chips[j])) return true;
    return false;
  }
  // The fold order of foldFooter() in ui/model.mjs: progress, then sub-agent chips, then the Needs you label, then the count.
  function fit(foot) {
    var left = foot.querySelector(".b-left"), model = foot.querySelector(".b-model");
    var chips = Array.prototype.slice.call(left.querySelectorAll("[data-chip]"));
    var more = left.querySelector(".b-more"), count = left.querySelector(".b-count"), prog = left.querySelector(".b-prog");
    var need = foot.querySelector(".b-need");
    chips.forEach(function (c) { c.hidden = false; });
    if (more) more.hidden = true;
    if (count) count.hidden = true;
    if (prog) prog.hidden = false;
    if (need) { need.children[0].hidden = false; need.children[1].hidden = true; }
    function over() { return spills(left) || (model && textCut(model)); }
    if (!over()) return;
    if (prog) prog.hidden = true;
    var counted = false;
    if (chips.length && over()) {
      for (var shown = chips.length - 1; shown >= 1 && over(); shown--) {
        chips.forEach(function (c, i) { c.hidden = i >= shown; });
        more.textContent = "+" + (chips.length - shown);
        more.hidden = false;
      }
      if (over()) {
        chips.forEach(function (c) { c.hidden = true; });
        more.hidden = true;
        count.hidden = false;
        counted = true;
      }
    }
    if (need && over()) { need.children[0].hidden = true; need.children[1].hidden = false; }
    if (counted && over()) count.hidden = true;
  }
  var feet = root.querySelectorAll(".b-foot");
  function fitAll() { for (var i = 0; i < feet.length; i++) fit(feet[i]); }
  fitAll();
  if (window.ResizeObserver) new ResizeObserver(fitAll).observe(root);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);

  // Sample times tick from the moment the page loads, except under reduced motion.
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  var times = root.querySelectorAll("[data-s]");
  var start = Date.now();
  function tick() {
    if (document.hidden || (still && still.matches)) return;
    var gone = Math.floor((Date.now() - start) / 1000), changed = false;
    for (var i = 0; i < times.length; i++) {
      var el = times[i], text = dur(Number(el.getAttribute("data-s")) + gone, el.getAttribute("data-f"));
      if (el.textContent !== text) { el.textContent = text; changed = changed || Boolean(el.closest(".b-foot")); }
    }
    if (changed) fitAll();
  }
  setInterval(tick, 1000);
})();
