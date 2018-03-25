import { expect } from 'chai';
import * as t from 'io-ts';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { BaseFactory } from './Base';

// tslint:disable:no-unused-expression // chai to be NaN

describe('types:Base', () => {
  describe('BaseFactory', () => {
    it('allow() should work', () => {
      const test = BaseFactory.decorate(t.string).allow(t.number).allow(t.boolean)
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode("1"))).to.be.eql("1")
      expect(shouldValidate(test.decode(true))).to.be.eql(true)
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
      shouldNotValidate(test.decode({}))
      shouldNotValidate(test.decode([]))
    })

    it('allow(...) should work', () => {
      const test = BaseFactory.decorate(t.string).allow(t.number, t.boolean)

      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode("1"))).to.be.eql("1")
      expect(shouldValidate(test.decode(true))).to.be.eql(true)
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
      shouldNotValidate(test.decode({}))
      shouldNotValidate(test.decode([]))
    })
  })
})