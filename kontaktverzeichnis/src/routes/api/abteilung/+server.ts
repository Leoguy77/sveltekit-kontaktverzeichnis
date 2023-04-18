import db from "$lib/scripts/db.ts"
import dbCache from "$lib/scripts/dbCache.ts"

export async function GET() {
  try {
    let abteilungen = await db.collection("abteilung").getFullList()
    for (let abteilung of abteilungen) {
      abteilung.count = 0
    }

    let [persons, ressources] = dbCache.getCache()
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
