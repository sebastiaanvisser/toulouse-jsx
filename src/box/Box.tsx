import { Classy, cx } from '@/styling/Css'
import React, { CSSProperties, forwardRef, ReactNode, Ref, useContext } from 'react'
import * as Border from './Border'
import * as Clickable from './Clickable'
import * as Corner from './Corner'
import * as Flexed from './Flexed'
import * as Label from './Label'
import * as Palette from './Palette'
import * as Size from './Size'
import * as Space from './Space'
import * as Variant from './Variant'

export interface EventProps<E> {
  onClick?: React.MouseEventHandler<E>
  onDoubleClick?: React.MouseEventHandler<E>
  onMouseDown?: React.MouseEventHandler<E>
  onMouseUp?: React.MouseEventHandler<E>
  onMouseOver?: React.MouseEventHandler<E>
  onMouseOut?: React.MouseEventHandler<E>
  onMouseEnter?: React.MouseEventHandler<E>
  onMouseLeave?: React.MouseEventHandler<E>
  onScroll?: React.UIEventHandler<E>
  onWheel?: React.WheelEventHandler<E>
  onWheelCapture?: React.WheelEventHandler<E>

  onKeyDown?: React.KeyboardEventHandler<E>
  onKeyUp?: React.KeyboardEventHandler<E>
  onKeyPress?: React.KeyboardEventHandler<E>
  onFocus?: React.FocusEventHandler<E>
  onBlur?: React.FocusEventHandler<E>

  onDrag?: React.DragEventHandler<E>
  onDragEnd?: React.DragEventHandler<E>
  onDragEnter?: React.DragEventHandler<E>
  onDragExit?: React.DragEventHandler<E>
  onDragLeave?: React.DragEventHandler<E>
  onDragOver?: React.DragEventHandler<E>
  onDragStart?: React.DragEventHandler<E>
  onDrop?: React.DragEventHandler<E>
}

export const ParentContext = React.createContext<BoxProps>({})

export const useParent = () => useContext(ParentContext)

export interface DivProps extends EventProps<HTMLDivElement> {
  className?: string
  style?: CSSProperties
  tabIndex?: number
  ref?: Ref<HTMLDivElement | undefined>
  children?: ReactNode
}

export interface BoxProps
  extends DivProps,
    Flexed.Props,
    Size.Props,
    Space.Props,
    Palette.Props,
    Border.Props,
    Corner.Props,
    Label.Props,
    Clickable.Props,
    Variant.Props {
  cx?: Classy
}

// ----------------------------------------------------------------------------

export const Box = forwardRef((props: BoxProps, ref: Ref<HTMLDivElement | undefined>) => {
  const {
    tabIndex,
    children,
    style,

    onClick,
    onDoubleClick,
    onMouseDown,
    onMouseUp,
    onMouseOver,
    onMouseOut,
    onMouseEnter,
    onMouseLeave,
    onKeyDown,
    onKeyUp,
    onKeyPress,
    onScroll,
    onFocus,
    onBlur,
    onWheel,
    onWheelCapture,

    onDrag,
    onDragEnd,
    onDragEnter,
    onDragExit,
    onDragLeave,
    onDragOver,
    onDragStart,
    onDrop,
  } = props

  const palette = Palette.usePalette(props)
  const paletted = Palette.resolve(props, palette)
  const size = Size.resolve(props)
  const flex = Flexed.resolve(props)
  const space = Space.resolve(props)
  const corner = Corner.resolve(props)
  const border = Border.resolve(props, palette)
  const clickable = Clickable.resolve(props, palette)
  const label = Label.resolve(props)
  const variant = Variant.resolve(props)

  const className = cx(
    'box',
    size.className,
    flex.className,
    corner.className,
    border?.className,
    paletted.className,
    clickable.className,
    label.className,
    space.className,
    variant.className,
    props.cx,
    props.className,
  )

  const primProps: DivProps = {
    tabIndex,
    children,
    style,
    ref,

    onClick,
    onDoubleClick,
    onMouseDown,
    onMouseUp,
    onMouseOver,
    onMouseOut,
    onMouseEnter,
    onMouseLeave,
    onKeyDown,
    onKeyUp,
    onKeyPress,
    onScroll,
    onFocus,
    onBlur,
    onWheel,
    onWheelCapture,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragExit,
    onDragLeave,
    onDragOver,
    onDragStart,
    onDrop,
  }

  return (
    <ParentContext.Provider value={props}>
      <div {...(primProps as any)} className={className} />
      <style jsx>{`
        .box {
          box-sizing: border-box;
        }

        .box:focus {
          outline: none;
        }
      `}</style>
      {size.styles}
      {flex.styles}
      {space.styles}
      {corner.styles}
      {border?.styles}
      {paletted.styles}
      {clickable.styles}
      {label.styles}
      {variant.styles}
    </ParentContext.Provider>
  )
})
