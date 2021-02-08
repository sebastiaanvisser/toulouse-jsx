import { isAncestorOrSelf, isDetached, measureDimensions, useAttachment } from '@/dyn/Attach'
import { Box, BoxProps } from '@/box/Box'
import { Unit } from '@/box/Unit'
import { useControlledVar, Value, Var } from '@/data/Var'
import * as Icons from '@/icon/Icons'
import * as S from '@/icon/Shape'
import { Dimensions, Geom, Position, Sides } from '@/lib/Geometry'
import { useDebounce, useDocumentEvent, useEvent, useStateDeepEquals } from '@/lib/Hooks'
import { range } from '@/lib/Range'
import { Bg } from '@/styling/Color'
import { cx, px, resolveMany } from '@/styling/Css'
import { Day } from '@/styling/Palette'
import isEqual from 'lodash.isequal'
import React, {
  CSSProperties,
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import * as ReactDOM from 'react-dom'
import css from 'styled-jsx/css'
import { v4 as uuid } from 'uuid'
import { Icon } from './Icon'

export type BalloonPosition = 'left' | 'top' | 'right' | 'bottom'

export interface Timing {
  debounceIn: number
  debounceOut: number
  durationIn: number
  durationOut: number
}

export const DefaultTiming: Timing = {
  debounceIn: 100,
  debounceOut: 200,
  durationIn: 150,
  durationOut: 150,
}

export const QuickHover: Timing = {
  debounceIn: 0,
  debounceOut: 0,
  durationIn: 50,
  durationOut: 50,
}

export const SlowReveal: Timing = {
  debounceIn: 500,
  debounceOut: 200,
  durationIn: 250,
  durationOut: 100,
}

export const ReallySlow: Timing = {
  debounceIn: 2000,
  debounceOut: 2000,
  durationIn: 2000,
  durationOut: 2000,
}

interface BalloonOnlyProps {
  behavior?: 'hover' | 'click' | 'mousedown' | 'mouseup'
  open?: Var<boolean> | Value<boolean>
  position?: BalloonPosition
  bias?: number
  hover?: boolean
  handle?: boolean | ReactNode
  id?: string
  margin?: Sides
  timing?: Timing
  registry?: BalloonRegistry | false
  width?: number | 'target' | ((width: number) => number)
  height?: number | 'target' | ((width: number) => number)
  transitions?: ('opacity' | 'transform')[]
}

export type BalloonProps = BalloonOnlyProps & Omit<BoxProps, 'width' | 'height'>

interface Context {
  target: HTMLElement
  targetGeom: Geom
}

// ----------------------------------------------------------------------------

export function Balloon(props: BalloonProps) {
  const { target, geom } = useAttachment()

  const stop: React.EventHandler<any> = ev => ev.stopPropagation()

  return (
    <div
      onMouseDown={stop}
      onMouseUp={stop}
      onClick={stop}
      onKeyDown={stop}
      onKeyPress={stop}
      onKeyUp={stop}
    >
      <Balloon_ {...props} target={target} targetGeom={geom} />
    </div>
  )
}

export const Tooltip = (props: BalloonProps = {}) => (
  <Balloon palette={Day} position="top" behavior="hover" h {...props} />
)

// ----------------------------------------------------------------------------

interface RegEntry {
  id: string
  ref: MutableRefObject<HTMLElement | undefined>
  close: () => void
}

export class BalloonRegistry {
  stack: RegEntry[] = []

  constructor() {
    if (typeof window !== 'undefined') document.addEventListener('keydown', this.onKeyDown, true)
  }

  top(): RegEntry | undefined {
    return this.stack[this.stack.length - 1]
  }

  register(id: string, ref: MutableRefObject<HTMLElement | undefined>, close: () => void) {
    this.stack.push({ id, ref, close })
  }

  unregister(id: string) {
    this.stack = this.stack.filter(entry => entry.id !== id)
  }

  private onKeyDown = (ev: KeyboardEvent) => {
    if (this.stack.length > 0 && ev.key === 'Escape') {
      this.close()
      ev.preventDefault()
      ev.stopPropagation()
    }
  }

  close = () => {
    this.stack.pop()?.close()
  }

  closeAll() {
    let cur
    do {
      cur = this.stack.pop()
      cur?.close()
    } while (cur)
  }
}

export const Balloons = new BalloonRegistry()

// ----------------------------------------------------------------------------

const balloonHandle = S.Icon.make('balloon-handle', Icons.handle)
const balloonHandleSmall = S.Icon.make('balloon-handle-small', () => Icons.handle().scale(2 / 3))

// ----------------------------------------------------------------------------

export function Balloon_(props: BalloonProps & Context) {
  const {
    timing = DefaultTiming,
    position,
    targetGeom,
    behavior,
    children,
    geom,
    target,
    open,
    bias,
    palette,
    margin,
    width,
    height,
    handle,
    registry = Balloons,
    transitions = ['opacity', 'transform'],
    ...rest
  } = props

  const [id] = useState(uuid)
  const [isVisible, setVisible] = useState(false)
  const [size, setSize] = useStateDeepEquals<Dimensions | undefined>(undefined)
  const [isOpen, setOpen] = useControlledVar(open, false)
  const elem = useRef<HTMLElement | undefined>()
  // const small = false // useResolvedeSmall(props)

  // ----------------------------------

  const { debounceIn, debounceOut, durationOut } = timing

  const openBalloon = useCallback(() => setOpen(true), [])
  const closeBalloon = useCallback(() => setOpen(false), [])
  const toggleBalloon = useCallback(() => setOpen(!isOpen), [])

  const [startHover, hoverRef] = useDebounce(() => {
    if (!isOpen) {
      setOpen(true)
      setVisible(false)
    }
  }, debounceIn)

  const [stopHover] = useDebounce(() => setOpen(false), debounceOut, hoverRef)

  const documentMouseDown = (ev: Event) => {
    // Not yet in open state.
    const evTarget = ev.target as HTMLElement
    if (!isOpen || !elem.current) return

    // Only close when we're the top box.
    // if (registry instanceof BalloonRegistry) {
    //   if (registry.top()?.ref !== elem) return
    // }

    // Allow interaction with the top balloon.
    if (registry instanceof BalloonRegistry) {
      const elem = registry.top()?.ref.current
      if (elem && isAncestorOrSelf(evTarget, elem)) return
    }

    // Don't close when clicking the current balloon.
    if (isAncestorOrSelf(evTarget, elem.current)) return

    // Don't close when clicking the target.
    if (isAncestorOrSelf(evTarget, target)) return

    // Return when we're detached.
    if (isDetached(evTarget)) return

    setOpen(false)
  }

  // ----------------------------------

  useEvent(target, 'click', toggleBalloon, behavior === 'click', [behavior, isOpen])
  useEvent(target, 'mousedown', toggleBalloon, behavior === 'mousedown', [behavior, isOpen])
  useEvent(target, 'mouseup', openBalloon, behavior === 'mouseup', [behavior, isOpen])
  useEvent(target, 'mousedown', closeBalloon, behavior === 'mouseup', [behavior, isOpen])

  useDocumentEvent(
    'mousedown',
    documentMouseDown,
    [isOpen, target, behavior],
    isOpen && (behavior === 'click' || behavior === 'mousedown' || behavior === 'mouseup'),
  )

  useEvent(target, 'mouseenter', startHover, behavior === 'hover', [isOpen])
  useEvent(target, 'mouseleave', stopHover, behavior === 'hover', [isOpen])

  const [show, visRef] = useDebounce(() => setVisible(true))
  const [hide] = useDebounce(() => setVisible(false), durationOut, visRef)

  useEffect(() => {
    const showing = isOpen && !isVisible
    const hiding = !isOpen && isVisible
    if (showing) show()
    if (hiding) hide()
    if (showing && registry) registry.register(id, elem, () => setOpen(false))
    if (hiding && registry) registry.unregister(id)
  }, [isOpen, isVisible])

  // ----------------------------------

  if (!isOpen && !isVisible) return <></>

  const balloonC = styling(isOpen, isVisible, timing, transitions)

  const className = cx(
    balloonC.className,
    position === 'left' && leftC(bias ?? 0),
    position === 'right' && rightC(bias ?? 0),
    position === 'top' && topC(bias ?? 0),
    position === 'bottom' && bottomC(bias ?? 0),
    !position && bottomC(bias ?? 0),
  )

  const ref = (el?: HTMLDivElement) => {
    if (el) {
      elem.current = el
      const dim = measureDimensions(el)
      if (!isEqual(dim, size)) setSize(dim)
    }
  }

  const dim = targetGeom // measureAbsolute(target)
  const pos = computePosition(props, size, dim, false)
  const hover = behavior === 'hover'

  const computedWidth =
    width === 'target' ? dim.width : width instanceof Function ? width(dim.width) : width

  const computedHeight =
    height === 'target' ? dim.height : height instanceof Function ? height(dim.height) : height

  return ReactDOM.createPortal(
    <>
      <Box
        abs
        fg
        palette={palette}
        ref={ref}
        {...pos}
        onClick={ev => ev.stopPropagation()}
        style={{ visibility: size ? undefined : 'hidden' }}
        className={className}
        onMouseEnter={hover ? () => setTimeout(startHover) : undefined}
        onMouseLeave={hover ? stopHover : undefined}
      >
        {(handle === true || handle === undefined) && size ? (
          <Handle {...props} dim={size} />
        ) : (
          handle
        )}
        <Box bg regular clip blunt width={computedWidth} height={computedHeight} elevate {...rest}>
          {children}
        </Box>
      </Box>
      {balloonC.styles}
    </>,
    document.getElementById('overlay') as HTMLElement,
  )
}

function computePosition(
  props: BalloonOnlyProps & Context,
  size: Dimensions | undefined,
  dim: Geom,
  small: boolean,
): Partial<Position> {
  if (!size) return {}

  const { margin, bias, position } = props
  const b = bias || 0
  const pos = position || 'bottom'
  const defaultM = small ? 5 : 10
  const m = (margin ?? new Sides(defaultM)).asRect

  if (pos === 'left' || pos === 'right') {
    const dy = ((dim.height - size.height) / 2) * b
    const top = Math.round(dim.top + dim.height / 2 - size.height / 2 + dy)
    const left = Math.round(
      pos === 'left' ? dim.left - size.width - m.left : dim.left + dim.width + m.right,
    )
    return { left, top }
  }

  if (pos === 'top' || pos === 'bottom') {
    const dx = ((dim.width - size.width) / 2) * b
    const left = Math.round(dim.left + dim.width / 2 - size.width / 2 + dx)
    const top = Math.round(
      pos === 'top' ? dim.top - size.height - m.top : dim.top + dim.height + m.bottom,
    )
    return { left, top }
  }

  return pos
}

function Handle(props: BalloonProps & { dim: Dimensions }) {
  const small = false //useResolvedeSmall(props)
  const { position = 'bottom', bias = 0, dim } = props
  const { width, height } = dim
  // const { handleC } = PositionStyles.get(bias)

  const handle = Unit

  const isV = position === 'left' || position === 'right'
  const isH = !isV

  let left =
    width > handle
      ? range(0, width - handle).clamp(width / 2 + (bias * (width - handle)) / 2 - handle / 2)
      : width / 2 - handle / 2

  const top =
    height > handle
      ? range(0, height - handle).clamp(height / 2 + (bias * (height - handle)) / 2 - handle / 2)
      : height / 2 - handle / 2

  const style: CSSProperties = {
    left: isH ? px(left) : undefined,
    top: isV ? px(top) : undefined,
  }

  const { className, styles } = handleC(position)

  return (
    <>
      <Box cx={className} style={style}>
        <Icon fg={Bg} icon={small ? balloonHandleSmall : balloonHandle} />
      </Box>
      {styles}
    </>
  )
}

// ----------------------------------------------------------------------------

const leftC = (bias: number) => css.resolve`
  transform-origin: 100% ${(bias + 1) * 50}%;
`

const rightC = (bias: number) => css.resolve`
  transform-origin: 0% ${(bias + 1) * 50}%;
`

const topC = (bias: number) => css.resolve`
  transform-origin: ${(bias + 1) * 50}% 100%;
`

const bottomC = (bias: number) => css.resolve`
  transform-origin: ${(bias + 1) * 50}% 0%;
`

const handleC = (position: BalloonPosition) => {
  const main = css.resolve`
    & {
      position: absolute;
      pointerevents: none;
    }
  `

  const leftC = css.resolve`
    right: -14px;
    transform: rotate(90deg);
  `

  const rightC = css.resolve`
    left: -14px;
    transform: rotate(270deg);
  `

  const topC = css.resolve`
    bottom: -14px;
    transform: rotate(180deg);
  `

  const bottomC = css.resolve`
    top: -14px;
    transform: rotate(0deg);
  `

  return resolveMany(
    main,
    position === 'left' && leftC,
    position === 'right' && rightC,
    position === 'top' && topC,
    position === 'bottom' && bottomC,
  )
}

const styling = (
  isOpen: boolean,
  isVisible: boolean,
  timing: Timing,
  transitions: ('transform' | 'opacity')[],
) => {
  const { durationIn, durationOut } = timing
  const trIn = `${durationIn}ms ease-in`
  const trOut = `${durationOut}ms ease-in`

  const opacity = transitions.indexOf('opacity') !== -1
  const transform = transitions.indexOf('transform') !== -1

  const balloonC = css.resolve`
    transition: ${transitions.map(tr => `${tr} ${trIn}`).join()};
    opacity: ${opacity ? 1 : undefined};
    transform: ${transform ? 'scale(1) translate(0,0)' : undefined};
    zindex: 1000;
  `

  const inC = css.resolve`
    opacity: ${opacity ? 0 : undefined};
    transition: ${transitions.map(tr => `${tr} ${trOut}`).join()};
    transform: ${transform ? 'scale(0.8)' : undefined};
  `

  const outC = css.resolve`
    opacity: ${opacity ? 0 : undefined};
    transition: ${transitions.map(tr => `${tr} ${trOut}`).join()};
    transform: ${transform ? 'scale(0.8)' : undefined};
  `

  return resolveMany(
    balloonC,
    isOpen && !isVisible && inC,
    !isOpen && isVisible && outC, //
  )
}
