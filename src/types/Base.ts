import * as t from 'io-ts';
import { nullAsUndefined } from '../utilties/convert';
import { withDefault, withDefaultResolver } from '../utilties/default';
import { decorate, Factory, ILoiOption, metadata } from '../utilties/factory';

export interface IBaseOption<T> extends ILoiOption {
  name: string,
  default?: T,
  defaultResolver?: () => T,
  nullAsUndefined?: boolean
}

export type BaseFactoryUnionType<T extends t.Any> = t.UnionType<(T)[], (T)["_A"], (T)["_O"], t.mixed> & BaseFactory<t.Type<(T)["_A"], (T)["_O"], t.mixed>>;

export class BaseFactory<T extends t.Any> extends Factory<T> {
  static decorate<T extends t.Any>(t: T) {
    return decorate<T, BaseFactory<t.Type<T['_A'], T['_O'], T['_I']>>>(this, t);
  }

  public nullAsUndefined() {
    const type = nullAsUndefined(this);
    return metadata(BaseFactory.decorate(type), {
      parent: this,
      option: <IBaseOption<T>>{ name: `null as undefined`, nullAsUndefined: true }
    });
  }

  /**
   * Sets properties default values when calling t.validate() method on models
   * @param value default value
   */
  public default(value: this['_A']) {
    const type = withDefault(this, value);
    return metadata(BaseFactory.decorate(type), {
      parent: this,
      option: <IBaseOption<T>>{ name: `with default`, default: value }
    });
  }

  /**
   * Sets properties default values with resolver functions when calling t.validate() method on models
   * @param value default value resolver
   */
  public defaultResolver(resolver: () => this['_A']) {
    const type = withDefaultResolver(this, resolver);
    return metadata(BaseFactory.decorate(type), {
      parent: this,
      option: <IBaseOption<T>>{ name: `with default`, defaultResolver: resolver }
    });
  }

  /**
   * Return the base io-ts type without Loi decorators.
   */
  public asBaseType(): t.Type<T['_A'], T['_O'], T['_I']> {
    return this;
  }

  /**
   * Return the base io-ts type without Loi decorators.
   */
  public finish(): t.Type<T['_A'], T['_O'], T['_I']> {
    return this;
  }

  /**
   * Return the base io-ts type without Loi decorators.
   */
  public end(): t.Type<T['_A'], T['_O'], T['_I']> {
    return this;
  }

  /**
   * Return the base io-ts type without Loi decorators.
   */
  public simple(): t.Type<T['_A'], T['_O'], T['_I']> {
    return this;
  }

  /*
    [...Array(16)].map((_, i) =>
      `public allow<${[...Array(i + 1)].map((_, i) => `T${i + 1} extends t.Any`).join(", ")}>(${[...Array(i + 1)].map((_, i) => `t${i + 1}: T${i + 1}`).join(", ")}): BaseFactoryUnionType<this | ${[...Array(i + 1)].map((_, i) => `T${i + 1}`).join(" | ")}>`
    ).join("\n")
  */
  public allow<T1 extends t.Any>(t1: T1): BaseFactoryUnionType<this | T1>
  public allow<T1 extends t.Any, T2 extends t.Any>(t1: T1, t2: T2): BaseFactoryUnionType<this | T1 | T2>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any>(t1: T1, t2: T2, t3: T3): BaseFactoryUnionType<this | T1 | T2 | T3>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4): BaseFactoryUnionType<this | T1 | T2 | T3 | T4>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): BaseFactoryUnionType<this | T1 | T2 | T3 | T4 | T5>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): BaseFactoryUnionType<this | T1 | T2 | T3 | T4 | T5 | T6>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any, T7 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): BaseFactoryUnionType<this | T1 | T2 | T3 | T4 | T5 | T6 | T7>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any, T7 extends t.Any, T8 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8): BaseFactoryUnionType<this | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any, T7 extends t.Any, T8 extends t.Any, T9 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9): BaseFactoryUnionType<this | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any, T7 extends t.Any, T8 extends t.Any, T9 extends t.Any, T10 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10): BaseFactoryUnionType<this | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any, T7 extends t.Any, T8 extends t.Any, T9 extends t.Any, T10 extends t.Any, T11 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11): BaseFactoryUnionType<this | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | T11>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any, T7 extends t.Any, T8 extends t.Any, T9 extends t.Any, T10 extends t.Any, T11 extends t.Any, T12 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12): BaseFactoryUnionType<this | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | T11 | T12>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any, T7 extends t.Any, T8 extends t.Any, T9 extends t.Any, T10 extends t.Any, T11 extends t.Any, T12 extends t.Any, T13 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13): BaseFactoryUnionType<this | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | T11 | T12 | T13>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any, T7 extends t.Any, T8 extends t.Any, T9 extends t.Any, T10 extends t.Any, T11 extends t.Any, T12 extends t.Any, T13 extends t.Any, T14 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14): BaseFactoryUnionType<this | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | T11 | T12 | T13 | T14>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any, T7 extends t.Any, T8 extends t.Any, T9 extends t.Any, T10 extends t.Any, T11 extends t.Any, T12 extends t.Any, T13 extends t.Any, T14 extends t.Any, T15 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14, t15: T15): BaseFactoryUnionType<this | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | T11 | T12 | T13 | T14 | T15>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any, T7 extends t.Any, T8 extends t.Any, T9 extends t.Any, T10 extends t.Any, T11 extends t.Any, T12 extends t.Any, T13 extends t.Any, T14 extends t.Any, T15 extends t.Any, T16 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14, t15: T15, t16: T16): BaseFactoryUnionType<this | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | T11 | T12 | T13 | T14 | T15 | T16>

  public allow<T extends t.Any>(...ts: T[]) {
    const type = t.union([this, ...ts]);
    return metadata(BaseFactory.decorate(type), {
      parent: this,
      tag: type.name
    });
  }
}