import { BoxProps } from '@/box/Box'
import { pieSlice } from '@/icon/Icons'
import * as S from '@/icon/Shape'
import { array, circle, layers } from '@/icon/Shape'
import { Point, pt } from '@/lib/Geometry'
import { Rgba } from '@/styling/Rgba'
import { Icon } from '@/widget/Icon'
import * as React from 'react'
import css from 'styled-jsx/css'

export type SpinnerType = 'tail' | 'segment' | 'dots'

interface Props extends BoxProps {
  thickness?: number
  speed?: number
  spinner?: SpinnerType
  zoom?: number
}

export function Spinner(props: Props) {
  const { speed, thickness, spinner, zoom = 1, ...rest } = props

  // const small = false // useResolvedeSmall(props)
  // const unit = small ? SmallerUnit : Unit

  const th = thickness ?? 2 / zoom + 0.1 * (zoom - 1)
  const img = byType[spinner ?? 'tail'](th)
  const { className, styles } = spinningC(speed)

  return (
    <>
      <Icon zoom={zoom} className={className} icon={img} {...rest} />
      {styles}
      {anim.styles}
    </>
  )
}

// ----------------------------------------------------------------------------

const prefix = 'rotate360'

const anim = css.resolve`
  @keyframes ${prefix} {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const spinningC = (speed = 500) => css.resolve`
  animation: ${prefix}-${anim.className} ${speed}ms linear infinite;
`

// ----------------------------------------------------------------------------

const tailImg = (w: number) =>
  S.Icon.make(`Spinner.tailImg.${w}`, () => {
    const xs = 7
    const s = 360 / xs
    const r = 8

    const sin = (deg: number) => Math.sin((deg / 180) * Math.PI)

    return layers(
      circle(r + w / 2)
        .mask(circle(r - w / 2))
        .mask(
          array(xs, d =>
            layers(
              circle(r + w)
                .gradient(Rgba.Black.alpha((d * 1) / xs), Rgba.Black.alpha(((d + 1) * 1) / xs), [
                  pt(0, r * sin(-s / 2)),
                  pt(0, r * sin(s / 2)),
                ])
                .clip(pieSlice(-(s / 2), s / 2 + 0.1, 30))
                .rotate((d * 360) / xs),
            ).rotate(s / 2),
          ).width(0),
        ),

      circle(w / 2).dx(r),
    ).scale2(1, -1)
  })

const segmentImg = (w: number) =>
  S.Icon.make(`Spinner.segment.${w}`, () => {
    const r = 8
    const d = 60
    const ring = circle(r + w / 2).mask(circle(r - w / 2))
    return layers(
      ring.opacity(0.1), //
      ring.clip(pieSlice(-d, d, 30)),
      circle(w / 2).tr(Point.atAngle(-d, r)),
      circle(w / 2).tr(Point.atAngle(d, r)),
    )
      .rotate(d)
      .scale2(1, -1)
  })

const dotsImg = () =>
  S.Icon.make(`Spinner.dots`, () => {
    const r = 8
    const c = 16
    return array(c, i =>
      circle(i / 16)
        .dx(r)
        .rotate((i * 360) / c),
    ).d(15, 15)
  })

const byType = {
  tail: tailImg,
  segment: segmentImg,
  dots: dotsImg,
}

// export const spinningC = memo1((speed: number = 500) =>
//   className('spinner', {
//     animation: `${rotate360} ${speed}ms linear infinite`,
//   }),
// )

// export const rotate360 = keyframes(
//   {
//     0: { transform: 'rotate(0deg)' },
//     100: { transform: 'rotate(360deg)' },
//   },
//   'rotate360',
// )
