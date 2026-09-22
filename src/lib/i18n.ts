import { useSearch } from '@tanstack/react-router'
import { z } from 'zod'

// Bahasa hidup di URL (?lang=en) supaya ikut tautan yang dibagikan dan aman untuk SSR.
export const langSchema = z.object({ lang: z.enum(['id', 'en']).optional() })
export type Lang = 'id' | 'en'

// Teks dari lib (pesan blokir, nama makanan, otot, dst.) diterjemahkan lewat kamus berkunci teks Indonesia.
// ponytail: kamus datar, teks tanpa entri tampil dalam bahasa Indonesia. Ganti ke berkas per bahasa bila menambah bahasa ketiga.
const EN: Record<string, string> = {
  // calc.ts
  'Kalora belum cocok untuk usia di bawah 18 tahun. Kebutuhan gizi remaja berbeda dan perlu panduan tenaga kesehatan.': 'Kalora is not for people under 18. Teenagers have different nutrition needs and should get guidance from a health professional.',
  'Kebutuhan gizi ibu hamil/menyusui berbeda dan tidak boleh diatur lewat kalkulator umum. Konsultasikan dengan dokter atau ahli gizi.': 'Pregnant and breastfeeding women have different nutrition needs that a general calculator should not set. Talk to a doctor or dietitian.',
  'Nilai usia, tinggi, atau berat tampak tidak wajar. Periksa kembali isian Anda.': 'The age, height, or weight looks wrong. Check what you entered.',
  'Persen lemak tubuh tampak tidak wajar (3–60%).': 'The body fat percentage looks wrong (3–60%).',
  'Lingkar pinggang tampak tidak wajar (40–200 cm).': 'The waist size looks wrong (40–200 cm).',
  'BMI Anda di bawah 18,5 sehingga program penurunan berat tidak disarankan. Konsultasikan dengan tenaga kesehatan.': 'Your BMI is below 18.5, so a weight loss plan is not recommended. Talk to a health professional.',
  Kurus: 'Underweight', Normal: 'Normal', 'Berat badan lebih': 'Overweight', Obesitas: 'Obese',
  // pilihan form
  ringan: 'light', moderat: 'moderate', agresif: 'aggressive',
  telur: 'egg', susu: 'milk', kacang: 'peanut', kedelai: 'soy', ikan: 'fish', udang: 'shrimp', gluten: 'gluten',
  // menu.ts
  Sarapan: 'Breakfast', 'Selingan pagi': 'Morning snack', 'Makan siang': 'Lunch', 'Selingan sore': 'Afternoon snack', 'Makan malam': 'Dinner',
  // foods.ts: nama
  'Nasi putih': 'White rice', 'Nasi merah': 'Brown rice', 'Ubi jalar rebus': 'Boiled sweet potato', 'Kentang rebus': 'Boiled potato',
  'Singkong rebus': 'Boiled cassava', 'Jagung rebus': 'Boiled corn', Lontong: 'Lontong (rice cake)', 'Roti tawar': 'White bread',
  'Oatmeal (kering)': 'Oatmeal (dry)', 'Dada ayam panggang': 'Grilled chicken breast', 'Paha ayam rebus': 'Boiled chicken thigh',
  'Telur ayam rebus': 'Boiled egg', 'Tempe kukus': 'Steamed tempeh', 'Tahu kukus': 'Steamed tofu', 'Ikan lele panggang': 'Grilled catfish',
  'Ikan kembung': 'Mackerel', 'Ikan tongkol': 'Tuna (tongkol)', 'Ikan bandeng': 'Milkfish', 'Udang rebus': 'Boiled shrimp',
  'Daging sapi tanpa lemak': 'Lean beef', 'Susu sapi': 'Cow\'s milk', 'Yogurt plain': 'Plain yogurt', 'Kacang tanah rebus': 'Boiled peanuts',
  'Kacang merah rebus': 'Boiled kidney beans', 'Bayam rebus': 'Boiled spinach', 'Kangkung rebus': 'Boiled water spinach',
  'Buncis rebus': 'Boiled green beans', 'Wortel rebus': 'Boiled carrots', 'Brokoli rebus': 'Boiled broccoli', 'Sawi hijau rebus': 'Boiled mustard greens',
  'Kol rebus': 'Boiled cabbage', Timun: 'Cucumber', 'Pisang ambon': 'Banana', Pepaya: 'Papaya', Jeruk: 'Orange', Apel: 'Apple',
  Mangga: 'Mango', Semangka: 'Watermelon', Nanas: 'Pineapple', 'Minyak (untuk memasak)': 'Cooking oil', Alpukat: 'Avocado',
  // foods.ts: ukuran rumah tangga
  centong: 'scoop', 'buah sedang': 'medium piece', potong: 'piece', buah: 'piece', lembar: 'slice', sajian: 'serving', butir: 'egg',
  'ekor kecil': 'small fish', 'ekor sedang': 'medium fish', porsi: 'serving', gelas: 'glass', cup: 'cup', genggam: 'handful',
  'mangkuk kecil': 'small bowl', mangkuk: 'bowl', 'buah kecil': 'small piece', sdt: 'tsp',
  // workout.ts
  'Dada, triceps': 'Chest, triceps', Bahu: 'Shoulders', Dada: 'Chest', Triceps: 'Triceps', Punggung: 'Back', Biceps: 'Biceps',
  'Bahu belakang': 'Rear shoulders', 'Punggung bawah': 'Lower back', 'Paha, glute': 'Thighs, glutes', 'Glute, hamstring': 'Glutes, hamstrings',
  'Hamstring, glute': 'Hamstrings, glutes', Betis: 'Calves', 'Hamstring, punggung': 'Hamstrings, back', Paha: 'Thighs', Hamstring: 'Hamstrings',
  Glute: 'Glutes', Perut: 'Abs', 'Perut bawah': 'Lower abs', Oblique: 'Obliques',
  'Triceps dip bangku': 'Bench triceps dip', 'Triceps extension dumbbell': 'Dumbbell triceps extension', 'Chest press mesin': 'Machine chest press',
  'Rear delt fly dumbbell': 'Dumbbell rear delt fly', 'Squat bodyweight': 'Bodyweight squat', 'Romanian deadlift dumbbell': 'Dumbbell Romanian deadlift',
  '2–3× kardio ringan 20–30 menit (jalan cepat, sepeda)': '2–3× light cardio, 20–30 minutes (brisk walking, cycling)',
  '1–2× kardio ringan 20 menit': '1–2× light cardio, 20 minutes',
  '1–2× kardio ringan 15–20 menit; jaga kalori tetap surplus': '1–2× light cardio, 15–20 minutes; keep calories in surplus',
  '30–45 dtk / 15 rep': '30–45 sec / 15 reps',
}

export function useI18n() {
  const lang: Lang = useSearch({ strict: false }).lang ?? 'id'
  const en = lang === 'en'
  // t('teks ID') → kamus; t('teks ID', 'EN text') → teks EN langsung.
  const t = (id: string, eng?: string) => (en ? eng ?? EN[id] ?? id : id)
  const num = (x: number, d = 0) => (Math.round(x * 10 ** d) / 10 ** d).toLocaleString(en ? 'en-US' : 'id-ID')
  return { lang, en, t, num }
}

export const activityOpts = (t: (id: string, en: string) => string): [string, string][] => [
  ['sedentary', t('Sedentary: hampir tanpa olahraga', 'Sedentary: little or no exercise')],
  ['light', t('Ringan: olahraga 1–3×/minggu', 'Light: exercise 1–3×/week')],
  ['moderate', t('Sedang: olahraga 3–5×/minggu', 'Moderate: exercise 3–5×/week')],
  ['heavy', t('Berat: olahraga 6–7×/minggu', 'Heavy: exercise 6–7×/week')],
  ['athlete', t('Atlet: latihan 2×/hari', 'Athlete: training 2×/day')],
]
