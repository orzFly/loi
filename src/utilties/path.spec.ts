import { expect } from 'chai';
import * as t from '../iots';
import * as Loi from '../index';
import { getContextPath, getJavaScriptContextPath, getRealContextPath } from './path';

// tslint:disable:no-unused-expression // chai to be NaN

const data = [
  {
    type: Loi.array(Loi.object({ a: Loi.string })),
    target: [{ a: 1 }],
    path: "$.0.a",
    realPath: "$.0.a",
    jsPath: "$[0].a",
  },
  {
    type: Loi.array(Loi.object({}, { b: Loi.string })),
    target: [{ b: 1 }],
    path: "$.0.b.0",
    realPath: "$.0.b",
    jsPath: "$[0].b",
  },
  {
    type: Loi.number().allow(Loi.string()).allow(Loi.boolean()),
    target: [{ b: 1 }],
    path: "$.0.0",
    realPath: "$",
    jsPath: "$",
  }
]

describe('utilties:path', () => {
  describe('getContextPath', () => {
    it('should work', () => {
      data.forEach((i, index) => {
        const context = (i.type.decode(i.target).value as t.ValidationError[])[0].context;
        expect(getContextPath(context)).to.be.eql(i.path, `test #${index}`)
      })
    })
  })

  describe('getRealContextPath', () => {
    it('should work', () => {
      data.forEach((i, index) => {
        const context = (i.type.decode(i.target).value as t.ValidationError[])[0].context;
        expect(getRealContextPath(context)).to.be.eql(i.realPath, `test #${index}`)
      })
    })
  })

  describe('getJavaScriptContextPath', () => {
    it('should work', () => {
      data.forEach((i, index) => {
        const context = (i.type.decode(i.target).value as t.ValidationError[])[0].context;
        expect(getJavaScriptContextPath(context)).to.be.eql(i.jsPath, `test #${index}`)
      })
    })
  })
})