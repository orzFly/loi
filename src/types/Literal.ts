import * as t from '../iots';
import { start } from './Base';

export { literal } from '../iots';

export const nullType = start(t.null);
export { nullType as null };

export const undefinedType = start(t.undefined);
export { undefinedType as undefined };

export const never = start(t.never);
