import prisma from "./prisma.ts"

class Collection {
  cache: { [name: string]: { id: number } } = {}
  searchCollection: "standort" | "abteilung" | "eintragTyp"

  constructor(type: "standort" | "abteilung" | "eintragTyp") {
    this.searchCollection = type
  }

  async get(searchName: string) {
    if (this.cache[searchName]) {
      return this.cache[searchName].id
    } else {
      // DB Suche
      let res = await prisma[this.searchCollection].findFirst({ where: { bezeichnung: searchName } })
      if (res) {
        this.cache[searchName] = { id: res.id }
        return res.id
      } else {
        if (this.searchCollection === "abteilung") {
          let abteilung = await prisma.abteilung.create({ data: { bezeichnung: searchName } })
          if (abteilung) {
            this.cache[searchName] = { id: abteilung.id }
            return abteilung.id
          }
        }
        throw new Error(`${this.searchCollection} ${searchName} nicht gefunden`)
      }
    }
  }
}

export const standort = new Collection("standort")
export const abteilung = new Collection("abteilung")
export const eintragTyp = new Collection("eintragTyp")
