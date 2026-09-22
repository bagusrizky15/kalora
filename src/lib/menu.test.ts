import { expect, test } from 'vitest'
import { calc, type Input } from './calc'
import { genMenu } from './menu'

const base: Input = { usia: 30, jk: 'L', tinggi: 170, berat: 80, aktivitas: 'light', tujuan: 'cutting', langkah: 'moderat', preset: 'moderate', protein: 1.8, hamil: false }
const profiles: Input[] = [
  base,
  { ...base, jk: 'P', berat: 55, tinggi: 158, usia: 28, aktivitas: 'sedentary' },
  { ...base, tujuan: 'bulking', berat: 65, aktivitas: 'heavy' },
  { ...base, tujuan: 'maintain', berat: 95, tinggi: 180, preset: 'higher' },
  { ...base, jk: 'P', berat: 62, preset: 'lower', tujuan: 'bulking', langkah: 'agresif' },
]
const filters = [
  { halal: true, veg: false, alergi: [], anggaran: 3 },
  { halal: true, veg: true, alergi: ['susu'], anggaran: 3 },
  { halal: true, veg: false, alergi: ['ikan', 'udang'], anggaran: 1 },
]

test('menu dalam ±5% kalori dan ±10% protein', () => {
  let bad = 0, n = 0
  for (const p of profiles) for (const f of filters) for (let s = 0; s < 20; s++) {
    const r = calc(p)
    const m = genMenu({ kcal: r.target, p: r.macro.p }, f, s)!
    n++
    if (Math.abs(m.total.kcal / r.target - 1) > 0.05 || Math.abs(m.total.p / r.macro.p - 1) > 0.1) bad++
  }
  expect(bad / n).toBeLessThanOrEqual(0.05)
})
test('filter menghormati alergi', () => {
  const m = genMenu({ kcal: 2000, p: 100 }, { halal: true, veg: false, alergi: ['telur', 'ikan'], anggaran: 3 }, 3)!
  expect(m.meals.flatMap(x => x.items).some(i => i.food.alergen.some(a => ['telur', 'ikan'].includes(a)))).toBe(false)
})
