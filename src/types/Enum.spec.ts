import { expect } from 'chai';
import * as t from 'io-ts';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { enumeration } from './Enum';

// tslint:disable:no-unused-expression // chai to be NaN

describe('types:Enum', () => {
  describe('enumeration', () => {
    it('should work with editor', () => {
      enum TestEnumEditor {
        MemberA = "a",
        MemberB = 2,
      }
      const test = enumeration(TestEnumEditor)
      const a: t.TypeOf<typeof test> = TestEnumEditor.MemberA;
      const b: t.TypeOf<typeof test> = TestEnumEditor.MemberB;
      expect(a).to.be.eql(TestEnumEditor.MemberA)
      expect(b).to.be.eql(TestEnumEditor.MemberB)
    })

    it('should work with string enum', () => {
      enum TestEnum1 {
        MemberA = "a",
        MemberB = "b",
      }
      const test = enumeration(TestEnum1, "TestEnum1")

      expect(test.name).to.be.eql("TestEnum1")
      expect(shouldValidate(test.decode("a"))).to.be.equal("a")
      expect(shouldValidate(test.decode("b"))).to.be.equal("b")
      shouldNotValidate(test.decode("c"))
      shouldNotValidate(test.decode("MemberA"))
      shouldNotValidate(test.decode("MemberB"))
      shouldNotValidate(test.decode(1.233))
      shouldNotValidate(test.decode(-1.233))
      shouldNotValidate(test.decode(1e5))
      shouldNotValidate(test.decode(-1e5))
      shouldNotValidate(test.decode(0))
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(Infinity))
      shouldNotValidate(test.decode(-Infinity))
    })

    it('should work with number enum', () => {
      enum TestEnum2 {
        MemberA = 1.4,
        MemberB,
        MemberC = 2.5,
        MemberD = 3,
        MemberE,
        MemberF = 4,
        "1e55" = 1e+55,
        NaN = 7,
        Infinity = 8,
        "-Infinity" = 9,
        "undefined" = 10
      }
      const test = enumeration(TestEnum2, "TestEnum2")

      expect(test.name).to.be.eql("TestEnum2")
      expect(shouldValidate(test.decode(1.4))).to.be.equal(1.4)
      expect(shouldValidate(test.decode(2.4))).to.be.equal(2.4)
      expect(shouldValidate(test.decode(2.5))).to.be.equal(2.5)
      expect(shouldValidate(test.decode(3))).to.be.equal(3)
      expect(shouldValidate(test.decode(4))).to.be.equal(4)
      expect(shouldValidate(test.decode(7))).to.be.equal(7)
      expect(shouldValidate(test.decode(8))).to.be.equal(8)
      expect(shouldValidate(test.decode(9))).to.be.equal(9)
      expect(shouldValidate(test.decode(10))).to.be.equal(10)
      expect(shouldValidate(test.decode(1e+55))).to.be.equal(1e+55)
      expect(shouldValidate(test.decode(TestEnum2.MemberA))).to.be.equal(TestEnum2.MemberA)
      expect(shouldValidate(test.decode(TestEnum2.MemberB))).to.be.equal(TestEnum2.MemberB)
      expect(shouldValidate(test.decode(TestEnum2.MemberC))).to.be.equal(TestEnum2.MemberC)
      expect(shouldValidate(test.decode(TestEnum2.MemberD))).to.be.equal(TestEnum2.MemberD)
      expect(shouldValidate(test.decode(TestEnum2.MemberE))).to.be.equal(TestEnum2.MemberE)
      expect(shouldValidate(test.decode(TestEnum2.MemberF))).to.be.equal(TestEnum2.MemberF)
      expect(shouldValidate(test.decode(TestEnum2["1e55"]))).to.be.equal(TestEnum2["1e55"])
      expect(shouldValidate(test.decode(TestEnum2.NaN))).to.be.equal(TestEnum2.NaN)
      expect(shouldValidate(test.decode(TestEnum2.Infinity))).to.be.equal(TestEnum2.Infinity)
      expect(shouldValidate(test.decode(TestEnum2["-Infinity"]))).to.be.equal(TestEnum2["-Infinity"])
      expect(shouldValidate(test.decode(TestEnum2.undefined))).to.be.equal(TestEnum2.undefined)
      expect(shouldValidate(test.decode(1e+55))).to.be.equal(1e+55)
      shouldNotValidate(test.decode("MemberA"))
      shouldNotValidate(test.decode("MemberB"))
      shouldNotValidate(test.decode("MemberC"))
      shouldNotValidate(test.decode("MemberD"))
      shouldNotValidate(test.decode("MemberE"))
      shouldNotValidate(test.decode("MemberF"))
      shouldNotValidate(test.decode("1e+55"))
      shouldNotValidate(test.decode("1e55"))
      shouldNotValidate(test.decode("1.4"))
      shouldNotValidate(test.decode("2.5"))
      shouldNotValidate(test.decode("3"))
      shouldNotValidate(test.decode("4"))
      shouldNotValidate(test.decode(5))
      shouldNotValidate(test.decode(6))
      shouldNotValidate(test.decode(1.233))
      shouldNotValidate(test.decode(-1.233))
      shouldNotValidate(test.decode(1e5))
      shouldNotValidate(test.decode(-1e5))
      shouldNotValidate(test.decode(0))
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(Infinity))
      shouldNotValidate(test.decode(-Infinity))
    })

    it('should work with no number enum', () => {
      enum TestEnum3 { }

      const test = enumeration(TestEnum3)
      expect(test.name).to.be.eql("enum{}")
      shouldNotValidate(test.decode("MemberA"))
      shouldNotValidate(test.decode("3"))
      shouldNotValidate(test.decode(3))
      shouldNotValidate(test.decode(0))
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(Infinity))
      shouldNotValidate(test.decode(-Infinity))
    })

    it('should work with mixed enum', () => {
      enum TestEnum4 {
        MemberA = "a",
        NaN = 3,
      }
      const test = enumeration(TestEnum4)

      expect(test.name).to.be.eql("enum{3, a}")
      expect(shouldValidate(test.decode("a"))).to.be.equal("a")
      expect(shouldValidate(test.decode(3))).to.be.equal(3)
      shouldNotValidate(test.decode("3"))
      shouldNotValidate(test.decode("MemberA"))
      shouldNotValidate(test.decode("NaN"))
      shouldNotValidate(test.decode(0))
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(Infinity))
      shouldNotValidate(test.decode(-Infinity))
    })

  })
})