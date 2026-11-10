module.exports = {
  num: 4, unit: 2, slug: "m04-data-bias", minutes: 40,
  title: "Data Bias",
  subtitle: "How unfair data makes unfair algorithms, and how to test for it",
  lede: "We often think computers are neutral because they just do math. But algorithms learn from data, and data comes from people and history. If the data is unbalanced or unfair, the algorithm can be too, and it can be unfair to millions of people at once.",
  recap: "Last time you learned that long passphrases, two-factor login and spotting phishing stop most attacks, and that encryption scrambles data so only the right key can read it.",
  standards: { csta: ["3A-IC-24", "3A-IC-25"] },
  context: {
    title: "Arrested by an algorithm",
    place: "Farmington Hills, Michigan · January 2020",
    text: `In January 2020, **Robert Williams** pulled into his driveway after work. Police were waiting. In front of his wife and two young daughters, officers handcuffed him on his front lawn and took him to jail. He had no idea why.

Detroit police were investigating the theft of watches from a store in 2018. A security camera had captured a blurry image of the thief. Police ran it through **facial recognition software**, which compared it to millions of photos, including driver's licenses. The software suggested Robert Williams.

It was wrong. When detectives showed him the surveillance photo, Williams held it up next to his face. It wasn't him. He was still held for about **30 hours** before being released, and the charges were later dropped.

Williams is believed to be the first person in the United States publicly known to have been wrongfully arrested because of a facial recognition match. Studies had already shown that many facial recognition systems make **more mistakes on darker-skinned faces**. In 2024, Detroit police agreed in a settlement to new rules: they can no longer arrest someone based only on a facial recognition result.`
  },
  learn: [
    {
      title: "Garbage in, garbage out",
      text: `Many modern algorithms use **machine learning**: instead of being given rules, they **learn patterns** from examples called **training data**. A face recognition system learns from millions of photos of faces.

If some groups are **missing or rare** in the training data, the algorithm gets less practice with them and makes more mistakes on them. Programmers call this **garbage in, garbage out**.

In 2018, researchers Joy Buolamwini and Timnit Gebru tested commercial face-analysis tools. Error rates were as low as **0.8%** for lighter-skinned men and as high as **34.7%** for darker-skinned women. In 2019, a large U.S. government study (NIST) found that many algorithms falsely matched Black and Asian faces **10 to 100 times** more often than white faces.`,
      after: "An algorithm can be **very accurate overall** and still fail one group badly. You only find out if you test each group separately."
    },
    {
      title: "Kinds of bias",
      table: {
        head: ["Kind of bias", "What happens", "Real example"],
        rows: [
          ["**Sampling bias**", "The training data doesn't represent everyone the algorithm will be used on", "Face recognition trained mostly on lighter-skinned faces"],
          ["**Historical bias**", "The data reflects unfair patterns from the past, and the algorithm copies them", "Amazon built a résumé-screening tool trained on ten years of mostly male applicants. It learned to downgrade résumés that included the word \"women's.\" Amazon scrapped it."],
          ["**Proxy bias**", "The algorithm measures something that stands in for what you care about, and the stand-in is unfair", "A U.S. hospital algorithm used past **health care spending** as a stand-in for **health needs**. Because less had been spent on Black patients, it underestimated how sick they were."],
          ["**Feedback loop**", "The algorithm's own decisions create new data that makes the bias stronger", "Sending more police to an area finds more crime there, which sends even more police"]
        ]
      }
    },
    {
      title: "Building fairer systems",
      text: `Bias isn't usually on purpose, but the harm is real. People who build and use algorithms can:

- **Check the training data:** who's included, and who's missing?
- **Test each group separately**, not just overall accuracy.
- **Question the stand-ins:** does the thing being measured really mean what we think?
- **Keep a human in the loop** for serious decisions, like arrests, jobs and health care.
- **Give people a way to appeal** a decision and fix wrong data.
- **Include different people on the team** that designs and tests it.

A computer's answer can *feel* objective. Remember Robert Williams: the software's suggestion was treated as if it were evidence.`
    }
  ],
  tasks: [
    {
      id: "t1", type: "match", title: "Bias words",
      pairs: [
        ["training data", "the examples a machine learning algorithm learns from"],
        ["sampling bias", "some groups are missing or rare in the data"],
        ["historical bias", "the data copies unfair patterns from the past"],
        ["proxy", "a stand-in measurement for what you really care about"],
        ["feedback loop", "an algorithm's decisions create data that makes its bias stronger"]
      ]
    },
    {
      id: "t2", type: "sort", title: "Name the bias",
      intro: "Which kind of bias best explains each problem?",
      cats: ["Sampling bias", "Historical bias", "Proxy bias"],
      items: [
        ["A voice assistant trained mostly on American accents misunderstands Scottish speakers", 0],
        ["A skin-condition app trained mostly on photos of light skin misses rashes on dark skin", 0],
        ["A hiring tool trained on past hires, mostly men, prefers male applicants", 1],
        ["A loan algorithm copies decades of lending patterns that turned down certain neighborhoods", 1],
        ["A school uses \"number of library books checked out\" to decide who's a strong reader, missing students who read e-books", 2],
        ["A hospital uses past spending to estimate how sick people are, and underestimates groups that had less access to care", 2]
      ]
    },
    {
      id: "t3", type: "read", title: "Audit the Club Recommender",
      intro: "Lincoln High built an app that recommends whether students should join the robotics club. It learned from the last 10 years of club members, who were about 90% boys. Here's how it did when tested.",
      passage: `<table><thead><tr><th>Group tested</th><th>Students</th><th>Recommendations that were right</th></tr></thead><tbody><tr><td>Boys</td><td>60</td><td>57 (95%)</td></tr><tr><td>Girls</td><td>40</td><td>26 (65%)</td></tr><tr><td><b>Everyone</b></td><td><b>100</b></td><td><b>83 (83%)</b></td></tr></tbody></table>`,
      questions: [
        { q: "The school announces the app is \"83% accurate.\" What does that hide?", choices: [["It's 95% right for boys but only 65% right for girls", true], ["Nothing; 83% is the full story", false], ["It's more accurate for girls", false], ["It was only tested on boys", false]] },
        { q: "What's the most likely cause of the gap?", choices: [["The training data was mostly boys, so the app learned what a \"robotics student\" looks like from them", true], ["Girls aren't interested in robotics", false], ["The app has a typo in its code", false], ["Random chance", false]] },
        { q: "What kind of bias is this mainly?", choices: [["Historical and sampling bias", true], ["Proxy bias only", false], ["No bias", false], ["A feedback loop only", false]] },
        { q: "Which fix makes the most sense?", choices: [["Retrain it with balanced data, test each group separately, and let students join no matter what the app says", true], ["Stop testing it", false], ["Only show the app to boys", false], ["Report only the overall number", false]] }
      ]
    },
    {
      id: "t4", type: "steps", title: "What happened to Robert Williams",
      intro: "Put the events in order.",
      items: ["A security camera records a blurry image of a thief", "Facial recognition software matches the image to Williams's license photo", "Police arrest Williams on his front lawn", "Williams is held for about 30 hours", "The charges are dropped", "Detroit police agree to new rules for facial recognition"],
      hints: ["The theft happened in 2018; the settlement came in 2024."]
    },
    {
      id: "t5", type: "quiz", title: "Is it fair?",
      questions: [
        { q: "A face-unlock feature works for 99% of users overall, but often fails for people with darker skin. What's the best response?", choices: [["Test each group separately and improve the training data before calling it finished", true], ["Ship it, since 99% is great", false], ["Tell those users to change the lighting", false], ["Turn off face unlock for everyone forever", false]] },
        { q: "Why is a computer's answer sometimes trusted too much?", choices: [["People assume math is neutral, even when the data behind it isn't", true], ["Computers are never wrong", false], ["The law says computers are always right", false], ["Algorithms can explain every decision", false]] },
        { q: "Which decision should have a human review it before it's final?", choices: [["Deciding whether to arrest someone", true], ["Suggesting the next song in a playlist", false], ["Choosing which ad to show", false], ["Recommending a video", false]] }
      ]
    },
    {
      id: "t6", type: "cloze", title: "Key ideas",
      intro: "Fill in the missing word.",
      items: [
        "Algorithms that learn patterns from examples use machine [learning].",
        "The examples an algorithm learns from are its [training] data.",
        "If the data is bad, the results are bad: garbage in, garbage [out].",
        "An algorithm can be accurate overall and still fail one [group], so test each separately.",
        "Robert Williams was wrongfully arrested after a facial [recognition] match."
      ]
    }
  ],
  build: {
    heading: "My bias audit",
    prompt: `Choose an algorithm that makes decisions about people, such as a hiring tool, face unlock, a school schedule maker, a video feed or a loan app. Write a **bias audit** in **at least 5 sentences**. Say **what it decides**, which **group might be left out** of its training data, how you'd **test** it fairly, one **fix**, and how people could **appeal** or get a human to review a decision.`,
    model: `I'm auditing a hiring tool that decides which job applicants get an interview. If it learned from past employees who were mostly from one group, people from other groups might be left out of the training data. I would test it by checking its accuracy separately for each group of applicants. One fix would be to retrain it on balanced data and remove stand-ins like zip codes. Applicants who are rejected should be able to appeal and have a human review their application.`,
    placeholder: "I'm auditing…",
    reqs: [
      { t: "At least 5 sentences", sentences: 5 },
      { t: "What it decides", any: ["decides", "decide", "chooses", "choose", "predicts", "predict", "recommends", "recommend", "sorts", "ranks", "picks"] },
      { t: "Who might be left out", any: ["left out", "missing", "underrepresented", "not included", "group", "groups", "fewer"] },
      { t: "How you'd test it", any: ["test", "testing", "check", "checking", "measure", "compare", "accuracy"] },
      { t: "A fix", any: ["fix", "retrain", "balanced", "more data", "diverse", "remove", "improve", "change"] },
      { t: "Appeal or human review", any: ["appeal", "human", "person", "review", "reviewed", "challenge", "correct"] }
    ]
  },
  reflect: {
    q: "Jesuit schools teach that every person has a dignity that can't be reduced to a number. Robert Williams was treated as a match score instead of a person. When should people refuse to let an algorithm make a decision about someone, and why?",
    placeholder: "I think people should refuse when…"
  },
  further: {
    id: "x1", type: "quiz", title: "Challenge: stand-ins everywhere",
    questions: [
      { q: "An algorithm doesn't use race, but it does use zip code. Why can it still be biased?", choices: [["Zip code can act as a proxy for race because of segregated housing patterns", true], ["Zip codes are random", false], ["If race isn't used, bias is impossible", false], ["Zip codes change every year", false]] },
      { q: "What did the 2019 hospital algorithm study recommend?", choices: [["Predict actual health needs instead of past spending, which greatly reduced the bias", true], ["Stop treating patients", false], ["Use zip codes instead", false], ["Spend less on everyone", false]] }
    ]
  },
  culture: "🦸 **Film note:** In *Fantastic Four: First Steps*, the whole world forms opinions about the family, sometimes quickly and with only part of the story. As you watch, notice **when people judge someone from incomplete information**, just like an algorithm trained on incomplete data.",
  teacher: {
    snags: [
      ["Task 2", "Mixes up historical and sampling bias", "Is the problem that a group is missing from the data, or that the data copies something unfair that happened in the past?"],
      ["Task 3", "Picks \"girls aren't interested\"", "Look at who the app learned from. Was that a fair picture of who could succeed?"],
      ["Discussion", "Students share experiences of being misjudged", "Welcome it, but keep the focus on systems, and don't ask anyone to share more than they want."]
    ],
    factcheck: "Robert Williams: arrested January 9, 2020, Farmington Hills, MI; held about 30 hours; Shinola watch theft (2018); ACLU suit; settlement June 2024 barring arrests based solely on facial recognition (ACLU, NYT). Gender Shades: Buolamwini & Gebru, 2018: error up to 34.7% (darker-skinned women) vs 0.8% (lighter-skinned men). NIST FRVT Part 3 (Dec 2019): false positives 10–100× higher for some demographics in many algorithms. Amazon recruiting tool: Reuters, Oct 2018. Hospital algorithm: Obermeyer et al., Science, Oct 2019 (switching the label reduced bias substantially). Note: the CS Sophomore Year course covers Buolamwini more deeply in U5 M2."
  }
};
