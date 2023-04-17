import pb from "./db.js"

import { caching } from "cache-manager"

const Cache = await caching("memory", {
  max: 100,
  ttl: 10 * 1000 /*milliseconds*/,
})

async function Query() {
  let data = Cache.get("data")
  if (data == null) {
    let [persons, ressources] = await Promise.all([
      pb.collection("person").getList(1, 99999, {
        expand: "standort,abteilungen,telefonEintraege,telefonEintraege.eintragTyp,telefonEintraege.standort",
      }),
      pb.collection("ressource").getList(1, 99999, {
        expand: "standort,abteilungen,telefonEintraege,telefonEintraege.eintragTyp,telefonEintraege.standort",
      }),
    ])
    Cache.Set("data", { persons, ressources })
  }
  return data
}

export default Query
