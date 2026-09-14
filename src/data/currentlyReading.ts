/**
 * Shaped to match a Goodreads RSS item so the eventual swap is a drop-in.
 * See src/lib/goodreads.ts — components never import this file directly.
 */
export interface Book {
  title: string;
  author: string;
  coverUrl: string | null;
  dateStarted: string;
  progressPercent: number;
  shelf: string;
  goodreadsUrl: string | null;
}

export const currentlyReading: Book[] = [
  {
    title: "Algorithms to Live By: The Computer Science of Human Decisions",
    author: "Brian Christian and Tom Griffiths",
    coverUrl: null,
    dateStarted: "2026-07-28T00:00:00.000Z",
    progressPercent: 62,
    shelf: "currently-reading",
    goodreadsUrl: null,
  },
  {
    title: "Revenge of the Tipping Point",
    author: "Malcolm Gladwell",
    coverUrl: null,
    dateStarted: "2026-08-19T00:00:00.000Z",
    progressPercent: 34,
    shelf: "currently-reading",
    goodreadsUrl: null,
  },
];

export const lastSyncedAt = "2026-09-03T14:10:00.000Z";
