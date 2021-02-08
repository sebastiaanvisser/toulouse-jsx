import { BoxProps } from '@/box/Box'
import { useControlledVar, Value, Var } from '@/data/Var'
import { cx } from '@/styling/Css'
import { FocusEvent, RefCallback, useCallback, useEffect, useState } from 'react'
import css from 'styled-jsx/css'

export interface FocusProps {
  focus?: Var<boolean> | Value<boolean>
  native?: boolean
}

interface FocusableAspects {
  onFocus: (ev: FocusEvent<HTMLElement>) => void
  onBlur: (ev: FocusEvent<HTMLElement>) => void
  className: string
  ref: RefCallback<HTMLElement>
  tabIndex?: number
}

// ----------------------------------------------------------------------------

export function useFocusableProps(
  props: FocusProps & BoxProps,
  provided?: HTMLElement,
): Partial<FocusableAspects> {
  const { focus, native, tabIndex } = props

  if (!focus) return {}

  const [element, setElement] = useState<HTMLElement | undefined>()
  const [hasFocus, setFocus] = useControlledVar(focus, false)
  const managed = tabIndex !== undefined || native

  useEffect(() => {
    return props.focus?.effect(hasFocus => {
      const el = provided ?? element
      if (managed && hasFocus) {
        el?.focus()
      }
      if (managed && !hasFocus) {
        el?.blur()
      }
    })
  }, [focus, native, element])

  const onFocus = (ev: FocusEvent<HTMLElement>) => {
    if (!managed) return
    if (props.onFocus) props.onFocus(ev as any)
    setFocus(true)
  }

  const onBlur = (ev: FocusEvent<HTMLElement>) => {
    if (!managed) return
    if (props.onBlur) props.onBlur(ev as any)
    setFocus(false)
  }

  const className = cx(props.className, hasFocus && focusC)

  const ref: RefCallback<HTMLElement> = useCallback(
    (el: HTMLElement) => {
      if (!provided) setElement(el || undefined)
    },
    [provided],
  )

  return {
    onFocus,
    onBlur,
    className,
    tabIndex,
    ref,
  }
}

export const focusC = css.resolve``
