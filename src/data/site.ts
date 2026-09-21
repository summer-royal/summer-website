export interface Education {
  school: string;
  degree: string;
  year: string;
  /** Grade point average, as printed on the CV. */
  gpa?: string;
}

export interface SiteData {
  name: string;
  /** The document title, shared by the beach and the dive page. */
  title: string;
  positioning: string;
  education: Education[];
  path: string[];
  location: string;
  email: string;
  /** The Stanford address the CV leads with. Kept alongside `email`, which is
   *  the one that outlives the alumni forwarder. */
  alumniEmail: string;
  linkedin: string;
  github: string;
  /** The repository the CV links to by name, distinct from the profile above. */
  githubPortfolio: string;
  resume: string;
  metaDescription: string;
}

export const site: SiteData = {
  name: "Summer Royal",
  title: "Summer Royal — AI for clinical data",
  positioning: "I am passionate about building human-centered AI systems for clinical applications",
  education: [
    {
      school: "Stanford University",
      degree: "M.S. Computer Science, AI concentration",
      year: "2026",
      //gpa: "3.9",
    },
    {
      school: "Stanford University",
      degree: "B.S. Biomedical Computation",
      year: "2025",
      //gpa: "4.0",
    },
  ],
  path: ["Honolulu", "Stanford", "Mountain View"],
  location: "Mountain View, California",
  email: "summerroyal25@gmail.com",
  alumniEmail: "summerroyal@alumni.stanford.edu",
  linkedin: "https://www.linkedin.com/in/summer-royal-7824b5211/",
  github: "https://github.com/summerroyal",
  githubPortfolio: "https://github.com/summer-royal/github-portfolio",
  resume: "/resume.pdf",
  metaDescription:
    "Summer Royal is a computer scientist working at the intersection of AI and medicine — RAG and LLM pipelines that surface chemotherapy neurotoxicity hidden in clinical notes.",
};

export interface ProfileLink {
  label: string;
  href: string;
}

/** The contact row the beach leads with, repeated in About so someone who
 *  arrives at the bottom of the dive never has to swim back up for it. One
 *  list, so the two cannot drift apart. */
export const profileLinks: ProfileLink[] = [
  { label: "Email", href: `mailto:${site.alumniEmail}` },
  { label: "LinkedIn", href: site.linkedin },
  { label: "GitHub", href: site.githubPortfolio },
  { label: "Résumé (PDF)", href: site.resume },
];
