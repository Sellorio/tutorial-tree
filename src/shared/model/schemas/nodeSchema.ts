import { LEGACY_CATEGORY_IDS } from '../constants/CATEGORIES'
import { NODE_ICONS } from '../constants/NODE_ICONS'
import { safeImage } from '../safeImage'
import { youtubeEmbed } from '../youtubeEmbed'
import { idSchema } from './idSchema'
import { z } from 'zod'

export const nodeSchema = z.preprocess(
  (value) => {
    if (!value || typeof value !== 'object') return value
    const node = { ...value } as Record<string, unknown>
    const category = node.categoryId ?? node.accent
    if (typeof category === 'string')
      node.categoryId = LEGACY_CATEGORY_IDS[category] ?? category
    delete node.accent
    return node
  },
  z
    .object({
      id: idSchema,
      kind: z.enum(['start', 'task']),
      name: z.string().max(80).default(''),
      title: z.string().max(80),
      description: z.string().max(10000),
      position: z.object({ x: z.number().finite(), y: z.number().finite() }),
      categoryId: idSchema,
      size: z.enum(['small', 'medium', 'large']).default('medium'),
      media: z.enum(['image', 'icon']).optional(),
      icon: z.enum(NODE_ICONS).default('sparkles'),
      image: z
        .string()
        .max(3000000)
        .refine(safeImage, 'Use an image URL or an uploaded image.'),
      youtube: z
        .string()
        .max(2000)
        .refine(
          (value) => !value || youtubeEmbed(value) !== null,
          'Enter a valid YouTube video URL.',
        ),
      requirement: z.enum(['all', 'any']),
      tips: z
        .array(
          z.object({
            id: idSchema,
            short: z.string().max(160),
            long: z.string().max(10000),
          }),
        )
        .max(100),
      userTips: z
        .array(
          z.object({
            id: idSchema,
            text: z.string().max(10000),
          }),
        )
        .max(100)
        .default([]),
    })
    .transform((node) => ({
      ...node,
      media:
        node.media ?? (node.image ? ('image' as const) : ('icon' as const)),
    })),
)
