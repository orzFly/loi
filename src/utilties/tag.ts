import * as t from 'io-ts';

export const loiTagTypeDecorator = Symbol('loiTagTypeDecorator')
export const loiTagTypeCompound = Symbol('loiTagTypeCompound')
export const loiTagTypeUnion = Symbol('loiTagTypeUnion')
export const loiTagTypeArray = Symbol('loiTagTypeArray')
export const loiTagTypeDict = Symbol('loiTagTypeDict')

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
export function isDecoratorType(type: t.Any | t.Decoder<any, any>): type is ({ type: t.Any } & typeof type) {
  const tag = getTypeTag(type);
  return !!tag && !!(<any>type).type && (!!(<any>type)[loiTagTypeDecorator] || ['RefinementType', 'ReadonlyType', 'ExactType'].indexOf(tag) >= 0);
}

/** @internal */
export function isCompoundType(type: t.Any | t.Decoder<any, any>): boolean {
  const tag = getRealTypeTag(type);
  return !!tag && (!!(<any>type)[loiTagTypeCompound] || ['UnionType', 'IntersectionType'].indexOf(tag) >= 0);
}

/** @internal */
export function isUnionType(type: t.Any | t.Decoder<any, any>): boolean {
  const tag = getRealTypeTag(type);
  return !!tag && (!!(<any>type)[loiTagTypeUnion] || ['UnionType'].indexOf(tag) >= 0);
}

/** @internal */
export function isArrayType(type: t.Any | t.Decoder<any, any>): boolean {
  const tag = getRealTypeTag(type);
  return !!tag && (!!(<any>type)[loiTagTypeArray] || ['ReadonlyArrayType', 'ArrayType', 'AnyArrayType', 'TupleType'].indexOf(tag) >= 0);
}

/** @internal */
export function isDictType(type: t.Any | t.Decoder<any, any>): boolean {
  const tag = getRealTypeTag(type);
  return !!tag && (!!(<any>type)[loiTagTypeDict] || ['DictionaryType', 'AnyDictionaryType'].indexOf(tag) >= 0);
}
