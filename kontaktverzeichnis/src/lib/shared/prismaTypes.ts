import type { Prisma } from "@prisma/client"

export const prismaInclude = { standort: true, telefonEintrag: { include: { eintragTyp: true, standort: true } }, abteilung: true }

export type person = Prisma.personGetPayload<{
  include: typeof prismaInclude
}>
