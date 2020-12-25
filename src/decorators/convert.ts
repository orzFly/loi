import * as t from '../iots';
import { loiTagTypeDecorator } from '../utilties/tag';

export class LoiDecoratorConvert<RT extends t.Any, X = RT['_I']> extends t.Type<RT['_A'], RT['_O'], RT['_I']> {
  static readonly _tag: 'LoiDecoratorConvert' = 'LoiDecoratorConvert'
  readonly _tag: 'LoiDecoratorConvert' = 'LoiDecoratorConvert'
  readonly [loiTagTypeDecorator] = true;
  constructor(
    readonly type: RT,
    readonly convert: (val: X) => t.TypeOf<RT> = (val) => val,
    readonly guard: (val: X) => boolean = () => true,
    name: string = type.name
  ) {
    super(
      name,
      (v: any): v is RT['_A'] => type.is(v) || (guard(v) && type.is(convert(v))),
      (v: any, c: any) =>
        type.validate(guard(v) ? convert(v) : v, c),
      (v: any) => type.encode(v)
    )
  }
}
