import { FOODS, type Food } from './foods'

export type Filters = { halal: boolean; veg: boolean; alergi: string[]; anggaran: number }
export type Item = { food: Food; porsi: number; g: number; kcal: number; p: number; f: number; c: number }
export type Meal = { nama: string; items: Item[]; kcal: number; p: number; f: number; c: number }

const MEALS: [string, number][] = [['Sarapan', 0.25], ['Selingan pagi', 0.075], ['Makan siang', 0.3], ['Selingan sore', 0.075], ['Makan malam', 0.3]]

function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const item = (food: Food, porsi: number): Item => {
  const g = food.g * porsi, k = g / 100
  return { food, porsi, g, kcal: food.kcal * k, p: food.p * k, f: food.f * k, c: food.c * k }
}
const per = (f: Food) => item(f, 1)
const q = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Math.round(x * 4) / 4))

// Cari porsi a (utama) dan b (pendamping) yang memenuhi kalori K dan protein P; sisanya dari item tetap.
function solve(a: Food, b: Food, K: number, P: number, fixed: Item[]): [number, number] {
  const Kf = fixed.reduce((s, i) => s + i.kcal, 0), Pf = fixed.reduce((s, i) => s + i.p, 0)
  const A = per(a), B = per(b)
  const dK = K - Kf, dP = P - Pf
  const det = A.kcal * B.p - B.kcal * A.p
  let x = Math.abs(det) > 1e-6 ? (dK * B.p - B.kcal * dP) / det : -1
  let y = Math.abs(det) > 1e-6 ? (A.kcal * dP - dK * A.p) / det : -1
  if (x < 0.5 || y < 0.25) { // sistem tak layak → utamakan protein, kalori diisi pendamping
    x = A.p > 0 ? dP / A.p : 1
    x = Math.max(0.5, Math.min(x, dK / A.kcal))
    y = (dK - x * A.kcal) / B.kcal
  }
  return [q(x, 0.5, 8), q(y, 0.25, 10)]
}

export function genMenu(target: { kcal: number; p: number }, flt: Filters, seed = 0) {
  const rand = rng(seed + 1)
  const ok = (f: Food) => (!flt.halal || f.halal) && (!flt.veg || f.veg) && !f.alergen.some(a => flt.alergi.includes(a)) && f.harga <= flt.anggaran
  const pool = FOODS.filter(ok)
  const by = (cat: Food['cat'], sn = false) => pool.filter(f => f.cat === cat && (!sn || f.sn))
  const oil = FOODS.find(f => f.id === 'minyak')!
  const pick = (list: Food[], avoid: string[]) => {
    const l = list.filter(f => !avoid.includes(f.id))
    const src = l.length ? l : list
    return src[Math.floor(rand() * src.length)]
  }
  const dense = (f: Food) => (f.p * 4) / f.kcal >= 0.25 // lauk utama harus padat protein (bukan susu/kacang)
  const lauk = by('protein').filter(dense)
  const mainPool = [lauk, by('karbo'), by('sayur')]
  if (mainPool.some(l => !l.length) || !by('protein', true).length || !by('buah').length) return null

  let prev: string[] = []
  const picks = MEALS.map(([nama, share], idx) => {
    const snack = idx === 1 || idx === 3
    const a = pick(snack ? by('protein', true) : lauk, prev)
    const b = snack ? pick(by('buah'), prev) : pick(by('karbo'), prev)
    const fixed = snack ? [] : [item(pick(by('sayur'), prev), 1), item(oil, 1)]
    prev = [a.id, b.id]
    return { nama, share, a, b, fixed }
  })
  // Solve dua kali: pass kedua mengoreksi target protein untuk pembulatan/batas porsi.
  let pScale = 1
  let built: { nama: string; share: number; items: Item[] }[] = []
  for (let pass = 0; pass < 3; pass++) {
    built = picks.map(m => {
      const [x, y] = solve(m.a, m.b, target.kcal * m.share, target.p * m.share * pScale, m.fixed)
      return { nama: m.nama, share: m.share, items: [item(m.a, x), item(m.b, y), ...m.fixed] }
    })
    const tp = built.reduce((s, m) => s + m.items.reduce((t, i) => t + i.p, 0), 0)
    pScale *= target.p / tp
  }

  // Koreksi kalori total dengan menggeser porsi pendamping (langkah 0,25 URT).
  const sum = (k: 'kcal' | 'p') => built.reduce((s, m) => s + m.items.reduce((t, i) => t + i[k], 0), 0)
  for (let n = 0; n < 40; n++) {
    const diff = target.kcal - sum('kcal')
    if (Math.abs(diff) <= target.kcal * 0.01) break
    const m = built[[0, 2, 4][n % 3]], s = m.items[1]
    const np = Math.max(0.25, s.porsi + (diff > 0 ? 0.25 : -0.25))
    m.items[1] = item(s.food, np)
  }

  const meals: Meal[] = built.map(m => {
    const t = (k: 'kcal' | 'p' | 'f' | 'c') => m.items.reduce((s, i) => s + i[k], 0)
    return { nama: m.nama, items: m.items, kcal: t('kcal'), p: t('p'), f: t('f'), c: t('c') }
  })
  const total = (k: 'kcal' | 'p' | 'f' | 'c') => meals.reduce((s, m) => s + m[k], 0)
  return { meals, total: { kcal: total('kcal'), p: total('p'), f: total('f'), c: total('c') } }
}
