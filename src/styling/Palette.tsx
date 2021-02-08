import { Iso } from '@/data/Iso'
import { Rgba, rgba } from './Rgba'

export interface Palette {
  name: string

  Bg: Rgba
  Fg: Rgba
  Hover: Rgba

  Shade: () => Palette
  Primary: () => Palette
  Contrast: () => Palette

  Black: Rgba
  White: Rgba

  Yellow: Rgba
  Orange: Rgba
  Red: Rgba
  Rose: Rgba
  Magenta: Rgba
  Purple: Rgba
  Indigo: Rgba
  Blue: Rgba
  Cyan: Rgba
  Aqua: Rgba
  Green: Rgba
  Lime: Rgba
}

const DefaultColors = {
  Black: Rgba.Black,
  White: Rgba.White,
  Yellow: rgba(255, 193, 7),
  Orange: rgba(255, 145, 0),
  Red: rgba(208, 70, 0),
  Rose: rgba(249, 99, 192),
  Magenta: rgba(233, 32, 99),
  Purple: rgba(95, 71, 144),
  Indigo: rgba(17, 95, 125),
  Blue: rgba(55, 166, 216), //   rgba(0, 161, 214),
  Cyan: rgba(0, 214, 196),
  Aqua: rgba(0, 122, 112),
  Green: rgba(76, 174, 79),
  Lime: rgba(205, 220, 57),
}

export const Shade = (p: Palette) => p.Shade()
export const Contrast = (p: Palette) => p.Contrast()
export const Primary = (p: Palette) => p.Primary()

// ----------------------------------------------------------------------------

export const LightGray = rgba(241, 243, 244)
export const DarkBlue = rgba(7, 50, 64)

export const Arctic: Palette = {
  name: 'arctic',
  ...DefaultColors,

  Bg: Rgba.White,
  Fg: Rgba.Black.alpha(0.7),
  Hover: LightGray,

  Shade: () => Fog,
  Primary: () => Day,
  Contrast: () => Ocean,
}

export const Fog: Palette = {
  name: 'fog',
  ...DefaultColors,

  Bg: LightGray,
  Fg: Rgba.Black.alpha(0.8),
  Hover: Rgba.Black.alpha(0.05),

  Shade: () => Arctic,
  Primary: () => Night,
  Contrast: () => Night,
}

export const Day: Palette = {
  name: 'sky',
  ...DefaultColors,

  Bg: DefaultColors.Blue,
  Fg: Rgba.White.alpha(0.9),
  Hover: DefaultColors.Blue.darken(0.1),

  Shade: () => Night,
  Primary: () => Ocean,
  Contrast: () => Ocean,
}

export const Night: Palette = {
  name: 'night',
  ...DefaultColors,

  Bg: rgba(20, 77, 99, 1), //DefaultColors.Indigo,
  Fg: Rgba.White.alpha(0.7),
  Hover: rgba(20, 77, 99, 1).mix(Rgba.White, 0.07),
  Blue: rgba(56, 192, 210),
  Green: Rgba.fromHex('#8BC34A'),
  Red: rgba(226, 108, 62),

  Shade: () => Ocean,
  Primary: () => Desert,
  Contrast: () => Fog,
}

export const Ocean: Palette = {
  name: 'ocean',
  ...DefaultColors,

  Bg: DarkBlue,
  Fg: Rgba.White.alpha(0.7),
  Hover: rgba(22, 71, 86).darken(0.1),
  Blue: Rgba.fromHex('#00bcd4'),
  Green: Rgba.fromHex('#8BC34A'),
  Red: rgba(242, 109, 57),

  Shade: () => Night,
  Primary: () => Desert,
  Contrast: () => Arctic,
}

export const Cavern: Palette = {
  name: 'cavern',
  ...DefaultColors,

  Bg: DarkBlue.darken(0.3),
  Fg: Rgba.White.alpha(0.7),
  Hover: rgba(22, 71, 86),
  Blue: Rgba.fromHex('#00bcd4'),

  Shade: () => Ocean,
  Primary: () => Desert,
  Contrast: () => Arctic,
}

export const Desert: Palette = {
  name: 'desert',
  ...DefaultColors,

  Bg: DefaultColors.Yellow,
  Fg: rgba(7, 50, 64),
  Hover: DefaultColors.Yellow.darken(0.07),

  Shade: () => Desert,
  Primary: () => Night,
  Contrast: () => Ocean,
}

export const Lava: Palette = {
  name: 'lava',
  ...DefaultColors,

  Bg: DefaultColors.Red,
  Fg: Rgba.White.alpha(0.9),
  Hover: DefaultColors.Red.darken(0.07),

  Shade: () => Lava,
  Primary: () => Arctic,
  Contrast: () => Ocean,
}

export const Palettes = [
  Arctic,
  Fog,
  Day,
  Night,
  Ocean,
  Cavern,
  Desert,
  Lava, //
]

export const paletteByName = new Iso<Palette, string>(
  t => t.name,
  name => Palettes.filter(t => t.name === name)[0],
)
