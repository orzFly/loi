import * as t from '../iots';

/** @internal */
export function stringify(v: any): string {
  try {
    if (typeof v === 'function') {
      return t.getFunctionName(v);
    }

    const str = JSON.stringify(v);
    if (str) return str;
  } catch (e) { }

  try {
    return v.toString()
  } catch (e) { }

  try {
    return String(v)
  } catch (e) { }

  return `#<${typeof v}>`
}
