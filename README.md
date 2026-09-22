# Kalora

Kalkulator kalori berbahasa Indonesia (dan Inggris) yang tidak berhenti di angka. Isi usia, tinggi, berat, dan aktivitas, lalu Kalora memberi target kalori dan makro, contoh menu harian dari makanan Indonesia, dan program latihan mingguan.

Semua hitungan berjalan di browser. Tidak perlu akun, dan tidak ada angka yang berasal dari AI.

## Fitur

- BMR dengan Mifflin-St Jeor, atau Katch-McArdle bila persen lemak diisi. TDEE, BMI (ambang Asia-Pasifik), dan rasio pinggang-tinggi.
- Pilihan defisit atau surplus (ringan, moderat, agresif). Target tidak pernah turun di bawah BMR atau 1.200 kkal (perempuan) / 1.500 kkal (laki-laki).
- Makro: protein 1,6–2,0 g/kg, lemak minimal 20% kalori, sisanya karbohidrat. Tiga preset pembagian.
- Langkah hitung ditampilkan lengkap, dengan rentang ±10%.
- Menu harian (3 makan + 2 selingan) dari sekitar 45 makanan dengan nilai gizi perkiraan TKPI. Filter halal, vegetarian, alergi, dan anggaran. Porsi dalam ukuran rumah tangga.
- Program latihan: full body (2–3 hari), upper/lower (4 hari), atau push/pull/legs (5–6 hari), untuk rumah atau gym. Tiap gerakan punya tautan pencarian video panduan.
- Kalora menolak menghitung untuk usia di bawah 18 tahun, ibu hamil/menyusui, BMI di bawah 18,5 dengan tujuan turun berat, dan input yang tidak wajar.
- Semua input tersimpan di URL, jadi hasil bisa dibagikan lewat tautan. Ada tombol simpan PDF / cetak.
- Bahasa Indonesia dan Inggris. Tambahkan `?lang=en` ke URL atau pakai tombol EN/ID di header.

## Menjalankan

Butuh Node.js dan npm.

```bash
npm install
npm run dev      # http://localhost:3007
npm test         # uji rumus dan generator menu (Vitest)
npm run build
```

## Struktur

```text
src/
  routes/          halaman: index, hitung, hasil, menu, latihan, tentang
  lib/calc.ts      BMR, TDEE, target, makro, BMI, pemblokiran
  lib/menu.ts      generator menu
  lib/foods.ts     data makanan per 100 g
  lib/workout.ts   daftar gerakan dan pemilih program
  lib/schema.ts    skema Zod untuk parameter URL
  lib/i18n.ts      terjemahan Inggris
  components/      header, kartu, disclaimer
```

Dibangun dengan TanStack Start, React, Tailwind CSS, dan Zod.

## Batasan

Kalora adalah alat edukasi, bukan alat diagnosis atau terapi gizi, dan tidak menggantikan dokter atau ahli gizi. Nilai gizi makanan adalah perkiraan dari Tabel Komposisi Pangan Indonesia (TKPI) Kemenkes dan belum divalidasi ahli gizi.
