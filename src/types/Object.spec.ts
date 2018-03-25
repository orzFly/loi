import { expect } from 'chai';
import * as t from 'io-ts';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { number } from './Number';
import { object } from './Object';

// tslint:disable:no-unused-expression // chai to be NaN

describe('types:Object', () => {
  describe('object', () => {
    it('should work', () => {
      const test = object({
        required: t.refinement(t.any, (i) => i != null, "any")
      }, {
        optional: t.refinement(t.any, (i) => i != null, "any")
      })

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

    it('type() should work', () => {
      const test = object({
        source: t.string
      }).type(RegExp)

      expect(test.name).to.be.eql("{ source: string }(instanceof RegExp)")

      const regexp = new RegExp("test")
      expect(shouldValidate(test.decode(regexp))).to.be.eql(regexp)
      shouldNotValidate(test.decode({ source: undefined }))
      shouldNotValidate(test.decode({ source: null }))
      shouldNotValidate(test.decode({ source: "hello" }))
      shouldNotValidate(test.decode({}))
    })
  })
})