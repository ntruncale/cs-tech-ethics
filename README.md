# CS Tech Ethics

A self-paced computer science unit for 9th graders on **data, privacy and fairness**: **6 modules**, then a class viewing of ***Fantastic Four: First Steps*** (2025) and a **film-study module** that applies everything to the film's privacy questions. Students work on iPads in the browser and record progress through Blackbaud assessments, the same way as the *Health 9*, *Computer Science – Sophomore Year* and *Español 9* courses.

**Student site:** https://ntruncale.github.io/cs-tech-ethics/ (GitHub Pages, served from the `docs/` folder)

## Modules

| # | Module | Context story |
|---|---|---|
| 1 | **Data and Your Digital Footprint**: data, binary, metadata, active and passive footprints | The Strava heatmap that revealed secret military bases (2018) |
| 2 | **How Data Is Collected and Used**: cookies, trackers, data brokers, ad auctions, inference | The Cambridge Analytica quiz that collected data on 87 million people (2018) |
| 3 | **Protecting Your Data**: passphrases, two-factor login, phishing, the Caesar cipher and encryption | The 17-year-old who hacked Twitter with a phone call (2020) |
| 4 | **Data Bias**: training data, sampling/historical/proxy bias, auditing an algorithm | Robert Williams's wrongful arrest by facial recognition (2020) |
| 5 | **Rights, Laws and Society**: the Fourth Amendment, FERPA, HIPAA, COPPA, state laws, GDPR, safety versus privacy | *Riley v. California*: "get a warrant" (2014) |
| 6 | **Privacy Rights**: the right to be let alone, privacy in context, "nothing to hide," consent, sharenting, the right to be forgotten | Warren and Brandeis's "The Right to Privacy" (1890) |
| 7 | **Film Study: *Fantastic Four: First Steps***: six privacy lenses, their world versus ours | A family the whole world watches |

Each module ends with a 🦸 **film note** that sets up one lens for the film. Modules align with the CSTA K–12 Computer Science Standards (3A-IC-24, 25, 29, 30; 3A-NI-05, 06, 07).

## Folders

| Folder | What's in it | Public? |
|---|---|---|
| `content/` | The lessons: one file per module (`m01.js` … `m07.js`) and the unit list | Yes |
| `docs/` | The student site that GitHub Pages serves | Yes |
| `film/` | Teacher film guide (pause points, discussion, seminar), printable student viewing guide, family letter | Yes |
| `scripts/` | `build.js` (content → site), `teacher.js` + `export_xlsx.py` (teacher files) | Yes |
| `tests/` | A browser test that completes every activity in every module | Yes |
| `teacher-src/` | **Private:** completion codes and Blackbaud quizzes | **No** (git-ignored) |
| `teacher/` | **Private, generated:** answer keys, Blackbaud setups and import files, overview, checklist, blueprint | **No** (git-ignored) |

## Making changes

```bash
node scripts/build.js                 # check every module and rebuild docs/
node scripts/teacher.js && python3 scripts/export_xlsx.py   # rebuild the teacher files
node tests/run.js                     # test every module in a browser (needs Playwright)
```

Then commit and push `docs/` to publish. To turn on the site the first time: repo **Settings → Pages → Deploy from a branch → main → /docs**.
