import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentlyReading, relativeTime, type Book } from "@/lib/goodreads";
import { Section } from "./Section";
import { Rise, RiseItem } from "./depth/Rise";

function Skeleton() {
  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {[0, 1].map((i) => (
        <li key={i} className="flex gap-4 border-t border-border/60 pt-5">
          <div className="h-24 w-16 shrink-0 rounded-sm border border-border/70 bg-shelf/25" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-3.5 w-4/5 rounded-sm bg-shelf/35" />
            <div className="h-3 w-2/5 rounded-sm bg-shelf/25" />
            <div className="mt-4 h-px w-full bg-border/70" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Cover({ book }: { book: Book }) {
  const [failed, setFailed] = useState(false);

  if (book.coverUrl && !failed) {
    return (
      <img
        src={book.coverUrl}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="h-24 w-16 shrink-0 rounded-sm border border-border/70 object-cover"
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className="flex h-24 w-16 shrink-0 items-center justify-center rounded-sm border border-border/70 bg-shelf/25"
    >
      <span className="font-display text-h3 text-bone/70">{book.title.charAt(0)}</span>
    </div>
  );
}

export function Reading() {
  const { data, isLoading } = useQuery({
    queryKey: ["currently-reading"],
    queryFn: getCurrentlyReading,
  });

  return (
    <Section id="reading" title="Currently reading" band="reading">
      {isLoading && <Skeleton />}

      {!isLoading && data && data.books.length === 0 && (
        <p className="text-muted-foreground">Nothing on the shelf right now — between books.</p>
      )}

      {!isLoading && data && data.books.length > 0 && (
        <>
          <ul className="grid gap-6 sm:grid-cols-2">
            {data.books.map((book) => (
              <Rise as="li" key={book.title} className="flex gap-4 border-t border-border/60 pt-5">
                <RiseItem>
                  <Cover book={book} />
                </RiseItem>
                <RiseItem className="min-w-0 flex-1">
                  <h3 className="text-base leading-snug text-bone">
                    {book.goodreadsUrl ? (
                      <a
                        className="link-signal"
                        href={book.goodreadsUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {book.title}
                      </a>
                    ) : (
                      book.title
                    )}
                  </h3>
                  <p className="mt-1 text-fine text-muted-foreground">{book.author}</p>
                  <div className="mt-4">
                    <div
                      role="progressbar"
                      aria-valuenow={book.progressPercent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Progress through ${book.title}`}
                      className="h-px w-full bg-border"
                    >
                      <div
                        className="h-px bg-signal"
                        style={{ width: `${book.progressPercent}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-micro tabular-nums text-sound">
                      {book.progressPercent}% through
                    </p>
                  </div>
                </RiseItem>
              </Rise>
            ))}
          </ul>
          <p className="mt-8 text-micro text-muted-foreground" data-print="hide">
            Synced {relativeTime(data.lastSyncedAt)}
          </p>
        </>
      )}
    </Section>
  );
}
