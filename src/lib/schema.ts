import { z } from 'zod'

// Semua input hidup di URL (bisa dibagikan sebagai tautan); default dipakai bila param hilang.
export const searchSchema = z.object({
  usia: z.number().default(30),
  jk: z.enum(['L', 'P']).default('L'),
  tinggi: z.number().default(170),
  berat: z.number().default(70),
  aktivitas: z.enum(['sedentary', 'light', 'moderate', 'heavy', 'athlete']).default('light'),
  tujuan: z.enum(['cutting', 'maintain', 'bulking']).default('cutting'),
  langkah: z.enum(['ringan', 'moderat', 'agresif']).default('moderat'),
  preset: z.enum(['moderate', 'lower', 'higher']).default('moderate'),
  protein: z.number().min(1.6).max(2).default(1.8),
  hamil: z.boolean().default(false),
  pinggang: z.number().optional(),
  lemak: z.number().optional(),
  hari: z.number().min(2).max(6).default(3),
  lokasi: z.enum(['rumah', 'gym']).default('rumah'),
  halal: z.boolean().default(false),
  veg: z.boolean().default(false),
  alergi: z.array(z.string()).default([]),
  anggaran: z.number().min(1).max(3).default(3),
  seed: z.number().default(0),
})
export type Search = z.infer<typeof searchSchema>
