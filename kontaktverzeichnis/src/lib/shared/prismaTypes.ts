import type { Prisma } from "@prisma/client"

export const prismaInclude = {
  standort: true,
  telefonEintrag: { include: { eintragTyp: true, standort: true } },
  abteilung: true,
  funktionsBezeichnung: true,
}

export type person = Prisma.personGetPayload<{
  include: typeof prismaInclude
}>

export type ressource = Prisma.ressourceGetPayload<{
  include: typeof prismaInclude
}>
