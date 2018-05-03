import { expect } from 'chai';
import * as t from 'io-ts';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { nullablePartial } from './object';

// tslint:disable:no-unused-expression // chai to be NaN

describe('utilties:object', () => {
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
})
