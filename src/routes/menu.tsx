import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { Actions, Card, Disclaimer, Nav, Page } from '../components/Shell'
import { blocker, calc } from '../lib/calc'
import { genMenu } from '../lib/menu'
import { useI18n } from '../lib/i18n'
import { searchSchema } from '../lib/schema'

export const Route = createFileRoute('/menu')({ validateSearch: searchSchema, component: Menu })

function Menu() {
  const s = Route.useSearch()
  const nav = useNavigate()
  const { en, t, num } = useI18n()
  const k = t('kkal', 'kcal')
  const block = blocker(s)
  const menu = useMemo(() => {
    if (block) return null
    const r = calc(s)
    return { r, m: genMenu({ kcal: r.target, p: r.macro.p }, s, s.seed) }
  }, [s, block])

  return (
    <>
      <Nav s={s} />
      <Page>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold">{t('Menu harian', 'Daily menu')}</h1>
          <div className="flex gap-2"><button className="print:hidden rounded-lg border border-stone-300 px-3 py-1.5 text-sm" onClick={() => nav({ to: '/menu', search: { ...s, seed: s.seed + 1 }, replace: true })}>{t('Ganti menu', 'New menu')}</button><Actions /></div>
        </div>
        {block && <Card className="border-amber-300 bg-amber-50">{t(block)}</Card>}
        {menu && !menu.m && <Card>{t('Tidak ada makanan yang lolos filter (vegetarian, alergi, anggaran). Longgarkan salah satunya di halaman Hitung.', 'No foods match your filters (vegetarian, allergies, budget). Loosen one of them on the Calculate page.')}</Card>}
        {menu?.m && (
          <>
            <Card className="text-sm">
              Total <b>{num(menu.m.total.kcal)} {k}</b> (target {num(menu.r.target)}) · protein <b>{Math.round(menu.m.total.p)} g</b> (target {menu.r.macro.p}) · {t('lemak', 'fat')} {Math.round(menu.m.total.f)} g · {t('karbo', 'carbs')} {Math.round(menu.m.total.c)} g
            </Card>
            {menu.m.meals.map(meal => (
              <Card key={meal.nama} className="break-inside-avoid">
                <div className="flex justify-between font-semibold"><h2>{t(meal.nama)}</h2><span>{num(meal.kcal)} {k}</span></div>
                <ul className="mt-2 space-y-1 text-sm">
                  {meal.items.map(i => (
                    <li key={i.food.id} className="flex justify-between gap-2"><span>{t(i.food.nama)} <span className="text-stone-500">· {num(i.porsi, 1)} {t(i.food.urt)} ({Math.round(i.g)} g)</span></span><span className="text-stone-500">{num(i.kcal)} {k}</span></li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-stone-500">Protein {Math.round(meal.p)} g · {t('Lemak', 'Fat')} {Math.round(meal.f)} g · {t('Karbo', 'Carbs')} {Math.round(meal.c)} g</p>
              </Card>
            ))}
          </>
        )}
        <p className="text-xs text-stone-500">{t('Contoh menu dari nilai gizi perkiraan TKPI; belum divalidasi ahli gizi. Berat makanan adalah berat matang/siap makan.', 'Sample menu based on estimated nutrition values from TKPI (Indonesian Food Composition Table), not yet reviewed by a dietitian. Weights are for cooked, ready-to-eat food.')}</p>
        <Disclaimer />
      </Page>
    </>
  )
}
