import { expect } from 'chai';
import { LoiFactory } from './factory';

// tslint:disable:no-unused-expression

describe('utilties:factory', () => {
  describe('LoiFactory', () => {
    it('cannot be constructed', () => {
      expect(() => {
        return new LoiFactory<any>()
      }).to.throws(Error, 'The Loi factory class cannot be constructored.')
    })
  })
})