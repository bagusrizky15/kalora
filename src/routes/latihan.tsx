import { createFileRoute } from '@tanstack/react-router'
import { Actions, Card, Disclaimer, Nav, Page } from '../components/Shell'
import { blocker } from '../lib/calc'
import { guide, program } from '../lib/workout'
import { useI18n } from '../lib/i18n'
import { searchSchema } from '../lib/schema'

export const Route = createFileRoute('/latihan')({ validateSearch: searchSchema, component: Latihan })

function Latihan() {
  const s = Route.useSearch()
  const block = blocker(s)
  const { en, t, num } = useI18n()
  const p = block ? null : program(s.hari, s.lokasi, s.tujuan)
  return (
    <>
      <Nav s={s} />
      <Page>
        <div className="flex flex-wrap items-center justify-between gap-2"><h1 className="text-2xl font-bold">{t('Program latihan', 'Workout plan')}</h1><Actions /></div>
        {block && <Card className="border-amber-300 bg-amber-50">{t(block)}</Card>}
        {p && (
          <>
            <Card className="text-sm">
              {en
                ? <><b>{p.split}</b>, {s.hari}×/week at {s.lokasi === 'gym' ? 'the gym' : 'home'}. Step goal <b>{num(p.langkah)}</b>/day. Cardio: {t(p.kardio)}.</>
                : <><b>{p.split}</b>, {s.hari}×/minggu di {s.lokasi === 'gym' ? 'gym' : 'rumah'}. Target langkah <b>{num(p.langkah)}</b>/hari. Kardio: {p.kardio}.</>}
            </Card>
            {p.sessions.map(se => (
              <Card key={se.hari} className="break-inside-avoid">
                <h2 className="font-semibold">{t('Hari', 'Day')} {se.hari} · {se.nama}</h2>
                <ul className="mt-2 space-y-1 text-sm">
                  {se.latihan.map((l, i) => (
                    <li key={i} className="flex justify-between gap-2">
                      <span><a className="underline" href={guide(l.ex.n)} target="_blank" rel="noreferrer">{t(l.ex.n)}</a> <span className="text-stone-500">· {t(l.ex.otot)}</span></span>
                      <span className="whitespace-nowrap">{l.set} × {t(l.rep)}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
            <p className="text-xs text-stone-500">{t('Istirahat 60–90 detik antar set. Naikkan beban atau repetisi sedikit demi sedikit. Berhenti bila terasa nyeri. Kuasai bentuk gerakan yang benar sebelum menambah beban.', 'Rest 60–90 seconds between sets. Add weight or reps a little at a time. Stop if something hurts. Learn good form before you add weight.')}</p>
          </>
        )}
        <Disclaimer />
      </Page>
    </>
  )
}
