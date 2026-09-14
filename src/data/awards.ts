export interface Award {
  year: string;
  name: string;
  honor: string;
  detail: string;
}

export const awards: Award[] = [
  {
    year: "2025",
    name: "Decision Making Under Uncertainty, Stanford",
    honor: "1st place — best project",
    detail:
      "Graduate-level course award for the strongest final project: three reinforcement learning agents — MLE with value iteration, Q-Learning, and a Bayesian agent — competing inside a full-fidelity Exploding Kittens simulation.",
  },
  {
    year: "2023",
    name: "health{hacks}, Stanford University",
    honor: "1st place — Aging & Longevity",
    detail:
      "Post-operative monitoring for hip and knee replacement patients; a convolutional classifier over wound photographs and Apple Watch biometrics predicts surgical site infection risk.",
  },
  {
    year: "2021-2025",
    name: "Tau Beta Pi",
    honor: "Member",
    detail:
      "The engineering honor society. Elected on the top 10% of GPAs among engineering undergraduates, and held through 2025 alongside the associated community service.",
  },
  {
    year: "2020",
    name: "Genius Olympiad",
    honor: "2nd place — national",
    detail: "A project competition judged on scientific work aimed at environmental problems.",
  },
  {
    year: "2020",
    name: "Diamond Challenge",
    honor: "3rd place — international",
    detail:
      "An entrepreneurship competition that takes a venture from pitch through to a defended business case.",
  },
  {
    year: "2020",
    name: "Girls Go CyberStart",
    honor: "National qualifier",
    detail: "Cybersecurity challenge series; advanced to the national round.",
  },
  {
    year: "2018",
    name: "US Army eCybermission",
    honor: "National winner — STEM-in-Action Grant",
    detail: "Funding awarded to carry a student research project into the community.",
  },
];
