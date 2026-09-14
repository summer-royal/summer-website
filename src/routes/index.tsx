import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/Hero";
import { DepthProvider } from "@/components/depth/DepthContext";
import { site } from "@/data/site";
import { skills } from "@/data/skills";

// Absolute URL required for social previews; served from the project's stable domain.
const OG_IMAGE =
  "https://project--f08a6301-5097-46ca-9feb-e04dc7d4f89f.lovable.app/__l5e/assets-v1/91728a98-8a3f-47fd-8e37-1f314ddcd833/og-summer-royal.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: site.title },
      { name: "description", content: site.metaDescription },
      { property: "og:title", content: site.title },
      { property: "og:description", content: site.metaDescription },
      { property: "og:type", content: "profile" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: site.title },
      { name: "twitter:description", content: site.metaDescription },
      { name: "twitter:image", content: OG_IMAGE },
    ],

    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: site.name,
          jobTitle: "Computer Scientist, AI for medicine",
          description: site.metaDescription,
          email: `mailto:${site.email}`,
          homeLocation: { "@type": "Place", name: site.location },
          alumniOf: site.education.map((e) => ({
            "@type": "CollegeOrUniversity",
            name: e.school,
          })),
          hasCredential: site.education.map((e) => ({
            "@type": "EducationalOccupationalCredential",
            name: e.degree,
            educationalLevel: e.degree.startsWith("M.S.") ? "Master's" : "Bachelor's",
            dateCreated: e.year,
          })),
          knowsAbout: [
            "Machine learning",
            "Clinical natural language processing",
            "Retrieval-augmented generation",
            "Oncology data science",
            ...skills.flatMap((group) => group.items),
          ],
          sameAs: [site.linkedin, site.github, site.githubPortfolio],
        }),
      },
    ],
  }),
  component: Index,
});

/**
 * The beach, on its own. Everything from Experience down is the next page,
 * /dive, and the only way there from here is the dive button.
 */
function Index() {
  return (
    <DepthProvider>
      <main>
        <Hero />
      </main>
    </DepthProvider>
  );
}
