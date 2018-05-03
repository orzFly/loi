import * as t from 'io-ts';

/** @internal */
// tslint:disable:no-any
export function withRescue<T extends t.Any>(
  type: T,
  rescueValue: t.TypeOf<T>
): t.Type<T["_A"], T["_O"], T["_I"]> {
  return new t.Type(
    type.name,
    (v: any): v is T => type.is(v) || type.is(rescueValue),
    (v: any, c: any) => {
      const result = type.validate(v, c)
      return result.isLeft() ? type.validate(rescueValue, c) : result
    },
    (v: any) => type.encode(v)
  );
}

/** @internal */
export function withRescueResolver<T extends t.Any>(
  type: T,
  rescueValue: () => t.TypeOf<T>
): t.Type<T["_A"], T["_O"], T["_I"]> {
  return new t.Type(
    type.name,
    (v: any): v is T => type.is(v) || type.is(rescueValue()),
    (v: any, c: any) => {
      const result = type.validate(v, c)
      return result.isLeft() ? type.validate(rescueValue(), c) : result
    },
    (v: any) => type.encode(v)
  );
}