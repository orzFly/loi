import * as t from '../iots';
import { decorate, ILoiOption, LoiFactory, metadata } from '../utilties/factory';
import { LoiFactoryBase } from './Base';

/** @internal */
export interface ILoiOptionArray extends ILoiOption {
  name: string,
  length?: number,
  min?: number,
  max?: number,
}

type Clean<T extends t.Any> = t.Type<T['_A'], T['_O'], T['_I']>
export type LoiFactoryTypeArray<E extends t.Any, T extends t.Any> = T & LoiFactoryArray<E, T> & LoiFactoryBase<T>

export class LoiFactoryArray<E extends t.Any, T extends t.Any> extends LoiFactory<T> {
  /** @internal */
  static decorate<E extends t.Any, T extends t.Any>(t: T): LoiFactoryTypeArray<E, T> {
    return LoiFactoryBase.decorate(decorate<T, LoiFactoryArray<E, t.Type<T['_A'], T['_O'], T['_I']>>>(this, t));
  }

  /**
   * Specifies the exact number of items in the array
   * @param limit the number of array items allowed
   */
  public length(limit: number) {
    const type = t.refinement(this, (i) => i.length == limit)
    return metadata(LoiFactoryArray.decorate<Clean<E>, Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionArray>{ name: `exact ${limit} items`, length: limit }
    });
  }

  /**
   * Specifies the maximum number of items in the array
   * @param limit the highest number of array items allowed
   */
  public max(limit: number) {
    const type = t.refinement(this, (i) => i.length <= limit)
    return metadata(LoiFactoryArray.decorate<Clean<E>, Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionArray>{ name: `<=${limit} items`, max: limit }
    });
  }

  /**
   * Specifies the minimum number of items in the array
   * @param limit the lowest number of array items allowed
   */
  public min(limit: number) {
    const type = t.refinement(this, (i) => i.length >= limit)
    return metadata(LoiFactoryArray.decorate<Clean<E>, Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionArray>{ name: `>=${limit} items`, min: limit }
    });
  }
}

export function array<E extends t.Any = t.Any>(
  elementType: E,
  name: string = `${elementType.name}[]`
) {
  const type = t.array(elementType as t.Type<E['_A'], E['_O'], E['_I']>, name)
  return metadata(LoiFactoryArray.decorate<Clean<E>, Clean<typeof type>>(type), {
    tag: name
  });
}
