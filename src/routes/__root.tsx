import { HeadContent, Outlet, Scripts, createRootRoute, retainSearchParams } from '@tanstack/react-router'
import css from '../styles.css?url'
import { langSchema, useI18n } from '../lib/i18n'

export const Route = createRootRoute({
  validateSearch: langSchema,
  search: { middlewares: [retainSearchParams(['lang'])] },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Kalora: kalkulator kalori, menu, dan latihan' },
      { name: 'description', content: 'Hitung BMR, TDEE, kalori, dan makro, lalu lihat contoh menu makanan Indonesia dan program latihan. Gratis, tanpa akun.' },
    ],
    links: [{ rel: 'stylesheet', href: css }],
  }),
  component: Root,
})

function Root() {
  const { lang } = useI18n()
  return (
    <html lang={lang}>
      <head><HeadContent /></head>
      <body className="bg-stone-50 text-stone-900"><Outlet /><Scripts /></body>
    </html>
  )
}
