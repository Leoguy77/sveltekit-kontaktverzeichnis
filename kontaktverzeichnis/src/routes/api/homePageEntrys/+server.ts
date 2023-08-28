import prisma from "$lib/server/prisma.ts"
import { prismaInclude } from "$lib/shared/prismaTypes.ts"
import type { RequestHandler } from "@sveltejs/kit"
export const GET: RequestHandler = async () => {
  const persons = await prisma.person.findMany({
    where: {
      showOnHome: true,
    },
    include: prismaInclude,
  })
  const ressources = await prisma.ressource.findMany({
    where: {
      showOnHome: true,
    },
    include: prismaInclude,
  })

  return new Response(JSON.stringify([persons, ressources]), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "max-age=86400",
    },
  })
}
