module.exports = {
  num: 6, unit: 3, slug: "m06-privacy-rights", minutes: 40,
  title: "Privacy Rights",
  subtitle: "The right to be let alone, privacy in context, consent, and kids' privacy",
  lede: "Laws change from country to country, but the idea underneath them is old: people deserve a space where they aren't watched, judged or exposed. This module asks what privacy really is, why it matters even if you have \"nothing to hide,\" and who protects the privacy of people who can't speak for themselves.",
  recap: "Last time you learned that the Fourth Amendment limits government searches, that U.S. privacy laws cover specific kinds of data, and that Europe's GDPR gives people rights over almost all their data.",
  standards: { csta: ["3A-IC-29", "3A-IC-30"] },
  context: {
    title: "The right to be let alone",
    place: "Boston, Massachusetts · 1890",
    text: `In the 1880s, two new technologies were changing American life. **Kodak** cameras were small and cheap enough that anyone could snap a photo of anyone, without asking. And mass-market **newspapers** competed to print gossip about the private lives of well-known families.

Two young Boston lawyers, **Samuel Warren** and **Louis Brandeis**, were alarmed. In December 1890 they published an article in the *Harvard Law Review* called **"The Right to Privacy."** They warned that "instantaneous photographs and newspaper enterprise have invaded the sacred precincts of private and domestic life," and that gadgets threatened to make true the saying that "what is whispered in the closet shall be proclaimed from the house-tops."

Their answer was that the law should protect a **"right to be let alone."** The article became one of the most influential law articles ever written. Brandeis later became a Supreme Court justice and kept arguing that privacy was "the right most valued by civilized men."

More than 130 years later, the gadgets are phones and the newspapers are feeds. The question is the same.`
  },
  learn: [
    {
      title: "Privacy as a human right",
      figure: {
        alt: "Timeline: 1890, Warren and Brandeis describe a right to be let alone. 1948, the Universal Declaration of Human Rights, Article 12. 1989, the Convention on the Rights of the Child, Article 16. 2014, the EU's top court recognizes a right to be forgotten.",
        caption: "In about 130 years, privacy went from one article's idea to a **human right**.",
        svg: "<svg viewBox=\"0 0 520 126\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><line class=\"line\" x1=\"10\" y1=\"62\" x2=\"510\" y2=\"62\"/><circle class=\"accent\" cx=\"66\" cy=\"62\" r=\"8\"/><text class=\"b\" x=\"66\" y=\"36\" text-anchor=\"middle\" style=\"font-size:16px\">1890</text><text class=\"b\" x=\"66\" y=\"92\" text-anchor=\"middle\" style=\"font-size:13px\">Warren &amp; Brandeis</text><text class=\"sm\" x=\"66\" y=\"110\" text-anchor=\"middle\">“right to be let alone”</text><circle class=\"accent\" cx=\"196\" cy=\"62\" r=\"8\"/><text class=\"b\" x=\"196\" y=\"36\" text-anchor=\"middle\" style=\"font-size:16px\">1948</text><text class=\"b\" x=\"196\" y=\"92\" text-anchor=\"middle\" style=\"font-size:13px\">Human Rights</text><text class=\"sm\" x=\"196\" y=\"110\" text-anchor=\"middle\">Declaration, Art. 12</text><circle class=\"accent\" cx=\"326\" cy=\"62\" r=\"8\"/><text class=\"b\" x=\"326\" y=\"36\" text-anchor=\"middle\" style=\"font-size:16px\">1989</text><text class=\"b\" x=\"326\" y=\"92\" text-anchor=\"middle\" style=\"font-size:13px\">Rights of the Child</text><text class=\"sm\" x=\"326\" y=\"110\" text-anchor=\"middle\">Convention, Art. 16</text><circle class=\"accent\" cx=\"456\" cy=\"62\" r=\"8\"/><text class=\"b\" x=\"456\" y=\"36\" text-anchor=\"middle\" style=\"font-size:16px\">2014</text><text class=\"b\" x=\"456\" y=\"92\" text-anchor=\"middle\" style=\"font-size:13px\">EU top court</text><text class=\"sm\" x=\"456\" y=\"110\" text-anchor=\"middle\">right to be forgotten</text></svg>"
      },
      text: `After World War II, the United Nations wrote the **Universal Declaration of Human Rights (1948)**. **Article 12** says:

> No one shall be subjected to arbitrary interference with his privacy, family, home or correspondence, nor to attacks upon his honour and reputation.

The **UN Convention on the Rights of the Child (1989)** gives children the same protection in **Article 16**. Children have privacy rights too, not just adults.

The U.S. Constitution never uses the word "privacy," but courts have found privacy protections in several amendments, including the Fourth.`
    },
    {
      title: "Privacy is about context",
      figure: {
        alt: "Diagram: you tell your doctor your health information, which fits the context. If your doctor passes it to your coach, that is a privacy violation.",
        caption: "**Contextual integrity:** the same information can be fine in one place and a violation in another.",
        svg: "<svg viewBox=\"0 0 520 112\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><defs><marker id=\"m06b-bad\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerUnits=\"userSpaceOnUse\" markerWidth=\"10\" markerHeight=\"10\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" style=\"fill:var(--bad)\"/></marker><marker id=\"m06b-ok\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerUnits=\"userSpaceOnUse\" markerWidth=\"10\" markerHeight=\"10\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" style=\"fill:var(--ok)\"/></marker></defs><rect class=\"box\" x=\"0\" y=\"40\" width=\"130\" height=\"60\" rx=\"8\"/><text class=\"b\" x=\"65\" y=\"67\" text-anchor=\"middle\">You</text><text class=\"sm\" x=\"65\" y=\"84\" text-anchor=\"middle\">your health info</text><rect class=\"okbox\" x=\"195\" y=\"40\" width=\"130\" height=\"60\" rx=\"8\"/><text class=\"b\" x=\"260\" y=\"67\" text-anchor=\"middle\">Your doctor</text><text class=\"sm\" x=\"260\" y=\"84\" text-anchor=\"middle\">needs it to help you</text><rect class=\"badbox\" x=\"390\" y=\"40\" width=\"130\" height=\"60\" rx=\"8\"/><text class=\"b\" x=\"455\" y=\"67\" text-anchor=\"middle\">Your coach</text><text class=\"sm\" x=\"455\" y=\"84\" text-anchor=\"middle\">doesn&#x27;t need it</text><line class=\"okline\" x1=\"134\" y1=\"70\" x2=\"190\" y2=\"70\" marker-end=\"url(#m06b-ok)\"/><line class=\"badline\" x1=\"329\" y1=\"70\" x2=\"385\" y2=\"70\" marker-end=\"url(#m06b-bad)\"/><text class=\"okt\" x=\"162\" y=\"24\" text-anchor=\"middle\" style=\"font-size:13px\">✓ fits</text><text class=\"badt\" x=\"357\" y=\"24\" text-anchor=\"middle\" style=\"font-size:13px\">✗ violation</text></svg>"
      },
      text: `Privacy isn't just about **secrets**. You tell your doctor about your health, and your friends about your crush. That's fine. Privacy is violated when information **flows somewhere it doesn't belong**. Philosopher Helen Nissenbaum calls this **contextual integrity**.`,
      table: {
        head: ["Information", "Appropriate flow", "Violation"],
        rows: [
          ["Your health", "You tell your doctor", "Your doctor tells your coach"],
          ["Your grades", "Your teacher tells your parents", "Your teacher posts them online"],
          ["A photo from a sleepover", "Shared in your friends' group chat", "Posted publicly without asking"],
          ["Your location", "A map app uses it while you navigate", "The app sells it to a data broker"]
        ]
      },
      after: `**"I have nothing to hide."** People often say this. But privacy protects much more than wrongdoing. It gives you room to **make mistakes and grow**, to **think and explore ideas** without being judged, to **stay safe** from stalkers and scammers, and to decide **who you are** before the world decides for you. Everyone closes the bathroom door.`
    },
    {
      title: "Consent, kids and the right to be forgotten",
      figure: {
        alt: "Timeline of a child's life: a birth photo, a first-steps video, the first day of school, a class play and a birthday party are posted by others before the child gets their own account at age 13.",
        caption: "Many kids have a footprint **long before they can consent**: posted by parents, relatives and schools before they're old enough for their own account.",
        svg: "<svg viewBox=\"0 0 520 166\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><line class=\"line\" x1=\"10\" y1=\"80\" x2=\"510\" y2=\"80\"/><line class=\"line\" x1=\"60\" y1=\"54\" x2=\"60\" y2=\"80\"/><rect class=\"soft\" x=\"6\" y=\"14\" width=\"108\" height=\"40\" rx=\"8\"/><text class=\"sm\" x=\"60\" y=\"31\" text-anchor=\"middle\">Birth photo</text><text class=\"sm\" x=\"60\" y=\"48\" text-anchor=\"middle\">age 0</text><circle class=\"muted\" cx=\"60\" cy=\"80\" r=\"6\"/><line class=\"line\" x1=\"122\" y1=\"106\" x2=\"122\" y2=\"80\"/><rect class=\"soft\" x=\"68\" y=\"106\" width=\"108\" height=\"40\" rx=\"8\"/><text class=\"sm\" x=\"122\" y=\"123\" text-anchor=\"middle\">First steps video</text><text class=\"sm\" x=\"122\" y=\"140\" text-anchor=\"middle\">age 2</text><circle class=\"muted\" cx=\"122\" cy=\"80\" r=\"6\"/><line class=\"line\" x1=\"215\" y1=\"54\" x2=\"215\" y2=\"80\"/><rect class=\"soft\" x=\"161\" y=\"14\" width=\"108\" height=\"40\" rx=\"8\"/><text class=\"sm\" x=\"215\" y=\"31\" text-anchor=\"middle\">1st day of school</text><text class=\"sm\" x=\"215\" y=\"48\" text-anchor=\"middle\">age 5</text><circle class=\"muted\" cx=\"215\" cy=\"80\" r=\"6\"/><line class=\"line\" x1=\"308\" y1=\"106\" x2=\"308\" y2=\"80\"/><rect class=\"soft\" x=\"254\" y=\"106\" width=\"108\" height=\"40\" rx=\"8\"/><text class=\"sm\" x=\"308\" y=\"123\" text-anchor=\"middle\">Class play</text><text class=\"sm\" x=\"308\" y=\"140\" text-anchor=\"middle\">age 8</text><circle class=\"muted\" cx=\"308\" cy=\"80\" r=\"6\"/><line class=\"line\" x1=\"401\" y1=\"54\" x2=\"401\" y2=\"80\"/><rect class=\"soft\" x=\"347\" y=\"14\" width=\"108\" height=\"40\" rx=\"8\"/><text class=\"sm\" x=\"401\" y=\"31\" text-anchor=\"middle\">Birthday party</text><text class=\"sm\" x=\"401\" y=\"48\" text-anchor=\"middle\">age 11</text><circle class=\"muted\" cx=\"401\" cy=\"80\" r=\"6\"/><line class=\"line\" x1=\"463\" y1=\"80\" x2=\"463\" y2=\"106\"/><rect class=\"accent\" x=\"409\" y=\"106\" width=\"108\" height=\"40\" rx=\"8\"/><text class=\"b on\" x=\"463\" y=\"123\" text-anchor=\"middle\">Own account</text><text class=\"sm on\" x=\"463\" y=\"140\" text-anchor=\"middle\">age 13</text><circle class=\"accent\" cx=\"463\" cy=\"80\" r=\"8\"/></svg>"
      },
      text: `**Consent** means agreeing freely, knowing what you're agreeing to. It's a key part of privacy rights. But some people **can't consent**, like babies and young children.

**Sharenting** is when parents share photos and stories of their kids online. It usually comes from love. But children grow up with a footprint they didn't choose: baby photos, school names, birthdays and embarrassing moments, sometimes seen by millions.

The **right to be forgotten** is one answer. In **2014**, the EU's top court ruled in a case brought by **Mario Costeja González**, a Spanish man who was tired of a 1998 newspaper notice about his old debts showing up whenever anyone searched his name. The court said people in the EU can ask search engines to remove links to information that is **outdated or irrelevant**. Search engines have since received requests to remove millions of links.

Some ask whether kids should get a right to erase what was posted about them before they were old enough to agree.`
    }
  ],
  tasks: [
    {
      id: "t1", type: "sort", title: "Appropriate flow or violation?",
      intro: "Use contextual integrity: does the information stay where it belongs?",
      cats: ["Appropriate flow", "Privacy violation"],
      items: [
        ["You tell the school nurse you have a peanut allergy", 0], ["Your teacher emails your parents about a missing assignment", 0], ["A friend shares a group photo in your team chat after asking", 0], ["A navigation app uses your location while giving directions", 0],
        ["The nurse tells the whole class about your allergy as a joke", 1], ["A teacher posts students' test scores on social media", 1], ["Someone forwards your private message to a group without asking", 1], ["A weather app sells your location history to advertisers", 1]
      ]
    },
    {
      id: "t2", type: "match", title: "Ideas and where they came from",
      pairs: [
        ["\"the right to be let alone\"", "Warren and Brandeis, 1890"],
        ["Article 12", "the Universal Declaration of Human Rights, 1948"],
        ["children's right to privacy", "the UN Convention on the Rights of the Child, 1989"],
        ["the right to be forgotten", "the EU's top court, 2014"],
        ["contextual integrity", "philosopher Helen Nissenbaum"]
      ]
    },
    {
      id: "t3", type: "read", title: "\"Nothing to hide\"",
      passage: `Maya says: *"I don't care about privacy. I have nothing to hide, so companies can collect whatever they want."*

Her friend Leo replies: *"Do you have curtains? Do you lock the bathroom door? Would you hand a stranger your phone, unlocked, for a week? Privacy isn't about hiding bad things. It's about getting to decide who knows what about you. And the data collected now could be used later in ways you can't predict, by people you'll never meet."*`,
      questions: [
        { q: "What is Leo's main point?", choices: [["Privacy means controlling who knows what about you, not hiding wrongdoing", true], ["Everyone has something illegal to hide", false], ["Curtains are expensive", false], ["Companies never misuse data", false]] },
        { q: "Why does Leo mention data being used \"later\"?", choices: [["Data lasts, and future uses (like a new owner or a leak) can't be predicted when it's collected", true], ["Data expires after a week", false], ["Companies promise to never change", false], ["It doesn't matter when data is used", false]] },
        { q: "Which is another good reason privacy matters, even if you have \"nothing to hide\"?", choices: [["It gives you room to make mistakes and grow without being judged forever", true], ["It makes the internet faster", false], ["It's only for celebrities", false], ["It lets you see other people's data", false]] }
      ]
    },
    {
      id: "t4", type: "quiz", title: "Rights in real life",
      questions: [
        { q: "A parent has posted hundreds of photos of their toddler publicly, with the child's full name and school. What's the main privacy concern?", choices: [["The child can't consent, and will grow up with a public footprint they didn't choose", true], ["The photos use too much storage", false], ["Toddlers don't have privacy rights", false], ["There's no concern if the photos are cute", false]] },
        { q: "A woman in Spain finds that searching her name shows a 15-year-old news story about a minor debt she paid long ago. What can she ask for?", choices: [["That search engines remove the link under the right to be forgotten", true], ["That the newspaper go to jail", false], ["Nothing; the internet is permanent", false], ["That all news about her be banned", false]] },
        { q: "Which shows real consent?", choices: [["A friend clearly says yes after you show them the exact photo and where you'll post it", true], ["A friend doesn't answer, so you post it", false], ["A friend said yes to a different photo last year", false], ["You post it and tell them afterward", false]] }
      ]
    },
    {
      id: "t5", type: "sort", title: "Ask first?",
      intro: "Should you ask the person before you share this?",
      cats: ["Ask first", "Fine to share"],
      items: [
        ["A photo of a friend asleep on the bus", 0], ["A screenshot of a friend's private message", 0], ["A video of your little cousin's tantrum", 0], ["Your friend's new phone number", 0],
        ["Your own drawing", 1], ["A photo of a sunset you took", 1], ["Your own opinion about a movie", 1], ["Your team's public game schedule", 1]
      ]
    },
    {
      id: "t6", type: "cloze", title: "Key ideas",
      intro: "Fill in the missing word.",
      items: [
        "Warren and Brandeis called privacy \"the right to be let [alone].\"",
        "Agreeing freely, knowing what you're agreeing to, is called [consent].",
        "Privacy is violated when information flows into the wrong [context|setting|place].",
        "Parents sharing their children's photos and stories online is called [sharenting].",
        "The right to ask search engines to remove outdated links is the right to be [forgotten]."
      ]
    }
  ],
  build: {
    heading: "A Student Privacy Bill of Rights",
    prompt: `Write a **Privacy Bill of Rights** for students at your school. Write **at least 5 rights**, each as its own sentence starting with **"Every student has the right to…"** Include at least one right about **consent**, one about **deleting** or being **forgotten**, one about **knowing** what data is collected, and one about **photos** or **sharing**.`,
    model: `Every student has the right to know what data school apps collect about them. Every student has the right to give or refuse consent before their photo is posted online. Every student has the right to ask for old posts and data about them to be deleted when they graduate. Every student has the right to private messages that aren't shared without their permission. Every student has the right to make mistakes without having them follow them forever online.`,
    placeholder: "Every student has the right to…",
    reqs: [
      { t: "At least 5 rights", re: "every student has the right to", min: 5 },
      { t: "A right about consent", any: ["consent", "permission", "agree", "ask first", "refuse"] },
      { t: "A right about deleting or being forgotten", any: ["delete", "deleted", "erase", "erased", "remove", "removed", "forgotten"] },
      { t: "A right to know what's collected", any: ["know", "see", "told", "informed", "find out", "access"] },
      { t: "A right about photos or sharing", any: ["photo", "photos", "picture", "pictures", "video", "videos", "share", "shared", "sharing", "posted", "post"] }
    ]
  },
  reflect: {
    q: "Babies and young children can't consent to having their lives shared, so someone else has to protect their privacy for them. Who should speak for the privacy of people who can't speak for themselves, and what responsibilities come with that?",
    placeholder: "I think the people who should protect a child's privacy are…"
  },
  further: {
    id: "x1", type: "quiz", title: "Challenge: privacy then and now",
    questions: [
      { q: "Warren and Brandeis worried about \"instantaneous photographs.\" What's a modern technology that raises the same worry?", choices: [["Facial recognition and phone cameras that can capture and identify anyone, anywhere", true], ["Calculators", false], ["Paper maps", false], ["Printed textbooks", false]] },
      { q: "Why might a right to be forgotten conflict with freedom of the press?", choices: [["Removing links can make true, public information harder to find", true], ["Newspapers don't use the internet", false], ["There's no possible conflict", false], ["Only celebrities can use it", false]] }
    ]
  },
  culture: "🦸 **Film note:** In *Fantastic Four: First Steps*, the most important person in the story is a baby, **Franklin**, who can't speak for himself. As you watch, ask: **who protects Franklin's privacy?** His parents? The public? The scientists? And what would Franklin, at 16, think about how his first days were handled?",
  teacher: {
    snags: [
      ["Task 1", "Calls the navigation app a violation", "Is the location being used for the reason you shared it, or sent somewhere else?"],
      ["Task 5", "Says you can share a friend's number because it's \"just a number\"", "Whose information is it? Would they want strangers to have it?"],
      ["Reflect", "Writes about a family situation", "The prompt is general, but some students may write about their own families. Respond with care, and follow school policy if anything raises concern."]
    ],
    factcheck: "Samuel D. Warren and Louis D. Brandeis, 'The Right to Privacy,' 4 Harvard Law Review 193 (Dec. 15, 1890); quotes are from the article. Brandeis dissent in Olmstead v. United States (1928): 'the right to be let alone—the most comprehensive of rights and the right most valued by civilized men.' UDHR Article 12 (1948); UN CRC Article 16 (1989). Google Spain SL v. AEPD and Mario Costeja González, CJEU, May 13, 2014. Google's transparency report lists millions of URLs requested for delisting. Helen Nissenbaum, 'Privacy in Context' (2010)."
  }
};
