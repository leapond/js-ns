import ns from "../src"

let p = {p0: 999}, pd = Object.create(p), s = Symbol('x')

Object.assign(pd, {
  p1: 888
})

let t = {
  a: {
    b: [{
      x: 1,
      y: new Map([['m1', 2020], ['m2', {m: 0}]]),
      z: Object.create(p)
    }],
    'x.y': 1,
    [s]: 10
  }
}
test('get simple', () => {
  expect(ns(p, 'p0')).toBe(999)
})
test('get deep', () => {
  expect(ns(t, 'a.b.0.y.m1')).toBe(2020)
})
test('get deep with special path', () => {
  expect(ns(t, ['a', 'x.y'])).toBe(1)
  expect(ns(t, ['a', s])).toBe(10)
})


test('set simple', () => {
  ns(p, 'p0', 9)
  expect(p.p0).toBe(9)
  let d = ns(p, {path: 'p0', detailedResult: true}, 999)
  expect(d.value).toBe(999)
  expect(d.success).toBe(true)
  expect(d.parent).toBe(p)
})
test('set deep', () => {
  ns(t, 'a.b.0.y.m1', 2022)
  expect(t.a.b[0].y.get('m1')).toBe(2022)
  ns(t, 'a.b.0.y.m2.m', -1)
  expect(t.a.b[0].y.get('m2').m).toBe(-1)
})
test('get deep with special path', () => {
  ns(t, ['a', 'x.y'], -1)
  expect(t.a['x.y']).toBe(-1)

  ns(t, ['a', s], -10)
  expect(t.a[s]).toBe(-10)
})

test('mustOwn', () => {
  expect(ns(pd, 'p0')).toBe(999)
  expect(ns(pd, 'p1')).toBe(888)
  expect(ns(pd, {path: 'p0', mustOwn: true})).toBe(undefined)
})


test('batch', () => {
  let r = ns(t, {paths: ['a.b.0.y.m1', 'a.b.0.y.m2.m']})
  expect(r[0] === 2022 && r[1] === -1).toBe(true)
})