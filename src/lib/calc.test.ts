import { expect, test } from 'vitest'
import { calc, blocker, type Input } from './calc'

const base: Input = { usia: 30, jk: 'L', tinggi: 170, berat: 80, aktivitas: 'light', tujuan: 'cutting', langkah: 'moderat', preset: 'moderate', protein: 1.8, hamil: false }

test('Mifflin-St Jeor + TDEE', () => {
  const r = calc(base)
  expect(r.bmr).toBe(1718) // 800+1062.5-150+5 = 1717.5
  expect(r.tdee).toBe(2362)
  expect(r.target).toBe(2062)
})
test('Katch-McArdle bila lemak diisi', () => {
  expect(calc({ ...base, lemak: 20 }).bmr).toBe(1752)
})
test('target tidak di bawah batas minimum', () => {
  const r = calc({ ...base, jk: 'P', berat: 50, tinggi: 150, usia: 45, aktivitas: 'sedentary', langkah: 'agresif' })
  expect(r.target).toBeGreaterThanOrEqual(1200)
  expect(r.raised).toBe(true)
})
test('makro menjumlah ke target', () => {
  const r = calc(base)
  const k = r.macro.p * 4 + r.macro.f * 9 + r.macro.c * 4
  expect(Math.abs(k - r.target)).toBeLessThan(10)
})
test('pemblokiran', () => {
  expect(blocker({ ...base, usia: 17 })).toBeTruthy()
  expect(blocker({ ...base, hamil: true })).toBeTruthy()
  expect(blocker({ ...base, berat: 45, tinggi: 175 })).toBeTruthy() // BMI<18.5 cutting
  expect(blocker(base)).toBeNull()
})
