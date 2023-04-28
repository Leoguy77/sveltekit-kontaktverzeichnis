import PocketBase from "pocketbase"
import { getDotEnv } from "./env.ts"

let env: any = getDotEnv()

const pb = new PocketBase("http://127.0.0.1:8090")
await pb.collection("users").authWithPassword(env.parsed.APIUser, env.parsed.APIPW)
pb.autoCancellation(false)
console.log("DB loaded")

export default pb
