// Files are public/paintings/<id>.jpg; `focus` is an object-position for the 16:9 crop.

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

export function paintingCredit(painting: Painting): DocumentFragment {
  const credit = document.createDocumentFragment();
  const title = document.createElement('i');
  title.textContent = painting.title;
  credit.append(title, `, ${painting.artist}`);
  return credit;
}

export function pickPainting(current: string | null): Painting {
  const pool = PAINTINGS.filter((painting) => painting.id !== current);
  return pool[Math.floor(Math.random() * pool.length)] ?? PAINTINGS[0];
}
