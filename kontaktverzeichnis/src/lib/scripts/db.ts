import PocketBase from "pocketbase"
import { getDotEnv } from "./env.js"

let env: any = getDotEnv()

const pb = new PocketBase("http://127.0.0.1:8090")
await pb.collection("users").authWithPassword(env.parsed.APIUser, env.parsed.APIPW)
console.log("DB loaded")

export default pb
