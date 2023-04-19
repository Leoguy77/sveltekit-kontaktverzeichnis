import dbCache from "$lib/scripts/dbCache.ts"
import { parseEntities } from "$lib/scripts/entityParser.ts"
import pb from "$lib/scripts/db.ts"

function testAuth(locals: any) {
  if (!locals?.pb?.authStore?.isValid) {
    return new Response('{"message":"Not authenticated"}', {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

export async function GET({ params }: any) {
  let [persons, ressources] = dbCache.getCache()

  let abteilungenID = params.id

  let filteredPersons = persons.filter((entry) => {
    if (entry.abteilungen.includes(abteilungenID)) return true
    else return false
  })
  let filteredRessources = ressources.filter((entry) => {
    if (entry.abteilungen.includes(abteilungenID)) return true
    else return false
  })

  let parsedEntities = parseEntities([filteredPersons, filteredRessources], null)

  let res = JSON.stringify(parsedEntities)

  return new Response(res, {
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export async function POST({ locals, params, body }: any) {
  testAuth(locals)

  console.log(body)
  await pb.collection("abteilung").update(params.id, { bezeichnung: "a" })

  return new Response(JSON.stringify({ Result: "Success" }), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export async function DELETE({ locals, params }: any) {
  testAuth(locals)

  // await pb.collection("abteilung").delete(params.id)
  return new Response(JSON.stringify({ Result: "Success" }), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}
