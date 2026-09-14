/**
 * Memberships — the clubs, and the one that was founded rather than joined.
 *
 * `role` is what distinguishes the two shapes this section holds: an
 * organisation built from nothing, and the longer list of rooms worth being in.
 */
export interface Organisation {
  name: string;
  role: string;
  detail: string;
}

export const founded: Organisation[] = [
  {
    name: "Stanford SupplyHer",
    role: "Co-founder & Financial Officer",
    detail:
      "A club that fundraises for victims of domestic abuse and for other under-resourced women. Co-founded it, and runs the money.",
  },
];

/**
 * General memberships. Kept as plain names, the way the CV keeps them — the
 * list is the point, and annotating nine clubs would bury it.
 */
export const memberships: string[] = [
  "Tree Hacks",
  "Stanford Mathematical Organization",
  "Women in CS",
  "Stanford Brain-Computer Interfaces",
  "CS for Social Good",
  "Scientists Speak Up",
  "Synapse Brain Injury Support Group",
  "Girl Scouts of America",
  "Stanford Dance Marathon",
];

export const communityNote =
  "The Brain-Computer Interfaces club is where the mind-controlled lightbulb came from, and Tree Hacks is where a weekend is occasionally spent building something that did not exist on Friday.";
