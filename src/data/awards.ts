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
      "Graduate-level course award for the strongest final project. My project partner and I created three reinforcement learning agents to optimally play the game of Exploding Kittens: an MLE agent with value iteration, Q-Learning agent, and a Bayesian agent. We created a webapp where users can play against the agents.",
  },
  {
    year: "2023",
    name: "health{hacks}, Stanford University",
    honor: "1st place — Aging & Longevity",
    detail:
      "Post-operative monitoring for hip and knee replacement patients. We created a convolutional classifier for wound photographs that pairs with Apple Watch biometric data to predict a patient's surgical site infection risk.",
  },
  {
    year: "2021-2025",
    name: "Tau Beta Pi",
    honor: "Member",
    detail:
      "The engineering honor society. Members are elected by having a GPA in the top 10% of GPAs among engineering undergraduates and fulfilling community service requirements.",
  },
  {
    year: "2021",
    name: "Boothe Prize Finalist",
    honor: "Award",
    detail:
      "All Stanford students are required to complete PWR 1, a course that engages students in the serious practice of academic analysis, college level research, and argument. My PWR 1 class was about social and tehcnological change. The Boothe Prize finalists are the students whom the faculty deemed to have the best PWR 1 essay of the class."
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
    detail: "Cybersecurity challenge series. I advanced to the national round, but did not compete in the national competition due to COVID-19.",
  },
  {
    year: "2018",
    name: "US Army eCybermission",
    honor: "National winner — STEM-in-Action Grant",
    detail: "Federal funding awarded to carry a student research project into the community.",
  },
];
