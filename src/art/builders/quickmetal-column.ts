import { finishColumn } from '../fixture';
import { PALETTE, shade } from '../palette';

/** A crawling reflection wants a big flat face, and a drum is the biggest here. */
export const quickmetalColumn = finishColumn('quickmetal-column', shade(PALETTE.CHROME, 0.74), 'quickmetal');
