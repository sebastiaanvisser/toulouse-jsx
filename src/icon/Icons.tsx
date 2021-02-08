import { bz, Point, pt } from '@/lib/Geometry'
import {
  array,
  circle,
  Icon,
  layers,
  line,
  mask,
  ngon,
  path,
  poly,
  rect,
  starShape,
  text,
} from './Shape'

// ----------------------------------------------------------------------------

export const kappa = (4 * (Math.sqrt(2) - 1)) / 3

export const gshape = (w: number, h: number, x: number, y: number) =>
  poly(
    pt(w, 0),
    bz(pt(w, x), pt(y, h), pt(0, h)),
    bz(pt(-y, h), pt(-w, x), pt(-w, 0)),
    bz(pt(-w, -x), pt(-y, -h), pt(0, -h)),
    bz(pt(y, -h), pt(w, -x), pt(w, 0)),
  )

export const gchevron = () => line(pt(0, -1), pt(1, 0), pt(0, 1)).rounded()

export const gdlight = () => line(pt(-1, 0), pt(1, 0)).rounded()

export const gplus = () =>
  line(pt(0, -1), pt(0, 1))
    .clone(s => s.rotate(90))
    .rounded()

export const gstar = () => starShape(5, 0.47).scale(8).rotate(-90)

export const hstripes = (s = 2, w = 1) =>
  array(1 + 40 / s, i => line(pt(-20, -20 + i * s), pt(20, -20 + i * s)).width(w))

export const gmarker = () =>
  poly(
    pt(0, 19),
    bz(pt(7.5, 11.5), pt(11, 5.3), pt(11, 0)),
    bz(pt(11, -6), pt(6, -11), pt(0, -11)),
    bz(pt(-6, -11), pt(-11, -6), pt(-11, 0)),
    bz(pt(-11, 5.3), pt(-7.5, 11.5), pt(0, 19)),
  )

export const handle = () =>
  poly(
    pt(10, 0),
    pt(10, 1),
    pt(-10, 1),
    pt(-10, 0),
    bz(pt(-3, 0), pt(-2, -5), pt(0, -5)),
    bz(pt(2, -5), pt(3, 0), pt(10, 0)),
  )

export const pieSlice = (from: number, to: number, r: number) =>
  circle(r).clip(
    poly(
      pt(0, 0),
      Point.atAngle(from, 2 * r),
      Point.atAngle(0.8 * from + 0.2 * to, 2 * r),
      Point.atAngle(0.5 * from + 0.5 * to, 2 * r),
      Point.atAngle(0.2 * from + 0.8 * to, 2 * r),
      Point.atAngle(to, 2 * r),
    ),
  )

// ----------------------------------------------------------------------------

export const empty = () => layers()

export const square = () => rect(16, 16)

export const blob = () => gshape(8, 8, 6.5, 6.5)

export const ellipse = () => gshape(9, 6, 1, 6)

export const triangle = () =>
  ngon(3)
    .scale(8)
    .width(4 / 8)
    .rounded()
    .rotate(30)
    .dy(1.5)

export const circle_ = () => circle(8)

export const half = () => {
  const w = 10
  const h = 8
  const u = 8
  const v = 7
  return poly(
    pt(w, 0),
    pt(-w, 0),
    bz(pt(-v, 0), pt(-u, -h), pt(0, -h)),
    bz(pt(u, -h), pt(v, 0), pt(w, 0)),
  )
}

export const tick = () =>
  line(pt(-0.5, 0), pt(0, 0.5), pt(1, -0.5))
    .rounded()
    .width(2 / 6)
    .scale(6)
    .dx(-1.5)

export const caretRight = () =>
  poly(pt(0, -1), pt(1, 0), pt(0, 1))
    .scale(3)
    .dx(-1.5)
    .width(1.5 / 3)
    .rounded()

export const caretDown = () => caretRight().rotate(90)

export const caretLeft = () => caretRight().rotate(180)

export const caretUp = () => caretRight().rotate(270)

export const chevronRight = () => gchevron().dx(-0.5).scale(5).width(0.45)

export const chevronDown = () => chevronRight().rotate(90)

export const chevronLeft = () => chevronRight().rotate(180)

export const slash = () =>
  line(pt(-1, 0), pt(1, 0)) //
    // .dx(-0.5)
    .rotate(-45)
    .scale(5)
    .width(0.45)
    .rounded()

export const backslash = () => slash().scale2(-1, 1)

export const dash = () =>
  line(pt(-3, 0), pt(3, 0)) //
    .width(2)
    .rounded()

export const pipe = () =>
  line(pt(0, -5), pt(0, 5)) //
    .width(2)
    .rounded()

export const chevronUp = () => chevronRight().rotate(270)

export const arrowRight = () =>
  layers(line(pt(-1, 0), pt(1, 0)).rounded(), gchevron())
    .scale(6)
    .width(0.35)

export const arrowDown = () => arrowRight().rotate(90)

export const arrowLeft = () => arrowRight().rotate(180)

export const arrowUp = () => arrowRight().rotate(270)

export const doubleChevronRight = () =>
  gchevron()
    .scale(4.5)
    .width(0.4)
    .clones(
      s => s.dx(-2.5),
      x => x.dx(2.5),
    )
    .dx(-1.5)

const play = () =>
  poly(pt(0, -5), pt(0, 5), pt(6, 0))
    .dx(-3)
    .rounded() //
    .width(2)

const playPause = () =>
  layers(
    play(),
    rect(1.5, 11)
      .rounded() //
      .width(1.5)
      .dx(-7),
  ).dx(2)

const pause = () =>
  rect(2, 10)
    .rounded() //
    .width(2)
    .clone(s => s.dx(6))
    .dx(-3)

const stop = () =>
  rect(10, 10)
    .rounded() //
    .width(2)

const fastForward = () =>
  play()
    .scale(0.8)
    .clone(s => s.dx(6))
    .dx(-2)

const rewind = () => fastForward().scale2(-1, 1)

const playNext = () =>
  layers(
    play(),
    rect(1.5, 10)
      .rounded() //
      .width(1.5)
      .dx(5.5),
  ).dx(-1.5)

const playPrev = () => playNext().scale2(-1, 1)
const eject = () => playPause().rotate(-90)
const record = () => circle(6)

export const repeat = () =>
  layers(
    mask(circle(7).outline(2), pieSlice(-150, 90, 25)),
    circle(1).dx(7).rotate(150),
    poly(pt(0, -1), pt(1, 0), pt(0, 1))
      .scale(3)
      .width(1.5 / 3)
      .dy(-7)
      .rounded(),
  )
    .clone(s => s.rotate(180))
    .rotate(40)

export const doubleChevronDown = () => doubleChevronRight().rotate(90)

export const doubleChevronLeft = () => doubleChevronRight().rotate(180)

export const doubleChevronUp = () => doubleChevronRight().rotate(270)

export const dot = () => circle(3)

export const ring = () => circle(8).outline(2)

export const target = () => layers(circle(6).outline(2), circle(2.5))

export const minus = () => gdlight().scale(5).width(0.4)

export const plus = () => gplus().scale(5).width(0.4)

export const smallPlus = () => gplus().scale(4).width(0.4)

export const cross = () => plus().rotate(45)

export const smallCross = () => gplus().scale(4).width(0.4).rotate(45)

export const asterisk = () =>
  gplus()
    .scale(5)
    .width(0.3)
    .clone(s => s.rotate(45))

export const halt = () =>
  mask(
    circle(8),
    gdlight()
      .width(1.5 / 4)
      .scale(4),
  )

export const add = () =>
  mask(
    circle(8),
    gplus()
      .width(1.5 / 4)
      .scale(4),
  )

export const del = () => add().rotate(45)

export const alert = () => circle(8).mask(text('!'))

export const help = () => circle(8).mask(text('?'))

export const warning = () => triangle().mask(text('!'))

export const haltOpen = () =>
  layers(
    circle(8).outline(1.5),
    gdlight()
      .width(1.5 / 4)
      .scale(4),
  )

export const addOpen = () =>
  layers(
    circle(8).outline(1.5),
    gplus()
      .width(1.5 / 4)
      .scale(4),
  )

export const delOpen = () => addOpen().rotate(45)

export const alertOpen = () => layers(circle(8).outline(1.5), text('!'))

export const helpOpen = () => layers(circle(8).outline(1.5), text('?'))

export const leftRight = () =>
  caretRight()
    .dx(3.5)
    .clone(s => s.rotate(180))

export const upDown = () => leftRight().rotate(90)

export const rightLeft = () =>
  caretLeft()
    .dx(3.5)
    .clone(s => s.rotate(180))

export const downUp = () => rightLeft().rotate(90)

export const splith = () =>
  layers(
    caretRight()
      .dx(4.5)
      .clone(s => s.rotate(180)),
    rect(1, 14, 0.5),
  )

export const splitv = () => splith().rotate(90)

export const joinh = () =>
  layers(
    caretLeft()
      .dx(4.5)
      .clone(s => s.rotate(180)),
    rect(1, 14, 0.5),
  )

export const joinv = () => joinh().rotate(90)

export const ellipses = () => circle(1.5).array(3, (s, i) => s.dx(-5 + i * 5))

export const hamburger = () =>
  line(pt(-7, 0), pt(7, 0))
    .rounded()
    .outline(2.5)
    .array(3, (s, i) => s.dy(-5.5 + i * 5.5))

export const dots = () => ellipses().array(3, (n, i) => n.dy(-5 + i * 5))

export const camera = () =>
  layers(
    layers(rect(15, 11.5, 1.3).dy(0.75), rect(5, 12, 1.3).d(-5.5, 1)).mask(
      layers(
        circle(2.8).outline(1.6).d(0.5, 1.8),
        rect(13, 1).dy(-3),
        circle(0.5)
          .d(-6, -1)
          .array(4, (s, i) => s.dy(i * 2)),
      ),
    ),
    rect(1.5, 1).d(-4.5, -5.5),
    rect(3.5, 3, 1).d(4, -5.2),
  ).scale(1.12)

export const grid = () =>
  layers(
    line(pt(-5, -10), pt(-5, 10)).width(1),
    line(pt(0, -10), pt(0, 10)).width(1),
    line(pt(5, -10), pt(5, 10)).width(1),
  )
    .clone(s => s.rotate(90))
    .scale(0.8)

export const settings6 = () =>
  layers(
    layers(
      rect(18, 3.5, 1).array(
        3,
        (s, i) => s.rotate(30 + i * 60), //
      ),
      circle(7.5),
    )
      .mask(circle(3.5))
      .mask(
        circle(2.8)
          .dx(9)
          .array(6, (s, i) => s.rotate(i * 60)),
      ),
  ).rotate(15)

export const settings8 = () =>
  layers(
    rect(18, 2.5, 1).array(
      4,
      (s, i) => s.rotate(45 / 2 + i * 45), //
    ),
    circle(7),
  )
    .mask(circle(3))
    .mask(
      circle(1.85)
        .dx(8)
        .array(8, (s, i) => s.rotate(i * 45)),
    )
    .rotate(-10)

export const marker = () => gmarker().scale(0.6).dy(-3)

export const mapMarker = () => mask(gmarker().scale(0.6), circle(3)).dy(-3)

export const mapMarkerO = () => mask(gmarker().scale(0.6), circle(5.5)).dy(-3)

export const gglobe = () =>
  path(
    'M1.41432672,9.92544321 L1.92702203,10.2002423 L1.92702203,11.5186016 L2.63268234,12.5237098 L3.02410549,12.5237098 L3.02410549,11.9518573 L2.63268234,11.1804199 L2.63268234,10.2002423 L3.02410549,11.5186016 L3.66469293,12.3504639 L3.45454419,12.9914739 L3.83272741,13.6722037 L5.38813794,14.1974346 L5.96830058,13.8508019 L5.96830058,14.1974346 L6.94383018,14.6342116 L7.7918902,15.5984732 L9.03320442,15.5984732 L9.03320442,16.5496357 L8.42191386,17.1207839 L8.24556921,18.4442139 L9.37251294,19.9914551 L9.37251294,20.4845722 L9.96549296,20.4845722 L10.8228491,21.5343299 L10.8228491,24.0096342 L11.1841303,24.2195012 L10.8228491,25.4888447 L11.4434358,25.8905499 L11.4434358,27.480187 L13.0409606,29.2367319 L14.0780418,29.2367319 L13.362522,28.1866925 L13.5185842,27.480187 L13.0409606,27.0431284 L13.362522,26.3997239 L12.887152,26.0963323 L14.0780418,25.8905499 L15.5717599,23.7272292 L15.4180921,22.4891545 L15.8096561,22.2225248 L16.6905343,22.2225248 L17.311121,21.7934946 L17.311121,19.9914551 L18.0917137,19.2241023 L18.0917137,18.4442139 L17.5091566,18.4442139 L17.311121,17.7177077 L15.5717599,17.7177077 L14.7275028,17.3400879 L14.5460875,16.31681 L13.362522,15.8646804 L12.4938978,14.8159086 L12.1207852,15.1931058 L11.1841303,15.1931058 L11.0193354,14.6342116 L9.96549296,14.6342116 L9.57505576,15.1931058 L8.04091363,15.1931058 L8.04091363,13.8508019 L7.20722035,13.6722037 L7.49413253,13.220074 L7.20722035,12.5237098 L6.25239576,13.3852915 L5.53391807,13.220074 L5.16066461,12.7090689 L5.53391807,11.717764 L6.61846584,10.8667462 L8.42191386,10.8667462 L8.56933259,11.8355489 L9.37251294,12.2178887 L9.32725231,10.8667462 L10.5755159,9.92544321 L10.5755159,9.11428598 L13.0409606,7.05265925 L12.887152,8.00663875 L13.362522,8.00663875 L13.5185842,7.2670335 L14.0780418,8.00663875 L14.5460875,7.4421105 L14.0780418,7.05265925 L13.6770408,6.36911245 L14.5460875,6.61940355 L15.1070945,6.36911245 L14.7275028,7.05265925 L15.8096561,7.59028508 L15.8096561,7.05265925 L15.4180921,6.61940355 L15.8096561,6.36911245 L15.8096561,5.73739859 L15.1070945,5.4118934 L15.1070945,4.48439378 L14.0780418,5.01582219 L14.0780418,4.24410306 L13.0409606,4.00550255 L12.4938978,4.48439378 L12.4938978,5.4118934 L11.8079565,5.4118934 L11.1841303,6.36911245 L11.0193354,5.4118934 L10.1354993,5.4118934 L9.57505576,4.48439378 L11.4434358,3.60929049 L11.8079565,4.00550255 L12.2950171,4.00550255 L12.4938978,3.60929049 L13.362522,2.86588229 L14.5460875,2.86588229 L14.5460875,3.22744516 L13.6770408,3.60929049 L15.1070945,4.24410306 L15.1070945,3.60929049 L15.8096561,3.78676194 L16.1933325,3.22744516 L15.5717599,3.22744516 L15.5717599,2.44502141 L14.2429776,1.76400992 L12.887152,2.16909555 L12.887152,2.86588229 L12.1207852,2.86588229 L12.1207852,2.44502141 L12.4938978,2.00655424 L11.4434358,2.00655424 L11.6075265,2.86588229 L9.96549296,3.22744516 L9.80802226,2.64446552 L10.8228491,2.44502141 L10.5755159,2.00655424 L9.80802226,2.16909555 L9.20673207,1.54907227 L8.42191386,1.76400992 L7.7918902,2.44502141 L9.20673207,3.22744516 L8.79150521,3.44252366 L6.72911438,2.51226646 C9.10855285,0.925147566 11.9672474,0 15.0420217,0 C18.8972954,0 22.4128672,1.4544372 25.0699696,3.84454426 L24.3595547,4.25607535 L24.3595547,4.74806566 L24.8737994,4.91257888 L25.0547921,5.41358361 L25.5666423,5.14765813 L25.7211551,5.91768705 L24.3595547,5.91768705 L24.0784174,6.85856746 L22.9899258,6.85856746 L23.2278221,7.93945313 L22.4049743,7.77226375 L21.4973345,7.93945313 L21.4973345,8.95597018 L21.9087584,9.46683444 L23.4499431,9.24978403 L24.0784174,8.10706505 L24.8737994,8.10706505 L25.0547921,7.77226375 L25.2891671,8.29876239 L26.551468,8.95597018 L25.7211551,8.95597018 L25.9305996,9.46683444 L26.551468,9.46683444 L26.7937306,8.58799861 L25.7211551,7.54817082 L26.3965326,7.54817082 L27.1213486,7.93945313 L27.1213486,8.80371094 L27.9267309,9.46683444 L28.0965965,8.29876239 L28.8088768,9.6278264 L29.0411782,9.60140644 C29.1779547,9.95584859 29.301658,10.3167904 29.4116968,10.6836407 L28.6284474,10.6836407 L28.4035094,10.2964431 L27.458826,10.1067176 L27.1937457,10.6836407 L25.4732585,10.1067176 L25.4732585,9.32654748 L23.3135999,9.78177584 L22.1797545,9.78177584 L21.2963411,10.2964431 L21.1283066,11.0575984 L19.4437363,12.2918701 L20.0865773,13.0513353 L19.7702274,13.4002216 L19.7702274,14.7735126 L21.1283066,16.4066726 L23.0634497,16.2576529 L23.6940368,15.7610145 L24.3595547,16.4066726 L25.3050832,16.4066726 L25.3050832,18.0618051 L26.2822326,19.5560866 L25.7256624,20.5754207 L25.7256624,21.2329102 L26.1917362,21.6164457 L26.1917362,22.9939622 L26.6709091,23.5298978 L26.7510854,24.3762557 C24.002084,27.8047703 19.7784145,30 15.0420217,30 C6.75775041,30 0.0420216574,23.2842712 0.0420216574,15 C0.0420216574,12.9121189 0.468597319,10.9238698 1.2393492,9.11765225 L1.41432672,9.92544321 Z M22.5301902,6.58644456 L23.6693879,6.58644456 L24.0250351,6.13276555 L23.2776127,5.35329965 L23.2776127,4.61144081 L22.3607472,4.85919659 L23.0155606,5.7824707 L22.5301902,6.13276555 L22.5301902,6.58644456 Z M22.1346824,5.40372408 L21.6148037,5.82979642 L21.6148037,6.46939791 L22.1346824,6.46939791 L22.5759666,5.82979642 L22.1346824,5.40372408 Z',
  )

export const github = () =>
  path(
    'M0,15.3800802 C0,22.1750733 4.29755364,27.9390628 10.2581417,29.9727456 C11.0086252,30.114367 11.2821142,29.6394633 11.2821142,29.2315938 C11.2821142,28.8671548 11.2692225,27.8994088 11.2618558,26.6163193 C7.0895362,27.5453554 6.20921452,24.5543122 6.20921452,24.5543122 C5.52687314,22.7774362 4.54341754,22.3044208 4.54341754,22.3044208 C3.18149728,21.3508369 4.64655146,21.3697198 4.64655146,21.3697198 C6.15212253,21.4782962 6.94404371,22.9549349 6.94404371,22.9549349 C8.28202216,25.3049054 10.4552012,24.626067 11.3097394,24.2323596 C11.4460235,23.2391218 11.8336966,22.5612275 12.2618865,22.1769616 C8.93121336,21.788919 5.42926425,20.4690079 5.42926425,14.5756709 C5.42926425,12.8969856 6.01399675,11.5232584 6.97351054,10.4488243 C6.81880966,10.0598376 6.3040609,8.4953936 7.12084472,6.37862627 C7.12084472,6.37862627 8.37963105,5.96509188 11.2452807,7.95534413 C12.44145,7.61356457 13.725099,7.44361893 15.0004604,7.43700993 C16.274901,7.44361893 17.5576291,7.61356457 18.7556401,7.95534413 C21.6194481,5.96509188 22.8763928,6.37862627 22.8763928,6.37862627 C23.6950183,8.4953936 23.1802695,10.0598376 23.0264895,10.4488243 C23.9878449,11.5232584 24.5679732,12.8969856 24.5679732,14.5756709 C24.5679732,20.4841142 21.0604991,21.7841983 17.7196967,22.1646877 C18.2574665,22.6395914 18.7372234,23.5780689 18.7372234,25.0131654 C18.7372234,27.0685635 18.7188066,28.7274218 18.7188066,29.2315938 C18.7188066,29.6432399 18.9895331,30.1219201 19.7501458,29.9718015 C25.7061297,27.933398 30,22.173185 30,15.3800802 C30,6.88563075 23.2834034,0 14.9986187,0 C6.71659658,0 0,6.88563075 0,15.3800802 Z',
  )
    .d(-15, -15)
    .scale(0.7)

export const twitter = () =>
  path(
    'M30,15 C30,23.2875 23.2875,30 15,30 C6.7125,30 0,23.2875 0,15 C0,6.7125 6.7125,0 15,0 C23.2875,0 30,6.7125 30,15 Z M12.255,22.9125 C18.9075,22.9125 22.545,17.4 22.545,12.6225 C22.545,12.465 22.545,12.3075 22.5375,12.1575 C23.2425,11.6475 23.8575,11.01 24.345,10.2825 C23.7,10.5675 23.0025,10.7625 22.2675,10.8525 C23.0175,10.4025 23.5875,9.6975 23.8575,8.85 C23.16,9.2625 22.3875,9.5625 21.5625,9.7275 C20.9025,9.0225 19.965,8.5875 18.9225,8.5875 C16.9275,8.5875 15.3075,10.2075 15.3075,12.2025 C15.3075,12.4875 15.3375,12.765 15.405,13.0275 C12.3975,12.8775 9.735,11.4375 7.95,9.2475 C7.6425,9.78 7.4625,10.4025 7.4625,11.0625 C7.4625,12.315 8.1,13.425 9.075,14.07 C8.4825,14.055 7.9275,13.89 7.44,13.62 C7.44,13.635 7.44,13.65 7.44,13.665 C7.44,15.42 8.685,16.875 10.3425,17.2125 C10.0425,17.295 9.72,17.34 9.39,17.34 C9.1575,17.34 8.9325,17.3175 8.7075,17.2725 C9.165,18.7125 10.5,19.755 12.0825,19.785 C10.845,20.7525 9.285,21.33 7.59,21.33 C7.2975,21.33 7.0125,21.315 6.7275,21.2775 C8.31,22.3125 10.215,22.9125 12.255,22.9125 Z',
  )
    .d(-15, -15)
    .scale(0.7)

export const google = () =>
  path(
    'M1.89057365,8.26823178 C4.43687771,3.19766958 9.62318101,0.00101079852 15.2944946,0.00101079852 C19.0202555,-0.0430810467 22.6192524,1.35683504 25.3309009,3.9031391 L21.0484804,8.18555957 C19.4997543,6.70848275 17.4329491,5.90380658 15.2944946,5.93687546 C11.3813433,5.93687546 8.0579205,8.5768747 6.87295216,12.1317797 C6.24464337,13.9946602 6.24464337,16.0118621 6.87295216,17.8747426 L6.87846364,17.8747426 C8.06894346,21.4241361 11.3868548,24.0641353 15.3000061,24.0641353 C17.3199573,24.0641353 19.0540937,23.5474701 20.3981257,22.6348963 L20.3981257,22.6311504 C21.9799206,21.583969 23.0601708,19.9360363 23.3963712,18.0731559 L15.2944946,18.0731559 L15.2944946,12.2971241 L29.4424654,12.2971241 C29.6188328,13.3002136 29.701505,14.325349 29.701505,15.3449729 C29.701505,19.9071284 28.0710722,23.7642318 25.2342139,26.3766375 L25.2372057,26.3789572 C22.7515279,28.6717332 19.3399214,30 15.2944946,30 C9.62318101,30 4.43687771,26.8033412 1.89057365,21.7382905 C-0.236857883,17.4999619 -0.236857883,12.5065604 1.89057365,8.26823178 Z',
  )
    .d(-15, -15)
    .scale(0.7)

export const globe = () => gglobe().d(-15, -15).scale(0.6)

export const globe1 = () =>
  layers(circle(8.5).outline(1.5), circle(8).clip(gglobe().d(-15, -15).scale(0.6)).scale(1.02))

export const star = () => gstar().width(0.2).rounded()

export const starOpen = () =>
  gstar()
    .outline(1.5 / 8)
    .rounded()

export const gstar6 = () => starShape(6, 0.58).scale(8).rotate(-90)

export const star6 = () => gstar6().width(0.2).rounded()

export const star6Open = () =>
  gstar6()
    .outline(1.5 / 8)
    .rounded()

export const nautical = () =>
  layers(
    poly(pt(0, 0), pt(10, 0), Point.atAngle(36, 5)).array(5, (s, i) => s.rotate(i * 72)),
    starShape(5, 0.5)
      .scale(10)
      .outline(1 / 10)
      .rounded(),
  ).rotate(-90)

export const scissors = () =>
  path(
    'M-4.99249828,-3.05072739 C-5.1269722,-3.69842299 -3.80638128,-3.98579859 -4.34427714,-6.57658053 C-4.882173,-9.16736247 -7.06477039,-9.70784217 -9.44304157,-9.52878247 C-11.8213128,-9.34972278 -13.0869406,-7.16331874 -12.9953554,-5.03248634 C-12.9037703,-2.90165394 -10.9351576,-1.75753678 -9.48009265,-1.39721703 C-8.02502768,-1.03689716 -6.1144355,-0.855882674 -4.05721775,-0.207941547 C-2,0.43999958 -1,1.43999958 -0.0833699908,2.31209592 C1.08699475,3.42559952 0.27903387,2.84200858 4.94815747,4.94045005 C9.5150636,6.99295201 9.26115341,6.91292842 10.7834545,7.59709549 C12.3057557,8.28126266 13.9564943,7.92204304 14.9469375,7.70651129 C15.9373807,7.49097954 17.0562616,6.232061 17.0562616,6.232061 C17.0562616,6.232061 15,5.43999958 2.81916922,-0.101343689 C-2.84701477,-2.67902259 -4.87373896,-2.47872141 -4.99249828,-3.05072739 Z M-5.96208353,-6.05874201 C-5.6728176,-4.66548913 -6.58974779,-3.28547089 -8.01010443,-2.97638506 C-9.43046108,-2.66729924 -10.816384,-3.54619033 -11.1056499,-4.93944319 C-11.3949159,-6.33269607 -10.4779857,-7.71271427 -9.05762903,-8.02180011 C-7.63727239,-8.33088593 -6.25134946,-7.45199489 -5.96208353,-6.05874201 L-5.96208353,-6.05874201 Z',
  )
    .clone(s => s.scale2(1, -1))
    .scale(0.6)

export const lock = () =>
  layers(
    mask(
      layers(rect(8, 3), circle(4).dy(-1.5)),
      layers(rect(4, 3), circle(2).dy(-1.5)),
      //
    ).dy(-1),
    rect(11, 8, 1).dy(4),
  )

export const lockOpen = () =>
  layers(
    mask(
      layers(rect(8, 4), circle(4).dy(-2)),
      layers(rect(4, 4), circle(2).dy(-2), rect(4, 3).d(-3, 0.5)),
    ).dy(-2),
    rect(11, 8, 1).dy(4),
  )

export const zoom = (r = 5.5) =>
  layers(
    circle(r).outline(2),
    line(pt(0, r + 0.5), pt(0, r + 0.5 + 4))
      .width(3)
      .rounded(),
  ).rotate(-45)

export const search = () => zoom().d(-1, -1)

export const zoomIn = () => layers(zoom(6), gplus().scale(2.5).width(0.5)).d(-1, -1)

export const zoomOut = () => layers(zoom(6), gdlight().scale(2.5).width(0.5)).d(-1, -1)

export const eye = () => gshape(9, 6, 1, 6).mask(circle(3.5).outline(1.5))

export const contrast = () =>
  layers(
    circle(8)
      .mask(rect(15, 30).dx(15 / 2))
      .rotate(20),
    line(pt(0, -12), pt(0, 12)).width(1).rounded().rotate(20),
    circle(8).outline(1.5),
  )

export const lowContrast = () =>
  layers(
    layers(
      circle(8)
        .mask(rect(15, 30).dx(15 / 2))
        .clip(hstripes(2, 0.5)),
      line(pt(0, -12), pt(0, 12)).rounded().width(1),
    ).rotate(45),
    circle(8).outline(1.5),
  )

export const bright = () =>
  layers(
    line(pt(0, 6), pt(0, 8))
      .width(2)
      .rounded()
      .array(8, (s, i) => s.rotate(45 * i)),
    circle(3),
  )

export const dim = () =>
  layers(
    line(pt(0, 6.5), pt(0, 7))
      .width(2)
      .rounded()
      .array(8, (s, i) => s.rotate(45 * i)),
    circle(3),
  )

export const frame = () => rect(16, 16, 0.5).outline(1.5)

export const dialog = () =>
  layers(
    frame(),
    line(pt(-8, -3), pt(8, -3)).width(0.5),
    line(pt(0.5, 5), pt(1.5, 5)).width(1.5).rounded(),
    line(pt(4, 5), pt(5, 5)).width(1.5).rounded(),
  )

export const splits = () =>
  layers(
    frame(),
    line(pt(-8, 0), pt(8, 0)).width(0.5),
    line(pt(-3, 0), pt(-3, -8)).width(0.5),
    line(pt(3, 0), pt(3, 8)).width(0.5),
  )

export const vsplit = () => layers(frame(), line(pt(-8, 0), pt(8, 0)).width(0.5))

export const hsplit = () => vsplit().rotate(90)

export const rows = () =>
  layers(
    frame(),
    line(pt(-8, -4), pt(8, -4)).width(0.5),
    line(pt(-8, 0), pt(8, 0)).width(0.5),
    line(pt(-8, 4), pt(8, 4)).width(0.5),
  )

export const columns = () => rows().rotate(90)

export const table = () =>
  layers(
    frame(),
    line(pt(-8, -4), pt(8, -4)).width(1.5),
    line(pt(-8, 0), pt(8, 0)).width(0.5),
    line(pt(-8, 4), pt(8, 4)).width(0.5),
    line(pt(-4, 8), pt(-4, -4)).width(0.5),
    line(pt(0, 8), pt(0, -4)).width(0.5),
    line(pt(4, 8), pt(4, -4)).width(0.5),
  )

export const button = () => layers(rect(18, 12, 2).outline(1.5), text('OK').scale(0.6))

export const resize = () =>
  layers(line(pt(-1, 0), pt(1, 0)).rounded(), line(pt(0, -1), pt(1, 0), pt(0, 1)).rounded())
    .dx(2)
    .array(4, (s, i) => s.rotate(45 + i * 90))
    .rotate(45)
    .scale(2.5)
    .width(0.5)

export const balloon = () =>
  layers(
    rect(16, 16, 3).outline(1.5),
    line(pt(-5, 0), pt(5, 0))
      .width(0.5)
      .array(3, (s, i) => s.dy(-3 + i * 3)),
    handle().scale(-0.5).dy(8.5),
  )

export const tabs = () =>
  layers(
    frame(),
    line(pt(-8 / 3, -8), pt(-8 / 3, -4)).width(1),
    line(pt(8 / 3, -8), pt(8 / 3, -4)).width(1),
    line(pt(-8 / 3 - 0.5, -4), pt(8, -4)).width(1),
    rect(11, 4).d(2.5, -6).clip(okStripes().scale(0.5)),
  )

const prompt = () =>
  layers(
    gchevron().scale(2).width(0.7).d(-5, -3),
    line(pt(0, 1), pt(1, 1)).rounded().scale(2).width(0.7).d(-1, -3),
  )

export const terminal = () => rect(16, 16, 2).mask(prompt())

export const terminalLight = () => layers(frame(), prompt())

const codeLines = () =>
  layers(
    rect(2, 1.5, 1.5 / 2).d(0, -5),
    rect(5, 1.5, 1.5 / 2).d(3, -2),
    rect(3, 1.5, 1.5 / 2).d(2, 1),
    rect(3, 1.5, 1.5 / 2).d(0.5, 4),
  ).dy(0.5)

export const codeEditor = () =>
  rect(16, 16, 2).mask(
    rect(1, 20).dx(-4),
    codeLines(), //
  )

export const codeEditorLight = () =>
  layers(
    frame(),
    rect(0.5, 16).dx(-4),
    codeLines(), //
  )

export const document = () => {
  let c = 5
  let d = 6
  return layers(
    poly(
      pt(-6, -8),
      pt(6 - c, -8),
      pt(6, -8 + c),
      pt(6, 8),
      pt(-6, 8), //
    )
      .outline(1.5)
      .rounded(),
    line(
      pt(6 - d, -8),
      pt(6 - d, -8 + d),
      pt(6, -8 + d), //
    ).outline(1),
  )
}

export const sortable = () =>
  layers(
    layers(
      rect(12, 4, 1).dy(-6).clip(okStripes()),
      rect(12, 16, 1).outline(1.5),
      line(pt(-6, -4), pt(6, -4)).width(1),
      line(pt(-6, 0), pt(6, 0)).width(0.5),
      line(pt(-6, 4), pt(6, 4)).width(0.5),
    ).mask(rect(12, 4).d(4, 0)),
    rect(12, 4).d(4, 0).outline(1),
  )

export const progress = () => {
  const w = 16
  const h = 3
  const m = 3
  const p = 0.7
  return layers(
    rect(w * p, h, h / 3).dx(-(w * (1 - p)) / 2), //
    rect(w + m, h + m, h / 1.5).outline(1),
  )
}

export const textInput = () =>
  layers(
    mask(rect(18, 8, 2).outline(1.5), line(pt(-2, -7), pt(-2, 7)).width(5)),
    layers(
      line(pt(0, -7), pt(0, 7)).width(1.5),
      line(pt(-2, 8), pt(0, 7)).width(1.5),
      line(pt(0, 7), pt(2, 8)).width(1.5),
    )
      .rounded()
      .clone(s => s.scale(-1))
      .dx(-2),
  )

export const tag = () =>
  ((w = 8, h = 4, r = 2.7) =>
    poly(
      pt(-w, -h),
      pt(-w, h),
      pt(w - h, h),
      bz(pt(w - h + h * kappa, h), pt(w, h * kappa), pt(w, 0)),
      bz(pt(w, -h * kappa), pt(w - h + h * kappa, -h), pt(w - h, -h)),
    )
      .width(2)
      .rounded()
      .mask(circle(r).dx(w - h))
      .rotate(-45))()

export const sliders = () => {
  const handles = (r: number) => layers(...[3, -3, 1].map((x, i) => circle(r).d(x, -5 + i * 5)))
  return layers(
    line(pt(-8, 0), pt(8, 0))
      .width(1.5)
      .rounded()
      .array(3, (s, i) => s.dy(-5 + i * 5))
      .mask(handles(3)),
    handles(2),
  )
}

const okStripes = () => hstripes(2, 0.7).rotate(-45).dx(1.4)

export const virtual = () =>
  ((n: number) =>
    layers(
      line(pt(-n + 0.5, -10), pt(-n + 0.5, 10))
        .width(0.5)
        .array(4, (s, i) => s.rotate(i * 90)),
      rect(n * 2, n * 2, 1).outline(1),
      rect(n * 2, n * 2, 1).clip(okStripes()),
    ))(5.5)

export const pattern = () =>
  layers(
    gshape(8, 8, 6.5, 6.5).outline(1.5),
    gshape(8, 8, 6.5, 6.5).clip(okStripes()), //
  )

export const padding = () =>
  layers(
    rect(16, 16, 1).outline(1),
    rect(16, 16, 1)
      .clip(okStripes()) //
      .mask(rect(10, 10)),
  )

export const margin = () =>
  layers(
    rect(12, 12, 1).outline(1),
    rect(18, 18)
      .clip(okStripes()) //
      .mask(rect(12, 12, 1)),
  )

export const pulse = () =>
  line(...[0, 0, -8, 8, -4, 0, 0].map((y, i) => pt(-9 + 3 * i, y)))
    .rounded()
    .width(1.5)

export const reload = () =>
  layers(
    mask(circle(7).outline(2), pieSlice(30, 90, 15)),
    circle(1).dx(7).rotate(-30),
    poly(pt(0, -1), pt(1, 0), pt(0, 1))
      .scale(3)
      .width(1.5 / 3)
      .dy(-7)
      .rounded(),
  ).rotate(40)

export const reset = () => layers(reload().rotate(-40), smallCross().scale(0.7))

export const checkbox = () => layers(gshape(8, 8, 6.5, 6.5).outline(1), tick())

export const radioButton = () => layers(circle_().outline(1), circle_().scale(0.3))

export const trash = () =>
  layers(
    rect(12, 16, 2).mask(
      rect(12, 4).dy(-7),
      ...[-3, 0, 3].map(x => line(pt(x, -3), pt(x, 6)).outline(1)),
    ),
    rect(14, 2, 1).dy(-6.5),
    rect(5, 3, 1).dy(-7),
  )

export const inbox = () =>
  layers(
    poly(
      pt(-8, -4),
      pt(-4, -4),
      pt(-2, -1),
      pt(2, -1),
      pt(4, -4),
      pt(8, -4),
      pt(8, 3),
      pt(-8, 3),
      //
    ).width(1.5),
    line(
      pt(-8, -4),
      pt(-5, -10),
      pt(5, -10),
      pt(8, -4),
      //
    ).outline(1.2),
  )
    .dy(3)
    .rounded()

export const email = () =>
  layers(
    rect(16, 12, 1).outline(1.2).rounded(),
    line(
      pt(-8, -5),
      pt(0, 2),
      pt(8, -5), //
    ).width(1.2),
    line(pt(-8, 6), pt(-1.5, 0)).width(0.7),
    line(pt(8, 6), pt(1.5, 0)).width(0.7),
  )

export const module_ = () => {
  const v = 2
  const w = 4
  const h = 4.5
  const box = layers(
    poly(
      pt(0, 0),
      pt(w, -v),
      pt(w, -v - h),
      pt(0, -v - v - h),
      pt(-w, -v - h),
      pt(-w, -v),
      pt(0, 0),
    )
      .outline(1)
      .rounded(),
    line(pt(0, 0), pt(0, -h)).outline(0.6),
    line(pt(0, -h), pt(w, -v - h)).outline(0.6),
    line(pt(0, -h), pt(-w, -v - h)).outline(0.6),
  )

  return layers(
    box.d(0, 0),
    box.d(w, v + h),
    box.d(-w, v + h), //
  ).dy(1)
}

export const user = () => {
  return layers(
    circle(9).outline(1.5),
    circle(6).dy(8).clip(circle(9)).mask(circle(4).dy(-1).outline(3)),
    circle(4).dy(-1),
  )
}

export const explore = () => {
  return layers(
    circle(10).mask(
      poly(
        pt(-4, 0),
        pt(0, 9),
        pt(4, 0), //
      )
        .clone(a => a.rotate(180))
        .mask(circle(2))
        .rotate(25),
    ),
  )
}

export const exploreOpen = () => {
  return layers(
    circle(10).outline(0.8),
    poly(
      pt(-4, 0),
      pt(0, 9),
      pt(4, 0), //
    )
      .clone(a => a.rotate(180))
      .mask(circle(2))
      .rotate(25),
  )
}

export const folder = () => {
  return layers(
    rect(16, 12, 2),
    rect(4, 4, 1).d(-5, -6),
    poly(
      pt(-4, -6),
      pt(-4, -8),
      pt(0, -8),
      pt(1, -6), //
    ),
  )
    .mask(line(pt(-6, 0), pt(6, 0)).dy(-4).width(1).rounded())
    .dy(1)
}

export const folderOpen = () => {
  return layers(
    rect(15, 12, 2).dx(-0.5).mask(rect(4, 4).d(-5, -2)),
    rect(14, 9, 2).d(1, 1.5),
    rect(4, 4, 1).d(-5, -6),
    poly(
      pt(-4, -6),
      pt(-4, -8),
      pt(0, -8),
      pt(1, -6), //
    ),
  )
    .dx(1)
    .mask(
      line(pt(-5, 0), pt(6, 0)).d(0, -4).width(2).rounded(),
      line(pt(0, -4), pt(0, 4)).d(-5.5, 0).width(1).rounded(),
    )
    .d(-1, 1)
}

export const home = () => {
  return layers(
    rect(12, 10, 1).mask(rect(4, 10, 1).d(0, 5)).dy(1), //
    poly(pt(-7, 0), pt(0, -7), pt(7, 0)).width(2).rounded().dy(-2),
    rect(3, 6, 1).d(4.5, -6),
  )
    .mask(line(pt(-7, 0), pt(0, -7), pt(7, 0)).rounded().outline(1))
    .dy(2)
}

export const cloud = () =>
  path(
    'M9.58161941,19.0645124 C13.6454502,19.0645124 16.962862,19.0645124 20.8282884,19.0645124 C24.4481964,19.0645124 24.7198375,13.6039632 20.8282884,13.3605766 C21.4802505,9.37840224 15.2608766,5.555672 12.3018408,11.2287741 C10.6578369,9.59094238 8.64412344,11.0461426 8.64412344,12.9373463 C5.46895888,13.7112285 5.51778862,19.0645124 9.58161941,19.0645124 Z',
  )
    .d(-15, -13.5)
    .scale(1.1)

export const cloudOpen = () => cloud().outline(1.3).rounded()

export const cloudUpload = () =>
  layers(
    cloudOpen().mask(rect(10, 10).d(0, 5)),
    arrowUp().scale(0.5).width(5).dy(5), //
  )

export const cloudDownload = () =>
  layers(
    cloudOpen().mask(rect(10, 10).d(0, 5)),
    arrowDown().scale(0.5).width(5).dy(5), //
  )

export const expression = () => text('e:τ', 100, 'Ubuntu Mono, Monaco, Courier').scale(0.9).dx(0.5)

// ----------------------------------------------------------------------------

export const Empty = Icon.make('empty', empty)
export const Square = Icon.make('square', square)
export const Blob = Icon.make('blob', blob)
export const Circle = Icon.make('circle', circle_)
export const Half = Icon.make('half', half)
export const Marker = Icon.make('marker', marker)
export const Ellipse = Icon.make('ellipse', ellipse)
export const Triangle = Icon.make('triangle', triangle)
export const Dot = Icon.make('dot', dot)
export const Ring = Icon.make('ring', ring)
export const Target = Icon.make('target', target)
export const Asterisk = Icon.make('asterisk', asterisk)
export const CaretRight = Icon.make('caretRight', caretRight)
export const CaretLeft = Icon.make('caretLeft', caretLeft)
export const CaretUp = Icon.make('caretUp', caretUp)
export const CaretDown = Icon.make('caretDown', caretDown)
export const ChevronRight = Icon.make('chevronRight', chevronRight)
export const ChevronLeft = Icon.make('chevronLeft', chevronLeft)
export const ChevronUp = Icon.make('chevronUp', chevronUp)
export const ChevronDown = Icon.make('chevronDown', chevronDown)
export const Slash = Icon.make('slash', slash)
export const Backslash = Icon.make('backslash', backslash)
export const Dash = Icon.make('dash', dash)
export const Pipe = Icon.make('pipe', pipe)
export const ArrowRight = Icon.make('arrowRight', arrowRight)
export const ArrowLeft = Icon.make('arrowLeft', arrowLeft)
export const ArrowUp = Icon.make('arrowUp', arrowUp)
export const ArrowDown = Icon.make('arrowDown', arrowDown)
export const DoubleChevronRight = Icon.make('doubleChevronRight', doubleChevronRight)
export const DoubleChevronLeft = Icon.make('doubleChevronLeft', doubleChevronLeft)
export const DoubleChevronUp = Icon.make('doubleChevronUp', doubleChevronUp)
export const DoubleChevronDown = Icon.make('doubleChevronDown', doubleChevronDown)
export const Minus = Icon.make('minus', minus)
export const Plus = Icon.make('plus', plus)
export const SmallPlus = Icon.make('smallPlus', smallPlus)
export const Cross = Icon.make('cross', cross)
export const SmallCross = Icon.make('smallCross', smallCross)
export const Tick = Icon.make('tick', tick)
export const Halt = Icon.make('halt', halt)
export const Add = Icon.make('add', add)
export const Del = Icon.make('del', del)
export const Alert = Icon.make('alert', alert)
export const Help = Icon.make('help', help)
export const Warning = Icon.make('warning', warning)
export const HaltOpen = Icon.make('haltOpen', haltOpen)
export const AddOpen = Icon.make('addOpen', addOpen)
export const DelOpen = Icon.make('delOpen', delOpen)
export const AlertOpen = Icon.make('alertOpen', alertOpen)
export const HelpOpen = Icon.make('helpOpen', helpOpen)
export const Play = Icon.make('play', play)
export const PlayPause = Icon.make('playPause', playPause)
export const Pause = Icon.make('pause', pause)
export const Stop = Icon.make('stop', stop)
export const Rewind = Icon.make('rewind', rewind)
export const FastForward = Icon.make('fastForward', fastForward)
export const PlayNext = Icon.make('playNext', playNext)
export const PlayPrev = Icon.make('playPrev', playPrev)
export const Eject = Icon.make('eject', eject)
export const Repeat = Icon.make('repeat', repeat)
export const Record = Icon.make('record', record)
export const LeftRight = Icon.make('leftRight', leftRight)
export const UpDown = Icon.make('upDown', upDown)
export const RightLeft = Icon.make('rightLeft', rightLeft)
export const DownUp = Icon.make('downUp', downUp)
export const Splith = Icon.make('splith', splith)
export const Splitv = Icon.make('splitv', splitv)
export const Joinh = Icon.make('joinh', joinh)
export const Joinv = Icon.make('joinv', joinv)
export const Camera = Icon.make('camera', camera)
export const Grid = Icon.make('grid', grid)
export const Settings6 = Icon.make('settings6', settings6)
export const Settings8 = Icon.make('settings8', settings8)
export const MapMarker = Icon.make('mapMarker', mapMarker)
export const MapMarkerO = Icon.make('mapMarkerO', mapMarkerO)
export const Globe = Icon.make('globe', globe)
export const Globe1 = Icon.make('globe1', globe1)
export const Star = Icon.make('star', star)
export const StarOpen = Icon.make('starOpen', starOpen)
export const Star6 = Icon.make('star6', star6)
export const Star6Open = Icon.make('star6Open', star6Open)
export const Nautical = Icon.make('nautical', nautical)
export const Scissors = Icon.make('scissors', scissors)
export const Lock = Icon.make('lock', lock)
export const LockOpen = Icon.make('lockOpen', lockOpen)
export const Ellipses = Icon.make('ellipses', ellipses)
export const Hamburger = Icon.make('hamburger', hamburger)
export const Dots = Icon.make('dots', dots)
export const Eye = Icon.make('eye', eye)
export const Contrast = Icon.make('contrast', contrast)
export const LowContrast = Icon.make('lowContrast', lowContrast)
export const Bright = Icon.make('bright', bright)
export const Dim = Icon.make('dim', dim)
export const Frame = Icon.make('frame', frame)
export const Rows = Icon.make('rows', rows)
export const Columns = Icon.make('columns', columns)
export const Hsplit = Icon.make('hsplit', hsplit)
export const Vsplit = Icon.make('vsplit', vsplit)
export const Splits = Icon.make('splits', splits)
export const Table = Icon.make('table', table)
export const Dialog = Icon.make('dialog', dialog)
export const Tabs = Icon.make('tabs', tabs)
export const TerminalLight = Icon.make('terminalLight', terminalLight)
export const Terminal = Icon.make('terminal', terminal)
export const CodeEditor = Icon.make('codeEditor', codeEditor)
export const CodeEditorLight = Icon.make('codeEditorLight', codeEditorLight)
export const Document = Icon.make('document', document)
export const Button = Icon.make('button', button)
export const Sortable = Icon.make('sortable', sortable)
export const Progress = Icon.make('progress', progress)
export const Search = Icon.make('search', search)
export const ZoomIn = Icon.make('zoomIn', zoomIn)
export const ZoomOut = Icon.make('zoomOut', zoomOut)
export const Resize = Icon.make('resize', resize)
export const Virtual = Icon.make('virtual', virtual)
export const Sliders = Icon.make('sliders', sliders)
export const Pattern = Icon.make('pattern', pattern)
export const Padding = Icon.make('padding', padding)
export const Margin = Icon.make('margin', margin)
export const Pulse = Icon.make('pulse', pulse)
export const Balloon = Icon.make('balloon', balloon)
export const TextInput = Icon.make('textInput', textInput)
export const Tag = Icon.make('tag', tag)
export const Reload = Icon.make('reload', reload)
export const Reset = Icon.make('reset', reset)
export const Checkbox = Icon.make('checkbox', checkbox)
export const RadioButton = Icon.make('radioButton', radioButton)
export const Trash = Icon.make('trash', trash)
export const Inbox = Icon.make('inbox', inbox)
export const Email = Icon.make('email', email)
export const Module = Icon.make('module', module_)
export const Expression = Icon.make('expression', expression)
export const User = Icon.make('user', user)
export const Explore = Icon.make('explore', explore)
export const ExploreOpen = Icon.make('exploreOpen', exploreOpen)
export const Folder = Icon.make('folder', folder)
export const FolderOpen = Icon.make('folderOpen', folderOpen)
export const Home = Icon.make('home', home)
export const Cloud = Icon.make('cloud', cloud)
export const CloudOpen = Icon.make('cloudOpen', cloudOpen)
export const CloudUpload = Icon.make('cloudUpload', cloudUpload)
export const CloudDownload = Icon.make('cloudDownload', cloudDownload)
export const Github = Icon.make('github', github)
export const Twitter = Icon.make('twitter', twitter)
export const Google = Icon.make('google', google)

// By name for easy auto-completion

export const Icons = {
  Empty,
  Square,
  Blob,
  Circle,
  Half,
  Marker,
  Ellipse,
  Triangle,
  Dot,
  Ring,
  Target,
  Asterisk,
  CaretRight,
  CaretLeft,
  CaretUp,
  CaretDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Slash,
  Backslash,
  Dash,
  Pipe,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  DoubleChevronRight,
  DoubleChevronLeft,
  DoubleChevronUp,
  DoubleChevronDown,
  Minus,
  Plus,
  SmallPlus,
  Cross,
  SmallCross,
  Tick,
  Halt,
  Add,
  Del,
  Alert,
  Help,
  Warning,
  HaltOpen,
  AddOpen,
  DelOpen,
  AlertOpen,
  HelpOpen,
  Play,
  PlayPause,
  Pause,
  Stop,
  Rewind,
  FastForward,
  PlayPrev,
  PlayNext,
  Eject,
  Repeat,
  Record,
  LeftRight,
  UpDown,
  RightLeft,
  DownUp,
  Splith,
  Splitv,
  Joinh,
  Joinv,
  Camera,
  Grid,
  Settings6,
  Settings8,
  MapMarker,
  MapMarkerO,
  Globe,
  Globe1,
  Star,
  StarOpen,
  Star6,
  Star6Open,
  Nautical,
  Scissors,
  Lock,
  LockOpen,
  Ellipses,
  Hamburger,
  Dots,
  Eye,
  Contrast,
  LowContrast,
  Bright,
  Dim,
  Frame,
  Rows,
  Columns,
  Hsplit,
  Vsplit,
  Splits,
  Table,
  Dialog,
  Tabs,
  TerminalLight,
  Terminal,
  CodeEditor,
  CodeEditorLight,
  Document,
  Button,
  Sortable,
  Progress,
  Search,
  ZoomIn,
  ZoomOut,
  Resize,
  Virtual,
  Sliders,
  Pattern,
  Padding,
  Margin,
  Pulse,
  Balloon,
  TextInput,
  Tag,
  Reload,
  Reset,
  Checkbox,
  RadioButton,
  Trash,
  Inbox,
  Email,
  Module,
  Expression,
  User,
  Explore,
  ExploreOpen,
  Folder,
  FolderOpen,
  Home,
  Cloud,
  CloudOpen,
  CloudUpload,
  CloudDownload,
  Github,
  Twitter,
  Google,
}

export type IconName = keyof typeof Icons
