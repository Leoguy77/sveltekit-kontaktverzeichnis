import dbCache from "$lib/server/dbCache.ts"
import { parseEntities } from "$lib/server/entityParser.ts"
import { getDepartment } from "$lib/server/dbFunctions.ts"
import util from "util"
import db from "$lib/server/db.ts"

export async function GET({ params }: any) {
  let [bezeichnung, persons, ressources] = await getDepartment(params.id, db)
  let parsedEntities = parseEntities([persons, ressources], null)
  parsedEntities[0].bezeichnung = bezeichnung[0].bezeichnung
  let res = JSON.stringify(parsedEntities)

  return new Response(res, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "max-age=60",
    },
  })
}

export async function POST({ locals, params, request }: any) {
  if (!locals?.pb?.authStore?.isValid) {
    return new Response('{"message":"Not authenticated"}', {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
  let json = await request.json()
  await locals.pb.collection("abteilung").update(params.id, { bezeichnung: json.bezeichnung })
  return new Response(JSON.stringify({ Result: "Success" }), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export async function DELETE({ locals, params }: any) {
  if (!locals?.pb?.authStore?.isValid) {
    return new Response('{"message":"Not authenticated"}', {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  await locals.pb.collection("abteilung").delete(params.id)
  dbCache.refreshCache()
  return new Response(JSON.stringify({ Result: "Success" }), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}
