import * as t from 'io-ts';
import { isFunction, isString } from 'lodash';
import * as rt from './RuntimeType';

export namespace Loi {
  export type Type<RT extends t.Any> = RT['_A'];

  interface INumberOption {
    name: string,
    max?: number
    min?: number
    greater?: number
    less?: number
    integer?: boolean
    finite?: boolean
  }

  export class NumberFactory<T extends t.Any> extends t.Type<T['_A'], T['_O'], T['_I']> {
    static loiTag = "number"
    constructor() {
      super(undefined, undefined, undefined, undefined);
      throw new Error('This class cannot be constructored.');
    }
    private loiOption: INumberOption[]

    public max(limit: number) {
      return withFactory<NumberFactory<t.NumberType>, INumberOption>(
        NumberFactory,
        t.refinement(this, (n) => n <= limit),
        this.loiOption,
        { name: `<=${limit}`, max: limit }
      )
    }

    public min(limit: number) {
      return withFactory<NumberFactory<t.NumberType>, INumberOption>(
        NumberFactory,
        t.refinement(this, (n) => n >= limit),
        this.loiOption,
        { name: `>=${limit}`, min: limit }
      )
    }

    public greater(limit: number) {
      return withFactory<NumberFactory<t.NumberType>, INumberOption>(
        NumberFactory,
         t.refinement(this, (n) => n > limit), this.loiOption, { name: `>${limit}`, greater: limit })
    }

    public less(limit: number) {
      return withFactory<NumberFactory<t.NumberType>, INumberOption>(
        NumberFactory,
        t.refinement(this, (n) => n < limit),
        this.loiOption,
        { name: `<${limit}`, less: limit }
      )
    }

    public negative() {
      return withFactory<NumberFactory<t.NumberType>, INumberOption>(
        NumberFactory,
        t.refinement(this, (n) => n < 0),
        this.loiOption,
        { name: `-`, less: 0 }
      )
    }

    public positive() {
      return withFactory<NumberFactory<t.NumberType>, INumberOption>(
        NumberFactory,
        t.refinement(this, (n) => n > 0),
        this.loiOption,
        { name: `+`, greater: 0 }
      )
    }

    public integer() {
      return withFactory<NumberFactory<t.NumberType>, INumberOption>(
        NumberFactory,
        t.refinement(this, (n) => n % 1 === 0),
        this.loiOption,
        { name: `integer`, integer: true }
      )
    }

    public finite() {
      return withFactory<NumberFactory<t.NumberType>, INumberOption>(
        NumberFactory,
        t.refinement(this, (n) => Number.isFinite(n)),
        this.loiOption,
        { name: `finite`, finite: true }
      )
    }

    public default(value: this['_A']) {
      return rt.withDefault(this, value)
    }
  }

  function copyFactoryMethod(klass: Function, destination: any) {
    Object.getOwnPropertyNames(klass.prototype).forEach((i) => {
      if (i === 'constructor') return;
      if (!isFunction(klass.prototype[i])) return;
      destination[i] = klass.prototype[i].bind(destination);
    })
  }

  function withFactory<
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

  export function number() {
    return withFactory<NumberFactory<t.NumberType>, INumberOption>(NumberFactory, new t.NumberType(), []);
  }

  export function numberOrStringNumber() {
    return withFactory<NumberFactory<t.NumberType>, INumberOption>(NumberFactory, rt.convert(t.number, (i: string) => parseFloat(i), (i) => isString(i)), [{ name: "string" }]);
  }

  export const union = t.union
  export const validate = rt.validate
}

export default Loi;
