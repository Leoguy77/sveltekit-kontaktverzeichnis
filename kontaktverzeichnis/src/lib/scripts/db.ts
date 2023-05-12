import PocketBase from "pocketbase"
import { building } from "$app/environment"

let pb: PocketBase = new PocketBase("")

if (!building) {
  pb = new PocketBase("http://pocketbase:8090")
  if (!process.env.APIUser || !process.env.APIPW) throw new Error("APIUser or APIPW not set")
  await pb.collection("users").authWithPassword(process.env.APIUser, process.env.APIPW)
  pb.autoCancellation(false)
  console.log("DB loaded")
}

export default pb
