import * as t from '../iots';
import { LoiDecoratorConvert } from '../decorators/convert';
import { decorate, ILoiOption, LoiFactory, metadata } from '../utilties/factory';
import { isString } from '../utilties/lodash';
import { mimic } from '../utilties/mimic';
import { LoiFactoryBase } from './Base';

type Predicate<A> = (a: A) => boolean;

/** @internal */
export interface ILoiOptionNumber extends ILoiOption {
  name: string,
  max?: number
  min?: number
  greater?: number
  less?: number
  integer?: boolean
  finite?: boolean
  parseFloat?: boolean
  refinement?: Predicate<any>
}

type Clean<T extends t.Any> = t.Type<T['_A'], T['_O'], T['_I']>
export type LoiFactoryTypeNumber<T extends t.Any> = T & LoiFactoryNumber<T> & LoiFactoryBase<T>

export class LoiFactoryNumber<T extends t.Any> extends LoiFactory<T> {
  /** @internal */
  static decorate<T extends t.Any>(t: T): LoiFactoryTypeNumber<T> {
    return LoiFactoryBase.decorate(decorate<T, LoiFactoryNumber<t.Type<T['_A'], T['_O'], T['_I']>>>(this, t));
  }

  public max(limit: number) {
    const type = t.refinement(this, (n) => n <= limit);
    return metadata(LoiFactoryNumber.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionNumber>{ name: `<=${limit}`, max: limit }
    });
  }

  public min(limit: number) {
    const type = t.refinement(this, (n) => n >= limit);
    return metadata(LoiFactoryNumber.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionNumber>{ name: `>=${limit}`, min: limit }
    });
  }

  public greater(limit: number) {
    const type = t.refinement(this, (n) => n > limit);
    return metadata(LoiFactoryNumber.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionNumber>{ name: `>${limit}`, greater: limit }
    });
  }

  public less(limit: number) {
    const type = t.refinement(this, (n) => n < limit);
    return metadata(LoiFactoryNumber.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionNumber>{ name: `<${limit}`, less: limit }
    });
  }

  public negative() {
    const type = t.refinement(this, (n) => n < 0);
    return metadata(LoiFactoryNumber.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionNumber>{ name: `-`, less: 0 }
    });
  }

  public positive() {
    const type = t.refinement(this, (n) => n > 0);
    return metadata(LoiFactoryNumber.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionNumber>{ name: `+`, greater: 0 }
    });
  }

  public integer() {
    const type = t.refinement(this, (n) => Number.isSafeInteger(n));
    return metadata(LoiFactoryNumber.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionNumber>{ name: `integer`, integer: true }
    });
  }

  public finite() {
    const type = t.refinement(this, (n) => Number.isFinite(n));
    return metadata(LoiFactoryNumber.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionNumber>{ name: `finite`, finite: true }
    });
  }

  public parseFloat() {
    const type = new LoiDecoratorConvert(this, (i: string) => parseFloat(i), (i) => isString(i));
    return metadata(LoiFactoryNumber.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionNumber>{ name: "parseFloat", parseFloat: true }
    });
  }

  public refinement(callback: Predicate<this["_A"]>, name?: string) {
    const type = t.refinement(this, callback);
    return metadata(LoiFactoryNumber.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionNumber>{ name: name || `custom refinement`, refinement: callback }
    });
  }
}

// tslint:disable-next-line:variable-name
export const number = mimic(function number() {
  const type = new t.NumberType();
  return metadata(LoiFactoryNumber.decorate<Clean<typeof type>>(type), {
    tag: "number"
  });
}, new t.NumberType());