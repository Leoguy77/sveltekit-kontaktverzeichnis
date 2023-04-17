import pb from "./db.js"

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

    let [persons, ressources] = await Promise.all([
      pb.collection("person").getList(1, 99999, {
        expand: "standort,abteilungen,telefonEintraege,telefonEintraege.eintragTyp,telefonEintraege.standort",
      }),
      pb.collection("ressource").getList(1, 99999, {
        expand: "standort,abteilungen,telefonEintraege,telefonEintraege.eintragTyp,telefonEintraege.standort",
      }),
    ])

    this.cacheData = [persons, ressources]

    console.log("Cache refresh took " + (Date.now() - starttime) + "ms")
  }
}

var dbCache = new dbCacheClass()
await dbCache.refreshCache()

export default dbCache
