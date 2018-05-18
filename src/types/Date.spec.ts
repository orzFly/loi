import { expect } from 'chai';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { date } from './Date';

// tslint:disable:no-unused-expression // chai to be NaN

describe('types:Date', () => {
  describe('date', () => {
    it('should work', () => {
      const test = date()
      let time: Date

      expect(test.name).to.be.eql("date")
      expect(shouldValidate(test.decode(time = new Date()))).to.be.eql(time)
      expect(shouldValidate(test.decode(new Date("1970-01-01T00:00:00.000Z")))).to.be.eql(new Date("1970-01-01T00:00:00.000Z"))
      expect(shouldValidate(test.decode(new Date(233)))).to.be.eql(new Date(233))
      expect(shouldValidate(test.decode(new Date(null as any)))).to.be.eql(new Date("1970-01-01T00:00:00.000Z"))
      shouldNotValidate(test.decode("1970-01-01T00:00:00.000Z"))
      shouldNotValidate(test.decode(new Date([] as any)))
      shouldNotValidate(test.decode(new Date(undefined as any)))
      shouldNotValidate(test.decode(233))
      shouldNotValidate(test.decode(1))
      shouldNotValidate(test.decode(-1))
      shouldNotValidate(test.decode(1.233))
      shouldNotValidate(test.decode(-1.233))
      shouldNotValidate(test.decode(1e5))
      shouldNotValidate(test.decode(-1e5))
      shouldNotValidate(test.decode(0))
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(Infinity))
      shouldNotValidate(test.decode(-Infinity))
    })

    it('mimicked date should work', () => {
      const test = date
      let time: Date

      expect(test.name).to.be.eql("date")
      expect(shouldValidate(test.decode(time = new Date()))).to.be.eql(time)
      expect(shouldValidate(test.decode(new Date("1970-01-01T00:00:00.000Z")))).to.be.eql(new Date("1970-01-01T00:00:00.000Z"))
      expect(shouldValidate(test.decode(new Date(233)))).to.be.eql(new Date(233))
      expect(shouldValidate(test.decode(new Date(null as any)))).to.be.eql(new Date("1970-01-01T00:00:00.000Z"))
      shouldNotValidate(test.decode("1970-01-01T00:00:00.000Z"))
      shouldNotValidate(test.decode(new Date([] as any)))
      shouldNotValidate(test.decode(new Date(undefined as any)))
      shouldNotValidate(test.decode(233))
      shouldNotValidate(test.decode(1))
      shouldNotValidate(test.decode(-1))
      shouldNotValidate(test.decode(1.233))
      shouldNotValidate(test.decode(-1.233))
      shouldNotValidate(test.decode(1e5))
      shouldNotValidate(test.decode(-1e5))
      shouldNotValidate(test.decode(0))
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(Infinity))
      shouldNotValidate(test.decode(-Infinity))
    })

    it('parseDateString should work', () => {
      const test = date().parseDateString()
      let time: Date

      expect(test.name).to.be.eql("date(Date.parse)")
      expect(shouldValidate(test.decode(time = new Date()))).to.be.eql(time)
      expect(shouldValidate(test.decode(new Date("1970-01-01T00:00:00.000Z")))).to.be.eql(new Date("1970-01-01T00:00:00.000Z"))
      expect(shouldValidate(test.decode(new Date(233)))).to.be.eql(new Date(233))
      expect(shouldValidate(test.decode(new Date(null as any)))).to.be.eql(new Date("1970-01-01T00:00:00.000Z"))
      expect(shouldValidate(test.decode((time = new Date()).toISOString()))).to.be.eql(time)
      expect(shouldValidate(test.decode((time = new Date()).toJSON()))).to.be.eql(time)
      expect(shouldValidate(test.decode("1970-01-01T00:00:00.000Z"))).to.be.eql(new Date("1970-01-01T00:00:00.000Z"))
      shouldNotValidate(test.decode("Inifinity"))
      shouldNotValidate(test.decode("23323232323"))
      shouldNotValidate(test.decode(new Date([] as any)))
      shouldNotValidate(test.decode(new Date(undefined as any)))
      shouldNotValidate(test.decode(233))
      shouldNotValidate(test.decode(1))
      shouldNotValidate(test.decode(-1))
      shouldNotValidate(test.decode(1.233))
      shouldNotValidate(test.decode(-1.233))
      shouldNotValidate(test.decode(1e5))
      shouldNotValidate(test.decode(-1e5))
      shouldNotValidate(test.decode(0))
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(Infinity))
      shouldNotValidate(test.decode(-Infinity))
    })
  })
})