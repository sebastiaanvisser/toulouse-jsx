import { Box, BoxProps } from '@/box/Box'
import { geom, Geom, position, Position, Sides, SidesDef } from '@/lib/Geometry'
import { useDebounce, useStateDeepEquals, useWindowEvent } from '@/lib/Hooks'
import { pct } from '@/styling/Css'
import isEqual from 'lodash.isequal'
import React, { memo, ReactNode, useLayoutEffect, useState } from 'react'
import css from 'styled-jsx/css'

// ----------------------------------------------------------------------------

export type Mode = 'full' | 'shallow'

export interface Props extends BoxProps {
  world: Geom
  children: (clipped: Geom, anchor: Position, mode: Mode) => ReactNode
}

function component(props: Props) {
  const { pad, world, children, ...rest } = props

  const [anchor] = useState(new Sides(pad).asRect.topLeft)
  const [elem, setElem] = useState<HTMLElement>()
  const [mode, setMode] = useState<'shallow' | 'full'>('full')
  const [container, setContainer] = useStateDeepEquals<Geom | undefined>(undefined)

  const snapshot = () => {
    if (elem) setContainer(snapshotViewport(elem))
  }

  useLayoutEffect(() => {
    requestAnimationFrame(snapshot)
  })

  const [fullMode] = useDebounce(() => setMode('full'), 250)

  const handleUpdate = () => {
    setMode('shallow')
    snapshot()
    fullMode()
  }

  const viewport = container && computeClippedVieport(container, world, pad)

  useWindowEvent('resize', handleUpdate)

  const { className, styles } = containerC

  return (
    <Box
      rel
      ref={el => setElem(el ?? undefined)}
      cx={className}
      width={pct(100)}
      height={pct(100)}
      onScroll={handleUpdate}
      {...rest}
    >
      <Box abs {...position(0, 0)} noevents {...world} />
      {viewport && children(viewport, anchor, mode)}
      {styles}
    </Box>
  )
}

export const Virtual = memo(component, eqProps) as (props: Props) => JSX.Element

function eqProps(a: Props, b: Props) {
  return (
    a.pad === b.pad && //
    isEqual(a.world, b.world)
  )
}

// ----------------------------------------------------------------------------

const computeClippedVieport = (viewport: Geom, dim: Geom, pad: SidesDef): Geom => {
  const { left, top, right, bottom } = new Sides(pad).asRect
  return geom(
    viewport.left + left,
    viewport.top + top,
    viewport.width - (left + right),
    viewport.height - (top + bottom),
  ).clip(geom(0, 0, dim.width, dim.height))
}

const snapshotViewport = (elem: HTMLElement) => {
  return geom(
    Math.max(0, elem.scrollLeft),
    Math.max(0, elem.scrollTop),
    elem.clientWidth,
    elem.clientHeight, //
  )
}

// ----------------------------------------------------------------------------

const containerC = css.resolve`
  minheight: 30px;
  overflow: auto;
`
