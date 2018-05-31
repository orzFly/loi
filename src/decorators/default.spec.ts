import { expect } from 'chai';
import * as t from 'io-ts';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { LoiDecoratorDefault, LoiDecoratorDefaultResolver } from './default';

// tslint:disable:no-unused-expression // chai to be NaN

describe('decorators:default', () => {
  describe('LoiDecoratorDefault', () => {
    it('should work', () => {
      const test = new LoiDecoratorDefault(t.number, 1)

      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode(undefined))).to.be.eql(1)
      expect(shouldValidate(test.decode(null))).to.be.eql(1)
      expect(shouldValidate(test.decode(NaN))).to.be.NaN

      shouldNotValidate(test.decode({}))
      shouldNotValidate(test.decode(""))
      shouldNotValidate(test.decode([]))

      expect(test.encode(1)).to.be.eql(t.number.encode(1))
      expect(test.encode(NaN)).to.be.eql(t.number.encode(NaN))
      expect(test.encode(undefined as any)).to.be.eql(t.number.encode(undefined as any))
      expect(test.encode(null as any)).to.be.eql(t.number.encode(null as any))

      expect(test.is(1)).to.be.eql(t.number.is(1))
      expect(test.is(NaN)).to.be.eql(t.number.is(NaN))
      expect(test.is(undefined)).to.be.eql(t.number.is(undefined))
      expect(test.is(null)).to.be.eql(t.number.is(null))
    })
  })

  describe('LoiDecoratorDefaultResolver', () => {
    it('should work', () => {
      let i = 233
      const test = new LoiDecoratorDefaultResolver(t.number, () => i++)

      expect(shouldValidate(test.decode(undefined))).to.be.eql(233)
      expect(shouldValidate(test.decode(null))).to.be.eql(234)
      expect(i).to.be.eql(235)

      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode(NaN))).to.be.NaN

      shouldNotValidate(test.decode({}))
      shouldNotValidate(test.decode(""))
      shouldNotValidate(test.decode([]))

      expect(test.encode(1)).to.be.eql(t.number.encode(1))
      expect(test.encode(NaN)).to.be.eql(t.number.encode(NaN))
      expect(test.encode(undefined as any)).to.be.eql(t.number.encode(undefined as any))
      expect(test.encode(null as any)).to.be.eql(t.number.encode(null as any))

      expect(test.is(1)).to.be.eql(t.number.is(1))
      expect(test.is(NaN)).to.be.eql(t.number.is(NaN))
      expect(test.is(undefined)).to.be.eql(t.number.is(undefined))
      expect(test.is(null)).to.be.eql(t.number.is(null))

      expect(i).to.be.eql(235)
    })
  })
})
