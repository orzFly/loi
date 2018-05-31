import * as t from 'io-ts';
import { LoiDecoratorNullAsUndefined } from '../decorators/nullAsUndefined';
import { objectMapValues } from './lodash';

/** @internal */
export function getNameFromProps(required: t.Props = {}, optional: t.Props = {}): string {
  const result = `{ ${[
    ...Object.keys(required).map((k) => `${k}: ${required[k].name}`),
    ...Object.keys(optional).map((k) => `${k}?: ${optional[k].name}`),
  ].join(', ')} }`

  return result === "{  }" ? "{}" : result;
}

/**
 * Specifies that only the given interface properties are allowed. Invalid properties will be just ignored, violetly.
 * @internal
 */
export const violet = <P extends t.Props>(
  props: P,
  name: string = getNameFromProps(props)
): t.InterfaceType<P, t.TypeOfProps<P>, t.OutputOfProps<P>> => {
  const loose = t.type(props)
  return new t.InterfaceType(
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

/** @internal */
export function nullablePartial<P extends t.Props>(props: P, name?: string): t.PartialType<P, t.TypeOfPartialProps<P>, t.OutputOfPartialProps<P>> {
  return t.partial(objectMapValues(props, (i) => new LoiDecoratorNullAsUndefined(i) as typeof i) as P, name);
}

/** @internal */
export function interfaceWithOptionals<R extends t.Props, O extends t.Props>(
  required: R,
  optional: O,
  name?: string
): t.IntersectionType<[t.InterfaceType<R, t.TypeOfProps<R>, t.OutputOfProps<R>>, t.PartialType<O, t.TypeOfPartialProps<O>, t.OutputOfPartialProps<O>>], t.TypeOfProps<R> & t.TypeOfPartialProps<O>, t.OutputOfProps<R> & t.OutputOfPartialProps<O>> {
  return t.intersection([t.interface(required), nullablePartial(optional)], name)
}

/**
 * Return a new type that validates successfully only
 * when the instance (object) contains no unknow properties.
 *
 * https://github.com/gunzip/digital-citizenship-functions/blob/cd5c57629cb188dbda4b03037fbb399115fd6d29/lib/utils/types.ts#L92
 * https://github.com/gcanti/io-ts/issues/106
 *
 * @required  required properties
 * @optional   optional object properties
 * @internal
 */
export function strictInterfaceWithOptionals<R extends t.Props, O extends t.Props>(
  required: R,
  optional: O,
  name: string
): t.Type<t.TypeOfProps<R> & t.TypeOfPartialProps<O>, t.OutputOfProps<R> & t.OutputOfPartialProps<O>, {}> {
  const loose = t.intersection([t.interface(required), nullablePartial(optional)]);
  const props = Object.assign({}, required, optional);
  const newType = new t.Type(
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
  (<any>newType)._tag = 'StrictInterfaceWithOptionalsType';
  return newType as any;
}

/** @internal */
export function violetInterfaceWithOptionals<R extends t.Props, O extends t.Props>(
  required: R,
  optional: O,
  name: string
): t.Type<t.TypeOfProps<R> & t.TypeOfPartialProps<O>, t.OutputOfProps<R> & t.OutputOfPartialProps<O>, {}> {
  const loose = t.intersection([t.interface(required), nullablePartial(optional)]);
  const props = Object.assign({}, required, optional);
  const newType = new t.Type(
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
  (<any>newType)._tag = 'VioletInterfaceWithOptionalsType';
  return newType as any;
}