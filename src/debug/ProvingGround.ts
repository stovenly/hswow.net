import * as THREE from 'three';
import { markCollidable } from '../player/Collider';

/**
 * The Proving Ground: a permanent debug level that accumulates test fixtures as
 * each phase lands. Nothing here is game content — it exists so systems can be
 * exercised in isolation, at known scale, against known reference geometry.
 *
 * Phase 0 fixtures: ground grid, a 1.8 m height reference, measured cubes, and
 * distance markers for judging fog and audio falloff later.
 *
 * Phase 1 adds the movement gym, west of the origin: ramps at four angles,
 * two stair pitches, kerbs at the step-up threshold, calibrated jump gaps, a
 * strafe wall with a corner, and a high walkway to fall off.
 */

export type SurfaceName =
  | 'ground'
  | 'cube'
  | 'marker'
  | 'ramp'
  | 'stair'
  | 'platform'
  | 'wall'
  | 'bark'
  | 'foliage'
  | 'metal'
  | 'creature';

/**
 * Warm ground, cool everything else.
 *
 * Hue is doing the work here rather than brightness. Quantizing to a handful
 * of levels collapses close values together, so a scene built entirely from
 * one family of blue-greys arrives at the dither as very nearly a single
 * colour, and the dither pattern becomes the only thing with any structure in
 * it. Splitting the floor onto the opposite side of the colour wheel from
 * everything you can climb survives quantization, because the levels are
 * per-channel and the channels now disagree.
 */
const DEFAULT_SURFACES: Record<SurfaceName, string> = {
  ground: '#4c4536',
  cube: '#525f66',
  marker: '#b08040',
  ramp: '#38474a',
  stair: '#3d4b52',
  platform: '#46505c',
  wall: '#2e3640',
  bark: '#463b30',
  foliage: '#4f6039',
  metal: '#6a6f74',
  creature: '#b8a06a',
};

/** Baked into geometry at construction, so these are not live-editable. */
const GRID_MAJOR = 0x6b6247;
const GRID_MINOR = 0x3a3527;
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
 * A wedge you can walk up, rising along -Z over `run` metres.
 *
 * Extruded from a right-triangle profile rather than built from a tilted box,
 * so the foot of the slope actually meets the ground at zero height — a tilted
 * box leaves a lip, and a lip is exactly the thing that makes slope handling
 * look broken when it isn't.
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
 * An unlit strip whose colour sweeps left to right, for judging banding.
 *
 * Vertex colours are set through `SRGBColorSpace` so the ramp is even to the
 * eye rather than even in linear light — a linear sweep spends most of its
 * width in the highlights, which is the half that never bands.
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
   *
   * Held as strings rather than as `THREE.Color` so the colour picker and the
   * material agree: a `Color` stores linear light, and a picker showing those
   * numbers as if they were sRGB shows the wrong colour and sets a wronger one.
   */
  readonly colors: Record<SurfaceName, string> = { ...DEFAULT_SURFACES };

  /** One material per surface family, shared by every fixture that uses it. */
  private readonly materials = {} as Record<SurfaceName, THREE.MeshLambertMaterial>;

  /** Exposed so the tuning panel can balance them against the sky. */
  readonly lights = {} as { sky: THREE.HemisphereLight; sun: THREE.DirectionalLight };

  /**
   * Where the Phase 3 emitters live. Positions rather than objects, because a
   * sound is attached to a place, not to a mesh — and Phase 5 will read these
   * out of zone data rather than off the scene graph.
   */
  readonly anchors = {
    tree: new THREE.Vector3(14, 3.6, 12),
    bush: new THREE.Vector3(10.5, 0.5, 15.5),
    bird: new THREE.Vector3(14.9, 4.1, 11.4),
    machine: new THREE.Vector3(22, 1.1, -12),
  };

  /**
   * The two rooms, for acoustics. Interiors only — the walls sit outside these
   * bounds, so a listener inside the box is genuinely inside the room.
   */
  readonly rooms = [
    { name: 'hall' as const, min: new THREE.Vector3(15, 0, -18), max: new THREE.Vector3(29, 7, -4) },
    { name: 'cell' as const, min: new THREE.Vector3(19, 0, -4), max: new THREE.Vector3(27, 3, 4) },
  ];

  private wheel: THREE.Mesh | null = null;

  constructor() {
    this.root.name = 'ProvingGround';

    for (const name of Object.keys(this.colors) as SurfaceName[]) {
      // Flat shading everywhere — this is the low-poly look the whole game uses.
      this.materials[name] = new THREE.MeshLambertMaterial({
        color: this.colors[name],
        flatShading: true,
      });
    }

    this.addLighting();
    this.addGround();
    this.addHeightReference();
    this.addMeasuredCubes();
    this.addDistanceMarkers();
    this.addMovementGym();
    this.addCalibrationBoard();
    this.addSoundGarden();
    this.addRooms();
  }

  /** Spins the machine's wheel. Purely so the sound has something to belong to. */
  update(dt: number, rpm: number): void {
    if (this.wheel) this.wheel.rotation.z += (rpm / 60) * Math.PI * 2 * dt;
  }

  /** Which room's acoustics the listener is standing in, if any. */
  roomAt(position: THREE.Vector3): 'hall' | 'cell' | null {
    for (const room of this.rooms) {
      if (
        position.x > room.min.x &&
        position.x < room.max.x &&
        position.z > room.min.z &&
        position.z < room.max.z &&
        position.y < room.max.y
      ) {
        return room.name;
      }
    }
    return null;
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

  private addLighting(): void {
    // Lighting is physically-based since three r155, hence the intensities > 1.
    //
    // The hemisphere light's two colours are the sky above and the ground
    // below, and they are set to match the actual sky and the actual floor.
    // That is not decoration: a bright blue dome over a scene lit as though it
    // were overcast is the single fastest way to make a sky look pasted on.
    this.lights.sky = new THREE.HemisphereLight(0x9dc4e8, 0x4c4536, 1.5);
    this.lights.sun = new THREE.DirectionalLight(0xfff2d8, 2.2);
    this.lights.sun.position.set(-8, 12, 6);
    this.root.add(this.lights.sky, this.lights.sun);
  }

  private addGround(): void {
    // Subdivided into metre cells rather than left as two enormous triangles:
    // the collider's broad phase indexes by triangle, and a triangle spanning
    // the whole level is a candidate for every query no matter where you are.
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(64, 64, 64, 64), this.materials.ground);
    plane.rotation.x = -Math.PI / 2;
    // Nudged down so the grid lines sit clearly on top instead of z-fighting.
    plane.position.y = -0.01;
    this.root.add(markCollidable(plane));

    // Helpers are line geometry, so the collider ignores them without being told.
    this.root.add(new THREE.GridHelper(64, 64, GRID_MAJOR, GRID_MINOR));
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
    this.addStrafeWall(gym);
    this.addFallWalkway(gym);

    this.root.add(markCollidable(gym));
  }

  /**
   * Four slopes, shallow to steep, left to right: 10°, 20°, 30°, 45°.
   *
   * The slope limit sits between two of these on purpose — the point is to see
   * where walking stops and sliding starts, and to be able to move that line
   * with the tuning panel and watch it change.
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
  }

  /**
   * Two pitches: an ordinary stair at 31°, and a steep one at 45°.
   *
   * Both are within the slope limit on purpose. A staircase is climbed as a
   * sequence of ledges, but it is *felt* as a slope, and one pitched past the
   * limit reads to the player as an invisible wall rather than as stairs.
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
   * Isolated ledges bracketing the step height, from a kerb to waist height.
   *
   * The two low ones should be walked over without thinking about it and the
   * tall one should stop you dead. The 0.5 m is the interesting case: it sits
   * just past the step height, and it is climbed anyway, because the capsule's
   * own shoulder carries it. That is the practical ceiling, and knowing where
   * it is matters more than pretending the tuning value is exact.
   */
  private addKerbs(parent: THREE.Group): void {
    [0.2, 0.35, 0.5, 0.9].forEach((height, index) => {
      parent.add(box(3, height, 2, this.materials.platform, -8 - index * 4, 0, 5));
    });
  }

  /**
   * Gaps of 1.5, 2.5 and 3.5 m at a height that punishes a miss.
   *
   * With the default tuning these are, in order: a walking jump, a jump that
   * needs a run-up, and one that needs a sprint. If that stops being true after
   * a tuning pass, the numbers here are the thing that noticed.
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

  /** A long face to slide along, and a corner to get caught on. */
  private addStrafeWall(parent: THREE.Group): void {
    parent.add(box(0.4, 3, 16, this.materials.wall, -4, 0, 8));
    parent.add(box(6, 3, 0.4, this.materials.wall, -7, 0, 0.2));
  }

  /**
   * A walkway off the top of the steepest ramp, four metres up.
   *
   * Hung off the ramp rather than standing alone because the height has to be
   * reachable on foot — a drop you can only reach by cheating tests nothing.
   * Walk up the 45°, out along the plank, and off the end.
   */
  private addFallWalkway(parent: THREE.Group): void {
    parent.add(box(2.5, 0.2, 8, this.materials.platform, -18, 3.8, -12));
  }

  /**
   * Fixtures for judging the render pipeline. North-east of spawn, facing you.
   *
   * The four of them answer different questions. Flat unlit swatches show what
   * quantization does to a colour you chose deliberately. A greyscale ramp is
   * the worst case for banding and the best case for seeing what the dither is
   * actually doing. A *smooth-shaded* sphere and a tilted lit plane are there
   * because the whole rest of the game is flat-shaded, and flat shading hides
   * banding — the gradients that band are the ones you have to go looking for.
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
    // ground, so it stands like a board propped against something.
    //
    // Placed to the *left* of the board, beyond the sphere, rather than to the
    // right: the rooms start at x = 15 and a six-metre panel on that side runs
    // straight through the hall wall.
    rake.position.set(x - 13.5, 2 * Math.cos(lean), z);
    rake.rotation.x = -lean;
    board.add(markCollidable(rake));

    this.root.add(board);
  }

  /**
   * Things for the Phase 3 emitters to be attached to.
   *
   * A sound with nothing where it is coming from does not read as a sound in
   * the world, it reads as a fault. These are crude on purpose — Phase 4 is
   * where meshes get built properly — but they are the difference between
   * testing spatial audio and guessing at it.
   */
  private addSoundGarden(): void {
    const garden = new THREE.Group();
    garden.name = 'SoundGarden';

    garden.add(this.tree(this.anchors.tree.x, this.anchors.tree.z));
    garden.add(this.bush(this.anchors.bush.x, this.anchors.bush.z, 1));
    garden.add(this.bush(9.2, 16.8, 0.75));
    garden.add(this.bird());
    garden.add(this.machine());

    this.root.add(garden);
  }

  private tree(x: number, z: number): THREE.Group {
    const group = new THREE.Group();

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.3, 3.4, 6),
      this.materials.bark,
    );
    trunk.position.set(x, 1.7, z);
    group.add(markCollidable(trunk));

    // Three overlapping lumps rather than one: a single blob reads as a
    // lollipop, and the canopy is where the rustle is supposed to come from.
    const canopy: [number, number, number, number][] = [
      [0, 3.7, 0, 1.35],
      [0.75, 3.2, 0.35, 0.95],
      [-0.6, 3.35, -0.5, 1.05],
    ];
    for (const [dx, dy, dz, radius] of canopy) {
      const lump = new THREE.Mesh(
        new THREE.IcosahedronGeometry(radius, 0),
        this.materials.foliage,
      );
      lump.position.set(x + dx, dy, z + dz);
      lump.rotation.set(Math.random(), Math.random(), Math.random());
      group.add(lump);
    }

    return group;
  }

  private bush(x: number, z: number, scale: number): THREE.Group {
    const group = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const lump = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.55 * scale, 0),
        this.materials.foliage,
      );
      lump.position.set(
        x + (Math.random() - 0.5) * 0.9 * scale,
        0.36 * scale + Math.random() * 0.2,
        z + (Math.random() - 0.5) * 0.9 * scale,
      );
      lump.rotation.set(Math.random(), Math.random(), Math.random());
      group.add(lump);
    }
    return group;
  }

  /** A small thing perched in the tree, to hang the birdsong on. */
  private bird(): THREE.Group {
    const group = new THREE.Group();
    const at = this.anchors.bird;

    const body = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16, 0), this.materials.creature);
    body.position.copy(at);
    body.scale.set(1, 0.85, 1.3);

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.14, 4), this.materials.marker);
    beak.position.set(at.x, at.y + 0.02, at.z + 0.2);
    beak.rotation.x = Math.PI / 2;

    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.26, 4), this.materials.creature);
    tail.position.set(at.x, at.y + 0.03, at.z - 0.22);
    tail.rotation.x = -Math.PI / 2;

    group.add(body, beak, tail);
    return group;
  }

  /** A machine, deliberately inside the hall so it can be heard through a wall. */
  private machine(): THREE.Group {
    const group = new THREE.Group();
    const at = this.anchors.machine;

    group.add(markCollidable(box(1.8, 1.6, 1.2, this.materials.metal, at.x, 0, at.z)));

    // Exposed flywheel: what is actually making the noise, turning at the rate
    // the clank fires.
    this.wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.7, 0.16, 12),
      this.materials.metal,
    );
    this.wheel.position.set(at.x + 1.05, 1.2, at.z);
    this.wheel.rotation.x = Math.PI / 2;
    group.add(this.wheel);

    for (let i = 0; i < 4; i++) {
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 1.3, 0.08),
        this.materials.marker,
      );
      spoke.rotation.z = (i / 4) * Math.PI;
      this.wheel.add(spoke);
    }

    const pipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 2.6, 8),
      this.materials.metal,
    );
    pipe.position.set(at.x - 0.6, 2.4, at.z);
    group.add(pipe);

    return group;
  }

  /**
   * Two rooms sharing a wall, with a doorway between them.
   *
   * They are as acoustically unalike as the presets allow — a low dead cell
   * and a tall hard hall — because the Phase 3 acceptance test is whether
   * walking through that doorway is *obviously* a different place, and a
   * subtle difference proves nothing.
   */
  private addRooms(): void {
    const rooms = new THREE.Group();
    rooms.name = 'Rooms';
    const t = 0.4;
    const wall = this.materials.wall;

    // --- hall: 14 x 14, seven metres to the ceiling ------------------------
    rooms.add(box(14 + t * 2, 7, t, wall, 22, 0, -18 - t / 2));
    rooms.add(box(t, 7, 14, wall, 15 - t / 2, 0, -11));
    rooms.add(box(t, 7, 14, wall, 29 + t / 2, 0, -11));
    rooms.add(box(14 + t * 2, t, 14 + t * 2, wall, 22, 7, -11));

    // Shared wall at z = -4, with a 2 m doorway at x 22..24 and a lintel over it.
    rooms.add(box(7, 7, t, wall, 18.5, 0, -4));
    rooms.add(box(5, 7, t, wall, 26.5, 0, -4));
    rooms.add(box(2, 4.6, t, wall, 23, 2.4, -4));

    // --- cell: 8 x 8, three metres, and dead ------------------------------
    rooms.add(box(t, 3, 8, wall, 19 - t / 2, 0, 0));
    rooms.add(box(t, 3, 8, wall, 27 + t / 2, 0, 0));
    rooms.add(box(8 + t * 2, t, 8, wall, 23, 3, 0));

    // Outer door, so the pair can be walked into from the open ground.
    rooms.add(box(3, 3, t, wall, 20.5, 0, 4));
    rooms.add(box(3, 3, t, wall, 25.5, 0, 4));
    rooms.add(box(2, 0.6, t, wall, 23, 2.4, 4));

    this.root.add(markCollidable(rooms));
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
