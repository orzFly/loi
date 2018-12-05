import * as t from 'io-ts';
import { LoiDecoratorDefault, LoiDecoratorDefaultResolver } from '../decorators/default';
import { LoiDecoratorNotNullable, LoiDecoratorNullable } from '../decorators/nullable';
import { LoiDecoratorNullAsUndefined } from '../decorators/nullAsUndefined';
import { LoiDecoratorRescue, LoiDecoratorRescueResolver } from '../decorators/rescue';
import { LoiDecoratorNotUndefinedable, LoiDecoratorUndefinedable } from '../decorators/undefinedable';
import { decorate, ILoiOption, LoiFactory, loiTag, metadata } from '../utilties/factory';

/** @internal */
export interface ILoiOptionBase<T> extends ILoiOption {
  name: string,
  default?: T,
  defaultResolver?: () => T,
  rescue?: T,
  rescueResolver?: () => T,
  nullAsUndefined?: boolean,
  nullable?: boolean,
  undefinedable?: boolean,
}

export type LoiFactoryTypeBaseUnion<T extends t.Any> = t.UnionType<(T)[], (T)["_A"], (T)["_O"], t.mixed> & LoiFactoryBase<t.Type<(T)["_A"], (T)["_O"], t.mixed>>;
export type LoiFactoryTypeBase<T extends t.Any> = T & LoiFactoryBase<T>
type Clean<T extends t.Any> = t.Type<T['_A'], T['_O'], T['_I']>

export class LoiFactoryBase<T extends t.Any> extends LoiFactory<T> {
  /** @internal */
  static decorate<T extends t.Any>(t: T): LoiFactoryTypeBase<T> {
    return decorate<T, LoiFactoryBase<t.Type<T['_A'], T['_O'], T['_I']>>>(this, t);
  }

  public nullAsUndefined() {
    const type = new LoiDecoratorNullAsUndefined(this);
    return metadata(LoiFactoryBase.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionBase<T>>{ name: `null as undefined`, nullAsUndefined: true }
    });
  }

  public nullable<CVS extends (string | number | boolean | null | undefined)[]>(allow?: true, ...castValues: CVS): LoiFactoryTypeBase<t.Type<this["_A"] | null, this["_O"] | null, this["_I"]>>;
  public nullable(allow: false): LoiFactoryTypeBase<t.Type<Exclude<this["_A"], null>, Exclude<this["_O"], null>, this["_I"]>>;
  public nullable(_allow: boolean = true, ...castValues: any[]): any {
    if (_allow) {
      const type = new LoiDecoratorNullable(this, castValues);
      return metadata(LoiFactoryBase.decorate<Clean<typeof type>>(type), {
        parent: this,
        option: <ILoiOptionBase<T>>{ name: `nullable`, nullable: true },
        optionFilter: (i: ILoiOptionBase<any>) => i.nullable !== true && i.nullable !== false
      });
    } else {
      const type = new LoiDecoratorNotNullable(this);
      return metadata(LoiFactoryBase.decorate<Clean<typeof type>>(type), {
        parent: this,
        option: <ILoiOptionBase<T>>{ name: `not nullable`, nullable: false },
        optionFilter: (i: ILoiOptionBase<any>) => i.nullable !== true && i.nullable !== false
      });
    }
  }

  public undefinedable<CVS extends (string | number | boolean | null | undefined)[]>(allow?: true, ...castValues: CVS): LoiFactoryTypeBase<t.Type<this["_A"] | undefined, this["_O"] | undefined, this["_I"]>>;
  public undefinedable(allow: false): LoiFactoryTypeBase<t.Type<Exclude<this["_A"], undefined>, Exclude<this["_O"], undefined>, this["_I"]>>;
  public undefinedable(_allow: boolean = true, ...castValues: any[]): any {
    if (_allow) {
      const type = new LoiDecoratorUndefinedable(this, castValues);
      return metadata(LoiFactoryBase.decorate<Clean<typeof type>>(type), {
        parent: this,
        option: <ILoiOptionBase<T>>{ name: `undefinedable`, undefinedable: true },
        optionFilter: (i: ILoiOptionBase<any>) => i.undefinedable !== true && i.undefinedable !== false
      });
    } else {
      const type = new LoiDecoratorNotUndefinedable(this);
      return metadata(LoiFactoryBase.decorate<Clean<typeof type>>(type), {
        parent: this,
        option: <ILoiOptionBase<T>>{ name: `not undefinedable`, undefinedable: false },
        optionFilter: (i: ILoiOptionBase<any>) => i.undefinedable !== true && i.undefinedable !== false
      });
    }
  }

  /**
   * Sets properties default values when calling t.validate() method on models
   * @param value default value
   */
  public default(value: this['_A']) {
    const type = new LoiDecoratorDefault(this, value);
    return metadata(LoiFactoryBase.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionBase<T>>{ name: `with default`, default: value }
    });
  }

  /**
   * Sets properties default values with resolver functions when calling t.validate() method on models
   * @param value default value resolver
   */
  public defaultResolver(resolver: () => this['_A']) {
    const type = new LoiDecoratorDefaultResolver(this, resolver);
    return metadata(LoiFactoryBase.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionBase<T>>{ name: `with default`, defaultResolver: resolver }
    });
  }

  /**
   * Make it never fails with rescue value
   * @param value rescue value
   */
  public rescue(value: this['_A']) {
    const type = new LoiDecoratorRescue(this, value);
    return metadata(LoiFactoryBase.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionBase<T>>{ name: `with rescue`, rescue: value }
    });
  }

  /**
   * Make it never fails with rescue resolver
   * @param value rescue value resolver
   */
  public rescueResolver(resolver: () => this['_A']) {
    const type = new LoiDecoratorRescueResolver(this, resolver);
    return metadata(LoiFactoryBase.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionBase<T>>{ name: `with rescue`, rescueResolver: resolver }
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
  public finish() { return this.asBaseType(); }

  /**
   * Return the base io-ts type without Loi decorators.
   */
  public end() { return this.asBaseType(); }

  /**
   * Return the base io-ts type without Loi decorators.
   */
  public simple() { return this.asBaseType(); }

  /**
   * Return the base io-ts type without Loi decorators.
   */
  public clean() { return this.asBaseType(); }

  /*
    [...Array(16)].map((_, i) =>
      `public allow<${[...Array(i + 1)].map((_, i) => `T${i + 1} extends t.Any`).join(", ")}>(${[...Array(i + 1)].map((_, i) => `t${i + 1}: T${i + 1}`).join(", ")}): BaseFactoryUnionType<t.Type<this['_A'], this['_O'], this['_I']> | ${[...Array(i + 1)].map((_, i) => `t.Type<T${i + 1}['_A'], T${i + 1}['_O'], T${i + 1}['_I']>`).join(" | ")}>`
    ).join("\n")
  */
  public allow<T1 extends t.Any>(t1: T1): LoiFactoryTypeBaseUnion<t.Type<this['_A'], this['_O'], this['_I']> | t.Type<T1['_A'], T1['_O'], T1['_I']>>
  public allow<T1 extends t.Any, T2 extends t.Any>(t1: T1, t2: T2): LoiFactoryTypeBaseUnion<t.Type<this['_A'], this['_O'], this['_I']> | t.Type<T1['_A'], T1['_O'], T1['_I']> | t.Type<T2['_A'], T2['_O'], T2['_I']>>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any>(t1: T1, t2: T2, t3: T3): LoiFactoryTypeBaseUnion<t.Type<this['_A'], this['_O'], this['_I']> | t.Type<T1['_A'], T1['_O'], T1['_I']> | t.Type<T2['_A'], T2['_O'], T2['_I']> | t.Type<T3['_A'], T3['_O'], T3['_I']>>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4): LoiFactoryTypeBaseUnion<t.Type<this['_A'], this['_O'], this['_I']> | t.Type<T1['_A'], T1['_O'], T1['_I']> | t.Type<T2['_A'], T2['_O'], T2['_I']> | t.Type<T3['_A'], T3['_O'], T3['_I']> | t.Type<T4['_A'], T4['_O'], T4['_I']>>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): LoiFactoryTypeBaseUnion<t.Type<this['_A'], this['_O'], this['_I']> | t.Type<T1['_A'], T1['_O'], T1['_I']> | t.Type<T2['_A'], T2['_O'], T2['_I']> | t.Type<T3['_A'], T3['_O'], T3['_I']> | t.Type<T4['_A'], T4['_O'], T4['_I']> | t.Type<T5['_A'], T5['_O'], T5['_I']>>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): LoiFactoryTypeBaseUnion<t.Type<this['_A'], this['_O'], this['_I']> | t.Type<T1['_A'], T1['_O'], T1['_I']> | t.Type<T2['_A'], T2['_O'], T2['_I']> | t.Type<T3['_A'], T3['_O'], T3['_I']> | t.Type<T4['_A'], T4['_O'], T4['_I']> | t.Type<T5['_A'], T5['_O'], T5['_I']> | t.Type<T6['_A'], T6['_O'], T6['_I']>>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any, T7 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): LoiFactoryTypeBaseUnion<t.Type<this['_A'], this['_O'], this['_I']> | t.Type<T1['_A'], T1['_O'], T1['_I']> | t.Type<T2['_A'], T2['_O'], T2['_I']> | t.Type<T3['_A'], T3['_O'], T3['_I']> | t.Type<T4['_A'], T4['_O'], T4['_I']> | t.Type<T5['_A'], T5['_O'], T5['_I']> | t.Type<T6['_A'], T6['_O'], T6['_I']> | t.Type<T7['_A'], T7['_O'], T7['_I']>>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any, T7 extends t.Any, T8 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8): LoiFactoryTypeBaseUnion<t.Type<this['_A'], this['_O'], this['_I']> | t.Type<T1['_A'], T1['_O'], T1['_I']> | t.Type<T2['_A'], T2['_O'], T2['_I']> | t.Type<T3['_A'], T3['_O'], T3['_I']> | t.Type<T4['_A'], T4['_O'], T4['_I']> | t.Type<T5['_A'], T5['_O'], T5['_I']> | t.Type<T6['_A'], T6['_O'], T6['_I']> | t.Type<T7['_A'], T7['_O'], T7['_I']> | t.Type<T8['_A'], T8['_O'], T8['_I']>>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any, T7 extends t.Any, T8 extends t.Any, T9 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9): LoiFactoryTypeBaseUnion<t.Type<this['_A'], this['_O'], this['_I']> | t.Type<T1['_A'], T1['_O'], T1['_I']> | t.Type<T2['_A'], T2['_O'], T2['_I']> | t.Type<T3['_A'], T3['_O'], T3['_I']> | t.Type<T4['_A'], T4['_O'], T4['_I']> | t.Type<T5['_A'], T5['_O'], T5['_I']> | t.Type<T6['_A'], T6['_O'], T6['_I']> | t.Type<T7['_A'], T7['_O'], T7['_I']> | t.Type<T8['_A'], T8['_O'], T8['_I']> | t.Type<T9['_A'], T9['_O'], T9['_I']>>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any, T7 extends t.Any, T8 extends t.Any, T9 extends t.Any, T10 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10): LoiFactoryTypeBaseUnion<t.Type<this['_A'], this['_O'], this['_I']> | t.Type<T1['_A'], T1['_O'], T1['_I']> | t.Type<T2['_A'], T2['_O'], T2['_I']> | t.Type<T3['_A'], T3['_O'], T3['_I']> | t.Type<T4['_A'], T4['_O'], T4['_I']> | t.Type<T5['_A'], T5['_O'], T5['_I']> | t.Type<T6['_A'], T6['_O'], T6['_I']> | t.Type<T7['_A'], T7['_O'], T7['_I']> | t.Type<T8['_A'], T8['_O'], T8['_I']> | t.Type<T9['_A'], T9['_O'], T9['_I']> | t.Type<T10['_A'], T10['_O'], T10['_I']>>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any, T7 extends t.Any, T8 extends t.Any, T9 extends t.Any, T10 extends t.Any, T11 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11): LoiFactoryTypeBaseUnion<t.Type<this['_A'], this['_O'], this['_I']> | t.Type<T1['_A'], T1['_O'], T1['_I']> | t.Type<T2['_A'], T2['_O'], T2['_I']> | t.Type<T3['_A'], T3['_O'], T3['_I']> | t.Type<T4['_A'], T4['_O'], T4['_I']> | t.Type<T5['_A'], T5['_O'], T5['_I']> | t.Type<T6['_A'], T6['_O'], T6['_I']> | t.Type<T7['_A'], T7['_O'], T7['_I']> | t.Type<T8['_A'], T8['_O'], T8['_I']> | t.Type<T9['_A'], T9['_O'], T9['_I']> | t.Type<T10['_A'], T10['_O'], T10['_I']> | t.Type<T11['_A'], T11['_O'], T11['_I']>>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any, T7 extends t.Any, T8 extends t.Any, T9 extends t.Any, T10 extends t.Any, T11 extends t.Any, T12 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12): LoiFactoryTypeBaseUnion<t.Type<this['_A'], this['_O'], this['_I']> | t.Type<T1['_A'], T1['_O'], T1['_I']> | t.Type<T2['_A'], T2['_O'], T2['_I']> | t.Type<T3['_A'], T3['_O'], T3['_I']> | t.Type<T4['_A'], T4['_O'], T4['_I']> | t.Type<T5['_A'], T5['_O'], T5['_I']> | t.Type<T6['_A'], T6['_O'], T6['_I']> | t.Type<T7['_A'], T7['_O'], T7['_I']> | t.Type<T8['_A'], T8['_O'], T8['_I']> | t.Type<T9['_A'], T9['_O'], T9['_I']> | t.Type<T10['_A'], T10['_O'], T10['_I']> | t.Type<T11['_A'], T11['_O'], T11['_I']> | t.Type<T12['_A'], T12['_O'], T12['_I']>>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any, T7 extends t.Any, T8 extends t.Any, T9 extends t.Any, T10 extends t.Any, T11 extends t.Any, T12 extends t.Any, T13 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13): LoiFactoryTypeBaseUnion<t.Type<this['_A'], this['_O'], this['_I']> | t.Type<T1['_A'], T1['_O'], T1['_I']> | t.Type<T2['_A'], T2['_O'], T2['_I']> | t.Type<T3['_A'], T3['_O'], T3['_I']> | t.Type<T4['_A'], T4['_O'], T4['_I']> | t.Type<T5['_A'], T5['_O'], T5['_I']> | t.Type<T6['_A'], T6['_O'], T6['_I']> | t.Type<T7['_A'], T7['_O'], T7['_I']> | t.Type<T8['_A'], T8['_O'], T8['_I']> | t.Type<T9['_A'], T9['_O'], T9['_I']> | t.Type<T10['_A'], T10['_O'], T10['_I']> | t.Type<T11['_A'], T11['_O'], T11['_I']> | t.Type<T12['_A'], T12['_O'], T12['_I']> | t.Type<T13['_A'], T13['_O'], T13['_I']>>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any, T7 extends t.Any, T8 extends t.Any, T9 extends t.Any, T10 extends t.Any, T11 extends t.Any, T12 extends t.Any, T13 extends t.Any, T14 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14): LoiFactoryTypeBaseUnion<t.Type<this['_A'], this['_O'], this['_I']> | t.Type<T1['_A'], T1['_O'], T1['_I']> | t.Type<T2['_A'], T2['_O'], T2['_I']> | t.Type<T3['_A'], T3['_O'], T3['_I']> | t.Type<T4['_A'], T4['_O'], T4['_I']> | t.Type<T5['_A'], T5['_O'], T5['_I']> | t.Type<T6['_A'], T6['_O'], T6['_I']> | t.Type<T7['_A'], T7['_O'], T7['_I']> | t.Type<T8['_A'], T8['_O'], T8['_I']> | t.Type<T9['_A'], T9['_O'], T9['_I']> | t.Type<T10['_A'], T10['_O'], T10['_I']> | t.Type<T11['_A'], T11['_O'], T11['_I']> | t.Type<T12['_A'], T12['_O'], T12['_I']> | t.Type<T13['_A'], T13['_O'], T13['_I']> | t.Type<T14['_A'], T14['_O'], T14['_I']>>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any, T7 extends t.Any, T8 extends t.Any, T9 extends t.Any, T10 extends t.Any, T11 extends t.Any, T12 extends t.Any, T13 extends t.Any, T14 extends t.Any, T15 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14, t15: T15): LoiFactoryTypeBaseUnion<t.Type<this['_A'], this['_O'], this['_I']> | t.Type<T1['_A'], T1['_O'], T1['_I']> | t.Type<T2['_A'], T2['_O'], T2['_I']> | t.Type<T3['_A'], T3['_O'], T3['_I']> | t.Type<T4['_A'], T4['_O'], T4['_I']> | t.Type<T5['_A'], T5['_O'], T5['_I']> | t.Type<T6['_A'], T6['_O'], T6['_I']> | t.Type<T7['_A'], T7['_O'], T7['_I']> | t.Type<T8['_A'], T8['_O'], T8['_I']> | t.Type<T9['_A'], T9['_O'], T9['_I']> | t.Type<T10['_A'], T10['_O'], T10['_I']> | t.Type<T11['_A'], T11['_O'], T11['_I']> | t.Type<T12['_A'], T12['_O'], T12['_I']> | t.Type<T13['_A'], T13['_O'], T13['_I']> | t.Type<T14['_A'], T14['_O'], T14['_I']> | t.Type<T15['_A'], T15['_O'], T15['_I']>>
  public allow<T1 extends t.Any, T2 extends t.Any, T3 extends t.Any, T4 extends t.Any, T5 extends t.Any, T6 extends t.Any, T7 extends t.Any, T8 extends t.Any, T9 extends t.Any, T10 extends t.Any, T11 extends t.Any, T12 extends t.Any, T13 extends t.Any, T14 extends t.Any, T15 extends t.Any, T16 extends t.Any>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14, t15: T15, t16: T16): LoiFactoryTypeBaseUnion<t.Type<this['_A'], this['_O'], this['_I']> | t.Type<T1['_A'], T1['_O'], T1['_I']> | t.Type<T2['_A'], T2['_O'], T2['_I']> | t.Type<T3['_A'], T3['_O'], T3['_I']> | t.Type<T4['_A'], T4['_O'], T4['_I']> | t.Type<T5['_A'], T5['_O'], T5['_I']> | t.Type<T6['_A'], T6['_O'], T6['_I']> | t.Type<T7['_A'], T7['_O'], T7['_I']> | t.Type<T8['_A'], T8['_O'], T8['_I']> | t.Type<T9['_A'], T9['_O'], T9['_I']> | t.Type<T10['_A'], T10['_O'], T10['_I']> | t.Type<T11['_A'], T11['_O'], T11['_I']> | t.Type<T12['_A'], T12['_O'], T12['_I']> | t.Type<T13['_A'], T13['_O'], T13['_I']> | t.Type<T14['_A'], T14['_O'], T14['_I']> | t.Type<T15['_A'], T15['_O'], T15['_I']> | t.Type<T16['_A'], T16['_O'], T16['_I']>>

  public allow<T extends t.Any>(...ts: T[]) {
    const type = t.union([this, ...ts]);
    return metadata(LoiFactoryBase.decorate<Clean<typeof type>>(type), {
      tag: type.name
    });
  }
}

export function start<T extends t.Any = t.Any>(type: T, name: string = (<any>type)[loiTag] || type.name) {
  const clonedType = Object.create(type);
  return metadata(LoiFactoryBase.decorate<Clean<T>>(clonedType), {
    parent: type,
    tag: name
  });
}