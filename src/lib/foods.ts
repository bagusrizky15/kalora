// Nilai per 100 g, perkiraan dari TKPI Kemenkes. Wajib divalidasi ahli gizi sebelum rilis.
// ponytail: ~45 makanan di kode, bukan tabel DB/100-150 item; pindah ke Postgres + seed TKPI saat kurasi selesai.
export type Cat = 'protein' | 'karbo' | 'sayur' | 'buah' | 'lemak'
export type Food = {
  id: string; nama: string; cat: Cat
  kcal: number; p: number; f: number; c: number
  urt: string; g: number // porsi umum (URT) dan beratnya
  halal: boolean; veg: boolean; alergen: string[]; harga: 1 | 2 | 3
  sn?: boolean // cocok sebagai selingan
}

const F = (id: string, nama: string, cat: Cat, kcal: number, p: number, f: number, c: number, urt: string, g: number,
  o: Partial<Pick<Food, 'veg' | 'alergen' | 'harga' | 'sn'>> = {}): Food =>
  ({ id, nama, cat, kcal, p, f, c, urt, g, halal: true, veg: false, alergen: [], harga: 1, ...o })

export const FOODS: Food[] = [
  F('nasi', 'Nasi putih', 'karbo', 175, 3, 0.3, 39.8, 'centong', 100, { veg: true }),
  F('nasimerah', 'Nasi merah', 'karbo', 149, 2.8, 0.8, 32, 'centong', 100, { veg: true, harga: 2 }),
  F('ubi', 'Ubi jalar rebus', 'karbo', 86, 1.6, 0.1, 20, 'buah sedang', 150, { veg: true }),
  F('kentang', 'Kentang rebus', 'karbo', 83, 1.7, 0.1, 19, 'buah sedang', 130, { veg: true }),
  F('singkong', 'Singkong rebus', 'karbo', 146, 1, 0.3, 34, 'potong', 100, { veg: true }),
  F('jagung', 'Jagung rebus', 'karbo', 96, 3.5, 1, 21, 'buah', 150, { veg: true }),
  F('lontong', 'Lontong', 'karbo', 100, 2, 0.2, 22, 'potong', 100, { veg: true }),
  F('roti', 'Roti tawar', 'karbo', 248, 8, 1.2, 50, 'lembar', 30, { veg: true, alergen: ['gluten'] }),
  F('oat', 'Oatmeal (kering)', 'karbo', 380, 13, 7, 67, 'sajian', 30, { veg: true, alergen: ['gluten'], harga: 2 }),

  F('dada', 'Dada ayam panggang', 'protein', 165, 31, 3.6, 0, 'potong', 80, { harga: 2 }),
  F('paha', 'Paha ayam rebus', 'protein', 190, 24, 10, 0, 'potong', 75),
  F('telur', 'Telur ayam rebus', 'protein', 154, 12.4, 10.8, 0.7, 'butir', 55, { veg: true, alergen: ['telur'], sn: true }),
  F('tempe', 'Tempe kukus', 'protein', 201, 20.8, 8.8, 13.5, 'potong', 50, { veg: true, alergen: ['kedelai'], sn: true }),
  F('tahu', 'Tahu kukus', 'protein', 80, 10.9, 4.7, 0.8, 'potong', 60, { veg: true, alergen: ['kedelai'], sn: true }),
  F('lele', 'Ikan lele panggang', 'protein', 105, 17, 4, 0, 'ekor kecil', 80, { alergen: ['ikan'] }),
  F('kembung', 'Ikan kembung', 'protein', 103, 22, 1, 0, 'ekor sedang', 80, { alergen: ['ikan'], harga: 2 }),
  F('tongkol', 'Ikan tongkol', 'protein', 117, 21, 3, 0, 'potong', 80, { alergen: ['ikan'], harga: 2 }),
  F('bandeng', 'Ikan bandeng', 'protein', 129, 20, 4.8, 0, 'potong', 80, { alergen: ['ikan'], harga: 2 }),
  F('udang', 'Udang rebus', 'protein', 91, 21, 0.2, 0.1, 'porsi', 70, { alergen: ['udang'], harga: 3 }),
  F('sapi', 'Daging sapi tanpa lemak', 'protein', 201, 18.8, 14, 0, 'potong', 50, { harga: 3 }),
  F('susu', 'Susu sapi', 'protein', 61, 3.2, 3.5, 4.3, 'gelas', 200, { veg: true, alergen: ['susu'], sn: true, harga: 2 }),
  F('yogurt', 'Yogurt plain', 'protein', 61, 3.5, 3.3, 4.7, 'cup', 150, { veg: true, alergen: ['susu'], sn: true, harga: 2 }),
  F('kacang', 'Kacang tanah rebus', 'protein', 250, 12, 17, 14, 'genggam', 30, { veg: true, alergen: ['kacang'], sn: true }),
  F('kacangmerah', 'Kacang merah rebus', 'protein', 125, 8, 0.5, 22, 'mangkuk kecil', 100, { veg: true, sn: true }),

  F('bayam', 'Bayam rebus', 'sayur', 36, 3.5, 0.5, 6.5, 'mangkuk', 100, { veg: true }),
  F('kangkung', 'Kangkung rebus', 'sayur', 29, 3, 0.3, 5.4, 'mangkuk', 100, { veg: true }),
  F('buncis', 'Buncis rebus', 'sayur', 35, 2.4, 0.3, 7.7, 'mangkuk', 100, { veg: true }),
  F('wortel', 'Wortel rebus', 'sayur', 36, 1, 0.6, 7.9, 'mangkuk', 100, { veg: true }),
  F('brokoli', 'Brokoli rebus', 'sayur', 34, 2.8, 0.4, 6.6, 'mangkuk', 100, { veg: true, harga: 2 }),
  F('sawi', 'Sawi hijau rebus', 'sayur', 22, 2.3, 0.3, 4, 'mangkuk', 100, { veg: true }),
  F('kol', 'Kol rebus', 'sayur', 25, 1.7, 0.2, 5.3, 'mangkuk', 100, { veg: true }),
  F('timun', 'Timun', 'sayur', 12, 0.7, 0.1, 2.7, 'buah', 100, { veg: true }),

  F('pisang', 'Pisang ambon', 'buah', 99, 1.2, 0.2, 25.8, 'buah', 80, { veg: true, sn: true }),
  F('pepaya', 'Pepaya', 'buah', 46, 0.5, 0, 12.2, 'potong', 100, { veg: true, sn: true }),
  F('jeruk', 'Jeruk', 'buah', 45, 0.9, 0.2, 11.2, 'buah', 100, { veg: true, sn: true }),
  F('apel', 'Apel', 'buah', 58, 0.3, 0.4, 14.9, 'buah', 100, { veg: true, sn: true, harga: 2 }),
  F('mangga', 'Mangga', 'buah', 60, 0.5, 0.3, 15.7, 'buah kecil', 100, { veg: true, sn: true }),
  F('semangka', 'Semangka', 'buah', 28, 0.5, 0.2, 6.9, 'potong', 150, { veg: true, sn: true }),
  F('nanas', 'Nanas', 'buah', 50, 0.5, 0.2, 13, 'potong', 100, { veg: true, sn: true }),

  F('minyak', 'Minyak (untuk memasak)', 'lemak', 884, 0, 100, 0, 'sdt', 5, { veg: true }),
  F('alpukat', 'Alpukat', 'lemak', 85, 0.9, 6.5, 7.7, 'buah kecil', 100, { veg: true, sn: true, harga: 2 }),
]
