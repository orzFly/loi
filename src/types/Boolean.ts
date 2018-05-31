import * as t from 'io-ts';
import { LoiTypeConvert, nullAsUndefined } from '../utilties/convert';
import { decorate, ILoiOption, LoiFactory, metadata } from '../utilties/factory';
import { isNumber, isString } from '../utilties/lodash';
import { mimic } from '../utilties/mimic';
import { LoiFactoryBase } from './Base';

/** @internal */
export interface ILoiOptionBoolean extends ILoiOption {
  name: string
  parseString?: boolean
  parseNumber?: boolean
  violet?: boolean
}

const trueValues = ["true", "t", "yes", "y", "on", "1"]
const falseValues = ["false", "f", "no", "n", "off", "0"]

type Clean<T extends t.Any> = t.Type<T['_A'], T['_O'], T['_I']>
export type LoiFactoryTypeBoolean<T extends t.Any> = T & LoiFactoryBoolean<T> & LoiFactoryBase<T>
export type LoiFactoryTypeBooleanInitial<T extends t.Any> = T & LoiFactoryBooleanInitial<T> & LoiFactoryBoolean<T> & LoiFactoryBase<T>

export class LoiFactoryBoolean<T extends t.Any> extends LoiFactory<T> {
  /** @internal */
  static decorate<T extends t.Any>(t: T): LoiFactoryTypeBoolean<T> {
    return LoiFactoryBase.decorate(decorate<T, LoiFactoryBoolean<t.Type<T['_A'], T['_O'], T['_I']>>>(this, t));
  }

  parseString() {
    const type = new LoiTypeConvert(this, (i) => {
      const val = (i as string).toLowerCase()
      if (trueValues.indexOf(val) >= 0) return true;
      if (falseValues.indexOf(val) >= 0) return false;
      return i;
    }, (i) => isString(i))

    return metadata(LoiFactoryBoolean.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionBoolean>{ name: `parseString`, parseString: true }
    });
  }

  parseNumber() {
    const type = new LoiTypeConvert(this, (i) => {
      if (Number.isNaN(i as number)) return false;
      if (i === 0) return false;
      return true;
    }, (i) => isNumber(i))

    return metadata(LoiFactoryBoolean.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionBoolean>{ name: `parseNumber`, parseNumber: true }
    });
  }

  parse() {
    return this.parseNumber().parseString()
  }
}

export class LoiFactoryBooleanInitial<T extends t.Any> extends LoiFactory<T> {
  /** @internal */
  static decorate<T extends t.Any>(t: T): LoiFactoryTypeBooleanInitial<T> {
    return LoiFactoryBoolean.decorate(LoiFactoryBase.decorate(decorate<T, LoiFactoryBooleanInitial<t.Type<T['_A'], T['_O'], T['_I']>>>(this, t)));
  }

  trueOnly(violet: true): LoiFactoryTypeBoolean<t.Type<true | undefined, true | undefined, this["_I"]>>
  trueOnly(violet?: false): LoiFactoryTypeBoolean<t.Type<true, true, this["_I"]>>
  trueOnly(violet: true | false = false) {
    let type: t.Any = t.refinement(this, (i) => i === true) as t.Type<true, true, this["_I"]>
    if (violet) {
      type = new LoiTypeConvert(nullAsUndefined(type), () => undefined, (i) => i === false)
    }

    return metadata(LoiFactoryBoolean.decorate<Clean<typeof type>>(type), {
      parent: this,
      tag: "true",
      option: violet ? <ILoiOptionBoolean>{ name: `violet`, violet: true } : undefined
    });
  }

  falseOnly(violet: true): LoiFactoryTypeBoolean<t.Type<false | undefined, false | undefined, this["_I"]>>
  falseOnly(violet?: false): LoiFactoryTypeBoolean<t.Type<false, false, this["_I"]>>
  falseOnly(violet: true | false = false) {
    let type: t.Any = t.refinement(this, (i) => i === false) as t.Type<false, false, this["_I"]>
    if (violet) {
      type = new LoiTypeConvert(nullAsUndefined(type), () => undefined, (i) => i === true)
    }

    return metadata(LoiFactoryBoolean.decorate<Clean<typeof type>>(type), {
      parent: this,
      tag: "false",
      option: violet ? <ILoiOptionBoolean>{ name: `violet`, violet: true } : undefined
    });
  }
}

// tslint:disable-next-line:variable-name
export const boolean = mimic(function boolean() {
  const type = new t.BooleanType();
  return metadata(LoiFactoryBooleanInitial.decorate<Clean<typeof type>>(type), {
    tag: "boolean"
  });
}, new t.BooleanType());
