import { appendContext, Dictionary, ExactType, failure, identity, interface as interfaceType, InterfaceType, IntersectionType, Mixed, mixed, OutputOf, RefinementType, StrictType, string, success, TaggedIntersectionArgument, Type, TypeOf, UnionType } from '../iots';
import { isDecoratorType } from '../utilties/tag';
import { LoiTypeObject, LoiTypeObjectStrict, LoiTypeObjectViolet } from './Object';

// tslint:disable:interface-name

export type Tagged<Tag extends string, A = any, O = A> = Type<A, O> & { _A: { [K in Tag]: string | number | boolean } }

export const isTagged = <Tag extends string>(tag: Tag): ((type: Mixed) => type is Tagged<Tag>) => {
  const f = (type: Mixed): type is Tagged<Tag> => {
    if (type instanceof InterfaceType || type instanceof StrictType) {
      return type.props.hasOwnProperty(tag)
    } else if (type instanceof IntersectionType) {
      return type.types.some(f)
    } else if (type instanceof UnionType) {
      return type.types.every(f)
    } else if (type instanceof RefinementType || type instanceof ExactType) {
      return f(type.type)
    } else if (isDecoratorType(type)) {
      return f(type.type)
    } else if (type instanceof LoiTypeObject || type instanceof LoiTypeObjectStrict || type instanceof LoiTypeObjectViolet) {
      return type.props.hasOwnProperty(tag)
    } else {
      return false
    }
  }
  return f
}

const findTagged = <Tag extends string>(tag: Tag, types: TaggedIntersectionArgument<Tag>): Tagged<Tag> => {
  const len = types.length
  const is = isTagged(tag)
  let i = 0
  for (; i < len - 1; i++) {
    const type = types[i]
    if (is(type)) {
      return type
    }
  }
  return types[i] as any
}

export const getTagValue = <Tag extends string>(tag: Tag): ((type: Tagged<Tag>) => string | number | boolean) => {
  const f = (type: Tagged<Tag>): string => {
    if (type instanceof InterfaceType || type instanceof StrictType) {
      return type.props[tag].value
    } else if (type instanceof IntersectionType) {
      return f(findTagged(tag, type.types))
    } else if (type instanceof UnionType) {
      return f(type.types[0])
    } else if (type instanceof RefinementType || type instanceof ExactType) {
      return f(type.type)
    } else if (isDecoratorType(type)) {
      return f(type.type as any);
    } else if (type instanceof LoiTypeObject || type instanceof LoiTypeObjectStrict || type instanceof LoiTypeObjectViolet) {
      return type.props[tag].value
    }
    throw new Error("Cannot get tag value");
  }
  return f
}

export const taggedUnion = <Tag extends string, RTS extends Array<Tagged<Tag>>>(
  tag: Tag,
  types: RTS,
  name: string = `(${types.map((type) => type.name).join(' | ')})`
): UnionType<RTS, TypeOf<RTS['_A']>, OutputOf<RTS['_A']>, mixed> => {
  const len = types.length
  const values: Array<string | number | boolean> = new Array(len)
  const hash: { [key: string]: number } = {}
  let useHash = true
  const get = getTagValue(tag)
  for (let i = 0; i < len; i++) {
    const value = get(types[i])
    useHash = useHash && string.is(value)
    values[i] = value
    hash[String(value)] = i
  }
  const isTagValue = useHash
    ? (m: mixed): m is string | number | boolean => string.is(m) && hash.hasOwnProperty(m)
    : (m: mixed): m is string | number | boolean => values.indexOf(m as any) !== -1
  const getIndex: (tag: string | number | boolean) => number = useHash
    ? (tag) => hash[tag as any]
    : (tag) => {
      let i = 0
      for (; i < len - 1; i++) {
        if (values[i] === tag) {
          break
        }
      }
      return i
    }
  const TagValue = new Type(
    values.map((l) => JSON.stringify(l)).join(' | '),
    isTagValue,
    (m, c) => (isTagValue(m) ? success(m) : failure(m, c)),
    identity
  )
  const TagOnlyType = interfaceType({
    [tag]: TagValue
  }, name);
  return new UnionType<RTS, TypeOf<RTS['_A']>, OutputOf<RTS['_A']>, mixed>(
    name,
    (v): v is TypeOf<RTS['_A']> => {
      if (!Dictionary.is(v)) {
        return false
      }
      const tagValue = v[tag]
      return TagValue.is(tagValue) && types[getIndex(tagValue)].is(v)
    },
    (s, c) => {
      const dictionaryValidation = Dictionary.validate(s, c)
      if (dictionaryValidation.isLeft()) {
        return dictionaryValidation
      } else {
        const d = dictionaryValidation.value
        const tagValueValidation = TagValue.validate(d[tag], appendContext(appendContext(c, "-1", TagOnlyType), tag, TagValue))
        if (tagValueValidation.isLeft()) {
          return tagValueValidation
        } else {
          const i = getIndex(tagValueValidation.value)
          const type = types[i]
          return type.validate(d, appendContext(c, String(i), type))
        }
      }
    },
    types.every((type) => type.encode === identity) ? identity : (a) => (<any>types[getIndex(a[tag] as any)]).encode(a),
    types
  )
}