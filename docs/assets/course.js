/* CS Tech Ethics: shared behavior for every module.
   (The same engine as Health 9, built from the Español 9 engine; the Spanish-only parts, audio and accent keys, are turned off in SETTINGS.)
   Each module page loads this file, then modules/mNN.js, which calls Course.start({...module data...}).
   The whole page (header, seven steps, every task) is drawn from that data, so a fix here updates all 30 modules.

   The first part (Text) has no browser code. scripts/build.js loads it in Node to find every Spanish phrase
   that needs an audio clip, so the page and the build always agree on what gets spoken. */
(function (root) {
  "use strict";

  /* Course-wide settings. vosotros: include the vosotros form in conjugation tables and practice. */
  var SETTINGS = { vosotros: true, audio: false, accents: false, lang: "en", course: "CS Tech Ethics", key: "techethics9",
    help: "<b>Something online worrying you?</b> If someone is pressuring or threatening you, or sharing private images of you, <b>stop responding, save the evidence and tell a trusted adult</b>: a parent, teacher or the school counselor. It's not your fault. <b>Take It Down</b> (takeitdown.ncmec.org) can help remove images of minors. If you or a friend are in crisis, call or text <b>988</b>. In an emergency, call <b>911</b>." };

  /* ======================= Text: pure helpers (shared with the build) ======================= */
  var Text = (function () {
    function esc(s) {
      return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    // Text exactly as spoken: no markup, single spaces.
    function plain(s) {
      return String(s).replace(/<[^>]+>/g, "").replace(/\*\*/g, "").replace(/(^|[^\w*])\*([^*\n]+?)\*(?!\w)/g, "$1$2")
        .replace(/\(\((.*?)\)\)/g, "").replace(/\s*·\s*/g, ", ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
    }
    function clean(s) { return String(s).normalize("NFC").replace(/\s+/g, " ").trim(); }
    // What the voice reads: the plain text without notes in parentheses, like "despertarse (ie)".
    function spoken(s) { return clean(plain(s).replace(/\s*\([^)]*\)/g, "")); }
    var spokenText = spoken;
    // FNV-1a hash of the spoken text names its audio file (audio/es/xxxxxxxx.mp3).
    function hash(s) {
      s = clean(s);
      var h = 0x811c9dc5;
      for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
      return ("0000000" + h.toString(16)).slice(-8);
    }
    function sayBtn(text) {
      var spoken = spokenText(text);
      return '<button type="button" class="say" data-t="' + esc(spoken) + '" aria-label="Listen: ' + esc(spoken) + '">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg></button>';
    }
    // Inline markup: **bold**, *italic*, {{Spanish you can hear}} or {{shown|spoken}}, ((clue)).
    function inline(s) {
      s = String(s == null ? "" : s);
      s = s.replace(/\{\{(.+?)\}\}/g, function (_, inner) {
        var bar = inner.indexOf("|");
        var shown = bar === -1 ? inner : inner.slice(0, bar);
        var spoken = bar === -1 ? inner : inner.slice(bar + 1);
        if (!SETTINGS.audio) return "<b>" + emph(shown) + "</b>";
        return '<span class="es" lang="es">' + emph(shown) + "</span>" + sayBtn(spoken);
      });
      return emph(s);
    }
    function emph(s) {
      return s.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|[^\w*])\*([^*\n]+?)\*(?!\w)/g, "$1<i>$2</i>")
        .replace(/\(\((.*?)\)\)/g, '<span class="clue">($1)</span>');
    }
    // Block markup: blank lines make paragraphs; lines starting with "- " make a list.
    function rich(s) {
      return String(s == null ? "" : s).split(/\n\s*\n/).map(function (chunk) {
        chunk = chunk.trim();
        if (!chunk) return "";
        if (/^<(table|div|ul|ol|p|h\d)/i.test(chunk)) return inline(chunk);
        var lines = chunk.split("\n");
        if (lines.every(function (l) { return /^\s*> ?/.test(l); }))
          return "<blockquote>" + inline(lines.map(function (l) { return l.replace(/^\s*> ?/, ""); }).join(" ")) + "</blockquote>";
        if (lines.every(function (l) { return /^\s*- /.test(l); }))
          return "<ul>" + lines.map(function (l) { return "<li>" + inline(l.replace(/^\s*- /, "")) + "</li>"; }).join("") + "</ul>";
        return "<p>" + inline(lines.join(" ")) + "</p>";
      }).join("");
    }
    function speakables(s) {
      var out = [], re = /\{\{(.+?)\}\}/g, m;
      while ((m = re.exec(String(s)))) { var bar = m[1].indexOf("|"); out.push(plain(bar === -1 ? m[1] : m[1].slice(bar + 1))); }
      return out;
    }

    /* ---------- answer checking ---------- */
    function norm(s) {
      return String(s).normalize("NFC").replace(/[’‘`´]/g, "'").toLowerCase()
        .replace(/[.,;:!?¡¿"“”«»()…–—]/g, " ").replace(/\s+/g, " ").trim();
    }
    function strip(s) { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC"); }
    // "[yo] soy {alto|alta}" -> ["yo soy alto", "yo soy alta", "soy alto", "soy alta"]
    function expand(pattern) {
      var p = String(pattern).replace(/\[([^\]]*)\]/g, "{$1|}");
      var m = /\{([^{}]*)\}/.exec(p);
      if (!m) return [p.replace(/\s+/g, " ").trim()];
      var out = [];
      m[1].split("|").forEach(function (opt) {
        expand(p.slice(0, m.index) + opt + p.slice(m.index + m[0].length)).forEach(function (x) { if (out.indexOf(x) === -1) out.push(x); });
      });
      return out;
    }
    function accepted(list) {
      var out = [];
      (Array.isArray(list) ? list : [list]).forEach(function (p) { expand(p).forEach(function (x) { out.push(x); }); });
      return out;
    }
    // "ok", "near" (right except accent marks or ñ), "blank" or "bad"
    function judge(value, answers) {
      var v = norm(value);
      if (!v) return "blank";
      var list = accepted(answers).map(norm);
      if (list.indexOf(v) !== -1) return "ok";
      var sv = strip(v);
      if (list.some(function (a) { return strip(a) === sv; })) return "near";
      return "bad";
    }
    // Words of a sentence for tiles: "¿Dónde está la biblioteca?" -> { lead: "¿", words: [...], trail: "?" }
    function tokens(sentence) {
      var s = String(sentence).trim();
      var lead = (/^[¿¡]+/.exec(s) || [""])[0];
      var trail = (/[.?!…]+$/.exec(s) || [""])[0];
      s = s.slice(lead.length, s.length - trail.length).trim();
      return { lead: lead, trail: trail, words: s.split(/\s+/).map(function (w) { return w.replace(/_/g, " "); }) };
    }

    /* ---------- cloze and choice sentences ---------- */
    // "Yo [hablo|Hablo] ((hablar)) inglés." -> parts [{text}, {answers}, {text}]
    function clozeParts(s) {
      var parts = [], re = /\[([^\]]+)\]/g, last = 0, m;
      while ((m = re.exec(s))) {
        if (m.index > last) parts.push({ text: s.slice(last, m.index) });
        parts.push({ answers: m[1].split("|") });
        last = m.index + m[0].length;
      }
      if (last < s.length) parts.push({ text: s.slice(last) });
      return parts;
    }
    // A leading speaker label ("Daniel: …") isn't read aloud.
    function unlabel(s) { return s.replace(/^[A-ZÁÉÍÓÚÑ][\p{L}]*:\s+/u, ""); }
    function clozeSpoken(s) { return unlabel(plain(String(s).replace(/\[([^\]|]+)[^\]]*\]/g, "$1"))); }
    // "Mi hermana {es|está} alta." -> the first option is right
    function pickParts(s) {
      var parts = [], re = /\{([^}]+)\}/g, last = 0, m;
      while ((m = re.exec(s))) {
        if (m.index > last) parts.push({ text: s.slice(last, m.index) });
        parts.push({ options: m[1].split("|") });
        last = m.index + m[0].length;
      }
      if (last < s.length) parts.push({ text: s.slice(last) });
      return parts;
    }
    function pickSpoken(s) { return unlabel(plain(String(s).replace(/\{([^}|]+)[^}]*\}/g, "$1"))); }
    // "¿tú tocas la guitarra?" -> "¿Tú tocas la guitarra?"; adds a period when there's no end mark.
    function pretty(s) {
      s = String(s).trim().replace(/^([¿¡"]*)(\p{L})/u, function (_, a, b) { return a + b.toUpperCase(); });
      return /[.?!…]$/.test(s) ? s : s + ".";
    }
    function translateModel(it) { return it.say || pretty(expand(Array.isArray(it.es) ? it.es[0] : it.es)[0]); }
    function itemText(it) { return typeof it === "string" ? it : (it.s || it.es || it.w || ""); }

    /* ---------- conjugation ---------- */
    var PERSONS = [
      { label: "yo", say: "yo" }, { label: "tú", say: "tú" }, { label: "él / ella / usted", say: "él" },
      { label: "nosotros / nosotras", say: "nosotros" }, { label: "vosotros / vosotras", say: "vosotros", vos: true },
      { label: "ellos / ellas / ustedes", say: "ellos" }
    ];
    function persons() { return PERSONS.map(function (p, i) { return { i: i, label: p.label, say: p.say, vos: !!p.vos }; }).filter(function (p) { return SETTINGS.vosotros || !p.vos; }); }
    function conjSpoken(v, i) {
      var f = plain(v.forms[i]);
      if (v.noPronoun) return f;
      return (v.say ? v.say[i] : PERSONS[i].say) + " " + f;
    }

    /* ---------- every phrase in a module that has a play button ---------- */
    function speech(mod) {
      var out = [];
      function add(t) { t = spoken(t); if (t && out.indexOf(t) === -1) out.push(t); }
      (function scan(x) {
        if (typeof x === "string") speakables(x).forEach(add);
        else if (Array.isArray(x)) x.forEach(scan);
        else if (x && typeof x === "object") Object.keys(x).forEach(function (k) { scan(x[k]); });
      })(mod);
      (mod.learn || []).forEach(function (idea) {
        (idea.examples || []).forEach(function (ex) { add(ex[0]); });
        (idea.flash || []).forEach(function (c) { add(c[0]); });
        (idea.conj || []).forEach(function (v) { persons().forEach(function (p) { add(conjSpoken(v, p.i)); }); });
      });
      var tasks = (mod.tasks || []).concat(mod.further ? [mod.further] : []);
      tasks.forEach(function (t) { taskSpeech(t).forEach(add); });
      return out;
    }
    function taskSpeech(t) {
      var out = [];
      var items = t.items || [];
      switch (t.type) {
        case "cloze": if (t.speak !== false) items.forEach(function (it) { out.push(it.say || clozeSpoken(itemText(it))); }); break;
        case "select": if (t.speak !== false) items.forEach(function (it) { out.push(it.say || pickSpoken(itemText(it))); }); break;
        case "order": items.forEach(function (it) { out.push(it.es.replace(/_/g, " ")); }); break;
        case "dictation": case "speak": items.forEach(function (it) { out.push(itemText(it)); }); break;
        case "accent": items.forEach(function (it) { out.push(itemText(it)); }); break;
        case "translate": items.forEach(function (it) { out.push(translateModel(it)); }); break;
        case "errors": items.forEach(function (it) { out.push(fixedSentence(it)); }); break;
        case "match": if (t.speak !== false) (t.pairs || []).forEach(function (p) { out.push(p[0]); }); break;
        case "sort": if (t.speak) items.forEach(function (it) { out.push(it[0]); }); break;
        case "mc": if (t.say) out.push(t.say); break;
        case "quiz": case "listen": (t.questions || []).forEach(function (q) { if (q.say) out.push(q.say); }); break;
      }
      return out.map(plain);
    }
    // Find-the-error sentence with the mistake fixed: "Ella son simpática." -> "Ella es simpática."
    function fixedSentence(it) {
      var w = errorWords(it.s);
      var fix = Array.isArray(it.fix) ? it.fix[0] : it.fix;
      return w.map(function (x, i) { return i === errorIndex(it, w) ? x.pre + fix + x.post : x.raw; }).join(" ");
    }
    function errorWords(s) {
      return String(s).trim().split(/\s+/).map(function (raw) {
        var m = /^([¿¡"(]*)(.*?)([.,;:?!")…]*)$/.exec(raw);
        return { raw: raw, pre: m[1], word: m[2], post: m[3] };
      });
    }
    function errorIndex(it, words) {
      if (typeof it.at === "number") return it.at;
      for (var i = 0; i < words.length; i++) if (words[i].word === it.bad) return i;
      return -1;
    }

    return {
      esc: esc, plain: plain, clean: clean, spoken: spoken, hash: hash, inline: inline, emph: emph, rich: rich, sayBtn: sayBtn, speakables: speakables,
      norm: norm, strip: strip, expand: expand, accepted: accepted, judge: judge, tokens: tokens,
      pretty: pretty, translateModel: translateModel, clozeParts: clozeParts, clozeSpoken: clozeSpoken, pickParts: pickParts, pickSpoken: pickSpoken, itemText: itemText,
      persons: persons, conjSpoken: conjSpoken, speech: speech, taskSpeech: taskSpeech,
      errorWords: errorWords, errorIndex: errorIndex, fixedSentence: fixedSentence, SETTINGS: SETTINGS
    };
  })();

  if (typeof module === "object" && module.exports) { module.exports = Text; return; }

  /* ======================= Course: the page ======================= */
  root.Course = (function () {
    var M = null, KEY = "";
    var state = { done: {}, hints: {}, extra: {}, reflect: "", build: "" };
    var PREFS_KEY = SETTINGS.key + ":prefs";
    var prefs = { voice: "es", slow: false };
    var esc = Text.esc, rich = Text.rich, inline = Text.inline;

    /* ---------- helpers ---------- */
    function el(tag, attrs, text) {
      var e = document.createElement(tag);
      if (attrs) Object.keys(attrs).forEach(function (k) { if (attrs[k] != null) e.setAttribute(k, attrs[k]); });
      if (text != null) e.textContent = text;
      return e;
    }
    function html(tag, attrs, markup) { var e = el(tag, attrs); e.innerHTML = markup; return e; }
    function $(id) { return document.getElementById(id); }
    function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
    function bag(id, empty) { return state.extra[id] || (state.extra[id] = empty || {}); }

    function feedback(box, ok, msg, list) {
      box.innerHTML = "";
      if (!msg) return;
      var fb = el("div", { "class": "feedback " + (ok ? "ok" : "bad"), role: "status" });
      fb.appendChild(html("span", null, (ok ? "✓ " : "") + inline(msg)));
      if (list && list.length) {
        var ul = el("ul");
        list.forEach(function (t) { ul.appendChild(html("li", null, inline(t))); });
        fb.appendChild(ul);
      }
      box.appendChild(fb);
    }
    function markDone(id) {
      if (!state.done[id]) { state.done[id] = true; save(); }
      refresh();
    }

    /* ---------- per-student variation ---------- */
    var R = {
      int: function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); },
      pick: function (list) { return list[Math.floor(Math.random() * list.length)]; },
      shuffle: function (list) {
        var a = list.slice();
        for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
        return a;
      },
      sample: function (list, n) { return R.shuffle(list).slice(0, n); }
    };
    function vary(key, make) {
      var v = state.extra.vary || (state.extra.vary = {});
      if (v[key] === undefined) { v[key] = make(R); save(); }
      return v[key];
    }
    function range(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }
    // A shuffled order of n things, the same on reload; never the original order when n > 1.
    function shuffled(key, n) {
      var order = vary(key, function (r) {
        var o; var tries = 0;
        do { o = r.shuffle(range(n)); tries++; } while (n > 1 && tries < 6 && o.every(function (v, i) { return v === i; }));
        return o;
      });
      return order.length === n ? order : range(n);
    }
    // Tasks with pick: n show each student n items from the full list.
    function chosen(t, list) {
      list = list || t.items || [];
      if (!t.pick || t.pick >= list.length) return list.map(function (it, i) { return { it: it, i: i }; });
      var idx = vary("pick:" + t.id, function (r) { return r.sample(range(list.length), t.pick).sort(function (a, b) { return a - b; }); });
      return idx.filter(function (i) { return i < list.length; }).map(function (i) { return { it: list[i], i: i }; });
    }

    /* ---------- hint ladders ---------- */
    function hints(id, list, button, box) {
      if (!list || !list.length) { button.hidden = true; return; }
      function render() {
        box.innerHTML = "";
        var shown = Math.min(state.hints[id] || 0, list.length);
        for (var i = 0; i < shown; i++) box.appendChild(html("div", { "class": "hint" }, "<b>Hint " + (i + 1) + ":</b> " + inline(list[i])));
        if (shown >= list.length) button.textContent = "No more hints";
      }
      render();
      button.addEventListener("click", function () {
        var shown = state.hints[id] || 0;
        if (shown < list.length) { state.hints[id] = shown + 1; save(); }
        render();
      });
    }

    /* ======================= audio ======================= */
    var player = null, playingBtn = null;
    function loadPrefs() { try { var p = JSON.parse(localStorage.getItem(PREFS_KEY) || "null"); if (p) prefs = Object.assign(prefs, p); } catch (e) {} }
    function savePrefs() { try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch (e) {} }
    function stop() {
      if (player) { try { player.pause(); } catch (e) {} player = null; }
      if (window.speechSynthesis) { try { speechSynthesis.cancel(); } catch (e) {} }
      if (playingBtn) { playingBtn.classList.remove("playing"); playingBtn = null; }
    }
    // Device voice, used only if a clip file is missing.
    function speakWithDevice(text, btn) {
      if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) { if (btn) btn.classList.remove("playing"); return; }
      var u = new SpeechSynthesisUtterance(text);
      var want = prefs.voice === "la" ? ["es-MX", "es-US", "es-419", "es"] : ["es-ES", "es"];
      var voices = speechSynthesis.getVoices() || [];
      for (var i = 0; i < want.length && !u.voice; i++) {
        for (var j = 0; j < voices.length; j++) if (voices[j].lang.replace("_", "-").indexOf(want[i]) === 0) { u.voice = voices[j]; break; }
      }
      u.lang = u.voice ? u.voice.lang : want[0];
      u.rate = prefs.slow ? 0.7 : 0.95;
      u.onend = u.onerror = function () { if (btn) btn.classList.remove("playing"); };
      speechSynthesis.speak(u);
    }
    function play(text, btn, opts) {
      opts = opts || {};
      var same = btn && btn === playingBtn;
      stop();
      if (same) return;
      text = Text.clean(text);
      if (btn) { btn.classList.add("playing"); playingBtn = btn; }
      var a = new Audio("audio/" + (prefs.voice === "la" ? "la" : "es") + "/" + Text.hash(text) + ".mp3");
      var slow = opts.slow != null ? opts.slow : prefs.slow;
      a.playbackRate = slow ? 0.72 : 1;
      a.preservesPitch = true; a.webkitPreservesPitch = true;
      player = a;
      var done = function () { if (btn) btn.classList.remove("playing"); if (playingBtn === btn) playingBtn = null; };
      a.addEventListener("ended", done);
      a.addEventListener("error", function () { if (player === a) { player = null; speakWithDevice(text, btn); } });
      var p = a.play();
      if (p && p.catch) p.catch(function (err) { if (err && err.name === "NotAllowedError") done(); });
    }
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest(".say");
      if (!b) return;
      e.preventDefault();
      play(b.getAttribute("data-t"), b, { slow: b.hasAttribute("data-slow") ? true : null });
    });
    function sayButton(text, big, slow) {
      if (!SETTINGS.audio) { var none = el("span"); none.hidden = true; return none; }
      var b = html("span", null, Text.sayBtn(text)).firstChild;
      if (big) b.classList.add("big");
      if (slow) { b.setAttribute("data-slow", ""); b.setAttribute("aria-label", "Listen slowly: " + Text.plain(text)); b.innerHTML = '<span aria-hidden="true">🐢</span>'; }
      return b;
    }

    /* ======================= accent keys ======================= */
    // Tapping a key types into the last Spanish box you used, without closing the iPad keyboard.
    function accentBar(scope) {
      var bar = el("div", { "class": "accents", role: "group", "aria-label": "Accent marks" });
      bar.appendChild(el("span", { "class": "lbl" }, "Tap to type:"));
      var upper = false, last = null;
      var keys = ["á", "é", "í", "ó", "ú", "ü", "ñ", "¿", "¡"];
      var btns = keys.map(function (k) {
        var b = el("button", { type: "button", "aria-label": "Type " + k }, k);
        b.addEventListener("pointerdown", function (e) { e.preventDefault(); });
        b.addEventListener("mousedown", function (e) { e.preventDefault(); });
        b.addEventListener("click", function () {
          var input = last && scope.contains(last) && !last.disabled ? last : scope.querySelector(".es-in:not([disabled])");
          if (!input) return;
          var ch = upper ? k.toUpperCase() : k;
          var s = input.selectionStart != null ? input.selectionStart : input.value.length;
          var e2 = input.selectionEnd != null ? input.selectionEnd : s;
          input.value = input.value.slice(0, s) + ch + input.value.slice(e2);
          input.focus();
          try { input.setSelectionRange(s + ch.length, s + ch.length); } catch (err) {}
          input.dispatchEvent(new Event("input", { bubbles: true }));
          if (upper) setUpper(false);
        });
        bar.appendChild(b);
        return b;
      });
      var shift = el("button", { type: "button", "class": "shift", "aria-pressed": "false", "aria-label": "Capital letter" }, "⇧");
      shift.addEventListener("pointerdown", function (e) { e.preventDefault(); });
      shift.addEventListener("mousedown", function (e) { e.preventDefault(); });
      function setUpper(on) {
        upper = on; shift.setAttribute("aria-pressed", on ? "true" : "false");
        btns.forEach(function (b, i) { b.textContent = on ? keys[i].toUpperCase() : keys[i]; });
      }
      shift.addEventListener("click", function () { setUpper(!upper); });
      bar.appendChild(shift);
      scope.addEventListener("focusin", function (e) { if (e.target.classList && e.target.classList.contains("es-in")) last = e.target; });
      return bar;
    }
    function esInput(attrs) {
      var a = Object.assign({ "class": "es-in", lang: SETTINGS.lang, autocomplete: "off", autocapitalize: "off", autocorrect: "off", spellcheck: "false", type: "text" }, attrs || {});
      return el("input", a);
    }
    function setMark(input, result) {
      input.classList.remove("ok", "bad", "near");
      if (result === "ok") input.classList.add("ok");
      else if (result === "near") input.classList.add("near");
      else if (result === "bad") input.classList.add("bad");
    }

    /* ======================= task shell ======================= */
    var TYPE_NAMES = {
      mc: "Choose", quiz: "Choose", listen: "Listen", read: "Read", cloze: "Fill in", select: "Choose the word",
      conj: "Conjugate", match: "Match", sort: "Sort", order: "Build the sentence", dictation: "Listen and write",
      translate: "Translate", errors: "Find the mistake", accent: "Accent marks", speak: "Speak", steps: "Put in order", selfcheck: "Self-check"
    };
    function shell(t, host, optional) {
      var card = el("div", { "class": "task", id: "task-" + t.id });
      var head = el("div", { "class": "task-head" });
      var titleWrap = el("div");
      titleWrap.appendChild(el("div", { "class": "task-type" }, t.kind || TYPE_NAMES[t.type] || ""));
      titleWrap.appendChild(html("h3", null, inline(t.title)));
      head.appendChild(titleWrap);
      var chip = optional ? el("span", { "class": "chip opt" }, "Optional") : el("span", { "class": "chip", "data-chip": t.id }, "To do");
      head.appendChild(chip);
      card.appendChild(head);
      if (t.intro) card.appendChild(html("div", { "class": "prose" }, rich(t.intro)));
      if (t.passage) card.appendChild(html("div", { "class": "passage", lang: SETTINGS.lang }, rich(t.passage)));
      if (t.typing && SETTINGS.accents) card.appendChild(accentBar(card));
      var body = el("div", { "class": "items" });
      card.appendChild(body);
      var row = el("div", { "class": "row" });
      var check = el("button", { "class": "primary", type: "button" }, t.checkLabel || "Check");
      var hintBtn = el("button", { "class": "ghost", type: "button" }, "Show a hint");
      row.appendChild(check); row.appendChild(hintBtn);
      card.appendChild(row);
      var fb = el("div");
      card.appendChild(fb);
      var hintBox = el("div", { "class": "hints" });
      card.appendChild(hintBox);
      host.appendChild(card);
      hints(t.id, t.hints, hintBtn, hintBox);
      return { card: card, body: body, check: check, row: row, fb: fb, optional: optional };
    }
    function finish(t, s, ok, msg, list) {
      feedback(s.fb, ok, msg, list);
      if (ok && !s.optional) markDone(t.id);
    }
    function nearMsg(n) { return n ? " The yellow " + (n === 1 ? "box is" : "boxes are") + " right except for an accent mark or ñ." : ""; }

    /* ---------- multiple choice ---------- */
    function choiceList(key, choices, keepOrder, onPick, isDone) {
      var wrap = el("div", { "class": "choices" });
      var numeric = choices.every(function (c) { return /^\s*[\d$€]/.test(c[0]); });
      var order = keepOrder || numeric ? range(choices.length) : shuffled("order:" + key, choices.length);
      var fb = el("div");
      order.forEach(function (ci, i) {
        var c = choices[ci];
        var b = el("button", { "class": "choice", type: "button" });
        b.appendChild(el("span", { "class": "letter" }, "ABCDEF"[i]));
        b.appendChild(html("span", { "class": "choice-text" }, inline(c[0])));
        b.addEventListener("click", function () {
          wrap.querySelectorAll(".choice").forEach(function (x) { x.classList.remove("right", "wrong"); });
          b.classList.add(c[1] ? "right" : "wrong");
          feedback(fb, !!c[1], c[2] || (c[1] ? "Correct!" : "Not quite. Try another answer."));
          onPick(!!c[1]);
        });
        if (isDone && c[1]) b.classList.add("right");
        wrap.appendChild(b);
      });
      return { wrap: wrap, fb: fb };
    }
    function taskMC(t, host, optional) {
      var s = shell(t, host, optional);
      s.row.removeChild(s.check);
      var q = el("div", { "class": "quiz-q" });
      if (t.say) { var lr = el("div", { "class": "listen-row" }); lr.appendChild(sayButton(t.say, true)); lr.appendChild(sayButton(t.say, false, true)); q.appendChild(lr); }
      if (t.q) q.appendChild(html("p", { "class": "q" }, inline(t.q)));
      var cl = choiceList(t.id, t.choices, t.keepOrder, function (ok) { if (ok && !optional) markDone(t.id); }, state.done[t.id]);
      q.appendChild(cl.wrap); q.appendChild(cl.fb);
      s.body.appendChild(q);
    }
    function taskQuiz(t, host, optional) {
      var s = shell(t, host, optional);
      s.row.removeChild(s.check);
      var got = bag(t.id);
      var list = chosen(t, t.questions);
      list.forEach(function (x, n) {
        var question = x.it, qi = x.i;
        var block = el("div", { "class": "quiz-q" });
        if (question.say) {
          var lr = el("div", { "class": "listen-row" });
          lr.appendChild(sayButton(question.say, true)); lr.appendChild(sayButton(question.say, false, true));
          lr.appendChild(html("p", { "class": "q" }, (n + 1) + ". " + inline(question.q || "What did you hear?")));
          block.appendChild(lr);
        } else block.appendChild(html("p", { "class": "q" }, (n + 1) + ". " + inline(question.q)));
        var cl = choiceList(t.id + ":" + qi, question.choices, question.keepOrder, function (ok) {
          if (ok) got[qi] = true;
          save();
          if (list.every(function (y) { return got[y.i]; })) finish(t, s, true, t.okMsg || "All correct.");
        }, got[qi]);
        block.appendChild(cl.wrap); block.appendChild(cl.fb);
        s.body.appendChild(block);
      });
    }

    /* ---------- typed blanks ---------- */
    function taskCloze(t, host, optional) {
      t.typing = true;
      var s = shell(t, host, optional);
      var saved = bag(t.id);
      var rows = chosen(t).map(function (x, n) {
        var it = x.it, src = Text.itemText(it);
        var row = el("div", { "class": "item" });
        row.appendChild(el("span", { "class": "num" }, (n + 1) + "."));
        var inputs = [];
        Text.clozeParts(src).forEach(function (p, pi) {
          if (p.text != null) { row.appendChild(html("span", { lang: "es" }, inline(p.text))); return; }
          var key = x.i + "." + pi;
          var longest = p.answers.reduce(function (m, a) { return Math.max(m, a.length); }, 0);
          var inp = esInput({ "aria-label": "Blank " + (inputs.length + 1) + " in sentence " + (n + 1) });
          inp.style.width = Math.max(5, Math.min(18, longest + 3)) + "ch";
          inp.value = saved[key] || "";
          inp.addEventListener("input", function () { saved[key] = inp.value; save(); setMark(inp, null); });
          inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); s.check.click(); } });
          row.appendChild(inp);
          inputs.push({ inp: inp, answers: p.answers });
        });
        var sayHost = el("span");
        row.appendChild(sayHost);
        if (it.en) row.appendChild(html("span", { "class": "en" }, inline(it.en)));
        var why = el("span", { "class": "why" });
        row.appendChild(why);
        s.body.appendChild(row);
        return { row: row, inputs: inputs, it: it, src: src, sayHost: sayHost, why: why };
      });
      function check(quiet) {
        var bad = 0, near = 0, blank = 0;
        rows.forEach(function (r) {
          var allOk = true;
          r.inputs.forEach(function (x) {
            var res = Text.judge(x.inp.value, x.answers);
            if (!quiet || res === "ok") setMark(x.inp, res);
            if (res !== "ok") allOk = false;
            if (res === "bad") bad++; else if (res === "near") near++; else if (res === "blank") blank++;
          });
          r.row.classList.toggle("right", allOk);
          r.why.textContent = "";
          if (allOk) { if (!r.sayHost.firstChild && t.speak !== false) r.sayHost.appendChild(sayButton(r.it.say || Text.clozeSpoken(r.src))); }
          else if (!quiet && r.it.why && r.inputs.some(function (x) { return Text.judge(x.inp.value, x.answers) === "bad"; })) r.why.innerHTML = inline(r.it.why);
        });
        if (quiet) return;
        if (!bad && !near && !blank) finish(t, s, true, t.okMsg || "All correct.");
        else if (blank && !bad && !near) feedback(s.fb, false, "Fill in every blank. " + blank + " still empty.");
        else feedback(s.fb, false, (bad ? "Not yet. Fix the red " + (bad === 1 ? "box" : "boxes") + "." : "Almost!") + nearMsg(near));
      }
      s.check.addEventListener("click", function () { check(false); });
      if (state.done[t.id]) check(true);
    }

    /* ---------- tap to choose the word in a sentence ---------- */
    function taskSelect(t, host, optional) {
      var s = shell(t, host, optional);
      var saved = bag(t.id);
      var rows = chosen(t).map(function (x, n) {
        var it = x.it, src = Text.itemText(it);
        var row = el("div", { "class": "item" });
        row.appendChild(el("span", { "class": "num" }, (n + 1) + "."));
        var picks = [];
        Text.pickParts(src).forEach(function (p, pi) {
          if (p.text != null) { row.appendChild(html("span", { lang: "es" }, inline(p.text))); return; }
          var key = x.i + "." + pi;
          var grp = el("span", { "class": "pick", role: "group", "aria-label": "Choose a word" });
          var order = shuffled("sel:" + t.id + ":" + key, p.options.length);
          var buttons = order.map(function (oi) {
            var b = el("button", { type: "button", lang: "es", "aria-pressed": saved[key] === oi ? "true" : "false" }, p.options[oi]);
            b.addEventListener("click", function () {
              saved[key] = oi; save();
              buttons.forEach(function (bb) { bb.setAttribute("aria-pressed", bb === b ? "true" : "false"); });
              row.classList.remove("right", "wrong");
            });
            grp.appendChild(b);
            return b;
          });
          row.appendChild(grp);
          picks.push(key);
        });
        var sayHost = el("span");
        row.appendChild(sayHost);
        if (it.en) row.appendChild(html("span", { "class": "en" }, inline(it.en)));
        var why = el("span", { "class": "why" });
        row.appendChild(why);
        s.body.appendChild(row);
        return { row: row, picks: picks, it: it, src: src, sayHost: sayHost, why: why };
      });
      function check(quiet) {
        var wrong = 0, blank = 0;
        rows.forEach(function (r) {
          var ok = r.picks.every(function (k) { return saved[k] === 0; });
          var empty = r.picks.some(function (k) { return saved[k] == null; });
          if (ok) { r.row.classList.add("right"); r.row.classList.remove("wrong"); if (!r.sayHost.firstChild && t.speak !== false) r.sayHost.appendChild(sayButton(r.it.say || Text.pickSpoken(r.src))); r.why.textContent = ""; }
          else if (!quiet) {
            r.row.classList.remove("right");
            if (empty) blank++; else { wrong++; r.row.classList.add("wrong"); if (r.it.why) r.why.innerHTML = inline(r.it.why); }
          }
        });
        if (quiet) return;
        if (!wrong && !blank) finish(t, s, true, t.okMsg || "All correct.");
        else if (blank) feedback(s.fb, false, "Choose a word in every sentence. " + blank + " still need one.");
        else feedback(s.fb, false, (rows.length - wrong) + " of " + rows.length + " are right. Look again at the ones marked in pink.");
      }
      s.check.addEventListener("click", function () { check(false); });
      if (state.done[t.id]) check(true);
    }

    /* ---------- conjugation grid ---------- */
    function taskConj(t, host, optional) {
      t.typing = true;
      var s = shell(t, host, optional);
      var saved = bag(t.id);
      var cells = [];
      chosen(t, t.verbs).forEach(function (x) {
        var v = x.it;
        var box = el("div", { "class": "conj" });
        box.appendChild(html("div", { "class": "conj-title" }, '<span lang="es">' + esc(v.inf) + "</span> " + (v.en ? '<span class="en">(' + esc(v.en) + ")</span>" : "") + (v.note ? ' <span class="en">' + inline(v.note) + "</span>" : "")));
        var grid = el("div", { "class": "conj-grid" });
        Text.persons().forEach(function (p) {
          if (v.forms[p.i] == null) return;
          var key = x.i + "." + p.i;
          var cell = el("div", { "class": "conj-cell" });
          var id = "c-" + t.id + "-" + key.replace(".", "-");
          var label = (v.labels && v.labels[p.i]) || p.label;
          cell.appendChild(el("label", { "for": id, lang: "es" }, label));
          var inp = esInput({ id: id });
          inp.value = saved[key] || "";
          if (v.given && v.given.indexOf(p.i) !== -1) { inp.value = v.forms[p.i]; inp.disabled = true; inp.classList.add("ok"); }
          inp.addEventListener("input", function () { saved[key] = inp.value; save(); setMark(inp, null); });
          inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); s.check.click(); } });
          cell.appendChild(inp);
          var sh = el("span");
          cell.appendChild(sh);
          grid.appendChild(cell);
          cells.push({ inp: inp, answers: [v.forms[p.i]].concat(v.also && v.also[p.i] ? v.also[p.i] : []), sayHost: sh, spoken: Text.conjSpoken(v, p.i) });
        });
        box.appendChild(grid);
        s.body.appendChild(box);
      });
      function check(quiet) {
        var bad = 0, near = 0, blank = 0;
        cells.forEach(function (c) {
          if (c.inp.disabled) return;
          var res = Text.judge(c.inp.value, c.answers);
          if (!quiet || res === "ok") setMark(c.inp, res);
          if (res === "ok") { if (!c.sayHost.firstChild) c.sayHost.appendChild(sayButton(c.spoken)); }
          else if (res === "near") near++; else if (res === "blank") blank++; else bad++;
        });
        if (quiet) return;
        if (!bad && !near && !blank) finish(t, s, true, t.okMsg || "¡Perfecto! Tap 🔊 to hear each form.");
        else if (blank && !bad && !near) feedback(s.fb, false, "Fill in every form. " + blank + " still empty.");
        else feedback(s.fb, false, (bad ? "Not yet. Fix the red " + (bad === 1 ? "box" : "boxes") + "." : "Almost!") + nearMsg(near));
      }
      s.check.addEventListener("click", function () { check(false); });
      if (state.done[t.id]) check(true);
    }

    /* ---------- matching pairs ---------- */
    function taskMatch(t, host, optional) {
      var s = shell(t, host, optional);
      s.row.removeChild(s.check);
      var got = bag(t.id, { pairs: [] });
      if (!got.pairs) got.pairs = [];
      var pairs = chosen(t, t.pairs);
      var grid = el("div", { "class": "match" });
      var colL = el("div", { "class": "col" }), colR = el("div", { "class": "col" });
      colL.appendChild(el("h4", null, t.left || "Term"));
      colR.appendChild(el("h4", null, t.right || "Meaning"));
      grid.appendChild(colL); grid.appendChild(colR);
      s.body.appendChild(grid);
      var sel = null;
      var leftOrder = shuffled("ml:" + t.id, pairs.length), rightOrder = shuffled("mr:" + t.id, pairs.length);
      var L = {}, Rb = {};
      leftOrder.forEach(function (k) {
        var p = pairs[k];
        var b = html("button", { type: "button", lang: t.leftLang || SETTINGS.lang }, inline(p.it[0]));
        b.addEventListener("click", function () {
          if (got.pairs.indexOf(p.i) !== -1) { if (t.speak !== false) play(Text.spoken(p.it[0]), null); return; }
          if (t.speak !== false) play(Text.spoken(p.it[0]), null);
          if (sel) sel.classList.remove("sel");
          sel = b; b.classList.add("sel"); b.setAttribute("data-k", p.i);
        });
        L[p.i] = b; colL.appendChild(b);
      });
      rightOrder.forEach(function (k) {
        var p = pairs[k];
        var b = html("button", { type: "button" }, inline(p.it[1]));
        b.addEventListener("click", function () {
          if (got.pairs.indexOf(p.i) !== -1 || !sel) { if (!sel && got.pairs.indexOf(p.i) === -1) feedback(s.fb, false, "Tap a word on the left first, then its match on the right."); return; }
          var k2 = Number(sel.getAttribute("data-k"));
          if (k2 === p.i) {
            got.pairs.push(p.i); save();
            sel.classList.remove("sel"); sel.classList.add("paired"); b.classList.add("paired"); sel = null;
            feedback(s.fb, true, got.pairs.length + " of " + pairs.length + " matched.");
            if (pairs.every(function (x) { return got.pairs.indexOf(x.i) !== -1; })) finish(t, s, true, t.okMsg || "All matched.");
          } else {
            b.classList.add("miss"); var sb = sel;
            sb.classList.add("miss");
            setTimeout(function () { b.classList.remove("miss"); sb.classList.remove("miss"); }, 600);
            feedback(s.fb, false, "Not a match. Try again.");
          }
        });
        Rb[p.i] = b; colR.appendChild(b);
      });
      got.pairs.forEach(function (i) { if (L[i]) L[i].classList.add("paired"); if (Rb[i]) Rb[i].classList.add("paired"); });
    }

    /* ---------- sort into groups ---------- */
    function taskSort(t, host, optional) {
      var s = shell(t, host, optional);
      var picks = bag(t.id);
      var list = el("div", { "class": "sort-list" });
      s.body.appendChild(list);
      var items = chosen(t);
      var order = t.keepOrder ? range(items.length) : shuffled("so:" + t.id, items.length);
      var rows = {};
      order.forEach(function (k) {
        var x = items[k];
        var row = el("div", { "class": "sort-row" });
        var txt = html("span", { "class": "sort-text", lang: t.itemLang || SETTINGS.lang }, inline(x.it[0]));
        if (t.speak) txt.appendChild(sayButton(x.it[0]));
        row.appendChild(txt);
        var seg = el("div", { "class": "seg", role: "group", "aria-label": Text.plain(x.it[0]) });
        t.cats.forEach(function (c, ci) {
          var b = html("button", { type: "button", "aria-pressed": picks[x.i] === ci ? "true" : "false" }, inline(c));
          b.addEventListener("click", function () {
            picks[x.i] = ci; save();
            seg.querySelectorAll("button").forEach(function (y, yi) { y.setAttribute("aria-pressed", yi === ci ? "true" : "false"); });
            row.classList.remove("right", "wrong");
          });
          seg.appendChild(b);
        });
        row.appendChild(seg);
        list.appendChild(row);
        rows[x.i] = row;
      });
      function check(quiet) {
        var wrong = 0, blank = 0, why = [];
        items.forEach(function (x) {
          var ok = picks[x.i] === x.it[1];
          if (picks[x.i] == null) blank++;
          else if (!ok) { wrong++; if (x.it[2]) why.push(x.it[2]); }
          if (!quiet || ok) { rows[x.i].classList.toggle("right", ok); rows[x.i].classList.toggle("wrong", picks[x.i] != null && !ok); }
        });
        if (quiet) return;
        if (!wrong && !blank) finish(t, s, true, t.okMsg || "All sorted correctly.");
        else if (blank) feedback(s.fb, false, "Choose a group for every item. " + blank + " still need one.");
        else feedback(s.fb, false, (items.length - wrong) + " of " + items.length + " are right. Look again at the ones marked in pink.", why.slice(0, 2));
      }
      s.check.addEventListener("click", function () { check(false); });
      if (state.done[t.id]) check(true);
    }

    /* ---------- build the sentence from word tiles ---------- */
    function taskOrder(t, host, optional) {
      var s = shell(t, host, optional);
      var saved = bag(t.id);
      var boxes = chosen(t).map(function (x, n) {
        var it = x.it;
        var tk = Text.tokens(it.es);
        var words = tk.words.slice();
        if (!it.keepCase && words.length) words[0] = words[0].charAt(0).toLowerCase() + words[0].slice(1);
        var bank = words.concat(it.extra || []);
        var order = shuffled("ord:" + t.id + ":" + x.i, bank.length);
        var seq = saved[x.i] || (saved[x.i] = []);
        var box = el("div", { "class": "builder" });
        box.appendChild(html("div", { "class": "en" }, (n + 1) + ". " + inline(it.en)));
        var ans = el("div", { "class": "tiles answer", "aria-label": "Your sentence" });
        var pool = el("div", { "class": "tiles", "aria-label": "Word tiles" });
        var sayHost = el("div");
        box.appendChild(ans); box.appendChild(pool); box.appendChild(sayHost);
        function render() {
          ans.innerHTML = ""; pool.innerHTML = "";
          if (tk.lead) ans.appendChild(el("span", { "class": "punct" }, tk.lead));
          seq.forEach(function (bi, pos) {
            var b = el("button", { "class": "tile", type: "button", lang: "es", "aria-label": "Remove " + bank[bi] }, bank[bi]);
            b.addEventListener("click", function () { seq.splice(pos, 1); save(); box.classList.remove("right"); render(); });
            ans.appendChild(b);
          });
          if (!seq.length) ans.appendChild(el("span", { "class": "empty" }, "Tap the words below in order."));
          if (tk.trail) ans.appendChild(el("span", { "class": "punct" }, tk.trail));
          order.forEach(function (bi) {
            if (seq.indexOf(bi) !== -1) return;
            var b = el("button", { "class": "tile", type: "button", lang: "es", "aria-label": "Add " + bank[bi] }, bank[bi]);
            b.addEventListener("click", function () { seq.push(bi); save(); render(); });
            pool.appendChild(b);
          });
        }
        render();
        s.body.appendChild(box);
        var targets = [it.es].concat(it.alt || []).map(function (a) { return Text.norm(Text.tokens(a).words.join(" ")); });
        return {
          box: box, sayHost: sayHost, it: it,
          ok: function () {
            // Compare words, not tile positions, so duplicate words in either order both count.
            return targets.indexOf(Text.norm(seq.map(function (bi) { return bank[bi]; }).join(" "))) !== -1;
          },
          empty: function () { return !seq.length; }
        };
      });
      function check(quiet) {
        var wrong = 0, blank = 0;
        boxes.forEach(function (b) {
          var ok = b.ok();
          if (ok) { b.box.classList.add("right"); if (!b.sayHost.firstChild) { var full = b.it.es.replace(/_/g, " "); b.sayHost.appendChild(sayButton(full)); b.sayHost.appendChild(html("span", { lang: "es", "class": "es" }, " " + esc(full))); } }
          else if (b.empty()) blank++; else wrong++;
        });
        if (quiet) return;
        if (!wrong && !blank) finish(t, s, true, t.okMsg || "Every sentence is right.");
        else if (blank && !wrong) feedback(s.fb, false, "Build every sentence. " + blank + " still empty.");
        else feedback(s.fb, false, (boxes.length - wrong - blank) + " of " + boxes.length + " are right. Tap a word in your sentence to send it back." + (boxes.some(function (b) { return b.it.extra; }) ? " Careful: some tiles don't belong." : ""));
      }
      s.check.addEventListener("click", function () { check(false); });
      if (state.done[t.id]) check(true);
    }

    /* ---------- listen and write ---------- */
    function taskDictation(t, host, optional) {
      t.typing = true;
      var s = shell(t, host, optional);
      var saved = bag(t.id);
      var rows = chosen(t).map(function (x, n) {
        var text = Text.itemText(x.it);
        var row = el("div", { "class": "item" });
        row.appendChild(el("span", { "class": "num" }, (n + 1) + "."));
        row.appendChild(sayButton(text, true));
        row.appendChild(sayButton(text, false, true));
        var inp = esInput({ "class": "es-in wide", "aria-label": "What you heard, sentence " + (n + 1) });
        inp.value = saved[x.i] || "";
        inp.addEventListener("input", function () { saved[x.i] = inp.value; save(); setMark(inp, null); });
        inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); s.check.click(); } });
        row.appendChild(inp);
        var mark = el("span", { "class": "why" });
        row.appendChild(mark);
        s.body.appendChild(row);
        return { inp: inp, answers: [text].concat(x.it.alt || []), mark: mark, text: text };
      });
      function check(quiet) {
        var bad = 0, near = 0, blank = 0;
        rows.forEach(function (r) {
          var res = Text.judge(r.inp.value, r.answers);
          if (!quiet || res === "ok") setMark(r.inp, res);
          r.mark.textContent = ""; r.mark.className = "why";
          if (res === "ok") { r.mark.className = "why ok"; r.mark.innerHTML = '✓ <span lang="es">' + esc(r.text) + "</span>"; }
          else if (res === "near") near++; else if (res === "blank") blank++; else bad++;
        });
        if (quiet) return;
        if (!bad && !near && !blank) finish(t, s, true, t.okMsg || "¡Perfecto! Your ears are getting sharp.");
        else if (blank && !bad && !near) feedback(s.fb, false, "Write every sentence. " + blank + " still empty.");
        else feedback(s.fb, false, (bad ? "Not yet. Listen again to the red ones (try 🐢 for slow)." : "Almost!") + nearMsg(near) + " Capital letters and punctuation don't count.");
      }
      s.check.addEventListener("click", function () { check(false); });
      if (state.done[t.id]) check(true);
    }

    /* ---------- translate into Spanish ---------- */
    function taskTranslate(t, host, optional) {
      t.typing = true;
      var s = shell(t, host, optional);
      var saved = bag(t.id);
      var rows = chosen(t).map(function (x, n) {
        var it = x.it;
        var row = el("div", { "class": "item" });
        row.appendChild(el("span", { "class": "num" }, (n + 1) + "."));
        row.appendChild(html("span", { "class": "en", style: "flex-basis:auto;font-size:1rem;color:var(--ink);font-weight:600" }, inline(it.en)));
        var inp = esInput({ "class": "es-in wide", "aria-label": "In Spanish: " + Text.plain(it.en) });
        inp.value = saved[x.i] || "";
        inp.addEventListener("input", function () { saved[x.i] = inp.value; save(); setMark(inp, null); });
        inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); s.check.click(); } });
        row.appendChild(inp);
        var mark = el("span", { "class": "why" });
        row.appendChild(mark);
        s.body.appendChild(row);
        var model = Text.translateModel(it);
        return { inp: inp, it: it, mark: mark, model: model };
      });
      function check(quiet) {
        var bad = 0, near = 0, blank = 0;
        rows.forEach(function (r) {
          var res = Text.judge(r.inp.value, r.it.es);
          if (!quiet || res === "ok") setMark(r.inp, res);
          r.mark.innerHTML = ""; r.mark.className = "why";
          if (res === "ok") { r.mark.className = "why ok"; r.mark.innerHTML = "✓ "; r.mark.appendChild(sayButton(r.model)); r.mark.appendChild(html("span", { lang: "es" }, esc(r.model))); }
          else if (res === "near") near++; else if (res === "blank") blank++;
          else { bad++; if (!quiet && r.it.why) r.mark.innerHTML = inline(r.it.why); }
        });
        if (quiet) return;
        if (!bad && !near && !blank) finish(t, s, true, t.okMsg || "¡Fantástico! All translated.");
        else if (blank && !bad && !near) feedback(s.fb, false, "Translate every sentence. " + blank + " still empty.");
        else feedback(s.fb, false, (bad ? "Not yet. Check the red ones: verb ending, word order, and agreement." : "Almost!") + nearMsg(near));
      }
      s.check.addEventListener("click", function () { check(false); });
      if (state.done[t.id]) check(true);
    }

    /* ---------- find and fix the mistake ---------- */
    function taskErrors(t, host, optional) {
      t.typing = true;
      var s = shell(t, host, optional);
      var saved = bag(t.id);
      var rows = chosen(t).map(function (x, n) {
        var it = x.it;
        var st = saved[x.i] || (saved[x.i] = { found: false, fix: "" });
        var words = Text.errorWords(it.s), target = Text.errorIndex(it, words);
        var row = el("div", { "class": "item" });
        row.appendChild(el("span", { "class": "num" }, (n + 1) + "."));
        var wrap = el("span", { "class": "words", lang: "es" });
        var fixRow = el("span", { "class": "row" });
        var inp = esInput({ "aria-label": "Correct word for sentence " + (n + 1) });
        inp.style.width = "9rem";
        inp.value = st.fix || "";
        inp.addEventListener("input", function () { st.fix = inp.value; save(); setMark(inp, null); });
        inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); s.check.click(); } });
        fixRow.appendChild(el("span", { "class": "goal" }, "Correct word:"));
        fixRow.appendChild(inp);
        fixRow.hidden = !st.found;
        var why = el("span", { "class": "why" });
        words.forEach(function (w, wi) {
          if (w.pre) wrap.appendChild(el("span", null, w.pre));
          var b = el("button", { type: "button" }, w.word);
          if (st.found && wi === target) b.classList.add("hit");
          b.addEventListener("click", function () {
            if (st.found) return;
            if (wi === target) { st.found = true; save(); b.classList.add("hit"); fixRow.hidden = false; why.textContent = ""; inp.focus(); }
            else { b.classList.add("miss"); setTimeout(function () { b.classList.remove("miss"); }, 700); why.className = "why"; why.textContent = "“" + w.word + "” is fine here. Look again."; }
          });
          wrap.appendChild(b);
          if (w.post) wrap.appendChild(el("span", null, w.post));
        });
        row.appendChild(wrap);
        row.appendChild(fixRow);
        row.appendChild(why);
        s.body.appendChild(row);
        return { st: st, inp: inp, it: it, why: why, fixed: Text.fixedSentence(it) };
      });
      function check(quiet) {
        var notFound = 0, bad = 0, near = 0;
        rows.forEach(function (r) {
          if (!r.st.found) { notFound++; return; }
          var res = Text.judge(r.inp.value, r.it.fix);
          if (!quiet || res === "ok") setMark(r.inp, res);
          if (res === "ok") {
            r.why.className = "why ok"; r.why.innerHTML = "✓ "; r.why.appendChild(sayButton(r.fixed));
            r.why.appendChild(html("span", { lang: "es" }, esc(r.fixed) + (r.it.why ? " · " : ""))); if (r.it.why) r.why.appendChild(html("span", null, inline(r.it.why)));
          } else if (res === "near") near++; else bad++;
        });
        if (quiet) return;
        if (!notFound && !bad && !near) finish(t, s, true, t.okMsg || "Every mistake fixed.");
        else if (notFound) feedback(s.fb, false, "Tap the wrong word in every sentence first. " + notFound + " to go.");
        else feedback(s.fb, false, (bad ? "You found the mistakes. Now fix the red corrections." : "Almost!") + nearMsg(near));
      }
      s.check.addEventListener("click", function () { check(false); });
      if (state.done[t.id]) check(true);
    }

    /* ---------- where does the accent go? ---------- */
    var PLAIN_VOWEL = { "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "Á": "A", "É": "E", "Í": "I", "Ó": "O", "Ú": "U" };
    function taskAccent(t, host, optional) {
      var s = shell(t, host, optional);
      var saved = bag(t.id);
      var rows = chosen(t).map(function (x, n) {
        var word = Text.itemText(x.it);
        var chars = Array.from(word);
        var answer = -1;
        chars.forEach(function (c, i) { if (PLAIN_VOWEL[c]) answer = i; });
        var row = el("div", { "class": "item" });
        row.appendChild(el("span", { "class": "num" }, (n + 1) + "."));
        var letters = el("span", { "class": "letters", lang: "es" });
        var buttons = [];
        chars.forEach(function (c, i) {
          var shown = PLAIN_VOWEL[c] || c;
          var vowel = /[aeiouAEIOU]/.test(shown);
          var b = el("button", { type: "button", "class": vowel ? "" : "cons", "aria-pressed": saved[x.i] === i ? "true" : "false" }, shown);
          if (vowel) b.addEventListener("click", function () { saved[x.i] = i; save(); sync(); row.classList.remove("right"); });
          else { b.tabIndex = -1; b.setAttribute("aria-hidden", "true"); }
          letters.appendChild(b); buttons.push(b);
        });
        var none = el("button", { type: "button", "class": "none", "aria-pressed": saved[x.i] === -1 ? "true" : "false" }, "No accent");
        none.addEventListener("click", function () { saved[x.i] = -1; save(); sync(); row.classList.remove("right"); });
        function sync() {
          buttons.forEach(function (b, i) { b.setAttribute("aria-pressed", saved[x.i] === i ? "true" : "false"); b.textContent = saved[x.i] === i ? ({ a: "á", e: "é", i: "í", o: "ó", u: "ú", A: "Á", E: "É", I: "Í", O: "Ó", U: "Ú" }[PLAIN_VOWEL[chars[i]] || chars[i]] || chars[i]) : (PLAIN_VOWEL[chars[i]] || chars[i]); });
          none.setAttribute("aria-pressed", saved[x.i] === -1 ? "true" : "false");
        }
        sync();
        row.appendChild(letters); row.appendChild(none);
        var sayHost = el("span");
        row.appendChild(sayHost);
        if (x.it.en) row.appendChild(html("span", { "class": "en" }, inline(x.it.en)));
        var why = el("span", { "class": "why" });
        row.appendChild(why);
        s.body.appendChild(row);
        return { row: row, ok: function () { return saved[x.i] === answer; }, blank: function () { return saved[x.i] == null; }, word: word, sayHost: sayHost, why: why, it: x.it };
      });
      function check(quiet) {
        var wrong = 0, blank = 0;
        rows.forEach(function (r) {
          if (r.ok()) { r.row.classList.add("right"); r.why.textContent = ""; if (!r.sayHost.firstChild) { r.sayHost.appendChild(sayButton(r.word)); } }
          else if (r.blank()) blank++;
          else { wrong++; r.row.classList.remove("right"); if (!quiet && r.it.why) r.why.innerHTML = inline(r.it.why); }
        });
        if (quiet) return;
        if (!wrong && !blank) finish(t, s, true, t.okMsg || "¡Exacto! Tap 🔊 to hear where the stress falls.");
        else if (blank) feedback(s.fb, false, "Decide on every word. " + blank + " still to do.");
        else feedback(s.fb, false, (rows.length - wrong) + " of " + rows.length + " are right. Say the word out loud: which syllable is strongest?");
      }
      s.check.addEventListener("click", function () { check(false); });
      if (state.done[t.id]) check(true);
    }

    /* ---------- speaking practice (always optional) ---------- */
    function taskSpeak(t, host) {
      var s = shell(t, host, true);
      s.row.removeChild(s.check);
      var canRecord = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
      if (!canRecord) s.body.appendChild(el("p", { "class": "goal" }, "Recording isn't available on this device. Listen, then say each one out loud."));
      chosen(t).forEach(function (x, n) {
        var text = Text.itemText(x.it);
        var row = el("div", { "class": "item" });
        row.appendChild(el("span", { "class": "num" }, (n + 1) + "."));
        row.appendChild(sayButton(text));
        row.appendChild(html("span", { "class": "es", lang: "es" }, esc(text)));
        if (x.it.en) row.appendChild(html("span", { "class": "en" }, inline(x.it.en)));
        if (canRecord) {
          var ctl = el("span", { "class": "speak-row" });
          var rec = el("button", { type: "button", "class": "rec" }, "● Record");
          var mine = el("button", { type: "button", disabled: "" }, "▶ My voice");
          var url = null, mr = null, chunks = [];
          rec.addEventListener("click", function () {
            if (mr && mr.state === "recording") { mr.stop(); return; }
            navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
              chunks = []; mr = new MediaRecorder(stream);
              mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
              mr.onstop = function () {
                stream.getTracks().forEach(function (tr) { tr.stop(); });
                if (url) URL.revokeObjectURL(url);
                url = URL.createObjectURL(new Blob(chunks, { type: mr.mimeType || "audio/mp4" }));
                mine.disabled = false; rec.classList.remove("on"); rec.textContent = "● Record again";
                feedback(s.fb, true, "Recorded. Play the model 🔊, then your voice. Do they sound alike?");
              };
              mr.start(); rec.classList.add("on"); rec.textContent = "■ Stop";
            }, function () { feedback(s.fb, false, "The microphone isn't available. You can still say each one out loud."); });
          });
          mine.addEventListener("click", function () { if (url) { stop(); player = new Audio(url); player.play(); } });
          ctl.appendChild(rec); ctl.appendChild(mine);
          row.appendChild(ctl);
        }
        s.body.appendChild(row);
      });
    }


    /* ---------- put steps in order ---------- */
    // items are written in the right order; each student sees them shuffled.
    function taskSteps(t, host, optional) {
      var s = shell(t, host, optional);
      var seq = bag(t.id, { seq: [] });
      if (!seq.seq) seq.seq = [];
      var n = t.items.length;
      var order = shuffled("st:" + t.id, n);
      var wrap = el("div", { "class": "stepzones" });
      var bankBox = el("div"), seqBox = el("div");
      bankBox.appendChild(el("h4", null, "Steps"));
      seqBox.appendChild(el("h4", null, t.seqLabel || "Your order"));
      var bank = el("div", { "class": "steplist" }), list = el("ol", { "class": "steplist chosen" });
      bankBox.appendChild(bank); seqBox.appendChild(list);
      wrap.appendChild(bankBox); wrap.appendChild(seqBox);
      s.body.appendChild(wrap);
      function render() {
        bank.innerHTML = ""; list.innerHTML = "";
        order.forEach(function (i) {
          if (seq.seq.indexOf(i) !== -1) return;
          var b = html("button", { type: "button", "class": "stepbtn" }, inline(Text.itemText(t.items[i])));
          b.addEventListener("click", function () { seq.seq.push(i); save(); render(); });
          bank.appendChild(b);
        });
        seq.seq.forEach(function (i, pos) {
          var li = el("li");
          var b = html("button", { type: "button", "class": "stepbtn", "aria-label": "Remove step " + (pos + 1) }, inline(Text.itemText(t.items[i])));
          b.addEventListener("click", function () { seq.seq.splice(pos, 1); save(); render(); });
          li.appendChild(b); list.appendChild(li);
        });
        if (!seq.seq.length) list.appendChild(el("li", { "class": "empty" }, "Tap the steps in order."));
        if (!bank.children.length) bank.appendChild(el("div", { "class": "empty" }, "All steps used."));
      }
      render();
      function check(quiet) {
        var k = 0;
        while (k < seq.seq.length && seq.seq[k] === k) k++;
        var all = k === n && seq.seq.length === n;
        list.classList.toggle("right", all);
        if (quiet) return;
        if (all) finish(t, s, true, t.okMsg || "Correct order.");
        else if (seq.seq.length < n) feedback(s.fb, false, "Use every step. You have " + seq.seq.length + " of " + n + ".");
        else feedback(s.fb, false, k === 0 ? "The first step isn't right yet. What has to happen first?" : "The first " + k + " are in the right order. Look again at step " + (k + 1) + ". Tap a step to send it back.");
      }
      s.check.addEventListener("click", function () { check(false); });
      if (state.done[t.id]) check(true);
    }

    /* ---------- private self-check (always optional, never sent anywhere) ---------- */
    // items: [label]; scale: [low label, high label]; tips: text shown for answers of 1 or 2.
    function taskSelfcheck(t, host) {
      var s = shell(t, host, true);
      s.row.removeChild(s.check);
      var ans = bag(t.id);
      s.body.appendChild(html("p", { "class": "goal" }, "🔒 Only you see this. Your answers stay on this iPad and aren't sent to Blackbaud or your teacher."));
      var chart = el("div", { "class": "selfchart", "aria-hidden": "true" });
      t.items.forEach(function (label, i) {
        var row = el("div", { "class": "sort-row" });
        row.appendChild(html("span", { "class": "sort-text" }, inline(label)));
        var seg = el("div", { "class": "seg", role: "group", "aria-label": Text.plain(label) });
        [1, 2, 3, 4, 5].forEach(function (v) {
          var b = el("button", { type: "button", "aria-pressed": ans[i] === v ? "true" : "false", "aria-label": v + " of 5" }, String(v));
          b.addEventListener("click", function () { ans[i] = v; save(); seg.querySelectorAll("button").forEach(function (x, xi) { x.setAttribute("aria-pressed", xi + 1 === v ? "true" : "false"); }); draw(); });
          seg.appendChild(b);
        });
        row.appendChild(seg);
        s.body.appendChild(row);
      });
      s.body.appendChild(html("p", { "class": "goal" }, "1 = " + esc((t.scale || ["not at all", "very much"])[0]) + " · 5 = " + esc((t.scale || ["not at all", "very much"])[1])));
      s.body.appendChild(chart);
      function draw() {
        chart.innerHTML = "";
        var any = false;
        t.items.forEach(function (label, i) {
          if (!ans[i]) return;
          any = true;
          var bar = el("div", { "class": "selfbar" });
          bar.appendChild(html("span", { "class": "lbl" }, inline(t.short ? t.short[i] : label)));
          var track = el("span", { "class": "track" });
          var fill = el("span", { "class": "fill" + (ans[i] <= 2 ? " low" : "") });
          fill.style.width = (ans[i] * 20) + "%";
          track.appendChild(fill); bar.appendChild(track);
          bar.appendChild(el("span", { "class": "val" }, ans[i] + "/5"));
          chart.appendChild(bar);
        });
        var low = t.items.map(function (_, i) { return i; }).filter(function (i) { return ans[i] && ans[i] <= 2; });
        if (low.length && t.tip) chart.appendChild(html("p", { "class": "callout" }, inline(t.tip)));
        chart.hidden = !any;
      }
      draw();
    }

    var RENDER = {
      mc: taskMC, quiz: taskQuiz, listen: taskQuiz, read: taskQuiz, cloze: taskCloze, select: taskSelect, conj: taskConj,
      match: taskMatch, sort: taskSort, order: taskOrder, dictation: taskDictation, translate: taskTranslate,
      errors: taskErrors, accent: taskAccent, speak: taskSpeak, steps: taskSteps, selfcheck: taskSelfcheck
    };

    /* ======================= writing (Build) ======================= */
    function wordRe(w) {
      var e = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
      return new RegExp("(^|[^\\p{L}])" + e + "(?=[^\\p{L}]|$)", "iu");
    }
    function reqStatus(r, text) {
      var t = text.normalize("NFC");
      if (r.words) { var n = (t.match(/[\p{L}'’-]+/gu) || []).length; return { ok: n >= r.words, note: n + " / " + r.words + " words" }; }
      if (r.lines) { var L = t.split("\n").filter(function (x) { return /\p{L}/u.test(x); }).length; return { ok: L >= r.lines, note: L + " / " + r.lines + " lines" }; }
      if (r.sentences) { var k = t.split(/[.!?]+/).filter(function (x) { return x.trim().split(/\s+/).length >= 2; }).length; return { ok: k >= r.sentences, note: k + " / " + r.sentences }; }
      if (r.questions) { var q = (t.match(/¿[^?]+\?/g) || []).length; return { ok: q >= r.questions, note: q + " / " + r.questions }; }
      if (r.any) {
        var min = r.min || 1;
        var hit = r.any.filter(function (w) { return wordRe(w).test(t); });
        if (hit.length >= min) return { ok: true, note: hit.slice(0, 6).join(", ") };
        var loose = r.any.filter(function (w) { return wordRe(Text.strip(w)).test(Text.strip(t)); });
        return { ok: false, note: (hit.length ? hit.length + " / " + min : "") + (loose.length > hit.length ? " · check your accent marks" : "") };
      }
      if (r.re) {
        // \b isn't accent-aware in JavaScript, so a \b at either end means "not next to a letter".
        var src = r.re.replace(/^\\b/, "(?:^|[^\\p{L}])").replace(/\\b$/, "(?=[^\\p{L}]|$)");
        var m = (t.match(new RegExp(src, "giu")) || []).map(function (x) { return x.replace(/^[^\p{L}]+/u, ""); }); return { ok: m.length >= (r.min || 1), note: m.length ? m.slice(0, 4).join(", ") : "" };
      }
      return { ok: false };
    }
    function buildStep(host) {
      var b = M.build;
      host.appendChild(html("div", { "class": "prose" }, rich(b.prompt)));
      if (b.model) {
        var model = el("div", { "class": "model" });
        model.appendChild(el("span", { "class": "lbl" }, "Example"));
        model.appendChild(html("div", null, rich(b.model)));
        host.appendChild(model);
      }
      var card = el("div", { "class": "task", id: "task-build" });
      var head = el("div", { "class": "task-head" });
      head.appendChild(html("h3", null, inline(b.title || "Your writing must:")));
      head.appendChild(el("span", { "class": "chip", "data-chip": "build" }, "To do"));
      card.appendChild(head);
      var list = el("ul", { "class": "status-list" });
      var lis = b.reqs.map(function (r) { var li = el("li"); list.appendChild(li); return li; });
      card.appendChild(list);
      if (SETTINGS.accents) card.appendChild(accentBar(card));
      var ta = el("textarea", { "class": "es-in write", id: "build-text", lang: SETTINGS.lang, autocapitalize: "sentences", autocomplete: "off", autocorrect: "off", spellcheck: "false", placeholder: b.placeholder || "Write here…", "aria-label": "Your writing in Spanish" });
      ta.value = state.build || "";
      card.appendChild(ta);
      var count = el("div", { "class": "wordcount" });
      card.appendChild(count);
      var fb = el("div");
      card.appendChild(fb);
      host.appendChild(card);
      function update() {
        state.build = ta.value; save();
        var all = true;
        b.reqs.forEach(function (r, i) {
          var st = reqStatus(r, ta.value);
          if (!st.ok) all = false;
          lis[i].className = st.ok ? "done" : "";
          lis[i].innerHTML = (st.ok ? "✓ " : "○ ") + inline(r.t) + (st.note ? ' <span class="goal">(' + esc(st.note) + ")</span>" : "");
        });
        count.textContent = (ta.value.match(/[\p{L}'’-]+/gu) || []).length + " words";
        if (all && !state.done.build) { feedback(fb, true, "Your writing meets every requirement. You'll paste it into Blackbaud in Step 6."); markDone("build"); }
        else if (all) feedback(fb, true, "Every requirement met.");
        else fb.innerHTML = "";
      }
      ta.addEventListener("input", update);
      update();
    }

    /* ======================= learn step pieces ======================= */
    function conjTable(v) {
      var w = el("div", { "class": "tbl" });
      var tbody = Text.persons().filter(function (p) { return v.forms[p.i] != null; }).map(function (p) {
        var label = (v.labels && v.labels[p.i]) || p.label;
        var form = String(v.forms[p.i]).replace(/\*\*(.+?)\*\*/g, '<span class="end">$1</span>');
        return "<tr><td lang=\"es\"" + (p.vos ? ' class="vos"' : "") + ">" + esc(label) + '</td><td lang="es"><span class="es">' + form + "</span> " + Text.sayBtn(Text.conjSpoken(v, p.i)) + "</td></tr>";
      }).join("");
      w.innerHTML = "<table><thead><tr><th colspan=\"2\" lang=\"es\">" + esc(v.inf) + (v.en ? ' <span style="font-weight:500">(' + esc(v.en) + ")</span>" : "") + "</th></tr></thead><tbody>" + tbody + "</tbody>" + (v.caption ? "<caption>" + inline(v.caption) + "</caption>" : "") + "</table>";
      return w;
    }
    function table(tb) {
      var w = el("div", { "class": "tbl" });
      var h = "<table>";
      if (tb.head) h += "<thead><tr>" + tb.head.map(function (c) { return "<th>" + inline(c) + "</th>"; }).join("") + "</tr></thead>";
      h += "<tbody>" + tb.rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + inline(c) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody>";
      if (tb.caption) h += "<caption>" + inline(tb.caption) + "</caption>";
      w.innerHTML = h + "</table>";
      return w;
    }
    function examples(list) {
      var ul = el("ul", { "class": "examples" });
      list.forEach(function (ex) {
        var li = el("li");
        li.appendChild(sayButton(ex[0]));
        li.appendChild(html("span", { "class": "es", lang: "es" }, Text.emph(ex[0])));
        li.appendChild(html("span", { "class": "en" }, inline(ex[1] || "")));
        ul.appendChild(li);
      });
      return ul;
    }
    function flashcards(list) {
      var grid = el("div", { "class": "flash" });
      list.forEach(function (c) {
        var card = el("div", { "class": "card", role: "button", tabindex: "0", "aria-label": Text.plain(c[0]) + ". Tap to see the English." });
        card.appendChild(html("span", { "class": "front", lang: "es" }, Text.emph(c[0])));
        var back = html("span", { "class": "back" }, inline(c[1]));
        back.hidden = true;
        card.appendChild(back);
        card.appendChild(sayButton(c[0]));
        var note = el("span", { "class": "flip-note" }, "tap to flip");
        card.appendChild(note);
        function flip(e) {
          if (e.target.closest(".say")) return;
          card.classList.toggle("flipped"); back.hidden = !back.hidden; note.textContent = back.hidden ? "tap to flip" : "";
          if (!back.hidden) play(Text.spoken(c[0]), null);
        }
        card.addEventListener("click", flip);
        card.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(e); } });
        grid.appendChild(card);
      });
      return grid;
    }

    /* ======================= page ======================= */
    var STEPS = [
      ["context", "1 Context"], ["learn", "2 Learn"], ["try", "3 Practice"], ["build", "4 Build"],
      ["reflect", "5 Reflect"], ["check", "6 Check"], ["further", "7 Go Further"]
    ];
    function stepHead(n, title, ipp) {
      return html("div", { "class": "step-head" }, '<span class="step-num">' + n + "</span><h2>" + inline(title) + '</h2><span class="ipp">' + esc(ipp) + "</span>");
    }
    function section(id) { return el("section", { "class": "step", id: id }); }

    function page() {
      var app = $("app");
      app.innerHTML = "";
      document.title = "M" + M.num + " · " + Text.plain(M.title) + " · " + SETTINGS.course;

      var bar = el("div", { "class": "bar" });
      var inner = el("div", { "class": "bar-inner" });
      inner.appendChild(el("img", { "class": "bar-seal", src: "assets/seal.png", alt: "Scranton Prep seal" }));
      inner.appendChild(el("a", { "class": "bar-title", href: "index.html", title: "All modules" }, "M" + M.num));
      var nav = el("nav", { "class": "steps", "aria-label": "Module steps" });
      STEPS.forEach(function (st) { nav.appendChild(el("a", { href: "#" + st[0], "data-step": st[0] }, st[1])); });
      inner.appendChild(nav);
      inner.appendChild(el("span", { "class": "meter", id: "meter" }, ""));
      bar.appendChild(inner);
      app.appendChild(bar);

      var main = el("main", { "class": "wrap" });
      app.appendChild(main);

      /* header */
      var head = el("header", { "class": "intro" });
      head.appendChild(el("div", { "class": "tilestrip", "aria-hidden": "true" }));
      head.appendChild(el("span", { "class": "eyebrow" }, "Unit " + M.unit + ": " + M.unitTitle + " · Module " + M.num + " of " + (M.total || 30)));
      head.appendChild(html("h1", null, inline(M.title)));
      if (M.subtitle) head.appendChild(html("p", { "class": "subtitle" }, inline(M.subtitle)));
      head.appendChild(html("p", { "class": "lede" }, inline(M.lede)));
      var req = M.tasks.filter(function (t) { return !t.optional && t.type !== "speak" && t.type !== "selfcheck"; }).length + 1;
      head.appendChild(html("div", { "class": "facts" }, "<span><b>Time:</b> about " + (M.minutes || 40) + " minutes</span><span><b>To pass:</b> finish the " + req + " activities, then complete the Blackbaud check</span><span><b>Saves:</b> automatically on this iPad</span>"));
      var vb = el("div", { "class": "voicebar" });
      vb.appendChild(el("span", null, "🔊 Voice:"));
      var segV = el("div", { "class": "seg", role: "group", "aria-label": "Voice" });
      [["es", "España"], ["la", "Latinoamérica"]].forEach(function (o) {
        var b = el("button", { type: "button", "aria-pressed": prefs.voice === o[0] ? "true" : "false" }, o[1]);
        b.addEventListener("click", function () { prefs.voice = o[0]; savePrefs(); segV.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); play(o[0] === "la" ? "Hola, ¿qué tal?" : "Hola, ¿qué tal?", null); });
        segV.appendChild(b);
      });
      vb.appendChild(segV);
      vb.appendChild(el("span", null, "Speed:"));
      var segS = el("div", { "class": "seg", role: "group", "aria-label": "Speed" });
      [[false, "Normal"], [true, "Lenta (slow)"]].forEach(function (o) {
        var b = el("button", { type: "button", "aria-pressed": prefs.slow === o[0] ? "true" : "false" }, o[1]);
        b.addEventListener("click", function () { prefs.slow = o[0]; savePrefs(); segS.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); });
        segS.appendChild(b);
      });
      vb.appendChild(segS);
      if (SETTINGS.audio) head.appendChild(vb);
      if (M.welcome) head.appendChild(html("div", { "class": "welcome" }, M.welcome));
      if (M.recap) head.appendChild(html("div", { "class": "recap" }, "<strong>Last time</strong><span>" + inline(M.recap) + "</span>"));
      main.appendChild(head);

      /* 1 context */
      var s1 = section("context");
      s1.appendChild(stepHead(1, M.context.title, "Context"));
      var story = el("div", { "class": "story" });
      if (M.context.place) story.appendChild(el("span", { "class": "place" }, "📍 " + M.context.place));
      story.appendChild(html("div", { "class": "prose" }, rich(M.context.text)));
      s1.appendChild(story);
      main.appendChild(s1);

      /* 2 learn */
      var s2 = section("learn");
      s2.appendChild(stepHead(2, M.learnTitle || "Learn", "Experience"));
      M.learn.forEach(function (idea, i) {
        var box = el("div", { "class": "idea" });
        box.appendChild(html("h3", null, (M.learn.length > 1 ? "Idea " + (i + 1) + ": " : "") + inline(idea.title)));
        if (idea.text) box.appendChild(html("div", { "class": "prose" }, rich(idea.text)));
        if (idea.conj) { var cw = el("div", { "class": "conj-wrap" }); idea.conj.forEach(function (v) { cw.appendChild(conjTable(v)); }); box.appendChild(cw); }
        if (idea.table) box.appendChild(table(idea.table));
        if (idea.examples) box.appendChild(examples(idea.examples));
        if (idea.flash) box.appendChild(flashcards(idea.flash));
        if (idea.after) box.appendChild(html("div", { "class": "prose" }, rich(idea.after)));
        if (idea.tip) box.appendChild(html("div", { "class": "callout" }, "<b>Tip:</b> " + inline(idea.tip)));
        s2.appendChild(box);
      });
      main.appendChild(s2);

      /* 3 try */
      var s3 = section("try");
      s3.appendChild(stepHead(3, "Practice", "Experience"));
      s3.appendChild(html("p", { "class": "goal" }, "Every activity checks itself. Pink means try again. Stuck? Tap <b>Show a hint</b>."));
      M.tasks.forEach(function (t) { RENDER[t.type](t, s3, !!t.optional || t.type === "speak" || t.type === "selfcheck"); });
      main.appendChild(s3);

      /* 4 build */
      var s4 = section("build");
      s4.appendChild(stepHead(4, "Build: " + M.build.heading, "Action"));
      buildStep(s4);
      main.appendChild(s4);

      /* 5 reflect */
      var s5 = section("reflect");
      s5.appendChild(stepHead(5, "Reflect", "Reflection"));
      s5.appendChild(html("p", { "class": "reflect-q" }, inline(M.reflect.q)));
      s5.appendChild(html("p", { "class": "goal" }, "Write 2 to 4 sentences. Your teacher will read this, so share only what you're comfortable sharing. You'll copy your answer into the Blackbaud check. Your draft saves on this iPad."));
      var draft = el("textarea", { "class": "draft", id: "reflect-draft", placeholder: M.reflect.placeholder || "", "aria-label": "Your reflection" });
      draft.value = state.reflect || "";
      draft.addEventListener("input", function () { state.reflect = draft.value; save(); refresh(); });
      s5.appendChild(draft);
      var rr = el("div", { "class": "row" });
      var copyR = el("button", { type: "button" }, "Copy my reflection");
      var copyRMsg = el("span", { "class": "goal" });
      copyR.addEventListener("click", function () { copyText(draft.value, copyRMsg, draft); });
      rr.appendChild(copyR); rr.appendChild(copyRMsg);
      s5.appendChild(rr);
      main.appendChild(s5);

      /* 6 check */
      var s6 = section("check");
      s6.appendChild(stepHead(6, "Check in Blackbaud", "Evaluation"));
      var cc = el("div", { "class": "check-card", id: "check-card" });
      var locked = el("div", { id: "check-locked" });
      locked.appendChild(html("p", null, "<b>Finish every activity to unlock your completion code.</b>"));
      locked.appendChild(el("ul", { "class": "status-list", id: "check-status" }));
      cc.appendChild(locked);
      var open = el("div", { id: "check-open", hidden: "" });
      open.appendChild(html("p", null, "<b>Nice work! All activities done. Your completion code is:</b>"));
      open.appendChild(el("div", { "class": "code-badge", id: "code-badge" }));
      open.appendChild(html("p", null, "Now open Blackbaud and find the assessment <b>“M" + M.num + " Check: " + esc(Text.plain(M.title)) + ".”</b> It asks for:"));
      open.appendChild(html("ol", { "class": "todo" }, "<li>Your completion code (above)</li><li>5 short quiz questions</li><li>Your writing from Step 4. Tap the button below, then paste it in.</li><li>Your reflection from Step 5</li>"));
      var cb = el("div", { "class": "row" });
      var copyB = el("button", { "class": "primary", type: "button" }, "Copy my writing");
      var copyBMsg = el("span", { "class": "goal" });
      copyB.addEventListener("click", function () { copyText(state.build || "", copyBMsg, $("build-text")); });
      cb.appendChild(copyB); cb.appendChild(copyBMsg);
      open.appendChild(cb);
      open.appendChild(html("p", { "class": "goal" }, "To pass, enter the correct code and score at least 4 out of 5 on the quiz."));
      cc.appendChild(open);
      s6.appendChild(cc);
      main.appendChild(s6);

      /* 7 further */
      var s7 = section("further");
      s7.appendChild(stepHead(7, "Go further", "Optional"));
      if (M.further) {
        if (M.further.note) s7.appendChild(html("div", { "class": "prose" }, rich(M.further.note)));
        if (M.further.type) RENDER[M.further.type](M.further, s7, true);
      }
      if (M.culture) s7.appendChild(html("div", { "class": "note-es" }, rich(M.culture)));
      main.appendChild(s7);

      /* footer */
      var foot = el("footer");
      var nav2 = el("span");
      nav2.innerHTML = (M.prev ? '<a href="' + M.prev + '">← Previous module</a> · ' : "") + '<a href="index.html">All modules</a>' + (M.next ? ' · <a href="' + M.next + '">Next module →</a>' : "");
      foot.appendChild(nav2);
      foot.appendChild(html("span", null, "Stuck? Tap <b>Show a hint</b> first, then ask your teacher."));
      if (SETTINGS.help) main.appendChild(html("aside", { "class": "helpbox", "aria-label": "Where to get help" }, SETTINGS.help));
      var reset = el("button", { "class": "ghost", id: "reset", type: "button" }, "Start over");
      var armed = false, timer = null;
      reset.addEventListener("click", function () {
        if (!armed) { armed = true; reset.textContent = "Tap again to erase all progress"; timer = setTimeout(function () { armed = false; reset.textContent = "Start over"; }, 4000); return; }
        clearTimeout(timer);
        try { localStorage.removeItem(KEY); } catch (e) {}
        location.reload();
      });
      foot.appendChild(reset);
      main.appendChild(foot);
    }

    /* ---------- copy to clipboard ---------- */
    function copyText(text, msgEl, fallbackEl) {
      function fallback() {
        msgEl.textContent = "Copy didn't work here. Select the text and copy it yourself.";
        if (fallbackEl) { fallbackEl.focus(); if (fallbackEl.select) fallbackEl.select(); }
      }
      if (!String(text).trim()) { msgEl.textContent = "There's nothing to copy yet."; return; }
      try { navigator.clipboard.writeText(text).then(function () { msgEl.textContent = "Copied. Paste it into Blackbaud."; }, fallback); }
      catch (e) { fallback(); }
    }

    /* ---------- progress display ---------- */
    function required() { return M.tasks.filter(function (t) { return !t.optional && t.type !== "speak" && t.type !== "selfcheck"; }).map(function (t) { return t.id; }).concat(["build"]); }
    function refresh() {
      if (!M) return;
      var req = required();
      var count = req.filter(function (id) { return state.done[id]; }).length;
      var all = count === req.length;
      $("meter").textContent = count + " of " + req.length;
      document.querySelectorAll("[data-chip]").forEach(function (c) {
        var d = !!state.done[c.getAttribute("data-chip")];
        c.classList.toggle("done", d);
        c.textContent = d ? "Done ✓" : "To do";
      });
      var tryDone = req.filter(function (id) { return id !== "build"; }).every(function (id) { return state.done[id]; });
      var stepDone = { context: true, learn: true, "try": tryDone, build: !!state.done.build, reflect: (state.reflect || "").trim().length >= 40, check: all };
      document.querySelectorAll(".steps a").forEach(function (a) { a.classList.toggle("done", !!stepDone[a.getAttribute("data-step")]); });
      var list = $("check-status");
      list.innerHTML = "";
      M.tasks.forEach(function (t) {
        if (t.optional || t.type === "speak" || t.type === "selfcheck") return;
        list.appendChild(html("li", { "class": state.done[t.id] ? "done" : "" }, (state.done[t.id] ? "✓ " : "○ ") + inline(t.title)));
      });
      list.appendChild(html("li", { "class": state.done.build ? "done" : "" }, (state.done.build ? "✓ " : "○ ") + "Build: " + inline(M.build.heading)));
      $("check-locked").hidden = all;
      $("check-open").hidden = !all;
      $("check-card").classList.toggle("unlocked", all);
      // The completion code is stored reversed and encoded so it doesn't appear as plain text in the page.
      $("code-badge").textContent = all ? decode(M.code) : "";
    }
    function decode(c) { try { return atob(c).split("").reverse().join(""); } catch (e) { return ""; } }

    /* ---------- start ---------- */
    function start(mod) {
      M = mod;
      KEY = SETTINGS.key + ":m" + mod.num;
      loadPrefs();
      try {
        var saved = JSON.parse(localStorage.getItem(KEY) || "null");
        if (saved && typeof saved === "object") state = Object.assign(state, saved);
      } catch (e) {}
      state.extra = state.extra || {}; state.done = state.done || {}; state.hints = state.hints || {};
      page();
      refresh();
      if (location.hash) { var target = document.getElementById(location.hash.slice(1)); if (target) target.scrollIntoView(); }
    }

    return { start: start, Text: Text, play: play, settings: SETTINGS, get state() { return state; }, get module() { return M; } };
  })();
})(this);
