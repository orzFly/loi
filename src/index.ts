import * as t from 'io-ts';
import { isString } from 'lodash';
import * as rt from './RuntimeType';

export namespace Loi {
  export type Type<RT extends t.Any> = RT['_A'];

  interface ILoiNumberOption {
    name: string,
    max?: number
    min?: number
    greater?: number
    less?: number
    integer?: boolean
    finite?: boolean
  }

  export class LoiNumberType extends t.NumberType {
    private loiOption: ILoiNumberOption[]

    public max(limit: number) {
      return asLoiNumber(t.refinement(this, (n) => n <= limit), this.loiOption, { name: `<=${limit}`, max: limit })
    }

    public min(limit: number) {
      return asLoiNumber(t.refinement(this, (n) => n >= limit), this.loiOption, { name: `>=${limit}`, min: limit })
    }

    public greater(limit: number) {
      return asLoiNumber(t.refinement(this, (n) => n > limit), this.loiOption, { name: `>${limit}`, greater: limit })
    }

    public less(limit: number) {
      return asLoiNumber(t.refinement(this, (n) => n < limit), this.loiOption, { name: `<${limit}`, less: limit })
    }

    public negative() {
      return asLoiNumber(t.refinement(this, (n) => n < 0), this.loiOption, { name: `-`, less: 0 })
    }

    public positive() {
      return asLoiNumber(t.refinement(this, (n) => n > 0), this.loiOption, { name: `+`, greater: 0 })
    }

    public integer() {
      return asLoiNumber(t.refinement(this, (n) => n % 1 === 0), this.loiOption, { name: `integer`, integer: true })
    }

    public finite() {
      return asLoiNumber(t.refinement(this, (n) => Number.isFinite(n)), this.loiOption, { name: `finite`, finite: true })
    }

    public default(value: this['_A']) {
      return rt.withDefault(this, value)
    }
  }

  function asLoiNumber<T extends t.Any>(t: T, options: ILoiNumberOption[] = [], newOption?: ILoiNumberOption): LoiNumberType {
    Object.setPrototypeOf(t, LoiNumberType.prototype);
    const anyT: any = t;
    const newOptions = [...(options || []), ...(newOption ? [newOption] : [])];
    anyT.name = `number${newOptions.length ? `(${newOptions.map((i) => i.name || JSON.stringify(i)).join(", ")})` : ""}`;
    anyT.loiOption = newOptions;
    return anyT;
  }

  export function number() {
    return asLoiNumber(new t.NumberType(), []);
  }

  export function numberOrStringNumber() {
    return asLoiNumber(rt.convert(t.number, (i: string) => parseFloat(i), (i) => isString(i)), [{ name: "string" }]);
  }

  export const union = t.union
  export const validate = rt.validate
}

export default Loi;
