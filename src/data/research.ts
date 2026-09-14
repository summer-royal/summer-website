export interface ResearchBeat {
  label: string;
  body: string;
}

export interface PipelineStep {
  id: string;
  label: string;
  note: string;
}

export interface ResearchFact {
  label: string;
  body: string;
}

export interface ResearchLab {
  /** Anchor id — the lab subsections are linkable individually. */
  id: string;
  lab: string;
  institution: string;
  role: string;
  dates: string;
  title: string;
  standfirst: string;
  beats: ResearchBeat[];
  facts: ResearchFact[];
  pipeline?: PipelineStep[];
  metrics: { value: string; label: string }[];
  link: { label: string; href: string } | null;
  /** Renders the header only, for a lab whose write-up is still outstanding. */
  pending?: boolean;
}

export const research: ResearchLab[] = [
  {
    id: "boussard-lab",
    lab: "Boussard Lab",
    institution: "Stanford",
    role: "Research Assistant",
    dates: "2024 — 2025",
    title: "Finding chemotherapy's hidden side effects in the notes",
    standfirst:
      "An end-to-end machine learning pipeline for earlier identification of chemotherapy-induced neurotoxicity — CIPN and CRCI — from the clinical text that billing codes miss.",
    beats: [
      {
        label: "The clinical problem",
        body: "Chemotherapy can leave patients with nerve damage (CIPN) and cognitive impairment (CRCI). Both are common, and both are badly undercounted: ICD codes substantially underestimate how often they occur, because the symptoms usually get written down in a note rather than coded as a diagnosis. If the record says it did not happen, nobody studies it, screens for it, or treats it early.",
      },
      {
        label: "The approach",
        body: "The system reads the notes instead of the codes. A retrieval pipeline called CLEAR pulls the passages of a patient's clinical notes that are actually relevant to neurotoxicity, and GPT-4o then extracts the symptoms from those passages zero-shot — no labeled training corpus required, which is what makes it portable to a new site or a new cohort. That extraction is what auto-labels clinician notes at the scale a model needs.",
      },
      {
        label: "The result",
        body: "Physicians confirmed the labeling schema before the run and validated the extracted results after it, so the output is clinician-checked rather than model-asserted. The effect is a far more honest picture of how often neurotoxicity actually appears — a base for earlier screening and for trials that can measure it.",
      },
      {
        label: "Predicting it before treatment",
        body: "On top of those labels, trained a model that flags patients at elevated risk before chemotherapy begins, and wrote the model cards that document its performance, fairness, and limitations — the interpretability record a model needs before anyone can use it in a clinic.",
      },
      {
        label: "Alongside",
        body: "Develops supervised models across data modalities to identify factors that influence cancer progression and treatment response, and studies treatment response in relation to neuronal activity, linking signal-level features to patient outcomes.",
      },
    ],
    facts: [
      {
        label: "FOCUS",
        body: "CIPN (peripheral neuropathy) and CRCI (cognitive impairment) after chemotherapy.",
      },
      {
        label: "METHODS",
        body: "CLEAR retrieval-augmented generation, zero-shot GPT-4o extraction, physician-confirmed labeling schema, risk model documented with model cards.",
      },
    ],
    pipeline: [
      { id: "notes", label: "Clinical notes", note: "unstructured EHR text" },
      { id: "clear", label: "CLEAR retrieval", note: "relevant chunks only" },
      { id: "gpt", label: "GPT-4o extraction", note: "zero-shot prompting" },
      { id: "labels", label: "Validated labels", note: "physician-confirmed" },
    ],
    /** TODO: add the remaining shareable metrics — recall, and agreement with
     *  the physician labels. Cohort size and labelling volume are below. */
    metrics: [
      { value: "27,950", label: "patients in the cohort" },
      { value: "100,000+", label: "clinician notes labeled" },
    ],
    /** TODO: add a preprint, poster, or publication link when available. */
    link: null,
  },
  {
    id: "oxford-tutorial",
    lab: "University of Oxford",
    institution: "Oxford, UK",
    role: "Research tutorial, computational neuroscience",
    dates: "2023",
    title: "A term of computational neuroscience, one-to-one",
    standfirst:
      "A research tutorial in computational neuroscience under the mentorship of Dr. Juan Galeazzi, completed while studying abroad at Oxford University.",
    beats: [
      {
        label: "Brains, described formally",
        body: "Brain organization and computational brain modeling — how the structure of a nervous system gets written down precisely enough that it can be simulated rather than only described.",
      },
      {
        label: "The shared vocabulary",
        body: "Computer vision, memory, and reinforcement learning, taken from the side that treats them as accounts of what brains actually do rather than only as engineering. Which is a large part of why the machine learning on the rest of this page keeps reaching back toward biology.",
      },
      {
        label: "Recording at scale",
        body: "Large-scale neural recordings, and what becomes answerable about a population of neurons once you can listen to thousands of them at once instead of one at a time.",
      },
    ],
    facts: [
      {
        label: "FOCUS",
        body: "Brain organization, computational brain modeling, computer vision, memory, reinforcement learning, large-scale neural recordings.",
      },
      {
        label: "MENTOR",
        body: "Dr. Juan Galeazzi, University of Oxford.",
      },
    ],
    metrics: [],
    link: null,
  },
  {
    id: "wernig-lab",
    lab: "Wernig Lab",
    institution: "Stanford",
    role: "Research Assistant",
    dates: "2021 — 2023",
    title: "Reprogramming microglia, and induced neurons that integrate",
    standfirst:
      "Bench work on how induced neurons functionally integrate into neural systems, and on disease mechanisms and therapeutic approaches in Alzheimer's.",
    beats: [
      {
        label: "Cell reprogramming",
        body: "Studied the reprogramming potential of microglia and how induced neurons functionally integrate into neural systems.",
      },
      {
        label: "Alzheimer's disease",
        body: "Investigated therapeutic approaches and disease mechanisms in Alzheimer's Disease, and therapeutic methods for neurological patients.",
      },
    ],
    facts: [
      {
        label: "FOCUS",
        body: "Microglia reprogramming, induced neuron integration, Alzheimer's disease.",
      },
    ],
    metrics: [],
    link: null,
  },
  {
    id: "davis-mercier-labs",
    lab: "Davis & Mercier Labs",
    institution: "Honolulu, HI",
    role: "Research Assistant",
    dates: "2014 — 2016",
    title: "Fractones, and where they turn up in Alzheimer's",
    standfirst:
      "Early bench work on fractones — then newly discovered structures in the stem cell niche — and the finding that they appear in the β-amyloid plaques of Alzheimer's patients.",
    beats: [
      {
        label: "The structures",
        body: "Fractones are specialized structures in the stem cell niche that bind neuronal growth factors, and through that binding control whether stem cells proliferate or differentiate. They had only just been described when this work started.",
      },
      {
        label: "The finding",
        body: "The research showed that fractones are present in the β-amyloid plaques found in the brains of Alzheimer's Disease patients — placing a growth-factor-binding structure inside the hallmark lesion of the disease.",
      },
    ],
    facts: [
      {
        label: "FOCUS",
        body: "Fractones in the stem cell niche, growth factor binding, β-amyloid plaques in Alzheimer's Disease.",
      },
    ],
    metrics: [],
    link: null,
  },
];
