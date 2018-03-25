import { expect } from 'chai';
import * as t from 'io-ts';
import { forEach } from 'lodash';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { any } from './Any';

// tslint:disable:no-unused-expression // chai to be NaN

describe('types:Any', () => {
  describe('any', () => {
    it('should work', () => {
      const test = any()

      expect(test.name).to.be.eql("any")
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode([[]]))).to.be.eql([[]])
      expect(shouldValidate(test.decode({ any: 1 }))).to.be.eql({ any: 1 })
      expect(shouldValidate(test.decode(null))).to.be.eql(null)
      expect(shouldValidate(test.decode(undefined))).to.be.eql(undefined)

      const func = () => { }
      expect(shouldValidate(test.decode(func))).to.be.eql(func)
    })

    it('nonNull() should work', () => {
      const test = any().nonNull()

      expect(test.name).to.be.eql("any(non-null)")
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode([[]]))).to.be.eql([[]])
      expect(shouldValidate(test.decode({ any: 1 }))).to.be.eql({ any: 1 })
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))

      const func = () => { }
      expect(shouldValidate(test.decode(func))).to.be.eql(func)
    })
  })
})