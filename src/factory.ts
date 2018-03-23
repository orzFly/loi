import * as t from 'io-ts';
import { isFunction } from 'lodash';

function copyFactoryMethod(klass: Function, destination: any) {
  Object.getOwnPropertyNames(klass.prototype).forEach((i) => {
    if (i === 'constructor') return;
    if (!isFunction(klass.prototype[i])) return;
    destination[i] = klass.prototype[i].bind(destination);
  })
}

export function asFactory<
  F extends t.Any,
  LO extends { name?: string } = { name?: string },
  T extends t.Type<F['_A'], F['_O'], F['_I']> = t.Type<F['_A'], F['_O'], F['_I']>
  >(
    factory: { new(...args: any[]): F, loiTag: string },
    t: T,
    options: LO[] = [],
    newOption?: LO,
): T & F {
  const result: any = t;
  const newOptions = [...(options || []), ...(newOption ? [newOption] : [])];
  result.name = `${factory.loiTag}${newOptions.length ? `(${newOptions.map((i) => i.name || JSON.stringify(i)).join(", ")})` : ""}`;
  result.loiOption = newOptions;
  copyFactoryMethod(factory, result);
  return result;
}
