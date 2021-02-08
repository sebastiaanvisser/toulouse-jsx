// import { className, cx, px } from '@/styling'
// import { smallC } from './Small'

import { px, resolveMany } from '@/styling/Css'
import css from 'styled-jsx/css'

export interface Props {
  sharp?: boolean
  blunt?: boolean
  rounded?: boolean
  round?: boolean
}

const br = (r: number) => css.resolve`
  .box {
    border-radius: ${px(r)};
  }
`

export function resolve(props: Props) {
  const { sharp, blunt, rounded, round } = props

  return resolveMany(
    sharp && br(0),
    blunt && br(3), // small=3
    rounded && br(8), // small=5
    round && br(15), // small=8
  )
}
