import * as t from '../iots';
import { decorate, LoiFactory, metadata } from '../utilties/factory';
import { isString } from '../utilties/lodash';
import { LoiFactoryBase } from './Base';

type Clean<T extends t.Any> = t.Type<T['_A'], T['_O'], T['_I']>
export type LoiFactoryTypeEnum<E, T extends t.Any> = T & LoiFactoryEnum<E, T> & LoiFactoryBase<T>

/** @internal */
export const loiEnumTarget = Symbol('loiEnumTarget')

export class LoiFactoryEnum<E, T extends t.Any> extends LoiFactory<T> {
  /** @internal */
  [loiEnumTarget]: E

  /** @internal */
  static decorate<E, T extends t.Any>(t: T): LoiFactoryTypeEnum<E, T> {
    return LoiFactoryBase.decorate(decorate<T, LoiFactoryEnum<E, t.Type<T['_A'], T['_O'], T['_I']>>>(this, t));
  }
}

// https://github.com/Microsoft/TypeScript/blob/64504908449d39e34272d979537052f0cf52302f/src/compiler/checker.ts#L15700
// https://github.com/Microsoft/TypeScript/blob/64504908449d39e34272d979537052f0cf52302f/src/compiler/checker.ts#L24493
function isValidTypeScriptMemberName(name: string) {
  return !(isNumericLiteralName(name) && !isInfinityOrNaNString(name))
}

function isInfinityOrNaNString(name: string): boolean {
  return name === "Infinity" || name === "-Infinity" || name === "NaN";
}

function isNumericLiteralName(name: string) {
  return (+name).toString() === name;
}

export function enumeration<E extends F[keyof F], F extends object>(e: F, name?: string) {
  const keys = Object.keys(e).filter((i) => {
    if (!isString((e as any)[i])) return true;
    return isValidTypeScriptMemberName(i);
  });

  const others: any[] = [];
  const strings: any = {};
  let hasString = false;

  keys.forEach((k) => {
    const value = (e as any)[k];
    if (isString(value)) {
      strings[value] = null;
      hasString = true;
    } else {
      others.push(value);
    }
  })

  if (!name) name = `enum{${[...others, Object.keys(strings)].join(", ")}}`;

  let type: t.Type<E, E, t.mixed>;
  if (hasString && others.length == 0) {
    type = t.keyof(strings, name) as any;
  } else if (hasString && others.length > 0) {
    type = t.union([t.keyof(strings), ...others.map((i) => t.literal(i))]) as any;
  } else if (others.length > 0) {
    type = t.union([...others.map((i) => t.literal(i))]) as any;
  } else {
    type = t.never as any;
  }

  return metadata(LoiFactoryEnum.decorate<E, Clean<typeof type>>(type), {
    tag: name
  });
};