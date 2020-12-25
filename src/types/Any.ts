import * as t from '../iots';
import { decorate, ILoiOption, LoiFactory, metadata } from '../utilties/factory';
import { mimic } from '../utilties/mimic';
import { LoiFactoryBase } from './Base';

/** @internal */
export interface ILoiOptionAny extends ILoiOption {
  name: string,
  nonNull?: boolean
}

type Clean<T extends t.Any> = t.Type<T['_A'], T['_O'], T['_I']>
export type LoiFactoryTypeAny<T extends t.Any> = T & LoiFactoryAny<T> & LoiFactoryBase<T>

export class LoiFactoryAny<T extends t.Any> extends LoiFactory<T> {
  /** @internal */
  static decorate<T extends t.Any>(t: T): LoiFactoryTypeAny<T> {
    return LoiFactoryBase.decorate(decorate<T, LoiFactoryAny<t.Type<T['_A'], T['_O'], T['_I']>>>(this, t));
  }

  public nonNull() {
    const type = t.refinement(this, (i) => i !== undefined && i !== null)
    return metadata(LoiFactoryAny.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionAny>{ name: "non-null", nonNull: true }
    });
  }
}

// tslint:disable-next-line:variable-name
export const any = mimic(function any() {
  const type = new t.AnyType();
  return metadata(LoiFactoryAny.decorate<Clean<typeof type>>(type), {
    tag: "any"
  });
}, new t.AnyType());
