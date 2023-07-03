// @ts-ignore
import trigramSimilarity from "trigram-similarity"
import type { Record } from "pocketbase"
import { getPersonIndex, getRessourceIndex } from "./indexGenerator.ts"

function makeIterable(value: any): any {
  if (typeof value[Symbol.iterator] === "function") {
    return value
  }
  return [value]
}

export function createCommonData(obj: any, searchStr: string | null) {
  let abteilungen = []
  if (obj.abteilungen) {
    const regex = /(\d+)\s\(([^)]+)\)/g
    const departmentPairs = []

    let match
    while ((match = regex.exec(obj.abteilungen)) !== null) {
      const id = match[1]
      const bezeichnung = match[2]
      departmentPairs.push({ id, bezeichnung })
    }
    for (let abteilung of departmentPairs) {
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
  if (obj.nummern) {
    const regex = /(\d+)\s\(([^)]+)\),\s(\d+)\s\(([^)]+)\)/g
    const entries = []

    let match
    while ((match = regex.exec(obj.nummern)) !== null) {
      const id = match[1]
      const entryData = match[2]
      const entryParts = entryData.split(", ").map((part) => part.trim())
      const vorwahl = entryParts[0]
      const nummer = entryParts[1]
      const standort = entryParts[2]
      const einTragTyp = entryParts[3]
      entries.push({ id, vorwahl, nummer, standort, einTragTyp })
    }

    for (let telefonEintrag of entries) {
      telefonEintraege.push({
        id: telefonEintrag.id,
        nummer: telefonEintrag.nummer,
        eintragTyp: telefonEintrag.einTragTyp,
        standort: telefonEintrag.standort,
      })
    }
  }

  let standorte = []
  if (obj.standorte) {
    const regex = /(\d+)\s\(([^)]+)\)/g
    const entries = []

    let match
    while ((match = regex.exec(obj.standorte)) !== null) {
      const id = match[1]
      const bezeichnung = match[2].trim()

      entries.push({ id, bezeichnung })
    }

    for (let standort of entries) {
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
          name: ressource.bezeichnung,
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
