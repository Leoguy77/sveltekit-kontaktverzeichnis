// @ts-ignore
import trigramSimilarity from "trigram-similarity"
import type { Record } from "pocketbase"
import { getPersonIndex, getRessourceIndex } from "./indexGenerator.js"

function makeIterable(value: any): any {
  if (typeof value[Symbol.iterator] === "function") {
    return value
  }
  return [value]
}

function createCommonData(obj: any, searchStr: string | null) {
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

  let similarity = 0
  if (searchStr) {
    similarity = trigramSimilarity(searchStr.toLowerCase(), obj.index.toLowerCase())
  }

  let data = {
    similarity: similarity,
    id: obj.id,
    abteilungen: abteilungen,
    standort: standorte,
    kontakt: { telefonEintraege: telefonEintraege, email: obj.email },
  }

  return data
}

function checkFilter(obj: any, filter: string[]) {
  for (let filterItem of filter) {
    if (obj.index.toLowerCase().includes(filterItem.toLowerCase())) {
      return true
    }
  }
  return false
}

export function parseEntities([persons, ressources]: [Record[], Record[]], searchStr: string | null) {
  let result = []
  let filter = null
  if (searchStr) {
    filter = searchStr.split(" ")
  }

  if (persons) {
    for (let person of makeIterable(persons)) {
      person.index = getPersonIndex(person)
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

      if (filter) {
        if (checkFilter(person, filter)) {
          result.push(Object.assign(data, createCommonData(person, searchStr)))
        }
      } else {
        result.push(Object.assign(data, createCommonData(person, searchStr)))
      }
    }
  }

  if (ressources) {
    for (let ressource of makeIterable(ressources)) {
      ressource.index = getRessourceIndex(ressource)
      let data: any = {
        type: "ressource",
        name: {
          name: ressource.bezeichner,
          id: ressource.id,
          type: "ressource",
        },
      }

      if (filter) {
        if (checkFilter(ressource, filter)) {
          result.push(Object.assign(data, createCommonData(ressource, searchStr)))
        }
      } else {
        result.push(Object.assign(data, createCommonData(ressource, searchStr)))
      }
    }
  }

  return result
}
