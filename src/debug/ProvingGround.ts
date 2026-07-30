import * as THREE from 'three';

/**
 * The Proving Ground: a permanent debug level that accumulates test fixtures as
 * each phase lands. Nothing here is game content — it exists so systems can be
 * exercised in isolation, at known scale, against known reference geometry.
 *
 * Phase 0 fixtures: ground grid, a 1.8 m height reference, measured cubes, and
 * distance markers for judging fog and audio falloff later.
 */

const COLOR = {
  ground: 0x1e2733,
  gridMajor: 0x3d4a54,
  gridMinor: 0x141a24,
  bandLight: 0xdcdcc8,
  bandDark: 0x5c3a2e,
  cube: 0x525f66,
  marker: 0xb08040,
} as const;

/** Flat shading everywhere — this is the low-poly look the whole game uses. */
function surface(color: number): THREE.MeshLambertMaterial {
  return new THREE.MeshLambertMaterial({ color, flatShading: true });
}

export class ProvingGround {
  readonly root = new THREE.Group();

  constructor() {
    this.root.name = 'ProvingGround';
    this.addLighting();
    this.addGround();
    this.addHeightReference();
    this.addMeasuredCubes();
    this.addDistanceMarkers();
  }

  private addLighting(): void {
    // Lighting is physically-based since three r155, hence the intensities > 1.
    const sky = new THREE.HemisphereLight(0x87908d, 0x141a24, 1.6);
    const sun = new THREE.DirectionalLight(0xf2efdd, 1.8);
    sun.position.set(-8, 12, 6);
    this.root.add(sky, sun);
  }

  private addGround(): void {
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(64, 64), surface(COLOR.ground));
    plane.rotation.x = -Math.PI / 2;
    // Nudged down so the grid lines sit clearly on top instead of z-fighting.
    plane.position.y = -0.01;
    this.root.add(plane);

    this.root.add(new THREE.GridHelper(64, 64, COLOR.gridMajor, COLOR.gridMinor));
    this.root.add(new THREE.AxesHelper(2));
  }

  /**
   * A 1.8 m pole banded every 0.3 m. Eye height and step height get tuned
   * against this in Phase 1, so it wants to be unambiguous at a glance.
   */
  private addHeightReference(): void {
    const group = new THREE.Group();
    const bandHeight = 0.3;
    const bands = 6;

    for (let i = 0; i < bands; i++) {
      const band = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, bandHeight, 0.08),
        surface(i % 2 === 0 ? COLOR.bandLight : COLOR.bandDark),
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
      const cube = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), surface(COLOR.cube));
      cube.position.set(x + size / 2, size / 2, 0);
      this.root.add(cube);
      x += size + 1;
    }
  }

  /** Posts at known distances down -Z, for fog tuning and audio falloff checks. */
  private addDistanceMarkers(): void {
    for (const distance of [5, 10, 20, 30]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2, 0.1), surface(COLOR.marker));
      post.position.set(0, 1, -distance);
      this.root.add(post);
    }
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
