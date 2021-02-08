import { List } from 'immutable'
import { Iso } from './Iso'

export class Edit<O, I> {
  constructor(
    readonly get: I,
    readonly set: (i: I) => O, //
  ) {}

  setting(i: I): Edit<O, O> {
    return Edit.Id(this.set(i))
  }

  modify(f: (v: I) => I): O {
    return this.set(f(this.get))
  }

  modifying(f: (v: I) => I): Edit<O, O> {
    return Edit.Id(this.modify(f))
  }

  modifyWith<A>(f: (v: I) => [I, A]): [O, A] {
    const [i, a] = f(this.get)
    return [this.set(i), a]
  }

  iso<K>(iso: Iso<I, K>): Edit<O, K> {
    return edit<O, K>(iso.fw(this.get), k => this.set(iso.bw(k)))
  }

  zoom<K>(f: Lens<I, K>): Edit<O, K> {
    return edit<O, K>(f(this.get).get, k => this.set(f(this.get).set(k)))
  }

  prop<P extends keyof I>(p: P): Edit<O, I[P]> {
    return edit<O, I[P]>(this.get[p], ip =>
      this.modify(i => {
        if ('copy' in i) {
          const copy = (i as any).copy()
          copy[p] = ip
          return copy
        }
        return { ...i, [p]: ip }
      }),
    )
  }

  at<E>(this: Edit<O, List<E>>, ix: number): Edit<O, E | undefined> {
    return edit<O, E | undefined>(this.get.get(ix), e => this.modify(i => (e ? i.set(ix, e) : i)))
  }

  first<E>(this: Edit<O, List<E>>): Edit<O, E | undefined> {
    return this.at(0)
  }

  last<E>(this: Edit<O, List<E>>): Edit<O, E | undefined> {
    return this.at(this.get.size - 1)
  }

  find<B>(this: Edit<O, List<B>>, pred: (b: B) => boolean): Edit<O, B> {
    return edit<O, B>(this.get.find(pred) as B, b =>
      this.modify(i => i.map(c => (pred(c) ? b : c))),
    )
  }

  pop<B>(this: Edit<O, List<B>>): O {
    return this.modify(xs => xs.pop())
  }

  push<B>(this: Edit<O, List<B>>, x: B): O {
    return this.modify(xs => xs.push(x))
  }

  assume<X>(this: Edit<O, X | undefined>): Edit<O, X> {
    return this as Edit<O, X>
  }

  or<X>(this: Edit<O, X | undefined>, x: X): Edit<O, X> {
    return edit<O, X>(this.get ?? x, this.set)
  }

  toggle(this: Edit<O, boolean>): O {
    return this.modify(b => !b)
  }

  mul(this: Edit<O, number>, v: number) {
    return this.modify(c => c * v)
  }

  add(this: Edit<O, number>, v: number) {
    return this.modify(c => c + v)
  }

  static packL = <O, U>(
    obj: { [P in keyof U]: (f: Edit<O, O>) => Edit<O, U[P]> },
  ): Lens<O, U> => o => {
    const id = Edit.Id(o)
    const out = {} as U
    for (let p in obj) out[p] = obj[p](id).get
    return edit<O, U>(out, u => {
      for (let p in obj) o = obj[p](Edit.Id(o)).set(u[p])
      return o
    })
  }

  static Id = <O>(o: O): Edit<O, O> => edit(o, o => o)
}

export const editing = <O>(o: O): Edit<O, O> => Edit.Id(o)

export const edit = <O, I>(get: I, set: (i: I) => O) => new Edit(get, set)

// ----------------------------------------------------------------------------

export type Lens<O, I> = (o: O) => Edit<O, I>

export const idL = <O>(): Lens<O, O> => o => Edit.Id(o)

export const propL = <O, P extends keyof O>(p: P): Lens<O, O[P]> => o => editing(o).prop(p)

// ----------------------------------------------------------------------------

export class Modify<O, I> {
  constructor(
    readonly modify: (f: (v: I) => I) => O, //
  ) {}

  set(v: I): O {
    return this.modify(() => v)
  }

  prop<P extends keyof I>(p: P): Modify<O, I[P]> {
    return new Modify<O, I[P]>(f => this.modify(i => ({ ...i, [p]: f(i[p]) })))
  }

  static Id = <O>(o: O): Modify<O, O> => new Modify(f => f(o))
}
