import { expect } from 'chai';
import * as Loi from '../index';

// tslint:disable:no-unused-expression

describe('helpers:validate', () => {
  describe('validate', () => {
    it('should work', () => {
      expect(Loi.validate(233, Loi.number()).isRight()).to.be.true
      expect(Loi.validate([], Loi.number()).isLeft()).to.be.true
    })
  })
})
