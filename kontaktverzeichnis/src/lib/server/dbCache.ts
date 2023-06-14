import type { Record } from "pocketbase"
import pb from "./db.ts"
import { building } from "$app/environment"

async function getFull(tableName: string) {
  if (building) {
    return []
  }

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
    return this.cacheData.entities
  }

  getDepartments() {
    return this.cacheData.departments
  }

  async refreshCache(): Promise<void> {
    if (this.refreshing) return
    this.refreshing = true

    let starttime = Date.now()

    // Entities, Departments
    let [persons, ressources, departments] = await Promise.all([getFull("person"), getFull("ressource"), getFull("abteilung")])
    this.cacheData.entities = [persons, ressources]

    // Departments
    for (let department of departments) {
      department.count = 0
    }
    let entries = persons.concat(ressources)

    for (let entry of entries) {
      let abteilungenIDs = entry.abteilungen
      for (let abteilung of abteilungenIDs) {
        let index = departments.findIndex((a) => a.id === abteilung)
        if (index !== -1) {
          departments[index].count++
        }
      }
    }

    this.cacheData.departments = departments

    this.refreshing = false
    console.log("Cache refresh took " + (Date.now() - starttime) + "ms")
  }
}

var dbCache = new dbCacheClass()

export default dbCache
