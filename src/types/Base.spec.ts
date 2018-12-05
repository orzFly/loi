import { expect } from 'chai';
import * as t from 'io-ts';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { loiOption } from '../utilties/factory';
import { start } from './Base';

// tslint:disable:no-unused-expression // chai to be NaN

describe('types:Base', () => {
  describe('BaseFactory', () => {
    it('start should create a clone', () => {
      const test1 = start(t.number).default(1)
      const test2 = start(t.number).default(2)
      expect(shouldValidate(test1.decode(undefined))).to.be.equal(1)
      expect(shouldValidate(test2.decode(undefined))).to.be.equal(2)
      expect((test1[loiOption][0] as any).default).to.be.eql(1)
      expect((test2[loiOption][0] as any).default).to.be.eql(2)
      expect((t.number as any)[loiOption]).to.be.undefined
    })

    it('nullAsUndefined() should work', () => {
      const test = start(t.boolean).nullAsUndefined()

      expect(shouldValidate(test.decode(true))).to.be.equal(true)
      expect(shouldValidate(test.decode(false))).to.be.equal(false)
      expect(shouldValidate(test.decode(null))).to.be.equal(undefined)
      expect(shouldValidate(test.decode(undefined))).to.be.equal(undefined)
    })

    it('nullable([true]) should work', () => {
      for (const test of [
        start(t.boolean).nullable(),
        start(t.boolean).nullable(true),
        start(t.boolean).nullable(true).nullable(true),
        start(t.boolean).nullable(false).nullable(true),
        start(t.boolean).nullable(false).nullable(true).nullable(false).nullable(true),
        start(t.boolean).nullable(true, undefined).nullable(false).nullable(true),
      ]) {
        expect(test.name).to.be.eql("boolean(nullable)");
        expect(shouldValidate(test.decode(true))).to.be.equal(true)
        expect(shouldValidate(test.decode(false))).to.be.equal(false)
        expect(shouldValidate(test.decode(null))).to.be.equal(null)
        shouldNotValidate(test.decode(undefined))
      }
    })

    it('nullable(true, ...) should work', () => {
      const types = (<T extends [string, t.Any, any[]][]>(t: T) => t)([
        ["boolean(nullable)", start(t.boolean).nullable(true, "1", 1, 2, false, true), ["1", 1, 2, false, true]],
        ["boolean(nullable)", start(t.boolean).nullable(true, null, undefined), [null, undefined]],
        ["boolean(not undefinedable, nullable)", start(t.boolean).nullable(false).undefinedable(false).nullable(true, null, undefined), [null, undefined]],
        ["boolean(undefinedable, nullable)", start(t.boolean).nullable(false).undefinedable(true).nullable(true, null, undefined), [null, undefined]],
      ])
      for (const [name, test, values] of types) {
        expect(test.name).to.be.eql(name);
        expect(shouldValidate(test.decode(null))).to.be.equal(null)
        for (const value of values) {
          expect(shouldValidate(test.decode(value))).to.be.equal(null)
        }
      }
    })

    it('nullable(false) should work', () => {
      for (const test of [
        start(t.boolean).nullable(false),
        start(t.boolean).nullable(false).nullable(false),
        start(t.boolean).nullable(true).nullable(false),
        start(t.boolean).nullable(true).nullable(false).nullable(true).nullable(false),
        start(t.boolean).nullable(true, undefined).nullable(false),
      ]) {
        expect(test.name).to.be.eql("boolean(not nullable)");
        expect(shouldValidate(test.decode(true))).to.be.equal(true)
        expect(shouldValidate(test.decode(false))).to.be.equal(false)
        shouldNotValidate(test.decode(null))
        shouldNotValidate(test.decode(undefined))
      }
    })

    it('undefinedable([true]) should work', () => {
      for (const test of [
        start(t.boolean).undefinedable(),
        start(t.boolean).undefinedable(true),
        start(t.boolean).undefinedable(true).undefinedable(true),
        start(t.boolean).undefinedable(false).undefinedable(true),
        start(t.boolean).undefinedable(false).undefinedable(true).undefinedable(false).undefinedable(true),
        start(t.boolean).undefinedable(true, null).undefinedable(false).undefinedable(true),
      ]) {
        expect(test.name).to.be.eql("boolean(undefinedable)");
        expect(shouldValidate(test.decode(true))).to.be.equal(true)
        expect(shouldValidate(test.decode(false))).to.be.equal(false)
        shouldNotValidate(test.decode(null))
        expect(shouldValidate(test.decode(undefined))).to.be.equal(undefined)
      }
    })

    it('undefinedable(true, ...) should work', () => {
      const types = (<T extends [string, t.Any, any[]][]>(t: T) => t)([
        ["boolean(undefinedable)", start(t.boolean).undefinedable(true, "1", 1, 2, false, true), ["1", 1, 2, false, true]],
        ["boolean(undefinedable)", start(t.boolean).undefinedable(true, undefined, null), [undefined, null]],
        ["boolean(not nullable, undefinedable)", start(t.boolean).undefinedable(false).nullable(false).undefinedable(true, undefined, null), [undefined, null]],
        ["boolean(nullable, undefinedable)", start(t.boolean).undefinedable(false).nullable(true).undefinedable(true, undefined, null), [undefined, null]],
      ])
      for (const [name, test, values] of types) {
        expect(test.name).to.be.eql(name);
        expect(shouldValidate(test.decode(undefined))).to.be.equal(undefined)
        for (const value of values) {
          expect(shouldValidate(test.decode(value))).to.be.equal(undefined)
        }
      }
    })

    it('undefinedable(false) should work', () => {
      for (const test of [
        start(t.boolean).undefinedable(false),
        start(t.boolean).undefinedable(false).undefinedable(false),
        start(t.boolean).undefinedable(true).undefinedable(false),
        start(t.boolean).undefinedable(true).undefinedable(false).undefinedable(true).undefinedable(false),
        start(t.boolean).undefinedable(true, null).undefinedable(false),
      ]) {
        expect(test.name).to.be.eql("boolean(not undefinedable)");
        expect(shouldValidate(test.decode(true))).to.be.equal(true)
        expect(shouldValidate(test.decode(false))).to.be.equal(false)
        shouldNotValidate(test.decode(null))
        shouldNotValidate(test.decode(undefined))
      }
    })

    it('default() should work', () => {
      const test = start(t.number).default(1)

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
      const test = start(t.number).defaultResolver(() => i++)

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
      const test = start(baseType).rescue(1)

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
      const test = start(baseType).rescueResolver(() => i++)

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
      const test = start(t.string).allow(t.number).allow(t.boolean)
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode("1"))).to.be.eql("1")
      expect(shouldValidate(test.decode(true))).to.be.eql(true)
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
      shouldNotValidate(test.decode({}))
      shouldNotValidate(test.decode([]))
    })

    it('allow(...) should work', () => {
      const test = start(t.string).allow(t.number, t.boolean)

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