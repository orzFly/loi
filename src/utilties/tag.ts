import * as t from 'io-ts';

export const loiDecoratorTypeTag = Symbol('loiDecoratorTypeTag')
export const loiCompoundTypeTag = Symbol('loiCompoundTypeTag')
export const loiUnionTypeTag = Symbol('loiUnionTypeTag')
export const loiArrayTypeTag = Symbol('loiArrayTypeTag')
export const loiDictTypeTag = Symbol('loiDictTypeTag')

/** @internal */
export function getTypeTag(type: t.Any | t.Decoder<any, any>): string | undefined {
  if (!type) return undefined;

  const tag = (<any>type)._tag;
  if (tag === null || tag === undefined) return undefined;

  return tag;
}

/** @internal */
export function getRealTypeTag(type: t.Any | t.Decoder<any, any>): string | undefined {
  const tag = getTypeTag(type);
  if (tag === undefined) return tag;
  return isDecoratorType(type) ? getRealTypeTag((<any>type).type) : tag;
}

/** @internal */
export function isDecoratorType(type: t.Any | t.Decoder<any, any>): boolean {
  const tag = getTypeTag(type);
  return !!tag && !!(<any>type).type && (!!(<any>type)[loiDecoratorTypeTag] || ['RefinementType', 'ReadonlyType'].indexOf(tag) >= 0);
}

/** @internal */
export function isCompoundType(type: t.Any | t.Decoder<any, any>): boolean {
  const tag = getRealTypeTag(type);
  return !!tag && (!!(<any>type)[loiCompoundTypeTag] || ['UnionType', 'IntersectionType'].indexOf(tag) >= 0);
}

/** @internal */
export function isUnionType(type: t.Any | t.Decoder<any, any>): boolean {
  const tag = getRealTypeTag(type);
  return !!tag && (!!(<any>type)[loiUnionTypeTag] || ['UnionType'].indexOf(tag) >= 0);
}

/** @internal */
export function isArrayType(type: t.Any | t.Decoder<any, any>): boolean {
  const tag = getRealTypeTag(type);
  return !!tag && (!!(<any>type)[loiArrayTypeTag] || ['ReadonlyArrayType', 'ArrayType', 'AnyArrayType', 'TupleType'].indexOf(tag) >= 0);
}

/** @internal */
export function isDictType(type: t.Any | t.Decoder<any, any>): boolean {
  const tag = getRealTypeTag(type);
  return !!tag && (!!(<any>type)[loiDictTypeTag] || ['DictionaryType', 'AnyDictionaryType'].indexOf(tag) >= 0);
}
