import { expect } from 'chai';
import * as t from '../iots';
import { LoiDecoratorConvert } from '../decorators/convert';
import { LoiDecoratorDefault, LoiDecoratorDefaultResolver } from '../decorators/default';
import { LoiDecoratorNullAsUndefined } from '../decorators/nullAsUndefined';
import { LoiDecoratorRescue, LoiDecoratorRescueResolver } from '../decorators/rescue';
import * as Loi from '../index';
import { LoiTypeDate } from '../types/Date';
import { LoiTypeString } from '../types/String';
import { getRealTypeTag, getTypeTag, isArrayType, isCompoundType, isDecoratorType, isDictType, isUnionType } from './tag';

// tslint:disable:no-unused-expression // chai to be NaN

const data = [
  {
    type: t.Array,
    tag: "AnyArrayType",
    array: true,
  },
  {
    type: t.refinement(t.Array, () => false),
    tag: "RefinementType",
    realTag: "AnyArrayType",
    decorator: true,
    array: true,
  },
  {
    type: t.refinement(t.refinement(t.refinement(t.Array, () => false), () => false), () => false),
    tag: "RefinementType",
    realTag: "AnyArrayType",
    decorator: true,
    array: true,
  },
  {
    type: t.array(t.string),
    tag: "ArrayType",
    array: true,
  },
  {
    type: t.tuple([t.string, t.number]),
    tag: "TupleType",
    array: true,
  },
  {
    type: t.union([t.string, t.number]),
    tag: "UnionType",
    compound: true,
    union: true
  },
  {
    type: t.dictionary(t.string, t.number),
    tag: "DictionaryType",
    dict: true
  },
  {
    type: new LoiDecoratorConvert(t.string, () => "", () => false),
    tag: LoiDecoratorConvert._tag,
    realTag: "StringType",
    decorator: true,
  },
  {
    type: new LoiDecoratorNullAsUndefined(t.string),
    tag: LoiDecoratorNullAsUndefined._tag,
    realTag: "StringType",
    decorator: true,
  },
  {
    type: new LoiDecoratorDefault(t.string, ""),
    tag: LoiDecoratorDefault._tag,
    realTag: "StringType",
    decorator: true,
  },
  {
    type: new LoiDecoratorDefaultResolver(t.string, () => ""),
    tag: LoiDecoratorDefaultResolver._tag,
    realTag: "StringType",
    decorator: true,
  },
  {
    type: new LoiDecoratorRescue(t.string, ""),
    tag: LoiDecoratorRescue._tag,
    realTag: "StringType",
    decorator: true,
  },
  {
    type: new LoiDecoratorRescueResolver(t.string, () => ""),
    tag: LoiDecoratorRescueResolver._tag,
    realTag: "StringType",
    decorator: true,
  },
  {
    type: Loi.string(),
    tag: LoiTypeString._tag,
  },
  {
    type: Loi.string().max(15),
    tag: "RefinementType",
    realTag: LoiTypeString._tag,
    decorator: true,
  },
  {
    type: Loi.date(),
    tag: LoiTypeDate._tag,
  },
  {
    type: Loi.date().max(15),
    tag: "RefinementType",
    realTag: LoiTypeDate._tag,
    decorator: true,
  },
  {
    type: Loi.date().parseDateString(),
    tag: LoiDecoratorConvert._tag,
    realTag: LoiTypeDate._tag,
    decorator: true,
  },
];

describe('utilties:tag', () => {
  describe('getTypeTag', () => {
    it('should work', () => {
      data.forEach((i, index) => {
        expect(getTypeTag(i.type)).to.be.eql(i.tag, `test #${index}`)
      })
    })
  })

  describe('getRealTypeTag', () => {
    it('should work', () => {
      data.forEach((i, index) => {
        expect(getRealTypeTag(i.type)).to.be.eql(i.realTag || i.tag, `test #${index}`)
      })
    })
  })

  describe('isDecoratorType', () => {
    it('should work', () => {
      data.forEach((i, index) => {
        expect(isDecoratorType(i.type)).to.be.eql(!!i.decorator, `test #${index}`)
      })
    })
  })

  describe('isCompoundType', () => {
    it('should work', () => {
      data.forEach((i, index) => {
        expect(isCompoundType(i.type)).to.be.eql(!!i.compound, `test #${index}`)
      })
    })
  })

  describe('isUnionType', () => {
    it('should work', () => {
      data.forEach((i, index) => {
        expect(isUnionType(i.type)).to.be.eql(!!i.union, `test #${index}`)
      })
    })
  })

  describe('isArrayType', () => {
    it('should work', () => {
      data.forEach((i, index) => {
        expect(isArrayType(i.type)).to.be.eql(!!i.array, `test #${index}`)
      })
    })
  })

  describe('isDictType', () => {
    it('should work', () => {
      data.forEach((i, index) => {
        expect(isDictType(i.type)).to.be.eql(!!i.dict, `test #${index}`)
      })
    })
  })
})