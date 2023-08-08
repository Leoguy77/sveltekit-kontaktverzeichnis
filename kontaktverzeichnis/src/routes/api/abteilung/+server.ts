import type { RequestHandler } from "./$types.ts"
import prisma from "$lib/server/prisma.ts"
export const GET: RequestHandler = async () => {
  const abteilungen = await prisma.abteilung.findMany({
    include: {
      _count: {
        select: { person: true, ressource: true },
      },
    },
  })
  return new Response(JSON.stringify(abteilungen), {
    headers: { "content-type": "application/json" },
  })
}
export const PATCH: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response("Unauthorized", {
      status: 401,
    })
  }
  const body = await request.json()
  const abteilung = await prisma.abteilung.update({
    where: { id: body.id },
    data: {
      bezeichnung: body.bezeichnung,
    },
  })
  return new Response(JSON.stringify(abteilung), {
    headers: { "content-type": "application/json" },
  })
}
export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response("Unauthorized", {
      status: 401,
    })
  }
  const body = await request.json()
  const abteilung = await prisma.abteilung.create({
    data: {
      bezeichnung: body.bezeichnung,
    },
  })
  return new Response(JSON.stringify(abteilung), {
    headers: { "content-type": "application/json" },
  })
}
export const DELETE: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response("Unauthorized", {
      status: 401,
    })
  }
  const body = await request.json()
  const abteilung = await prisma.abteilung.delete({
    where: { id: body.id },
  })
  return new Response(JSON.stringify(abteilung), {
    headers: { "content-type": "application/json" },
  })
}
