/**
 * The toolkit, grouped the way the CV groups it.
 *
 * Four registers rather than one flat cloud: what she writes code in, what she
 * does with it, what she does it inside, and the subject matter she does it to.
 * `note` is the one line that says why the group is here at all — a list of
 * nouns tells a reader nothing on its own.
 */
export interface SkillGroup {
  label: string;
  items: string[];
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
      "LLMs",
      "Signal processing",
      "Computer vision",
      "Data analysis",
    ],
  },
  {
    label: "FRAMEWORKS & PLATFORMS",
    items: ["VS Code", "Cursor", "Unity", "Apple HealthKit", "Google Colab"],
  },
  {
    label: "DOMAINS",
    items: [
      "Clinical NLP",
      "Medical imaging",
      "Biosignals",
      "Digital health",
      "Computational biology",
      "Autonomous vehicles",
    ],
  },
];
