import { Dimensions, geom, Rect, span, Span } from '@/lib/Geometry'

export function computeWorld(
  pad: Rect,
  data: Dimensions,
  colWidth: (col: number) => number,
  rowHeight: (row: number) => number,
) {
  let w = pad.left
  let h = pad.top
  for (let x = 0; x < data.width; x++) w += colWidth(x)
  for (let y = 0; y < data.height; y++) h += rowHeight(y)
  return geom(0, 0, w + pad.right, h + pad.bottom)
}

export function computeRegion(
  offset: number,
  viewport: Span,
  count: number,
  measure: (pos: number) => number,
  margin: number,
) {
  const { start, size } = viewport

  let x = 0
  let n = 0
  let delta = NaN
  const measured: Span[] = []

  let i = offset + margin
  while (i < start + size && x + n < count) {
    const dim = measure(x + n)
    if (i + dim > start) {
      if (isNaN(delta)) delta = i - start - margin
      n++
    } else {
      x++
    }

    measured.push(span(i, dim))

    i += dim
  }

  const region = span(x, n)

  return {
    region,
    delta,
    measured, //
  }
}
