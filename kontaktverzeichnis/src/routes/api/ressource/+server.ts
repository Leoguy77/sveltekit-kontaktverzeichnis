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
  let ressource = await prisma.ressource.create({
    data: {
      bezeichnung: body.bezeichnung,
      email: body.email,
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

  return new Response(`{"id":${ressource.id}}`, {
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

  let updatedRessource = await prisma.ressource.update({
    where: { id: body.id },
    data: {
      bezeichnung: body.bezeichnung,
      email: body.email,
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

  return new Response(`{"id":${2}}`, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
