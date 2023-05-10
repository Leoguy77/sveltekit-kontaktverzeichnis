import { redirect } from "@sveltejs/kit"
import dbCache from "$lib/scripts/dbCache.js"

export async function GET({ locals }: any) {
  let ressource: any
  let forward: boolean
  try {
    if (!locals?.pb?.authStore?.isValid) {
      return new Response('{"message":"Not authenticated"}', {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }
    ressource = await locals.pb.collection("ressource").create()
    dbCache.refreshCache()
    forward = true
  } catch {
    return new Response('{"message":"Internal Error"}', {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
  if (forward) {
    throw redirect(303, `/ressource/id/${ressource.id}`)
  }
}
