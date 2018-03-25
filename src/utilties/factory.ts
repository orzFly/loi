import * as t from 'io-ts';

export const loiTag = Symbol('loiTag')
export const loiOption = Symbol('loiOption')

export interface ILoiOption {
  name?: string
}

export class Factory<T extends t.Any> extends t.Type<T['_A'], T['_O'], T['_I']> {
  constructor() {
    super(undefined, undefined, undefined, undefined);
    throw new Error('The Loi factory class cannot be constructored.');
  }

  [loiOption]: ILoiOption[]
}

function copyFactoryMethod(klass: Function, destination: any) {
  Object.getOwnPropertyNames(klass.prototype).forEach((i) => {
    if (i === 'constructor') return;
    destination[i] = klass.prototype[i];
  })
}

export function decorate<T extends t.Any, F extends Factory<t.Type<T['_A'], T['_O'], T['_I']>>,>(factory: { new(...args: any[]): F }, t: T): T & F {
  const result: any = t;
  copyFactoryMethod(factory, result);
  return result;
}

export function metadata<T, LO extends ILoiOption>(t: T, params?: {
  parent?: any,
  tag?: string,
  option?: LO
}): T {
  const tag: string = (params && params.tag) || (t && (<any>t)[loiTag]) || (params && params.parent && params.parent[loiTag]) || (t && (<any>t).name) || "unknown";
  const options = [...(params && params.parent && params.parent[loiOption] || []), ...(params && params.option ? [params && params.option] : [])];
  (<any>t).name = `${tag}${options.length ? `(${options.map((i) => i.name || JSON.stringify(i)).join(", ")})` : ""}`;
  (<any>t)[loiTag] = tag;
  (<any>t)[loiOption] = options;
  return t;
}