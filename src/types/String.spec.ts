import { expect } from 'chai';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { string } from './String';

// tslint:disable:no-unused-expression // chai to be NaN
// tslint:disable:no-construct // new String()

describe('types:String', () => {
  describe('string', () => {
    it('should work', () => {
      const test = string()

      expect(test.name).to.be.eql("string")
      expect(shouldValidate(test.decode("abc"))).to.be.eql("abc")
      expect(shouldValidate(test.decode(""))).to.be.eql("")
      expect(shouldValidate(test.decode(new String("abc")))).to.be.eql("abc")
      expect(shouldValidate(test.decode(new String("")))).to.be.eql("")
      expect(shouldValidate(test.decode(new String(null)))).to.be.eql("null")
      expect(shouldValidate(test.decode(new String(undefined)))).to.be.eql("undefined")
      shouldNotValidate(test.decode({ valueOf: () => "test" }))
      shouldNotValidate(test.decode({ toString: () => "test" }))
      shouldNotValidate(test.decode(0))
      shouldNotValidate(test.decode([]))
      shouldNotValidate(test.decode({}))
      shouldNotValidate(test.decode(Infinity))
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
    })

    it('mimicked string should work', () => {
      const test = string

      expect(test.name).to.be.eql("string")
      expect(shouldValidate(test.decode("abc"))).to.be.eql("abc")
      expect(shouldValidate(test.decode(""))).to.be.eql("")
      expect(shouldValidate(test.decode(new String("abc")))).to.be.eql("abc")
      expect(shouldValidate(test.decode(new String("")))).to.be.eql("")
      expect(shouldValidate(test.decode(new String(null)))).to.be.eql("null")
      expect(shouldValidate(test.decode(new String(undefined)))).to.be.eql("undefined")
      shouldNotValidate(test.decode({ valueOf: () => "test" }))
      shouldNotValidate(test.decode({ toString: () => "test" }))
      shouldNotValidate(test.decode(0))
      shouldNotValidate(test.decode([]))
      shouldNotValidate(test.decode({}))
      shouldNotValidate(test.decode(Infinity))
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
    })
  })
})