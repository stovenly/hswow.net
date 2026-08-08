import { finishDrape } from '../fixture';
import { PALETTE } from '../palette';

/**
 * Anisotropy and sheen together. The grain runs across the bolt rather than up
 * it, so the stretch crosses the folds instead of following them — which is the
 * only way to see that the stretch is a direction and not a blur.
 */
export const silkDrape = finishDrape('silk-drape', PALETTE.CLOTH, 'silk', [1, 0, 0]);
