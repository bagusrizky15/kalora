import { Link } from '@tanstack/react-router'
import { useState, type ReactNode } from 'react'
import { useI18n } from '../lib/i18n'
import type { Search } from '../lib/schema'

export function Nav({ s }: { s?: Search }) {
  const { en, t } = useI18n()
  const tabs = [['/hasil', t('Hasil', 'Results')], ['/menu', 'Menu'], ['/latihan', t('Latihan', 'Workout')]] as const
  return (
    <header className="print:hidden border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="text-lg font-bold text-brand">Kalora</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/hitung" search={s as never}>{t('Hitung', 'Calculate')}</Link>
          <Link to="/tentang">{t('Tentang', 'About')}</Link>
          <Link to="." search={(p: object) => ({ ...p, lang: en ? undefined : 'en' }) as never} replace className="rounded border border-stone-300 px-2 py-0.5 text-xs font-semibold" hrefLang={en ? 'id' : 'en'}>
            {en ? 'ID' : 'EN'}
          </Link>
        </nav>
      </div>
      {s && (
        <div className="mx-auto flex max-w-3xl gap-2 px-4 pb-3">
          {tabs.map(([to, l]) => (
            <Link key={to} to={to} search={s as never} className="rounded-full border border-stone-300 px-4 py-1.5 text-sm" activeProps={{ className: 'bg-brand border-brand text-white' }}>{l}</Link>
          ))}
        </div>
      )}
    </header>
  )
}

export function Actions() {
  const { t } = useI18n()
  const [ok, setOk] = useState(false)
  return (
    <div className="print:hidden flex gap-2">
      <button className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm" onClick={() => window.print()}>{t('Simpan PDF / cetak', 'Save PDF / print')}</button>
      <button className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm" onClick={() => navigator.clipboard.writeText(location.href).then(() => { setOk(true); setTimeout(() => setOk(false), 1500) })}>{ok ? t('Tersalin ✓', 'Copied ✓') : t('Salin tautan', 'Copy link')}</button>
    </div>
  )
}

export const Page = ({ children }: { children: ReactNode }) => <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">{children}</main>
export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => <section className={`rounded-xl border border-stone-200 bg-white p-4 ${className}`}>{children}</section>
export function Disclaimer() {
  const { en } = useI18n()
  return en
    ? <p className="text-xs text-stone-500">All numbers are estimates (±10%) from formulas, not a diagnosis. Kalora does not replace advice from a doctor or dietitian. <Link to="/tentang" className="underline">Learn more</Link></p>
    : <p className="text-xs text-stone-500">Semua angka adalah perkiraan (±10%) dari rumus, bukan diagnosis. Kalora bukan pengganti saran dokter atau ahli gizi. <Link to="/tentang" className="underline">Selengkapnya</Link></p>
}
