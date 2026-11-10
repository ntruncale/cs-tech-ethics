/* CS Tech Ethics: unlock codes.
   Each locked module's content is encrypted at build time (AES-GCM, key from the unlock code with PBKDF2),
   so the lessons, activities and completion code can't be read until a student enters the code the teacher gives out.
   A code that works is remembered on this iPad, so students enter it once.

   Module page:  CourseLock.open({ num, title, subtitle, unit, unitTitle, lock: { salt, iter, iv, ct } })
   Index page:   CourseLock.find(code, [{ num, lock: { salt, iter, check } }]) resolves to the module number it unlocks, or 0. */
(function (root) {
  "use strict";
  var PREFIX = (root.Course && root.Course.settings && root.Course.settings.key || "techethics9") + ":unlock:m";

  function norm(code) { return String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, ""); }
  function bytes(b64) { var s = atob(b64), a = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a; }
  function supported() { return !!(root.crypto && root.crypto.subtle && root.TextEncoder); }

  var keys = {};
  function keyFor(code, lock) {
    var id = norm(code) + "|" + lock.salt;
    if (!keys[id]) keys[id] = crypto.subtle.importKey("raw", new TextEncoder().encode(norm(code)), "PBKDF2", false, ["deriveKey"])
      .then(function (base) {
        return crypto.subtle.deriveKey({ name: "PBKDF2", salt: bytes(lock.salt), iterations: lock.iter, hash: "SHA-256" },
          base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
      });
    return keys[id];
  }
  function decrypt(code, lock, box) {
    return keyFor(code, lock).then(function (k) { return crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes(box.iv) }, k, bytes(box.ct)); })
      .then(function (buf) { return new TextDecoder().decode(buf); });
  }

  function saved(num) { try { return localStorage.getItem(PREFIX + num) || ""; } catch (e) { return ""; } }
  function remember(num, code) { try { localStorage.setItem(PREFIX + num, norm(code)); } catch (e) {} }
  function forget(num) { try { localStorage.removeItem(PREFIX + num); } catch (e) {} }

  // Index page: which locked module does this code open? Resolves to its number, or 0.
  function find(code, list) {
    if (!supported() || !norm(code)) return Promise.resolve(0);
    var i = 0;
    function next() {
      if (i >= list.length) return Promise.resolve(0);
      var m = list[i++];
      return decrypt(code, m.lock, m.lock.check).then(function (txt) {
        if (txt === "unlock:m" + m.num) { remember(m.num, code); return m.num; }
        return next();
      }, next);
    }
    return next();
  }
  function isUnlocked(num) { return !!saved(num); }

  /* ---------- module page ---------- */
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }
  function launch(data) { document.getElementById("app").innerHTML = ""; root.Course.start(data); }

  function gate(info) {
    var app = document.getElementById("app");
    app.innerHTML = "";
    document.title = "M" + info.num + " · " + info.title + " · " + ((root.Course && root.Course.settings.course) || "");
    var bar = el("div", { "class": "bar" }), inner = el("div", { "class": "bar-inner" });
    inner.appendChild(el("img", { "class": "bar-seal", src: "assets/seal.png", alt: "Scranton Prep seal" }));
    inner.appendChild(el("a", { "class": "bar-title", href: "index.html", title: "All modules" }, "M" + info.num));
    bar.appendChild(inner); app.appendChild(bar);
    var main = el("main", { "class": "wrap" }); app.appendChild(main);
    var head = el("header", { "class": "intro" });
    head.appendChild(el("div", { "class": "tilestrip", "aria-hidden": "true" }));
    head.appendChild(el("span", { "class": "eyebrow" }, "Unit " + info.unit + ": " + info.unitTitle + " · Module " + info.num + " of " + info.total));
    head.appendChild(el("h1", null, info.title));
    if (info.subtitle) head.appendChild(el("p", { "class": "subtitle" }, info.subtitle));
    main.appendChild(head);

    var box = el("form", { "class": "lockbox", id: "lockbox", autocomplete: "off" });
    box.appendChild(el("h2", null, "🔒 This module is locked"));
    box.appendChild(el("p", null, "Your teacher will give you an unlock code when it's time to start this module. Enter it here. You only need to enter it once on this iPad."));
    var row = el("div", { "class": "lockrow" });
    var input = el("input", { type: "text", id: "unlock-code", "class": "es-in", "aria-label": "Unlock code", placeholder: "Unlock code", autocapitalize: "characters", autocorrect: "off", spellcheck: "false" });
    var btn = el("button", { type: "submit", "class": "primary" }, "Unlock");
    row.appendChild(input); row.appendChild(btn); box.appendChild(row);
    var msg = el("div", { "class": "feedback", id: "unlock-msg", role: "status", "aria-live": "polite" }); msg.hidden = true; box.appendChild(msg);
    box.appendChild(el("p", { "class": "lockback" })).appendChild(el("a", { href: "index.html" }, "← All modules"));
    main.appendChild(box);
    if (!supported()) { input.disabled = btn.disabled = true; show(msg, false, "This browser can't open locked modules. Please update Safari or ask your teacher."); return; }

    box.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var code = input.value;
      if (!norm(code)) { input.focus(); return; }
      btn.disabled = true; show(msg, null, "Checking…");
      decrypt(code, info.lock, info.lock).then(function (txt) {
        remember(info.num, code);
        launch(JSON.parse(txt));
      }, function () {
        btn.disabled = false;
        input.classList.add("bad");
        show(msg, false, "That code doesn't unlock this module. Check the code with your teacher and try again.");
      });
    });
    input.addEventListener("input", function () { input.classList.remove("bad"); msg.hidden = true; });
  }
  function show(msg, ok, text) { msg.hidden = false; msg.className = "feedback" + (ok === false ? " bad" : ok ? " ok" : ""); msg.textContent = text; }

  function open(info) {
    var code = saved(info.num);
    if (!code || !supported()) return gate(info);
    decrypt(code, info.lock, info.lock).then(function (txt) { launch(JSON.parse(txt)); }, function () { forget(info.num); gate(info); });
  }

  root.CourseLock = { open: open, find: find, isUnlocked: isUnlocked, norm: norm };
})(this);
