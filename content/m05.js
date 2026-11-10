module.exports = {
  num: 5, unit: 3, slug: "m05-rights-laws-society", minutes: 40,
  title: "Rights, Laws and Society",
  subtitle: "The Fourth Amendment, U.S. privacy laws, Europe's GDPR, and safety versus privacy",
  lede: "Who makes the rules about your data? In the United States the answer is complicated: a constitutional amendment written in 1791, a patchwork of laws for schools, health and kids, and new state laws. Other countries take a very different approach. This module maps the rules, and the arguments about where they should go next.",
  recap: "Last time you learned that biased training data makes biased algorithms, and that you have to test each group separately to find the problem.",
  standards: { csta: ["3A-IC-24", "3A-IC-30"] },
  context: {
    title: "\"Get a warrant\"",
    place: "San Diego, California, to the U.S. Supreme Court · 2009–2014",
    text: `In August 2009, police in San Diego pulled over **David Riley** for driving with expired registration tags. They found guns in his car and arrested him. Then an officer took Riley's **smartphone** and searched it, without a warrant. Photos and videos on the phone linked Riley to a gang shooting, and he was convicted.

Riley's lawyers argued the search broke the **Fourth Amendment**, which protects people from "unreasonable searches and seizures" by the government. Police had long been allowed to search whatever an arrested person had in their pockets, like a wallet. But was a phone just another pocket item?

On **June 25, 2014**, the Supreme Court decided, **9 to 0**, that it was not. Chief Justice John Roberts wrote that a modern phone holds "the privacies of life": photos, messages, location history and more, far more than any person could carry in their pockets before. His answer to what police must do before searching a phone was simple: **"get a warrant."**

A law written in 1791, long before electricity, now protects the phone in your pocket.`
  },
  learn: [
    {
      title: "The Constitution and your phone",
      text: `The **Fourth Amendment** says the government can't do "unreasonable searches and seizures." Usually that means police need a **warrant**: permission from a judge, based on evidence.

- **Riley v. California (2014):** police generally need a warrant to search your phone.
- **Carpenter v. United States (2018):** police generally need a warrant to get months of your phone's **location records** from your phone company.

The Fourth Amendment limits the **government**. It doesn't stop **companies** from collecting your data. For that, we need other laws.`
    },
    {
      title: "U.S. privacy laws: a patchwork",
      text: `The U.S. doesn't have one big privacy law. Instead it has laws for **specific kinds** of data:`,
      table: {
        head: ["Law", "What it protects"],
        rows: [
          ["**FERPA** (1974)", "**School records.** Parents (and students once they turn 18) can see them, and schools need permission to share most of them."],
          ["**HIPAA** (1996)", "**Health information** held by doctors, hospitals and insurers. It usually does **not** cover fitness apps or smartwatches."],
          ["**COPPA** (1998)", "**Kids under 13** online. Websites and apps aimed at kids need a parent's permission before collecting their personal information. It's why many apps say \"13+.\""],
          ["**State laws**", "California's **CCPA** (2018) gives people the right to know, delete and stop the sale of their data, and a growing number of states have passed similar laws. Illinois's **BIPA** (2008) requires consent before collecting **biometrics** like face scans and fingerprints."]
        ]
      },
      after: "These laws have teeth. In 2019, Google and YouTube paid **$170 million** to settle charges that YouTube collected kids' data without parental consent. In 2022, Epic Games, the maker of *Fortnite*, agreed to pay a **$275 million** penalty for COPPA violations, plus $245 million in refunds for tricking players into purchases."
    },
    {
      title: "Around the world, and the big trade-off",
      text: `In 2018 the European Union's **General Data Protection Regulation (GDPR)** took effect. It treats data protection as a **basic right** and covers almost all personal data. People in the EU can **see** the data companies have about them, **correct** it, and ask for it to be **deleted**. Companies that break the rules can be fined up to **4% of their worldwide yearly revenue**.

Societies also argue about **safety versus privacy**:

- Security cameras and facial recognition can help solve crimes, but they also track innocent people. In 2019, **San Francisco** became the first major U.S. city to ban its government agencies from using facial recognition.
- Many schools use software that scans students' online activity for signs of danger. It may help a student in crisis, but it also watches everything students write.

There's rarely a perfect answer. The question is **who decides, who is watched, and what limits keep power in check**.`
    }
  ],
  tasks: [
    {
      id: "t1", type: "match", title: "Know your laws",
      pairs: [
        ["Fourth Amendment", "limits unreasonable government searches"],
        ["FERPA", "protects student school records"],
        ["HIPAA", "protects health information held by doctors and insurers"],
        ["COPPA", "requires parental consent to collect data from kids under 13"],
        ["GDPR", "the European Union's broad data protection law"],
        ["BIPA", "Illinois law requiring consent to collect face scans and fingerprints"]
      ]
    },
    {
      id: "t2", type: "sort", title: "Which law applies?",
      cats: ["FERPA", "HIPAA", "COPPA"],
      items: [
        ["A school wants to share a student's grades with a local newspaper", 0],
        ["A parent asks to see their child's attendance records", 0],
        ["A hospital wants to share a patient's diagnosis with the patient's employer", 1],
        ["An insurance company keeps records of a customer's prescriptions", 1],
        ["A cartoon game website wants a 9-year-old's email address", 2],
        ["An app aimed at kids collects 11-year-olds' locations", 2]
      ]
    },
    {
      id: "t3", type: "read", title: "Inside Riley v. California",
      passage: `From Chief Justice Roberts's opinion for a unanimous Court (2014):

> Modern cell phones are not just another technological convenience. With all they contain and all they may reveal, they hold for many Americans "the privacies of life." … Our answer to the question of what police must do before searching a cell phone seized incident to an arrest is accordingly simple: get a warrant.

The Court also noted that a phone can hold thousands of photos, months of location data and a person's browsing history: far more than anyone could carry in a wallet.`,
      questions: [
        { q: "What did the Court decide?", choices: [["Police generally need a warrant to search an arrested person's phone", true], ["Police can always search phones", false], ["Phones can never be searched", false], ["Only the FBI can search phones", false]] },
        { q: "Why did the Court treat a phone differently from a wallet?", choices: [["A phone holds a huge amount of private information about a person's whole life", true], ["Phones are more expensive", false], ["Wallets are protected by HIPAA", false], ["Phones are made by companies", false]] },
        { q: "How many justices agreed?", choices: [["All nine", true], ["Five of nine", false], ["Seven of nine", false], ["One", false]] },
        { q: "Which part of the Constitution was this case about?", choices: [["The Fourth Amendment", true], ["The First Amendment", false], ["The Second Amendment", false], ["The Tenth Amendment", false]] }
      ]
    },
    {
      id: "t4", type: "quiz", title: "Does the law protect you here?",
      questions: [
        { q: "Your smartwatch app collects your heart rate and sleep. Does HIPAA usually protect that data?", choices: [["No; HIPAA usually covers doctors, hospitals and insurers, not most fitness apps", true], ["Yes; HIPAA covers all health data", false], ["Only on Sundays", false], ["Only if the watch is expensive", false]] },
        { q: "Why does the Fourth Amendment not stop a social media company from collecting your data?", choices: [["It limits the government, not private companies", true], ["Social media didn't exist in 1791, so it doesn't count", false], ["It only covers houses", false], ["It does stop them", false]] },
        { q: "A teen living in France wants to see all the data a company has about them. Which law gives them that right?", choices: [["GDPR", true], ["FERPA", false], ["HIPAA", false], ["The Fourth Amendment", false]] }
      ]
    },
    {
      id: "t5", type: "sort", title: "A right these laws give you?",
      intro: "Under laws like the GDPR or California's CCPA, which of these is a real right?",
      cats: ["A real right", "Not a right"],
      items: [
        ["See the personal data a company has about you", 0], ["Ask a company to delete your data", 0], ["Correct data about you that's wrong", 0], ["Tell a company not to sell your data", 0],
        ["See your classmate's data", 1], ["Get every app for free", 1], ["Make a company pay you for every ad you see", 1], ["Learn another person's password", 1]
      ]
    },
    {
      id: "t6", type: "cloze", title: "Key ideas",
      intro: "Fill in the missing word or number.",
      items: [
        "In Riley v. California, the Supreme Court told police to get a [warrant].",
        "COPPA protects children under the age of [13|thirteen].",
        "The Fourth Amendment limits the [government], not companies.",
        "Under the GDPR, companies can be fined up to [4|four] percent of their worldwide yearly revenue.",
        "Epic Games paid a penalty for collecting kids' data without their parents' [consent|permission]."
      ]
    }
  ],
  build: {
    heading: "A law I would write",
    prompt: `Write a short **student data privacy law** for your state in **at least 5 sentences**. Give it a **name**, say **who it protects**, name **one right** it gives people, one **rule companies or schools must follow**, what happens to those who **break it**, and one **trade-off** (what might be harder because of your law).`,
    model: `My law is called the Student Data Protection Act. It protects students under 18 who use school apps and websites. It gives every student the right to see and delete the data an app has collected about them. Companies must not sell student data or use it for ads. Companies that break the law would pay a fine for every student affected. One trade-off is that some free apps might start charging schools money.`,
    placeholder: "My law is called…",
    reqs: [
      { t: "At least 5 sentences", sentences: 5 },
      { t: "A name for the law", any: ["Act", "Law", "Bill", "called", "named"] },
      { t: "Who it protects", any: ["protects", "protect", "students", "kids", "children", "teens", "minors", "people", "users"] },
      { t: "A right", any: ["right", "rights", "see", "delete", "correct", "know", "opt out", "access"] },
      { t: "A rule to follow", any: ["must", "must not", "cannot", "can't", "have to", "has to", "required", "not allowed", "need to", "needs to"] },
      { t: "A penalty", any: ["fine", "fined", "fines", "penalty", "pay", "punished", "sued", "banned", "lose"] },
      { t: "A trade-off", any: ["trade-off", "tradeoff", "harder", "downside", "cost", "costs", "might", "but", "however"] }
    ]
  },
  reflect: {
    q: "Catholic teaching talks about the **common good**: the conditions that let everyone in a community thrive. Think about school safety software, security cameras or facial recognition. When should a community accept less privacy for more safety, and when is the cost too high?",
    placeholder: "I think a community should…"
  },
  further: {
    id: "x1", type: "quiz", title: "Challenge: Carpenter v. United States",
    questions: [
      { q: "In Carpenter (2018), police had collected 127 days of a suspect's phone location records from his phone company without a warrant. What did the Court decide?", choices: [["They generally need a warrant for that kind of long-term location data", true], ["No warrant is ever needed for records held by a company", false], ["Phone companies must delete all records", false], ["Location data isn't private", false]] },
      { q: "Why does a long record of your location reveal so much?", choices: [["It shows where you live, worship, see a doctor, and who you spend time with", true], ["It only shows your home address", false], ["Location records are always wrong", false], ["It doesn't reveal anything", false]] }
    ]
  },
  culture: "🦸 **Film note:** In *Fantastic Four: First Steps*, the family faces a choice that affects the **entire planet**. As you watch, think about this: **does the world have a right to know** what the family knows? And who should get a say in a decision that affects everyone?",
  teacher: {
    snags: [
      ["Task 2", "Puts the hospital-employer item under FERPA", "Who holds the information: a school, a doctor or a website?"],
      ["Task 4", "Thinks HIPAA covers all health data", "HIPAA follows who holds the data. Is a fitness app company a doctor or insurer?"],
      ["Build", "Asks whether Pennsylvania already has a law like this", "State laws change fast; let them research it as a Go Further extension, and verify the current status yourself before discussing it."]
    ],
    factcheck: "Riley v. California, 573 U.S. 373 (decided June 25, 2014), 9–0, opinion by Roberts ('privacies of life'; 'get a warrant'). Carpenter v. United States, 585 U.S. 296 (2018), 5–4; 127 days of cell-site records. FERPA 1974; HIPAA 1996; COPPA 1998 (effective 2000), under 13. CCPA signed 2018, effective 2020 (amended by CPRA). Illinois BIPA 2008. FTC v. Google/YouTube, Sept. 2019, $170M. Epic Games, Dec. 2022: $275M COPPA penalty + $245M refunds. GDPR effective May 25, 2018; fines up to €20M or 4% of global annual turnover. San Francisco facial recognition ban, May 2019. The number of states with comprehensive privacy laws changes yearly; check before teaching."
  }
};
