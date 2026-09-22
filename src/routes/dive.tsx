import { createFileRoute } from "@tanstack/react-router";

import { Nav } from "@/components/Nav";
import { Experience } from "@/components/Experience";
import { Skills } from "@/components/Skills";
import { Research } from "@/components/Research";
import { Awards } from "@/components/Awards";
import { SideProjects } from "@/components/SideProjects";
import { Clinical } from "@/components/Clinical";
import { Community } from "@/components/Community";
import { About } from "@/components/About";
import { ProfileIcon } from "@/components/ProfileIcon";
import { Reading } from "@/components/Reading";
import { DescentBand } from "@/components/Section";
import { DepthProvider } from "@/components/depth/DepthContext";
import { DepthBand } from "@/components/depth/DepthBand";
import { site } from "@/data/site";

export const Route = createFileRoute("/dive")({
  head: () => ({
    meta: [{ title: site.title }, { name: "description", content: site.metaDescription }],
  }),
  component: Dive,
});

/**
 * Everything past the waterline, from Experience down.
 *
 * A page of its own so that the beach ends where it ends: the reader arrives
 * here by pressing the dive, never by scrolling on from the sand. The water
 * opens on the same shallows the beach closes on, so the seam is invisible.
 */
function Dive() {
  return (
    <DepthProvider>
      <Nav />
      <main>
        <Experience />
        <Skills />
        <Research />
        {/* Where the light gives out. */}
        <DescentBand />
        <Awards />
        <SideProjects />
        <Clinical />
        <Community />
        <About />
        <Reading />
      </main>
      <DepthBand band="footer">
        <footer className="border-t border-border/60 py-10" data-print="hide">
          <div className="shell flex flex-wrap items-center justify-between gap-4 text-fine text-muted-foreground">
            <p>{site.name}</p>
            <p className="flex flex-wrap gap-x-5 gap-y-2">
              <span className="inline-flex items-center gap-2">
                <ProfileIcon label="Email" />
                <a className="link-signal" href={`mailto:${site.email}`}>
                  Email
                </a>
              </span>
              <span className="inline-flex items-center gap-2">
                <ProfileIcon label="LinkedIn" />
                <a
                  className="link-signal"
                  href={site.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  LinkedIn
                </a>
              </span>
              <span className="inline-flex items-center gap-2">
                <ProfileIcon label="GitHub" />
                <a
                  className="link-signal"
                  href={site.github}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  GitHub
                </a>
              </span>
            </p>
          </div>
        </footer>
      </DepthBand>
    </DepthProvider>
  );
}
