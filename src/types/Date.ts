import * as t from 'io-ts';
import { convert } from '../utilties/convert';
import { decorate, ILoiOption, LoiFactory, metadata } from '../utilties/factory';
import { isDate, isString } from '../utilties/lodash';
import { mimic } from '../utilties/mimic';
import { LoiFactoryBase } from './Base';

/** @internal */
export interface ILoiOptionDate extends ILoiOption {
  name: string,
  max?: number
  min?: number
  parseString?: boolean
}

export class LoiTypeDate extends t.Type<Date, Date, t.mixed> {
  readonly _tag: 'DateType' = 'DateType'

  constructor() {
    super(
      'Date',
      (value): value is Date => isDate(value),
      (input, ctx) => {
        if (!this.is(input)) return t.failure(input, ctx);

        const date = new Date(input);
        return !isNaN(date.getTime()) ? t.success(date) : t.failure(input, ctx)
      },
      t.identity
    )
  }
}

type Clean<T extends t.Any> = t.Type<T['_A'], T['_O'], T['_I']>
export type LoiFactoryTypeDate<T extends t.Any> = T & LoiFactoryDate<T> & LoiFactoryBase<T>

export class LoiFactoryDate<T extends t.Any> extends LoiFactory<T> {
  /** @internal */
  static decorate<T extends t.Any>(t: T): LoiFactoryTypeDate<T> {
    return LoiFactoryBase.decorate(decorate<T, LoiFactoryDate<t.Type<T['_A'], T['_O'], T['_I']>>>(this, t));
  }

  public max(limit: Date | number) {
    const date = new Date(limit);
    const time = date.getTime();
    const type = t.refinement(this, (n: Date) => n.getTime() <= time);
    return metadata(LoiFactoryDate.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionDate>{ name: `<=${date.toJSON()}`, max: time }
    });
  }

  public min(limit: Date | number) {
    const date = new Date(limit);
    const time = date.getTime();
    const type = t.refinement(this, (n: Date) => n.getTime() >= time);
    return metadata(LoiFactoryDate.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionDate>{ name: `>=${date.toJSON()}`, min: limit }
    });
  }

  /**
   * Date.parse()
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
   */
  public parseDateString() {
    const type = convert(this, (i: string) => {
      const date = Date.parse(i);
      return Number.isFinite(date) ? new Date(date) : i;
    }, (i) => isString(i));
    return metadata(LoiFactoryDate.decorate<Clean<typeof type>>(type), {
      parent: this,
      option: <ILoiOptionDate>{ name: "Date.parse", parseString: true }
    });
  }
}

// tslint:disable-next-line:variable-name
export const date = mimic(function date() {
  const type = new LoiTypeDate();
  return metadata(LoiFactoryDate.decorate<Clean<typeof type>>(type), {
    tag: "date"
  });
}, new LoiTypeDate());