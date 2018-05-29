import { expect } from 'chai';
import * as Loi from '../index';
import { createMessageFromTree, createTree } from './validate';

// tslint:disable:no-unused-expression

function tidyText(str: string) {
  return str.replace(/^\s+?#|\s+?$/g, "").replace(/\n\s+?#/g, "\n")
}

describe('helpers:validate', () => {
  describe('validate', () => {
    it('should work', () => {
      expect(Loi.validate(233, Loi.number()).isRight()).to.be.true
      expect(Loi.validate([], Loi.number()).isLeft()).to.be.true
    })
  })

  describe('createMessageFromTree & createTree', () => {
    it('should work with a simple object array', () => {
      const type = Loi.object({
        a: Loi.array(Loi.string().allow(Loi.number()))
      })
      const result = type.decode({
        a: [false, true, null]
      })
      if (!result.isLeft()) throw new Error("Didn't fail!");

      expect(createMessageFromTree(createTree(result.value)).join("\n")).to.be.eql(tidyText(`
        #Invalid value supplied to $: { a: (string | number)[] }
        #  Invalid value supplied to $: (string | number)[]
        #    Invalid value supplied to $[0]
        #      Supplied value \`false' is not string
        #      Supplied value \`false' is not number
        #    Invalid value supplied to $[1]
        #      Supplied value \`true' is not string
        #      Supplied value \`true' is not number
        #    Invalid value supplied to $[2]
        #      Supplied value \`null' is not string
        #      Supplied value \`null' is not number
      `))
    })

    it('should work with a complex array', () => {
      const type = Loi.array(
        Loi.object({
          a: Loi.object({
            b: Loi.object({
              c: Loi.object({
                d: Loi.string().allow(Loi.number())
              }, {
                e: Loi.number()
              }, "InterfaceDE").violet().allow(Loi.number())
            }, "InterfaceC").violet().allow(Loi.number())
          }, "InterfaceB").violet().allow(Loi.number())
        }, "InterfaceA").violet().allow(Loi.number())
      )
      const result = type.decode([{ a: { b: { c: { d: {}, e: "hello" } } } }, "str", 2])
      if (!result.isLeft()) throw new Error("Didn't fail!");

      expect(createMessageFromTree(createTree(result.value)).join("\n")).to.be.eql(tidyText(`
        #Invalid value supplied to $[]: (InterfaceA(violet) | number)[]
        #  Invalid value supplied to $[][0]
        #    Supplied value is not InterfaceA(violet)
        #      Invalid value supplied to $[][0].a
        #        Supplied value is not InterfaceB(violet)
        #          Invalid value supplied to $[][0].a.b
        #            Supplied value is not InterfaceC(violet)
        #              Invalid value supplied to $[][0].a.b.c
        #                Supplied value is not InterfaceDE(violet)
        #                  Invalid value supplied to $[][0].a.b.c.d
        #                    Supplied value \`{}' is not string
        #                    Supplied value \`{}' is not number
        #                  Invalid value supplied to $[][0].a.b.c.e
        #                    Supplied value \`"hello"' is not number
        #                    Supplied value \`"hello"' is not undefined
        #                Supplied value \`{"d":{},"e":"hello"}' is not number
        #            Supplied value \`{"c":{"d":{},"e":"hello"}}' is not number
        #        Supplied value \`{"b":{"c":{"d":{},"e":"hello"}}}' is not number
        #    Supplied value \`{"a":{"b":{"c":{"d":{},"e":"hello"}}}}' is not number
        #  Invalid value supplied to $[][1]
        #    Supplied value \`"str"' is not InterfaceA(violet)
        #    Supplied value \`"str"' is not number
      `))
    })
  })
})
