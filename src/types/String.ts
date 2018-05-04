import * as t from 'io-ts';
import { isString } from 'lodash';
import { decorate, Factory, ILoiOption, metadata } from '../utilties/factory';
import { mimic } from '../utilties/mimic';
import { BaseFactory } from './Base';

export interface IStringOption extends ILoiOption {
  name: string
}

export class StringType extends t.Type<string> {
  readonly _tag: 'StringType' = 'StringType'
  constructor() {
    super(
      'string',
      (m): m is string => isString(m),
      (m, c) => (this.is(m) ? t.success(m.toString()) : t.failure(m, c)),
      t.identity
    )
  }
}

type Clean<T extends t.Any> = t.Type<T['_A'], T['_O'], T['_I']>
export type StringFactoryType<T extends t.Any> = T & StringFactory<T> & BaseFactory<T>

export class StringFactory<T extends t.Any> extends Factory<T> {
  static decorate<T extends t.Any>(t: T): StringFactoryType<T> {
    return BaseFactory.decorate(decorate<T, StringFactory<t.Type<T['_A'], T['_O'], T['_I']>>>(this, t));
  }
}

// tslint:disable-next-line:variable-name
export const string = mimic(function string() {
  const type = new StringType();
  return metadata(StringFactory.decorate<Clean<typeof type>>(type), {
    tag: "string"
  });
}, new StringType());