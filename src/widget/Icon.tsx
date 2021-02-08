import { Box, BoxProps } from '@/box/Box'
import { Unit } from '@/box/Unit'
import * as S from '@/icon/Shape'
import { ShapeSvg } from '@/icon/Shape'
import { Cache } from '@/lib/Cache'
import { resolveMany } from '@/styling/Css'
import { ReactNode } from 'react'
import css from 'styled-jsx/css'

const cache = new Cache<ReactNode>()

// ----------------------------------------------------------------------------

interface Props extends BoxProps {
  icon: S.Icon
  zoom?: number
  rotate?: number
}

export function Icon(props: Props) {
  const { icon, zoom = 1, rotate = 0, ...rest } = props

  let svg = cache.with(icon.name, () => (
    <ShapeSvg shape={icon.shape()} width={Unit} height={Unit} />
  ))

  const size = Unit * zoom
  const { className, styles } = resolveMany(
    iconC,
    // (zoom !== 1 || rotate !== 0) &&
    transC(zoom, rotate),
  )

  return (
    <Box {...rest} width={size} height={size} cx={className}>
      {svg}
      {styles}
    </Box>
  )
}

// ----------------------------------------------------------------------------

export const iconC = css.resolve`
  flex-shrink: 0;
  align-self: flex-start;
  stroke-width: 0;

  & > :global(svg) {
    transition: transform 250ms ease;
  }

  & > :global(svg),
  & > :global(svg > g) {
    transform-origin: 15px 15px;
  }
`

export const transC = (zoom: number, rotate: number) => css.resolve`
  & > :global(svg) {
    transform: translate(-15px, -15px) scale(${zoom}) translate(15px, 15px) rotate(${rotate}deg);
  }
`
