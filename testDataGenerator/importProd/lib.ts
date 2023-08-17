import prisma from "./prisma.ts"

class Collection {
  cache: { [name: string]: { id: number } } = {}
  searchCollection: "standort" | "abteilung"

  constructor(type: "standort" | "abteilung") {
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
        throw new Error(`${this.searchCollection} ${searchName} nicht gefunden`)
      }
    }
  }
}

export const standort = new Collection("standort")
export const abteilung = new Collection("abteilung")
