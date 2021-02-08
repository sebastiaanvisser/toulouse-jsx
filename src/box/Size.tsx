import { Geom } from '@/lib/Geometry'
import { Numeric, numeric, resolveMany } from '@/styling/Css'
import css from 'styled-jsx/css'

export interface ElementGeom {
  left?: Numeric
  top?: Numeric
  right?: Numeric
  bottom?: Numeric
  width?: Numeric
  height?: Numeric
}

export interface Props extends ElementGeom {
  geom?: Geom
  abs?: boolean
  rel?: boolean
  sticky?: boolean
  clip?: boolean
  z?: boolean | number
  fit?: boolean | string | number
}

// ----------------------------------------------------------------------------

const side = (prefix: keyof ElementGeom, geom: ElementGeom): string | undefined => {
  return numeric(prefix, geom[prefix])
}

const positionC = (geom: ElementGeom) =>
  css.resolve`
    ${side('left', geom)};
    ${side('top', geom)};
    ${side('width', geom)};
    ${side('height', geom)};
    ${side('right', geom)};
    ${side('bottom', geom)};
  `

const absC = css.resolve`
  position: absolute;
`

const relC = css.resolve`
  position: relative;
`

const stickyC = css.resolve`
  position: sticky;
`

const fitC = (m: number | string | undefined) =>
  css.resolve`
    position: absolute;
    ${numeric('left', m ?? 0)};
    ${numeric('top', m ?? 0)};
    ${numeric('right', m ?? 0)};
    ${numeric('bottom', m ?? 0)};
  `

const clipC = css.resolve`
  overflow: hidden;
`

const zC = (z: number) =>
  css.resolve`
    z-index: ${z};
  `

// ----------------------------------------------------------------------------

export function resolve(props: Props) {
  const { abs, rel, sticky, fit, clip, z } = props

  return resolveMany(
    positionC(props),
    props.geom && positionC(props.geom),
    abs && absC,
    rel && relC,
    sticky && stickyC,
    fit ? fitC(fit === true ? undefined : fit) : undefined,
    clip && clipC,
    z ? zC(z === true ? 1 : z) : undefined,
  )
}
