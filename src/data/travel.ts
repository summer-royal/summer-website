/**
 * The travel photographs.
 *
 * One manifest, two presentations. Three of them float in the gutter beside the
 * About prose as ordinary drifting objects — `src/data/objects.ts` reads them
 * from here so a caption or a ratio is only ever written once. The rest, and on
 * a narrow viewport all of them, hang on the wall at the foot of About.
 *
 * Files live in `public/photos`. Each is re-encoded to 1100px on its long side
 * with its EXIF rotation baked into the pixels and the metadata stripped, so
 * `aspect` below is simply the file's own ratio and nothing is ever cropped.
 */
export interface TravelPhoto {
  /** Stable key. Matches the filename stem. */
  id: string;
  src: string;
  alt: string;
  /** Printed under the print, as `city, country`. */
  city: string;
  country: string;
  /** width ÷ height of the file. The frame takes this, so nothing is cropped. */
  aspect: number;
  /**
   * Also drifts in the About gutter from 1024px up (see `src/data/objects.ts`).
   * The wall stands these three down at that width, because the gutter has
   * them — below it there is no gutter, so the wall shows all seventeen.
   */
  gutter?: boolean;
}

/** The place, as it is printed under a print. */
export function placeOf(photo: TravelPhoto): string {
  return `${photo.city}, ${photo.country}`;
}

/** Ordered by region: the American east, the west, then Europe. */
export const travelPhotos: TravelPhoto[] = [
  {
    id: "boston",
    src: "/photos/boston.jpg",
    alt: "Kayaking on the Charles River with the Boston skyline behind.",
    city: "Boston",
    country: "USA",
    aspect: 0.75,
  },
  {
    id: "nyc",
    src: "/photos/nyc.jpg",
    alt: "By the giant red Christmas ornaments on Sixth Avenue in Manhattan.",
    city: "New York City",
    country: "USA",
    aspect: 0.75,
  },
  {
    id: "empire-state-building",
    src: "/photos/empire-state-building.jpg",
    alt: "At a window near the top of the Empire State Building, Manhattan below.",
    city: "New York City",
    country: "USA",
    aspect: 0.75,
  },
  {
    id: "michigan",
    src: "/photos/michigan.jpg",
    alt: "A winter walk through bare woods and fallen leaves with friends.",
    city: "Michigan",
    country: "USA",
    aspect: 0.75,
  },
  {
    id: "sf",
    src: "/photos/sf.jpg",
    alt: "With friends in front of the rotunda at the Palace of Fine Arts.",
    city: "San Francisco",
    country: "USA",
    aspect: 0.75,
  },
  {
    id: "seattle",
    src: "/photos/seattle.jpg",
    alt: "Outside the Pike Place Market sign with friends.",
    city: "Seattle",
    country: "USA",
    aspect: 1.333,
  },
  {
    id: "tahoe",
    src: "/photos/tahoe.jpg",
    alt: "Above Emerald Bay, Fannette Island and the pines behind.",
    city: "Lake Tahoe",
    country: "USA",
    aspect: 1.333,
    gutter: true,
  },
  {
    id: "honolulu",
    src: "/photos/honolulu.jpg",
    alt: "On the grass below Diamond Head.",
    city: "Honolulu",
    country: "USA",
    aspect: 1.5,
    gutter: true,
  },
  {
    id: "lisbon",
    src: "/photos/lisbon.jpg",
    alt: "On a miradouro above the Alfama rooftops and the Tagus.",
    city: "Lisbon",
    country: "Portugal",
    aspect: 0.666,
    gutter: true,
  },
  {
    id: "sintra",
    src: "/photos/sintra.jpg",
    alt: "With friends in the gardens in front of the Palace of Monserrate.",
    city: "Sintra",
    country: "Portugal",
    aspect: 1.333,
  },
  {
    id: "budapest",
    src: "/photos/budapest.jpg",
    alt: "At night in front of the lit Hungarian Parliament Building.",
    city: "Budapest",
    country: "Hungary",
    aspect: 0.75,
  },
  {
    id: "oxford",
    src: "/photos/oxford.jpg",
    alt: "Sitting in a stone archway under trailing wisteria.",
    city: "Oxford",
    country: "England",
    aspect: 0.75,
  },
  {
    id: "stratford-upon-avon",
    src: "/photos/stratford-upon-avon.jpg",
    alt: "Under a garden arch hung with green.",
    city: "Stratford-upon-Avon",
    country: "England",
    aspect: 0.75,
  },
  {
    id: "stonehenge",
    src: "/photos/stonehenge.jpg",
    alt: "In front of the standing stones at Stonehenge.",
    city: "Salisbury",
    country: "England",
    aspect: 1.5,
  },
  {
    id: "northumberland",
    src: "/photos/northumberland.jpg",
    alt: "On a swing in a cherry orchard in full white blossom.",
    city: "Northumberland",
    country: "England",
    aspect: 0.666,
  },
  {
    id: "scotland",
    src: "/photos/scotland.jpg",
    alt: "In Princes Street Gardens with friends, the Scott Monument behind.",
    city: "Edinburgh",
    country: "Scotland",
    aspect: 1.335,
  },
  {
    id: "water-of-leith",
    src: "/photos/water-of-leith.jpg",
    alt: "On the bridge over the Water of Leith at Dean Village.",
    city: "Edinburgh",
    country: "Scotland",
    aspect: 0.75,
  },
];

const BY_ID = new Map(travelPhotos.map((p) => [p.id, p]));

export function travelPhoto(id: string): TravelPhoto {
  const found = BY_ID.get(id);
  if (!found) throw new Error(`Unknown travel photograph: ${id}`);
  return found;
}
