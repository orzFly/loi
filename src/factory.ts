import * as t from 'io-ts';
import { isFunction } from 'lodash';

export interface ILoiOption {
  name?: string
}

function copyFactoryMethod(klass: Function, destination: any) {
  Object.getOwnPropertyNames(klass.prototype).forEach((i) => {
    if (i === 'constructor') return;
    if (!isFunction(klass.prototype[i])) return;
    destination[i] = klass.prototype[i].bind(destination);
  })
}

export class Factory<T extends t.Any> extends t.Type<T['_A'], T['_O'], T['_I']> {
  constructor() {
    super(undefined, undefined, undefined, undefined);
    throw new Error('This class cannot be constructored.');
  }

  loiOption: ILoiOption[]
}

export function decorate<
  T extends t.Any,
  F extends Factory<T>,
>(
  factory: { new(...args: any[]): F },
  t: T
): F & T {
  const result: any = t;
  copyFactoryMethod(factory, result);
  return result;
}
