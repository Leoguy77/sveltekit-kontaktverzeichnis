import PocketBase from "pocketbase"

const pb = new PocketBase("http://pocketbase:8090")
await pb.collection("users").authWithPassword("api", "yourPassword")
console.log("DB loaded")

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

let res = await getFull("person")
console.log(res.length)
