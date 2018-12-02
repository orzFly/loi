import * as t from 'io-ts';

/** @internal */
export const loiTag = Symbol('loiTag')

/** @internal */
export const loiOption = Symbol('loiOption')

/** @internal */
export interface ILoiOption {
  name?: string
}

export class LoiFactory<T extends t.Any> extends t.Type<T['_A'], T['_O'], T['_I']> {
  constructor() {
    throw new Error('The Loi factory class cannot be constructored.');

    // [ts] Constructors for derived classes must contain a 'super' call.
    // [ts] Unreachable code detected.
    // @ts-ignore
    /* istanbul ignore next */ const pitfall: any = undefined; /* istanbul ignore next */ super(pitfall, pitfall, pitfall, pitfall);
  }

  /** @internal */
  [loiOption]: ILoiOption[]
}

const factoryMaps = new WeakMap<Function, Map<Function, object>>();

function getFactoryMap(klass: any) {
  if (factoryMaps.has(klass)) {
    return factoryMaps.get(klass)!;
  }

  const map = new Map<Function, object>();
  factoryMaps.set(klass, map);
  return map;
}

function copyFactoryMethod(klass: Function, destination: any) {
  Object.getOwnPropertyNames(klass.prototype).forEach((i) => {
    if (i === 'constructor') return;
    destination[i] = klass.prototype[i];
  })
}

function createPrototype(klass: Function, base: object): object {
  const prototype = Object.create(base)
  copyFactoryMethod(klass, prototype);
  return prototype;
}

/** @internal */
export function decorate<T extends t.Any, F extends LoiFactory<t.Type<T['_A'], T['_O'], T['_I']>>, R extends T & F = T & F>(factory: { new(...args: any[]): F }, t: T): R {
  if (!t) return t as any;

  const result: any = t;
  const base = Object.getPrototypeOf(result)
  if (!base) {
    copyFactoryMethod(factory, result);
  } else {
    const map = getFactoryMap(base)
    let prototype = map.get(factory)
    if (!prototype) {
      prototype = createPrototype(factory, base);
      map.set(factory, prototype);
    }
    Object.setPrototypeOf(result, prototype);
  }
  return result;
}

/** @internal */
export function metadata<T, LO extends ILoiOption>(t: T, params?: {
  parent?: any,
  tag?: string,
  option?: LO,
  optionFilter?: (item: ILoiOption) => boolean
}): T {
  let previousOptions: ILoiOption[] = (params && params.parent && params.parent[loiOption] || []);
  if (params && params.optionFilter) {
    previousOptions = Array.prototype.filter.call(previousOptions, params.optionFilter);
  }
  const tag: string = (params && params.tag) || (t && (<any>t)[loiTag]) || (params && params.parent && params.parent[loiTag]) || (t && (<any>t).name) || "unknown";
  const options = [...previousOptions, ...(params && params.option ? [params && params.option] : [])];
  (<any>t).name = `${tag}${options.length ? `(${options.map((i) => i.name || JSON.stringify(i)).join(", ")})` : ""}`;
  (<any>t)[loiTag] = tag;
  (<any>t)[loiOption] = options;
  return t;
}