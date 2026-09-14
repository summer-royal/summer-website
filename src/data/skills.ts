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
  note: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    label: "LANGUAGES",
    note: "Python for the pipelines and the models, C++ and C where the thing has to be fast or close to hardware, Swift for iOS.",
    items: ["Python", "C++", "C", "Swift", "Java"],
  },
  {
    label: "MACHINE LEARNING",
    note: "The methods the research and the side projects are actually built out of — from a raw biosignal at one end to a large language model at the other.",
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
    note: "Where the work gets made: two editors, a game engine that doubles as a VR and AR toolchain, and the health platforms an iOS app has to speak to.",
    items: ["VS Code", "Cursor", "Unity", "Apple HealthKit", "Google Colab"],
  },
  {
    label: "DOMAINS",
    note: "The subject matter. Every one of these is somewhere a model has to be right about a person rather than only right on a benchmark.",
    items: [
      "Clinical NLP",
      "Medical imaging",
      "Biosignals",
      "Digital health",
      "Computational biology",
    ],
  },
];
