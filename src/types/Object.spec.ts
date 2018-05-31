import { expect } from 'chai';
import * as t from 'io-ts';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { getNameFromProps, nullablePartial, object } from './Object';

// tslint:disable:no-unused-expression // chai to be NaN

class MyRegExp extends RegExp { }

describe('types:Object', () => {
  describe('getNameFromProps', () => {
    it('should work', () => {
      expect(getNameFromProps()).to.be.eql("{}");

      expect(getNameFromProps({
        a: t.string, b: t.string
      })).to.be.eql("{ a: string, b: string }");

      expect(getNameFromProps({
        a: t.string
      }, {
        b: t.string
      })).to.be.eql("{ a: string, b?: string }");

      expect(getNameFromProps({}, {
        a: t.string,
        b: t.string
      })).to.be.eql("{ a?: string, b?: string }");
    })
  })

  describe('nullablePartial', () => {
    it('should work', () => {
      const test = nullablePartial({
        key: t.boolean
      })

      expect(shouldValidate(test.decode({ key: true })).key).to.be.equal(true)
      expect(shouldValidate(test.decode({ key: false })).key).to.be.equal(false)
      expect(shouldValidate(test.decode({ key: null })).key).to.be.equal(undefined)
      expect(shouldValidate(test.decode({ key: undefined })).key).to.be.equal(undefined)
      expect(shouldValidate(test.decode({})).key).to.be.equal(undefined)
    })

    it('control group should not work', () => {
      const test = t.partial({
        key: t.boolean
      })

      expect(shouldValidate(test.decode({ key: true })).key).to.be.equal(true)
      expect(shouldValidate(test.decode({ key: false })).key).to.be.equal(false)
      shouldNotValidate(test.decode({ key: null }))
      expect(shouldValidate(test.decode({ key: undefined })).key).to.be.equal(undefined)
      expect(shouldValidate(test.decode({})).key).to.be.equal(undefined)
    })
  })

  describe('object', () => {
    it('should work', () => {
      const test = object({
        required: t.refinement(t.any, (i) => i != null, "any")
      }, {
        optional: t.refinement(t.any, (i) => i != null, "any")
      }).end()

      expect(test.name).to.be.eql("{ required: any, optional?: any }")
      expect(shouldValidate(test.decode({ required: 1 }))).to.be.eql({ required: 1 })
      expect(shouldValidate(test.decode({ required: 1, optional: 2 }))).to.be.eql({ required: 1, optional: 2 })
      expect(shouldValidate(test.decode({ required: 1, optional: [] }))).to.be.eql({ required: 1, optional: [] })
      expect(shouldValidate(test.decode({ required: 1, optional: null }))).to.be.eql({ required: 1, optional: undefined })
      expect(shouldValidate(test.decode({ required: 1, optional: undefined }))).to.be.eql({ required: 1, optional: undefined })
      shouldNotValidate(test.decode({ required: undefined }))
      shouldNotValidate(test.decode({ required: null }))
      shouldNotValidate(test.decode({ optional: 2 }))
      shouldNotValidate(test.decode({}))

      expect(shouldValidate(test.decode({ required: 1, extra: 1 }))).to.be.eql({ required: 1, extra: 1 })
    })

    it('strict() should work', () => {
      const test = object({
        required: t.refinement(t.any, (i) => i != null, "any")
      }, {
        optional: t.refinement(t.any, (i) => i != null, "any")
      }).strict().asBaseType()

      expect(test.name).to.be.eql("{ required: any, optional?: any }(strict)")
      expect(shouldValidate(test.decode({ required: 1 }))).to.be.eql({ required: 1 })
      expect(shouldValidate(test.decode({ required: 1, optional: 2 }))).to.be.eql({ required: 1, optional: 2 })
      expect(shouldValidate(test.decode({ required: 1, optional: [] }))).to.be.eql({ required: 1, optional: [] })
      expect(shouldValidate(test.decode({ required: 1, optional: null }))).to.be.eql({ required: 1, optional: undefined })
      expect(shouldValidate(test.decode({ required: 1, optional: undefined }))).to.be.eql({ required: 1, optional: undefined })
      shouldNotValidate(test.decode({ required: undefined }))
      shouldNotValidate(test.decode({ required: null }))
      shouldNotValidate(test.decode({ optional: 2 }))
      shouldNotValidate(test.decode({}))

      shouldNotValidate(test.decode({ required: 1, extra: 1 }))
    })

    it('violet() should work', () => {
      const test = object({
        required: t.refinement(t.any, (i) => i != null, "any")
      }, {
        optional: t.refinement(t.any, (i) => i != null, "any")
      }, "MyRequiredAndOptionalObject").violet().finish()

      expect(test.name).to.be.eql("MyRequiredAndOptionalObject(violet)")
      expect(shouldValidate(test.decode({ required: 1 }))).to.be.eql({ required: 1 })
      expect(shouldValidate(test.decode({ required: 1, optional: 2 }))).to.be.eql({ required: 1, optional: 2 })
      expect(shouldValidate(test.decode({ required: 1, optional: [] }))).to.be.eql({ required: 1, optional: [] })
      expect(shouldValidate(test.decode({ required: 1, optional: null }))).to.be.eql({ required: 1, optional: undefined })
      expect(shouldValidate(test.decode({ required: 1, optional: undefined }))).to.be.eql({ required: 1, optional: undefined })
      shouldNotValidate(test.decode({ required: undefined }))
      shouldNotValidate(test.decode({ required: null }))
      shouldNotValidate(test.decode({ optional: 2 }))
      shouldNotValidate(test.decode({}))

      expect(shouldValidate(test.decode({ required: 1, extra: 1 }))).to.be.eql({ required: 1 })
    })

    it('empty should work', () => {
      const test = object().clean()

      expect(test.name).to.be.eql("{}")
      expect(shouldValidate(test.decode({ required: 1 }))).to.be.eql({ required: 1 })
      expect(shouldValidate(test.decode({ required: 1, optional: 2 }))).to.be.eql({ required: 1, optional: 2 })
      expect(shouldValidate(test.decode({ required: 1, optional: [] }))).to.be.eql({ required: 1, optional: [] })
      expect(shouldValidate(test.decode({ required: 1, optional: null }))).to.be.eql({ required: 1, optional: null })
      expect(shouldValidate(test.decode({ required: 1, optional: undefined }))).to.be.eql({ required: 1, optional: undefined })
      expect(shouldValidate(test.decode({ required: undefined }))).to.be.eql({ required: undefined })
      expect(shouldValidate(test.decode({ required: null }))).to.be.eql({ required: null })
      expect(shouldValidate(test.decode({ optional: 2 }))).to.be.eql({ optional: 2 })
      expect(shouldValidate(test.decode({}))).to.be.eql({})
      expect(shouldValidate(test.decode({ required: 1, extra: 1 }))).to.be.eql({ required: 1, extra: 1 })
    })

    it('empty.strict() should work', () => {
      const test = object().strict().end()

      expect(test.name).to.be.eql("{}(strict)")
      shouldNotValidate(test.decode({ required: 1 }))
      shouldNotValidate(test.decode({ required: 1, optional: 2 }))
      shouldNotValidate(test.decode({ required: 1, optional: [] }))
      shouldNotValidate(test.decode({ required: 1, optional: null }))
      shouldNotValidate(test.decode({ required: 1, optional: undefined }))
      shouldNotValidate(test.decode({ required: undefined }))
      shouldNotValidate(test.decode({ required: null }))
      shouldNotValidate(test.decode({ optional: 2 }))
      expect(shouldValidate(test.decode({}))).to.be.eql({})
      shouldNotValidate(test.decode({ required: 1, extra: 1 }))
    })

    it('empty.violet() should work', () => {
      const test = object("Empty").violet().simple()

      expect(test.name).to.be.eql("Empty(violet)")
      expect(shouldValidate(test.decode({ required: 1 }))).to.be.eql({})
      expect(shouldValidate(test.decode({ required: 1, optional: 2 }))).to.be.eql({})
      expect(shouldValidate(test.decode({ required: 1, optional: [] }))).to.be.eql({})
      expect(shouldValidate(test.decode({ required: 1, optional: null }))).to.be.eql({})
      expect(shouldValidate(test.decode({ required: 1, optional: undefined }))).to.be.eql({})
      expect(shouldValidate(test.decode({ required: undefined }))).to.be.eql({})
      expect(shouldValidate(test.decode({ required: null }))).to.be.eql({})
      expect(shouldValidate(test.decode({ optional: 2 }))).to.be.eql({})
      expect(shouldValidate(test.decode({}))).to.be.eql({})
      expect(shouldValidate(test.decode({ required: 1, extra: 1 }))).to.be.eql({})
    })

    it('type() should work', () => {
      const test = object({
        source: t.string
      }).type(RegExp).end()

      expect(test.name).to.be.eql("{ source: string }(type RegExp)")

      const regexp = new RegExp("test")
      expect(shouldValidate(test.decode(regexp))).to.be.eql(regexp)

      const myRegexp = new MyRegExp("test")
      shouldNotValidate(test.decode(myRegexp))

      shouldNotValidate(test.decode({ source: undefined }))
      shouldNotValidate(test.decode({ source: null }))
      shouldNotValidate(test.decode({ source: "hello" }))
      shouldNotValidate(test.decode({}))
    })

    it('instanceof() should work', () => {
      const test = object({
        source: t.string
      }, "RegExp").instanceof(RegExp).end()

      expect(test.name).to.be.eql("RegExp(instanceof RegExp)")

      const regexp = new RegExp("test")
      expect(shouldValidate(test.decode(regexp))).to.be.eql(regexp)

      const myRegexp = new MyRegExp("test")
      expect(shouldValidate(test.decode(myRegexp))).to.be.eql(myRegexp)

      shouldNotValidate(test.decode({ source: undefined }))
      shouldNotValidate(test.decode({ source: null }))
      shouldNotValidate(test.decode({ source: "hello" }))
      shouldNotValidate(test.decode({}))
    })
  })
})