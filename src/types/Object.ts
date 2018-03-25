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

export class ObjectFactory<R extends t.Props, O extends t.Props, T extends t.Any> extends Factory<T> {
  [loiObjectRequired]: R
  [loiObjectOptional]: O

  static decorate<R extends t.Props, O extends t.Props, T extends t.Any>(t: T) {
    return BaseFactory.decorate(decorate<T, ObjectFactory<R, O, t.Type<T['_A'], T['_O'], T['_I']>>>(this, t));
  }

  public type<F>(constructor: { new(...args: any[]): F }) {
    const type = t.refinement(this, (i: any) => i && i.constructor === constructor) as t.Type<this['_A'] & F, this['_O'] & F, this['_I']>
    return metadata(ObjectFactory.decorate<R, O, typeof type>(type), {
      parent: this,
      option: <IObjectOption>{ name: `type ${constructor.name}`, type: constructor }
    });
  }

  public instanceof<F>(constructor: { new(...args: any[]): F }) {
    const type = t.refinement(this, (i: any) => i instanceof constructor) as t.Type<this['_A'] & F, this['_O'] & F, this['_I']>
    return metadata(ObjectFactory.decorate<R, O, typeof type>(type), {
      parent: this,
      option: <IObjectOption>{ name: `instanceof ${constructor.name}`, instanceof: constructor }
    });
  }
}

export class InitialObjectFactory<R extends t.Props, O extends t.Props, T extends t.Any> extends Factory<T> {
  [loiObjectRequired]: R
  [loiObjectOptional]: O

  static decorate<R extends t.Props, O extends t.Props, T extends t.Any>(t: T) {
    return ObjectFactory.decorate(BaseFactory.decorate(decorate<T, InitialObjectFactory<R, O, t.Type<T['_A'], T['_O'], T['_I']>>>(this, t)));
  }

  public strict() {
    const type = strictInterfaceWithOptionals(this[loiObjectRequired], this[loiObjectOptional], this.name)
    return metadata(ObjectFactory.decorate<R, O, typeof type>(type), {
      parent: this,
      option: <IObjectOption>{ name: `strict`, strict: true }
    });
  }

  public violet() {
    const type = violetInterfaceWithOptionals(this[loiObjectRequired], this[loiObjectOptional], this.name)
    return metadata(ObjectFactory.decorate<R, O, typeof type>(type), {
      parent: this,
      option: <IObjectOption>{ name: `violet`, violet: true }
    });
  }
}

export function object<R extends t.Props = {}, O extends t.Props = {}>(
  required: R = {} as any,
  optional: O = {} as any,
  name: string = getNameFromProps(required, optional)
) {
  const type = interfaceWithOptionals(required, optional, name);
  const decorated = metadata(InitialObjectFactory.decorate<R, O, typeof type>(type), {
    tag: name
  });
  decorated[loiObjectRequired] = required;
  decorated[loiObjectOptional] = optional;
  return decorated;
}
