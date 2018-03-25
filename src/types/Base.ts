import * as t from 'io-ts';
import { nullAsUndefined } from '../utilties/convert';
import { withDefault } from '../utilties/default';
import { decorate, Factory, ILoiOption, metadata } from '../utilties/factory';

export interface IBaseOption<T> extends ILoiOption {
  name: string,
  default?: T,
  nullAsUndefined?: boolean
}

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

  public default(value: this['_A']) {
    const type = withDefault(this, value);
    return metadata(BaseFactory.decorate(type), {
      parent: this,
      option: <IBaseOption<T>>{ name: `with default`, default: value }
    });
  }
}
