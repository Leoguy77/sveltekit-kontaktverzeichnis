import prisma from "$lib/server/prisma.ts"
import type { RequestHandler } from "@sveltejs/kit"

export const GET: RequestHandler = async () => {
  let eintragtypen = await prisma.eintragTyp.findMany()

  return new Response(JSON.stringify(eintragtypen), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
