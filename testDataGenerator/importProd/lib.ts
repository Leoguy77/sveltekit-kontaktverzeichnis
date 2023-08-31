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
        let dataSet = await prisma[this.searchCollection].create({ data: { bezeichnung: searchName } })
        if (dataSet) {
          this.cache[searchName] = { id: dataSet.id }
          return dataSet.id
        }
        throw new Error(`Could not create ${searchName} in ${this.searchCollection}`)
      }
    }
  }
}

export const standort = new Collection("standort")
export const abteilung = new Collection("abteilung")
export const eintragTyp = new Collection("eintragTyp")
