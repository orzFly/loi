import { expect } from 'chai';
import * as t from 'io-ts';
import { shouldValidate } from '../test-helper.spec';
import { LoiDecoratorNullAsUndefined } from './nullAsUndefined';

// tslint:disable:no-unused-expression // chai to be NaN

describe('decorators:nullAsUndefined', () => {
  describe('LoiDecoratorNullAsUndefined', () => {
    it('should work', () => {
      const test = t.partial({
        key: new LoiDecoratorNullAsUndefined(t.boolean)
      })

      expect(shouldValidate(test.decode({ key: true })).key).to.be.equal(true)
      expect(shouldValidate(test.decode({ key: false })).key).to.be.equal(false)
      expect(shouldValidate(test.decode({ key: null })).key).to.be.equal(undefined)
      expect(shouldValidate(test.decode({ key: undefined })).key).to.be.equal(undefined)
      expect(shouldValidate(test.decode({})).key).to.be.equal(undefined)

      const test2 = new LoiDecoratorNullAsUndefined(t.boolean)
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
