export interface SideProject {
  name: string;
  /** Two-letter typographic tile mark, drawn from the name. */
  mark: string;
  what: string;
  why: string;
  stack: string[];
  live: string | null;
  repo: string | null;
  /** A write-up served from /public — the tile links to it when present. */
  paper?: {
    label: string;
    href: string;
    /** Rendered first page, served from /public — becomes the tile image. */
    thumb?: string;
  };
  /** A slide deck — the tile opens it in a lightbox rather than navigating away,
   * or links straight to it when the deck is a PDF with nothing to embed. */
  deck?: {
    label: string;
    /** The deck's own page, offered as an escape hatch from the lightbox — or,
     * with no embed, the file the tile links to. */
    href: string;
    /** The embeddable view. Only requested once the lightbox opens. */
    embed?: string;
    /** Title slide rendered to /public — becomes the tile image. */
    cover: string;
  };
  /** A live site — the tile frames the page itself. */
  site?: {
    /** The page to frame, and where the tile links. */
    href: string;
    /** Names the destination, the way `paper.label` does. */
    label: string;
    /** Described for screen readers, since the frame is a picture of a page. */
    alt: string;
  };
  /** A logo served from /public — stands in the tile for a project with no
   * paper, deck, site, or clip of its own. */
  logo?: {
    src: string;
    /** Described for screen readers, since the tile is otherwise wordless. */
    alt: string;
  };
  /** A silent clip served from /public — loops in the tile when present. */
  clip?: {
    src: string;
    /** First frame held before the clip plays, and the whole tile under
     * prefers-reduced-motion. */
    poster: string;
    /** Described for screen readers, since the clip itself carries no words. */
    alt: string;
  };
}

export const sideProjects: SideProject[] = [
  {
    name: "Memory-as-Action",
    mark: "MA",
    what: "A five-stage pipeline — memory bank construction, retrieval, expert annotation, SFT warm-start, then GRPO — that distills a 32B teacher into a 7B model which learns to reach for medical textbook entries while answering USMLE questions.",
    why: "Retrieval normally gets bolted on as a fixed step that always fires. Here it is an action the model chooses, so the interesting question becomes when a small model decides it needs to look something up. Ablated against self-consistency voting, cloze scoring, and DAgger distillation.",
    stack: ["RAG", "SFT", "GRPO", "Model distillation", "Medical QA"],
    live: null,
    repo: null,
    paper: {
      label: "Memory as an Action Space (PDF)",
      href: "/memory-as-action-cs224r.pdf",
      thumb: "/memory-as-action-page1.jpg",
    },
  },
  {
    name: "Memory Distillation",
    mark: "MD",
    what: "Trains small language models to know when to distrust their own retrieved memory, using supervised fine-tuning and curriculum learning over teacher-generated distillations of a retrieval corpus.",
    why: "The best curriculum moved ProtocolQA 31 points and LitQA2 5 points over the 7B zero-shot baseline on LAB-Bench. It also has a limit worth stating out loud: targeted surface-form attacks defeat both similarity-based and semantic write-gate defenses, because they exploit the exact signal retrieval depends on.",
    stack: ["SFT", "Curriculum learning", "LAB-Bench", "Adversarial robustness"],
    live: null,
    repo: null,
    paper: {
      label: "Small Models Think Big (PDF)",
      href: "/memory-distillation-cs224n.pdf",
      thumb: "/memory-distillation-page1.jpg",
    },
  },
  {
    name: "Biomarkers from Slides",
    mark: "BP",
    what: "Asks whether attention-based multiple-instance learning can read ER, PR, and HER2 status off H&E-stained whole-slide images — the cheap stain every case already gets — instead of the assays that gate cancer treatment eligibility.",
    why: "Benchmarked three patch encoders (ResNet-50, UNI, CONCH) against three aggregation strategies, including a proposed Tumor-Aware CLAM with residual gating. Patient-level 5-fold cross-validation with bootstrap confidence intervals returned the unglamorous answer: dataset size is the binding constraint, not the architecture.",
    stack: ["Attention MIL", "CLAM", "UNI", "CONCH", "Digital pathology"],
    live: null,
    repo: null,
    paper: {
      label: "Predicting Breast Cancer Biomarkers from H&E (PDF)",
      href: "/biomarkers-from-slides-cs231n.pdf",
      thumb: "/biomarkers-from-slides-page1.jpg",
    },
  },
  {
    name: "Exploding Kittens Agents",
    mark: "EK",
    what: "A full-fidelity simulation of the card game — roughly 100,000 hashed states, no simplifying assumptions — and three agents competing inside it: MLE with value iteration, Q-Learning with temporal-difference updates, and a Bayesian agent doing Dirichlet-Beta inference over deck composition.",
    why: "Q-Learning led at a 7.4% win rate over 500 games and 27% in all-agent tournaments, against a 25% random baseline. The better result is the explanation for that ceiling: the game's ~9% per-turn draw risk caps how much advantage any policy can extract. There is a site where you can play all three.",
    stack: ["Q-Learning", "Value iteration", "Bayesian inference", "Python"],
    /** TODO: Summer to supply the deployed URL for the play-against-the-agents site. */
    live: null,
    repo: null,
    paper: {
      label: "AI Agents Learn to Play Exploding Kittens (PDF)",
      href: "/exploding-kittens-cs238.pdf",
      thumb: "/exploding-kittens-page1.jpg",
    },
  },
  {
    name: "AutonomyAid",
    mark: "AA",
    what: "A web-based platform that helps older adults document and enforce their own end-of-life care decisions. Roughly 58 million Americans are over 65, and a large share reach the final stage of life without an advance directive or healthcare power of attorney — a documentation gap that transfers authority from the patient to surrogates, courts, and ethics committees.",
    why: "I designed AutonomyAid to close it by combining three things usually kept separate: scheduled execution of DNRs and advance directives with automatic upload to the patient's electronic health record, free customizable legal templates, and plain-language ethical education built around real cases. I deliberately built for the browser rather than mobile, since much of this population has computer access but no smartphone, and since arthritis and degenerative vision conditions make small touch targets a genuine barrier. The platform also layers in podcasts, a book club, and games — a response to the documented link between social isolation and cognitive decline, and the mechanism that turns a one-time paperwork task into a reason to return.",
    stack: [
      "Web app",
      "Accessibility",
      "EHR integration",
      "Advance care planning",
      "Medical ethics",
    ],
    live: null,
    repo: null,
    paper: {
      label: "Restoring Decision-Making Autonomy in End-of-Life Care (PDF)",
      href: "/autonomyaid.pdf",
      thumb: "/autonomyaid-page1.jpg",
    },
  },
  {
    name: "HipTracks",
    mark: "HT",
    what: "An iOS app that watches hip and knee replacement patients recover, pairing Apple Watch biometrics with a convolutional classifier that reads wound photographs and predicts surgical site infection risk.",
    why: "Infections after joint replacement get caught at the follow-up appointment, which is often days later than the wound and the vitals first drift. Led the front end in Swift and wired the backend through CardinalKit and Apple HealthKit. Built at health{hacks} and kept going after.",
    stack: ["Swift", "CNN", "Transfer learning", "CardinalKit", "HealthKit"],
    live: null,
    repo: null,
    deck: {
      label: "HipTracks slide deck",
      href: "https://docs.google.com/presentation/d/1OLkFK-Cn6qybLkbf03aS-T2s-viq9hBNgNWC3rOWqIg/view",
      embed:
        "https://docs.google.com/presentation/d/1OLkFK-Cn6qybLkbf03aS-T2s-viq9hBNgNWC3rOWqIg/embed?start=false&loop=false&delayms=5000",
      cover: "/hiptracks-deck-cover.jpg",
    },
  },
  {
    name: "NeuroTrack",
    mark: "NT",
    what: "A hardware-plus-software system that helps neurologists track disease progression through repeated reaction-time measurement. Neurological conditions affect more than one in three people worldwide and are the leading cause of illness and disability, but Parkinson's in particular is held back by the absence of early-detection methods and any practical way to monitor progression or therapeutic response between visits.",
    why: "Our team built an Arduino Giga R1 rig — two buttons, two LEDs — that runs a ten-trial reaction sequence and captures both press latency and button hold duration, then feeds those measurements into a web platform where clinicians manage a patient roster, run tests, and view longitudinal charts plotting each patient against healthy and Parkinson's baselines. I worked on the classification layer, where we compared a Naive Bayes model against a RandomForest classifier trained on reaction-time results alongside medical history, lab results, and reported symptoms; the RandomForest handled non-linear feature relationships better and did not require the independence assumption, and we reached 86% accuracy. The system targets a $145M U.S. market driven largely by redundant post-operative visits that better longitudinal data would prevent.",
    stack: ["Arduino", "Naive Bayes", "Random forest", "Web app", "Parkinson's disease"],
    live: null,
    repo: null,
    deck: {
      label: "NeuroTrack pitch deck (PDF)",
      href: "/neurotrack-pitch.pdf",
      cover: "/neurotrack-deck-cover.jpg",
    },
  },
  {
    name: "Mind-Controlled Lightbulb",
    mark: "MC",
    what: "A lightbulb switched by thought alone, built through Stanford's Brain-Computer Interface club: an EEG electrode reads the wearer, and the software decides when they meant it.",
    why: "Wrote the data collection and signal processing halves — the part that has to get from a noisy scalp electrode to a decision clean enough to act on.",
    stack: ["EEG", "Signal processing", "Python", "BCI"],
    live: null,
    repo: null,
    clip: {
      src: "/mind-controlled-lightbulb.mp4",
      poster: "/mind-controlled-lightbulb-poster.jpg",
      alt: "Two people at a library table wearing EEG electrodes, concentrating on an acrylic brain-shaped lamp wired to a breadboard.",
    },
  },
  {
    name: "Climate Mind",
    mark: "CM",
    what: "An app that lets people explore how the things they personally value are being affected by climate change.",
    why: "Trained the model underneath it: it processes incoming news articles continuously, filters for the factual content, and pulls out the cause-and-effect relationships. The longer aim is for something like it to run inside social platforms and mark false information where people actually meet it.",
    stack: ["NLP", "Causal extraction", "Python"],
    live: "https://climatemind.org",
    repo: null,
    site: {
      href: "https://climatemind.org",
      label: "climatemind.org",
      alt: "The Climate Mind homepage, headlined \u201cPowering climate conversations.\u201d",
    },
  },
  {
    name: "Foster Tower Tree",
    mark: "FT",
    what: "An app built during the COVID pandemic for the residents of a Honolulu condominium tower, so a neighbour who could not safely leave the building could ask the neighbours who could.",
    why: "Shopping runs, rides to the doctor, a load of laundry \u2014 small asks that were suddenly hard to make of anyone, in a building full of people who would have said yes if they had known. The app was the part that was missing: somewhere to put the ask.",
    stack: ["App development", "Community software"],
    live: null,
    repo: null,
    logo: {
      src: "/foster-tower-tree-logo.png",
      alt: "The Foster Tower Tree app icon — cupped hands holding a heart before a Honolulu high-rise, a palm tree, and Diamond Head.",
    },
  },
  {
    name: "Ditch Dat!",
    mark: "DD",
    what: "A novel pediculicide — a head lice treatment that is eco-friendly, affordable, and patent-pending, because the ones on the shelf are none of those three.",
    why: "First place at the Hawaii State Science Fair, and federal government funding to prototype it further.",
    stack: ["Formulation", "Product design", "Patent-pending"],
    live: null,
    repo: null,
    logo: {
      src: "/ditch-dat-logo.png",
      alt: "The Ditch Dat! Head Lice badge — a glum cartoon louse under a stamped wordmark.",
    },
  },
];
