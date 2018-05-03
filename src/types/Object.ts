import * as t from 'io-ts';
import { decorate, Factory, ILoiOption, metadata } from '../utilties/factory';
import { getNameFromProps, interfaceWithOptionals, strictInterfaceWithOptionals, violetInterfaceWithOptionals } from '../utilties/object';
import { BaseFactory } from './Base';

export interface IObjectOption extends ILoiOption {
  name: string,
  type?: Function,
  instanceof?: Function,
  strict?: boolean,
  violet?: boolean,
}

export const loiObjectRequired = Symbol('loiObjectRequired')
export const loiObjectOptional = Symbol('loiObjectOptional')

type Clean<T extends t.Any> = t.Type<T['_A'], T['_O'], T['_I']>
export type ObjectFactoryType<R extends t.Props, O extends t.Props, T extends t.Any> = T & ObjectFactory<R, O, T> & BaseFactory<T>
export type InitialObjectFactoryType<R extends t.Props, O extends t.Props, T extends t.Any> = T & InitialObjectFactory<R, O, T> & ObjectFactory<R, O, T> & BaseFactory<T>

export class ObjectFactory<R extends t.Props, O extends t.Props, T extends t.Any> extends Factory<T> {
  [loiObjectRequired]: R
  [loiObjectOptional]: O

  static decorate<R extends t.Props, O extends t.Props, T extends t.Any>(t: T): ObjectFactoryType<R, O, T> {
    return BaseFactory.decorate(decorate<T, ObjectFactory<R, O, t.Type<T['_A'], T['_O'], T['_I']>>>(this, t));
  }

  public type<F>(constructor: { new(...args: any[]): F }) {
    const type = t.refinement(this, (i: any) => i && i.constructor === constructor) as t.Type<this['_A'] & F, this['_O'] & F, this['_I']>
    return metadata(ObjectFactory.decorate<R, O, Clean<typeof type>>(type), {
      parent: this,
      option: <IObjectOption>{ name: `type ${constructor.name}`, type: constructor }
    });
  }

  public instanceof<F>(constructor: { new(...args: any[]): F }) {
    const type = t.refinement(this, (i: any) => i instanceof constructor) as t.Type<this['_A'] & F, this['_O'] & F, this['_I']>
    return metadata(ObjectFactory.decorate<R, O, Clean<typeof type>>(type), {
      parent: this,
      option: <IObjectOption>{ name: `instanceof ${constructor.name}`, instanceof: constructor }
    });
  }
}

export class InitialObjectFactory<R extends t.Props, O extends t.Props, T extends t.Any> extends Factory<T> {
  [loiObjectRequired]: R
  [loiObjectOptional]: O

  static decorate<R extends t.Props, O extends t.Props, T extends t.Any>(t: T): InitialObjectFactoryType<R, O, T> {
    return ObjectFactory.decorate(BaseFactory.decorate(decorate<T, InitialObjectFactory<R, O, t.Type<T['_A'], T['_O'], T['_I']>>>(this, t)));
  }

  public strict() {
    const type = strictInterfaceWithOptionals(this[loiObjectRequired], this[loiObjectOptional], this.name)
    return metadata(ObjectFactory.decorate<R, O, Clean<typeof type>>(type), {
      parent: this,
      option: <IObjectOption>{ name: `strict`, strict: true }
    });
  }

  public violet() {
    const type = violetInterfaceWithOptionals(this[loiObjectRequired], this[loiObjectOptional], this.name)
    return metadata(ObjectFactory.decorate<R, O, Clean<typeof type>>(type), {
      parent: this,
      option: <IObjectOption>{ name: `violet`, violet: true }
    });
  }
}

type SimpleProps<P extends t.Props> = {
  [K in keyof P]: t.Type<P[K]['_A'], P[K]['_O'], P[K]['_I']>;
}

export function object<R extends t.Props = {}, O extends t.Props = {}>(
  required: R = {} as any,
  optional: O = {} as any,
  name: string = getNameFromProps(required, optional)
) {
  const type = interfaceWithOptionals(required as SimpleProps<R>, optional as SimpleProps<O>, name);
  const decorated = metadata(InitialObjectFactory.decorate<SimpleProps<R>, SimpleProps<O>, Clean<typeof type>>(type), {
    tag: name
  });
  decorated[loiObjectRequired] = required;
  decorated[loiObjectOptional] = optional;
  return decorated;
}
