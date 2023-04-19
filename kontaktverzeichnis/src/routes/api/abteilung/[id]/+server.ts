import dbCache from "$lib/scripts/dbCache.ts"
import { parseEntities } from "$lib/scripts/entityParser.ts"

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
