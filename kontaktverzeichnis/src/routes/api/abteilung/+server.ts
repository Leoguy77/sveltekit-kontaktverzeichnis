import db from "$lib/server/db.ts"
import dbCache from "$lib/server/dbCache.ts"
import type { RequestHandler, RequestEvent } from "./$types.ts"
import { createDepartment, getDepartments } from "$lib/server/dbFunctions.ts"
export async function GET() {
  try {
    let departments = await getDepartments(db)

    let res = JSON.stringify(departments)
    return new Response(res, {
      headers: {
        "Content-Type": "application/json",
        "cache-control": "max-age=60",
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

export const POST = (async ({ request, locals }: any) => {
  // if (!locals?.pb?.authStore?.isValid) {
  //   return new Response('{"message":"Not authenticated"}', {
  //     status: 401,
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  // }
  const data = await request.json()
  try {
    let result = await createDepartment(db, data.bezeichnung)
    return new Response(JSON.stringify({ Result: "Success", id: result }), {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (e) {
    console.log(e)
    return new Response('{"message":"Internal Error"}', {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}) satisfies RequestHandler
