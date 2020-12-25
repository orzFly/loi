import { expect } from 'chai';
import * as t from '../iots';
import { shouldValidate } from '../test-helper.spec';
import { LoiDecoratorConvert } from './convert';

// tslint:disable:no-unused-expression // chai to be NaN

describe('decorators:convert', () => {
  describe('LoiDecoratorConvert', () => {
    it('should work', () => {
      const test = new LoiDecoratorConvert(t.number, () => 233, (i) => i === 1)

      expect(shouldValidate(test.decode(1))).to.be.eql(233)
      expect(shouldValidate(test.decode(2))).to.be.eql(2)
      expect(shouldValidate(test.decode(233))).to.be.eql(233)

      expect(test.encode(1)).to.be.eql(t.number.encode(1))
      expect(test.encode(NaN)).to.be.eql(t.number.encode(NaN))
      expect(test.encode(undefined as any)).to.be.eql(t.number.encode(undefined as any))
      expect(test.encode(null as any)).to.be.eql(t.number.encode(null as any))

      expect(test.is(1)).to.be.eql(t.number.is(1))
      expect(test.is(NaN)).to.be.eql(t.number.is(NaN))
      expect(test.is(undefined)).to.be.eql(t.number.is(undefined))
      expect(test.is(null)).to.be.eql(t.number.is(null))
    })

    it('empty should work', () => {
      const test = new LoiDecoratorConvert(t.number)

      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode(2))).to.be.eql(2)
      expect(shouldValidate(test.decode(233))).to.be.eql(233)
    })
  })
})
