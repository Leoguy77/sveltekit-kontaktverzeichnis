import type { Record } from "pocketbase"
import pb from "./db.ts"

async function getFull(tableName: string) {
  let arr = []
  let resLenght = 500
  let page = 1

  while (resLenght === 500) {
    let res = await pb.collection(tableName).getList(page, 500, {
      expand: "standort,abteilungen,telefonEintraege,telefonEintraege.eintragTyp,telefonEintraege.standort",
    })
    resLenght = res.items.length
    page++

    arr.push(...res.items)
  }

  return arr
}

class dbCacheClass {
  cacheData: { entities: [Record[], Record[]]; departments: Record[] } = { entities: [[], []], departments: [] }

  refreshing = false

  constructor() {
    setInterval(async () => {
      this.refreshCache()
    }, 1000 * 60 * 5)
  }

  getEntities() {
    return structuredClone(this.cacheData.entities)
  }

  getDepartments() {
    return structuredClone(this.cacheData.departments)
  }

  async refreshCache(): Promise<void> {
    if (this.refreshing) return
    this.refreshing = true

    let starttime = Date.now()

    let [persons, ressources] = await Promise.all([getFull("person"), getFull("ressource")])

    this.cacheData.entities = [persons, ressources]

    this.refreshing = false
    console.log("Cache refresh took " + (Date.now() - starttime) + "ms")
  }
}

var dbCache = new dbCacheClass()

export default dbCache
