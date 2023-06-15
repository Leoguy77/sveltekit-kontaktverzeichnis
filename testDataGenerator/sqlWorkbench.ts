import sql from "mssql"
import db from "../kontaktverzeichnis/src/lib/server/db.js"
import fs from "fs"

let request = new sql.Request(db)

let query = fs.readFileSync("./query.sql", "utf8")

console.table((await request.query(query)).recordset)

db.close()
