import { expect } from 'chai';
import * as t from '../iots';
import * as Loi from '../index';
import { shouldNotValidate, shouldValidate, tidyText } from '../test-helper.spec';
import { taggedUnion } from './TaggedUnion';

// tslint:disable:no-unused-expression // chai to be NaN

describe('types:TaggedUnion', () => {
  describe('set', () => {
    it('should work', () => {
      const types = [
        Loi.object({
          type: Loi.literal("a"),
          aField: Loi.string(),
        }).clean(),
        Loi.object({
          type: Loi.literal("b"),
          bField: Loi.number(),
        }).clean(),
        Loi.object({
          type: Loi.literal("c"),
          cField: Loi.boolean(),
        }).clean(),
      ];

      const tagged = taggedUnion("type", types);
      const normal = t.union(types);

      [tagged, normal].map((i) => {
        expect(shouldValidate(i.decode({ type: "a", aField: "123" }))).to.be.eql({ type: "a", aField: "123" })
        shouldNotValidate(i.decode({ type: "a", aField: 123 }))
        shouldNotValidate(i.decode({ type: "a", aField: true }))

        expect(shouldValidate(i.decode({ type: "b", bField: 123 }))).to.be.eql({ type: "b", bField: 123 })
        shouldNotValidate(i.decode({ type: "b", bField: "123" }))
        shouldNotValidate(i.decode({ type: "b", bField: true }))

        expect(shouldValidate(i.decode({ type: "c", cField: true }))).to.be.eql({ type: "c", cField: true })
        shouldNotValidate(i.decode({ type: "c", cField: 123 }))
        shouldNotValidate(i.decode({ type: "c", cField: "123" }))

        shouldNotValidate(i.decode({ type: "d", aField: 123 }))
        shouldNotValidate(i.decode({ type: "d" }))
        shouldNotValidate(i.decode({ aField: 123 }))
      })

      expect(Loi.createMessage(tagged.decode({ type: "c", cField: "123" }).value as any)).to.be.eql(tidyText(`
        #Invalid value supplied to $
        #  Supplied value is not { type: "c", cField: boolean }
        #    Invalid value \`"123"' supplied to $.cField: boolean
      `))
      expect(Loi.createMessage(normal.decode({ type: "c", cField: "123" }).value as any)).to.be.eql(tidyText(`
        #Invalid value supplied to $
        #  Supplied value is not { type: "a", aField: string }
        #    Invalid value \`"c"' supplied to $.type: "a"
        #    Invalid value \`undefined' supplied to $.aField: string
        #  Supplied value is not { type: "b", bField: number }
        #    Invalid value \`"c"' supplied to $.type: "b"
        #    Invalid value \`undefined' supplied to $.bField: number
        #  Supplied value is not { type: "c", cField: boolean }
        #    Invalid value \`"123"' supplied to $.cField: boolean
      `))

      expect(Loi.createMessage(tagged.decode({ type: "d" }).value as any)).to.be.eql(tidyText(`
        #Invalid value supplied to $
        #  Supplied value is not ({ type: "a", aField: string } | { type: "b", bField: number } | { type: "c", cField: boolean })
        #    Invalid value \`"d"' supplied to $.type: "a" | "b" | "c"
      `))
      expect(Loi.createMessage(normal.decode({ type: "d" }).value as any)).to.be.eql(tidyText(`
        #Invalid value supplied to $
        #  Supplied value is not { type: "a", aField: string }
        #    Invalid value \`"d"' supplied to $.type: "a"
        #    Invalid value \`undefined' supplied to $.aField: string
        #  Supplied value is not { type: "b", bField: number }
        #    Invalid value \`"d"' supplied to $.type: "b"
        #    Invalid value \`undefined' supplied to $.bField: number
        #  Supplied value is not { type: "c", cField: boolean }
        #    Invalid value \`"d"' supplied to $.type: "c"
        #    Invalid value \`undefined' supplied to $.cField: boolean
      `))

      expect(Loi.createMessage(tagged.decode({}).value as any)).to.be.eql(tidyText(`
        #Invalid value supplied to $
        #  Supplied value is not ({ type: "a", aField: string } | { type: "b", bField: number } | { type: "c", cField: boolean })
        #    Invalid value \`undefined' supplied to $.type: "a" | "b" | "c"
      `))
      expect(Loi.createMessage(normal.decode({}).value as any)).to.be.eql(tidyText(`
        #Invalid value supplied to $
        #  Supplied value is not { type: "a", aField: string }
        #    Invalid value \`undefined' supplied to $.type: "a"
        #    Invalid value \`undefined' supplied to $.aField: string
        #  Supplied value is not { type: "b", bField: number }
        #    Invalid value \`undefined' supplied to $.type: "b"
        #    Invalid value \`undefined' supplied to $.bField: number
        #  Supplied value is not { type: "c", cField: boolean }
        #    Invalid value \`undefined' supplied to $.type: "c"
        #    Invalid value \`undefined' supplied to $.cField: boolean
      `))
    })
  })
})