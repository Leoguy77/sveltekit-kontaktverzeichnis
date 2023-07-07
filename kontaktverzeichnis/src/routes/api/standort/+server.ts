import { getAllStandorte } from "$lib/server/dbFunctions.ts"
import db from "$lib/server/db.ts"
export async function GET({ locals }: any) {
  try {
    if (!locals?.pb?.authStore?.isValid) {
      return new Response('{"message":"Not authenticated"}', {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }
    let standorte = await getAllStandorte(db)
    let res = JSON.stringify(standorte)

    return new Response(res, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch {
    return new Response('{"message":"Internal Error"}', {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
