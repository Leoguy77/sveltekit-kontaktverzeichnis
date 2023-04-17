// @ts-ignore
import trigramSimilarity from "trigram-similarity"
import dbCache from "$lib/scripts/dbCache.js"

export async function GET({ params }: any) {
  try {
    let searchStr = params.searchStr
    console.log("Search for '" + searchStr + "'")
    console.log("Search for " + searchStr.length)

    function normalSearch() {
      let starttime = Date.now()

      let filter = searchStr.split(" ")
      let [persons, ressources] = dbCache.getCache()

      console.log("DB took " + (Date.now() - starttime) + "ms")

      function makeIterable(value: any): any {
        if (typeof value[Symbol.iterator] === "function") {
          return value
        }
        return [value]
      }

      function checkFilter(obj: any) {
        for (let filterItem of filter) {
          if (obj.index.toLowerCase().includes(filterItem.toLowerCase())) {
            return true
          }
        }
        return false
      }

      function createCommonData(obj: any) {
        let abteilungen = []
        if (obj.expand.abteilungen) {
          for (let abteilung of makeIterable(obj.expand.abteilungen)) {
            abteilungen.push({
              id: abteilung.id,
              bezeichnung: abteilung.bezeichnung,
            })
          }
        }
        abteilungen.sort((a: any, b: any) => {
          if (a.bezeichnung < b.bezeichnung) {
            return -1
          }
          if (a.bezeichnung > b.bezeichnung) {
            return 1
          }
          return 0
        })

        let telefonEintraege = []
        if (obj.expand.telefonEintraege) {
          for (let telefonEintrag of makeIterable(obj.expand.telefonEintraege)) {
            telefonEintraege.push({
              id: telefonEintrag.id,
              nummer: telefonEintrag.nummer,
              eintragTyp: telefonEintrag.expand.eintragTyp.bezeichner,
              standort: telefonEintrag.expand.standort.bezeichnung,
            })
          }
        }

        let standorte = []
        if (obj.expand.standort) {
          for (let standort of makeIterable(obj.expand.standort)) {
            standorte.push({
              id: standort.id,
              bezeichnung: standort.bezeichnung,
            })
          }
        }
        standorte.sort((a: any, b: any) => {
          if (a.bezeichnung < b.bezeichnung) {
            return -1
          }
          if (a.bezeichnung > b.bezeichnung) {
            return 1
          }
          return 0
        })
        let similarity = trigramSimilarity(searchStr.toLowerCase(), obj.index.toLowerCase())
        //let similarity = stringSimilarity.compareTwoStrings(searchStr.toLowerCase(), obj.index.toLowerCase())

        let data = {
          similarity: similarity,
          id: obj.id,
          abteilungen: abteilungen,
          standort: standorte,
          kontakt: { telefonEintraege: telefonEintraege, email: obj.email },
        }

        return data
      }

      // main part of the function
      let result = []

      if (persons) {
        for (let person of makeIterable(persons)) {
          let name = ""
          if (person.titel) {
            name += person.titel + " "
          }

          let data: any = {
            type: "person",
            name: {
              name: `${name}${person.vorname} ${person.nachname}`,
              id: person.id,
              type: "person",
            },
          }
          if (checkFilter(person)) {
            result.push(Object.assign(data, createCommonData(person)))
          }
        }
      }

      if (ressources) {
        for (let ressource of makeIterable(ressources)) {
          let data: any = {
            type: "ressource",
            name: {
              name: ressource.bezeichner,
              id: ressource.id,
              type: "ressource",
            },
          }
          if (checkFilter(ressource)) {
            result.push(Object.assign(data, createCommonData(ressource)))
          }
        }
      }

      result.sort((a: any, b: any) => {
        if (a.similarity > b.similarity) {
          return -1
        }
        if (a.similarity < b.similarity) {
          return 1
        }
        return 0
      })

      console.log(`Search took ${Date.now() - starttime}ms`)

      if (result.length > 100) {
        result = result.slice(0, 100)
      }

      let res = JSON.stringify(result)
      return res
    }

    function departmentSearch() {}

    if (searchStr.length < 3) {
      return new Response('{"message":"The searchStr must be longer than 2 symbols"}', {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    let res = ""
    if (params.searchMode == 0) {
      res = normalSearch()
    } else if (params.searchMode == 1) {
      departmentSearch()
    }

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
