/**
 * The toolkit, grouped the way the CV groups it.
 *
 * Five registers rather than one flat cloud: what she writes code in, the model
 * families she reaches for, how she trains them, what she trains them inside,
 * and the subject matter she points them at. `note` is the optional one line
 * that says why a group is here at all — a list of nouns tells a reader nothing
 * on its own.
 */
export interface SkillGroup {
  label: string;
  items: string[];
  note?: string;
}

export const skills: SkillGroup[] = [
  {
    label: "LANGUAGES",
    items: ["Python", "C++", "C", "Swift", "Java"],
  },
  {
    label: "MACHINE LEARNING",
    items: [
      "Machine learning",
      "Deep learning",
      "Convolutional Neural Network (CNN)",
      "Transfer learning",
      "Random Forest Classifier",
      "Attention MIL",
      "Bayesian inference",
      "Computer vision",
      "Natural Language Processing (NLP)",
      "LLMs",
      "Signal processing",
      "Data analysis",
    ],
  },
  {
    label: "TRAINING & REINFORCEMENT",
    items: [
      "Supervised Fine-Tuning (SFT)",
      "Group Relative Policy Optimization (GRPO)",
      "Model distillation",
      "Curriculum learning",
      "Reinforcement Learning (RL)",
      "Q-Learning",
      "Value iteration",
    ],
  },
  {
    label: "FRAMEWORKS & PLATFORMS",
    items: [
      "CLAM",
      "UNI",
      "CONCH",
      "LAB-Bench",
      "Unity",
      "Apple HealthKit",
      "Web app development",
      "Accessibility",
      "VS Code",
      "Cursor",
      "Google Colab",
    ],
  },
  {
    label: "DOMAINS",
    items: [
      "Clinical NLP",
      "Medical QA",
      "Digital pathology",
      "Medical imaging",
      "EEG",
      "Brain-Computer Interfaces (BCIs)",
      "Biosignals",
      "Digital health",
      "EHR integration",
      "Advance care planning",
      "Medical ethics",
      "Computational biology",
      "Autonomous vehicles",
    ],
  },
];
