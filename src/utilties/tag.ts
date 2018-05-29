import * as t from 'io-ts';

/** @internal */
export function getRealTypeTag(type: t.Any | t.Decoder<any, any>): string | undefined {
  if (!type) return undefined;

  const tag = (<any>type)._tag;
  if (tag === null || tag === undefined) return undefined;

  if (['RefinementType', 'ReadonlyType'].indexOf(tag) >= 0 && (<any>type).type) return getRealTypeTag(type);

  return tag;
}

/** @internal */
export function isCombinatorType(type: t.Any | t.Decoder<any, any>): boolean {
  const tag = getRealTypeTag(type);
  return !!tag && (['UnionType', 'IntersectionType'].indexOf(tag) >= 0);
}

/** @internal */
export function isUnionType(type: t.Any | t.Decoder<any, any>): boolean {
  const tag = getRealTypeTag(type);
  return !!tag && (['UnionType'].indexOf(tag) >= 0);
}

/** @internal */
export function isArrayType(type: t.Any | t.Decoder<any, any>): boolean {
  const tag = getRealTypeTag(type);
  return !!tag && (['ReadonlyArrayType', 'ArrayType', 'AnyArrayType', 'TupleType'].indexOf(tag) >= 0);
}

/** @internal */
export function isDictType(type: t.Any | t.Decoder<any, any>): boolean {
  const tag = getRealTypeTag(type);
  return !!tag && (['DictionaryType', 'AnyDictionaryType'].indexOf(tag) >= 0);
}
