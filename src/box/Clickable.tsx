import { ColorProps, resolveColorLike } from '@/box/Palette'
import { resolveMany } from '@/styling/Css'
import { Palette } from '@/styling/Palette'
import { Rgba } from '@/styling/Rgba'
import css from 'styled-jsx/css'

export interface Props {
  button?: boolean
  disabled?: boolean
  clickthrough?: boolean
  noevents?: boolean
  noselect?: boolean
}

// ----------------------------------------------------------------------------

const buttonC = (hover: Rgba, active: Rgba) => css.resolve`
  user-select: none;
  cursor: pointer;
  align-self: start;

  :hover:not(:active) {
    transition: background-color 200ms ease;
    background-color: ${hover};
  }

  :active {
    transition: background-color 200ms ease;
    background-color: ${active};
  }

  :hover:not(:active) :global(svg > g) {
    transform: scale(1.2) translate(15px, 15px);
  }
`

const disabledC = css.resolve`
  pointer-events: none;
  user-select: none;
  cursor: not-allowed;

  * > :global(*) {
    opacity: 0.35;
  }
`

const clickthroughC = css.resolve`
  pointer-events: none;

  * > :global(*) {
    pointer-events: auto;
  }
`

const noselectC = css.resolve`
  user-select: none;
`

const noeventsC = css.resolve`
  pointer-events: none;
`

// ----------------------------------------------------------------------------

export function resolve(props: Props & ColorProps, p: Palette) {
  const { button, disabled, clickthrough, noselect, noevents, bg, fg } = props

  let hover = p.Hover
  let active = p.Hover.mix(p.Bg)

  if (!bg && fg) {
    hover = resolveColorLike(fg, p)?.alpha(0.1) ?? hover
    active = resolveColorLike(fg, p)?.alpha(0.05) ?? active
  }

  if (bg) {
    hover = resolveColorLike(bg, p)?.add(-10) ?? hover
    active = resolveColorLike(bg, p)?.add(-5) ?? active
  }

  return resolveMany(
    button && buttonC(hover, active),
    disabled && disabledC,
    clickthrough && clickthroughC,
    noselect && noselectC,
    noevents && noeventsC,
  )
}
