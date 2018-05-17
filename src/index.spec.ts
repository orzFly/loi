import { expect } from 'chai';
import * as Loi from './index';

// tslint:disable:no-unused-expression

describe('index', () => {
  describe('validate', () => {
    it('should work', () => {
      expect(Loi.validate(233, Loi.number()).isRight()).to.be.true
      expect(Loi.validate([], Loi.number()).isLeft()).to.be.true
    })
  })

  describe('ensureSameType', () => {
    it('should be good in editor, harmless in runtime', () => {
      // tslint:disable-next-line:interface-over-type-literal
      type NativeType = {
        required: string,
        optional?: number
      }

      const type = Loi.object({
        required: Loi.string()
      }, {
        optional: Loi.number()
        })

      type RuntimeType = Loi.TypeOf<typeof type>
      expect(Loi.ensureSameType<NativeType, RuntimeType>()).to.be.undefined;
      expect(Loi.ensureTypeSame<NativeType, RuntimeType>()).to.be.undefined;
    })
  })
})