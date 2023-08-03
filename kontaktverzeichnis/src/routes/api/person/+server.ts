import prisma from "$lib/server/prisma.ts"
import type { RequestHandler } from "@sveltejs/kit"
import { prismaInclude } from "$lib/shared/prismaTypes.ts"

export const POST: RequestHandler = async ({ request, locals }) => {
  const body = await request.json()

  let personId = body.id
  if (personId) {
  } else {
    let telefonEintraege = body.telefonEintrag.map((obj: any) => {
      obj.eintragTypId = obj.eintragTyp.id
      obj.eintragTyp = undefined
      obj.standortId = obj.standort.id
      obj.standort = undefined
    })
    let person = await prisma.person.create({
      data: {
        vorname: body.vorname,
        nachname: body.nachname,
        titel: body.titel,
        email: body.email,
        kostenstelle: body?.kostenstelle,
        personalnummer: body?.personalnummer,
        telefonEintrag: { create: body.telefonEintrag },
        abteilung: {
          connect: body.abteilung.map((obj: any) => {
            return { id: obj.id }
          }),
        },
        standort: {
          connect: body.standort.map((obj: any) => {
            return { id: obj.id }
          }),
        },
      },
    })
    personId = person.id
  }

  return new Response(`{"id":${personId}}`, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
