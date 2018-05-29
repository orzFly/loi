import { expect } from 'chai';
import * as Loi from '../index';
import { ensureSameType, ensureTypeSame } from './ensureSameType';

// tslint:disable:no-unused-expression

describe('helpers:ensureSameType', () => {
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
      expect(ensureSameType<NativeType, RuntimeType>()).to.be.undefined;
      expect(ensureTypeSame<NativeType, RuntimeType>()).to.be.undefined;
    })
  })
})