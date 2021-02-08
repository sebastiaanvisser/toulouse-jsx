import { resolveMany } from '@/styling/Css'
import css from 'styled-jsx/css'

export interface Props {
  // Direction
  h?: boolean
  v?: boolean

  // Sizing
  grow?: boolean | number
  shrink?: boolean

  // Justify/align
  center?: boolean
  middle?: boolean
  end?: boolean
  foot?: boolean
  spread?: boolean
  wrap?: boolean

  scroll?: true
}

// ----------------------------------------------------------------------------

export const horizontalC = css.resolve`
  display: flex;
  flex-direction: row;
`

export const verticalC = css.resolve`
  display: flex;
  flex-direction: column;
`

const justifyCenterC = css.resolve`
  justify-content: center;
`

const alignCenterC = css.resolve`
  align-items: center;
`

const justifyEndC = css.resolve`
  justify-content: flex-end;
`

const alignEndC = css.resolve`
  align-items: flex-end;
`

const spreadC = css.resolve`
  justify-content: space-between;
`

const growC = (amount = 1) => css.resolve`
  flex-grow: ${amount};
  flex-shrink: unset;
`

const shrinkC = css.resolve`
  flex-shrink: 1;
  flex-grow: unset;
`

const wrapC = css.resolve`
  flex-wrap: wrap;
`

const scrollC = css.resolve`
  overflow: auto;
`

export function resolve(props: Props) {
  const {
    h,
    v,
    shrink,
    grow,

    center,
    middle,
    end,
    foot,
    spread,
    wrap,
    scroll,
  } = props

  const isFlex = !!(h || v)

  const foo = resolveMany(
    h && horizontalC,
    v && verticalC,
    isFlex && center && (h ? justifyCenterC : alignCenterC),
    isFlex && middle && (v ? justifyCenterC : alignCenterC),
    isFlex && end && (h ? justifyEndC : alignEndC),
    isFlex && foot && (v ? justifyEndC : alignEndC),
    isFlex && spread && spreadC,
    isFlex && wrap && wrapC,
    grow ? growC(grow === true ? 1 : grow) : undefined,
    shrink && shrinkC,
    scroll && scrollC,
  )

  return foo
}
