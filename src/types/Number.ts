import * as t from 'io-ts';
import { isString } from 'lodash';
import { decorate, Factory, ILoiOption } from '../factory';
import * as rt from '../RuntimeType';

export interface INumberOption extends ILoiOption {
  name: string,
  max?: number
  min?: number
  greater?: number
  less?: number
  integer?: boolean
  finite?: boolean
}

function metadata<T, LO extends ILoiOption>(t: T, params?: {
  parent?: any,
  tag?: string,
  option?: LO
}): T {
  const tag: string = (params && params.tag) || (params && params.parent && params.parent.loiTag) || "unknown";
  const options = [...(params && params.parent && params.parent.loiOption || []), ...(params && params.option ? [params && params.option] : [])];
  (<any>t).name = `${tag}${options.length ? `(${options.map((i) => i.name || JSON.stringify(i)).join(", ")})` : ""}`;
  (<any>t).loiTag = tag;
  (<any>t).loiOption = options;
  return t;
}

export class NumberFactory<T extends t.Any> extends Factory<T> {
  static loiTag = "number"
  static decorate<T extends t.Any>(t: T) {
    return decorate<T, NumberFactory<T>>(this, t);
  }

  public max(limit: number) {
    const type = t.refinement(this, (n) => n <= limit) as t.Type<T['_A'], T['_O'], T['_I']>;
    return metadata(NumberFactory.decorate(type), {
      parent: this,
      tag: "number",
      option: <INumberOption>{ name: `<=${limit}`, max: limit }
    });
  }

  public min(limit: number) {
    const type = t.refinement(this, (n) => n >= limit) as t.Type<T['_A'], T['_O'], T['_I']>;
    return metadata(NumberFactory.decorate(type), {
      parent: this,
      tag: "number",
      option: <INumberOption>{ name: `>=${limit}`, min: limit }
    });
  }

  public greater(limit: number) {
    const type = t.refinement(this, (n) => n > limit) as t.Type<T['_A'], T['_O'], T['_I']>;
    return metadata(NumberFactory.decorate(type), {
      parent: this,
      tag: "number",
      option: <INumberOption>{ name: `>${limit}`, greater: limit }
    });
  }

  public less(limit: number) {
    const type = t.refinement(this, (n) => n < limit) as t.Type<T['_A'], T['_O'], T['_I']>;
    return metadata(NumberFactory.decorate(type), {
      parent: this,
      tag: "number",
      option: <INumberOption>{ name: `<${limit}`, less: limit }
    });
  }

  public negative() {
    const type = t.refinement(this, (n) => n < 0) as t.Type<T['_A'], T['_O'], T['_I']>;
    return metadata(NumberFactory.decorate(type), {
      parent: this,
      tag: "number",
      option: <INumberOption>{ name: `-`, less: 0 }
    });
  }

  public positive() {
    const type = t.refinement(this, (n) => n > 0) as t.Type<T['_A'], T['_O'], T['_I']>;
    return metadata(NumberFactory.decorate(type), {
      parent: this,
      tag: "number",
      option: <INumberOption>{ name: `+`, greater: 0 }
    });
  }

  public integer() {
    const type = t.refinement(this, (n) => n % 1 === 0) as t.Type<T['_A'], T['_O'], T['_I']>;
    return metadata(NumberFactory.decorate(type), {
      parent: this,
      tag: "number",
      option: <INumberOption>{ name: `integer`, integer: true }
    });
  }

  public finite() {
    const type = t.refinement(this, (n) => Number.isFinite(n)) as t.Type<T['_A'], T['_O'], T['_I']>;
    return metadata(NumberFactory.decorate(type), {
      parent: this,
      tag: "number",
      option: <INumberOption>{ name: `finite`, finite: true }
    });
  }

  public default(value: this['_A']) {
    return rt.withDefault(this, value)
  }
}

export function number() {
  const type = new t.NumberType();
  return metadata(NumberFactory.decorate(type), {
    tag: "number"
  });
}

export function numberOrNumericString() {
  const type = rt.convert(t.number, (i: string) => parseFloat(i), (i) => isString(i));
  return metadata(NumberFactory.decorate(type), {
    tag: "number",
    option: { name: "numericString" }
  });
}
