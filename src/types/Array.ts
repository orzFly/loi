import * as t from 'io-ts';
import { decorate, Factory, ILoiOption, metadata } from '../utilties/factory';
import { BaseFactory } from './Base';

export interface IArrayOption extends ILoiOption {
  name: string,
  length?: number,
  min?: number,
  max?: number,
}

type Clean<T extends t.Any> = t.Type<T['_A'], T['_O'], T['_I']>
export type ArrayFactoryType<E extends t.Any, T extends t.Any> = T & ArrayFactory<E, T> & BaseFactory<T>

export class ArrayFactory<E extends t.Any, T extends t.Any> extends Factory<T> {
  static decorate<E extends t.Any, T extends t.Any>(t: T): ArrayFactoryType<E, T> {
    return BaseFactory.decorate(decorate<T, ArrayFactory<E, t.Type<T['_A'], T['_O'], T['_I']>>>(this, t));
  }

  /**
   * Specifies the exact number of items in the array
   * @param limit the number of array items allowed
   */
  public length(limit: number) {
    const type = t.refinement(this, (i) => i.length == limit)
    return metadata(ArrayFactory.decorate<Clean<E>, Clean<typeof type>>(type), {
      parent: this,
      option: <IArrayOption>{ name: `exact ${limit} items`, length: limit }
    });
  }

  /**
   * Specifies the maximum number of items in the array
   * @param limit the highest number of array items allowed
   */
  public max(limit: number) {
    const type = t.refinement(this, (i) => i.length <= limit)
    return metadata(ArrayFactory.decorate<Clean<E>, Clean<typeof type>>(type), {
      parent: this,
      option: <IArrayOption>{ name: `<=${limit} items`, length: limit }
    });
  }

  /**
   * Specifies the minimum number of items in the array
   * @param limit the lowest number of array items allowed
   */
  public min(limit: number) {
    const type = t.refinement(this, (i) => i.length >= limit)
    return metadata(ArrayFactory.decorate<Clean<E>, Clean<typeof type>>(type), {
      parent: this,
      option: <IArrayOption>{ name: `>=${limit} items`, length: limit }
    });
  }
}

export function array<E extends t.Any = t.Any>(
  elementType: E,
  name: string = `${elementType.name}[]`
) {
  const type = t.array(elementType as t.Type<E['_A'], E['_O'], E['_I']>, name)
  return metadata(ArrayFactory.decorate<Clean<E>, Clean<typeof type>>(type), {
    tag: name
  });
}
