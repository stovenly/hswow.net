import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A broad patch of rough grass, with seed heads standing out of it.
 *
 * About ten times the ground of `small-grass-clump` from a single placement.
 * That ratio is the point: a field laid with tufts is hundreds of objects and
 * hundreds of draw calls, and the tuft is the wrong unit for it — you place it
 * to break an edge or fill a gap, not to cover an acre.
 *
 * **It is not the small one scaled up.** A tuft is a dome: dense in the middle,
 * thinning evenly to the rim, because that is what one plant looks like. Ten
 * square feet of rough ground is not one plant, and a patch built as a giant
 * dome reads exactly like what it is — a tuft somebody enlarged. Three things
 * make the difference:
 *
 * - **Uneven density.** A handful of thicker knots scattered through the patch,
 *   with sparser ground between them, so the cover varies across it the way
 *   grazing and shade actually vary.
 * - **Two heights at once.** Short cropped blades everywhere, and taller
 *   coarser ones in the knots — rough ground is never one length.
 * - **Seed heads.** A scatter of flowering culms standing well clear of the
 *   sward, each a bare stem with a loose head on it. These are what read from
 *   any distance: the blades below merge into a green mass at ten metres and
 *   the culms are still individually visible, so they carry the whole texture
 *   of the patch on their own.
 *
 * Blades are three-sided cones squashed flat, the same trick the tuft uses:
 * crossed quads need an alpha-cut texture and there are none here, and a cone
 * flattened on one axis is three triangles that read from every angle.
 */
export const largeGrassClump: MeshBuilder = {
  name: 'large-grass-clump',
  category: 'foliage',
  radius: 1.6,
  // Walked straight through. A patch of grass that stops the player is the
  // fastest way to make a world feel like a floor with boxes on it — and at
  // this size it would be a wall.
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // Ten times the area of the tuft's 0.26 m disc, so a little over three
    // times the radius.
    const patch = rng.range(0.7, 0.95);

    // --- knots ---------------------------------------------------------------
    //
    // Where the grass is thickest. Rolled first so the blades below can be
    // drawn toward them, which is what makes the density uneven rather than
    // merely noisy.
    // More of them, wider, and spread further out than they were. With three
    // narrow knots the patch came out as a few tussocks with bald ground
    // between — density *variation* is wanted, bare earth is not, and the two
    // are only a couple of numbers apart.
    const knots = rng.int(5, 8);
    const knotAt: { x: number; z: number; grip: number }[] = [];
    for (let i = 0; i < knots; i++) {
      // Spread over most of the patch rather than pulled toward the middle, so
      // the knots overlap each other and the cover joins up.
      const a = (i / knots) * Math.PI * 2 + rng.range(-0.5, 0.5);
      const away = rng.range(0.25, 0.85) * patch;
      knotAt.push({
        x: Math.cos(a) * away,
        z: Math.sin(a) * away,
        grip: rng.range(0.24, 0.42),
      });
    }

    // --- the sward -----------------------------------------------------------
    // Half again as many. The patch is ten times the tuft's area and was
    // carrying under ten times its blades, which is why it read thin — the
    // shortfall is invisible in the numbers and obvious the moment you stand
    // in it.
    const blades = rng.int(430, 620);
    for (let i = 0; i < blades; i++) {
      // Half the blades are pulled into a knot and half are spread evenly over
      // the whole patch. The even half is the floor: it guarantees cover
      // everywhere, and the knots vary the density on top of it rather than
      // being the only thing supplying it.
      let bx: number;
      let bz: number;
      let coarse = false;
      if (rng.chance(0.5)) {
        const knot = knotAt[rng.int(0, knotAt.length - 1)];
        const a = rng.range(0, Math.PI * 2);
        const away = Math.sqrt(rng()) * knot.grip;
        bx = knot.x + Math.cos(a) * away;
        bz = knot.z + Math.sin(a) * away;
        coarse = true;
      } else {
        const a = rng.range(0, Math.PI * 2);
        const away = Math.sqrt(rng()) * patch;
        bx = Math.cos(a) * away;
        bz = Math.sin(a) * away;
      }

      // Taller and coarser in the knots, cropped short between them.
      const height = coarse ? rng.range(0.3, 0.72) : rng.range(0.1, 0.34);
      const blade = new THREE.ConeGeometry(rng.range(0.014, 0.03), height, 3);
      blade.translate(0, height / 2, 0);
      blade.scale(1, 1, rng.range(0.3, 0.55));
      // Taller blades flop further, so a knot is domed rather than flat-topped.
      const droop = rng.range(0.1, 0.8) * (height / 0.72);
      blade.rotateZ(rng.chance(0.5) ? droop : -droop);
      blade.rotateY(rng.range(0, Math.PI * 2));
      blade.translate(bx, 0, bz);

      parts.push({
        geometry: blade,
        color: rng.chance(coarse ? 0.2 : 0.4) ? PALETTE.GRASS_DRY : PALETTE.GRASS,
        // Free at the tip, pinned at the root — the classic grass profile.
        //
        // Clamped before the power, not after. Tilting a blade rotates its base
        // vertices fractionally below y = 0, and a negative base raised to a
        // fractional exponent is NaN, which would go straight into the vertex
        // buffer and take the whole mesh with it.
        sway: (_x, y) => Math.max(0, y / height) ** 1.5,
      });
    }

    // --- seed heads ----------------------------------------------------------
    //
    // The part that reads at distance. A bare culm well clear of the sward with
    // a loose head on the end, mostly rising out of the knots — which is where
    // grass gets tall enough to flower.
    const culms = rng.int(14, 26);
    for (let i = 0; i < culms; i++) {
      const knot = knotAt[rng.int(0, knotAt.length - 1)];
      const a = rng.range(0, Math.PI * 2);
      const away = Math.sqrt(rng()) * (rng.chance(0.7) ? knot.grip * 1.4 : patch);
      const cx = (rng.chance(0.7) ? knot.x : 0) + Math.cos(a) * away;
      const cz = (rng.chance(0.7) ? knot.z : 0) + Math.sin(a) * away;

      const tall = rng.range(0.6, 1.05);
      const lean = rng.range(0.05, 0.34);
      const leanAt = rng.range(0, Math.PI * 2);
      const bend = Math.cos(leanAt) * lean;
      const roll = Math.sin(leanAt) * lean;

      const culm = new THREE.CylinderGeometry(0.0035, 0.006, tall, 4);
      culm.translate(0, tall / 2, 0);
      culm.rotateX(bend);
      culm.rotateZ(roll);
      culm.translate(cx, 0, cz);
      parts.push({
        geometry: culm,
        color: shade(PALETTE.GRASS_DRY, rng.range(0.9, 1.1)),
        sway: (_x, y) => Math.max(0, y / tall) ** 1.3,
      });

      /**
       * A point on the culm, at `t` of its length.
       *
       * **Taken from the same two rotations the geometry got**, so a spikelet
       * cannot be anywhere the stalk is not. The head used to be placed at the
       * tip's x and z and then stepped straight *down in world Y* — which is
       * only where the stalk is when the stalk is vertical. Every culm leans,
       * by up to nineteen degrees, so the lower spikelets hung in clear air
       * beside their own stem and the whole head came away from it.
       *
       * The same mistake the flowers made and the same fix: ask the transform
       * where the stem is rather than working it out again by hand.
       */
      const axisAt = (t: number): THREE.Vector3 =>
        _axis
          .set(0, t * tall, 0)
          .applyAxisAngle(X_AXIS, bend)
          .applyAxisAngle(Z_AXIS, roll)
          .add(_base.set(cx, 0, cz));

      // The head: a few small spikelets stepping down the top of the culm,
      // which is a panicle near enough at this size. One blob would be a
      // bulrush, and a bulrush is a different plant that is already in the kit.
      const spikelets = rng.int(3, 6);
      const headLong = rng.range(0.14, 0.24);
      for (let s = 0; s < spikelets; s++) {
        const along = s / spikelets;
        const size = 0.011 * (1 - along * 0.4);
        const length = size * rng.range(3, 4.5);
        const grain = new THREE.ConeGeometry(size, length, 3);
        // Base exactly on the origin, so rotating pivots it about the point
        // where it meets the stem and the join stays shut. Half the height was
        // being approximated by a constant before, which left every spikelet a
        // few millimetres off its own attachment.
        grain.translate(0, length / 2, 0);
        grain.scale(1, 1, 0.6);
        // Out and down off the stem, which is how a grass head hangs.
        grain.rotateZ(rng.range(0.5, 1.1));
        grain.rotateY((s / spikelets) * Math.PI * 2 + rng.range(0, 0.6));
        // Down the culm itself, as a fraction of its length.
        const at = axisAt(1 - headLong * along);
        grain.translate(at.x, at.y, at.z);
        parts.push({
          geometry: grain,
          color: shade(rng.chance(0.4) ? 0x9c8f5c : PALETTE.GRASS_DRY, rng.range(0.9, 1.12)),
          sway: 1,
        });
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'large-grass-clump', rng() * Math.PI * 2);
  },
};

const X_AXIS = new THREE.Vector3(1, 0, 0);
const Z_AXIS = new THREE.Vector3(0, 0, 1);
/** Reused across culms. One patch is built at a time and never concurrently. */
const _axis = new THREE.Vector3();
const _base = new THREE.Vector3();
