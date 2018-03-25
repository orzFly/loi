import * as t from 'io-ts';
import { decorate, Factory, ILoiOption, metadata } from '../utilties/factory';
import { BaseFactory } from './Base';

export interface IBooleanOption extends ILoiOption {
  name: string
}

export class BooleanFactory<T extends t.Any> extends Factory<T> {
  static decorate<T extends t.Any>(t: T) {
    return BaseFactory.decorate(decorate<T, BooleanFactory<t.Type<T['_A'], T['_O'], T['_I']>>>(this, t));
  }
}

export function boolean() {
  const type = new t.BooleanType();
  return metadata(BooleanFactory.decorate(type), {
    tag: "boolean"
  });
}