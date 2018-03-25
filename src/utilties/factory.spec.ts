import { expect } from 'chai';
import { Factory } from './factory';

// tslint:disable:no-unused-expression

describe('utilties:factory', () => {
  describe('Factory', () => {
    it('cannot be constructed', () => {
      expect(() => {
        return new Factory<any>()
      }).to.throws(Error, 'The Loi factory class cannot be constructored.')
    })
  })
})