import dbCache from "$lib/scripts/dbCache.ts"

dbCache.refreshCache()

export async function GET({ params }: any) {
  //try {
  let [persons, ressources] = dbCache.getCache()
  let entries = [...persons, ...ressources]
  let abteilungenID = params.id

  let filterResult = entries.filter((entry) => {
    if (entry.abteilungen.includes(abteilungenID)) return true
    else return false
  })
  let Result: any = []
  filterResult.forEach((entry: any) => {
    let newEntry = entry
    delete newEntry.abteilungen
    delete newEntry.collectionId
    delete newEntry.collectionName
    delete newEntry.expand.abteilungen
    delete newEntry.created
    newEntry.expand.standort.forEach((standort: any) => {
      delete standort.collectionId
      delete standort.collectioName
      delete standort.created
      delete standort.updated
      delete standort.id
      delete standort.expand
    })
    newEntry.expand.telefonEintraege.forEach((telefonEintrag: any) => {
      delete telefonEintrag.collectionId
      delete telefonEintrag.collectionName
      delete telefonEintrag.eintragTyp
      delete telefonEintrag.created
      delete telefonEintrag.updated
      delete telefonEintrag.collectionId
      delete telefonEintrag.collectioName
      delete telefonEintrag.expand
      delete telefonEintrag.id
    })
    delete newEntry.index
    delete newEntry.secureData
    delete newEntry.telefonEintraege
    Result.push(newEntry)
  })

  // console.log(filterResult)

  let res = JSON.stringify(Result)

  return new Response(res, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  //   } catch (e) {
  //     return new Response('{"message":"Internal Error"}' + e, {
  //       status: 500,
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //   }
}
