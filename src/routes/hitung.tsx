import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, type ReactNode } from 'react'
import { Card, Nav, Page } from '../components/Shell'
import { activityOpts, useI18n } from '../lib/i18n'
import { searchSchema, type Search } from '../lib/schema'

export const Route = createFileRoute('/hitung')({ validateSearch: searchSchema, component: Form })

const ALERGEN = ['telur', 'susu', 'kacang', 'kedelai', 'ikan', 'udang', 'gluten']
const inp = 'w-full rounded-lg border border-stone-300 px-3 py-2'
const Field = ({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) => (
  <label className="block text-sm"><span className="mb-1 block font-medium">{label}</span>{children}{hint && <span className="mt-1 block text-xs text-stone-500">{hint}</span>}</label>
)

function Form() {
  const nav = useNavigate()
  const { t } = useI18n()
  const [s, set] = useState<Search>(Route.useSearch())
  const up = <K extends keyof Search>(k: K, v: Search[K]) => set(p => ({ ...p, [k]: v }))
  const num = (k: 'usia' | 'tinggi' | 'berat' | 'pinggang' | 'lemak', opt = false) => (
    <input className={inp} type="number" inputMode="decimal" step="any" required={!opt} value={s[k] ?? ''}
      onChange={e => up(k, (e.target.value === '' ? undefined : Number(e.target.value)) as never)} />
  )
  const sel = <K extends keyof Search>(k: K, opts: [string, string][]) => (
    <select className={inp} value={String(s[k])} onChange={e => up(k, (typeof s[k] === 'number' ? Number(e.target.value) : e.target.value) as never)}>
      {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  )
  return (
    <>
      <Nav />
      <Page>
        <h1 className="text-2xl font-bold">{t('Data dirimu', 'Your details')}</h1>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); nav({ to: '/hasil', search: s }) }}>
          <Card className="grid gap-4 sm:grid-cols-2">
            <Field label={t('Usia (tahun)', 'Age (years)')}>{num('usia')}</Field>
            <Field label={t('Jenis kelamin', 'Sex')}>{sel('jk', [['L', t('Laki-laki', 'Male')], ['P', t('Perempuan', 'Female')]])}</Field>
            <Field label={t('Tinggi (cm)', 'Height (cm)')}>{num('tinggi')}</Field>
            <Field label={t('Berat (kg)', 'Weight (kg)')}>{num('berat')}</Field>
            <Field label={t('Lingkar pinggang (cm), opsional', 'Waist (cm), optional')} hint={t('Untuk rasio pinggang-tinggi.', 'Used for waist-to-height ratio.')}>{num('pinggang', true)}</Field>
            <Field label={t('Persen lemak tubuh (%), opsional', 'Body fat (%), optional')} hint={t('Bila diisi, BMR dihitung dengan Katch-McArdle.', 'If filled in, BMR uses Katch-McArdle.')}>{num('lemak', true)}</Field>
            {s.jk === 'P' && (
              <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={s.hamil} onChange={e => up('hamil', e.target.checked)} /> {t('Sedang hamil atau menyusui', 'Pregnant or breastfeeding')}</label>
            )}
          </Card>
          <Card className="grid gap-4 sm:grid-cols-2">
            <Field label={t('Level aktivitas', 'Activity level')}>{sel('aktivitas', activityOpts(t))}</Field>
            <Field label={t('Tujuan', 'Goal')}>{sel('tujuan', [['cutting', t('Turun berat (cutting)', 'Lose weight (cutting)')], ['maintain', t('Jaga berat', 'Maintain weight')], ['bulking', t('Naik berat (bulking)', 'Gain weight (bulking)')]])}</Field>
            <Field label={t('Pembagian makro', 'Macro split')}>{sel('preset', [['moderate', t('Moderate (lemak 30%)', 'Moderate (30% fat)')], ['lower', t('Lower carb (lemak 40%)', 'Lower carb (40% fat)')], ['higher', t('Higher carb (lemak 20%)', 'Higher carb (20% fat)')]])}</Field>
            <Field label={`Protein: ${s.protein} g/kg`}><input className="w-full" type="range" min="1.6" max="2" step="0.1" value={s.protein} onChange={e => up('protein', Number(e.target.value))} /></Field>
          </Card>
          <Card className="grid gap-4 sm:grid-cols-2">
            <Field label={t('Hari latihan per minggu', 'Training days per week')}>{sel('hari', [['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6']])}</Field>
            <Field label={t('Lokasi latihan', 'Where you train')}>{sel('lokasi', [['rumah', t('Rumah (bodyweight/dumbbell)', 'Home (bodyweight/dumbbell)')], ['gym', 'Gym']])}</Field>
            <Field label={t('Anggaran makan', 'Food budget')}>{sel('anggaran', [['1', t('Hemat', 'Low')], ['2', t('Sedang', 'Medium')], ['3', t('Bebas', 'No limit')]])}</Field>
            <div className="text-sm">
              <span className="mb-1 block font-medium">{t('Preferensi menu', 'Menu preferences')}</span>
              <label className="mr-4 inline-flex items-center gap-2"><input type="checkbox" checked={s.halal} onChange={e => up('halal', e.target.checked)} /> Halal</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={s.veg} onChange={e => up('veg', e.target.checked)} /> Vegetarian</label>
            </div>
            <fieldset className="text-sm sm:col-span-2">
              <legend className="mb-1 font-medium">{t('Alergi', 'Allergies')}</legend>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {ALERGEN.map(a => (
                  <label key={a} className="inline-flex items-center gap-2"><input type="checkbox" checked={s.alergi.includes(a)} onChange={e => up('alergi', e.target.checked ? [...s.alergi, a] : s.alergi.filter(x => x !== a))} /> {t(a)}</label>
                ))}
              </div>
            </fieldset>
          </Card>
          <button className="w-full rounded-lg bg-brand px-6 py-3 font-semibold text-white sm:w-auto">{t('Hitung target kalori', 'Calculate calorie target')}</button>
        </form>
      </Page>
    </>
  )
}
