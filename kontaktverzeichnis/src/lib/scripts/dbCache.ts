import { Record } from "pocketbase"
import pb from "./db.js"

async function getFull(tableName: string) {
  let arr: Record[] = []
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
  cacheData: any

  constructor() {
    setInterval(async () => {
      this.refreshCache()
    }, 1000 * 60 * 5)
  }

  getCache() {
    return this.cacheData
  }

  async refreshCache() {
    let starttime = Date.now()

    let [persons, ressources] = await Promise.all([getFull("person"), getFull("ressource")])

    this.cacheData = [persons, ressources]

    console.log("Cache refresh took " + (Date.now() - starttime) + "ms")
  }
}

var dbCache = new dbCacheClass()
await dbCache.refreshCache()

export default dbCache
