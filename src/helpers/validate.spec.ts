import { expect } from 'chai';
import { validate } from '../index';
import { number } from '../types/Number';

// tslint:disable:no-unused-expression

describe('helpers:validate', () => {
  describe('validate', () => {
    it('should work', () => {
      expect(validate(233, number()).isRight()).to.be.true
      expect(validate([], number()).isLeft()).to.be.true
    })
  })
})