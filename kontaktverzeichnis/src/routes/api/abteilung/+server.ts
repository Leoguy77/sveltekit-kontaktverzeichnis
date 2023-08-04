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
export const PATCH: RequestHandler = async ({ request }) => {
  const body = await request.json()
  console.log(body)
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
