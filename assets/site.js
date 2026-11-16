(function () {
  // One live region per copy button, so the result is announced and, on failure, shown.
  document.querySelectorAll("button[data-copy]").forEach(function (b) {
    var msg = document.createElement("p");
    msg.className = "copy-msg sr-only";
    msg.setAttribute("role", "status");
    var cmd = b.closest(".cmd");
    var row = cmd.closest(".cta__row");
    (row || cmd).insertAdjacentElement("afterend", msg);
    b._msg = msg;
  });

  function selectCommand(b) {
    var code = b.closest(".cmd").querySelector("code");
    var sel = window.getSelection && window.getSelection();
    if (!code || !sel) return;
    var range = document.createRange();
    range.selectNodeContents(code);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function done(b, ok) {
    clearTimeout(b._t);
    b.classList.toggle("is-done", ok);
    b.classList.toggle("is-failed", !ok);
    b.textContent = ok ? "Copied" : "Not copied";
    b._msg.classList.toggle("sr-only", ok);
    b._msg.textContent = ok ? "Command copied to the clipboard." : "Copy unavailable; select the command and copy it manually.";
    if (!ok) selectCommand(b);
    b._t = setTimeout(function () {
      b.textContent = "Copy";
      b.classList.remove("is-done", "is-failed");
      if (ok) b._msg.textContent = "";
    }, ok ? 1600 : 4000);
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-copy]");
    if (!b) return;
    var text = b.getAttribute("data-copy");
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error("no clipboard");
      navigator.clipboard.writeText(text).then(function () { done(b, true); }, function () { done(b, false); });
    } catch (err) {
      done(b, false);
    }
  });
})();
