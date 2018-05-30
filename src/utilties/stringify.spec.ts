import { expect } from 'chai';
import { stringify } from './stringify';

// tslint:disable:no-unused-expression // chai to be NaN

describe('utilties:stringify', () => {
  describe('stringify', () => {
    it('should work', () => {
      expect(stringify("a")).to.be.eql('"a"');

      expect(stringify(Object.create(null))).to.be.eql('{}');

      expect(stringify(Symbol())).to.be.eql('Symbol()');

      expect(stringify((() => {
        const x: any = {
          toString() { throw new Error(); },
          valueOf() { throw new Error(); }
        };
        x.x = x;
        return x;
      })())).to.be.eql('#<object>');

      expect(stringify((() => {
        const x: any = Object.create(null);
        x.x = x;
        return x;
      })())).to.be.eql('#<object>');
    })
  })
})