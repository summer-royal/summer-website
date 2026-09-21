export interface ResearchBeat {
  label: string;
  /** A blank line splits the body into separate paragraphs. */
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
    title: "Identifying Neurotoxicity",
    standfirst:
      "An end-to-end machine learning pipeline for early identification of chemotherapy-induced neurotoxicity from the clinical text. My research specifically focused on chemotherapy-induced peripheral neurotoxicity (CIPN) and cancer-related cognitive impairment (CRCI).",
    beats: [
      {
        label: "The clinical problem",
        body: "Chemotherapy can leave patients with nerve damage (CIPN) and cognitive impairment (CRCI), and both are severely under-reported. There is no standardized test for either, most symptoms depend on the patient reporting them, and physicians document them inconsistently, so administrative code counts underestimate how often cases of neurotoxicity occur. Physicians often note the symptoms in the patient's file, but rarely diagnose neurotoxity explciitly with an ICD code. If neurotoxicity is (innacurately) perceived as a rare condition, researchers are less liekly to study it, phyiscians are less likely to screen for it, and patients are less likely to get it treated early.",
      },
      {
        label: "The gap",
        body: "No existing work showed how to extract neurotoxicity symptoms from clinical notes with LLMs, and existing chemotherapy risk models do not target neurotoxicity specifically. My initial hypothesis: we can extract neurotoxicty symptoms from clinical notes and build a model to estimate the probability that a given patient develops neurotoxicity after treatment.",
      },
      {
        label: "The cohort",
        body: "27,950 adult patients in the Stanford Health Care database with a solid tumor at any stage who started chemotherapy between 2014 and 2024. Solid tumors are treated differently than blood cancers, and solid cancers make up about 90% of adult cancers, so I focused solely on solid tumors. A patient counts as a 'positive case'  if they were diagnsoed with an ICD-10 code for drug-induced polyneuropathy (G62.0) or cognitive symptoms (R41.89) within three months of starting chemotherapy, the window in which symptoms typically emerge. The 302 patients who were already diagnosed in the three months before treatment were excluded from the cohort so that the positive cases would truly reflect neurotoxicity that resulted specifically from chemotherapy rather than another cause.",
      },
      {
        label: "The approach for symptom identification",
        body: "The first part of this project involved extracting symptoms related to neurotoxicity from clinical notes for the patients in the cohort. I first created a file of all notes of interest. For positive cases, I was only interested in the notes that were written between the start of the first line of chemotherapy up and the date of the neurotoxicity diagnosis. For the instances of \u2018negative\u2019 notes, I selected a few notes per negative patient that do not explicitly mention symptoms of neurotoxicity. I filtered for the specific note types of interest such as progress notes and Emergency Department notes. I created a spreadsheet with the notes of interest including all patient features that were relevant for building a predictive model.\n\nSince the clinical notes contain copious amounts of information, most of which will not be relevant to a patient\u2019s neurotoxicity diagnosis, I ran Retrieval-Augmented Generation (RAG) to reduce the amount of text processed by the LLM to enhance the efficiency and performance of symptom extraction. CLEAR is a RAG pipeline that retrieves relevant clinical information by focusing on clinical entities rather than embedding the entire notes. It splits the notes into chunks where each chunk is focused on a specific topic, filters entities relevant to the query, uses ontologies and LLMs to expand the list of relevant entities, and outputs the note chunks for the selected entities. I then ran zero-shot prompting with an existing LLM API on the note chunks to label symptoms of neurotoxicity.",
      },
      {
        label: "Clinical validation",
        body: "Once the labeling scheme was finalized, Dr. Mohana Roy reviewed the LLM's output against the notes, so the labels are clinician-validated rather than model-asserted. That gives a way to count neurotoxicity from what clinicians actually wrote, not only from what was coded, which is the groundwork for earlier screening and for trials that can measure it.",
      },
      {
        label: "Predicting it before treatment",
        body: "In addition to developing the symptom labeling scheme, I built a model that flags patients at elevated risk of chemotherapy-induced neurotoxicity before treatment begins. This allows physicians to weigh the risks when recommending a regimen. I compared candidate models on hazard ratios, correlated features, and clinical impact, and wrote the model cards that document performance, fairness, and limitations for interpretability.",
      },
    ],
    facts: [
      {
        label: "FOCUS",
        body: "CIPN (peripheral neuropathy) and CRCI (cognitive impairment) after chemotherapy, in adults with solid tumors.",
      },
      {
        label: "METHODS",
        body: "CLEAR entity-based retrieval-augmented generation, zero-shot GPT-4o symptom extraction, physician-validated labels, risk models compared on hazard ratios, correlated features, and clinical impact, documented with model cards.",
      },
      {
        label: "MENTORS",
        body: "Dr. Tina Hernandez-Boussard and Dr. Behzad Naderalvojoud",
      },
    ],
    /** Each `id` selects its drawing in PipelineFigure. */
    pipeline: [
      {
        id: "cohort",
        label: "Build the cohort",
        note: "Create a cohort of patients who have received chemotherapy for a solid tumor, consult with physicians to confirm the cohort definition, and then summarize the composition of the cohort.",
      },
      {
        id: "subcohort",
        label: "Diagnosed subcohort",
        note: "Identify existing diagnosed markers of neurotoxicity within the cohort and create a subcohort of patients based on surrogate markers; cross-reference against unstructured patient notes from the EMR.",
      },
      {
        id: "llm-labels",
        label: "Label with LLMs",
        note: "Use LLMs to label patient records and identify undiagnosed instances of neurotoxicity; consult with physicians to confirm results.",
      },
      {
        id: "features",
        label: "Derive features",
        note: "Derive features of neurotoxicity from both the diagnosed and undiagnosed instances of neurotoxicity.",
      },
      {
        id: "model",
        label: "Predict onset",
        note: "Create a model to predict onset of neurotoxicity.",
      },
      {
        id: "evaluate",
        label: "Evaluate models",
        note: "Evaluate different models (accuracy, precision, recall).",
      },
      {
        id: "interpret",
        label: "Interpret the results",
        note: "Identify hazard ratios, correlatory features, and clinical impact.",
      },
    ],
    /** TODO: add the remaining shareable metrics — recall, and agreement with
     *  the physician labels. */
    metrics: [
      { value: "717", label: "ICD-coded neurotoxicity cases within three months of chemotherapy" },
      { value: "100,000+", label: "clinician notes labeled" },
    ],
    /** TODO: swap in a preprint, poster, or publication link when available. */
    link: {
      label: "Boussard Lab at Stanford Medicine",
      href: "https://med.stanford.edu/boussard-lab.html",
    },
  },
  {
    id: "oxford-tutorial",
    lab: "University of Oxford",
    institution: "Oxford, UK",
    role: "Research tutorial, computational neuroscience",
    dates: "2024",
    title: "Computational Neuroscience Research Tutorial",
    standfirst:
      "Completed under the mentorship of Dr. Juan Galeazzi while studying abroad at Oxford University.",
    beats: [
      {
        label: "Foundations",
        body: "How the brain is organized, from Brodmann's localisation of the cerebral cortex to its functional anatomy; the research methods neuroscience depends on; and how the brain should be modeled, working from Dayan and Abbott's Theoretical Neuroscience.",
      },
      {
        label: "Vision and movement",
        body: "Computational modeling of human vision, then the processes involved in voluntary movement, from planning an action to carrying it out.",
      },
      {
        label: "Memory and learning",
        body: "The structures that contribute to different types of memory, then the mechanisms of learning. The readings ran from Pavlov's conditioned reflexes and the Skinner–Konorski debate over two types of conditioned reflex, through Tolman, two-process learning theory, and Pavlovian-to-instrumental transfer, to the dopamine reward prediction error that links conditioning to reinforcement learning (Schultz, Dayan & Montague, 1997).",
      },
      {
        label: "Large-scale neural recordings",
        body: "Making sense of high-dimensional data from recordings of many neurons at once: dimensionality reduction for neural populations (Cunningham & Yu, 2014; Humphries, 2021), context-dependent computation by recurrent dynamics in prefrontal cortex (Mante et al., 2013), and the new insights needed to link large-scale recordings to behavior (Urai et al., 2022).",
      },
    ],
    facts: [
      {
        label: "PROGRAM",
        body: "Neurophysiology tutorial, Stanford University Programme in Oxford, Trinity term 2024.",
      },
      {
        label: "FOCUS",
        body: "Brain organization, research methods, computational modeling of the brain, vision, voluntary movement, memory, reward and reinforcement learning, large-scale neural recordings.",
      },
      {
        label: "KEY TEXTS",
        body: "Dayan & Abbott, Theoretical Neuroscience; Kandel et al., Principles of Neural Science; Rolls & Treves, Neural Networks and Brain Function; Nolte's The Human Brain.",
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
