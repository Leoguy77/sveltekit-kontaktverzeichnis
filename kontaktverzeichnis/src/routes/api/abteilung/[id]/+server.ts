import type { RequestHandler } from "./$types.ts"
import { prismaInclude } from "$lib/shared/prismaTypes.ts"
import prisma from "$lib/server/prisma.ts"
export const GET: RequestHandler = async ({ params, locals }) => {
  const abteilung = await prisma.abteilung.findUniqueOrThrow({
    where: { id: Number(params?.id) },
    include: {
      person: {
        include: prismaInclude,
      },
      ressource: {
        include: prismaInclude,
      },
    },
  })
  if (!locals.user) {
    abteilung.person = abteilung.person.map((p) => {
      p.kostenstelle = null
      p.personalnummer = null
      return p
    })
  }

  return new Response(JSON.stringify(abteilung), {
    headers: { "content-type": "application/json" },
  })
}
