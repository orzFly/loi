import { expect } from 'chai';
import * as t from 'io-ts';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { boolean } from './Boolean';

// tslint:disable:no-unused-expression // chai to be NaN

describe('types:Boolean', () => {
  describe('boolean', () => {
    it('should work', () => {
      const test = boolean()

      expect(test.name).to.be.eql("boolean")
      expect(shouldValidate(test.decode(true))).to.be.eql(true)
      expect(shouldValidate(test.decode(false))).to.be.eql(false)
      shouldNotValidate(test.decode("true"))
      shouldNotValidate(test.decode("false"))
      shouldNotValidate(test.decode("yes"))
      shouldNotValidate(test.decode("no"))
      shouldNotValidate(test.decode("t"))
      shouldNotValidate(test.decode("f"))
      shouldNotValidate(test.decode("y"))
      shouldNotValidate(test.decode("n"))
      shouldNotValidate(test.decode(0))
      shouldNotValidate(test.decode(1))
      shouldNotValidate(test.decode(-1))
      shouldNotValidate(test.decode(Infinity))
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
    })

  })
})