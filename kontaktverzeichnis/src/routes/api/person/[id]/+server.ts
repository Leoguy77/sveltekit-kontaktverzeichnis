import prisma from "$lib/server/prisma.ts"
import type { RequestHandler } from "@sveltejs/kit"
import { prismaInclude } from "$lib/shared/prismaTypes.ts"

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
