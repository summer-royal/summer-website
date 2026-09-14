import { currentlyReading, lastSyncedAt, type Book } from "@/data/currentlyReading";

export type { Book };

export interface Shelf {
  books: Book[];
  lastSyncedAt: string;
}

/**
 * Single source of truth for the reading shelf. Every component reads through
 * this function, so the stub can be replaced without touching any UI.
 *
 * TODO: replace the stub with the real fetch, e.g.
 *   const res = await fetch("https://www.goodreads.com/review/list_rss/<USER_ID>?shelf=currently-reading");
 *   parse the RSS <item> nodes into Book[] and use the feed's build date as lastSyncedAt.
 */
export async function getCurrentlyReading(): Promise<Shelf> {
  return Promise.resolve({ books: currentlyReading, lastSyncedAt });
}

export function relativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "recently";
  const minutes = Math.max(0, Math.round((now.getTime() - then) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.round(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}
