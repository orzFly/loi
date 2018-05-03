import * as t from 'io-ts';

/** @internal */
export function convert<T extends t.Any, X>(
  type: T,
  convert: (val: X) => t.TypeOf<T> = (val) => val,
  guard: (val: X) => boolean = () => true,
  name: string = type.name
): t.Type<T["_A"], T["_O"], T["_I"]> {
  return new t.Type(
    name,
    (v: any): v is T => type.is(v),
    (v: any, c: any) =>
      type.validate(guard(v) ? convert(v) : v, c),
    (v: any) => type.encode(v)
  );
}

/** @internal */
export function nullAsUndefined<T extends t.Any>(
  type: T,
  name: string = type.name
): t.Type<T["_A"], T["_O"], T["_I"]> {
  return new t.Type(
    name,
    (v: any): v is T => type.is(v),
    (v: any, c: any) =>
      (v === null || v === undefined) ? t.success(undefined) : type.validate(v, c),
    (v: any) => type.encode(v)
  );
}