import { expect } from 'chai';
import * as Loi from '../index';
import { tidyText } from '../test-helper.spec';
import * as errorType from './error';
import { createError } from './error';

describe('helpers:errorType', () => {
  it('works', () => {
    String(errorType)
    const type = Loi.object({
      a: Loi.string()
    })
    const result = type.decode({
      a: false
    })
    if (!result.isLeft()) throw new Error("Didn't fail!");

    const error = createError(result.value);

    expect(error.message).to.be.eql(tidyText(`
      #Validation Error
      #
      #Invalid value supplied to $: { a: string }
      #  Invalid value \`false\' supplied to $.a: string
    `))
    expect(error.details).to.be.eql([{
      type: 'invalid',
      path: '$.a',
      kind: 'string',
      message: 'Invalid value `false\' supplied to $.a: string.'
    }]);
  })
})