import { expect } from 'chai';
import * as t from 'io-ts';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { any } from './Any';
import { array } from './Array';
import { number } from './Number';

// tslint:disable:no-unused-expression // chai to be NaN

describe('types:Array', () => {
  describe('any', () => {
    it('should work', () => {
      const test = array(any())

      expect(test.name).to.be.eql("any[]")
      expect(shouldValidate(test.decode([1]))).to.be.eql([1])
      expect(shouldValidate(test.decode([[]]))).to.be.eql([[]])
      expect(shouldValidate(test.decode([{ any: 1 }]))).to.be.eql([{ any: 1 }])
      shouldNotValidate(test.decode(1))
      shouldNotValidate(test.decode({ any: 1 }))
      shouldNotValidate(test.decode({ length: 1 }))
      shouldNotValidate(test.decode({ length: 1, '1': 1 }))
      shouldNotValidate(test.decode(undefined))
    })

    it('length() should work', () => {
      const test = array(number()).length(5)

      expect(test.name).to.be.eql("number[](exact 5 items)")
      expect(shouldValidate(test.decode([1, 2, 3, 4, 5]))).to.be.eql([1, 2, 3, 4, 5])
      shouldNotValidate(test.decode([]))
      shouldNotValidate(test.decode([1, 2, 3]))
      shouldNotValidate(test.decode([1, 2, 3, 4, 5, 6]))
      shouldNotValidate(test.decode([undefined, undefined, undefined]))
      shouldNotValidate(test.decode([undefined, undefined, undefined, undefined, undefined]))
      shouldNotValidate(test.decode([undefined, undefined, undefined, undefined, undefined, undefined, undefined]))
      shouldNotValidate(test.decode([null, null, null]))
      shouldNotValidate(test.decode([null, null, null, null, null]))
      shouldNotValidate(test.decode([null, null, null, null, null, null, null]))
      shouldNotValidate(test.decode(undefined))
    })

    it('min() should work', () => {
      const test = array(number()).min(5)

      expect(test.name).to.be.eql("number[](>=5 items)")
      expect(shouldValidate(test.decode([1, 2, 3, 4, 5]))).to.be.eql([1, 2, 3, 4, 5])
      shouldNotValidate(test.decode([]))
      shouldNotValidate(test.decode([1, 2, 3]))
      expect(shouldValidate(test.decode([1, 2, 3, 4, 5, 6]))).to.be.eql([1, 2, 3, 4, 5, 6])
      shouldNotValidate(test.decode([undefined, undefined, undefined]))
      shouldNotValidate(test.decode([undefined, undefined, undefined, undefined, undefined]))
      shouldNotValidate(test.decode([undefined, undefined, undefined, undefined, undefined, undefined, undefined]))
      shouldNotValidate(test.decode([null, null, null]))
      shouldNotValidate(test.decode([null, null, null, null, null]))
      shouldNotValidate(test.decode([null, null, null, null, null, null, null]))
      shouldNotValidate(test.decode(undefined))
    })

    it('max() should work', () => {
      const test = array(number()).max(5)

      expect(test.name).to.be.eql("number[](<=5 items)")
      expect(shouldValidate(test.decode([1, 2, 3, 4, 5]))).to.be.eql([1, 2, 3, 4, 5])
      expect(shouldValidate(test.decode([]))).to.be.eql([])
      expect(shouldValidate(test.decode([1, 2, 3]))).to.be.eql([1, 2, 3])
      shouldNotValidate(test.decode([1, 2, 3, 4, 5, 6]))
      shouldNotValidate(test.decode([undefined, undefined, undefined]))
      shouldNotValidate(test.decode([undefined, undefined, undefined, undefined, undefined]))
      shouldNotValidate(test.decode([undefined, undefined, undefined, undefined, undefined, undefined, undefined]))
      shouldNotValidate(test.decode([null, null, null]))
      shouldNotValidate(test.decode([null, null, null, null, null]))
      shouldNotValidate(test.decode([null, null, null, null, null, null, null]))
      shouldNotValidate(test.decode(undefined))
    })
  })
})