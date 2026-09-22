import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { Actions, Card, Disclaimer, Nav, Page } from '../components/Shell'
import { ACTIVITY, blocker, calc } from '../lib/calc'
import { useI18n } from '../lib/i18n'
import { searchSchema } from '../lib/schema'

export const Route = createFileRoute('/hasil')({ validateSearch: searchSchema, component: Hasil })

function Hasil() {
  const s = Route.useSearch()
  const nav = useNavigate()
  const { en, t, num: n } = useI18n()
  const dec = (x: number, d: number) => en ? x.toFixed(d) : x.toFixed(d).replace('.', ',')
  const block = blocker(s)
  const r = useMemo(() => (block ? null : calc(s)), [s, block])

  if (!r) {
    return (
      <>
        <Nav />
        <Page>
          <Card className="space-y-3 border-amber-300 bg-amber-50">
            <h1 className="text-xl font-bold">{t('Kalora belum bisa menghitung untuk kondisimu', 'Kalora can\'t calculate for your situation yet')}</h1>
            <p>{t(block!)}</p>
            <p className="text-sm">{t('Untuk kebutuhan gizi yang tepat, silakan konsultasi dengan dokter atau ahli gizi.', 'For nutrition advice that fits you, talk to a doctor or dietitian.')}</p>
            <Link to="/hitung" search={s} className="underline">{t('Ubah data', 'Edit details')}</Link>
          </Card>
        </Page>
      </>
    )
  }
  const { macro: m } = r
  const bmrTxt = r.rumus === 'Katch-McArdle'
    ? `370 + ${dec(21.6, 1)} × ${dec(s.berat * (1 - s.lemak! / 100), 1)} kg ${t('massa tanpa lemak', 'lean mass')}`
    : `10 × ${s.berat} + ${dec(6.25, 2)} × ${s.tinggi} − 5 × ${s.usia} ${s.jk === 'L' ? '+ 5' : '− 161'}`
  return (
    <>
      <Nav s={s} />
      <Page>
        <div className="flex flex-wrap items-center justify-between gap-2"><h1 className="text-2xl font-bold">{t('Hasil', 'Results')}</h1><Actions /></div>

        <Card className="text-center">
          <p className="text-sm text-stone-500">{t('Target kalori harian', 'Daily calorie target')}</p>
          <p className="text-4xl font-bold text-brand">{n(r.target)} {t('kkal', 'kcal')}</p>
          <p className="text-sm text-stone-500">{en ? `Range: ${n(r.lo)}–${n(r.hi)} kcal (±10%). Track your weight trend for 2–3 weeks, then adjust.` : `Perkiraan: ${n(r.lo)}–${n(r.hi)} kkal (±10%). Pantau tren berat 2–3 minggu lalu sesuaikan.`}</p>
        </Card>

        {r.raised && <Card className="border-amber-300 bg-amber-50 text-sm">{en ? `Target raised to ${n(r.floor)} kcal so it stays above your BMR and the minimum (${n(s.jk === 'L' ? 1500 : 1200)} kcal).` : `Target dinaikkan otomatis ke ${n(r.floor)} kkal agar tidak di bawah BMR atau batas minimum (${n(s.jk === 'L' ? 1500 : 1200)} kkal).`}</Card>}
        {r.tooFast && <Card className="border-amber-300 bg-amber-50 text-sm">{en ? `Weight change of ±${dec(r.pctWeek, 1)}% per week is above the suggested 0.5–1%. Consider a lighter option.` : `Perubahan berat ±${dec(r.pctWeek, 1)}% per minggu, di atas batas saran 0,5–1%. Pertimbangkan pilihan yang lebih ringan.`}</Card>}

        {s.tujuan !== 'maintain' && (
          <Card>
            <p className="mb-2 text-sm font-medium">{s.tujuan === 'cutting' ? t('Tingkat defisit', 'Deficit size') : t('Tingkat surplus', 'Surplus size')}</p>
            <div className="flex gap-2">
              {(['ringan', 'moderat', 'agresif'] as const).map(l => (
                <button key={l} onClick={() => nav({ to: '/hasil', search: { ...s, langkah: l }, replace: true })} className={`rounded-full border px-4 py-1.5 text-sm capitalize ${s.langkah === l ? 'border-brand bg-brand text-white' : 'border-stone-300'}`}>{t(l)}</button>
              ))}
            </div>
            <p className="mt-2 text-xs text-stone-500">≈ {r.weekly > 0 ? '+' : ''}{dec(r.weekly, 2)} kg/{t('minggu', 'week')}</p>
          </Card>
        )}

        <div className="grid grid-cols-3 gap-3 text-center">
          {[['Protein', m.p, 4], [t('Lemak', 'Fat'), m.f, 9], [t('Karbo', 'Carbs'), m.c, 4]].map(([l, g, k]) => (
            <Card key={l as string}><p className="text-sm text-stone-500">{l}</p><p className="text-xl font-bold">{g} g</p><p className="text-xs text-stone-500">{n((g as number) * (k as number))} {t('kkal', 'kcal')}</p></Card>
          ))}
        </div>

        <Card className="space-y-1 text-sm">
          <h2 className="font-semibold">{t('Kesehatan tubuh', 'Body health')}</h2>
          <p>BMI <b>{dec(r.bmi, 1)}</b>: {t(r.bmiCat)} <span className="text-stone-500">{t('(ambang Asia-Pasifik: ≥23 lebih, ≥25 obesitas)', '(Asia-Pacific cutoffs: ≥23 overweight, ≥25 obese)')}</span></p>
          {r.whtr != null
            ? <p>{t('Rasio pinggang-tinggi', 'Waist-to-height ratio')} <b>{dec(r.whtr, 2)}</b>: {r.whtrRisk ? t('di atas 0,5, ditandai berisiko', 'above 0.5, flagged as a risk') : t('di bawah 0,5, baik', 'below 0.5, good')}</p>
            : <p className="text-stone-500">{t('Isi lingkar pinggang untuk melihat rasio pinggang-tinggi.', 'Add your waist size to see your waist-to-height ratio.')}</p>}
        </Card>

        <Card className="space-y-1 text-sm">
          <h2 className="font-semibold">{t('Langkah hitung', 'How it was calculated')}</h2>
          <p>1. BMR ({r.rumus}) = {bmrTxt} = <b>{n(r.bmr)} {t('kkal', 'kcal')}</b></p>
          <p>2. TDEE = BMR × {ACTIVITY[s.aktivitas]} ({t('aktivitas', 'activity')}) = <b>{n(r.tdee)} {t('kkal', 'kcal')}</b></p>
          <p>3. Target = TDEE {r.target - r.tdee >= 0 ? '+' : '−'} {n(Math.abs(r.target - r.tdee))} {t('kkal', 'kcal')} = <b>{n(r.target)} {t('kkal', 'kcal')}</b></p>
          <p>4. {en ? `Protein ${s.protein} g/kg × ${s.berat} kg = ${m.p} g; fat ≥20% of calories = ${m.f} g; carbs make up the rest = ${m.c} g` : `Protein ${dec(s.protein, 1)} g/kg × ${s.berat} kg = ${m.p} g; lemak ≥20% kalori = ${m.f} g; sisanya karbo = ${m.c} g`}</p>
        </Card>
        <Link to="/hitung" search={s} className="print:hidden inline-block rounded-lg border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">{t('Hitung lagi dengan data lain', 'Recalculate with different details')}</Link>
        <Disclaimer />
      </Page>
    </>
  )
}
