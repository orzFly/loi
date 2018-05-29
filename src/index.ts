import * as t from 'io-ts';

export type TypeOf<RT extends t.Any> = RT['_A'];

export { start, LoiFactoryBase } from './types/Base';
export { any, LoiFactoryAny } from './types/Any';
export { boolean, LoiFactoryBoolean, LoiFactoryBooleanInitial } from './types/Boolean';
export { number, LoiFactoryNumber } from './types/Number';
export { string, LoiFactoryString } from './types/String';
export { array, LoiFactoryArray } from './types/Array';
export { object, LoiFactoryObject, LoiFactoryObjectInitial } from './types/Object';
export { enumeration, LoiFactoryEnum } from './types/Enum';
export { date, LoiFactoryDate } from './types/Date';
export { set } from './types/Set';

export { validate } from './helpers/validate';
export { ensureSameType, ensureTypeSame } from './helpers/ensureSameType';