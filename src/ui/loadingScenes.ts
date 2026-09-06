// The paintings on the loading screen, one per wait. Files live in
// `public/paintings/<id>.jpg`, 2400 wide and no taller than 2:1; the frame
// shows a 21:9 cover crop of each, placed by `focus` (an `object-position`).

export interface Painting {
  id: string;
  title: string;
  artist: string;
  focus?: string;
}

export const PAINTINGS: readonly Painting[] = [
  { id: 'wyant-housatonic-valley', title: 'Housatonic Valley', artist: 'Alexander Helwig Wyant' },
  { id: 'schaeffer-hungarian-landscape', title: 'Hungarian Landscape', artist: 'August Schaeffer von Wienwald' },
  { id: 'gay-sound-beach', title: 'The River, Sound Beach, Connecticut', artist: 'Edward Gay' },
  { id: 'rehn-bass-rocks', title: 'Beach of Bass Rocks, Gloucester', artist: 'F. K. M. Rehn' },
  { id: 'harpignies-view-of-a-stream', title: 'View of a Stream', artist: 'Henri Harpignies' },
  { id: 'adams-august-sunset', title: 'An August Sunset, Prairie Dell', artist: 'J. Ottis Adams' },
  { id: 'constable-willy-lotts-house', title: "Willy Lott's House", artist: 'John Constable' },
  { id: 'constable-tree-in-a-landscape', title: 'Tree in a Landscape', artist: 'Lionel Bicknell Constable' },
  { id: 'denis-clouds-over-rome', title: 'Study of Clouds with a Sunset near Rome', artist: 'Simon Alexandre Clément Denis' },
  { id: 'steele-the-river', title: 'The River', artist: 'Theodore Clement Steele' },
];

export function paintingSrc(painting: Painting): string {
  return `./paintings/${painting.id}.jpg`;
}

export function paintingCredit(painting: Painting): string {
  return `${painting.title} · ${painting.artist}`;
}

/** A painting that is not `current`, so two waits in a row do not hang the same one. */
export function pickPainting(current: string | null): Painting {
  const pool = PAINTINGS.filter((painting) => painting.id !== current);
  return pool[Math.floor(Math.random() * pool.length)] ?? PAINTINGS[0];
}
