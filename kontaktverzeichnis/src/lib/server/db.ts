import PocketBase from "pocketbase"
import { building } from "$app/environment"
import { APIPW, APIUser, SERVER } from "$env/static/private"

let pb: PocketBase = new PocketBase("")

if (!building) {
  if (!APIUser || !APIPW) throw new Error("APIUser or APIPW not set")
  pb = new PocketBase(`http://${SERVER}`)
  await pb.collection("users").authWithPassword(APIUser, APIPW)
  pb.autoCancellation(false)
  console.log("DB loaded")
}

export default pb
