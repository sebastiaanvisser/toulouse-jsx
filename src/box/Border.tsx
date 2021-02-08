import { Color } from '@/styling/Color'
import { px } from '@/styling/Css'
import { Palette } from '@/styling/Palette'
import { Rgba } from '@/styling/Rgba'
import css from 'styled-jsx/css'

export interface Props {
  glow?: boolean | Color
  outline?: boolean | Color
  border?: boolean | Color
  elevate?: boolean
  shadow?: boolean
  inset?: boolean
}

// ----------------------------------------------------------------------------

export const boxShadow = (clr: Rgba, blur: number, spread = 0, dx = 0, dy = 0) =>
  [px(dx), px(dy), px(blur), px(spread), clr.toString()].join(' ')

export const insetShadow = (c: Rgba, blur: number, spread = 0, dx = 0, dy = 0) =>
  `inset ${boxShadow(c, blur, spread, dx, dy)}`

// ----------------------------------------------------------------------------

export function resolve(props: Props, palette: Palette) {
  const { glow, outline, border, elevate, shadow, inset } = props

  const { Black, Hover, Primary } = palette
  const prim = Primary().Bg
  const shadows: string[] = []

  if (inset)
    shadows.push(
      // insetShadow(Black.alpha(0.05), 2, 0, 1, 1),
      insetShadow(Black.alpha(0.2), 3, 0, 0, 1) //
    )

  if (shadow)
    shadows.push(
      boxShadow(Black.alpha(0.1), 10, 0, 0, 2),
      boxShadow(Black.alpha(0.05), 5, 0, 0, 2) //
    )

  if (elevate)
    shadows.push(
      boxShadow(Black.alpha(0.2), 30, 0, 0, 10),
      boxShadow(Black.alpha(0.1), 5, 0, 0, 2) //
    )

  if (border) shadows.push(boxShadow(Hover, 0, 1))

  if (outline) {
    const color = outline instanceof Color ? outline.get(palette) : prim
    shadows.push(boxShadow(color, 0, 2))
  }

  if (glow) {
    const color = glow instanceof Color ? glow.get(palette) : prim.alpha(0.3)
    shadows.push(boxShadow(color, 0, 4))
  }

  if (shadows.length === 0) return

  return css.resolve`
    box-shadow: ${shadows.join(',')};
  `
}
