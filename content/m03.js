module.exports = {
  num: 3, unit: 2, slug: "m03-protecting-data", minutes: 40,
  title: "Protecting Your Data",
  subtitle: "Strong passwords, two-factor login, spotting phishing, and how encryption works",
  lede: "You can't control every bit of data collected about you, but you can control a lot. A few habits, like long passwords, two-factor login, and a healthy suspicion of surprise messages, stop most attacks before they start.",
  recap: "Last time you learned how cookies, trackers and data brokers collect data, and how algorithms infer things you never shared.",
  standards: { csta: ["3A-NI-05", "3A-NI-06", "3A-NI-07"] },
  context: {
    title: "The phone call that hacked Twitter",
    place: "Tampa, Florida · July 15, 2020",
    text: `On the afternoon of **July 15, 2020**, some of the most famous accounts on Twitter started posting the same strange message. Barack Obama, Joe Biden, Bill Gates, Elon Musk and Apple all seemed to say: *send Bitcoin to this address, and I'll send back double.* Before Twitter shut it down, people had sent more than **$100,000**.

The person behind it was **Graham Ivan Clark**, a **17-year-old** from Tampa, working with a few others. He didn't break any code. He used the **phone**. The group called Twitter employees who were working from home, pretended to be from the company's own IT department, and talked them into entering their login details on a fake website. With those, they reached an internal tool that could take over almost any account.

This is called **social engineering**: tricking *people* instead of hacking *computers*. Clark was caught within weeks. In 2021 he pleaded guilty and was sentenced to three years in a juvenile facility followed by probation. Twitter added new protections, including stronger security keys for employees.

If the world's biggest celebrities could be hacked by a phone call, protecting your own accounts starts with knowing the tricks.`
  },
  learn: [
    {
      title: "Passwords: length wins",
      text: `Attackers use computers to guess passwords, trying billions of possibilities. The number of possible passwords grows fast with **length**.`,
      table: {
        head: ["Password type", "Possible passwords"],
        rows: [
          ["4-digit PIN", "10 × 10 × 10 × 10 = **10,000**"],
          ["8 lowercase letters", "26⁸ ≈ **209 billion**"],
          ["12 lowercase letters", "26¹² ≈ **95 quadrillion**"],
          ["4 random words from a 7,776-word list", "7,776⁴ ≈ **3.7 quadrillion**, and each extra word multiplies that by 7,776"]
        ]
      },
      after: `- Use a long **passphrase** of random words (like *purple tiger pancake river*), not a short, clever one (like *Tr0ub!e*).
- **Never reuse** a password. When one site is breached, attackers try the same email and password everywhere. This is called **credential stuffing**.
- A **password manager** remembers a different strong password for every account, so you only have to remember one.`
    },
    {
      title: "Two-factor login and phishing",
      text: `**Multi-factor authentication (MFA)**, also called **two-factor**, means logging in takes two things: something you **know** (a password) plus something you **have** (a code on your phone, an authenticator app or a security key). A stolen password alone isn't enough.

**Phishing** is a fake message that tries to trick you into clicking a link, logging in on a fake site, or sharing a code. Warning signs:

- **Urgency or threats:** *"Your account will be deleted in 1 hour!"*
- A sender address or link that's **slightly off**: *lincoln-hs-support.net* instead of your school's real site
- Requests for your **password or a login code**. Real companies never ask for these.
- Prizes or deals that are **too good to be true**

**Never share a login code with anyone**, even someone who says they're from the company. That's exactly how social engineers get in.

**If an account does get hacked**, work through four stages, in this order. Each one depends on the one before it.

- **1. Get back in:** change the password, using a device you trust.
- **2. Kick the hacker out:** sign out of every other device and session, so the hacker's login stops working.
- **3. Lock the door:** fix the recovery email and phone if the hacker changed them, and turn on two-factor login, so they can't get back in.
- **4. Clean up:** warn friends not to trust strange messages sent from your account. If anyone is threatening you, tell a trusted adult.`
    },
    {
      title: "Encryption: scrambling data",
      text: `**Encryption** scrambles data so only someone with the right **key** can read it.

One of the oldest ciphers is the **Caesar cipher**: shift every letter by a set number. With a shift of 3, A becomes D, B becomes E, and HELLO becomes **KHOOR**. It's easy to break. The alphabet has 26 letters, but a shift of 26 brings every letter back to where it started, so there are only **25** shifts that actually scramble a message. A computer (or a patient person) can try them all in seconds.

Modern encryption uses keys so large that trying them all would take longer than the age of the universe. You use it every day:

- **HTTPS** (the padlock in your browser) encrypts what you send to a website.
- **End-to-end encryption** in some messaging apps means only you and the person you're texting can read the messages, not even the company.

Other habits matter too: install **updates** (they fix security holes), lock your phone, and be careful on **public Wi-Fi**.`
    }
  ],
  tasks: [
    {
      id: "t1", type: "match", title: "Security words",
      pairs: [
        ["phishing", "a fake message that tricks you into giving up information"],
        ["social engineering", "tricking people instead of hacking computers"],
        ["multi-factor authentication", "logging in with a password plus a second thing, like a code"],
        ["encryption", "scrambling data so only someone with the key can read it"],
        ["password manager", "an app that stores a different strong password for each account"],
        ["credential stuffing", "trying stolen passwords from one site on many other sites"]
      ]
    },
    {
      id: "t2", type: "sort", title: "Strong or weak habit?",
      cats: ["Strong habit", "Weak habit"],
      items: [
        ["Using a long passphrase of random words", 0], ["Turning on two-factor login", 0], ["Using a password manager", 0], ["Installing updates when they come out", 0],
        ["Using the same password for every account", 1], ["Using your pet's name and birth year", 1], ["Texting your login code to someone who says they're tech support", 1], ["Writing your password on a sticky note on your laptop", 1]
      ]
    },
    {
      id: "t3", type: "read", title: "Spot the phish",
      passage: `**From:** Lincoln High IT Support &lt;helpdesk@lincoln-hs-support.net&gt;

**Subject:** URGENT: Your school account will be DELETED

Dear Student,

We detected unusual activity on your account. To keep your account, you must verify your password **within 1 hour**. Click here: **http://lincoln-hs-login.co/verify**

You will also receive a 6-digit code by text. Reply to this email with that code to finish verification.

Thank you,<br>IT Department`,
      questions: [
        { q: "Which warning sign of phishing appears in this email?", choices: [["Urgency: delete in 1 hour", true], ["It's addressed to a student", false], ["It has a subject line", false], ["It's signed by a department", false]] },
        { q: "What's suspicious about the sender and the link?", choices: [["They're not the school's real web address, just similar-looking ones", true], ["Nothing; they mention Lincoln High", false], ["The link is too short", false], ["Emails should never have links", false]] },
        { q: "Why does the email ask for your 6-digit code?", choices: [["With your password and your code, the attacker can get past two-factor login", true], ["To help you remember it", false], ["Schools always need your code", false], ["To delete your account faster", false]] },
        { q: "What should you do?", choices: [["Don't click or reply, and report it to the real IT department or a teacher", true], ["Click the link to check if it's real", false], ["Reply with your code only, not your password", false], ["Forward it to friends to warn them", false]] }
      ]
    },
    {
      id: "t4", type: "cloze", title: "Crack the Caesar cipher",
      intro: "Each message was encrypted by shifting every letter 3 places forward (A → D). Shift back 3 to decode it.",
      items: [
        "With a shift of 3, the letter D stands for [A].",
        "KHOOR decodes to [HELLO].",
        "SULYDFB decodes to [PRIVACY].",
        "The alphabet has 26 letters, but a shift of 26 gives back the original message. So a Caesar cipher has only [25|twenty-five|twenty five] shifts that actually scramble a message, which is why it's easy to break."
      ],
      hints: ["Write the alphabet. For each letter in the code, count 3 letters back: K → H, H → E…", "For the last one: a shift of 26 lands every letter back where it started, so it doesn't count."]
    },
    {
      id: "t5", type: "quiz", title: "Password math",
      questions: [
        { q: "How many different 4-digit PINs are there?", choices: [["10,000", true, "10 choices for each of 4 digits: 10 × 10 × 10 × 10."], ["40", false], ["9,999", false], ["1,000", false]] },
        { q: "You add one more lowercase letter to a password. How many times more possibilities are there?", choices: [["26 times more", true, "Each new position can be any of 26 letters."], ["1 more", false], ["2 times more", false], ["It stays the same", false]] },
        { q: "Which password is strongest?", choices: [["correct horse lamp ocean violin", true, "Five random words is very long, so there are far more possibilities to guess."], ["Tr0ub!e", false], ["password123", false], ["Max2011", false]] }
      ]
    },
    {
      id: "t6", type: "steps", title: "If your account is hacked",
      intro: "Put the steps in order, using the four stages from Idea 2.",
      items: ["Change your password, using a device you trust", "Sign out of every other device and session", "Fix the recovery email and phone, and turn on two-factor login", "Warn friends not to trust strange messages from your account"],
      hints: ["The four stages: get back in → kick the hacker out → lock the door → clean up."]
    },
    {
      id: "s1", type: "selfcheck", title: "Security check",
      intro: "Think about your accounts.",
      items: ["My important accounts have different passwords", "My email has two-factor login turned on", "My phone has a passcode", "I install updates when they come out", "I stop and check before clicking links in messages"],
      short: ["Different passwords", "Two-factor on email", "Phone passcode", "Install updates", "Check before clicking"],
      scale: ["not yet", "always"],
      tip: "Start with your email account. Whoever controls your email can reset almost every other password."
    }
  ],
  build: {
    heading: "My security checkup plan",
    prompt: `Write a **security checkup plan** in **at least 5 sentences**. Don't include any real passwords. Explain how you'll make **stronger passwords**, which account you'll protect with **two-factor login** first, one **privacy setting** or **app permission** you'll change, what you'll do with a **suspicious message**, and one more habit (like **updates** or locking your phone).`,
    model: `I will switch to long passphrases made of random words and stop reusing the same password. I'll turn on two-factor login for my email first, because it can reset my other accounts. I'll check my app permissions and turn off location for apps that don't need it. If I get a suspicious message with a link, I won't click it and I'll report it. I'll also install updates on my phone as soon as they come out.`,
    placeholder: "I will…",
    reqs: [
      { t: "At least 5 sentences", sentences: 5 },
      { t: "Stronger passwords", any: ["passphrase", "passphrases", "password manager", "long password", "long passwords", "longer", "random words", "unique", "reusing", "reuse", "different password", "different passwords"] },
      { t: "Two-factor login", any: ["two-factor", "two factor", "2FA", "MFA", "multi-factor", "multifactor", "authenticator", "security key", "login code"] },
      { t: "A privacy setting or permission", any: ["setting", "settings", "permission", "permissions", "private", "location", "privacy"] },
      { t: "Handling a suspicious message", any: ["suspicious", "phishing", "phish", "won't click", "not click", "don't click", "report", "scam", "delete it"] },
      { t: "One more habit", any: ["update", "updates", "lock", "passcode", "public Wi-Fi", "Wi-Fi", "backup", "back up", "log out"] }
    ]
  },
  reflect: {
    q: "Protecting data isn't only about your own accounts. Friends' photos, group chats and shared passwords are in your hands too. *Cura personalis* means caring for the whole person. What would it look like to take care of other people's privacy, not just your own?",
    placeholder: "Taking care of other people's privacy means…"
  },
  further: {
    id: "x1", type: "quiz", title: "Challenge: thinking like a defender",
    questions: [
      { q: "Why is a physical security key (or an authenticator app) safer than a code sent by text message?", choices: [["Attackers can sometimes take over a phone number, and a key can't be phished on a fake site", true], ["Text messages are always encrypted", false], ["Security keys don't need a password", false], ["There's no difference", false]] },
      { q: "A website stores passwords scrambled with a one-way function so that even the company can't read them. What is this called?", choices: [["Hashing", true], ["Phishing", false], ["Caching", false], ["Streaming", false]] }
    ]
  },
  culture: "🦸 **Film note:** In *Fantastic Four: First Steps*, the family's greatest worry is keeping their son, **Franklin**, safe. As you watch, notice **what the family shares with the world and what it tries to protect**, and who gets to make those choices.",
  teacher: {
    snags: [
      ["Task 4", "Shifts forward instead of back", "The message was made by shifting forward. To undo it, which way do you go?"],
      ["Task 5", "Picks Tr0ub!e as strongest", "Count the characters. Which one would take a computer longer to guess every possibility of?"],
      ["Task 6", "Puts two-factor before signing out other devices", "If the hacker is still logged in on their own device, are they out yet? Get back in, kick them out, then lock the door."],
      ["Self-check", "Asks you to check their passwords", "Never ask for or look at a student's passwords. Point them to the steps in the module."]
    ],
    factcheck: "Twitter hack July 15, 2020: 130 accounts targeted, 45 tweeted from; phone spear-phishing of employees (Twitter blog, July 2020; NY DFS report, Oct 2020). Graham Ivan Clark, 17, Tampa; pleaded guilty March 2021; 3 years juvenile facility + 3 years probation. Scam proceeds reported at about $117,000–$120,000 in Bitcoin. Math: 26^8 = 208,827,064,576; 26^12 ≈ 9.54 × 10^16; 7,776^4 ≈ 3.66 × 10^15 (Diceware list = 7,776 words). Caesar cipher: 25 non-trivial shifts."
  }
};
