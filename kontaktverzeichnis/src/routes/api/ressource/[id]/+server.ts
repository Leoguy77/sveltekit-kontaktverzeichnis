import prisma from "$lib/server/prisma.ts"
import type { RequestHandler } from "@sveltejs/kit"
import { prismaInclude } from "$lib/shared/prismaTypes.ts"

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!params.id) {
    return new Response("Invalid request", {
      status: 400,
    })
  }

  let ressource = await prisma.ressource.findUnique({
    where: {
      id: Number(params.id),
    },
    include: prismaInclude,
  })

  if (!ressource) {
    return new Response(`User ${params.id} not found`, {
      status: 404,
    })
  }

  return new Response(JSON.stringify(ressource), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
