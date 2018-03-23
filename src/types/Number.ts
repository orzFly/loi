import * as t from 'io-ts';
import { isString } from 'lodash';
import { asFactory } from '../factory';
import * as rt from '../RuntimeType';

interface INumberOption {
  name: string,
  max?: number
  min?: number
  greater?: number
  less?: number
  integer?: boolean
  finite?: boolean
}

function asNumberFactory<T extends t.Any, LO = INumberOption>(t: T, options: LO[] = [], newOption?: LO) {
  return asFactory<NumberFactory<T>>(NumberFactory, t, options, newOption);
}

export class NumberFactory<T extends t.Any> extends t.Type<T['_A'], T['_O'], T['_I']> {
  static loiTag = "number"
  constructor() {
    super(undefined, undefined, undefined, undefined);
    throw new Error('This class cannot be constructored.');
  }
  private loiOption: INumberOption[]

  public max(limit: number) {
    return asNumberFactory(
      t.refinement(this, (n) => n <= limit),
      this.loiOption,
      { name: `<=${limit}`, max: limit }
    )
  }

  public min(limit: number) {
    return asNumberFactory(
      t.refinement(this, (n) => n >= limit),
      this.loiOption,
      { name: `>=${limit}`, min: limit }
    )
  }

  public greater(limit: number) {
    return asNumberFactory(
      t.refinement(this, (n) => n > limit),
      this.loiOption,
      { name: `>${limit}`, greater: limit }
    )
  }

  public less(limit: number) {
    return asNumberFactory(
      t.refinement(this, (n) => n < limit),
      this.loiOption,
      { name: `<${limit}`, less: limit }
    )
  }

  public negative() {
    return asNumberFactory(
      t.refinement(this, (n) => n < 0),
      this.loiOption,
      { name: `-`, less: 0 }
    )
  }

  public positive() {
    return asNumberFactory(
      t.refinement(this, (n) => n > 0),
      this.loiOption,
      { name: `+`, greater: 0 }
    )
  }

  public integer() {
    return asNumberFactory(
      t.refinement(this, (n) => n % 1 === 0),
      this.loiOption,
      { name: `integer`, integer: true }
    )
  }

  public finite() {
    return asNumberFactory(
      t.refinement(this, (n) => Number.isFinite(n)),
      this.loiOption,
      { name: `finite`, finite: true }
    )
  }

  public default(value: this['_A']) {
    return rt.withDefault(this, value)
  }
}

export function number() {
  return asNumberFactory(new t.NumberType(), []);
}

export function numberOrNumericString() {
  return asNumberFactory(
    rt.convert(t.number, (i: string) => parseFloat(i), (i) => isString(i)),
    [{ name: "numericString" }]
  );
}
