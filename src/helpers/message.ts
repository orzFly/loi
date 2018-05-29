import * as t from 'io-ts';
import { getJavaScriptContextPath } from '../utilties/path';
import { stringify } from '../utilties/stringify';
import { isUnionType } from '../utilties/tag';

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

export function createMessage(results: t.ValidationError[]): string {
  return createMessageFromTree(createTree(results)).join("\n");
}