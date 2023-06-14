import sql from "mssql"
import type { config } from "mssql"
// import { building } from "$app/environment"

console.log("process.env.NODE_ENV", process.env.NODE_ENV)
console.log("hiii")

if (process.env.NODE_ENV != "production") {
  const { fileURLToPath } = await import("url")
  const path = await import("path")
  const __filename = fileURLToPath(import.meta.url)
  const dotenv = await import("dotenv")
  const envLocation = path.join(__filename, "./../../../../../.env")
  dotenv.config({ path: envLocation })
  console.log(envLocation)
}

var config: config = {
  server: process.env.DB_SERVER || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_PW || "",
  database: process.env.DB_Name || "",
  port: Number(process.env.DB_Port) || 0,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
}
const db = await sql.connect(config)
export default db
