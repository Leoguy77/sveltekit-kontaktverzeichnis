import prisma, { prismaInclude } from "$lib/server/prisma.ts"
import type { person } from "@prisma/client"

import type { RequestHandler } from "@sveltejs/kit"

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!params.id) {
    return new Response("Invalid request", {
      status: 400,
    })
  }

  let person = await prisma.person.findUnique({
    where: {
      id: Number(params.id),
    },
    include: prismaInclude,
  })

  if (!person) {
    return new Response(`User ${params.id} not found`, {
      status: 404,
    })
  }

  if (!locals.user) {
    person.kostenstelle = null
    person.personalnummer = null
  }

  return new Response(JSON.stringify(person), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const POST: RequestHandler = async ({ params, request, locals }) => {
  const body = await request.json()
  if (body) {
  }

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
        connect: [
          body.abteilung.map((obj: any) => {
            return { id: obj.id }
          }),
        ],
      },
      standort: {
        connect: [
          body.standort.map((obj: any) => {
            return { id: obj.id }
          }),
        ],
      },
    },
  })

  return new Response(JSON.stringify(`{id:${person.id}}`), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const PUT: RequestHandler = async ({ params, request, locals }) => {
  return new Response("Success", {
    status: 200,
  })
}
