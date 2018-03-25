import * as t from 'io-ts';
import { decorate, Factory, ILoiOption, metadata } from '../utilties/factory';
import { BaseFactory } from './Base';

export interface IAnyOption extends ILoiOption {
  name: string,
  nonNull?: boolean
}

export class AnyFactory<T extends t.Any> extends Factory<T> {
  static decorate<T extends t.Any>(t: T) {
    return BaseFactory.decorate(decorate<T, AnyFactory<t.Type<T['_A'], T['_O'], T['_I']>>>(this, t));
  }

  public nonNull() {
    const type = t.refinement(this, (i) => i !== undefined && i !== null)
    return metadata(AnyFactory.decorate(type), {
      parent: this,
      option: <IAnyOption>{ name: "non-null", nonNull: true }
    });
  }
}

export function any() {
  const type = new t.AnyType();
  return metadata(AnyFactory.decorate(type), {
    tag: "any"
  });
}