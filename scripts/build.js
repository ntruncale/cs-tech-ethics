#!/usr/bin/env node
/* Build the student site in docs/ from the module content in content/.

   content/units.js     the units, in order
   content/mNN.js       one file per module (lesson content and practice activities)
   teacher-src/checks.js  completion codes and Blackbaud quizzes (private; not in the public repo)

   Writes:
   docs/index.html, docs/mNN-slug.html (one small page per module), docs/modules/mNN.js (module data),
   build/speech.json (every Spanish phrase that needs an audio clip; scripts/make_audio.py reads it)

   Usage: node scripts/build.js            (build everything)
          node scripts/build.js --check    (validate only)            */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const Text = require(path.join(ROOT, "docs/assets/course.js"));
const CHECK_ONLY = process.argv.includes("--check");

const units = require(path.join(ROOT, "content/units.js"));
let checks = {};
const checksFile = path.join(ROOT, "teacher-src/checks.js");
if (fs.existsSync(checksFile)) checks = require(checksFile);
else console.warn("warning: teacher-src/checks.js not found; completion codes will be blank.");

const files = fs.readdirSync(path.join(ROOT, "content")).filter((f) => /^m\d\d\.js$/.test(f)).sort();
const modules = files.map((f) => require(path.join(ROOT, "content", f)));
const problems = [];
function bad(m, msg) { problems.push(`m${String(m.num).padStart(2, "0")}: ${msg}`); }

/* ---------- validation ---------- */
const TYPES = ["steps", "selfcheck", "mc", "quiz", "listen", "read", "cloze", "select", "conj", "match", "sort", "order", "dictation", "translate", "errors", "accent", "speak"];
function validateChoices(m, where, choices) {
  if (!Array.isArray(choices) || choices.length < 2) return bad(m, `${where}: needs at least 2 choices`);
  const right = choices.filter((c) => c[1]).length;
  if (right !== 1) bad(m, `${where}: has ${right} right answers (needs exactly 1)`);
}
function validateTask(m, t) {
  const where = `task ${t.id} (${t.type})`;
  if (!TYPES.includes(t.type)) return bad(m, `${where}: unknown type`);
  if (!t.title) bad(m, `${where}: no title`);
  const items = t.items || [];
  const need = (cond, msg) => { if (!cond) bad(m, `${where}: ${msg}`); };
  switch (t.type) {
    case "mc": validateChoices(m, where, t.choices); break;
    case "quiz": case "listen": case "read":
      need(t.questions && t.questions.length, "no questions");
      (t.questions || []).forEach((q, i) => validateChoices(m, `${where} q${i + 1}`, q.choices));
      if (t.type === "listen") (t.questions || []).forEach((q, i) => need(q.say, `q${i + 1} has nothing to listen to`));
      break;
    case "cloze": need(items.length, "no items"); items.forEach((it, i) => need(Text.clozeParts(Text.itemText(it)).some((p) => p.answers), `item ${i + 1} has no [blank]`)); break;
    case "select": need(items.length, "no items"); items.forEach((it, i) => {
      const parts = Text.pickParts(Text.itemText(it)).filter((p) => p.options);
      need(parts.length, `item ${i + 1} has no {choice|choice}`);
      parts.forEach((p) => need(p.options.length >= 2, `item ${i + 1} has a choice with one option`));
    }); break;
    case "conj": need(t.verbs && t.verbs.length, "no verbs"); (t.verbs || []).forEach((v) => need(v.forms && v.forms.length === 6, `${v.inf} needs 6 forms (use null to skip)`)); break;
    case "match": need(t.pairs && t.pairs.length >= 3, "needs at least 3 pairs");
      { const L = (t.pairs || []).map((p) => p[0]), Rr = (t.pairs || []).map((p) => p[1]);
        need(new Set(L).size === L.length && new Set(Rr).size === Rr.length, "has duplicate items"); } break;
    case "sort": need(t.cats && t.cats.length >= 2, "needs categories"); items.forEach((it, i) => need(Number.isInteger(it[1]) && it[1] < t.cats.length, `item ${i + 1} has a bad category`)); break;
    case "order": items.forEach((it, i) => { need(it.es && it.en, `item ${i + 1} needs es and en`); need(Text.tokens(it.es).words.length >= 2, `item ${i + 1} is too short`); }); break;
    case "dictation": case "speak": need(items.length, "no items"); break;
    case "translate": items.forEach((it, i) => { need(it.en && it.es, `item ${i + 1} needs en and es`); need(Text.accepted(it.es).length < 400, `item ${i + 1} expands to too many answers`); }); break;
    case "errors": items.forEach((it, i) => {
      const w = Text.errorWords(it.s);
      need(Text.errorIndex(it, w) >= 0, `item ${i + 1}: can't find the wrong word "${it.bad}"`);
      need(it.fix, `item ${i + 1} has no fix`);
    }); break;
    case "steps": need(items.length >= 3, "needs at least 3 steps"); break;
    case "selfcheck": need(items.length, "no items"); break;
    case "accent": items.forEach((it, i) => need(/^[\p{L}]+$/u.test(Text.itemText(it)), `item ${i + 1} should be one word`)); break;
  }
  if (t.pick && t.pick > (t.items || t.questions || t.verbs || t.pairs || []).length) bad(m, `${where}: pick is larger than the list`);
}
function validate(m) {
  ["num", "slug", "title", "unit", "lede", "context", "learn", "tasks", "build", "reflect"].forEach((k) => { if (m[k] == null) bad(m, `missing ${k}`); });
  const ids = new Set();
  (m.tasks || []).forEach((t) => { if (ids.has(t.id)) bad(m, `duplicate task id ${t.id}`); ids.add(t.id); validateTask(m, t); });
  if (m.further && m.further.type) validateTask(m, Object.assign({ id: "x" }, m.further));
  const required = (m.tasks || []).filter((t) => !t.optional && t.type !== "speak" && t.type !== "selfcheck");
  if (required.length < 4) bad(m, `only ${required.length} required activities`);
  if (!m.build.reqs || !m.build.reqs.length) bad(m, "build has no requirements");
  (m.build.reqs || []).forEach((r) => { if (r.re) try { new RegExp(r.re, "giu"); } catch (e) { bad(m, `build regex ${r.re}: ${e.message}`); } });
  const c = checks["m" + String(m.num).padStart(2, "0")];
  if (!c) bad(m, "no entry in teacher-src/checks.js");
  else {
    if (!/^[A-ZÑ]+-\d+$/.test(c.code)) bad(m, `completion code ${c.code} should look like NAME-1234`);
    if (!c.quiz || c.quiz.length !== 5) bad(m, "Blackbaud quiz needs 5 questions");
    (c.quiz || []).forEach((q, i) => { if (!q.choices || !q.choices[q.answer]) bad(m, `quiz q${i + 1}: answer index is wrong`); });
  }
}
modules.forEach(validate);
const nums = modules.map((m) => m.num);
nums.forEach((n, i) => { if (i && n <= nums[i - 1]) problems.push(`module numbers should go up: found ${n} after ${nums[i - 1]}`); });
const TOTAL = 7;
if (modules.length !== TOTAL) console.warn(`note: ${modules.length} of ${TOTAL} modules written so far.`);
const codes = Object.values(checks).map((c) => c.code);
if (new Set(codes).size !== codes.length) problems.push("two modules share a completion code");

/* ---------- speech list ---------- */
const GLOBAL_SPEECH = []; // this course has no audio
const speech = new Map();
function addSpeech(text, where) {
  text = Text.clean(text);
  if (!text) return;
  const h = Text.hash(text);
  if (speech.has(h) && speech.get(h).text !== text) problems.push(`audio name collision: "${text}" and "${speech.get(h).text}"`);
  if (!speech.has(h)) speech.set(h, { h, text, where: [] });
  if (!speech.get(h).where.includes(where)) speech.get(h).where.push(where);
}
GLOBAL_SPEECH.forEach((t) => addSpeech(t, "all"));
modules.forEach((m) => Text.speech(m).forEach((t) => addSpeech(t, "m" + String(m.num).padStart(2, "0"))));
// Phrases a speech engine would misread.

if (problems.length) {
  console.error("Problems found:\n  " + problems.join("\n  "));
  process.exit(1);
}
console.log(`${modules.length} modules OK, ${speech.size} audio phrases.`);
if (CHECK_ONLY) process.exit(0);

/* ---------- write the site ---------- */
const DOCS = path.join(ROOT, "docs");
fs.mkdirSync(path.join(DOCS, "modules"), { recursive: true });
fs.mkdirSync(path.join(ROOT, "build"), { recursive: true });
const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bitter:wght@600..800&family=Source+Sans+3:wght@400..700&display=swap">';
const pageName = (m) => `${m.slug}.html`;
function encode(code) { return Buffer.from(code.split("").reverse().join(""), "utf8").toString("base64"); }
function unitOf(m) { return units[m.unit - 1]; }

modules.forEach((m, i) => {
  const key = "m" + String(m.num).padStart(2, "0");
  const data = Object.assign({}, m, {
    unitTitle: unitOf(m).title,
    code: checks[key] ? encode(checks[key].code) : "",
    total: TOTAL,
    prev: i > 0 ? pageName(modules[i - 1]) : null,
    next: i < modules.length - 1 ? pageName(modules[i + 1]) : null
  });
  delete data.teacher;
  fs.writeFileSync(path.join(DOCS, "modules", key + ".js"), "/* Generated by scripts/build.js from content/" + key + ".js. Edit that file, not this one. */\nCourse.start(" + JSON.stringify(data) + ");\n");
  const title = `M${m.num} · ${Text.plain(m.title)} · ${Text.SETTINGS.course}`;
  fs.writeFileSync(path.join(DOCS, pageName(m)), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${Text.esc(title)}</title>
${FONTS}
<link rel="stylesheet" href="assets/course.css">
</head>
<body>
<div id="app"><noscript><p style="padding:24px">This lesson needs JavaScript. Please turn it on in Safari settings.</p></noscript></div>
<script src="assets/course.js"></script>
<script src="modules/${key}.js"></script>
</body>
</html>
`);
});

/* ---------- index page ---------- */
const reqCount = (m) => m.tasks.filter((t) => !t.optional && t.type !== "speak" && t.type !== "selfcheck").length + 1;
const unitHtml = units.map((u, ui) => {
  const ms = modules.filter((m) => m.unit === ui + 1);
  return `  <section class="unit">
    <h2><span class="un">Unit ${ui + 1}</span> ${Text.esc(u.title)} <span class="en">· ${Text.esc(u.sub)}</span></h2>
    <ol>
${ms.map((m) => `      <li><span class="num">M${m.num}</span><a href="${pageName(m)}">${Text.esc(Text.plain(m.title))}</a><span class="sub">${Text.esc(Text.plain(m.subtitle || ""))}</span><span class="prog" data-m="${m.num}" data-n="${reqCount(m)}"></span></li>`).join("\n")}
    </ol>
  </section>`;
}).join("\n");
fs.writeFileSync(path.join(DOCS, "index.html"), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${Text.SETTINGS.course}</title>
${FONTS}
<link rel="stylesheet" href="assets/course.css">
<style>
/* Layout: one column listing the units in order; each module is a row with its progress on this iPad. */
.hero { display: grid; gap: 14px; }
.brand { display: flex; align-items: center; gap: 16px; }
.brand img { width: 76px; height: 76px; flex: none; background: #fff; border-radius: 50%; }
.school { color: var(--accent); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; font-size: 0.875rem; }
.how { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 16px 18px; display: grid; gap: 8px; }
.how ul { margin: 0; padding-left: 1.2rem; display: grid; gap: 4px; }
.unit { display: grid; gap: 10px; }
.unit h2 { font-size: 1.3rem; }
.unit h2 .un { display: block; font-family: var(--font-body); font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); }
.unit h2 .en { font-family: var(--font-body); font-weight: 500; font-size: 0.95rem; color: var(--muted); }
.unit ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.unit li { display: grid; grid-template-columns: 3rem 1fr auto; grid-template-areas: "n t p" "n s p"; align-items: center; gap: 0 12px; padding: 10px 16px; border-radius: 10px; border: 1px solid var(--line); background: var(--surface); }
.unit li .num { grid-area: n; font-size: 0.85rem; font-weight: 800; color: var(--accent); font-variant-numeric: tabular-nums; }
.unit li a { grid-area: t; color: var(--ink); font-weight: 700; text-decoration: none; }
.unit li a:hover { color: var(--accent); }
.unit li .sub { grid-area: s; color: var(--muted); font-size: 0.85rem; }
.unit li .prog { grid-area: p; font-size: 0.8rem; font-weight: 650; padding: 2px 10px; border-radius: 999px; white-space: nowrap; }
.unit li .prog.started { color: var(--accent); background: var(--accent-soft); }
.unit li .prog.done { color: var(--ok); background: var(--ok-soft); }
</style>
</head>
<body>
<main class="wrap">
  <header class="hero">
    <div class="brand">
      <img src="assets/seal.png" alt="Scranton Preparatory School seal">
      <div>
        <p class="school">Scranton Preparatory School</p>
        <h1>${Text.SETTINGS.course}</h1>
      </div>
    </div>
    <div class="tilestrip" aria-hidden="true"></div>
    <p class="lede">A self-paced computer science unit for freshmen on data, privacy and fairness: ${modules.length - 1} modules, then a film study of <i>Fantastic Four: First Steps</i>. Open the module your teacher assigned in Blackbaud, work through every step, then complete the Blackbaud check.</p>
    <div class="how">
      <h2 style="font-size:1.1rem">How it works</h2>
      <ul>
        <li>Every module has the same <b>7 steps</b>: Context, Learn, Practice, Build, Reflect, Check, Go Further.</li>
        <li>Activities check themselves. If you're stuck, tap <b>Show a hint</b>.</li>
        <li>Some modules have a private <b>self-check</b>. Only you see your answers.</li>
        <li>Watch for the 🦸 <b>film notes</b>. Each module ends with a question to keep in mind when you watch the movie.</li>
        <li>Finish every activity to get the <b>completion code</b> for the Blackbaud check.</li>
      </ul>
    </div>
  </header>
${unitHtml}
  <aside class="helpbox">${Text.SETTINGS.help}</aside>
  <footer><span>Progress shown here is saved in this iPad's browser.</span></footer>
</main>
<script>
// Show each module's progress from this iPad's saved work.
document.querySelectorAll(".prog").forEach(function (p) {
  var n = Number(p.getAttribute("data-n")), s = null;
  try { s = JSON.parse(localStorage.getItem("${Text.SETTINGS.key}:m" + p.getAttribute("data-m")) || "null"); } catch (e) {}
  if (!s || !s.done) return;
  var k = Object.keys(s.done).filter(function (id) { return s.done[id]; }).length;
  if (!k) return;
  k = Math.min(k, n);
  p.textContent = k >= n ? "Done ✓" : k + " of " + n;
  p.className = "prog " + (k >= n ? "done" : "started");
});
</script>
</body>
</html>
`);
fs.writeFileSync(path.join(DOCS, ".nojekyll"), "");

/* ---------- speech list for scripts/make_audio.py ---------- */
fs.writeFileSync(path.join(ROOT, "build/speech.json"), JSON.stringify([...speech.values()], null, 1));
// Everything the teacher scripts need, in one place.
fs.writeFileSync(path.join(ROOT, "build/course.json"), JSON.stringify({ units, modules, checks, pages: modules.map(pageName) }, null, 1));
console.log(`wrote docs/ (${modules.length} module pages), build/speech.json, build/course.json`);
