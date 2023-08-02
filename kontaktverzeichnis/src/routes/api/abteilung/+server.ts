import type { RequestHandler } from "./$types.ts"
import prisma from "$lib/server/prisma.ts"
export const GET: RequestHandler = async () => {
  const abteilungen = await prisma.abteilung.findMany({
    include: {
      _count: {
        select: { person: true },
      },
    },
  })
  return new Response(JSON.stringify(abteilungen), {
    headers: { "content-type": "application/json" },
  })
}
