import * as t from 'io-ts';

// https://github.com/teamdigitale/digital-citizenship-functions/blob/5fb8b4eb42203646bd9483ce4f850e7a69b1fe21/lib/utils/default.ts

/**
 * Sets properties default values when calling t.validate() method on models
 * see https://github.com/gcanti/io-ts/issues/8
 */
// tslint:disable:no-any
export function withDefault<T extends t.Any>(
  type: T,
  defaultValue: t.TypeOf<T>
): t.Type<T["_A"], T["_O"], T["_I"]> {
  return new t.Type(
    type.name,
    (v: any): v is T => type.is(v),
    (v: any, c: any) =>
      type.validate(v !== undefined && v !== null ? v : defaultValue, c),
    (v: any) => type.encode(v)
  );
}

export function withDefaultResolver<T extends t.Any>(
  type: T,
  defaultValue: () => t.TypeOf<T>
): t.Type<T["_A"], T["_O"], T["_I"]> {
  return new t.Type(
    type.name,
    (v: any): v is T => type.is(v),
    (v: any, c: any) =>
      type.validate(v !== undefined && v !== null ? v : defaultValue(), c),
    (v: any) => type.encode(v)
  );
}