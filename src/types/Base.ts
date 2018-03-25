import * as t from 'io-ts';
import { decorate, Factory, ILoiOption, metadata } from '../factory';
import * as rt from '../RuntimeType';

export interface IBaseOption<T> extends ILoiOption {
  name: string,
  default?: T,
  nullAsUndefined?: boolean
}

export class BaseFactory<T extends t.Any> extends Factory<T> {
  static decorate<T extends t.Any>(t: T) {
    return decorate<T, BaseFactory<t.Type<T['_A'], T['_O'], T['_I']>>>(this, t);
  }

  public default(value: this['_A']) {
    const type = rt.withDefault(this, value);
    return metadata(BaseFactory.decorate(type), {
      parent: this,
      option: <IBaseOption<T>>{ name: `with default`, default: value }
    });
  }

  public nullAsUndefined() {
    const type = rt.nullAsUndefined(this);
    return metadata(BaseFactory.decorate(type), {
      parent: this,
      option: <IBaseOption<T>>{ name: `null as undefined`, nullAsUndefined: true }
    });
  }
}
