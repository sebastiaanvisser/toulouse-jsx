// import { Falsy } from '@/styling/Css'

import { px } from '@/styling/Css'
import { range } from './Range'

export class Point {
  constructor(
    readonly x: number,
    readonly y: number, //
  ) {}

  copy() {
    return new Point(this.x, this.y)
  }

  add(o: Point) {
    return pt(this.x + o.x, this.y + o.y)
  }

  sub(o: Point) {
    return pt(this.x - o.x, this.y - o.y)
  }

  distance(o: Point) {
    return Math.sqrt(Math.pow(o.x - this.x, 2) + Math.pow(o.y - this.y, 2))
  }

  insideOf(r: Rect): boolean {
    return (
      this.x >= r.left &&
      this.x <= r.right &&
      this.y >= r.top && //
      this.y <= r.bottom
    )
  }

  static atAngle = (deg: number, r = 1) =>
    pt(
      r * Math.cos((deg / 180) * Math.PI),
      -r * Math.sin((deg / 180) * Math.PI), //
    )
}

export const pt = (x: number, y: number) => new Point(x, y)

// ----------------------------------------------------------------------------

export class BezierPoint {
  constructor(
    readonly c: Point,
    readonly d: Point,
    readonly p: Point, //
  ) {}

  copy = () => new BezierPoint(this.c, this.d, this.p)
}

export const bz = (c: Point, d: Point, p: Point) => new BezierPoint(c, d, p)

// ----------------------------------------------------------------------------

export class Position {
  constructor(
    readonly left: number,
    readonly top: number, //
  ) {}

  copy() {
    return new Position(this.left, this.top)
  }

  get asPoint() {
    return pt(this.left, this.top)
  }

  add(pos: Position) {
    return position(
      this.left + pos.left,
      this.top + pos.top, //
    )
  }

  dx(x: number) {
    return position(this.left + x, this.top)
  }

  dy(y: number) {
    return position(this.left, this.top + y)
  }

  clamp(g: Geom) {
    return position(
      g.horizontally.clamp(this.left),
      g.vertically.clamp(this.top), //
    )
  }

  get negate() {
    return position(-this.left, -this.top)
  }

  static origin = new Position(0, 0)

  static combine = (topLeft: Position, bottomRight: Position) =>
    rect(
      topLeft.left,
      topLeft.top,
      bottomRight.left,
      bottomRight.top, //
    )
}

export const position = (left: number, top: number) => new Position(left, top)

// ----------------------------------------------------------------------------

export class Rect {
  constructor(
    readonly left: number,
    readonly top: number,
    readonly right: number,
    readonly bottom: number,
  ) {}

  copy() {
    return new Rect(this.left, this.top, this.right, this.bottom)
  }

  add(r: Rect) {
    return new Rect(
      this.left + r.left,
      this.top + r.top,
      this.right + r.right,
      this.bottom + r.bottom, //
    )
  }

  get asSides(): Sides {
    const { left, top, right, bottom } = this
    if (left === 0 && top === 0 && right === 0 && bottom === 0) return new Sides(undefined)
    if (left === top && left === right && left === bottom) return new Sides(left)
    if (left === right && top === 0 && bottom === 0) return new Sides({ h: left })
    if (top === bottom && left === 0 && right === 0) return new Sides({ v: top })
    if (left === right && top === bottom) return new Sides({ h: left, v: top })
    return new Sides(this)
  }

  get asGeom() {
    return geom(
      this.left,
      this.top,
      this.right - this.left,
      this.bottom - this.top, //
    )
  }

  get normalized() {
    return rect(
      Math.min(this.left, this.right),
      Math.min(this.top, this.bottom),
      Math.max(this.left, this.right),
      Math.max(this.top, this.bottom),
    )
  }

  get width() {
    return this.right - this.left
  }

  get height() {
    return this.bottom - this.top
  }

  setLeft(left: number) {
    return rect(left, this.top, this.right, this.bottom)
  }

  setTop(top: number) {
    return rect(this.left, top, this.right, this.bottom)
  }

  setRight(right: number) {
    return rect(this.left, this.top, right, this.bottom)
  }

  setBottom(bottom: number) {
    return rect(this.left, this.top, this.right, bottom)
  }

  get centroid(): Point {
    return pt((this.left + this.right) / 2, (this.top + this.bottom) / 2)
  }

  place(at: Point): Rect {
    return rect(at.x, at.y, at.x + this.width, at.y + this.height)
  }

  move(delta: Point): Rect {
    return rect(
      this.left + delta.x,
      this.top + delta.y,
      this.right + delta.x,
      this.bottom + delta.y,
    )
  }

  get horizontal() {
    return range(this.left, this.right)
  }

  get vertical() {
    return range(this.top, this.bottom)
  }

  contains(b: Rect): boolean {
    const hor = this.horizontal
    const ver = this.vertical
    const x = hor.within(b.left) && hor.within(b.right)
    const y = ver.within(b.top) && ver.within(b.bottom)
    return x && y
  }

  get surface() {
    return this.width * this.height
  }

  margin(m: number): Rect {
    return rect(this.left - m, this.top - m, this.right + m, this.bottom + m)
  }

  clip(c: Rect): Rect {
    return rect(
      Math.max(this.left, c.left),
      Math.max(this.top, c.top),
      Math.min(this.right, c.right),
      Math.min(this.bottom, c.bottom),
    )
  }

  get topLeft(): Position {
    return position(this.left, this.top)
  }

  get topRight(): Position {
    return position(this.right, this.top)
  }

  get bottomLeft(): Position {
    return position(this.left, this.bottom)
  }

  get bottomRight(): Position {
    return position(this.right, this.bottom)
  }

  intersect(b: Rect): Rect | undefined {
    const c = rect(
      Math.max(this.left, b.left),
      Math.max(this.top, b.top),
      Math.min(this.right, b.right),
      Math.min(this.bottom, b.bottom),
    )
    return c.right - c.left <= 0 || c.bottom - c.top <= 0 ? undefined : c
  }

  atLeft(g: Rect): Rect {
    return rect(g.left - this.width, this.top, g.left, this.bottom)
  }

  atTop(g: Rect): Rect {
    return rect(this.left, g.top - this.height, this.right, g.top)
  }

  atRight(g: Rect): Rect {
    return rect(g.right, this.top, g.right + this.width, this.bottom)
  }

  atBottom(g: Rect): Rect {
    return rect(this.left, g.bottom, this.right, g.bottom + this.height)
  }

  // Move to constraint?
  around(a: Rect): Rect[] {
    return [
      this.atLeft(a),
      this.atTop(a),
      this.atRight(a),
      this.atBottom(a), //
    ]
  }

  similarity(b: Rect) {
    const d0 = this.topLeft.asPoint.distance(b.topLeft.asPoint)
    const d1 = this.topRight.asPoint.distance(b.topRight.asPoint)
    const d2 = this.bottomLeft.asPoint.distance(b.bottomLeft.asPoint)
    const d3 = this.bottomRight.asPoint.distance(b.bottomRight.asPoint)
    return (d0 + d1 + d2 + d3) / 4
  }

  diff(b: Rect): Rect {
    return rect(b.left - this.left, b.top - this.top, b.right - this.right, b.bottom - this.bottom)
  }

  static fromJson(json: any) {
    const { left, top, right, bottom } = json
    return rect(left, top, right, bottom)
  }

  toJson() {
    const { left, top, right, bottom } = this
    return { left, top, right, bottom }
  }
}

export const rect = (left: number, top: number, right: number, bottom: number) =>
  new Rect(left, top, right, bottom)

// ----------------------------------------------------------------------------

export class Interval {
  constructor(
    readonly from: number,
    readonly to: number, //
  ) {}

  copy() {
    return new Interval(this.from, this.to)
  }

  get normalized() {
    return interval(Math.min(this.from, this.to), Math.max(this.from, this.to))
  }

  get asSpan() {
    return span(this.from, this.to - this.from)
  }
}

export const interval = (from: number, to: number) => new Interval(from, to)

// ----------------------------------------------------------------------------

export class Span {
  constructor(
    readonly start: number,
    readonly size: number, //
  ) {}

  copy() {
    return new Span(this.start, this.size)
  }

  get end() {
    return this.start + this.size
  }

  get enum(): number[] {
    const out: number[] = []
    const { start, end } = this
    for (let x = start; x < end; x++) out.push(x)
    return out
  }

  iterate<A>(f: (n: number, ix: number) => A): A[] {
    return this.enum.map(f)
  }

  clamp(n: number) {
    return Math.min(Math.max(this.start, n), this.end - 1)
  }

  d(d: number) {
    return span(this.start + d, this.size)
  }

  grow(d: number) {
    return span(this.start, this.size + d)
  }

  contains(i: number) {
    return i >= this.start && i < this.end
  }

  intersect(that: Span) {
    const start = Math.max(this.start, that.start)
    const end = Math.min(this.end, that.end)
    return span(start, end - start)
  }

  static combine(h: Span, v: Span): Geom {
    return geom(h.start, v.start, h.size, v.size)
  }
}

export const span = (start: number, size: number) => new Span(start, size)

// ----------------------------------------------------------------------------

export class Geom {
  constructor(
    readonly left: number,
    readonly top: number,
    readonly width: number,
    readonly height: number,
  ) {}

  copy() {
    return new Geom(this.left, this.top, this.width, this.height)
  }

  get rect() {
    return rect(
      this.left,
      this.top,
      this.left + this.width,
      this.top + this.height, //
    )
  }

  get right() {
    return this.left + this.width
  }

  get bottom() {
    return this.top + this.height
  }

  contains(p: Position) {
    return p.left >= this.left && p.top >= this.top && p.left < this.right && p.top < this.bottom
  }

  add(pos: Position) {
    return geom(
      this.left + pos.left,
      this.top + pos.top,
      this.width,
      this.height, //
    )
  }

  dx(x: number) {
    return geom(this.left + x, this.top, this.width, this.height)
  }

  dy(y: number) {
    return geom(this.left, this.top + y, this.width, this.height)
  }

  grow(width: number, height: number) {
    return geom(
      this.left,
      this.top,
      this.width + width,
      this.height + height, //
    )
  }

  margin(m: number) {
    return geom(
      this.left - m,
      this.top - m,
      this.width + m * 2,
      this.height + m * 2, //
    )
  }

  sub(pos: Position) {
    return this.add(pos.negate)
  }

  intersect(b: Geom): Geom | undefined {
    return this.rect.intersect(b.rect)?.asGeom
  }

  get horizontally() {
    return span(this.left, this.width)
  }

  get vertically() {
    return span(this.top, this.height)
  }

  mapHorizontally(f: (span: Span) => Span): Geom {
    return Span.combine(f(this.horizontally), this.vertically)
  }

  mapVertically(f: (span: Span) => Span): Geom {
    return Span.combine(this.horizontally, f(this.vertically))
  }

  get topLeft(): Position {
    return position(this.left, this.top)
  }

  get topRight(): Position {
    return position(this.right, this.top)
  }

  get bottomLeft(): Position {
    return position(this.left, this.bottom)
  }

  get bottomRight(): Position {
    return position(this.right, this.bottom)
  }

  clip(c: Geom): Geom {
    return this.rect.clip(c.rect).asGeom
  }

  static fromJson(json: any) {
    const { left, top, width, height } = json
    return geom(left, top, width, height)
  }

  toJson() {
    const { left, top, width, height } = this
    return { left, top, width, height }
  }
}

export const geom = (left: number, top: number, width: number, height: number) =>
  new Geom(left, top, width, height)

// ----------------------------------------------------------------------------

export type SidesDef =
  | undefined
  | number
  | true
  | { h: number }
  | { v: number }
  | { h: number; v: number }
  | Rect

export class Sides {
  constructor(readonly def: SidesDef) {}

  copy() {
    return new Sides(this.def)
  }

  get asRect(): Rect {
    const d = this.def
    if (!d) return new Rect(0, 0, 0, 0)
    if (d === true) return new Rect(10, 10, 10, 10)
    if (typeof d === 'number') return new Rect(d, d, d, d)
    if ('h' in d && 'v' in d) return new Rect(d.h, d.v, d.h, d.v)
    if ('h' in d) return new Rect(d.h, 0, d.h, 0)
    if ('v' in d) return new Rect(0, d.v, 0, d.v)
    return d
  }

  add(s: Sides): Sides {
    return this.asRect.add(s.asRect).asSides
  }

  render(): string | undefined {
    const d = this.def
    if (!d) return
    if (d === true) return px(10)
    if (typeof d === 'number') return px(d)
    if ('h' in d && 'v' in d) return [d.v, d.h].map(px).join(' ')
    if ('h' in d) return [0, d.h].map(px).join(' ')
    if ('v' in d) return [d.v, 0].map(px).join(' ')
    return [d.top, d.right, d.bottom, d.left].map(px).join(' ')
  }
}

// ----------------------------------------------------------------------------

export class Dimensions {
  constructor(
    readonly width: number,
    readonly height: number, //
  ) {}

  copy() {
    return new Dimensions(this.width, this.height)
  }

  at(p: Position): Geom {
    return geom(p.left, p.top, this.width, this.height)
  }
}

export const dimensions = (width: number, height: number) => new Dimensions(width, height)
