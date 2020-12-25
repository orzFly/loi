export type Predicate<A> = (a: A) => boolean
export type Refinement<A, B extends A> = (a: A) => a is B

const getFunctionName = (f: Function): string => (f as any).displayName || f.name || `<function${f.length}>`

export const toString = (x: any): string => {
  if (typeof x === 'string') {
    return JSON.stringify(x)
  }
  if (x instanceof Date) {
    return `new Date('${x.toISOString()}')`
  }
  if (Array.isArray(x)) {
    // tslint:disable-next-line: deprecation
    return `[${x.map(toString).join(', ')}]`
  }
  if (typeof x === 'function') {
    return getFunctionName(x)
  }
  if (x == null) {
    return String(x)
  }
  if (typeof x.toString === 'function' && x.toString !== Object.prototype.toString) {
    return x.toString()
  }
  try {
    return JSON.stringify(x, null, 2)
  } catch (e) {
    return String(x)
  }
}

/**
 * @since 1.0.0
 */
export type Either<L, A> = Left<L, A> | Right<L, A>

/**
 * Left side of `Either`
 */
export class Left<L, A> {
  readonly _tag: 'Left' = 'Left'
  readonly _A!: A
  readonly _L!: L
  constructor(readonly value: L) { }
  /**
   * The given function is applied if this is a `Right`
   * @obsolete
   */
  map<B>(_f: (a: A) => B): Either<L, B> {
    return this as any
  }
  /** @obsolete */
  ap<B>(fab: Either<L, (a: A) => B>): Either<L, B> {
    return (fab.isLeft() ? fab : this) as any
  }
  /**
   * Flipped version of `ap`
   * @obsolete
   */
  ap_<B, C>(this: Either<L, (b: B) => C>, fb: Either<L, B>): Either<L, C> {
    return fb.ap(this)
  }
  /**
   * Binds the given function across `Right`
   * @obsolete
   */
  chain<B>(_f: (a: A) => Either<L, B>): Either<L, B> {
    return this as any
  }
  /** @obsolete */
  bimap<V, B>(f: (l: L) => V, _g: (a: A) => B): Either<V, B> {
    return new Left(f(this.value))
  }
  /** @obsolete */
  alt(fy: Either<L, A>): Either<L, A> {
    return fy
  }

  /**
   * Lazy version of `alt`
   *
   * @example
   * import { right } from 'fp-ts/lib/Either'
   *
   * assert.deepStrictEqual(right(1).orElse(() => right(2)), right(1))
   *
   * @since 1.6.0
   * @obsolete
   */
  orElse<M>(fy: (l: L) => Either<M, A>): Either<M, A> {
    return fy(this.value)
  }
  /** @obsolete */
  extend<B>(_f: (ea: Either<L, A>) => B): Either<L, B> {
    return this as any
  }
  /** @obsolete */
  reduce<B>(b: B, _f: (b: B, a: A) => B): B {
    return b
  }
  /**
   * Applies a function to each case in the data structure
   * @obsolete
   */
  fold<B>(onLeft: (l: L) => B, _onRight: (a: A) => B): B {
    return onLeft(this.value)
  }
  /**
   * Returns the value from this `Right` or the given argument if this is a `Left`
   * @obsolete
   */
  getOrElse(a: A): A {
    return a
  }
  /**
   * Returns the value from this `Right` or the result of given argument if this is a `Left`
   * @obsolete
   */
  getOrElseL(f: (l: L) => A): A {
    return f(this.value)
  }
  /**
   * Maps the left side of the disjunction
   * @obsolete
   */
  mapLeft<M>(f: (l: L) => M): Either<M, A> {
    return new Left(f(this.value))
  }
  inspect(): string {
    return this.toString()
  }
  toString(): string {
    // tslint:disable-next-line: deprecation
    return `left(${toString(this.value)})`
  }
  /**
   * Returns `true` if the either is an instance of `Left`, `false` otherwise
   * @obsolete
   */
  isLeft(): this is Left<L, A> {
    return true
  }
  /**
   * Returns `true` if the either is an instance of `Right`, `false` otherwise
   * @obsolete
   */
  isRight(): this is Right<L, A> {
    return false
  }
  /**
   * Swaps the disjunction values
   * @obsolete
   */
  swap(): Either<A, L> {
    return new Right(this.value)
  }
  /**
   * Returns `Right` with the existing value of `Right` if this is a `Right` and the given predicate `p` holds for the
   * right value, returns `Left(zero)` if this is a `Right` and the given predicate `p` does not hold for the right
   * value, returns `Left` with the existing value of `Left` if this is a `Left`.
   *
   * @example
   * import { right, left } from 'fp-ts/lib/Either'
   *
   * assert.deepStrictEqual(right(12).filterOrElse(n => n > 10, -1), right(12))
   * assert.deepStrictEqual(right(7).filterOrElse(n => n > 10, -1), left(-1))
   * assert.deepStrictEqual(left<number, number>(12).filterOrElse(n => n > 10, -1), left(12))
   *
   * @since 1.3.0
   * @obsolete
   */
  filterOrElse<B extends A>(p: Refinement<A, B>, zero: L): Either<L, B>
  filterOrElse(p: Predicate<A>, zero: L): Either<L, A>
  filterOrElse(_: Predicate<A>, _zero: L): Either<L, A> {
    return this
  }
  /**
   * Lazy version of `filterOrElse`
   * @since 1.3.0
   * @obsolete
   */
  filterOrElseL<B extends A>(p: Refinement<A, B>, zero: (a: A) => L): Either<L, B>
  filterOrElseL(p: Predicate<A>, zero: (a: A) => L): Either<L, A>
  filterOrElseL(_: Predicate<A>, _zero: (a: A) => L): Either<L, A> {
    return this
  }
  /**
   * Use `filterOrElse` instead
   * @since 1.6.0
   * @deprecated
   */
  refineOrElse<B extends A>(_p: Refinement<A, B>, _zero: L): Either<L, B> {
    return this as any
  }
  /**
   * Lazy version of `refineOrElse`
   * Use `filterOrElseL` instead
   * @since 1.6.0
   * @deprecated
   */
  refineOrElseL<B extends A>(_p: Refinement<A, B>, _zero: (a: A) => L): Either<L, B> {
    return this as any
  }
}

/**
 * Right side of `Either`
 */
export class Right<L, A> {
  readonly _tag: 'Right' = 'Right'
  readonly _A!: A
  readonly _L!: L
  constructor(readonly value: A) { }
  map<B>(f: (a: A) => B): Either<L, B> {
    return new Right(f(this.value))
  }
  ap<B>(fab: Either<L, (a: A) => B>): Either<L, B> {
    return fab.isRight() ? this.map(fab.value) : left(fab.value)
  }
  ap_<B, C>(this: Either<L, (b: B) => C>, fb: Either<L, B>): Either<L, C> {
    return fb.ap(this)
  }
  chain<B>(f: (a: A) => Either<L, B>): Either<L, B> {
    return f(this.value)
  }
  bimap<V, B>(_f: (l: L) => V, g: (a: A) => B): Either<V, B> {
    return new Right<V, B>(g(this.value))
  }
  alt(_fy: Either<L, A>): Either<L, A> {
    return this
  }
  orElse<M>(_fy: (l: L) => Either<M, A>): Either<M, A> {
    return this as any
  }
  extend<B>(f: (ea: Either<L, A>) => B): Either<L, B> {
    return new Right(f(this))
  }
  reduce<B>(b: B, f: (b: B, a: A) => B): B {
    return f(b, this.value)
  }
  fold<B>(_onLeft: (l: L) => B, onRight: (a: A) => B): B {
    return onRight(this.value)
  }
  getOrElse(_a: A): A {
    return this.value
  }
  getOrElseL(_f: (l: L) => A): A {
    return this.value
  }
  mapLeft<M>(_f: (l: L) => M): Either<M, A> {
    return new Right(this.value)
  }
  inspect(): string {
    return this.toString()
  }
  toString(): string {
    // tslint:disable-next-line: deprecation
    return `right(${toString(this.value)})`
  }
  isLeft(): this is Left<L, A> {
    return false
  }
  isRight(): this is Right<L, A> {
    return true
  }
  swap(): Either<A, L> {
    return new Left(this.value)
  }
  filterOrElse<B extends A>(p: Refinement<A, B>, zero: L): Either<L, B>
  filterOrElse(p: Predicate<A>, zero: L): Either<L, A>
  filterOrElse(p: Predicate<A>, zero: L): Either<L, A> {
    return p(this.value) ? this : left(zero)
  }
  filterOrElseL<B extends A>(p: Refinement<A, B>, zero: (a: A) => L): Either<L, B>
  filterOrElseL(p: Predicate<A>, zero: (a: A) => L): Either<L, A>
  filterOrElseL(p: Predicate<A>, zero: (a: A) => L): Either<L, A> {
    return p(this.value) ? this : left(zero(this.value))
  }
  refineOrElse<B extends A>(p: Refinement<A, B>, zero: L): Either<L, B> {
    return p(this.value) ? (this as any) : left(zero)
  }
  refineOrElseL<B extends A>(p: Refinement<A, B>, zero: (a: A) => L): Either<L, B> {
    return p(this.value) ? (this as any) : left(zero(this.value))
  }
}

export const left = <L, A>(l: L): Either<L, A> => {
  return new Left(l)
}

export const right = <L, A>(a: A): Either<L, A> => {
  return new Right<L, A>(a)
}
