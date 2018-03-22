import * as t from 'io-ts';
import { isDate, isNumber, isString, keys, mapValues } from 'lodash';

// #region enum

// https://github.com/gcanti/io-ts/issues/67#issuecomment-343769352

function enumWords(e: any): string[] {
  return keys(e).filter((i) => isString(e[i])).map((i) => e[i])
}

export function makeStringEnum<E>(name: string, e: any) {
  const values = enumWords(e)
  return t.union(values.map((i) => t.literal(i)), name) as any as t.Type<E, E, string>
}

// #endregion

// #region violet

const getNameFromProps = (props: t.Props): string =>
  `{ ${Object.keys(props)
    .map((k) => `${k}: ${props[k].name}`)
    .join(', ')} }`

export class VioletType<
  P extends t.AnyProps,
  A = any,
  O = A,
  I = t.mixed
  > extends t.Type<
  t.TypeOfProps<P>,
  t.OutputOfProps<P>,
  {}
  > {
  readonly _tag: 'VioletType' = 'VioletType'
  constructor(
    name: string,
    is: VioletType<P, A, O, I>['is'],
    validate: VioletType<P, A, O, I>['validate'],
    encode: VioletType<P, A, O, I>['encode'],
    readonly props: P
  ) {
    super(name, is, validate, encode)
  }
}

/** Specifies that only the given interface properties are allowed. Invalid properties will be just ignored, violetly. */
export const violet = <P extends t.Props>(
  props: P,
  name: string = `VioletType<${getNameFromProps(props)}>`
): VioletType<
P,
t.TypeOfProps<P>,
t.OutputOfProps<P>
> => {
  const loose = t.type(props)
  return new VioletType(
    name,
    (v): v is t.TypeOfProps<P> => loose.is(v),
    (s, c) =>
      loose.validate(s, c).chain((o) => {
        const keys = Object.getOwnPropertyNames(o)
        const newObject: t.OutputOfProps<P> = {} as any;
        const len = keys.length
        for (let i = 0; i < len; i++) {
          const key = keys[i]
          if (props.hasOwnProperty(key)) {
            newObject[key] = o[key];
          }
        }
        return t.success(newObject)
      }),
    loose.encode,
    props
  )
}

// #endregion

// #region interface with optionals

export function nullablePartial<P extends t.Props>(props: P, name?: string): t.PartialType<
  P,
  t.TypeOfPartialProps<P>,
  t.OutputOfPartialProps<P>
  > {
  return t.partial(mapValues(props, (i) => nullAsUndefined(i)) as P, name);
}

export function interfaceWithOptionals<R extends t.Props, O extends t.Props>(
  required: R,
  optional: O,
  name?: string
): t.IntersectionType<
[
  t.InterfaceType<
  R,
  t.TypeOfProps<R>,
  t.OutputOfProps<R>
  >,
  t.PartialType<
  O,
  t.TypeOfPartialProps<O>,
  t.OutputOfPartialProps<O>
  >
],
t.TypeOfProps<R> & t.TypeOfPartialProps<O>,
t.OutputOfProps<R> & t.OutputOfPartialProps<O>
> {
  return t.intersection([t.interface(required), nullablePartial(optional)], name)
}

// https://github.com/gunzip/digital-citizenship-functions/blob/cd5c57629cb188dbda4b03037fbb399115fd6d29/lib/utils/types.ts#L92
// https://github.com/gcanti/io-ts/issues/106
/**
 *  Return a new type that validates successfully only
 *  when the instance (object) contains no unknow properties.
 *
 *  @required  required properties
 *  @optional   optional object properties
 */
export function strictInterfaceWithOptionals<
  R extends t.Props,
  O extends t.Props
  >(
    required: R,
    optional: O,
    name: string
  ): t.Type<
  t.TypeOfProps<R> & t.TypeOfPartialProps<O>,
  t.OutputOfProps<R> & t.OutputOfPartialProps<O>,
  {}
  > {
  const loose = t.intersection([t.interface(required), nullablePartial(optional)]);
  const props = Object.assign({}, required, optional);
  return new t.Type(
    name,
    (v): v is t.TypeOfProps<R> & t.TypeOfPartialProps<O> =>
      loose.is(v) &&
      Object.getOwnPropertyNames(v).every((k) => props.hasOwnProperty(k)),
    (s, c) =>
      loose.validate(s, c).chain((o) => {
        const errors: t.Errors = Object.getOwnPropertyNames(o)
          .map(
            (key) =>
              !props.hasOwnProperty(key)
                ? t.getValidationError(o[key], t.appendContext(c, key, t.never))
                : undefined
          )
          .filter((e): e is t.ValidationError => e !== undefined);
        return errors.length ? t.failures(errors) : t.success(o);
      }),
    loose.encode
  );
}

export function violetInterfaceWithOptionals<
  R extends t.Props,
  O extends t.Props
  >(
    required: R,
    optional: O,
    name: string
  ): t.Type<
  t.TypeOfProps<R> & t.TypeOfPartialProps<O>,
  t.OutputOfProps<R> & t.OutputOfPartialProps<O>,
  {}
  > {
  const loose = t.intersection([t.interface(required), nullablePartial(optional)]);
  const props = Object.assign({}, required, optional);
  return new t.Type(
    name,
    (v): v is t.TypeOfProps<R> & t.TypeOfPartialProps<O> => loose.is(v),
    (s, c) =>
      loose.validate(s, c).chain((o) => {
        const keys = Object.getOwnPropertyNames(o)
        const newObject: t.OutputOfProps<R> & t.OutputOfPartialProps<O> = {} as any;
        const len = keys.length
        for (let i = 0; i < len; i++) {
          const key = keys[i]
          if (props.hasOwnProperty(key)) {
            newObject[key] = o[key];
          }
        }
        return t.success(newObject)
      }),
    loose.encode
  );
}

// #endregion

// #region date
export class DateType extends t.Type<Date, string, string | Date | number> {
  constructor() {
    super(
      'Date',
      (value): value is Date => isDate(value) || isString(value) || isNumber(value),
      (input, ctx) => {
        if (!this.is(input)) return t.failure(input, ctx);

        const date = new Date(input);
        return !isNaN(date.getTime()) ? t.success(date) : t.failure(input, ctx)
      },
      (output) => output.toJSON()
    )
  }
}

export const date = new DateType();
// #endregion

// #region validate helpers

export function validate<S, A>(value: S, type: t.Decoder<S, A>): t.Validation<A> {
  return type.decode(value);
}

// #endregion

// #region default

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

// #endregion

// #region convert

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

// #endregion

export function ensureSameType<X, Y extends X>(): [X, Y] { return undefined; };

export const trueBoolean = t.refinement(t.boolean, (i) => i === true, 'true');
export const falseBoolean = t.refinement(t.boolean, (i) => i === false, 'false');

export const violetTrueBoolean = convert(nullAsUndefined(trueBoolean), (i) => i = undefined, (i) => i !== true);
export const violetFalseBoolean = convert(nullAsUndefined(falseBoolean), (i) => i = undefined, (i) => i !== false);

export const stringNumber = convert(t.number, (i: string) => parseFloat(i), (i) => isString(i), 'stringNumber');

export const finiteNumber = t.refinement(t.number, (i) => isFinite(i), 'finiteNumber');
export const finiteStringNumber = t.refinement(stringNumber, (i) => isFinite(i), 'finiteStringNumber');
