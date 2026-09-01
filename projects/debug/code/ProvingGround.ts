import * as THREE from 'three';
import { markCollidable } from '@engine/player/Collider';
import { flatGround } from '@engine/world/floor';

/**
 * The Proving Ground: a permanent debug level of test fixtures. Nothing here is
 * game content — it exists so systems can be exercised in isolation, at known
 * scale, against known reference geometry.
 *
 * A ground grid, a 1.8 m height reference, measured cubes and distance markers.
 * West of the origin, the movement gym: ramps at four angles, two stair
 * pitches, kerbs at the step-up threshold, calibrated jump gaps, a high walkway
 * to fall off, and the parkour courses — stepping stones, a crouch tunnel,
 * balance beams and a squeeze.
 *
 * No audio fixtures. The Sound Stage has every model in the library in a row at
 * identical distances with the room dialled live, and two places to judge a
 * sound means two places to tune one.
 */

export type SurfaceName =
  | 'ground'
  | 'cube'
  | 'marker'
  | 'ramp'
  | 'stair'
  | 'platform'
  | 'wall';

/**
 * Warm ground, cool everything else — hue doing the work rather than
 * brightness. Quantizing to a handful of levels collapses close values
 * together, so a scene built from one family of blue-greys arrives at the
 * dither as nearly a single colour. Splitting the floor onto the opposite side
 * of the wheel survives quantization, because the levels are per-channel.
 *
 * The floor is also the lightest thing here, which hue alone was not achieving:
 * a dark warm floor under dark cool fixtures separates on a colour wheel and
 * not to the eye. A light floor gives every fixture an edge against something.
 */
const DEFAULT_SURFACES: Record<SurfaceName, string> = {
  ground: '#cabb9c',
  cube: '#525f66',
  marker: '#b08040',
  ramp: '#38474a',
  stair: '#3d4b52',
  platform: '#46505c',
  wall: '#2e3640',
};

/**
 * Edge of the ground plane, in metres. The gallery lays rows out by
 * accumulating radii, so every builder added makes the rank longer — anything
 * placed by accumulation will outgrow this again, and the floor has to be
 * checked whenever the kit grows.
 */
const GROUND = 208;

/**
 * Ground cells along each edge — **four-metre quads**.
 *
 * The subdivision exists so the collider's broad phase has something to sort:
 * one triangle spanning the level would be a candidate for every query. But the
 * octree stores a triangle in every cell it touches, so the count is paid for
 * more than once, and the collider is rebuilt from scratch on every crossing.
 *
 * That rebuild is the budget. At two-metre quads this ground takes 246 ms — a
 * visible hitch at every threshold, most of it spent indexing a flat floor.
 * Four metres costs 142 ms for identical behaviour, since a capsule on a plane
 * does not care how the plane is triangulated. Eight saves only another 27 ms
 * and starts making the triangles large against the octree's leaves.
 *
 * The visible grid stays at one metre. Lines are not collision, so it is free.
 */
const GROUND_CELLS = 52;

/** Baked into geometry at construction, so these are not live-editable. */
const BAND_LIGHT = 0xdcdcc8;
const BAND_DARK = 0x5c3a2e;

/** Where the player starts. Faces -Z, which looks down the distance markers. */
export const SPAWN = new THREE.Vector3(0, 0.1, 10);

function box(
  width: number,
  height: number,
  depth: number,
  material: THREE.Material,
  x: number,
  y: number,
  z: number,
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  // Positioned by its base, because every fixture here is described by the
  // height you have to climb, not by where its middle happens to be.
  mesh.position.set(x, y + height / 2, z);
  return mesh;
}

/**
 * A wedge you can walk up, rising along -Z over `run` metres. Extruded from a
 * right-triangle profile rather than built from a tilted box, so the foot of
 * the slope meets the ground at zero height — a tilted box leaves a lip, and a
 * lip is what makes slope handling look broken when it is not.
 */
function ramp(
  width: number,
  run: number,
  degrees: number,
  material: THREE.Material,
): THREE.Mesh {
  const profile = new THREE.Shape();
  profile.moveTo(0, 0);
  profile.lineTo(run, 0);
  profile.lineTo(run, run * Math.tan((degrees * Math.PI) / 180));
  profile.closePath();

  const geometry = new THREE.ExtrudeGeometry(profile, { depth: width, bevelEnabled: false });
  // The profile is built in XY and extruded along +Z; this turns it into a
  // slope that rises as you walk toward -Z, centred on its width.
  geometry.translate(0, 0, -width / 2);
  geometry.rotateY(Math.PI / 2);

  return new THREE.Mesh(geometry, material);
}

/**
 * An unlit strip whose colour sweeps left to right, for judging banding. Vertex
 * colours are set through `SRGBColorSpace` so the ramp is even to the eye
 * rather than even in linear light — a linear sweep spends most of its width in
 * the highlights, which is the half that never bands.
 */
function ramp2d(
  width: number,
  height: number,
  x: number,
  y: number,
  z: number,
  at: (t: number) => [number, number, number],
): THREE.Mesh {
  const segments = 96;
  const geometry = new THREE.PlaneGeometry(width, height, segments, 1);
  const position = geometry.getAttribute('position');
  const colors = new Float32Array(position.count * 3);
  const color = new THREE.Color();

  for (let i = 0; i < position.count; i++) {
    const t = position.getX(i) / width + 0.5;
    const [r, g, b] = at(Math.min(Math.max(t, 0), 1));
    color.setRGB(r, g, b, THREE.SRGBColorSpace);
    color.toArray(colors, i * 3);
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ vertexColors: true }));
  mesh.position.set(x, y, z);
  return mesh;
}

export class ProvingGround {
  readonly root = new THREE.Group();

  /**
   * Live surface colours as hex, editable and then pushed with `applyColors`.
   * Held as strings rather than as `THREE.Color` so the colour picker and the
   * material agree: a `Color` stores linear light, and a picker showing those
   * numbers as sRGB shows the wrong colour and sets a wronger one.
   */
  readonly colors: Record<SurfaceName, string> = { ...DEFAULT_SURFACES };

  /** One material per surface family, shared by every fixture that uses it. */
  private readonly materials = {} as Record<SurfaceName, THREE.MeshLambertMaterial>;

  constructor() {
    this.root.name = 'ProvingGround';

    for (const name of Object.keys(this.colors) as SurfaceName[]) {
      // Flat shading everywhere — this is the low-poly look the whole game uses.
      this.materials[name] = new THREE.MeshLambertMaterial({
        color: this.colors[name],
        flatShading: true,
      });
    }
  }

  /**
   * Fills `root` with the fixtures, or refills it after the zone was released.
   *
   * **The Proving Ground outlives its own zone.** The exterior's `build()`
   * returns *this* group rather than making a new one — `main.ts` holds the
   * instance to spin the mill wheel and drive the colour pickers — so when
   * residency drops the hub, `Zone.dispose` empties a group nothing else would
   * refill.
   *
   * Idempotent by checking the group rather than a flag, because the emptying
   * is done by somebody else: a flag here would say "populated" about a group
   * `Zone.dispose` had since cleared.
   *
   * No lighting here. `ZoneManager` owns the sun and the hemisphere light and
   * drives them from the active zone's environment; lights parented into a zone
   * would be removed with it, and the frame between one zone's lights leaving
   * and the next's arriving is a frame of black no fade covers.
   */
  populate(): THREE.Group {
    if (this.root.children.length > 0) return this.root;

    this.addGround();
    this.addHeightReference();
    this.addMeasuredCubes();
    this.addDistanceMarkers();
    this.addMovementGym();
    this.addCalibrationBoard();
    return this.root;
  }

  /** Pushes edited `colors` into the shared materials. */
  applyColors(): void {
    for (const name of Object.keys(this.colors) as SurfaceName[]) {
      this.materials[name].color.set(this.colors[name]);
    }
  }

  /** Reverts to the shipped colours. */
  resetColors(): void {
    Object.assign(this.colors, DEFAULT_SURFACES);
    this.applyColors();
  }

  private addGround(): void {
    // Subdivided rather than left as two enormous triangles: the collider's
    // broad phase indexes by triangle, and a triangle spanning the whole level
    // is a candidate for every query.
    //
    // The grid is drawn as a texture on the floor rather than as line geometry.
    // Lines have no mipmap chain and cannot be anisotropically filtered, so past
    // about twenty metres they moiré badly, the far ones resolving into smooth
    // curves that sweep across the ground as you turn. See `world/floor.ts`.
    this.root.add(
      flatGround(GROUND, { segments: GROUND_CELLS, material: this.materials.ground }),
    );

    // Line geometry, so the collider ignores it without being told.
    this.root.add(new THREE.AxesHelper(2));
  }

  /**
   * A 1.8 m pole banded every 0.3 m. Eye height and step height get tuned
   * against this, so it wants to be unambiguous at a glance.
   */
  private addHeightReference(): void {
    const group = new THREE.Group();
    const bandHeight = 0.3;
    const bands = 6;

    for (let i = 0; i < bands; i++) {
      const band = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, bandHeight, 0.08),
        new THREE.MeshLambertMaterial({
          color: i % 2 === 0 ? BAND_LIGHT : BAND_DARK,
          flatShading: true,
        }),
      );
      band.position.y = bandHeight * (i + 0.5);
      group.add(band);
    }

    group.position.set(-2, 0, 0);
    this.root.add(group);
  }

  /** Cubes of known edge length, for judging FOV and apparent scale. */
  private addMeasuredCubes(): void {
    const sizes = [1, 2, 4];
    let x = 4;

    for (const size of sizes) {
      this.root.add(markCollidable(box(size, size, size, this.materials.cube, x + size / 2, 0, 0)));
      x += size + 1;
    }
  }

  /** Posts at known distances down -Z, for fog tuning and audio falloff checks. */
  private addDistanceMarkers(): void {
    for (const distance of [5, 10, 20, 30]) {
      this.root.add(markCollidable(box(0.1, 2, 0.1, this.materials.marker, 0, 0, -distance)));
    }
  }

  /** Everything Phase 1 is judged against. West of the origin, out of the way. */
  private addMovementGym(): void {
    const gym = new THREE.Group();
    gym.name = 'MovementGym';

    this.addRamps(gym);
    this.addStairs(gym);
    this.addKerbs(gym);
    this.addJumpGaps(gym);
    this.addFallWalkway(gym);
    this.addParkour(gym);

    this.root.add(markCollidable(gym));
  }

  /**
   * Four slopes, shallow to steep, left to right: 10°, 20°, 30°, 45°. The slope
   * limit sits between two of these on purpose — the point is to see where
   * walking stops and sliding starts, and to move that line with the tuning
   * panel and watch it change.
   */
  private addRamps(parent: THREE.Group): void {
    const angles = [10, 20, 30, 45];
    const run = 4;

    angles.forEach((degrees, index) => {
      const slope = ramp(2.5, run, degrees, this.materials.ramp);
      slope.position.set(-6 - index * 4, 0, -2);
      parent.add(slope);

      // A landing at the top, so the ramp can be walked off rather than only
      // walked up — coming back down a slope is its own test.
      const rise = run * Math.tan((degrees * Math.PI) / 180);
      parent.add(box(2.5, 0.2, 2, this.materials.ramp, -6 - index * 4, rise - 0.2, -7));
    });

    // The one that has to refuse you, behind the row so it needs no space of
    // its own. Every ramp above is inside the slope limit, and a fixture that
    // only ever passes is a fixture that proves nothing.
    const steep = ramp(2.5, 2, 60, this.materials.ramp);
    steep.position.set(-6, 0, -13);
    parent.add(steep);
  }

  /**
   * Two pitches: an ordinary stair at 31°, and a steep one at 45°. Both are
   * within the slope limit on purpose — a staircase is climbed as a sequence of
   * ledges but *felt* as a slope, and one pitched past the limit reads as an
   * invisible wall rather than as stairs.
   */
  private addStairs(parent: THREE.Group): void {
    const flights = [
      { rise: 0.18, run: 0.3, x: -24 },
      { rise: 0.3, run: 0.3, x: -28 },
    ];

    for (const flight of flights) {
      for (let i = 0; i < 8; i++) {
        const height = flight.rise * (i + 1);
        parent.add(
          box(2.5, height, flight.run, this.materials.stair, flight.x, 0, -2 - i * flight.run),
        );
      }
    }
  }

  /**
   * Isolated ledges bracketing the step height, from a kerb to waist height. The
   * two low ones should be walked over without thinking about it and the tall
   * one should stop you dead. The 0.5 m is the interesting case: just past the
   * step height, and climbed anyway because the capsule's own shoulder carries
   * it. That is the practical ceiling.
   */
  private addKerbs(parent: THREE.Group): void {
    [0.2, 0.35, 0.5, 0.9].forEach((height, index) => {
      parent.add(box(3, height, 2, this.materials.platform, -8 - index * 4, 0, 5));
    });
  }

  /**
   * Gaps of 1.5, 2.5 and 3.5 m at a height that punishes a miss. With the
   * default tuning these are, in order: a walking jump, a jump that needs a
   * run-up, and one that needs a sprint. If that stops being true after a
   * tuning pass, these numbers are the thing that noticed.
   */
  private addJumpGaps(parent: THREE.Group): void {
    const gaps = [1.5, 2.5, 3.5];
    const platform = 3;
    const height = 1.2;
    // Runs north to south so the lane clears the stairs behind it entirely.
    let z = 18;

    parent.add(box(3, height, platform, this.materials.platform, -26, 0, z));

    for (const gap of gaps) {
      z -= platform + gap;
      parent.add(box(3, height, platform, this.materials.platform, -26, 0, z));
    }
  }

  /**
   * Four courses testing the parts of the controller the ramps and stairs do
   * not reach. Each isolates one thing and grades it, so the answer is a
   * *number* — which stone you fall at, which header stops you — rather than
   * pass or fail.
   *
   * Laid out west to east in one band at z 8..18, north of the kerbs and south
   * of the gallery doors' arrival markers at z ≈ 20.9. Anything added here has
   * to stay clear of those: a door that opens into a wall is a door nobody can
   * use.
   */
  private addParkour(parent: THREE.Group): void {
    const course = new THREE.Group();
    course.name = 'Parkour';

    // --- stepping stones, gaps widening ------------------------------------
    //
    // Pillar tops rather than platforms: at 0.7 m square there is no room to
    // adjust after landing, so this tests the jump *and* the landing. The gaps
    // run 1.4 to 2.6 m, bracketing what a standing jump reaches, so the stone
    // you fall at says which part of the tuning moved.
    let z = 8;
    for (const gap of [0, 1.4, 1.8, 2.2, 2.6]) {
      z += gap;
      course.add(box(0.7, 0.9, 0.7, this.materials.platform, -6, 0, z));
    }

    // --- the crouch tunnel --------------------------------------------------
    //
    // The only fixture in the game that tests crouching. The capsule really does
    // shrink — see `crouchHeight` — and the headroom test that stops a player
    // standing up inside geometry needs something to shrink under.
    //
    // Three headers at falling clearance: 1.6 stops a standing capsule (1.8)
    // and passes a crouched one (1.04) easily, 1.3 is comfortable, and 1.1 is
    // six centimetres of margin. Walk in, duck, and try to stand up under the
    // last one.
    const lane = -10;
    for (const side of [-1, 1]) {
      course.add(box(0.3, 2.2, 7, this.materials.wall, lane + side * 1.05, 0, 11.5));
    }
    for (const [clearance, at] of [
      [1.6, 9],
      [1.3, 11.5],
      [1.1, 14],
    ] as const) {
      course.add(box(2.4, 0.3, 0.5, this.materials.wall, lane, clearance, at));
    }

    // --- balance beams, narrowing ------------------------------------------
    //
    // The capsule is 0.64 m across, so the last two beams are narrower than the
    // player is. That is the interesting part: the collider settles on whatever
    // is under the capsule's *centre*, so a 0.35 m beam is walkable. The step up
    // onto the first one is there because a beam you cannot get onto tests
    // nothing.
    course.add(box(1.2, 0.6, 1.2, this.materials.platform, -14, 0, 7.4));
    z = 8.4;
    for (const width of [0.9, 0.7, 0.5, 0.35]) {
      course.add(box(width, 1.2, 2.4, this.materials.platform, -14, 0, z));
      // A metre of air between them, so each beam is arrived at rather than
      // walked onto — landing on a narrow thing is the harder half.
      z += 3.4;
    }

    // --- the squeeze --------------------------------------------------------
    //
    // Pairs of blocks with the gap stepped either side of the capsule's
    // diameter. 0.55 must not admit you and 0.75 must, which makes this the one
    // fixture that would notice a change to the player's radius.
    z = 8;
    for (const gap of [0.55, 0.65, 0.75, 0.9]) {
      for (const side of [-1, 1]) {
        course.add(
          box(1.4, 2, 0.6, this.materials.wall, -18 + side * (gap / 2 + 0.7), 0, z),
        );
      }
      z += 2.6;
    }

    parent.add(course);
  }

  /**
   * A walkway off the top of the steepest ramp, four metres up. Hung off the
   * ramp rather than standing alone because the height has to be reachable on
   * foot — a drop you can only reach by cheating tests nothing.
   */
  private addFallWalkway(parent: THREE.Group): void {
    parent.add(box(2.5, 0.2, 8, this.materials.platform, -18, 3.8, -12));
  }

  /**
   * Fixtures for judging the render pipeline. North-east of spawn, facing you.
   *
   * Flat unlit swatches show what quantization does to a colour chosen
   * deliberately. A greyscale ramp is the worst case for banding and the best
   * case for seeing what the dither is doing. A *smooth-shaded* sphere and a
   * tilted lit plane are there because the rest of the game is flat-shaded, and
   * flat shading hides banding.
   */
  private addCalibrationBoard(): void {
    const board = new THREE.Group();
    board.name = 'CalibrationBoard';
    const x = 7;
    const z = -12;

    board.add(markCollidable(box(12, 6, 0.3, this.materials.wall, x, 0, z)));

    // Unlit, so what reaches the pipeline is exactly the colour named here.
    const swatches = [
      [0xff0000, 0x00ff00, 0x0000ff, 0xffffff],
      [0x00ffff, 0xff00ff, 0xffff00, 0x000000],
      [0x333333, 0x666666, 0x999999, 0xcccccc],
      [0x8d9491, 0x5c3a2e, 0xb08040, 0x2e3640],
    ];
    const swatch = 0.9;
    swatches.forEach((row, rowIndex) => {
      row.forEach((color, columnIndex) => {
        const tile = new THREE.Mesh(
          new THREE.PlaneGeometry(swatch, swatch),
          new THREE.MeshBasicMaterial({ color }),
        );
        tile.position.set(
          x - 4.6 + columnIndex * (swatch + 0.15),
          5.1 - rowIndex * (swatch + 0.15),
          z + 0.16,
        );
        board.add(tile);
      });
    });

    board.add(ramp2d(5.2, 0.7, x + 2.6, 4.3, z + 0.16, (t) => [t, t, t]));
    board.add(ramp2d(5.2, 0.7, x + 2.6, 3.4, z + 0.16, (t) => [t, t * 0.35, 0.12]));
    board.add(ramp2d(5.2, 0.7, x + 2.6, 2.5, z + 0.16, (t) => [0.1, t * 0.6, t]));

    // The two smooth-shaded fixtures flank the board rather than standing in
    // front of it — they are read *alongside* the swatches and ramps, not
    // instead of them, and anything hanging in mid-air in front of a test
    // chart just looks like something went wrong.

    // Smooth shading, deliberately: everything else in the game is faceted,
    // and faceting hides banding by breaking gradients into flat plates.
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.1, 48, 32),
      new THREE.MeshLambertMaterial({ color: 0x8d9491 }),
    );
    sphere.position.set(x - 8.5, 1.1, z);
    board.add(markCollidable(sphere));

    // A panel leaning back off the ground, raked across the light. A curve
    // bands differently from a plane — the sphere's gradient turns fastest at
    // its edges, this one is broad and shallow all the way across, which is
    // the case that bands worst.
    const lean = Math.PI / 6;
    const rake = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 4),
      new THREE.MeshLambertMaterial({ color: 0x6f7a7d, side: THREE.DoubleSide }),
    );
    // Half the height times cos(lean) puts the bottom edge exactly on the
    // ground, so it stands like a board propped against something. To the left
    // of the board rather than the right: the rooms start at x = 15 and a
    // six-metre panel on that side runs through the hall wall.
    rake.position.set(x - 13.5, 2 * Math.cos(lean), z);
    rake.rotation.x = -lean;
    board.add(markCollidable(rake));

    this.root.add(board);
  }

  dispose(): void {
    this.root.traverse((object) => {
      if (
        object instanceof THREE.Mesh ||
        object instanceof THREE.LineSegments ||
        object instanceof THREE.Points
      ) {
        object.geometry.dispose();
        const material = object.material;
        if (Array.isArray(material)) {
          for (const m of material) m.dispose();
        } else {
          material.dispose();
        }
      }
    });
    this.root.clear();
  }
}
