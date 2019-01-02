import * as t from 'io-ts';
import { start } from './Base';

export { literal } from 'io-ts';

export const nullType = start(t.null);
export { nullType as null };

export const undefinedType = start(t.undefined);
export { undefinedType as undefined };

export const never = start(t.never);
