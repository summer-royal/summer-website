export interface Project {
  summary: string;
}

export interface Role {
  employer: string;
  title: string;
  location: string;
  dates: string;
  context?: string;
  /**
   * An illustration hung from the rule under the header, in `public/experience`.
   * Drawn as SVG on a 1200 × 1040 board — the frame's own 30:26 — with the
   * subject kept in the top right, the only part the curve and the fade leave
   * whole. Decorative — it restates the bullets beside it, so assistive
   * technology skips it.
   */
  image?: string;
  projects: Project[];
}

export const experience: Role[] = [
  {
    employer: "Inspirit AI",
    title: "Product Manager",
    location: "Palo Alto, CA",
    dates: "2025 — Present",
    context:
      "Inspirit AI Scholars is an artificial intelligence education program for high school students, developed by Stanford and MIT alumni and graduate students.",
    image: "/experience/inspirit-ai.svg",
    projects: [
      {
        summary:
          "Built interactive web applications, Jupyter notebooks, and technical curricula to teach AI concepts",
      },
      {
        summary:
          "Lead technical product operations, directly managing 200+ employees, running performance evaluations, allocating work,  and advising teams on research direction, technical roadblocks, and client escalations.",
      },
      {
        summary:
          "Built python scripts to automate high-volume manual workflows including project matching, creation and archival of project Slack channels, and enrollment of thousands of students across course platforms.",
      },
      {
        summary:
          "Served as an on-call software engineer for urgent software bug fixes.",
      },
    ],
  },
  {
    employer: "Melio",
    title: "Software Engineer Intern",
    location: "Mountain View, CA",
    dates: "2024",
    context:
      "Melio is a biotechnology company that builds rapid, culture-free diagnostic platforms to detect bloodborne pathogens and bloodstream infections. A Fogarty Innovation portfolio company.",
    image: "/experience/melio.svg",
    projects: [
      {
        summary:
          "Optimized PCR primer selection for a rapid blood-testing platform diagnosing neonatal sepsis, scoring candidate primer sets on whether the resulting melt curves separate distinct pathogens while staying tightly clustered within a single one.",
      },
      {
        summary:
          "Performed DNA sequence alignment and consensus sequencing across the platform's target pathogen panel to characterize phylogenetic relatedness between species, flagging closely related organisms at elevated risk of misclassification.",
      },
      {
        summary:
          "Worked with the ML team to diagnose patients from the melt-curve profile of a blood sample.",
      },
    ],
  },
  {
    employer: "Immergo Labs",
    title: "Software Engineer Intern",
    location: "Mountain View, CA",
    dates: "2024",
    context:
      "Immergo Labs is an NSF-funded digital health company that builds an extended reality (XR) and AI-powered platform for physical rehabilitation and remote movement care. A Fogarty Innovation portfolio company.",
    image: "/experience/immergo-labs.svg",
    projects: [
      {
        summary:
          "Developed immersive virtual environments in Unity for a VR telehealth platform, widening the range of tools physical therapists can use to assess and treat patients remotely.",
      },
      {
        summary:
          "Turned prescribed rehab movement into guided sessions patients complete inside the headset.",
      },
    ],
  },
  {
    employer: "Fogarty Innovation",
    title: "Medical Technology Lefteroff Intern",
    location: "Mountain View, CA",
    dates: "2024",
    context:
      "Fogarty Innovation is an action-oriented nonprofit organization that advances human health by accelerating medtech innovation from concept to clinical impact. Melio and Immergo Labs are Fogarty portfolio companies.",
    image: "/experience/fogarty-innovation.svg",
    projects: [
      {
        summary:
          "Consulted on the biodesign process: how a clinical need is identified and characterized before anyone designs the device that answers it.",
      },
      {
        summary:
          "Worked across regulatory strategy, patents, and medtech commercialization — the path a device takes from a working prototype to something a hospital can actually buy.",
      },
    ],
  },
  {
    employer: "Skywalk",
    title: "Software Engineer & Data Science Intern",
    location: "Palo Alto, CA",
    dates: "2023",
    context:
      "Skywalk is a software and deep-technology development company focused on building computing devices and specialized software, such as the Voicebuds audio device and assistive wrist-worn devices for interfacing with technology.",
    image: "/experience/skywalk.svg",
    projects: [
      {
        summary:
          "Developed signal-quality algorithms to detect artifact-corrupted channels from wrist-worn optical EMG sensors: benchmarked a root-mean-square successive-difference method, diagnosed its high false-positive rate on non-stationary recordings, and replaced it with a variance-based detector whose threshold is normalized by the ratio of optical signal to power output.",
      },
      {
        summary:
          "Designed and executed a 100-participant user study to generate training data for the company's ML models, building a custom Unity application for the Microsoft HoloLens so participants could complete data-collection tasks in a simulated AR environment.",
      },
      {
        summary:
          "Authored Python processing pipelines to prepare study data for model training — automated header labeling, corrupted-file detection and removal, and dataset standardization across participants.",
      },
    ],
  },
  {
    employer: "Argo AI",
    title: "Software Engineer Intern",
    location: "Palo Alto, CA",
    dates: "2022",
    context:
      "Argo AI was an autonomous driving technology company backed by Ford, Volkswagen, Lyft, and Walmart. System Fault Detection & Management team.",
    image: "/experience/argo-ai.svg",
    projects: [
      {
        summary:
          "Built a Python tool that extracts diagnostic signals from autonomous vehicle logs and renders them as time-series visualizations, with cross-vehicle and cross-signal comparison, time-window filtering, and threshold-based queries — replacing a workflow that had been manual.",
      },
      {
        summary:
          "Broadened access to that tooling company-wide by removing the prerequisite of Python scripting expertise, letting non-engineering employees analyze and compare log data across multiple vehicles and trips on their own.",
      },
      {
        summary:
          "Developed a C++ front-end that unified the safety and diagnostics team's fragmented internal tooling into a single entry point: users pose a diagnostic question in plain language, and the program routes to the appropriate underlying tool, prompts for any missing parameters, and executes it against their data — making tools previously known only within the team usable across the organization.",
      },
      {
        summary: "Generated and processed new data with the ML team for fault-detection models.",
      },
    ],
  },
  {
    employer: "Peninsula Tutoring & Breakout Mentors",
    title: "Computer Programming Teacher",
    location: "Bay Area, CA",
    dates: "2021 — Present",
    image: "/experience/peninsula-tutoring.svg",
    projects: [
      {
        summary:
          "Tutored students ages 8-18 in AP Computer Science, AP Calculus, trigonometry, AP Phyiscs, AP Biology, and AP Chemistry",
      },
    ],
  },
];
