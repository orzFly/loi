import * as t from '../iots';
import { loiTagTypeDecorator } from '../utilties/tag';

export class LoiDecoratorRescue<RT extends t.Any> extends t.Type<RT['_A'], RT['_O'], RT['_I']> {
  static readonly _tag: 'LoiDecoratorRescue' = 'LoiDecoratorRescue'
  readonly _tag: 'LoiDecoratorRescue' = 'LoiDecoratorRescue'
  readonly [loiTagTypeDecorator] = true;
  constructor(
    readonly type: RT,
    readonly rescueValue: RT['_A'],
    name: string = type.name,
  ) {
    super(
      name,
      (v: any): v is RT['_A'] => type.is(v) || type.is(rescueValue),
      (v: any, c: any) => {
        const result = type.validate(v, c)
        return result.isLeft() ? type.validate(rescueValue, c) : result
      },
      (v: any) => type.encode(v)
    )
  }
}

export class LoiDecoratorRescueResolver<RT extends t.Any> extends t.Type<RT['_A'], RT['_O'], RT['_I']> {
  static readonly _tag: 'LoiDecoratorRescueResolver' = 'LoiDecoratorRescueResolver'
  readonly _tag: 'LoiDecoratorRescueResolver' = 'LoiDecoratorRescueResolver'
  readonly [loiTagTypeDecorator] = true;
  constructor(
    readonly type: RT,
    readonly rescueValueResolver: () => RT['_A'],
    name: string = type.name,
  ) {
    super(
      name,
      (v: any): v is RT['_A'] => type.is(v) || type.is(rescueValueResolver()),
      (v: any, c: any) => {
        const result = type.validate(v, c)
        return result.isLeft() ? type.validate(rescueValueResolver(), c) : result
      },
      (v: any) => type.encode(v)
    )
  }
}