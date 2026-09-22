import type { Goal } from './calc'

type Grp = 'push' | 'pull' | 'legs' | 'core'
export type Ex = { n: string; g: Grp; otot: string; alat: 'bodyweight' | 'dumbbell' | 'barbell' | 'mesin'; lvl: 'pemula' | 'menengah' }
// ponytail: daftar lokal ~35 gerakan, bukan salinan wger; tautan panduan = pencarian YouTube. Impor wger ke tabel `exercises` nanti.
const E = (n: string, g: Grp, otot: string, alat: Ex['alat'], lvl: Ex['lvl'] = 'pemula'): Ex => ({ n, g, otot, alat, lvl })
export const EXERCISES: Ex[] = [
  E('Push-up', 'push', 'Dada, triceps', 'bodyweight'),
  E('Dumbbell shoulder press', 'push', 'Bahu', 'dumbbell'),
  E('Dumbbell bench press', 'push', 'Dada', 'dumbbell'),
  E('Pike push-up', 'push', 'Bahu', 'bodyweight', 'menengah'),
  E('Triceps dip bangku', 'push', 'Triceps', 'bodyweight'),
  E('Triceps extension dumbbell', 'push', 'Triceps', 'dumbbell'),
  E('Bench press', 'push', 'Dada', 'barbell', 'menengah'),
  E('Overhead press', 'push', 'Bahu', 'barbell', 'menengah'),
  E('Chest press mesin', 'push', 'Dada', 'mesin'),
  E('Dumbbell row', 'pull', 'Punggung', 'dumbbell'),
  E('Dumbbell curl', 'pull', 'Biceps', 'dumbbell'),
  E('Rear delt fly dumbbell', 'pull', 'Bahu belakang', 'dumbbell'),
  E('Superman', 'pull', 'Punggung bawah', 'bodyweight'),
  E('Lat pulldown', 'pull', 'Punggung', 'mesin'),
  E('Seated cable row', 'pull', 'Punggung', 'mesin'),
  E('Barbell row', 'pull', 'Punggung', 'barbell', 'menengah'),
  E('Squat bodyweight', 'legs', 'Paha, glute', 'bodyweight'),
  E('Lunge', 'legs', 'Paha, glute', 'bodyweight'),
  E('Glute bridge', 'legs', 'Glute, hamstring', 'bodyweight'),
  E('Goblet squat', 'legs', 'Paha, glute', 'dumbbell'),
  E('Romanian deadlift dumbbell', 'legs', 'Hamstring, glute', 'dumbbell'),
  E('Bulgarian split squat', 'legs', 'Paha, glute', 'dumbbell', 'menengah'),
  E('Calf raise', 'legs', 'Betis', 'bodyweight'),
  E('Barbell squat', 'legs', 'Paha, glute', 'barbell', 'menengah'),
  E('Deadlift', 'legs', 'Hamstring, punggung', 'barbell', 'menengah'),
  E('Leg press', 'legs', 'Paha', 'mesin'),
  E('Leg curl', 'legs', 'Hamstring', 'mesin'),
  E('Hip thrust', 'legs', 'Glute', 'barbell', 'menengah'),
  E('Plank', 'core', 'Perut', 'bodyweight'),
  E('Crunch', 'core', 'Perut', 'bodyweight'),
  E('Dead bug', 'core', 'Perut', 'bodyweight'),
  E('Leg raise', 'core', 'Perut bawah', 'bodyweight'),
  E('Russian twist', 'core', 'Oblique', 'bodyweight'),
]

export const guide = (n: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(n + ' tutorial')}`

const SCHEME: Record<Goal, { set: number; rep: string; langkah: number; kardio: string }> = {
  cutting: { set: 3, rep: '12–15', langkah: 10000, kardio: '2–3× kardio ringan 20–30 menit (jalan cepat, sepeda)' },
  maintain: { set: 3, rep: '8–12', langkah: 8000, kardio: '1–2× kardio ringan 20 menit' },
  bulking: { set: 4, rep: '6–10', langkah: 7000, kardio: '1–2× kardio ringan 15–20 menit; jaga kalori tetap surplus' },
}

type Slots = [Grp, number][]
const FULL: Slots = [['legs', 2], ['push', 1], ['pull', 1], ['core', 1]]
const UPPER: Slots = [['push', 2], ['pull', 2]]
const LOWER: Slots = [['legs', 3], ['core', 1]]
const PUSH: Slots = [['push', 4]]
const PULL: Slots = [['pull', 4]]
const LEGS: Slots = [['legs', 3], ['core', 1]]

export function program(hari: number, lokasi: 'rumah' | 'gym', tujuan: Goal) {
  const sc = SCHEME[tujuan]
  const [split, days]: [string, [string, Slots][]] =
    hari <= 3 ? ['Full body', Array.from({ length: Math.max(2, hari) }, (_, i) => [`Full body ${'ABC'[i]}`, FULL] as [string, Slots])]
    : hari === 4 ? ['Upper/Lower', [['Upper A', UPPER], ['Lower A', LOWER], ['Upper B', UPPER], ['Lower B', LOWER]]]
    : ['Push/Pull/Legs', ([['Push', PUSH], ['Pull', PULL], ['Legs', LEGS], ['Push', PUSH], ['Pull', PULL], ['Legs', LEGS]] as [string, Slots][]).slice(0, hari)]

  const used: Record<string, number> = {}
  const sessions = days.map(([nama, slots], d) => ({
    hari: d + 1,
    nama,
    latihan: slots.flatMap(([g, n]) => {
      const pool = EXERCISES.filter(e => e.g === g && (lokasi === 'gym' || e.alat === 'bodyweight' || e.alat === 'dumbbell'))
      // rotasi pool per kelompok otot supaya sesi berulang tidak identik
      const start = used[g] ?? 0
      used[g] = start + n
      return Array.from({ length: n }, (_, i) => ({ ex: pool[(start + i) % pool.length], set: g === 'core' ? 3 : sc.set, rep: g === 'core' ? '30–45 dtk / 15 rep' : sc.rep }))
    }),
  }))
  return { split, sessions, langkah: sc.langkah, kardio: sc.kardio }
}
