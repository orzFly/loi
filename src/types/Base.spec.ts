import { expect } from 'chai';
import * as t from 'io-ts';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { BaseFactory } from './Base';

// tslint:disable:no-unused-expression // chai to be NaN

describe('types:Base', () => {
  describe('BaseFactory', () => {
    it('nullAsUndefined() should work', () => {
      const test = BaseFactory.decorate(t.boolean).nullAsUndefined()

      expect(shouldValidate(test.decode(true))).to.be.equal(true)
      expect(shouldValidate(test.decode(false))).to.be.equal(false)
      expect(shouldValidate(test.decode(null))).to.be.equal(undefined)
      expect(shouldValidate(test.decode(undefined))).to.be.equal(undefined)
    })

    it('default() should work', () => {
      const test = BaseFactory.decorate(t.number).default(1)

      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode(undefined))).to.be.eql(1)
      expect(shouldValidate(test.decode(null))).to.be.eql(1)
      expect(shouldValidate(test.decode(NaN))).to.be.NaN

      shouldNotValidate(test.decode({}))
      shouldNotValidate(test.decode(""))
      shouldNotValidate(test.decode([]))
    })

    it('defaultResolver() should work', () => {
      let i = 233
      const test = BaseFactory.decorate(t.number).defaultResolver(() => i++)

      expect(shouldValidate(test.decode(undefined))).to.be.eql(233)
      expect(shouldValidate(test.decode(null))).to.be.eql(234)
      expect(i).to.be.eql(235)

      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode(NaN))).to.be.NaN

      shouldNotValidate(test.decode({}))
      shouldNotValidate(test.decode(""))
      shouldNotValidate(test.decode([]))

      expect(i).to.be.eql(235)
    })

    it('rescue() should work', () => {
      const baseType = t.union([t.number, t.null, t.undefined])
      const test = BaseFactory.decorate(baseType).rescue(1)

      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode(undefined))).to.be.eql(undefined)
      expect(shouldValidate(test.decode(null))).to.be.eql(null)
      expect(shouldValidate(test.decode(NaN))).to.be.NaN

      expect(shouldValidate(test.decode({}))).to.be.eql(1)
      expect(shouldValidate(test.decode(""))).to.be.eql(1)
      expect(shouldValidate(test.decode([]))).to.be.eql(1)
    })

    it('rescueResolver() should work', () => {
      let i = 233
      const baseType = t.union([t.number, t.null, t.undefined])
      const test = BaseFactory.decorate(baseType).rescueResolver(() => i++)

      expect(shouldValidate(test.decode(undefined))).to.be.eql(undefined)
      expect(shouldValidate(test.decode(null))).to.be.eql(null)

      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode(NaN))).to.be.NaN

      expect(i).to.be.eql(233)
      expect(shouldValidate(test.decode({}))).to.be.eql(233)
      expect(shouldValidate(test.decode(""))).to.be.eql(234)
      expect(shouldValidate(test.decode([]))).to.be.eql(235)
      expect(i).to.be.eql(236)
    })

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