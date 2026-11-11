#!/usr/bin/env node
/* Write the teacher folder (private) from build/course.json. Run scripts/build.js first.

   teacher/course-overview.md       every module: page, completion code, mySPS name, calendar
   teacher/mysps-setup-checklist.md
   teacher/answer-keys/mNN.md       every activity's answers, common snags, fact-check notes
   teacher/mysps/mNN-check.md   the mySPS assessment for each module
   teacher/mysps-import/        all quizzes as CSV (one file and one per module); scripts/export_xlsx.py adds a spreadsheet

   Usage: node scripts/build.js && node scripts/teacher.js && python3 scripts/export_xlsx.py */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const Text = require(path.join(ROOT, "docs/assets/course.js"));
const { units, modules, checks, pages } = JSON.parse(fs.readFileSync(path.join(ROOT, "build/course.json"), "utf8"));
const OUT = path.join(ROOT, "teacher");
const SITE = "https://ntruncale.github.io/cs-tech-ethics/";
for (const d of ["", "answer-keys", "mysps", "mysps-import", "mysps-import/csv"]) fs.mkdirSync(path.join(OUT, d), { recursive: true });

const key = (m) => "m" + String(m.num).padStart(2, "0");
// Markup in module text → Markdown: {{shown|spoken}} → shown, ((clue)) → (clue), HTML tags dropped.
const md = (s) => String(s == null ? "" : s).replace(/\{\{(.+?)\}\}/g, (_, x) => x.split("|")[0]).replace(/\(\((.*?)\)\)/g, "($1)").replace(/<[^>]+>/g, "").replace(/\s*\n\s*\n\s*/g, " ").trim();
const plain = (s) => Text.plain(md(s));
const assessment = (m) => `M${m.num} Check: ${Text.plain(m.title)}`;
const required = (m) => m.tasks.filter((t) => !t.optional && t.type !== "speak" && t.type !== "selfcheck");
const CSTA = {
  "3A-IC-24": "Evaluate the ways computing impacts personal, ethical, social, economic, and cultural practices",
  "3A-IC-25": "Test and refine computational artifacts to reduce bias and equity deficits",
  "3A-IC-29": "Explain the privacy concerns related to the collection and generation of data through automated processes that may not be evident to users",
  "3A-IC-30": "Evaluate the social and economic implications of privacy in the context of safety, law, or ethics",
  "3A-NI-05": "Give examples to illustrate how sensitive data can be affected by malware and other attacks",
  "3A-NI-06": "Recommend security measures to address various types of threats",
  "3A-NI-07": "Compare various security measures, considering tradeoffs between the usability and security of a computing system"
};
const LETTERS = "ABCDEF";

/* ---------- answer keys ---------- */
function chosenNote(t, list) { return t.pick && t.pick < list.length ? ` *(varies: each student gets ${t.pick} of these ${list.length})*` : ""; }
function choicesMd(choices) {
  return choices.map((c) => `- ${c[1] ? "**" + md(c[0]) + "** ✓" : md(c[0])}${c[1] && c[2] ? ` — ${md(c[2])}` : ""}`).join("\n");
}
function taskKey(t) {
  const items = t.items || [];
  const lines = [];
  switch (t.type) {
    case "mc":
      if (t.say) lines.push(`Audio: *${t.say}*`);
      lines.push(md(t.q || ""), choicesMd(t.choices));
      break;
    case "quiz": case "listen": case "read":
      if (t.passage) lines.push("**Passage:** " + md(t.passage));
      (t.questions || []).forEach((q, i) => {
        lines.push(`**${i + 1}.** ${q.say ? `Audio: *${q.say}* · ` : ""}${md(q.q || "What did you hear?")}`);
        lines.push(choicesMd(q.choices));
      });
      break;
    case "cloze":
      lines.push(chosenNote(t, items).trim());
      items.forEach((it, i) => {
        const s = Text.itemText(it);
        const filled = s.replace(/\[([^\]]+)\]/g, (_, a) => { const opts = a.split("|"); return "**" + opts[0] + "**" + (opts.length > 1 ? " (or " + opts.slice(1).join(", ") + ")" : ""); });
        lines.push(`${i + 1}. ${md(filled)}`);
      });
      break;
    case "select":
      items.forEach((it, i) => {
        const s = Text.itemText(it).replace(/\{([^}]+)\}/g, (_, a) => { const o = a.split("|"); return "**" + o[0] + "** ~~" + o.slice(1).join(" / ") + "~~"; });
        lines.push(`${i + 1}. ${md(s)}${it.en ? ` — *${md(it.en)}*` : ""}`);
      });
      break;
    case "conj":
      lines.push(chosenNote(t, t.verbs).trim());
      t.verbs.forEach((v) => {
        lines.push(`**${v.inf}** (${v.en || ""}): ` + Text.persons().filter((p) => v.forms[p.i] != null).map((p) => `${p.label.split(" / ")[0]} *${v.forms[p.i]}*`).join(" · "));
      });
      break;
    case "match":
      lines.push(chosenNote(t, t.pairs).trim());
      t.pairs.forEach((p) => lines.push(`- ${md(p[0])} = ${md(p[1])}`));
      break;
    case "sort":
      lines.push(chosenNote(t, items).trim());
      if (t.passage) lines.push("**Passage:** " + md(t.passage));
      t.cats.forEach((c, ci) => lines.push(`- **${md(c)}:** ` + items.filter((it) => it[1] === ci).map((it) => md(it[0])).join(" · ")));
      break;
    case "order":
      items.forEach((it, i) => lines.push(`${i + 1}. *${md(it.en)}* → **${it.es.replace(/_/g, " ")}**${it.alt ? " (also accepted: " + it.alt.join(" · ") + ")" : ""}${it.extra ? ` · tile that doesn't belong: *${it.extra.join(", ")}*` : ""}`));
      break;
    case "dictation":
      lines.push(chosenNote(t, items).trim());
      items.forEach((it, i) => lines.push(`${i + 1}. ${Text.itemText(it)}`));
      lines.push("Capital letters and punctuation aren't checked; accent marks and ñ are.");
      break;
    case "translate":
      items.forEach((it, i) => {
        const all = Text.accepted(it.es).map((a) => Text.pretty(a));
        lines.push(`${i + 1}. *${md(it.en)}* → **${all[0]}**` + (all.length > 1 ? ` · also accepted: ${all.slice(1, 6).join(" · ")}${all.length > 6 ? ` · and ${all.length - 6} more` : ""}` : ""));
      });
      lines.push("Capital letters and punctuation (including ¿ ¡) aren't checked; accent marks are.");
      break;
    case "errors":
      items.forEach((it, i) => lines.push(`${i + 1}. ${it.s} → wrong word **${Text.errorWords(it.s)[Text.errorIndex(it, Text.errorWords(it.s))].word}**, fix **${[].concat(it.fix).join(" / ")}** → *${Text.fixedSentence(it)}*`));
      break;
    case "accent":
      lines.push(chosenNote(t, items).trim());
      lines.push(items.map((it) => { const w = Text.itemText(it); return /[áéíóú]/i.test(w) ? `**${w}**` : `${w} (no accent)`; }).join(" · "));
      break;
    case "steps":
      items.forEach((it, i) => lines.push(`${i + 1}. ${md(Text.itemText(it))}`));
      lines.push("Each student sees the steps shuffled.");
      break;
    case "selfcheck":
      lines.push("Optional and private: answers stay on the student's iPad and are never sent to mySPS or the teacher. Items: " + items.map((it) => md(it)).join(" · "));
      break;
    case "speak":
      lines.push("Optional; not checked. Students listen, record themselves and compare. " + items.map((it) => `*${Text.itemText(it)}*`).join(" · "));
      break;
  }
  return lines.filter(Boolean).join("\n\n");
}
function reqText(r) {
  const label = md(r.t);
  if (r.any) return `${label} — counts any of: ${r.any.slice(0, 12).join(", ")}${r.any.length > 12 ? ", …" : ""}${r.min > 1 ? ` (needs ${r.min} different)` : ""}`;
  return label;
}

modules.forEach((m, i) => {
  const k = key(m), c = checks[k];
  const out = [];
  out.push(`# M${m.num} ${Text.plain(m.title)}: Teacher answer key`, "");
  out.push(`**${md(m.subtitle)}** · Unit ${m.unit}: ${units[m.unit - 1].title} · about ${m.minutes || 40} minutes`, "");
  out.push(`**Student page:** ${SITE}${pages[i]}`, "");
  if (c.unlock) out.push(`**Unlock code** (give it to students when it's time to start): \`${c.unlock}\``, "");
  out.push(`**Completion code:** \`${c.code}\` · **mySPS assessment:** ${assessment(m)}`, "");
  out.push(`**To finish:** ${required(m).length} activities + the Build writing. The optional self-check and Go Further challenge don't count.`, "");
  if (m.standards) out.push(`**Standards (CSTA K–12 CS, Level 3A):** ${m.standards.csta.map((c) => `${c} (${CSTA[c]})`).join("; ")}`, "");
  if (m.num === 7) out.push("**Film module.** Students read Steps 1–2 before the class viewing and complete Steps 3–6 afterward. See `film/teacher-film-guide.md` for the viewing plan, pause points and discussion questions.", "");
  out.push(`**Context story:** ${md(m.context.title)} (${m.context.place})`, "", "---", "");
  m.tasks.forEach((t, n) => {
    const opt = t.optional || t.type === "speak" || t.type === "selfcheck";
    out.push(`## ${opt ? "Optional" : "Task " + (n + 1)}: ${md(t.title)} *(${t.type})*`, "", taskKey(t), "");
  });
  out.push(`## Build: ${md(m.build.heading)}`, "", md(m.build.prompt), "", "Requirements, checked automatically as the student types:", ...m.build.reqs.map((r) => "- " + reqText(r)), "");
  if (m.build.model) out.push("**Model shown to students:** " + m.build.model.split(/\n+/).map(md).filter(Boolean).join(" "), "");
  out.push("The automatic check looks for the required words and patterns, not for perfect grammar. Skim the pasted writing in mySPS.", "");
  out.push("## Reflect", "", md(m.reflect.q), "");
  if (m.further && m.further.type) out.push(`## Go Further (optional): ${md(m.further.title)}`, "", taskKey(m.further), "");
  if (m.teacher && m.teacher.snags) {
    out.push("## Common snags", "", "| Where | What you'll see | Ask them |", "|---|---|---|");
    m.teacher.snags.forEach((s) => out.push(`| ${s.map(md).join(" | ")} |`));
    out.push("");
  }
  if (m.teacher && m.teacher.factcheck) out.push("## Fact check the Context story", "", md(m.teacher.factcheck), "");
  fs.writeFileSync(path.join(OUT, "answer-keys", k + ".md"), out.join("\n").replace(/\n{3,}/g, "\n\n"));
});

/* ---------- mySPS checks ---------- */
function codeVariants(code) { const lc = code.toLowerCase(); return [code, code.replace("-", ""), lc, lc.replace("-", "")]; }
const csvRows = [];
const COLUMNS = ["Module", "Assessment name", "Question #", "Question type", "Points", "Required", "Question text", "Choice A", "Choice B", "Choice C", "Choice D", "Correct choice", "Correct answer", "Accepted answers", "Note for the teacher"];
modules.forEach((m) => {
  const k = key(m), c = checks[k], name = assessment(m);
  const out = [`# ${name} (mySPS assessment setup)`, "",
    "Same scoring as every module: completion code 5 pts, quiz questions 1 pt each, two required essay questions at 0 pts. Total 10, **pass = 9 or 10**.", "",
    "Suggested settings: no time limit; shuffle answer choices if mySPS offers it; allow retakes but don't show correct answers (or show answers and allow only 1–2 attempts). See `mysps-setup-checklist.md`, Part 3.", "", "---", "",
    "## Question A: Completion code (fill-in-the-blank / short answer, 5 pts)", "",
    `> Enter the completion code shown at the end of the module "${Text.plain(m.title)}."`, "",
    `**Answer:** \`${c.code}\`. If mySPS allows extra accepted answers, also add ${codeVariants(c.code).slice(1).map((v) => "`" + v + "`").join(", ")}.`, "",
    "## Quiz (multiple choice, 1 pt each)", ""];
  const rows = [];
  rows.push([`M${m.num}`, name, "A", "Fill in the blank", 5, "Yes", `Enter the completion code shown at the end of the module "${Text.plain(m.title)}."`, "", "", "", "", "", c.code, codeVariants(c.code).join(" | "), ""]);
  c.quiz.forEach((q, qi) => {
    out.push(`**${qi + 1}. ${q.q}**`);
    q.choices.forEach((ch, ci) => out.push(ci === q.answer ? `- **${LETTERS[ci]}. ${ch}** ✓` : `- ${LETTERS[ci]}. ${ch}`));
    out.push("");
    rows.push([`M${m.num}`, name, qi + 1, "Multiple choice", 1, "Yes", q.q, ...[0, 1, 2, 3].map((x) => q.choices[x] || ""), LETTERS[q.answer], q.choices[q.answer], "", ""]);
  });
  out.push("## Question B: Writing (essay / long answer, 0 pts, required)", "", `> Paste your writing from Step 4, "${md(m.build.heading)}." (In the module, tap "Copy my writing.")`, "",
    "The module already checked the requirements automatically. A quick skim is enough: is it on topic, and is it the student's own? Watch for anything that suggests a student needs support.", "",
    "## Question C: Reflection (essay / long answer, 0 pts, required)", "", `> ${md(m.reflect.q)} (2–4 sentences)`, "");
  rows.push([`M${m.num}`, name, "B", "Essay", 0, "Yes", `Paste your writing from Step 4, "${md(m.build.heading)}."`, "", "", "", "", "", "", "", "Required; 0 points. The module checks the requirements automatically."]);
  rows.push([`M${m.num}`, name, "C", "Essay", 0, "Yes", md(m.reflect.q) + " (2–4 sentences)", "", "", "", "", "", "", "", "Required; 0 points."]);
  fs.writeFileSync(path.join(OUT, "mysps", k + "-check.md"), out.join("\n"));
  writeCsv(path.join(OUT, "mysps-import/csv", k + ".csv"), rows);
  rows.forEach((r) => csvRows.push(r));
});
function csvCell(v) { v = String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
function writeCsv(file, rows) { fs.writeFileSync(file, "﻿" + [COLUMNS].concat(rows).map((r) => r.map(csvCell).join(",")).join("\n") + "\n"); }
writeCsv(path.join(OUT, "mysps-import/all-quizzes.csv"), csvRows);
fs.writeFileSync(path.join(OUT, "mysps-import/README.md"), `# mySPS import files

- \`all-quizzes.csv\` (and \`all-quizzes.xlsx\`, with a sheet per module): every mySPS question for all ${modules.length} modules.
- \`csv/mNN.csv\`: the same questions, one file per module.

Each module has 8 rows: Question A (completion code, 5 pts), five multiple-choice questions (1 pt each), and two required essays (B and C, 0 pts).

These use the same columns as the Computer Science course's files. When you have mySPS's own import template, ask Claude to reformat all ${modules.length} to match it.

The right answers are spread across A, B, C and D (${(() => { const n = [0, 0, 0, 0]; Object.values(checks).forEach((c) => c.quiz.forEach((q) => n[q.answer]++)); return n.map((x, i) => LETTERS[i] + ": " + x).join(", "); })()}).
`);


/* ---------- overview, checklist, blueprint ---------- */
const COURSE = Text.SETTINGS.course;
const rowsOverview = modules.map((m, i) => `| ${m.num} | ${m.unit} | ${Text.plain(m.title)} | [${pages[i]}](${SITE}${pages[i]}) | ${checks[key(m)].unlock ? "`" + checks[key(m)].unlock + "`" : "open"} | \`${checks[key(m)].code}\` | ${assessment(m)} | ${required(m).length + 1} |`);
fs.writeFileSync(path.join(OUT, "course-overview.md"), `# ${COURSE}: Course Overview for the Teacher

All ${modules.length} modules at a glance, with what you need to set up each mySPS assessment. Each module's answer key is in \`answer-keys/\` and its mySPS quiz in \`mysps/\`, named by module (for example \`answer-keys/m03.md\`, \`mysps/m03-check.md\`).

**Student site:** ${SITE}
Each module's link is the site address followed by its page name. For example, M1 is ${SITE}${pages[0]}

**Scoring for every module:** completion code 5 pts + 5 quiz questions at 1 pt each = 10 pts. **Pass = 9 or 10.** Two essay questions (the Build writing and the reflection) are required but worth 0 points.

| # | Unit | Module | Page | Unlock code | Completion code | mySPS assessment name | Items to finish |
|---|---|---|---|---|---|---|---|
${rowsOverview.join("\n")}

"Items to finish" counts the required activities plus the Build writing.

## Unlock codes

Every module is **locked** until a student enters its **unlock code**, which you give out when it's time to start that module (say it, write it on the board, or post it in the mySPS topic). Students enter it in the "Unlock a module" box on the home page, or on the module's own page. Each iPad remembers a code once it works. Codes aren't case-sensitive, and spaces and dashes don't matter. \`unlock-codes.md\` is a one-page sheet of them.

- **How it works:** each module is published *encrypted* with its unlock code. Without the code, the lesson, activities and completion code aren't in the page at all, not even in the page source.
- **What it can't stop:** a student who has a code can share it with a friend. Give codes out in class, when you want everyone to start.
- **Changing a code** (for example, for a new class next year): edit \`unlock\` in \`teacher-src/checks.js\`, rebuild, and push. iPads that used the old code are asked for the new one.
- **Leaving a module open:** delete its \`unlock\` line and rebuild.

## Suggested calendar (about 3 weeks)

Each module takes about 40 minutes, so one module fits one class period. Modules 1–6 lead up to the film; Module 7 is completed after the class viewing.

| When | What |
|---|---|
| Week 1 | M1 Data and Your Digital Footprint · M2 How Data Is Collected and Used · M3 Protecting Your Data |
| Week 2 | M4 Data Bias · M5 Rights, Laws and Society · M6 Privacy Rights |
| Week 3, days 1–2 (or 3) | Class viewing of *Fantastic Four: First Steps* (about 2 hours). Give out the M7 unlock code; students read M7 Steps 1–2 first and take notes with \`film/viewing-guide.md\` |
| Week 3, day 3 | Discussion (see \`film/teacher-film-guide.md\`), then M7 Steps 3–6 |
| Week 3, day 4 | Flex: catch-up and retakes |

If the class meets less often, spread M1–M6 over more weeks. The film works best within a few days of M6.

## How the course works for students

- **Seven steps in every module**, following the Ignatian Pedagogical Paradigm like the CS Sophomore Year, Health 9 and Español 9 courses: 1 Context (a true story), 2 Learn (three short ideas), 3 Practice (6 self-checking activities), 4 Build (a short piece of writing with automatic requirement checks), 5 Reflect, 6 Check (completion code and mySPS), 7 Go Further (optional).
- **Activity types:** matching, sorting, putting steps in order, readings with questions, scenario quizzes, fill-in-the-blank (including decoding a Caesar cipher in M3), and an optional **private self-check** in M1 and M3.
- **Private self-checks** stay on the student's iPad. They are never sent to mySPS or the teacher.
- **Every module ends with a 🦸 film note** that sets up one of the six "lenses" students use in Module 7.
- **No personal data needed.** Activities use fictional people (Jordan, Alex, SnackStream customers). Build prompts tell students to describe categories, not real usernames or passwords.
- **Help on every page:** a box tells students what to do if something online is pressuring or threatening them (save evidence, tell a trusted adult, NCMEC's Take It Down), plus 988 and 911.
- **Different order for students sitting together:** answer choices, matching columns, sorting rows and steps are shuffled for each student.
- **Progress** is saved in each iPad's browser.

## How this fits with CS Sophomore Year

This freshman course comes first. The sophomore study hall course revisits some ideas in more depth (U4 M1 Data and Bias, U4 M2 Cybersecurity, U4 M3 Your Digital Footprint, U5 M2 Train a Classifier). The Context stories here are different from the sophomore ones, so students meet new cases each year.

## The film

See \`film/teacher-film-guide.md\` in the repository (it's public, with no answers in it). It covers ratings and permission, a viewing plan, pause points, discussion questions by lens and a Socratic seminar option. \`film/family-letter.md\` is a letter template for families, and \`film/viewing-guide.md\` is a printable note-taking sheet.

## Fact checking

Every answer key ends with a "Fact check" note listing the claims and sources to verify. Laws and court cases change, especially state privacy laws and browser tracking rules, so please check them before each school year.

## Shared files

- **Lesson content** is in \`content/mNN.js\` (one file per module). \`scripts/build.js\` turns it into the student site in \`docs/\`.
- **The look** (deep navy, cosmic blue and a flare-orange stripe) is set at the top of \`docs/assets/course.css\`; the shared behavior, including the help box text, is in \`docs/assets/course.js\` (the same engine as Health 9). The Scranton Prep seal is reused from the CS course.
- **Private files:** completion codes and mySPS quizzes are in \`teacher-src/\`, and this \`teacher/\` folder is generated from them. Neither belongs in the public repository.
`);

const checklistRows = modules.map((m, i) => `| M${m.num} ${Text.plain(m.title)} | [${pages[i]}](${SITE}${pages[i]}) | ${checks[key(m)].unlock ? "`" + checks[key(m)].unlock + "`" : "open"} | \`${checks[key(m)].code}\` | ☐ | ☐ | ☐ | ☐ | ☐ |`);
fs.writeFileSync(path.join(OUT, "mysps-setup-checklist.md"), `# mySPS Setup Checklist

For the teacher and the mySPS administrator. It follows the same steps as the CS, Health and Spanish courses. With only ${modules.length} modules, plan on about **45 minutes** with question import (about 2 hours by hand).

Menu names differ a little between mySPS versions, so some labels below may not match your screen exactly.

---

## Part 1: Class and grading

- [ ] Add the modules to your existing 9th-grade CS class in mySPS, or ask the administrator for a separate **${COURSE}** section.
- [ ] Decide how the modules count: **Pass/Fail** per module (9–10 points = Pass), like the other self-paced courses, or as points in your gradebook.
- [ ] Confirm topics can **link to an outside website**, and that **question import** is turned on.
- [ ] Use a **test student account** to try everything.

## Part 2: For IT (student iPads)

- [ ] Allow \`ntruncale.github.io\` (the lesson pages)
- [ ] Allow \`fonts.googleapis.com\` and \`fonts.gstatic.com\` (fonts; pages still work without them)
- [ ] Test on one student iPad: open ${SITE}, enter the M1 unlock code, and finish one activity.

## Part 3: Decide the settings (once, for every assessment)

- [ ] **Retakes and answers.** Choose one, not both: allow retakes but don't show correct answers, **or** show answers and allow only 1–2 attempts.
- [ ] **Shuffle answer choices**, if mySPS offers it.
- [ ] **No time limit.**

## Part 4: Build and test M1 first

- [ ] Topic **M1 ${Text.plain(modules[0].title)}** with a one-line instruction and the link ${SITE}${pages[0]}
- [ ] Assessment **${assessment(modules[0])}**: import \`mysps-import/csv/m01.csv\` (or ask Claude to reformat it to mySPS's template).
- [ ] Check: code question 5 pts; 5 multiple-choice at 1 pt; essays B and C required at 0 pts; total 10.
- [ ] **Test as the student account**, including a wrong completion code (which should not pass).

## Part 5: All ${modules.length} modules

For each module: ① topic with link, ② assessment imported, ③ answers and points checked, ④ publish date set, ⑤ link tested as the student account (enter the unlock code first).

Don't put the unlock code in the topic until you want students to start; you can add it to the topic text that day, or just say it in class.

| Module | Page | Unlock | Completion | ① | ② | ③ | ④ | ⑤ |
|---|---|---|---|---|---|---|---|---|
${checklistRows.join("\n")}

## Part 6: Before the film

- [ ] Check the school's policy on showing a **PG-13** film, and send \`film/family-letter.md\` if needed.
- [ ] Confirm you have a legal copy and the screening is allowed for classroom teaching (see the film guide).
- [ ] Preview the film and adjust the pause points in \`film/teacher-film-guide.md\`.
- [ ] Print \`film/viewing-guide.md\` for each student.
`);

const scope = modules.map((m) => `| ${m.num} | ${Text.plain(m.title)} | ${md(m.subtitle)} | ${m.standards.csta.join(", ")} | ${md(m.context.title)} |`);
fs.writeFileSync(path.join(OUT, "blueprint.md"), `# ${COURSE}: Program Blueprint

**Audience:** 9th-grade computer science · **Format:** ${modules.length - 1} self-paced modules on iPads, then a class viewing of *Fantastic Four: First Steps* (2025) and a film-study module · **Length:** about 3 weeks · **Records:** mySPS · **Built from:** the same engine and seven-step template as the Health 9, CS Sophomore Year and Español 9 courses

## Goal

Give freshmen a working understanding of data and privacy: what their digital footprint is, how data is collected and used, how to protect it, how biased data makes unfair algorithms, which laws protect them, and why privacy is a human right. Then apply all of it to a story about a famous family whose newborn becomes the whole world's business.

## Why it fits a Jesuit school

Every module follows the **Ignatian Pedagogical Paradigm**: Context → Experience → Reflection → Action → Evaluation. Reflections connect to the daily Examen, *cura personalis*, human dignity, the common good and Pedro Arrupe's "men and women for others."

## Scope, sequence and standards

Standards are from the **CSTA K–12 Computer Science Standards**, Level 3A (grades 9–10):

${Object.entries(CSTA).map(([k, v]) => `- **${k}:** ${v}`).join("\n")}

| # | Module | Focus | CSTA | Context story |
|---|---|---|---|---|
${scope.join("\n")}

## Every module uses the same template

| Step | IPP stage | What the student does | Time |
|---|---|---|---|
| Last time | — | Reminder of the previous module | 1 min |
| 1. Context | Context | A true story that frames the topic | 3 min |
| 2. Learn | Experience | Three short ideas with tables and examples | 8 min |
| 3. Practice | Experience | 6 self-checking activities (plus an optional private self-check in M1 and M3) | 18 min |
| 4. Build | Action | A short piece of writing: a footprint map, rules for a home robot, a security plan, a bias audit, a law, a bill of rights, a film review | 8 min |
| 5. Reflect | Reflection | One prompt, written so students don't need to share private details | 3 min |
| 6. Check | Evaluation | mySPS: completion code + 5 questions + writing + reflection | 4 min |
| 7. Go Further | — | Optional challenge | — |

**Pass rule:** correct completion code + at least 4/5 on the quiz.

## The film

*Fantastic Four: First Steps* (Marvel Studios, 2025, PG-13, about 2 hours) is set in a 1960s-style world with no internet or smartphones. The family is world-famous, and the story centers on the birth of Reed and Sue's son, Franklin, and how the whole planet reacts. Each module's 🦸 film note sets up one "lens" (footprint, collection, protection, bias, society, rights) that students use while watching and in Module 7.

## Decisions still open

- Whether the modules are pass/fail like the other self-paced courses, or graded in the CS gradebook.
- Whether to run the optional Socratic seminar after the film (see the film guide).
- Hosting: the site is on GitHub Pages under a personal account; it should eventually belong to the school.
`);
const unlockRows = modules.filter((m) => checks[key(m)].unlock).map((m) => `| M${m.num} | ${Text.plain(m.title)} | **\`${checks[key(m)].unlock}\`** | ☐ |`);
fs.writeFileSync(path.join(OUT, "unlock-codes.md"), `# ${COURSE}: Unlock Codes

Give each code to students when it's time to start that module. Students enter it in the **Unlock a module** box at ${SITE} (or on the module's page). Codes aren't case-sensitive, and spaces and dashes don't matter.

| Module | Title | Unlock code | Given out |
|---|---|---|---|
${unlockRows.join("\n")}

Keep this sheet private: anyone with a code can open that module.
`);
console.log(`wrote teacher/: ${modules.length} answer keys, ${modules.length} mySPS checks, ${csvRows.length} quiz rows, overview, checklist, blueprint`);
