import { expect } from 'chai';
import * as t from 'io-ts';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { withDefault, withDefaultResolver } from './default';

// tslint:disable:no-unused-expression // chai to be NaN

describe('utilties:default', () => {
  describe('withDefault', () => {
    it('should work', () => {
      const test = withDefault(t.number, 1)

      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode(undefined))).to.be.eql(1)
      expect(shouldValidate(test.decode(null))).to.be.eql(1)
      expect(shouldValidate(test.decode(NaN))).to.be.NaN

      shouldNotValidate(test.decode({}))
      shouldNotValidate(test.decode(""))
      shouldNotValidate(test.decode([]))
    })
  })

  describe('withDefaultResolver', () => {
    it('should work', () => {
      let i = 233
      const test = withDefaultResolver(t.number, () => i++)

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
  })
})
