import { useParent } from '@/box/Box'
import { ColorLike, resolveColorLike, usePalette } from '@/box/Palette'
import { px } from '@/styling/Css'
import React from 'react'

export interface SepProps {
  dashed?: boolean | number
  size?: number
  pad?: number | true
  margin?: number | true
  fg?: ColorLike
}

export function Sep(props: SepProps) {
  const { fg, pad, dashed, size = 1, margin } = props
  const palette = usePalette({})

  const parent = useParent()
  const color = resolveColorLike(fg, palette) ?? palette.Hover

  const h = !!parent.h
  const p = pad === true ? 10 : pad ?? 0
  const m = margin === true ? 10 : margin ?? 0

  let gradient: string | undefined
  if (dashed) {
    const dash = typeof dashed === 'number' ? dashed : 5
    const d1 = px(dash)
    const d2 = px(2 * dash)
    const angle = h ? 180 : 90
    gradient = `repeating-linear-gradient(${angle}deg, ${color}, ${color} ${d1}, transparent ${d1}, transparent ${d2} )`
  }

  return (
    <div className={h ? 'h' : 'v'}>
      <style jsx>{`
        div {
          background: ${color};
          border-radius: ${size / 2}px;
        }
        .v {
          width: calc(100% - ${p * 2}px);
          height: ${size}px;
          margin: ${m - size / 2}px ${p}px ${m - size / 2}px ${p}px;
          background: ${gradient};
        }
        .h {
          width: ${size}px;
          min-height: 100%;
          max-height: 100%;
          margin: ${p}px ${m - size / 2}px ${p}px ${m - size / 2}px;
          background: ${gradient};
          border-radius: ${size / 2}px;
        }
      `}</style>
    </div>
  )
}
