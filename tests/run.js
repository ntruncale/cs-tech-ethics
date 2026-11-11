#!/usr/bin/env node
/* Browser test for every module: works through each activity using the module's own answers,
   tries a wrong answer and an accent-mark slip, checks the completion code unlocks and survives a reload,
   that a locked module refuses a wrong unlock code and opens with the right one (and the index unlock box works),
   that every play button has an audio file, that there are no script errors, and that the page
   doesn't scroll sideways on a phone. Screenshots go to tests/.shots/.

   Usage: node scripts/build.js && node tests/run.js [module numbers…]   e.g. node tests/run.js 1 11 */
"use strict";
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const course = JSON.parse(fs.readFileSync(path.join(ROOT, "build/course.json"), "utf8"));
const Text = require(path.join(ROOT, "docs/assets/course.js"));
const SHOTS = path.join(__dirname, ".shots");
fs.mkdirSync(SHOTS, { recursive: true });
const only = process.argv.slice(2).map(Number).filter(Boolean);

function chosenIdx(t, list, vary) {
  const n = list.length;
  if (!t.pick || t.pick >= n) return [...Array(n).keys()];
  return vary["pick:" + t.id];
}

async function solveTask(p, t, vary, log) {
  const card = p.locator("#task-" + t.id);
  const check = card.locator(".row button.primary").first();
  const items = t.items || [];
  switch (t.type) {
    case "mc": {
      const cs = card.locator(".choice");
      for (let c = 0; c < await cs.count(); c++) { await cs.nth(c).click(); if (await cs.nth(c).evaluate((e) => e.classList.contains("right"))) break; }
      return;
    }
    case "quiz": case "listen": case "read": {
      const qs = card.locator(".quiz-q");
      for (let q = 0; q < await qs.count(); q++) {
        const cs = qs.nth(q).locator(".choice");
        for (let c = 0; c < await cs.count(); c++) { await cs.nth(c).click(); if (await cs.nth(c).evaluate((e) => e.classList.contains("right"))) break; }
      }
      return;
    }
    case "cloze": {
      const answers = [];
      chosenIdx(t, items, vary).forEach((i) => Text.clozeParts(Text.itemText(items[i])).forEach((part) => { if (part.answers) answers.push(part.answers[0]); }));
      const inputs = card.locator("input.es-in");
      if (await inputs.count() !== answers.length) log.push(`cloze ${t.id}: ${await inputs.count()} boxes but ${answers.length} answers`);
      // A wrong answer turns red; the right word without its accent marks turns yellow.
      await inputs.nth(0).fill("zzz"); await check.click();
      if (!(await inputs.nth(0).evaluate((e) => e.classList.contains("bad")))) log.push(`cloze ${t.id}: wrong answer not marked`);
      const plainA = Text.strip(answers[0]);
      if (plainA !== answers[0]) { await inputs.nth(0).fill(plainA); await check.click(); if (!(await inputs.nth(0).evaluate((e) => e.classList.contains("near")))) log.push(`cloze ${t.id}: accent slip not marked yellow`); }
      for (let k = 0; k < answers.length; k++) await inputs.nth(k).fill(answers[k]);
      break;
    }
    case "select": {
      const rights = [];
      chosenIdx(t, items, vary).forEach((i) => Text.pickParts(Text.itemText(items[i])).forEach((part) => { if (part.options) rights.push(part.options[0]); }));
      const groups = card.locator(".pick");
      for (let k = 0; k < rights.length; k++) {
        const g = groups.nth(k);
        const bs = g.locator("button");
        for (let b = 0; b < await bs.count(); b++) if ((await bs.nth(b).innerText()).trim() === rights[k]) { await bs.nth(b).click(); break; }
      }
      break;
    }
    case "conj": {
      for (const vi of chosenIdx(t, t.verbs, vary)) {
        const v = t.verbs[vi];
        for (const per of Text.persons()) {
          if (v.forms[per.i] == null) continue;
          const inp = p.locator(`#c-${t.id}-${vi}-${per.i}`);
          if (!(await inp.isDisabled())) await inp.fill(v.forms[per.i]);
        }
      }
      break;
    }
    case "match": {
      const idx = chosenIdx(t, t.pairs, vary);
      for (const i of idx) {
        const [l, r] = t.pairs[i];
        await card.locator(".match .col").nth(0).locator("button", { hasText: Text.plain(l) }).filter({ hasText: new RegExp("^\\s*" + Text.plain(l).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*$") }).first().click();
        await card.locator(".match .col").nth(1).locator("button").filter({ hasText: new RegExp("^\\s*" + Text.plain(r).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*$") }).first().click();
      }
      return;
    }
    case "sort": {
      const rows = card.locator(".sort-row");
      for (let k = 0; k < await rows.count(); k++) {
        const txt = (await rows.nth(k).locator(".sort-text").innerText()).trim();
        const it = items.find((x) => Text.plain(x[0]) === txt);
        if (!it) { log.push(`sort ${t.id}: can't find "${txt}"`); continue; }
        await rows.nth(k).locator(".seg button").nth(it[1]).click();
      }
      break;
    }
    case "order": {
      const boxes = card.locator(".builder");
      const idx = chosenIdx(t, items, vary);
      for (let k = 0; k < idx.length; k++) {
        const it = items[idx[k]];
        const words = Text.tokens(it.es).words.slice();
        if (!it.keepCase) words[0] = words[0].charAt(0).toLowerCase() + words[0].slice(1);
        for (const w of words) {
          const pool = boxes.nth(k).locator(".tiles:not(.answer) .tile");
          const n = await pool.count();
          for (let b = 0; b < n; b++) if ((await pool.nth(b).innerText()).trim() === w) { await pool.nth(b).click(); break; }
        }
      }
      break;
    }
    case "dictation": {
      const inputs = card.locator("input.es-in");
      const idx = chosenIdx(t, items, vary);
      for (let k = 0; k < idx.length; k++) await inputs.nth(k).fill(Text.itemText(items[idx[k]]));
      break;
    }
    case "translate": {
      const inputs = card.locator("input.es-in");
      const idx = chosenIdx(t, items, vary);
      await inputs.nth(0).fill("no sé"); await check.click();
      if (!(await inputs.nth(0).evaluate((e) => e.classList.contains("bad")))) log.push(`translate ${t.id}: wrong answer not marked`);
      for (let k = 0; k < idx.length; k++) { const it = items[idx[k]]; await inputs.nth(k).fill(Text.expand(Array.isArray(it.es) ? it.es[0] : it.es)[0]); }
      break;
    }
    case "errors": {
      const rows = card.locator(".item");
      const idx = chosenIdx(t, items, vary);
      for (let k = 0; k < idx.length; k++) {
        const it = items[idx[k]];
        const w = Text.errorWords(it.s);
        await rows.nth(k).locator(".words button").nth(Text.errorIndex(it, w)).click();
        await rows.nth(k).locator("input.es-in").fill(Array.isArray(it.fix) ? it.fix[0] : it.fix);
      }
      break;
    }
    case "accent": {
      const rows = card.locator(".item");
      const idx = chosenIdx(t, items, vary);
      for (let k = 0; k < idx.length; k++) {
        const chars = Array.from(Text.itemText(items[idx[k]]));
        const at = chars.findIndex((c) => /[áéíóúÁÉÍÓÚ]/.test(c));
        if (at === -1) await rows.nth(k).locator("button.none").click();
        else await rows.nth(k).locator(".letters button").nth(at).click();
      }
      break;
    }
    case "speak": case "selfcheck": return;
    case "steps": {
      for (let k = 0; k < items.length; k++) {
        const want = Text.plain(Text.itemText(items[k]));
        const bank = card.locator(".steplist:not(.chosen) .stepbtn");
        const n = await bank.count();
        for (let b = 0; b < n; b++) if ((await bank.nth(b).innerText()).trim() === want) { await bank.nth(b).click(); break; }
      }
      break;
    }
  }
  await check.click();
}

(async () => {
  const b = await chromium.launch();
  let failures = 0;
  const audioDir = path.join(ROOT, "docs/audio");
  for (const [mi, m] of course.modules.entries()) {
    if (only.length && !only.includes(m.num)) continue;
    const key = "m" + String(m.num).padStart(2, "0");
    const log = [];
    const ctx = await b.newContext({ viewport: { width: 820, height: 1180 } });
    // Count any speech or audio playback: this course should never speak.
    await ctx.addInitScript(() => {
      window.__sounds = 0;
      if (window.speechSynthesis) speechSynthesis.speak = function () { window.__sounds++; };
      HTMLMediaElement.prototype.play = function () { window.__sounds++; return Promise.resolve(); };
    });
    const p = await ctx.newPage();
    const errs = [];
    p.on("pageerror", (e) => errs.push(e.message));
    p.on("console", (msg) => { if (msg.type() === "error" && !/ERR_FILE_NOT_FOUND|net::ERR_FAILED|fonts/.test(msg.text())) errs.push(msg.text()); });
    await p.route("https://fonts.**", (r) => r.abort());
    await p.goto("file://" + path.join(ROOT, "docs", course.pages[mi]));
    // Locked modules: a wrong code is refused; the right one (typed loosely) opens the module.
    const unlock = course.checks[key] && course.checks[key].unlock;
    if (unlock) {
      await p.waitForSelector("#lockbox");
      if (await p.locator("#check-card").count()) log.push("locked module shows content before unlocking");
      await p.fill("#unlock-code", "WRONG-0000"); await p.click("#lockbox button");
      await p.waitForSelector("#unlock-msg.bad", { timeout: 15000 }).catch(() => log.push("wrong unlock code not refused"));
      await p.fill("#unlock-code", unlock.toLowerCase().replace("-", " ")); await p.click("#lockbox button");
    }
    await p.waitForSelector("#check-card", { timeout: 15000 });
    const vary = await p.evaluate(() => (Course.state.extra.vary || {}));

    // Every play button on the page must have a clip in both voices.
    const says = await p.$$eval(".say", (els) => els.map((e) => e.getAttribute("data-t")));
    const missing = [...new Set(says)].filter((t) => !fs.existsSync(path.join(audioDir, "es", Text.hash(t) + ".mp3")) || !fs.existsSync(path.join(audioDir, "la", Text.hash(t) + ".mp3")));
    if (missing.length) log.push(`${missing.length} phrases without audio, e.g. "${missing[0]}"`);

    for (const t of m.tasks) {
      if (t.optional || t.type === "speak" || t.type === "selfcheck") continue;
      try { await solveTask(p, t, vary, log); } catch (e) { log.push(`task ${t.id}: ${e.message.split("\n")[0]}`); }
      const done = await p.evaluate((id) => !!Course.state.done[id], t.id);
      if (!done) log.push(`task ${t.id} (${t.type}) not marked done`);
    }
    const sounds = await p.evaluate(() => window.__sounds);
    if (sounds) log.push(`${sounds} sounds played (speech or audio) while doing the activities`);
    // Build: the model writing must meet its own requirements.
    const model = (m.build.model || "").split(/\n+/).map((l) => Text.plain(l.replace(/\{\{(.+?)\}\}/g, (_, x) => x.split("|")[0]))).join("\n");
    await p.fill("#build-text", model);
    if (!(await p.evaluate(() => !!Course.state.done.build))) {
      const notMet = await p.$$eval("#task-build .status-list li:not(.done)", (els) => els.map((e) => e.textContent));
      log.push("build: model doesn't meet requirements: " + notMet.join(" / "));
    }
    await p.fill("#reflect-draft", "This is a test reflection that is long enough to count as a real draft.");
    const code = (await p.textContent("#code-badge")).trim();
    const want = course.checks[key] && course.checks[key].code;
    if (code !== want) log.push(`completion code shows "${code}", expected "${want}"`);
    await p.screenshot({ path: path.join(SHOTS, key + "-light.png"), fullPage: true });
    await p.reload(); await p.waitForSelector("#check-card");
    const after = (await p.textContent("#code-badge")).trim();
    if (after !== want) log.push("completion code lost after reload");
    // Play one clip to make sure audio loads (courses with audio only).
    const ok = says.length === 0 ? true : await p.evaluate(() => new Promise((res) => {
      const t = document.querySelector(".say").getAttribute("data-t");
      const a = new Audio("audio/es/" + Course.Text.hash(t) + ".mp3");
      a.addEventListener("loadedmetadata", () => res(a.duration > 0.2));
      a.addEventListener("error", () => res(false));
    }));
    if (!ok) log.push("audio clip didn't load");
    await p.emulateMedia({ colorScheme: "dark" });
    await p.screenshot({ path: path.join(SHOTS, key + "-dark.png"), fullPage: false });
    await p.setViewportSize({ width: 375, height: 812 });
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    if (sw > 375) log.push(`page scrolls sideways on a phone (${sw}px)`);
    await p.screenshot({ path: path.join(SHOTS, key + "-phone.png"), fullPage: true });
    if (errs.length) log.push("script errors: " + errs.join(" | "));
    await ctx.close();
    if (log.length) { failures++; console.log(`FAIL ${key} ${m.slug}\n  - ` + log.join("\n  - ")); }
    else console.log(`PASS ${key} ${m.slug} (${code})`);
  }
  // Index page: every locked module shows a lock; a wrong code is refused; a right code unlocks only its module.
  if (!only.length) {
    const log = [];
    const lockedMods = course.modules.filter((m) => course.checks["m" + String(m.num).padStart(2, "0")].unlock);
    const ctx = await b.newContext({ viewport: { width: 820, height: 1180 } });
    const p = await ctx.newPage();
    const errs = [];
    p.on("pageerror", (e) => errs.push(e.message));
    await p.route("https://fonts.**", (r) => r.abort());
    await p.goto("file://" + path.join(ROOT, "docs/index.html"));
    if (await p.locator(".unit li.locked").count() !== lockedMods.length) log.push(`index shows ${await p.locator(".unit li.locked").count()} locked modules, expected ${lockedMods.length}`);
    if (lockedMods.length) {
      await p.fill("#unlock-code", "WRONG-0000"); await p.click("#unlock-form button");
      await p.waitForSelector("#unlock-msg.bad", { timeout: 15000 }).catch(() => log.push("index: wrong code not refused"));
      const m = lockedMods[Math.min(2, lockedMods.length - 1)], key = "m" + String(m.num).padStart(2, "0");
      await p.fill("#unlock-code", course.checks[key].unlock); await p.click("#unlock-form button");
      await p.waitForSelector("#unlock-msg.ok", { timeout: 30000 }).catch(() => log.push("index: right code not accepted"));
      if (await p.locator(".unit li.locked").count() !== lockedMods.length - 1) log.push("index: unlocking didn't unlock exactly one module");
      await p.screenshot({ path: path.join(SHOTS, "index-light.png"), fullPage: true });
      await p.locator("#unlock-msg a").click();
      await p.waitForSelector("#check-card", { timeout: 15000 }).catch(() => log.push("index: unlocked module didn't open without a code"));
    }
    if (errs.length) log.push("script errors: " + errs.join(" | "));
    await ctx.close();
    if (log.length) { failures++; console.log("FAIL index\n  - " + log.join("\n  - ")); }
    else console.log("PASS index (locks and unlock codes)");
  }
  await b.close();
  process.exit(failures ? 1 : 0);
})();
