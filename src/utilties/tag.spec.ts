import { expect } from 'chai';
import * as t from 'io-ts';
import { convert, nullAsUndefined } from './convert';
import { withDefault, withDefaultResolver } from './default';
import { withRescue, withRescueResolver } from './rescue';
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
    type: convert(t.string, () => "", () => false),
    tag: "ConvertType",
    realTag: "StringType",
    decorator: true,
  },
  {
    type: nullAsUndefined(t.string),
    tag: "NullAsUndefinedType",
    realTag: "StringType",
    decorator: true,
  },
  {
    type: withDefault(t.string, ""),
    tag: "DefaultType",
    realTag: "StringType",
    decorator: true,
  },
  {
    type: withDefaultResolver(t.string, () => ""),
    tag: "DefaultResolverType",
    realTag: "StringType",
    decorator: true,
  },
  {
    type: withRescue(t.string, ""),
    tag: "RescueType",
    realTag: "StringType",
    decorator: true,
  },
  {
    type: withRescueResolver(t.string, () => ""),
    tag: "RescueResolverType",
    realTag: "StringType",
    decorator: true,
  }
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