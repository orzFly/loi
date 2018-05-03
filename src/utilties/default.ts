import * as t from 'io-ts';

// https://github.com/teamdigitale/italia-ts-commons/blob/1688059556e3b3532a73032ab923933f0403fcc5/src/types.ts#L158

/**
 * Sets properties default values when calling t.validate() method on models
 * see https://github.com/gcanti/io-ts/issues/8
 * @internal
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

/**
 * Sets properties default values with resolver functions when calling t.validate() method on models
 * see https://github.com/gcanti/io-ts/issues/8
 * @internal
 */
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