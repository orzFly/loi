import * as t from 'io-ts';
import { loiTagTypeDecorator } from './tag';

export class LoiDecoratorConvert<RT extends t.Any, X = any, A = any, O = A, I = t.mixed> extends t.Type<A, O, I> {
  static readonly _tag: 'LoiDecoratorConvert' = 'LoiDecoratorConvert'
  readonly _tag: 'LoiDecoratorConvert' = 'LoiDecoratorConvert'
  readonly [loiTagTypeDecorator] = true;
  constructor(
    readonly type: RT,
    readonly convert: (val: X) => t.TypeOf<RT> = (val) => val,
    readonly guard: (val: X) => boolean = () => true,
    name: string = type.name,
  ) {
    super(
      name,
      (v: any): v is A => type.is(v),
      (v: any, c: any) =>
        type.validate(guard(v) ? convert(v) : v, c),
      (v: any) => type.encode(v)
    )
  }
}

/** @internal */
export function nullAsUndefined<T extends t.Any>(
  type: T,
  name: string = type.name
): t.Type<T["_A"], T["_O"], T["_I"]> {
  const newType = new t.Type(
    name,
    (v: any): v is T => type.is(v),
    (v: any, c: any) =>
      (v === null || v === undefined) ? t.success(undefined) : type.validate(v, c),
    (v: any) => type.encode(v)
  );
  (<any>newType)[loiTagTypeDecorator] = true;
  (<any>newType)._tag = 'LoiTypeNullAsUndefined';
  (<any>newType).type = type;
  return newType;
}