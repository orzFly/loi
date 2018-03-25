import * as t from 'io-ts';
import { isString } from 'lodash';
import { decorate, Factory, ILoiOption, metadata } from '../factory';
import { convert } from '../utilties/convert';
import { BaseFactory } from './Base';

export interface INumberOption extends ILoiOption {
  name: string,
  max?: number
  min?: number
  greater?: number
  less?: number
  integer?: boolean
  finite?: boolean
  parseFloat?: boolean
}

export class NumberFactory<T extends t.Any> extends Factory<T> {
  static decorate<T extends t.Any>(t: T) {
    return BaseFactory.decorate(decorate<T, NumberFactory<t.Type<T['_A'], T['_O'], T['_I']>>>(this, t));
  }

  public max(limit: number) {
    const type = t.refinement(this, (n) => n <= limit) as t.Type<T['_A'], T['_O'], T['_I']>;
    return metadata(NumberFactory.decorate(type), {
      parent: this,
      option: <INumberOption>{ name: `<=${limit}`, max: limit }
    });
  }

  public min(limit: number) {
    const type = t.refinement(this, (n) => n >= limit) as t.Type<T['_A'], T['_O'], T['_I']>;
    return metadata(NumberFactory.decorate(type), {
      parent: this,
      option: <INumberOption>{ name: `>=${limit}`, min: limit }
    });
  }

  public greater(limit: number) {
    const type = t.refinement(this, (n) => n > limit) as t.Type<T['_A'], T['_O'], T['_I']>;
    return metadata(NumberFactory.decorate(type), {
      parent: this,
      option: <INumberOption>{ name: `>${limit}`, greater: limit }
    });
  }

  public less(limit: number) {
    const type = t.refinement(this, (n) => n < limit) as t.Type<T['_A'], T['_O'], T['_I']>;
    return metadata(NumberFactory.decorate(type), {
      parent: this,
      option: <INumberOption>{ name: `<${limit}`, less: limit }
    });
  }

  public negative() {
    const type = t.refinement(this, (n) => n < 0) as t.Type<T['_A'], T['_O'], T['_I']>;
    return metadata(NumberFactory.decorate(type), {
      parent: this,
      option: <INumberOption>{ name: `-`, less: 0 }
    });
  }

  public positive() {
    const type = t.refinement(this, (n) => n > 0) as t.Type<T['_A'], T['_O'], T['_I']>;
    return metadata(NumberFactory.decorate(type), {
      parent: this,
      option: <INumberOption>{ name: `+`, greater: 0 }
    });
  }

  public integer() {
    const type = t.refinement(this, (n) => Number.isSafeInteger(n)) as t.Type<T['_A'], T['_O'], T['_I']>;
    return metadata(NumberFactory.decorate(type), {
      parent: this,
      option: <INumberOption>{ name: `integer`, integer: true }
    });
  }

  public finite() {
    const type = t.refinement(this, (n) => Number.isFinite(n)) as t.Type<T['_A'], T['_O'], T['_I']>;
    return metadata(NumberFactory.decorate(type), {
      parent: this,
      option: <INumberOption>{ name: `finite`, finite: true }
    });
  }

  public parseFloat() {
    const type = convert(this, (i: string) => parseFloat(i), (i) => isString(i));
    return metadata(NumberFactory.decorate(type), {
      parent: this,
      option: <INumberOption>{ name: "parseFloat", parseFloat: true }
    });
  }
}

export function number() {
  const type = new t.NumberType();
  return metadata(NumberFactory.decorate(type), {
    tag: "number"
  });
}