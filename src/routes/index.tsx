import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, Disclaimer, Nav, Page } from '../components/Shell'
import { activityOpts, useI18n } from '../lib/i18n'
import { searchSchema } from '../lib/schema'

const inp = 'w-full rounded-lg border border-stone-300 px-3 py-2'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const nav = useNavigate()
  const { t } = useI18n()
  const [f, setF] = useState<Record<string, string>>({ usia: '', tinggi: '', berat: '', lemak: '', jk: 'L', aktivitas: 'light' })
  const set = (k: string) => (e: { target: { value: string } }) => setF(p => ({ ...p, [k]: e.target.value }))
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const search = searchSchema.parse({ jk: f.jk, aktivitas: f.aktivitas, usia: +f.usia, tinggi: +f.tinggi, berat: +f.berat, lemak: f.lemak === '' ? undefined : +f.lemak })
    nav({ to: '/hasil', search })
  }
  const num = (k: string, label: string, opt = false) => (
    <label className="block text-sm"><span className="mb-1 block font-medium">{label}</span><input className={inp} type="number" inputMode="decimal" step="any" required={!opt} value={f[k]} onChange={set(k)} /></label>
  )
  return (
    <>
      <Nav />
      <Page>
        <h1 className="text-3xl font-bold leading-tight">{t('Tahu kalori harianmu, lalu langsung tahu makan apa dan latihan bagaimana.', 'Find your daily calories, then see what to eat and how to train.')}</h1>
        <p className="text-stone-600">{t('Isi data tubuh, dapat target kalori dan makro dengan pilihan defisit yang aman, contoh menu dari makanan Indonesia, dan program latihan mingguan. Gratis, tanpa akun, rumus ditampilkan terbuka.', 'Enter your body stats to get a calorie and macro target with a safe deficit, a sample menu of Indonesian food, and a weekly workout plan. Free, no account, and every formula is shown.')}</p>
        <Card>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            {num('usia', t('Usia (tahun)', 'Age (years)'))}
            <label className="block text-sm"><span className="mb-1 block font-medium">{t('Jenis kelamin', 'Sex')}</span><select className={inp} value={f.jk} onChange={set('jk')}><option value="L">{t('Laki-laki', 'Male')}</option><option value="P">{t('Perempuan', 'Female')}</option></select></label>
            {num('tinggi', t('Tinggi (cm)', 'Height (cm)'))}
            {num('berat', t('Berat (kg)', 'Weight (kg)'))}
            <label className="block text-sm"><span className="mb-1 block font-medium">{t('Aktivitas', 'Activity')}</span><select className={inp} value={f.aktivitas} onChange={set('aktivitas')}>{activityOpts(t).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
            {num('lemak', t('Persen lemak (%), opsional', 'Body fat (%), optional'), true)}
            <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
              <button className="rounded-lg bg-brand px-6 py-3 font-semibold text-white">{t('Hitung', 'Calculate')}</button>
              <Link to="/hitung" className="text-sm underline">{t('Opsi lanjutan (tujuan, latihan, filter menu)', 'More options (goal, training, menu filters)')}</Link>
            </div>
          </form>
        </Card>
        <ul className="grid gap-3 sm:grid-cols-3">
          {[[t('Rumus transparan', 'Open formulas'), t('Mifflin-St Jeor atau Katch-McArdle, lengkap dengan langkah hitung dan rentang ±10%.', 'Mifflin-St Jeor or Katch-McArdle, with every calculation step and a ±10% range.')], [t('Menu lokal', 'Local menu'), t('Nasi, tempe, ikan, sayur: porsi dalam ukuran rumah tangga, mendekati target makro.', 'Rice, tempeh, fish, vegetables: portions in household measures, close to your macro target.')], [t('Latihan sesuai jadwal', 'Training that fits your week'), t('Full body, upper/lower, atau PPL sesuai hari dan lokasi latihanmu.', 'Full body, upper/lower, or PPL based on your training days and where you train.')]].map(([t, d]) => (
            <li key={t} className="rounded-xl border border-stone-200 bg-white p-4"><h2 className="font-semibold">{t}</h2><p className="mt-1 text-sm text-stone-600">{d}</p></li>
          ))}
        </ul>
        <Disclaimer />
      </Page>
    </>
  )
}
