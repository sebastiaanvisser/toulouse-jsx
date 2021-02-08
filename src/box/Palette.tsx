import { Color, Fg } from '@/styling/Color'
import { optional, resolveMany } from '@/styling/Css'
import { Arctic, Palette } from '@/styling/Palette'
import { Rgba } from '@/styling/Rgba'
import { createContext, ReactNode, useContext } from 'react'
import css from 'styled-jsx/css'
import { Box } from './Box'

export const PaletteContext = createContext<Palette>(Arctic)

export interface ColorProps {
  bg?: ColorLike
  fg?: ColorLike
}

export interface Props extends ColorProps {
  palette?: Palette | ((palette: Palette) => Palette)
}

export function Theme({ children, palette }: { palette: Palette; children: ReactNode }) {
  return (
    <PaletteContext.Provider value={palette}>
      <Box fg={Fg}>{children}</Box>
    </PaletteContext.Provider>
  )
}

// ----------------------------------------------------------------------------

export const colorsC = (bg?: Rgba, fg?: Rgba) =>
  css.resolve`
    .box {
      ${optional('background-color', bg?.toString())};
      ${optional('color', fg?.toString())};
      ${optional('fill', fg?.toString())};
    }
  `

// ----------------------------------------------------------------------------

export type ColorLike = Rgba | Color | boolean | undefined | string

export function resolveColorLike(c: ColorLike, palette: Palette): Rgba | undefined {
  if (typeof c === 'string') return Rgba.fromHex(c)
  if (c instanceof Rgba) return c
  if (c instanceof Color) return c.get(palette)
  return
}

export function usePalette({ palette }: Props): Palette {
  const current = useContext(PaletteContext)
  if (palette instanceof Function) return palette(current)
  return palette ?? current
}

export function resolve(props: ColorProps, palette: Palette) {
  const bg = props.bg === true ? palette.Bg : resolveColorLike(props.bg, palette)
  const fg = props.fg === true ? palette.Fg : resolveColorLike(props.fg, palette)
  return resolveMany((bg || fg) && colorsC(bg, fg))
}
