import * as t from 'io-ts';
import { isNumber, isString } from 'lodash';
import { convert } from '../utilties/convert';
import { decorate, ILoiOption, LoiFactory, metadata } from '../utilties/factory';
import { mimic } from '../utilties/mimic';
import { LoiFactoryBase } from './Base';

/** @internal */
export interface ILoiOptionBoolean extends ILoiOption {
  name: string
  parseString?: boolean
  parseNumber?: boolean
  only?: boolean
}

const trueValues = ["true", "t", "yes", "y", "on", "1"]
const falseValues = ["false", "f", "no", "n", "off", "0"]

type Clean<T extends t.Any> = t.Type<T['_A'], T['_O'], T['_I']>
export type LoiFactoryTypeBoolean<T extends t.Any> = T & LoiFactoryBoolean<T> & LoiFactoryBase<T>

export class LoiFactoryBoolean<T extends t.Any> extends LoiFactory<T> {
  /** @internal */
  static decorate<T extends t.Any>(t: T): LoiFactoryTypeBoolean<T> {
    return LoiFactoryBase.decorate(decorate<T, LoiFactoryBoolean<t.Type<T['_A'], T['_O'], T['_I']>>>(this, t));
  }

  parseString() {
    const type = convert(this, (i) => {
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
    const type = convert(this, (i) => {
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

  trueOnly() {
    const type = t.refinement(this, (i) => i === true)

    return metadata(LoiFactoryBoolean.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionBoolean>{ name: `true only`, only: true }
    });
  }

  falseOnly() {
    const type = t.refinement(this, (i) => i === false)

    return metadata(LoiFactoryBoolean.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionBoolean>{ name: `false only`, only: false }
    });
  }
}

// tslint:disable-next-line:variable-name
export const boolean = mimic(function boolean() {
  const type = new t.BooleanType();
  return metadata(LoiFactoryBoolean.decorate<Clean<typeof type>>(type), {
    tag: "boolean"
  });
}, new t.BooleanType());