import { Fragment, ReactNode } from 'react'

export type Falsy = false | null | undefined

export const px = (p: number) => `${p}px`
export const pct = (p: number) => `${p}%`
export const commas = (...xs: string[]) => xs.join()

// ----------------------------------------------------------------------------

export interface JsxResolved {
  className: string
  styles: ReactNode
}

export type Classy1 = string | string[] | JsxResolved | false | undefined
export type Classy = string | Classy1[] | JsxResolved | false | undefined

export const cx = (...classes: Classy[]): string =>
  classes
    .flatMap(c => {
      if (c === undefined) return []
      if (typeof c === 'boolean') return []
      if (typeof c === 'string') return c.length > 0 ? [c] : []
      if (c instanceof Array) return [cx(...c)]
      if ('className' in c) return [c.className]
      return c
    })
    .join(' ')

// ----------------------------------------------------------------------------

export type Numeric = number | string

export const optional = (prefix: string, val: string | undefined): string | undefined =>
  val ? `${prefix}: ${val};` : ''

export const numeric = (prefix: string, val: Numeric | undefined): string | undefined =>
  optional(prefix, typeof val === 'number' ? px(val) : val)

// ----------------------------------------------------------------------------

export function resolveMany(...resolved: (JsxResolved | Falsy | 0)[]) {
  const filtered = resolved.filter((a): a is JsxResolved => !!a)
  const classNames = filtered.map(c => c.className)
  const styles = filtered.map(c => <Fragment key={c.className}>{c.styles}</Fragment>)
  const className = cx(classNames)
  return {
    className,
    styles: styles as ReactNode,
  }
}
