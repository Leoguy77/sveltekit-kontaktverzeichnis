import db from "$lib/scripts/db.ts"
import dbCache from "$lib/scripts/dbCache.ts"
import type { RequestHandler, RequestEvent } from "./$types.ts"

export async function GET() {
  try {
    let abteilungen = await db.collection("abteilung").getFullList()
    for (let abteilung of abteilungen) {
      abteilung.count = 0
    }

    let [persons, ressources] = dbCache.getEntities()
    let entries = [...persons, ...ressources]

    for (let entry of entries) {
      let abteilungenIDs = entry.abteilungen
      for (let abteilung of abteilungenIDs) {
        let index = abteilungen.findIndex((a) => a.id === abteilung)
        if (index !== -1) {
          abteilungen[index].count++
        }
      }
    }

    let res = JSON.stringify(abteilungen)

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

export const POST = (async ({ request, locals }: any) => {
  if (!locals?.pb?.authStore?.isValid) {
    return new Response('{"message":"Not authenticated"}', {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
  const data = await request.json()
  try {
    let result = await locals.pb.collection("abteilung").create({ bezeichnung: data.bezeichnung })
    dbCache.refreshCache()
    return new Response(JSON.stringify({ Result: "Success", id: result.id }), {
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
