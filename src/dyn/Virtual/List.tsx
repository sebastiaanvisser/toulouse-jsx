import { Box, BoxProps } from '@/box/Box'
import { Mode } from '@/dyn/Virtual/Container'
import { computeRegion } from '@/dyn/Virtual/Viewport'
import { Geom, Span } from '@/lib/Geometry'
import isEqual from 'lodash.isequal'
import React, { memo, ReactNode, useMemo, useRef } from 'react'

type Render<A> = (item: A, i: number, mode: Mode, visible: Span, element: Geom) => ReactNode

interface Props<A> extends BoxProps {
  measure: (index: number) => number
  render: Render<A>
  dir: 'h' | 'v'
  viewport: Geom // Pixels
  mode: Mode
  container: Geom
  margin?: number
  data: A[]
  contour?: boolean
}

export function VList<A>(props: Props<A>) {
  const {
    render,
    dir,
    viewport,
    measure,
    data,
    container,
    mode,
    margin = 0,
    contour,
    ...rest
  } = props

  const con = dir === 'h' ? container.horizontally : container.vertically
  const slice = dir === 'h' ? viewport.horizontally : viewport.vertically

  const stats = useMemo(
    () => computeRegion(con.start, slice, data.length, measure, margin), //
    [slice, con, data, measure],
  )

  const { region, measured, delta } = stats

  const side = dir === 'h' ? 'left' : 'top'
  const offset = slice.start - con.start + delta

  const dyn: BoxProps = {
    [side]: offset,
    [dir]: true,
  }

  const rows = region.iterate(n => {
    const geom =
      dir === 'v'
        ? Span.combine(container.horizontally, measured[n])
        : Span.combine(measured[n], container.vertically)

    const isect = geom.intersect(viewport) as Geom

    return (
      <Item
        n={n}
        key={n}
        dir={dir}
        data={data[n]}
        render={render}
        viewport={isect}
        visible={slice.intersect(measured[n])}
        mode={mode}
        geom={geom}
      />
    )
  })

  return (
    <>
      <Box rel {...dyn} className="virtual-list" {...rest}>
        {rows}
      </Box>
      {contour && <Box abs z outline {...viewport} clickthrough />}
    </>
  )
}

// export const VList = memo(Component, eqProps) as <A>(props: Props<A>) => JSX.Element

// function eqProps<A>(p: Props<A>, n: Props<A>) {
//   return isEqual(p, n)
// }

// ----------------------------------------------------------------------------

interface ItemProps<A> {
  n: number
  render: Render<A>
  viewport: Geom
  dir: 'h' | 'v'
  data: A
  visible: Span
  mode: Mode
  geom: Geom
}

function ItemComponent<A>(props: ItemProps<A>) {
  const { data, render, n, visible, geom } = props

  const mode = useRef<Mode>('shallow')
  mode.current = mode.current === 'full' ? 'full' : props.mode

  return <>{render(data, n, mode.current, visible, geom)}</>
}

const Item = memo(ItemComponent, eqItemProps) as <A>(props: ItemProps<A>) => JSX.Element

function eqItemProps<A>(p: ItemProps<A>, n: ItemProps<A>) {
  const eq =
    isEqual(p.visible, n.visible) && //
    isEqual(p.viewport, n.viewport) && //
    isEqual(p.geom, n.geom) &&
    p.data === n.data &&
    (p.mode === 'full' || p.mode === n.mode)

  return eq
}
