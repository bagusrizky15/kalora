export type Sex = 'L' | 'P'
export type Goal = 'cutting' | 'maintain' | 'bulking'
export type Step = 'ringan' | 'moderat' | 'agresif'
export type Preset = 'moderate' | 'lower' | 'higher'
export type Activity = keyof typeof ACTIVITY

export const ACTIVITY = { sedentary: 1.2, light: 1.375, moderate: 1.55, heavy: 1.725, athlete: 1.9 }
const ADJ: Record<Goal, Record<Step, number>> = {
  cutting: { ringan: -200, moderat: -300, agresif: -500 },
  maintain: { ringan: 0, moderat: 0, agresif: 0 },
  bulking: { ringan: 150, moderat: 250, agresif: 400 },
}
const FAT_PCT: Record<Preset, number> = { moderate: 0.3, lower: 0.4, higher: 0.2 }
const MIN_KCAL: Record<Sex, number> = { L: 1500, P: 1200 }

export type Input = {
  usia: number; jk: Sex; tinggi: number; berat: number
  aktivitas: Activity; tujuan: Goal; langkah: Step; preset: Preset; protein: number
  hamil: boolean; pinggang?: number; lemak?: number
}

// Input tidak wajar / di luar cakupan → alasan pemblokiran (null = aman).
export function blocker(i: Input): string | null {
  if (i.usia < 18) return 'Kalora belum cocok untuk usia di bawah 18 tahun. Kebutuhan gizi remaja berbeda dan perlu panduan tenaga kesehatan.'
  if (i.hamil) return 'Kebutuhan gizi ibu hamil/menyusui berbeda dan tidak boleh diatur lewat kalkulator umum. Konsultasikan dengan dokter atau ahli gizi.'
  if (i.usia > 100 || i.tinggi < 120 || i.tinggi > 230 || i.berat < 30 || i.berat > 300) return 'Nilai usia, tinggi, atau berat tampak tidak wajar. Periksa kembali isian Anda.'
  if (i.lemak != null && (i.lemak < 3 || i.lemak > 60)) return 'Persen lemak tubuh tampak tidak wajar (3–60%).'
  if (i.pinggang != null && (i.pinggang < 40 || i.pinggang > 200)) return 'Lingkar pinggang tampak tidak wajar (40–200 cm).'
  if (bmi(i) < 18.5 && i.tujuan === 'cutting') return 'BMI Anda di bawah 18,5 sehingga program penurunan berat tidak disarankan. Konsultasikan dengan tenaga kesehatan.'
  return null
}

export const bmi = (i: Pick<Input, 'berat' | 'tinggi'>) => i.berat / (i.tinggi / 100) ** 2

// Ambang Asia-Pasifik: overweight ≥23, obesitas ≥25.
export function bmiCat(b: number) {
  return b < 18.5 ? 'Kurus' : b < 23 ? 'Normal' : b < 25 ? 'Berat badan lebih' : 'Obesitas'
}

export function bmr(i: Input) {
  if (i.lemak != null) return { val: 370 + 21.6 * i.berat * (1 - i.lemak / 100), rumus: 'Katch-McArdle' }
  return { val: 10 * i.berat + 6.25 * i.tinggi - 5 * i.usia + (i.jk === 'L' ? 5 : -161), rumus: 'Mifflin-St Jeor' }
}

export function calc(i: Input) {
  const b = bmr(i)
  const tdee = b.val * ACTIVITY[i.aktivitas]
  const floor = Math.max(b.val, MIN_KCAL[i.jk])
  const raw = tdee + ADJ[i.tujuan][i.langkah]
  const target = Math.round(Math.max(raw, floor))
  const raised = raw < floor
  const weekly = ((target - tdee) * 7) / 7700 // kg/minggu
  const pctWeek = (Math.abs(weekly) / i.berat) * 100

  const p = i.protein * i.berat
  const f = Math.max(FAT_PCT[i.preset], 0.2) * target / 9
  const c = Math.max(0, (target - p * 4 - f * 9) / 4)

  const bm = bmi(i)
  const whtr = i.pinggang ? i.pinggang / i.tinggi : undefined
  return {
    bmr: Math.round(b.val), rumus: b.rumus, tdee: Math.round(tdee), floor: Math.round(floor),
    target, raised, weekly, pctWeek, tooFast: pctWeek > 1,
    lo: Math.round(target * 0.9), hi: Math.round(target * 1.1),
    macro: { p: Math.round(p), f: Math.round(f), c: Math.round(c) },
    bmi: bm, bmiCat: bmiCat(bm), whtr, whtrRisk: whtr != null && whtr >= 0.5,
  }
}
export type Result = ReturnType<typeof calc>
