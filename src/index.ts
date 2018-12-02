import * as t from 'io-ts';

export type Any = t.Type<any, any, any>;
export type TypeOf<RT extends t.Any> = RT['_A'];
export type InputOf<RT extends t.Any> = RT['_I'];
export type OutputOf<RT extends t.Any> = RT['_O'];

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
export { taggedUnion } from './types/TaggedUnion';
export { literal, never, null, undefined } from 'io-ts';

export { LoiDecoratorConvert } from './decorators/convert';
export { LoiDecoratorDefault, LoiDecoratorDefaultResolver } from './decorators/default';
export { LoiDecoratorNullAsUndefined } from './decorators/nullAsUndefined';
export { LoiDecoratorUndefinedable } from './decorators/undefinedable';
export { LoiDecoratorNullable } from './decorators/nullable';

export { validate, validateOrReturn, validateOrThrow } from './helpers/validate';
export { LoiValidationError, LoiValidationErrorItem, LoiValidationResult, createError } from './helpers/error';
export { createMessage } from './helpers/message';
export { ensureSameType, ensureTypeSame } from './helpers/ensureSameType';