module.exports = {
  num: 2, unit: 1, slug: "m02-data-collection", minutes: 40,
  title: "How Data Is Collected and Used",
  subtitle: "Cookies, trackers, data brokers, targeted ads, and what algorithms infer about you",
  lede: "Many of the apps you use every day are free. They still make money, often billions of dollars, by collecting data about you and using it to sell ads. This module shows how that data is collected, where it goes, and what computers can figure out from it.",
  recap: "Last time you learned that metadata can reveal private things, and that your footprint has an active part (what you share) and a passive part (what's collected about you).",
  standards: { csta: ["3A-IC-24", "3A-IC-29"] },
  context: {
    title: "The quiz that reached 87 million people",
    place: "Cambridge, England, and Facebook · 2014–2018",
    text: `In 2014, a university researcher named **Aleksandr Kogan** built a free Facebook app called **"thisisyourdigitallife."** It was a **personality quiz**. About **270,000 people** were paid a few dollars each to take it, and they clicked "allow" to let the app see their Facebook profiles.

But Facebook's rules at the time let apps collect data about users' **friends** too: their likes, birthdays, hometowns and more. So the app quietly gathered information on up to **87 million people**, almost all of whom had **never taken the quiz** or heard of it.

The data went to a political consulting company called **Cambridge Analytica**. It combined the likes and quiz answers to **infer** people's personalities, then used those profiles to decide which political ads to show them. Facebook's rules said app makers couldn't pass data along like that, but no one stopped it.

In **March 2018**, a former employee, **Christopher Wylie**, told reporters what had happened. Facebook's founder had to testify before Congress, Cambridge Analytica shut down, and in 2019 the Federal Trade Commission fined Facebook **$5 billion**, at the time the largest privacy penalty in U.S. history.

Millions of people's data was collected and used because a **friend** took a quiz.`
  },
  learn: [
    {
      title: "If it's free, how does it make money?",
      figure: {
        alt: "Diagram of real-time bidding: you open an app, your profile is sent out, three advertisers bid, and the highest bidder's ad appears.",
        caption: "Real-time bidding: the whole auction happens in **less than a second**, every time you open an app or page.",
        svg: "<svg viewBox=\"0 0 520 176\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><defs><marker id=\"m02a-accent\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerUnits=\"userSpaceOnUse\" markerWidth=\"10\" markerHeight=\"10\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" style=\"fill:var(--accent)\"/></marker><marker id=\"m02a-muted\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerUnits=\"userSpaceOnUse\" markerWidth=\"10\" markerHeight=\"10\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" style=\"fill:var(--muted)\"/></marker></defs><rect class=\"box\" x=\"0\" y=\"64\" width=\"104\" height=\"56\" rx=\"8\"/><text class=\"b\" x=\"52\" y=\"89\" text-anchor=\"middle\">You open</text><text class=\"md\" x=\"52\" y=\"106\" text-anchor=\"middle\">an app</text><line class=\"arrow\" x1=\"108\" y1=\"92\" x2=\"138\" y2=\"92\" marker-end=\"url(#m02a-muted)\"/><rect class=\"box\" x=\"142\" y=\"64\" width=\"104\" height=\"56\" rx=\"8\"/><text class=\"b\" x=\"194\" y=\"89\" text-anchor=\"middle\">Your profile</text><text class=\"md\" x=\"194\" y=\"106\" text-anchor=\"middle\">is sent out</text><line class=\"arrow\" x1=\"250\" y1=\"92\" x2=\"278\" y2=\"92\" marker-end=\"url(#m02a-muted)\"/><text class=\"b\" x=\"355\" y=\"16\" text-anchor=\"middle\">Advertisers bid</text><text class=\"sm\" x=\"355\" y=\"32\" text-anchor=\"middle\">per 1,000 views (example)</text><rect class=\"soft\" x=\"284\" y=\"44\" width=\"142\" height=\"34\" rx=\"6\"/><text class=\"md\" x=\"296\" y=\"66\">Sneaker Co.</text><text class=\"b\" x=\"414\" y=\"66\" text-anchor=\"end\">$2</text><rect class=\"accent\" x=\"284\" y=\"88\" width=\"142\" height=\"34\" rx=\"6\"/><text class=\"md on\" x=\"296\" y=\"110\">Game Studio</text><text class=\"b on\" x=\"414\" y=\"110\" text-anchor=\"end\">$5</text><rect class=\"soft\" x=\"284\" y=\"132\" width=\"142\" height=\"34\" rx=\"6\"/><text class=\"md\" x=\"296\" y=\"154\">Snack Co.</text><text class=\"b\" x=\"414\" y=\"154\" text-anchor=\"end\">$3</text><line class=\"arrow hl\" x1=\"430\" y1=\"105\" x2=\"440\" y2=\"105\" marker-end=\"url(#m02a-accent)\"/><rect class=\"box\" x=\"444\" y=\"70\" width=\"76\" height=\"70\" rx=\"8\"/><text class=\"b\" x=\"482\" y=\"102\" text-anchor=\"middle\">Winning</text><text class=\"md\" x=\"482\" y=\"119\" text-anchor=\"middle\">ad shows</text></svg>"
      },
      text: `Many free apps and websites make most of their money from **targeted advertising**: ads chosen for you based on data about you.

When you open an app, your **profile** (age, location, interests, what you've searched) can be offered to advertisers in an instant **auction**. Advertisers bid to show you their ad, and the winner's ad appears. This is called **real-time bidding**, and it happens billions of times a day.

**The more detailed the profile, the more the ad space is worth.** That gives companies a reason to collect as much data as they can.`,
      after: "You'll hear: *\"If you're not paying for the product, you are the product.\"* It's not true of every free service (some run on donations or paid upgrades), but it explains a lot of the internet."
    },
    {
      title: "The tracking toolkit",
      figure: {
        alt: "Diagram: the same AdCo tracker sits inside a news site, a shoe store and a game site, and sends what you do on each to one AdCo profile of you.",
        caption: "A **third-party tracker** sits inside many different websites, so one company can follow you from site to site.",
        svg: "<svg viewBox=\"0 0 520 214\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><defs><marker id=\"m02b-muted\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerUnits=\"userSpaceOnUse\" markerWidth=\"10\" markerHeight=\"10\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" style=\"fill:var(--muted)\"/></marker></defs><rect class=\"box\" x=\"0\" y=\"4\" width=\"160\" height=\"76\" rx=\"8\"/><text class=\"b\" x=\"80\" y=\"28\" text-anchor=\"middle\">News site</text><rect class=\"accent\" x=\"25\" y=\"44\" width=\"110\" height=\"24\" rx=\"12\"/><text class=\"sm on\" x=\"80\" y=\"61\" text-anchor=\"middle\">AdCo tracker</text><rect class=\"box\" x=\"180\" y=\"4\" width=\"160\" height=\"76\" rx=\"8\"/><text class=\"b\" x=\"260\" y=\"28\" text-anchor=\"middle\">Shoe store</text><rect class=\"accent\" x=\"205\" y=\"44\" width=\"110\" height=\"24\" rx=\"12\"/><text class=\"sm on\" x=\"260\" y=\"61\" text-anchor=\"middle\">AdCo tracker</text><rect class=\"box\" x=\"360\" y=\"4\" width=\"160\" height=\"76\" rx=\"8\"/><text class=\"b\" x=\"440\" y=\"28\" text-anchor=\"middle\">Game site</text><rect class=\"accent\" x=\"385\" y=\"44\" width=\"110\" height=\"24\" rx=\"12\"/><text class=\"sm on\" x=\"440\" y=\"61\" text-anchor=\"middle\">AdCo tracker</text><line class=\"dline\" x1=\"80\" y1=\"70\" x2=\"210\" y2=\"138\" marker-end=\"url(#m02b-muted)\"/><line class=\"dline\" x1=\"260\" y1=\"70\" x2=\"260\" y2=\"138\" marker-end=\"url(#m02b-muted)\"/><line class=\"dline\" x1=\"440\" y1=\"70\" x2=\"310\" y2=\"138\" marker-end=\"url(#m02b-muted)\"/><rect class=\"accentsoft\" x=\"110\" y=\"140\" width=\"300\" height=\"70\" rx=\"8\"/><text class=\"b\" x=\"260\" y=\"166\" text-anchor=\"middle\">AdCo&#x27;s profile of you</text><text class=\"md\" x=\"260\" y=\"190\" text-anchor=\"middle\">sports news · running shoes · racing games</text></svg>"
      },
      table: {
        head: ["Tool", "What it does", "Think of it as…"],
        rows: [
          ["**First-party cookie**", "A small file the site you're visiting saves to remember you (logins, your cart)", "A store's membership card"],
          ["**Third-party cookie**", "Set by a *different* company inside the site, often an advertiser, to follow you across many sites", "A stranger following you from store to store, taking notes"],
          ["**Tracking pixel**", "A tiny invisible image in a webpage or email that reports when it's opened", "A hidden camera that tells the sender \"they opened it at 7:42 p.m.\""],
          ["**Device fingerprinting**", "Identifying your device from details like screen size, fonts, browser version and time zone", "Recognizing someone by their walk and voice, with no name tag"],
          ["**App permissions**", "Access to your camera, microphone, contacts or location", "Giving someone a key to a room in your house"],
          ["**Data broker**", "A company that buys, combines and sells profiles of people", "Someone who buys everyone's notes and sells the combined file"]
        ]
      },
      after: "Many browsers now block third-party cookies, so companies have shifted to other methods like fingerprinting and tracking people who are logged in. **The tools change; the reason for collecting stays the same.**"
    },
    {
      title: "Inference: what the algorithm figures out",
      figure: {
        alt: "Diagram: buying moving boxes, packing tape and a shower curtain goes into a rule, IF all three THEN predict, which outputs the guess: moving soon.",
        caption: "**Inference:** an algorithm turns what you buy into a guess about your life that you never shared.",
        svg: "<svg viewBox=\"0 0 520 176\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><defs><marker id=\"m02c-accent\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerUnits=\"userSpaceOnUse\" markerWidth=\"10\" markerHeight=\"10\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" style=\"fill:var(--accent)\"/></marker><marker id=\"m02c-muted\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerUnits=\"userSpaceOnUse\" markerWidth=\"10\" markerHeight=\"10\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" style=\"fill:var(--muted)\"/></marker></defs><text class=\"b\" x=\"75\" y=\"14\" text-anchor=\"middle\">What you buy</text><rect class=\"soft\" x=\"0\" y=\"26\" width=\"150\" height=\"34\" rx=\"8\"/><text class=\"md\" x=\"75\" y=\"48\" text-anchor=\"middle\">Moving boxes</text><line class=\"arrow\" x1=\"154\" y1=\"43\" x2=\"196\" y2=\"88\" marker-end=\"url(#m02c-muted)\"/><rect class=\"soft\" x=\"0\" y=\"70\" width=\"150\" height=\"34\" rx=\"8\"/><text class=\"md\" x=\"75\" y=\"92\" text-anchor=\"middle\">Packing tape</text><line class=\"arrow\" x1=\"154\" y1=\"87\" x2=\"196\" y2=\"88\" marker-end=\"url(#m02c-muted)\"/><rect class=\"soft\" x=\"0\" y=\"114\" width=\"150\" height=\"34\" rx=\"8\"/><text class=\"md\" x=\"75\" y=\"136\" text-anchor=\"middle\">Shower curtain</text><line class=\"arrow\" x1=\"154\" y1=\"131\" x2=\"196\" y2=\"88\" marker-end=\"url(#m02c-muted)\"/><rect class=\"box\" x=\"200\" y=\"52\" width=\"140\" height=\"72\" rx=\"8\"/><text class=\"mono\" x=\"270\" y=\"85\" text-anchor=\"middle\">IF all three</text><text class=\"mono\" x=\"270\" y=\"102\" text-anchor=\"middle\">THEN predict</text><text class=\"b\" x=\"270\" y=\"44\" text-anchor=\"middle\">The rule</text><line class=\"arrow hl\" x1=\"344\" y1=\"88\" x2=\"378\" y2=\"88\" marker-end=\"url(#m02c-accent)\"/><rect class=\"accent\" x=\"382\" y=\"58\" width=\"138\" height=\"60\" rx=\"8\"/><text class=\"b on\" x=\"451\" y=\"93\" text-anchor=\"middle\">Moving soon</text><text class=\"b\" x=\"451\" y=\"44\" text-anchor=\"middle\">The guess</text><text class=\"sm\" x=\"451\" y=\"140\" text-anchor=\"middle\">You never told the store.</text></svg>"
      },
      text: `An **algorithm** is a step-by-step set of instructions. Companies use algorithms to find **patterns** in data and make **inferences**: conclusions about you that you never shared.

A simple prediction rule might look like this:

> IF a customer suddenly buys moving boxes AND packing tape AND a new shower curtain THEN predict "moving soon"

Researchers have shown how powerful this is. A 2013 study of about 58,000 volunteers found that just their Facebook **likes** could predict their age, gender, personality and political views. (One odd finding: liking **curly fries** was a small sign of high intelligence.) Recommendation feeds work the same way, comparing what you do with what millions of similar people do.

Inferences can be **wrong** (maybe you were buying for someone else). They can be **sensitive**: health, money, religion, relationships. And you usually **can't see or correct** them.`
    }
  ],
  tasks: [
    {
      id: "t1", type: "match", title: "The tracking toolkit",
      pairs: [
        ["third-party cookie", "lets another company follow you across many websites"],
        ["tracking pixel", "an invisible image that reports when you open an email"],
        ["fingerprinting", "identifies your device by its unique settings"],
        ["data broker", "buys, combines and sells profiles of people"],
        ["first-party cookie", "keeps you logged in on the site you're visiting"]
      ]
    },
    {
      id: "t2", type: "sort", title: "Does the app need it?",
      intro: "Does the permission make sense for what the app does?",
      cats: ["Makes sense", "Suspicious"],
      items: [
        ["A map app asking for your location", 0], ["A video chat app asking for your camera", 0], ["A photo editor asking for your photos", 0], ["A voice memo app asking for your microphone", 0],
        ["A flashlight app asking for your contacts", 1], ["A calculator app asking for your location", 1], ["A wallpaper app asking for your microphone", 1], ["A simple puzzle game asking to read your texts", 1]
      ]
    },
    {
      id: "t3", type: "steps", title: "Inside an ad auction",
      intro: "Put the steps of real-time bidding in order. It all happens in less than a second.",
      items: ["You open an app or a webpage", "Your profile is sent to an ad exchange", "Advertisers' computers bid to show you an ad", "The highest bidder wins", "The winning ad appears on your screen"],
      hints: ["The bidding can't start until the advertisers know who's looking."]
    },
    {
      id: "t4", type: "read", title: "Build a prediction rule",
      intro: "You're a data scientist at SnackStream, an online snack store. Your boss wants to show sports-drink ads to athletes.",
      passage: `**Your rule:**

> IF a customer buys protein bars AND sports drinks THEN predict "athlete"

**Five customers:**

- **C1** buys protein bars and sports drinks, and is an athlete.
- **C2** buys chips and energy drinks, and is not an athlete.
- **C3** buys sports drinks and fruit, and is an athlete.
- **C4** buys protein bars, sports drinks, chips and diapers every week for a family of six, and is not an athlete.
- **C5** buys only fruit, and is not an athlete.`,
      questions: [
        { q: "How many of the five customers does the rule get right?", choices: [["3 of 5", true, "Right on C1, C2 and C5. Wrong on C3 (missed) and C4 (wrongly labeled)."], ["5 of 5", false], ["4 of 5", false], ["1 of 5", false]] },
        { q: "Why did the rule label C4 an athlete?", choices: [["C4 buys for a whole family, so the pattern fits even though the inference is wrong", true], ["C4 is secretly an athlete", false], ["The rule is perfect", false], ["C4 never buys sports drinks", false]] },
        { q: "Suppose the label were \"likely to have diabetes\" and it was used to raise someone's insurance price. Why would wrong guesses matter more?", choices: [["Because the inference is about sensitive health information and could cause real harm", true], ["They wouldn't matter at all", false], ["Because diabetes labels are more accurate", false], ["Because insurance companies can't use data", false]] }
      ]
    },
    {
      id: "t5", type: "quiz", title: "What's going on here?",
      questions: [
        { q: "You look at sneakers on one website, and then see ads for the same sneakers on three other sites. What is most likely happening?", choices: [["Third-party trackers or an ad network are following you across sites", true], ["The sneakers are very popular", false], ["Your phone is broken", false], ["The websites are owned by the same person", false]] },
        { q: "A company you've never used sends you mail with your name, age and hobbies. How might it have gotten them?", choices: [["It bought a profile from a data broker", true], ["It guessed randomly", false], ["The post office gave it your hobbies", false], ["That's impossible", false]] },
        { q: "Your video app keeps recommending sad videos after you watched a few. What's the algorithm doing?", choices: [["Showing you more of whatever kept you watching, based on patterns", true], ["Reading your mind", false], ["Choosing at random", false], ["Following a rule set by your teacher", false]] }
      ]
    },
    {
      id: "t6", type: "cloze", title: "Key ideas",
      intro: "Fill in the missing word.",
      items: [
        "Ads chosen for you based on data about you are called [targeted|personalized|personalised] ads.",
        "A company that buys, combines and sells profiles of people is a data [broker].",
        "A conclusion an algorithm draws about you from patterns is an [inference].",
        "The personality quiz app collected data on up to [87|eighty-seven] million Facebook users.",
        "When advertisers compete in an instant auction to show you an ad, it's called real-time [bidding|bid|bids|auction|auctioning]."
      ]
    }
  ],
  build: {
    heading: "A rule for H.E.R.B.I.E.",
    prompt: `In *Fantastic Four: First Steps*, the family has **H.E.R.B.I.E.**, a robot helper that works around their home and helps care for the baby. A helper like that would see and hear everything.

Write **at least 5 sentences** describing the **data rules** you'd want for a home robot or a real smart device (a smart speaker, home camera or baby monitor). Name **two kinds of data** it would collect, one **benefit** of collecting it, one **risk**, and **two rules** about what it can store or share.`,
    model: `A home robot like H.E.R.B.I.E. would collect audio of everything said in the house and video of the baby. One benefit is that it could warn the parents right away if the baby stopped breathing. One risk is that the recordings could be hacked or sold to advertisers. My first rule is that it should delete recordings after 24 hours unless the parents save them. My second rule is that it can never share data with other companies without the family's permission.`,
    placeholder: "A home robot would collect…",
    reqs: [
      { t: "At least 5 sentences", sentences: 5 },
      { t: "Two kinds of data", min: 2, any: ["audio", "video", "voice", "voices", "location", "photos", "images", "recordings", "conversations", "camera", "microphone", "temperature", "sleep", "heart rate", "health", "schedule", "faces", "movements"] },
      { t: "A benefit", any: ["benefit", "helpful", "help", "helps", "safe", "safety", "warn", "useful", "protect", "convenient"] },
      { t: "A risk", any: ["risk", "danger", "dangerous", "hacked", "hack", "leak", "leaked", "sold", "sell", "share", "creepy", "spy", "misused"] },
      { t: "Two rules", min: 2, any: ["rule", "rules", "should", "must", "never", "only", "can't", "cannot", "delete", "permission", "not allowed"] }
    ]
  },
  reflect: {
    q: "Most of the 87 million people never took the quiz. Their data was collected because a friend clicked \"allow.\" Should one person be able to share data about their friends? Where would you draw the line, and why?",
    placeholder: "I think companies should…"
  },
  further: {
    id: "x1", type: "quiz", title: "Challenge: reading the fine print",
    questions: [
      { q: "A 2008 study by Carnegie Mellon researchers estimated how long it would take an average person to read the privacy policy of every website they visit in a year. About how long?", choices: [["About 200 hours, or 76 eight-hour workdays", true], ["About 2 hours", false], ["About 20 minutes", false], ["About 10 years", false]] },
      { q: "Why might a company make its Terms of Service very long and hard to read?", choices: [["Fewer people read them, so fewer people object to how data is used", true], ["The law requires 50 pages", false], ["Short policies are illegal", false], ["To help users understand them", false]] }
    ]
  },
  culture: "🦸 **Film note:** In *Fantastic Four: First Steps*, Reed Richards is a scientist whose lab is full of scanners, monitors and instruments, and the family shares its home with **H.E.R.B.I.E.**, a robot helper. As you watch, notice **who is collecting information about whom**, and whether the person being studied gets a say.",
  teacher: {
    snags: [
      ["Task 3", "Puts \"the highest bidder wins\" before the bidding", "Can someone win before anyone has bid?"],
      ["Task 4", "Counts C3 as correct", "C3 is an athlete. Did the rule predict \"athlete\" for C3? (C3 doesn't buy protein bars.)"],
      ["Context", "Wants to argue about the election", "Keep the focus on how the data was collected and used, not on any candidate or party. The privacy problem is the same whoever buys the ads."]
    ],
    factcheck: "Cambridge Analytica: Aleksandr Kogan's app 'thisisyourdigitallife' (2014); about 270,000 users paid to take the quiz; Facebook's then-current API let apps access friends' data; Facebook later estimated up to 87 million people affected. Reported March 17, 2018 (The Guardian/Observer, New York Times; whistleblower Christopher Wylie). Mark Zuckerberg testified before Congress April 10–11, 2018; Cambridge Analytica shut down May 2018; FTC $5 billion penalty announced July 24, 2019. Kosinski, Stillwell & Graepel, 'Private traits and attributes are predictable from digital records of human behavior,' PNAS, 2013 (58,000 volunteers; 'curly fries'). Real-time bidding happens in milliseconds. McDonald & Cranor, 'The Cost of Reading Privacy Policies' (2008): about 201 hours/year, about 76 eight-hour workdays. Chrome changed its third-party cookie plans several times in 2024–2025; check the current status before teaching."
  }
};
