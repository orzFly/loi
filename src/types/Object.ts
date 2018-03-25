import * as t from 'io-ts';
import { decorate, Factory, ILoiOption, metadata } from '../factory';
import * as rt from '../RuntimeType';
import { BaseFactory } from './Base';

const getNameFromProps = (required: t.Props = {}, optional: t.Props = {}): string =>
  `{ ${[
    ...Object.keys(required).map((k) => `${k}: ${required[k].name}`),
    ...Object.keys(optional).map((k) => `${k}?: ${optional[k].name}`),
  ].join(', ')} }`

export interface IObjectOption<T> extends ILoiOption {
  name: string,
  type: Function,
}

export class ObjectFactory<R extends t.Props, O extends t.Props, T extends t.Any> extends Factory<T> {
  static decorate<R extends t.Props, O extends t.Props, T extends t.Any>(t: T) {
    return BaseFactory.decorate(decorate<T, ObjectFactory<R, O, t.Type<T['_A'], T['_O'], T['_I']>>>(this, t));
  }

  public type<F>(constructor: { new(...args: any[]): F }) {
    const type = t.refinement(this, (i: any) => i instanceof constructor) as t.Type<this['_A'] & F, this['_O'] & F, this['_I']>
    return metadata(ObjectFactory.decorate<R, O, typeof type>(type), {
      parent: this,
      option: <IObjectOption<T>>{ name: `instanceof ${constructor.name}`, type: constructor }
    });
  }
}

export function object<R extends t.Props = {}, O extends t.Props = {}>(
  required: R = {} as any,
  optional: O = {} as any,
  name: string = getNameFromProps(required, optional)
) {
  const type = rt.interfaceWithOptionals(required, optional, name);
  return metadata(ObjectFactory.decorate<R, O, typeof type>(type), {
    tag: name
  });
}