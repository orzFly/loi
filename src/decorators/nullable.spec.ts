import { expect } from 'chai';
import * as t from '../iots';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { LoiDecoratorNotNullable, LoiDecoratorNullable } from './nullable';

// tslint:disable:no-unused-expression // chai to be NaN

describe('decorators:nullable', () => {
  describe('LoiDecoratorNullable', () => {
    it('should work', () => {
      for (const type of [
        new LoiDecoratorNullable(t.boolean),
        new LoiDecoratorNullable(new LoiDecoratorNullable(t.boolean)),
        new LoiDecoratorNullable(new LoiDecoratorNotNullable(new LoiDecoratorNullable(t.boolean))),
      ]) {
        const test = t.partial({
          key: type
        })

        expect(shouldValidate(test.decode({ key: true })).key).to.be.equal(true)
        expect(shouldValidate(test.decode({ key: false })).key).to.be.equal(false)
        expect(shouldValidate(test.decode({ key: undefined })).key).to.be.equal(undefined)
        expect(shouldValidate(test.decode({ key: null })).key).to.be.equal(null)
        expect(shouldValidate(test.decode({})).key).to.be.equal(undefined)

        const test2 = type
        expect(shouldValidate(test2.decode(true))).to.be.equal(true)
        expect(shouldValidate(test2.decode(false))).to.be.equal(false)
        shouldNotValidate(test2.decode(undefined))
        expect(shouldValidate(test2.decode(null))).to.be.equal(null)

        expect(test2.encode(true)).to.be.eql(t.boolean.encode(true))
        expect(test2.encode(false)).to.be.eql(t.boolean.encode(false))
        expect(test2.encode(null as any)).to.be.eql(t.boolean.encode(null as any))
        expect(test2.encode(undefined as any)).to.be.eql(t.boolean.encode(undefined as any))

        expect(test2.is(true)).to.be.eql(t.boolean.is(true)); expect(t.boolean.is(true)).to.be.eql(true)
        expect(test2.is(false)).to.be.eql(t.boolean.is(false)); expect(t.boolean.is(false)).to.be.eql(true)
        expect(test2.is(1)).to.be.eql(t.boolean.is(1)); expect(t.boolean.is(1)).to.be.eql(false)
        expect(test2.is(null)).to.be.eql(true)
        expect(test2.is(undefined)).to.be.eql(false)
      }
    })
  })

  describe('LoiDecoratorNotNullable', () => {
    it('should work', () => {
      for (const type of [
        t.boolean,
        new LoiDecoratorNotNullable(t.boolean),
        new LoiDecoratorNotNullable(new LoiDecoratorNotNullable(t.boolean)),
        new LoiDecoratorNotNullable(new LoiDecoratorNullable(t.boolean)),
        new LoiDecoratorNotNullable(new LoiDecoratorNullable(new LoiDecoratorNotNullable(new LoiDecoratorNullable(t.boolean)))),
      ]) {
        const test = t.partial({
          key: type
        })

        expect(shouldValidate(test.decode({ key: true })).key).to.be.equal(true)
        expect(shouldValidate(test.decode({ key: false })).key).to.be.equal(false)
        expect(shouldValidate(test.decode({ key: undefined })).key).to.be.equal(undefined)
        shouldNotValidate(test.decode({ key: null }))
        expect(shouldValidate(test.decode({})).key).to.be.equal(undefined)

        const test2 = type
        expect(shouldValidate(test2.decode(true))).to.be.equal(true)
        expect(shouldValidate(test2.decode(false))).to.be.equal(false)
        shouldNotValidate(test2.decode(undefined))
        shouldNotValidate(test2.decode(null))

        expect(test2.encode(true)).to.be.eql(t.boolean.encode(true))
        expect(test2.encode(false)).to.be.eql(t.boolean.encode(false))
        expect(test2.encode(null as any)).to.be.eql(t.boolean.encode(null as any))
        expect(test2.encode(undefined as any)).to.be.eql(t.boolean.encode(undefined as any))

        expect(test2.is(true)).to.be.eql(t.boolean.is(true)); expect(t.boolean.is(true)).to.be.eql(true)
        expect(test2.is(false)).to.be.eql(t.boolean.is(false)); expect(t.boolean.is(false)).to.be.eql(true)
        expect(test2.is(1)).to.be.eql(t.boolean.is(1)); expect(t.boolean.is(1)).to.be.eql(false)
        expect(test2.is(null)).to.be.eql(false)
        expect(test2.is(undefined)).to.be.eql(false)
      };
    })
  })
})
