import { expect } from 'chai';
import * as t from 'io-ts';
import { shouldValidate } from '../test-helper.spec';
import { LoiDecoratorConvert, nullAsUndefined } from './convert';

// tslint:disable:no-unused-expression // chai to be NaN

describe('utilties:convert', () => {
  describe('convert', () => {
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

  describe('nullAsUndefined', () => {
    it('should work', () => {
      const test = t.partial({
        key: nullAsUndefined(t.boolean)
      })

      expect(shouldValidate(test.decode({ key: true })).key).to.be.equal(true)
      expect(shouldValidate(test.decode({ key: false })).key).to.be.equal(false)
      expect(shouldValidate(test.decode({ key: null })).key).to.be.equal(undefined)
      expect(shouldValidate(test.decode({ key: undefined })).key).to.be.equal(undefined)
      expect(shouldValidate(test.decode({})).key).to.be.equal(undefined)

      const test2 = nullAsUndefined(t.boolean)
      expect(test2.encode(true)).to.be.eql(t.boolean.encode(true))
      expect(test2.encode(false)).to.be.eql(t.boolean.encode(false))
      expect(test2.encode(undefined as any)).to.be.eql(t.boolean.encode(undefined as any))
      expect(test2.encode(null as any)).to.be.eql(t.boolean.encode(null as any))

      expect(test2.is(true)).to.be.eql(t.boolean.is(true))
      expect(test2.is(false)).to.be.eql(t.boolean.is(false))
      expect(test2.is(undefined)).to.be.eql(t.boolean.is(undefined))
      expect(test2.is(null)).to.be.eql(t.boolean.is(null))
    })
  })
})
