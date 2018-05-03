import * as t from 'io-ts';
import { isNumber, isString } from 'lodash';
import { convert } from '../utilties/convert';
import { decorate, Factory, ILoiOption, metadata } from '../utilties/factory';
import { BaseFactory } from './Base';

export interface IBooleanOption extends ILoiOption {
  name: string
  parseString?: boolean
  parseNumber?: boolean
  only?: boolean
}

const trueValues = ["true", "t", "yes", "y", "on", "1"]
const falseValues = ["false", "f", "no", "n", "off", "0"]

type Clean<T extends t.Any> = t.Type<T['_A'], T['_O'], T['_I']>
export type BooleanFactoryType<T extends t.Any> = T & BooleanFactory<T> & BaseFactory<T>

export class BooleanFactory<T extends t.Any> extends Factory<T> {
  static decorate<T extends t.Any>(t: T): BooleanFactoryType<T> {
    return BaseFactory.decorate(decorate<T, BooleanFactory<t.Type<T['_A'], T['_O'], T['_I']>>>(this, t));
  }

  parseString() {
    const type = convert(this, (i) => {
      const val = (i as string).toLowerCase()
      if (trueValues.indexOf(val) >= 0) return true;
      if (falseValues.indexOf(val) >= 0) return false;
      return i;
    }, (i) => isString(i))

    return metadata(BooleanFactory.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <IBooleanOption>{ name: `parseString`, parseString: true }
    });
  }

  parseNumber() {
    const type = convert(this, (i) => {
      if (Number.isNaN(i as number)) return false;
      if (i === 0) return false;
      return true;
    }, (i) => isNumber(i))

    return metadata(BooleanFactory.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <IBooleanOption>{ name: `parseNumber`, parseNumber: true }
    });
  }

  parse() {
    return this.parseNumber().parseString()
  }

  trueOnly() {
    const type = t.refinement(this, (i) => i === true)

    return metadata(BooleanFactory.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <IBooleanOption>{ name: `true only`, only: true }
    });
  }

  falseOnly() {
    const type = t.refinement(this, (i) => i === false)

    return metadata(BooleanFactory.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <IBooleanOption>{ name: `false only`, only: false }
    });
  }
}

export function boolean() {
  const type = new t.BooleanType();
  return metadata(BooleanFactory.decorate<Clean<typeof type>>(type), {
    tag: "boolean"
  });
}