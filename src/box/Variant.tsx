import { Sides } from '@/lib/Geometry'
import { resolveMany } from '@/styling/Css'
import css from 'styled-jsx/css'

export const BaseFont = "'Ubuntu', 'Open Sans', 'Helvetica', sans-serif"
export const MonoFont = "'Ubuntu Mono', 'Courier', monospace"

export interface Props {
  regular?: boolean
  smallcaps?: boolean
  mono?: boolean
  subtle?: boolean
  bold?: boolean
}

// ----------------------------------------------------------------------------

const regularC = css.resolve`
  .box {
    font-family: ${BaseFont};
    font-size: 14px;
    line-height: 20px;
    -webkit-font-smoothing: antialiased;
  }
`

const smallcapsC = css.resolve`
  .box {
    font-family: ${BaseFont};
    font-weight: 500;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`

const monoC = css.resolve`
  .box {
    font-family: ${MonoFont};
    font-size: 14px;
    line-height: 15px;
    white-space: pre-wrap;
  }
`

const subtleC = css.resolve`
  .box {
    font-family: ${BaseFont};
    font-size: 11px;
    line-height: 14px;
    opacity: 0.5;
  }
`

const boldC = css.resolve`
  .box {
    font-weight: 500;
  }
`

// ----------------------------------------------------------------------------

export function padding(props: Props): Sides {
  const { regular, smallcaps, mono, subtle } = props

  if (regular) return new Sides({ v: 5, h: 10 })
  if (smallcaps) return new Sides({ v: 5, h: 10 })
  if (mono) return new Sides({ v: 7.5, h: 10 })
  if (subtle) return new Sides({ v: 8, h: 10 })

  return new Sides({ v: 5, h: 10 })
}

export function resolve(props: Props) {
  const { regular, smallcaps, mono, subtle, bold } = props

  return resolveMany(
    regular && regularC,
    smallcaps && smallcapsC,
    mono && monoC,
    subtle && subtleC,
    bold && boldC,
  )
}

// regularC.self(smallC).style({
//   fontSize: px(11),
//   lineHeight: px(14),
//   padding: '3px 8px'
// })

// monoC.self(smallC).style({
//   fontSize: px(12),
//   lineHeight: px(13),
//   padding: '3px 8px'
// })

// smallcapsC.self(smallC).style({
//   fontSize: px(10),
//   padding: '4.5px 8px 3.5px 8px'
// })

// subtleC.self(smallC).style({
//   fontSize: px(10),
//   padding: '4px 8px 2px 8px'
// })
