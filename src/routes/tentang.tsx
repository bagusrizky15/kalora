import { createFileRoute } from '@tanstack/react-router'
import { Nav, Page } from '../components/Shell'
import { useI18n } from '../lib/i18n'

export const Route = createFileRoute('/tentang')({ component: Tentang })

const faq: [string, string][] = [
  ['Apa itu BMR dan TDEE?', 'BMR adalah kalori yang dibakar tubuh saat istirahat. TDEE adalah BMR dikali faktor aktivitas: total kalori yang dibakar sehari.'],
  ['Cara memilih level aktivitas?', 'Hitung olahraga terencana per minggu, bukan pekerjaan saja. Ragu antara dua level: pilih yang lebih rendah.'],
  ['Kenapa ada rentang ±10%?', 'Semua rumus adalah perkiraan. Pantau berat 2–3 minggu, lalu ubah target bila tren tidak sesuai.'],
  ['Kenapa BMI dibaca dengan ambang Asia-Pasifik?', 'Risiko kesehatan populasi Asia muncul di BMI lebih rendah: ≥23 berat badan lebih, ≥25 obesitas. Rasio pinggang-tinggi ≥0,5 juga ditandai berisiko.'],
]
const faqEn: [string, string][] = [
  ['What are BMR and TDEE?', 'BMR is the calories your body burns at rest. TDEE is BMR multiplied by an activity factor: the total calories you burn in a day.'],
  ['How do I pick an activity level?', 'Count your planned exercise per week, not just your job. If you are between two levels, pick the lower one.'],
  ['Why is there a ±10% range?', 'Every formula is an estimate. Track your weight for 2–3 weeks, then change the target if the trend is off.'],
  ['Why does BMI use Asia-Pacific cutoffs?', 'Health risks in Asian populations start at a lower BMI: ≥23 is overweight, ≥25 is obese. A waist-to-height ratio of ≥0.5 is also flagged as a risk.'],
]

function Tentang() {
  const { en } = useI18n()
  return (
    <>
      <Nav />
      <Page>
        {en ? (
          <>
            <h1 className="text-2xl font-bold">About, method, and disclaimer</h1>
            <section className="space-y-2 text-sm">
              <p><b>Kalora is an education tool, not a tool for diagnosis or nutrition therapy.</b> It does not replace a doctor or dietitian. It is not for people under 18, pregnant or breastfeeding women, or medical conditions that need a specific nutrition plan.</p>
              <p>The numbers come from fixed formulas (Mifflin-St Jeor, or Katch-McArdle if you enter body fat). They are calculated on your device and never sent to a server. No number comes from AI.</p>
              <p>The calorie target never goes below your BMR or 1,200 kcal (women) / 1,500 kcal (men). Protein is 1.6–2.0 g/kg, fat is at least 20% of calories, and carbs make up the rest.</p>
              <p>Food data: estimated nutrition values from the Indonesian Food Composition Table (TKPI) by the Ministry of Health, not yet reviewed by a dietitian.</p>
            </section>
            <h2 className="text-xl font-bold">Guide / FAQ</h2>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Tentang, metodologi, dan disclaimer</h1>
            <section className="space-y-2 text-sm">
              <p><b>Kalora adalah alat edukasi, bukan alat diagnosis atau terapi gizi.</b> Tidak menggantikan dokter atau ahli gizi. Tidak untuk usia di bawah 18 tahun, ibu hamil/menyusui, atau kondisi medis yang butuh terapi gizi khusus.</p>
              <p>Angka berasal dari rumus deterministik (Mifflin-St Jeor; Katch-McArdle bila persen lemak diisi), dihitung di perangkatmu dan tidak dikirim ke server. Tidak ada angka dari AI.</p>
              <p>Target kalori tidak turun di bawah BMR atau 1.200 kkal (perempuan) / 1.500 kkal (laki-laki). Protein 1,6–2,0 g/kg, lemak minimal 20% kalori, sisanya karbohidrat.</p>
              <p>Data makanan: nilai gizi perkiraan dari Tabel Komposisi Pangan Indonesia (TKPI) Kemenkes, belum divalidasi ahli gizi.</p>
            </section>
            <h2 className="text-xl font-bold">Panduan / FAQ</h2>
          </>
        )}
        {(en ? faqEn : faq).map(([q, a]) => <details key={q} className="rounded-lg border border-stone-300 bg-white p-4"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-2 text-sm text-stone-500">{a}</p></details>)}
      </Page>
    </>
  )
}
