import { Dimensions, dimensions, geom, Geom, Rect, rect } from '@/lib/Geometry'
import { useStateDeepEquals, useWindowEvent } from '@/lib/Hooks'
import React, { createContext, ReactElement, ReactNode, useContext } from 'react'

// ----------------------------------------------------------------------------

export interface AttachProps {
  target: HTMLElement
  geom: Geom
}

export const AttachCtx = createContext<AttachProps>({} as any)

export const useAttachment = () => useContext(AttachCtx)

// ----------------------------------------------------------------------------

interface Props {
  node: ReactNode
  children: ReactElement
}

export function Attach(props: Props) {
  const { children, node } = props

  const [ap, setAp] = useStateDeepEquals<AttachProps | undefined>(undefined)
  const target = ap?.target

  const ref = (target: HTMLElement) => {
    if (target && !ap) {
      const geom = measureAbsolute(target)
      setAp({ target, geom })
    }
  }

  useWindowEvent(
    'resize',
    () => {
      if (target) setAp({ target, geom: measureAbsolute(target) })
    },
    undefined,
    [target],
  )

  return (
    <>
      {React.cloneElement(children, { ref })}
      {ap && <AttachCtx.Provider value={ap}>{node}</AttachCtx.Provider>}
    </>
  )
}

// ----------------------------------------------------------------------------
// Measure helpers

export const measureDimensions = (el: HTMLElement): Dimensions =>
  dimensions(el.offsetWidth, el.offsetHeight)

export const measureRelative = (el: HTMLElement): Geom =>
  new Geom(el.offsetLeft, el.offsetTop, el.offsetWidth, el.offsetHeight)

export function measureAbsolute(el: HTMLElement): Geom {
  const zoom = parseFloat(el.style.zoom || '1')
  let left = el.offsetLeft * zoom
  let top = el.offsetTop * zoom
  let width = el.offsetWidth * zoom
  let height = el.offsetHeight * zoom

  let cur: HTMLElement = el
  while (cur instanceof HTMLElement && cur !== document.body) {
    const op = cur.offsetParent as HTMLElement

    // Collect all the zoom styles between us and the offset parent.
    let p: HTMLElement | null = cur.parentElement
    let zoom = 1
    while (p) {
      zoom *= parseFloat(p.style.zoom || '1')
      if (p === op) break
      p = p.parentElement
    }

    left *= zoom
    top *= zoom
    width *= zoom
    height *= zoom

    left += op.offsetLeft - op.scrollLeft
    top += op.offsetTop - op.scrollTop

    cur = op
  }

  return geom(left, top, width, height)
}

// ----------------------------------------------------------------------------

export function isAncestorOrSelf(el: HTMLElement, of: HTMLElement) {
  let cur: Element | null = el as Element
  while (cur) {
    if (cur === of) return true
    cur = cur.parentElement
  }
  return false
}

export function isDetached(el: HTMLElement) {
  let cur: Element | null = el as Element
  while (cur) {
    if (!cur.parentElement) {
      return cur !== document.documentElement
    }
    cur = cur.parentElement
  }
  return false
}

// ----------------------------------------------------------------------------

export function getMargin(el: HTMLElement): Rect {
  const style = window.getComputedStyle(el).margin
  return parseFourSided(style || '')
}

function parseFourSided(str: string): Rect {
  const pts = str
    .split(/\s+/)
    .map(x => parseInt(x))
    .filter(x => !isNaN(x))

  switch (pts.length) {
    case 1:
      return rect(pts[0], pts[0], pts[0], pts[0])
    case 2:
      return rect(pts[1], pts[0], pts[1], pts[0])
    case 3:
      return rect(pts[2], pts[0], pts[2], pts[1])
    case 4:
      return rect(pts[3], pts[0], pts[1], pts[2])
    default:
      return rect(0, 0, 0, 0)
  }
}
