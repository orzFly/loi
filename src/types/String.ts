import * as t from 'io-ts';
import { isString } from 'lodash';
import { decorate, ILoiOption, LoiFactory, metadata } from '../utilties/factory';
import { mimic } from '../utilties/mimic';
import { LoiFactoryBase } from './Base';

export interface ILoiOptionString extends ILoiOption {
  name: string
  length?: number
  min?: number
  max?: number
  regex?: RegExp
}

export class LoiTypeString extends t.Type<string> {
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
export type LoiFactoryTypeString<T extends t.Any> = T & LoiFactoryString<T> & LoiFactoryBase<T>

export class LoiFactoryString<T extends t.Any> extends LoiFactory<T> {
  static decorate<T extends t.Any>(t: T): LoiFactoryTypeString<T> {
    return LoiFactoryBase.decorate(decorate<T, LoiFactoryString<t.Type<T['_A'], T['_O'], T['_I']>>>(this, t));
  }

  /**
   * Specifies the exact string length required
   * @param limit the required string length
   */
  public length(limit: number) {
    const type = t.refinement(this, (i) => i.length == limit)
    return metadata(LoiFactoryString.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionString>{ name: `exact ${limit} chars`, length: limit }
    });
  }

  /**
   * Specifies the maximum number of string characters
   * @param limit the maximum number of string characters allowed
   */
  public max(limit: number) {
    const type = t.refinement(this, (i) => i.length <= limit)
    return metadata(LoiFactoryString.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionString>{ name: `<=${limit} chars`, max: limit }
    });
  }

  /**
   * Specifies the minimum number string characters
   * @param limit the minimum number of string characters required
   */
  public min(limit: number) {
    const type = t.refinement(this, (i) => i.length >= limit)
    return metadata(LoiFactoryString.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionString>{ name: `>=${limit} chars`, min: limit }
    });
  }

  /**
   * Defines a regular expression rule
   * @param pattern a regular expression object the string value must match against.
   * @param name optional name for patterns (useful with multiple patterns)
   */
  public regex(pattern: RegExp, name: string = `regexp ${pattern.toString()}`) {
    const type = t.refinement(this, (i) => i.match(pattern) !== null)
    return metadata(LoiFactoryString.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionString>{ name: name, regexp: pattern }
    });
  }

  /**
   * Defines a regular expression rule
   * @param pattern a regular expression object the string value must match against.
   * @param name optional name for patterns (useful with multiple patterns)
   */
  public regexp(pattern: RegExp, name?: string) {
    return this.regex(pattern, name);
  }

  /**
   * Defines a regular expression rule
   * @param pattern a regular expression object the string value must match against.
   * @param name optional name for patterns (useful with multiple patterns)
   */
  public pattern(pattern: RegExp, name?: string) {
    return this.regex(pattern, name);
  }
}

// tslint:disable-next-line:variable-name
export const string = mimic(function string() {
  const type = new LoiTypeString();
  return metadata(LoiFactoryString.decorate<Clean<typeof type>>(type), {
    tag: "string"
  });
}, new LoiTypeString());