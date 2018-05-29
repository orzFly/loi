import * as t from 'io-ts';
import { LoiValidationError, LoiValidationErrorItem, LoiValidationResult } from './errorType';

export function validate<S, A>(value: S, type: t.Decoder<S, A>): t.Validation<A> {
  return type.decode(value);
}

export function validateOrReturn<S, A>(value: S, type: t.Decoder<S, A>): LoiValidationResult<A> {
  const result = type.decode(value);

  if (result.isLeft()) {
    return { error: createError(result.value) };
  }

  return { value: result.value };
}

export function validateOrThrow<S, A>(value: S, type: t.Decoder<S, A>): A {
  const result = type.decode(value);

  if (result.isLeft()) {
    throw createError(result.value);
  }

  return result.value;
}

/** @internal */
export function stringify(v: any): string {
  return typeof v === 'function' ? t.getFunctionName(v) : JSON.stringify(v)
}

/** @internal */
export function getRealTypeTag(type: t.Any | t.Decoder<any, any>): string | undefined {
  if (!type) return undefined;

  const tag = (<any>type)._tag;
  if (tag === null || tag === undefined) return undefined;

  if (['RefinementType', 'ReadonlyType'].indexOf(tag) >= 0 && (<any>type).type) return getRealTypeTag(type);

  return tag;
}

/** @internal */
export function isCombinatorType(type: t.Any | t.Decoder<any, any>): boolean {
  const tag = getRealTypeTag(type);
  return !!tag && (['UnionType', 'IntersectionType'].indexOf(tag) >= 0);
}

/** @internal */
export function isUnionType(type: t.Any | t.Decoder<any, any>): boolean {
  const tag = getRealTypeTag(type);
  return !!tag && (['UnionType'].indexOf(tag) >= 0);
}

/** @internal */
export function isArrayType(type: t.Any | t.Decoder<any, any>): boolean {
  const tag = getRealTypeTag(type);
  return !!tag && (['ReadonlyArrayType', 'ArrayType', 'AnyArrayType', 'TupleType'].indexOf(tag) >= 0);
}

/** @internal */
export function isDictType(type: t.Any | t.Decoder<any, any>): boolean {
  const tag = getRealTypeTag(type);
  return !!tag && (['DictionaryType', 'AnyDictionaryType'].indexOf(tag) >= 0);
}

/** @internal */
export function getContextPath(context: t.Context): string {
  return ["$", ...context.slice(1).map((i) => i.key)].join(".")
}

/** @internal */
export function getRealContextPath(context: t.Context): string {
  let last: t.Decoder<any, any> = context[0].type;
  return ["$", ...context.slice(1).filter((i) => {
    const realLast = last;
    last = i.type;
    return isCombinatorType(realLast);
  }).filter((i) => i)].join(".")
}

/** @internal */
export function getJavaScriptContextPath(context: t.Context): string {
  let last: t.Decoder<any, any> = context[0].type;
  return ["$", ...context.slice(0).map((i) => {
    const realLast = last;
    last = i.type;
    if (isCombinatorType(realLast)) {
      return "";
    } else if (isArrayType(realLast)) {
      return `[${i.key}]`
    } else if (isDictType(realLast)) {
      return `[${JSON.stringify(i.key)}]`
    } else {
      return `.${i.key}`;
    }
  })].join("")
}

/** @internal */
export function getDetailErrorItem(v: any, context: t.Context): LoiValidationErrorItem {
  return {
    type: "invalid",
    path: getRealContextPath(context),
    message: `Invalid value \`${stringify(v)}' supplied to ${getRealContextPath(context)}: ${context[context.length - 1].type.name}.`
  }
}

export function createError(results: t.ValidationError[]): LoiValidationError {
  const error = new Error() as LoiValidationError
  error.httpCode = 400;
  error.code = "validation_error";
  error.message = `Validation Error\n\n${createMessageFromTree(createTree(results)).join("\n")}`;
  error.details = results.map((e) => getDetailErrorItem(e.value, e.context));
  return error;
}

/** @internal */
export interface IValidationErrorTreeNodes {
  [key: string]: IValidationErrorTreeNode
}

/** @internal */
export interface IValidationErrorTreeNode {
  key: string,
  value: any,
  context: t.ContextEntry,
  contexts: t.ContextEntry[],
  nodes: IValidationErrorTreeNodes
}

/** @internal */
export function createMessageFromTree(nodes: IValidationErrorTreeNodes, level: number = 0, isCombinator: boolean = false): string[] {
  const indent = Array(level).fill("  ").join("");
  const result: string[] = [];
  for (const key in nodes) {
    if (Object.prototype.hasOwnProperty.call(nodes, key)) {
      const node = nodes[key];
      const keys = Object.keys(node.nodes);
      if (isCombinator) {
        if (keys.length > 0) {
          result.push(`${indent}Supplied value is not ${node.context.type.name}`)
          result.push.apply(result, createMessageFromTree(node.nodes, level + 1));
        } else {
          result.push(`${indent}Supplied value \`${stringify(node.value)}' is not ${node.context.type.name}`)
        }
      } else {
        if (keys.length > 0) {
          if (isUnionType(node.context.type)) {
            result.push(`${indent}Invalid value supplied to ${getJavaScriptContextPath(node.contexts)}`)
            result.push.apply(result, createMessageFromTree(node.nodes, level + 1, true));
          } else {
            result.push(`${indent}Invalid value supplied to ${getJavaScriptContextPath(node.contexts)}: ${node.context.type.name}`)
            result.push.apply(result, createMessageFromTree(node.nodes, level + 1));
          }
        } else {
          result.push(`${indent}Invalid value \`${stringify(node.value)}' supplied to ${getJavaScriptContextPath(node.contexts)}: ${node.context.type.name}`)
        }
      }
    }
  }
  return result;
}

/** @internal */
export function createTree(results: t.ValidationError[]): IValidationErrorTreeNodes {
  const root: IValidationErrorTreeNodes = Object.create(null);
  results.forEach((r) => {
    const path = r.context.slice(0);
    let level = root;
    let current: t.ContextEntry | undefined
    const history: t.ContextEntry[] = [];
    while (current = path.shift()) {
      history.push(current);
      const safeKey = current.key || "";
      if (!level[safeKey]) {
        level[safeKey] = {
          key: safeKey,
          value: r.value,
          context: current,
          contexts: history.slice(0),
          nodes: Object.create(null)
        }
      }
      level = level[safeKey].nodes;
    }
  })
  return root;
}
