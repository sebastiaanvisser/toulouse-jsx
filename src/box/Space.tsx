import { Sides, SidesDef } from '@/lib/Geometry'
import { optional, px, resolveMany } from '@/styling/Css'
import css from 'styled-jsx/css'
import * as Flexed from './Flexed'
import * as Label from './Label'
import * as Variant from './Variant'

export interface Props {
  pad?: SidesDef
  margin?: SidesDef
  spaced?: boolean | number
}

// ----------------------------------------------------------------------------

const paddingC = (padding: Sides) =>
  css.resolve`
    ${optional('padding', padding.render())}
  `

const marginC = (margin: Sides) =>
  css.resolve`
    ${optional('margin', margin.render())}
  `

const vSpacedC = (sp: number | true) =>
  css.resolve`
    & > :global(*:not(:last-child):not(hr)) {
      margin-bottom: ${px(sp === true ? 10 : sp)};
    }
  `

const hSpacedC = (sp: number | true) =>
  css.resolve`
    & > :global(*:not(:last-child):not(hr)) {
      margin-right: ${px(sp === true ? 10 : sp)};
    }
  `

export function resolve(props: Props & Flexed.Props & Label.Props & Variant.Props) {
  const { pad, margin, label, spaced, h } = props

  let p = new Sides(pad)
  if (label) p = p.add(Variant.padding(props))

  return resolveMany(
    paddingC(p),
    marginC(new Sides(margin)),
    spaced && (h ? hSpacedC(spaced) : vSpacedC(spaced)), //
  )
}
