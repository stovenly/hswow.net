import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { fenceHeight, postGeometry, rollPost } from './fence';

export interface FencePostOptions extends BuildOptions {
  /** The run this post finishes, so it matches its height. See `FenceOptions.run`. */
  run?: number;
}

/**
 * One fence post, and nothing else.
 *
 * The other half of `fence`'s contract. A run carries a post at the near end of
 * every section and none at its far end, so something has to supply the last
 * one: stand this at the end and the fence is finished, butt another fence
 * against it instead and the run carries on. Either way there is a post where a
 * post belongs and no post where one does not.
 *
 * Deliberately bare — no crossbar, no collar, no cap. `post` is the leaning
 * marker post that carries all of that, and it is a different object for a
 * different job. This one has to be indistinguishable from the posts in the run
 * beside it, which is why both its geometry and its height band come out of
 * `fence.ts` rather than being written again here.
 */
export const fencePost: BuilderWith<FencePostOptions> = {
  name: 'fence-post',
  category: 'structures',
  radius: 0.2,

  build({ seed = 1, scale = 1, run }: FencePostOptions = {}) {
    const rng = createRng(seed);
    // Plumb, and off the run's own height. It stands where the piece before it
    // aimed its last rails, so it is the one post that cannot lean.
    const post = rollPost(rng, 0, 0, fenceHeight(createRng(run ?? seed)), true);
    const parts: Part[] = [
      {
        geometry: postGeometry(post),
        color: shade(PALETTE.TIMBER, rng.range(0.94, 1.06)),
        sway: 0,
      },
    ];

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'fence-post', 0);
  },
};
