import { plugin as TeardownPlugin } from '@tapjs/after'
import { TapPlugin, TestBase } from '@tapjs/core'
import { at, CallSiteLike, captureString } from '@tapjs/stack'

/**
 * An object type containing all of the methods of the object
 * type provided
 */
export type MethodsObject<O extends object> = {
  [k in keyof O]: O[k] extends (...a: any[]) => any ? k : never
}

/**
 * The union type of all methods in an object
 */
export type Methods<O extends object> =
  MethodsObject<O>[keyof MethodsObject<O>]

/**
 * Base type of result objects generated by
 * {@link @tapjs/intercept!Interceptor#capture}
 *
 * @typeParam F - the function that was captured
 */
export interface CaptureResultBase<F extends (...a: any[]) => any> {
  args: OverloadParams<F>
  at?: CallSiteLike
  stack?: string
}

/**
 * Results of {@link @tapjs/intercept!Interceptor#capture} where function
 * returned
 *
 * @typeParam F - the function that was captured
 */
export interface CaptureResultReturned<F extends (...a: any[]) => any>
  extends CaptureResultBase<F> {
  returned: OverloadReturnType<F>
  threw: false
}

/**
 * Results of {@link @tapjs/intercept!Interceptor#capture} where function
 * threw
 *
 * @typeParam F - the function that was captured
 */
export interface CaptureResultThrew<F extends (...a: any[]) => any>
  extends CaptureResultBase<F> {
  threw: true
}

/**
 * Results of {@link @tapjs/intercept!Interceptor#capture}
 *
 * @typeParam F - the function that was captured
 */
export type CaptureResult<F extends (...a: any[]) => any> =
  | CaptureResultReturned<F>
  | CaptureResultThrew<F>
  | CaptureResultBase<F>

/**
 * like ReturnType<F>, but a union of the return types of up to 10 overloads
 *
 * @typeParam F - the (possibly overloaded) function
 */
export type OverloadReturnType<F> = TupleUnion<
  UnarrayArray<FilterTupleUnknown<ORTuple<F>>>
>

/**
 * Get member type from array/tuple type
 */
export type Unarray<A> = A extends (infer V)[] ? V : A

/**
 * Get tuple of member types from array of array types
 */
export type UnarrayArray<L> = L extends [infer H, ...infer T]
  ? H extends unknown[]
    ? T extends unknown[][]
      ? [Unarray<H>, ...UnarrayArray<T>]
      : [Unarray<H>]
    : true
  : L

/**
 * Get overloaded return values as tuple of arrays
 */
export type ORTuple<F> = F extends {
  (...a: any[]): infer A0
  (...a: any[]): infer A1
  (...a: any[]): infer A2
  (...a: any[]): infer A3
  (...a: any[]): infer A4
  (...a: any[]): infer A5
  (...a: any[]): infer A6
  (...a: any[]): infer A7
  (...a: any[]): infer A8
  (...a: any[]): infer A9
}
  ? [A0[], A1[], A2[], A3[], A4[], A5[], A6[], A7[], A8[], A9[]]
  : never

/**
 * like Parameters<F>, but a union of parameter sets for up to 10 overloads
 */
export type OverloadParams<F> = TupleUnion<
  FilterUnknown<OverloadParamsTuple<F>>
>

/**
 * Get overloaded Parameters types as 10-tuple. When the function has less
 * than 10 overloaded signatures, the remaining param sets will be set to
 * `unknown`.
 *
 * @internal
 */
export type OverloadParamsTuple<F> = F extends {
  (...a: infer A0): any
  (...a: infer A1): any
  (...a: infer A2): any
  (...a: infer A3): any
  (...a: infer A4): any
  (...a: infer A5): any
  (...a: infer A6): any
  (...a: infer A7): any
  (...a: infer A8): any
  (...a: infer A9): any
}
  ? [A0, A1, A2, A3, A4, A5, A6, A7, A8, A9]
  : never

/**
 * Convert all `unknown[]` types in an array type to `never`
 */
export type NeverUnknown<T extends unknown[]> = unknown[] extends T
  ? (T extends {}[] ? true : false) extends true
    ? any[]
    : never
  : T

/**
 * Convert all `unknown[]` types in an array type to `never[]`
 */
export type NeverTupleUnknown<T extends unknown[]> =
  unknown[] extends T
    ? (T extends {}[] ? true : false) extends true
      ? any[]
      : never[]
    : T

/**
 * Filter out `unknown[]` types from a tuple by converting them to `never`
 */
export type FilterUnknown<L> = L extends [infer H, ...infer T]
  ? H extends unknown[]
    ? T extends unknown[][]
      ? [NeverUnknown<H>, ...FilterUnknown<T>]
      : [NeverUnknown<H>]
    : FilterUnknown<T>
  : L

/**
 * Filter out `unknown[]` types from a tuple by converting them to `never[]`
 */
export type FilterTupleUnknown<L> = L extends [infer H, ...infer T]
  ? H extends unknown[]
    ? T extends unknown[][]
      ? [NeverTupleUnknown<H>, ...FilterTupleUnknown<T>]
      : [NeverTupleUnknown<H>]
    : FilterTupleUnknown<T>
  : L

/**
 * Create a union from a tuple type
 */
export type TupleUnion<L> = L extends [infer H, ...infer T]
  ? H | TupleUnion<T>
  : never

/**
 * The method returned by {@link @tapjs/intercept!Interceptor#capture},
 * which returns the {@link @tapjs/intercept!CaptureResult} array when
 * called, and has methods to restore or get args, and exposes the list of
 * calls
 */
export type CaptureResultsMethod<
  T extends {},
  M extends Methods<T>,
  F = T[M]
> = (() => CaptureResult<
  F extends (...a: any[]) => any ? F : (...a: any[]) => any
>[]) & {
  restore: () => void
  calls: CaptureResult<
    F extends (...a: any[]) => any ? F : (...a: any[]) => any
  >[]
  args: () => OverloadParams<
    F extends { (...a: any[]): any } ? F : (...a: any[]) => any
  >[]
}

/**
 * Base class for objects created by
 * {@link @tapjs/intercept!Interceptor#intercept}
 */
export interface InterceptResultBase {
  at?: CallSiteLike
  stack?: string
  value: any
  success: boolean
  threw: boolean
}

/**
 * Result from {@link @tapjs/intercept!Interceptor#intercept} for gets
 */
export interface InterceptResultGet extends InterceptResultBase {
  type: 'get'
}

/**
 * Result from {@link @tapjs/intercept!Interceptor#intercept} for sets
 */
export interface InterceptResultSet extends InterceptResultBase {
  type: 'set'
}

/**
 * Result from {@link @tapjs/intercept!Interceptor#intercept}
 */
export type InterceptResult = InterceptResultGet | InterceptResultSet

/**
 * Method returned by {@link @tapjs/intercept!Interceptor#intercept}
 */
export type InterceptResultsMethod = (() => InterceptResult[]) & {
  restore: () => void
}

/**
 * Implementation class providing the
 * {@link @tapjs/intercept!Interceptor#intercept},
 * {@link @tapjs/intercept!Interceptor#capture}, and
 * {@link @tapjs/intercept!Interceptor#captureFn} methods.
 */
export class Interceptor {
  #t: TestBase

  constructor(t: TestBase) {
    this.#t = t
  }

  /**
   * Intercept and track object property sets and gets.
   *
   * If a PropertyDescriptor is set, then it will be used as the replacement
   * value. Otherwise, the original descriptor will be used.
   *
   * If the `strictMode` param is set, then attempts to write to read-only
   * properties will throw an error.
   */
  intercept<T extends object>(
    obj: T,
    prop: keyof T,
    desc?: PropertyDescriptor,
    strictMode: boolean = true
  ): InterceptResultsMethod {
    const resList: InterceptResult[] = []

    // find the original property descriptor, if it exists.
    let orig = Object.getOwnPropertyDescriptor(obj, prop)
    let src = obj
    while (!orig && src) {
      if (!(orig = Object.getOwnPropertyDescriptor(src, prop))) {
        src = Object.getPrototypeOf(src)
      }
    }

    let restore: () => void

    // if we have an original, then that serves as the basis for
    // the value, if desc isn't set. If we don't have a desc, and
    // don't have an orig, then it's just { value: undefined }
    if (!orig || src !== obj) {
      // either it came from the proto chain, or wasn't found.
      // either way, we're assigning here.
      restore = () => {
        delete obj[prop]
        restore = () => {}
      }
    } else {
      // have an original, on the object itself
      restore = () => {
        Object.defineProperty(obj, prop, orig as PropertyDescriptor)
        restore = () => {}
      }
    }

    if (this.#t.t?.pluginLoaded(TeardownPlugin)) {
      this.#t.t?.teardown(restore)
    }

    if (!desc) {
      desc = orig
        ? { ...orig }
        : {
            value: undefined,
            configurable: true,
            writable: true,
            enumerable: true,
          }
    }

    const base = desc as PropertyDescriptor
    const interceptor: PropertyDescriptor & {
      get: () => any
      set: (v: any) => void
    } = {
      enumerable: desc.enumerable,
      configurable: true,

      get() {
        // return the current value, and track
        let threw = true
        let success = false
        let value: any
        try {
          value = base.get ? base.get.call(obj) : base.value
          threw = false
          success = true
        } finally {
          resList.push({
            type: 'get',
            at: at(interceptor.get),
            stack: captureString(interceptor.get),
            value,
            threw,
            success,
          })
          if (!threw) return value
        }
      },

      set(value: any) {
        let threw = true
        let success = false
        try {
          if (base.set) {
            base.set.call(obj, value)
            success = true
          } else if (base.get) {
            if (strictMode) {
              const er = new TypeError(
                `Cannot set property '${String(
                  prop
                )}' of ${Object.prototype.toString.call(
                  obj
                )} which has only a getter`
              )
              Error.captureStackTrace(er, interceptor.set)
              throw er
            }
          } else {
            if (base.writable) {
              base.value = value
              success = true
            } else {
              if (strictMode) {
                const er = new TypeError(
                  `Cannot assign to read only property '${String(
                    prop
                  )}' of ${Object.prototype.toString.call(obj)}`
                )
                Error.captureStackTrace(er, interceptor.set)
                throw er
              }
            }
          }
          threw = false
        } finally {
          resList.push({
            type: 'set',
            at: at(interceptor.set),
            stack: captureString(interceptor.set),
            value,
            success,
            threw,
          })
        }
      },
    }

    Object.defineProperty(obj, prop, interceptor)
    return Object.assign(
      () => {
        const r = resList.slice()
        resList.length = 0
        return r
      },
      { restore: () => restore() }
    )
  }

  /**
   * Intercept calls to a method to track the arguments, call site,
   * and return/throw status, and replace the implementation.
   *
   * By default, the method is set to a no-op. To retain the method behavior,
   * pass the current value of the method as the third argument.  For example:
   *
   * ```
   * const results = t.capture(obj, 'foo', obj.foo)
   * ```
   *
   * Automatically restores at `t.teardown()` if the `@tapjs/after`
   * plugin is not disabled.  Otherwise, it is important to call the
   * `restore()` method on the returned function when you are done capturing.
   */
  capture<T extends {}, M extends Methods<T>>(
    obj: T,
    method: M,
    impl: (...a: any[]) => any = (..._: any[]) => {}
  ): CaptureResultsMethod<T, M> {
    const prop = Object.getOwnPropertyDescriptor(obj, method)

    // if we don't have a prop we can restore by just deleting
    // otherwise, we restore by putting it back as it was
    let restore = prop
      ? () => {
          Object.defineProperty(obj, method, prop)
          restore = () => {}
        }
      : () => {
          delete obj[method]
          restore = () => {}
        }

    if (this.#t.t?.pluginLoaded(TeardownPlugin)) {
      this.#t.t?.teardown(restore)
    }

    const fn = Object.assign(this.captureFn(impl), {
      restore: () => restore(),
    })

    Object.defineProperty(obj, method, {
      enumerable: prop ? prop.enumerable : true,
      writable: true,
      value: fn,
      configurable: true,
    })

    return Object.assign(
      () => {
        const r = fn.calls.slice()
        fn.calls.length = 0
        return r
      },
      {
        restore: () => restore(),
        calls: fn.calls,
        args: () => {
          const r = fn.calls.slice()
          fn.calls.length = 0
          return r.map(({ args }) => args) as OverloadParams<
            T[M] extends { (...a: any[]): any }
              ? T[M]
              : (...a: any[]) => any
          >[]
        },
      }
    )
  }

  /**
   * Just wrap the function and return it.  Does not have any
   * logic to restore, since it's not actually modifying anything.
   * The results hang off the function as the 'calls' property.
   *
   * The added `fn.args()` method will return an array of the arguments
   * passed to each call since the last time it was inspected.
   */
  captureFn<F extends (this: any, ...a: any[]) => any>(
    original: F
  ): ((...a: any[]) => any) & {
    calls: CaptureResult<F>[]
    args: () => OverloadParams<F>[]
  } {
    const calls: CaptureResult<F>[] = []
    const args = () => calls.map(({ args }) => args)
    return Object.assign(
      function wrapped(this: any, ...args: OverloadParams<F>) {
        const res: CaptureResultBase<F> = {
          args,
          at: at(wrapped),
          stack: captureString(wrapped),
        }
        try {
          const returned = res as CaptureResultReturned<F>
          returned.returned = original.call(this, ...args)
          returned.threw = false
          calls.push(res)
          return returned.returned
        } finally {
          if ((res as CaptureResultReturned<F>).threw !== false) {
            ;(res as CaptureResultThrew<F>).threw = true
            calls.push(res)
          }
        }
      },
      { calls, args }
    )
  }
}

/**
 * plugin method that instantiates an {@link @tapjs/intercept!Interceptor}
 */
export const plugin: TapPlugin<Interceptor> = t => new Interceptor(t)
