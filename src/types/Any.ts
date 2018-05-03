import * as t from 'io-ts';
import { decorate, Factory, ILoiOption, metadata } from '../utilties/factory';
import { mimic } from '../utilties/mimic';
import { BaseFactory } from './Base';

export interface IAnyOption extends ILoiOption {
  name: string,
  nonNull?: boolean
}

type Clean<T extends t.Any> = t.Type<T['_A'], T['_O'], T['_I']>
export type AnyFactoryType<T extends t.Any> = T & AnyFactory<T> & BaseFactory<T>

export class AnyFactory<T extends t.Any> extends Factory<T> {
  static decorate<T extends t.Any>(t: T): AnyFactoryType<T> {
    return BaseFactory.decorate(decorate<T, AnyFactory<t.Type<T['_A'], T['_O'], T['_I']>>>(this, t));
  }

  public nonNull() {
    const type = t.refinement(this, (i) => i !== undefined && i !== null)
    return metadata(AnyFactory.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <IAnyOption>{ name: "non-null", nonNull: true }
    });
  }
}

// tslint:disable-next-line:variable-name
export const any = mimic(function any() {
  const type = new t.AnyType();
  return metadata(AnyFactory.decorate<Clean<typeof type>>(type), {
    tag: "any"
  });
}, new t.AnyType());