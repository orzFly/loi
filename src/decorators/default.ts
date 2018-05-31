import * as t from 'io-ts';
import { loiTagTypeDecorator } from '../utilties//tag';

// https://github.com/teamdigitale/italia-ts-commons/blob/1688059556e3b3532a73032ab923933f0403fcc5/src/types.ts#L158

/**
 * Sets properties default values when calling t.validate() method on models
 * see https://github.com/gcanti/io-ts/issues/8
 * @internal
 */
export class LoiDecoratorDefault<RT extends t.Any, A = RT['_A'], O = RT['_O'], I = RT['_I']> extends t.Type<A, O, I> {
  static readonly _tag: 'LoiDecoratorDefault' = 'LoiDecoratorDefault'
  readonly _tag: 'LoiDecoratorDefault' = 'LoiDecoratorDefault'
  readonly [loiTagTypeDecorator] = true;
  constructor(
    readonly type: RT,
    readonly defaultValue: A,
    name: string = type.name,
  ) {
    super(
      name,
      (v: any): v is A => type.is(v),
      (v: any, c: any) =>
        type.validate(v !== undefined && v !== null ? v : defaultValue, c),
      (v: any) => type.encode(v)
    )
  }
}

/**
 * Sets properties default values with resolver functions when calling t.validate() method on models
 * see https://github.com/gcanti/io-ts/issues/8
 * @internal
 */
export class LoiDecoratorDefaultResolver<RT extends t.Any, A = RT['_A'], O = RT['_O'], I = RT['_I']> extends t.Type<A, O, I> {
  static readonly _tag: 'LoiDecoratorDefaultResolver' = 'LoiDecoratorDefaultResolver'
  readonly _tag: 'LoiDecoratorDefaultResolver' = 'LoiDecoratorDefaultResolver'
  readonly [loiTagTypeDecorator] = true;
  constructor(
    readonly type: RT,
    readonly defaultValueResolver: () => A,
    name: string = type.name,
  ) {
    super(
      name,
      (v: any): v is A => type.is(v),
      (v: any, c: any) =>
        type.validate(v !== undefined && v !== null ? v : defaultValueResolver(), c),
      (v: any) => type.encode(v)
    )
  }
}