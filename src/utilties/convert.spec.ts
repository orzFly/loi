import { expect } from 'chai';
import * as t from 'io-ts';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { convert, nullAsUndefined } from './convert';

// tslint:disable:no-unused-expression // chai to be NaN

describe('utilties:convert', () => {
  describe('convert', () => {
    it('should work', () => {
      const test = convert(t.number, () => 233, (i) => i === 1)

      expect(shouldValidate(test.decode(1))).to.be.eql(233)
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
    })
  })
})
