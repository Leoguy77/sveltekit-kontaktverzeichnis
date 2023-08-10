import prisma from "$lib/server/prisma.ts"
import type { RequestHandler } from "@sveltejs/kit"
import { prismaInclude } from "$lib/shared/prismaTypes.ts"

function formatTelefoneintraege(telefonEintraege: any[]) {
  telefonEintraege.forEach((obj: any) => {
    obj.eintragTypId = obj.eintragTyp.id
    obj.eintragTyp = undefined
    obj.standortId = obj.standort.id
    obj.standort = undefined
  })
}

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response("Unauthorized", {
      status: 401,
    })
  }
  const body = await request.json()

  formatTelefoneintraege(body.telefonEintrag)
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

  return new Response(`{"id":${person.id}}`, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const PATCH: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response("Unauthorized", {
      status: 401,
    })
  }

  const body = await request.json()

  // Einträge [old,new]
  let telefonEintraege: any = { old: [], new: [] }
  body.telefonEintrag.forEach((obj: any) => {
    if (obj.id) {
      telefonEintraege.old.push(obj)
    } else {
      telefonEintraege.new.push(obj)
    }
  })

  formatTelefoneintraege(telefonEintraege.new)

  let updatedPerson = await prisma.person.update({
    where: { id: body.id },
    data: {
      vorname: body.vorname,
      nachname: body.nachname,
      titel: body.titel,
      email: body.email,
      kostenstelle: body?.kostenstelle,
      personalnummer: body?.personalnummer,
      telefonEintrag: {
        deleteMany: {
          NOT: telefonEintraege.old.map((obj: any) => ({ id: obj.id })),
        },
        create: telefonEintraege.new,
      },
      abteilung: {
        set: [],
        connect: body.abteilung.map((obj: any) => ({ id: obj.id })),
      },
      standort: {
        set: [],
        connect: body.standort.map((obj: any) => ({ id: obj.id })),
      },
    },
  })

  return new Response(`{"id":${updatedPerson.id}}`, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
export const DELETE: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response("Unauthorized", {
      status: 401,
    })
  }

  const body = await request.json()

  let deletedPerson = await prisma.person.delete({
    where: { id: body.id },
  })

  return new Response(`{"id":${deletedPerson.id}}`, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
